import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    userId:String,
    name:String,
    avatar:String
});