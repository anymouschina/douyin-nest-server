import { WebSocketGateway, SubscribeMessage, MessageBody , ConnectedSocket,AbstractWsAdapter} from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { CreateSocketDto } from './dto/create-socket.dto';
import { UpdateSocketDto } from './dto/update-socket.dto';
import {MessageBodyType} from './interfaces/socket.interface'
import { QuestionService } from 'src/question/question.service';
import { str2obj } from '../utils/index'
import * as WebSocket from 'ws';
import { sendTrans } from 'src/utils/translate';
import { isCode } from './../utils/translate';
const child_process = require('child_process')
const path = require('path')
const CHAT_TYPE = 'chat'
const room2user = {

}
const roomActive = {

}
const userActive = {

}
const userNeedTranslate = {
  
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
    const query = client.handshake.query
    console.info('query连接',query)
    if(query.needTranslate){
        console.info('需要翻译',query)

      userNeedTranslate[client.id] = true;
    }
  }
  handleDisconnect (client) {
    userActive[client.id] = false;
    console.info('client断开',client.id)
  }
  //指定python弹幕爬虫使用
  @SubscribeMessage('danmu') 
  async socketTest(client,data:any) {
    /**
     * data.type 消息类型 
     * chat : 弹幕
     * gift : 礼物
     * like : 点赞
     * error: 直播间异常
     * fansclub : 加入粉丝团
     * member: 用户进入直播间
     * social ： 关注
     * total ： 直播间人数统计
     */
    client.broadcast.emit('danmu', data);
    console.info(data,'data')
    const myData = JSON.parse(data)
    const obj = {
      ...myData,
      type:myData.type
    } as any;
    myData.user = myData.user.split('\n')
    myData.user.map(item=>{
      if(str2obj(item)){
        const [key, value ] = str2obj(item);
        if(key){
          const realKey = key.trim(),realValue = value.trim().replace(/"/g,'');
          if(obj[realKey] && typeof obj[realKey] !== 'object'){
            obj[realKey] = [obj[realKey],realValue]
          }else if(typeof obj[realKey] === 'object'){
            obj[realKey].push(realValue)
          }else{
            obj[realKey] = realValue
          }
        } 
      }
      return item
    })
    if(obj.urlList){
      if(typeof obj.urlList === 'object'){
        const avatar = obj.urlList.find((i:string)=>i.indexOf('avatar')>-1)
        if(avatar)obj.avatar = avatar
      }
        obj.avatar = obj.urlList; // 取第3个值
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
    console.info(obj.type,CHAT_TYPE,userNeedTranslate[clientId],'?userNeedTranslate[clientId]')
    const {
      isPrompt,
      prompt,
      isNprompt,
      nprompt
    } = isCode(obj.content);
    if(obj.type === CHAT_TYPE && userNeedTranslate[clientId] && (isPrompt || isNprompt)){

      const content = await sendTrans(prompt || nprompt) as any;
      obj.content = content.TargetText;
      obj.isPrompt = prompt;
      obj.isNPrompt = nprompt;
      client.broadcast.to(clientId).emit('cn2en', obj)
    }
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
      },1000 * 30) // 10s 无最新消息就断开
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
