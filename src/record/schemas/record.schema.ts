import * as mongoose from 'mongoose';

export const RecordSchema = new mongoose.Schema({
   number:Number,
   content:String,
   userId:String
});