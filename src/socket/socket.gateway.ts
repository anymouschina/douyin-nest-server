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
@WebSocketGateway(3001,{ cors: true })
export class SocketGateway {
  constructor(private readonly socketService: SocketService,private readonly QuestionService:QuestionService) {
  }
  handleConnection (client) {
    console.info('client连接',client)
    userActive[client.id] = true;
  }
  handleDisconnect (client) {
    userActive[client.id] = false;
    console.info('client断开',client)
  }
  //指定python弹幕爬虫使用
  @SubscribeMessage('danmu') 
  socketTest(client,data:any) {
    client.broadcast.emit('danmu', data);
    const myData = JSON.parse(data)
    const obj = {} as any;
    myData.user = myData.user.split('\n')
    myData.user.map(item=>{
      if(str2obj(item)){
        const [key, value ] = str2obj(item);
        if(key){
          obj[key.trim()] = value.trim().replace(/"/g,'');
        } 
      }
      return item
    })
    const [nickname,content] = myData.content.split(': ')
    obj.nickname = nickname;
    obj.content = content;
    obj['live-room'] = myData['live-room'];
    roomActive[myData['live-room'][0]] = true;
    console.info(client,'client???',room2user)
    client.broadcast.to(room2user[myData['live-room'][0]]).emit('message', obj)
    console.info('data',obj)
    return  { }
  }
  //创建爬虫子进程
  @SubscribeMessage('createDouyin')
  socketTestConnect(@MessageBody() data: any, @ConnectedSocket() client: WebSocket) {
    const query = client.handshake.query
    const pyScriptPath = path.join(__dirname,'../../src/douyin_web_live/main.py')
    console.info(query,'query',client)
    room2user[query.url] = client.id
    const pro = child_process.spawn('python',[pyScriptPath , query.url]);
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
