import { Message } from './index.d';
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
  getMessagesByRoomId:(chatRoomId:string, options:MessageOptions={}) => Promise<IMessageDocument>
}