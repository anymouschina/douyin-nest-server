import { WebSocketGateway, SubscribeMessage, MessageBody , ConnectedSocket,AbstractWsAdapter} from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { CreateSocketDto } from './dto/create-socket.dto';
import { UpdateSocketDto } from './dto/update-socket.dto';
import {MessageBodyType} from './interfaces/socket.interface'
import { QuestionService } from 'src/question/question.service';
import { str2obj } from '../utils/index'
import * as WebSocket from 'ws';
const child_process = require('child_process')
const path = require('path')
const room2user = {

}
const roomActive = {

}
const userActive = {

}
const options = {
  cors: {
    origin: '*',
    methods: ["GET", "POST"],
    credentials: true
  }
}
@WebSocketGateway(3001,{ cors:{
  allowedHeaders:'*',
  origin:'*'
} })
export class SocketGateway {
  constructor(private readonly socketService: SocketService,private readonly QuestionService:QuestionService) {
  }
  handleConnection (client) {
    console.info('client连接',client.id)
    userActive[client.id] = true;
  }
  handleDisconnect (client) {
    userActive[client.id] = false;
    console.info('client断开',client.id)
  }
  //指定python弹幕爬虫使用
  @SubscribeMessage('danmu') 
  socketTest(client,data:any) {
    client.broadcast.emit('danmu', data);
    const myData = JSON.parse(data)
    const obj = {} as any;
    console.info(myData.user,'??user')
    myData.user = myData.user.split('\n')
    myData.user.map(item=>{
      if(str2obj(item)){
        const [key, value ] = str2obj(item);
        if(key){
          const realKey = key.trim(),realValue = value.trim().replace(/"/g,'');
          if(obj[realKey]){
            obj[realKey+'_copy'] = realValue
          }else{
            obj[realKey] = realValue
          }
        } 
      }
      return item
    })
    if(obj.urlList){
      obj.avatar = obj.urlList; // 取第一个值
    }
    const [nickname,content] = myData.content.split(': ')
    obj.nickname = nickname;
    obj.content = content;
    obj['live-room'] = myData['live-room'][0];
    roomActive[obj['live-room']] = true;
    const clientId = room2user[obj['live-room']]
    if(userActive[clientId]){
      client.broadcast.to(clientId).emit('message', obj)
    }else{
      roomActive[obj['live-room']] = false;
    }
    console.info('data',obj)
    return  { }
  }
  //创建爬虫子进程
  @SubscribeMessage('createDouyin')
  socketTestConnect(@MessageBody() data: any, @ConnectedSocket() client: WebSocket) {
    const query = client.handshake.query
    const pyScriptPath = path.join(__dirname,'../../src/douyin_web_live/main.py')
    const webDriverPath = path.join(__dirname,'../../src/douyin_web_live/chromedriver/chromedriver.exe')
    room2user[query.url] = client.id
    const pro = child_process.spawn('python',[pyScriptPath , query.url, webDriverPath]);
    const fn = () =>{
      setTimeout(()=>{
         if(!roomActive[query.url]){
          console.info('尝试断开')
          pro.kill()
         }else{
          roomActive[query.url] = false;
          fn()
         }
      },1000 * 10) // 10s 无最新消息就断开
    }
    fn()
    roomActive[query.url] = true;
    pro.stdout.on('data', function(data) {
      console.log('使用spawn方法输出: ' + data);
      });
    
    pro.stderr.on('data', function(data) {
          console.log('stderr: ' + data);
    });
    pro.on('kill', function(code) {
      console.log('child process exited with code ' + code);
    });
    pro.on('close', function(code) {
          console.log('child process exited with code ' + code);
    });
    pro.on('error',function(err){
      console.info('child process has error',err)
    })
    pro.on('disconnect',function(err){
      console.info('child process has disconnect',err)
    })
  }


  @SubscribeMessage('createSocket')
  create(@MessageBody() createSocketDto: CreateSocketDto) {
    console.info(createSocketDto,'ccccc')
    return this.socketService.create(createSocketDto);
  }

  @SubscribeMessage('findAllSocket')
  findAll() {
    return this.socketService.findAll();
  }

  @SubscribeMessage('findOneSocket')
  findOne(@MessageBody() id: number) {
    return this.socketService.findOne(id);
  }

  @SubscribeMessage('updateSocket')
  update(@MessageBody() updateSocketDto: UpdateSocketDto) {
    return this.socketService.update(updateSocketDto.id, updateSocketDto);
  }

  @SubscribeMessage('removeSocket')
  remove(@MessageBody() id: number) {
    return this.socketService.remove(id);
  }
}
