import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionDto {
    @ApiProperty({
        description: '类型',
        example: '王者荣耀',
        required: true,
      })
    type:String
    @ApiProperty({
      description: '标题',
      example: '世界上最长的河?',
      required: true,

    })
    title: String
    @ApiProperty({
      description: '选项',
      example: `['长江','黄河']`,
      required: true,
    })
    choose:any
    @ApiProperty({
      description: '正确答案',
      example: `长江`,
      required: true,
    })
    answer: String
}

export class CreateManyQuestionDto{
  @ApiProperty({
    description: '批量插入',
    example:[
        {
          "title":"1",
          "type":"1",
          "choose":["1","2"],
          "answer":"1"
        }
      ],
    required: true,
  })
  questions:any
}