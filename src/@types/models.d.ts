import { Message, ChatRoom } from './index.d';
import mongoose, {Schema, Document, Model} from 'mongoose';

export interface MessageOptions {
  page:number;
  limit:number;
  skip:number;
}

// methods
export interface IMessageDocument extends Message, Document {
}

// statics
export interface IMessageModel extends Model<IMessageDocument> {
  getMessagesByRoomId:(chatRoomId:string,userId:string, options?:MessageOptions={}) => Promise<IMessageDocument>
  updateReadBy:(chatroomId:string, userId:string)=>void
  createPost:(roomId:string, message:string, postedBy:string) => Promise<IMessageDocument>
}