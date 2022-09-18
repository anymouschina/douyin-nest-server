import { Injectable } from '@nestjs/common';
import { CreateRecordDto } from './dto/create-record.dto';
import { UpdateRecordDto } from './dto/update-record.dto';
import { Record } from './interfaces/record.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class RecordService {
  constructor(@InjectModel('Record') private readonly RecordModel: Model<Record>) {}
  async create(createRecordDto: CreateRecordDto): Promise<Record> {
    const createdRecord = new this.RecordModel(createRecordDto);
    return await createdRecord.save();
  }
  async bulkCreate(array: Record[]){
     console.info(array,'array')
    //execute those operations
    return await this.RecordModel.insertMany(array)

  }
  findAll() {
    return `This action returns all record`;
  }

  findOne(id: number) {
    return `This action returns a #${id} record`;
  }

  update(id: number, updateRecordDto: UpdateRecordDto) {
    return `This action updates a #${id} record`;
  }

  remove(id: number) {
    return `This action removes a #${id} record`;
  }
}
