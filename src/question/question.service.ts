import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from './interfaces/questions.interface';
@Injectable()
export class QuestionService {
  constructor(@InjectModel('Question') private readonly QuestionModel: Model<Question>) {}
  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const createdQuestion = new this.QuestionModel(createQuestionDto);
    return await createdQuestion.save();
  }
  async bulkCreate(array: Question[]){
     console.info(array,'array')
    //execute those operations
    return await this.QuestionModel.insertMany(array)

    
  }
  async  random(params:CreateQuestionDto) {
    return this.QuestionModel.count().exec(async function (err, count) {

      // Get a random entry
      var random = Math.floor(Math.random() * count)
    
      // Again query all this.QuestionModels but only fetch one offset by our random #
      return await this.QuestionModel.findOne().skip(random).exec()
    })
  }
  async findAll(): Promise<Question[]> {
    return await this.QuestionModel.find().exec();
  }

  findOne(id: number) {
    return `This action returns a #${id} question`;
  }

  update(id: number, updateQuestionDto: UpdateQuestionDto) {
    return `This action updates a #${id} question`;
  }

  remove(id: number) {
    return `This action removes a #${id} question`;
  }
}
