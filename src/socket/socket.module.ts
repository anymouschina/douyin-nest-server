import { Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { SocketGateway } from './socket.gateway';
import { QuestionModule } from 'src/question/question.module';
@Module({
  imports:[QuestionModule],
  providers: [SocketGateway, SocketService]
})
export class SocketModule {}
