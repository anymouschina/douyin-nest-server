import { ApiProperty } from '@nestjs/swagger';

export class CreateQuestionDto {
    @ApiProperty({
        description: '类型',
        example: '王者荣耀',
        required: false,
      })
    type:String
}
