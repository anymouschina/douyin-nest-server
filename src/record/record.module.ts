import { Module } from '@nestjs/common';
import { RecordService } from './record.service';
import { RecordController } from './record.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { RecordSchema } from './schemas/record.schema';
@Module({
  imports:[MongooseModule.forFeature([{ name: 'Record', schema: RecordSchema }])],
  controllers: [RecordController],
  providers: [RecordService],
  exports:[RecordService]
})
export class RecordModule {}
