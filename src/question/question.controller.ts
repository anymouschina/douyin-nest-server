import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Res , HttpStatus } from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { Question } from './interfaces/questions.interface';
import { ApiTags,ApiParam,ApiBody,ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';
@ApiTags('问题')
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post()
  create(@Body() createQuestionDto: CreateQuestionDto) {
    return this.questionService.create(createQuestionDto);
  }
  @Post('insertMany')
  @ApiBody({type:Array})
  insertMany(@Body() Questions:{
    questions:Question[]
  }) {
    return this.questionService.bulkCreate(Questions.questions);
  }

  @Get('randomByType')
  @ApiQuery({ name: 'type',
              description: '类型',
              example: '王者荣耀',
              required: false, }) 
  @ApiQuery({ name: 'num',
  description: '返回得数据数量',
  example: 1,
  required: false, }) 
  randomByType(@Query('type') type:string, @Query('num') num){
    return this.questionService.random({type:type,num})
  }
  @Get()
  findAll() {
    return this.questionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    console.info(id,'id')
    return this.questionService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto) {
    return this.questionService.update(+id, updateQuestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.questionService.remove(+id);
  }
}
