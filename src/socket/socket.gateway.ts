import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { SocketService } from './socket.service';
import { CreateSocketDto } from './dto/create-socket.dto';
import { UpdateSocketDto } from './dto/update-socket.dto';
import {MessageBodyType} from './interfaces/socket.interface'
import { QuestionService } from 'src/question/question.service';

@WebSocketGateway(3001,{ cors: true })
export class SocketGateway {
  constructor(private readonly socketService: SocketService,private readonly QuestionService:QuestionService) {}

  @SubscribeMessage('danmu')
  socketTest(client,data:MessageBodyType) {
    client.broadcast.emit('danmu', data);
    console.info(this.QuestionService,'this')

    // setInterval(()=>{
    //   client.emit('hehe', data);

    // },1000)
    console.info(data,'data')
    return  { }
  }
  @SubscribeMessage('createSocket')
  create(@MessageBody() createSocketDto: CreateSocketDto) {
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
