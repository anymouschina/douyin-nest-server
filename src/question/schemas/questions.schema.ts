import * as mongoose from 'mongoose';

export const QuestionSchema = new mongoose.Schema({
  title: String,
  choose:Array,
  answer: String,
  type:String
});