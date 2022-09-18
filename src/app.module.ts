import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './socket/socket.module';
import { QuestionModule } from './question/question.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { RecordModule } from './record/record.module';

@Module({
  imports: [SocketModule, QuestionModule,MongooseModule.forRoot('mongodb://127.0.0.1:27017/nest'), UserModule, RecordModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
