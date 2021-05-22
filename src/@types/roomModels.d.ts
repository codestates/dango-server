import { ChatRoom } from './index';
import mongoose, { Schema, Document, Model } from 'mongoose';

// export interface chatRoomOptions {
//   page:number;
//   limit:number;
//   skip:number;
// }

// methods
export interface IChatRoomDocument extends ChatRoom, Document {
}

// statics
export interface IchatRoomModel extends Model<IChatRoomDocument> {
  getchatRoomsByUserId: (userId: string) => Promise<IchatRoomDocument>;
}
