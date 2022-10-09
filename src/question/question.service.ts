import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from './interfaces/questions.interface';
interface randomDto{
  num:string
  type:string
}
@Injectable()
export class QuestionService {
  constructor(@InjectModel('Question') private readonly QuestionModel: Model<Question>) {}
  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const createdQuestion = new this.QuestionModel(createQuestionDto);
    return await createdQuestion.save();
  }
  async bulkCreate(array: Question[]){
    return await this.QuestionModel.insertMany(array)

    
  }
  async  random(params:randomDto) {
    const number = parseInt(params.num || '1');
    return await this.QuestionModel.aggregate([{
      $match:{
        type: params.type
      }
    }]).sample(number);
    // count({type:params.type}).exec(async  (err, count) =>{

    //   // Get a random entry
    //   var random = Math.floor(Math.random() * count)
    
    //   // Again query all this.QuestionModels but only fetch one offset by our random #
    //   const data =await this.QuestionModel.findOne({type:params.type}).skip(random).exec() 
    //   console.info(data,'data')
    //   return data; 
    // })
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
