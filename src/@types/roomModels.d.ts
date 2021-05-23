import { ChatRoom } from './index';
import mongoose, { Schema, Document, Model } from 'mongoose';


// methods
export interface IChatRoomDocument extends ChatRoom, Document {}

// statics
export interface IchatRoomModel extends Model<IChatRoomDocument> {
  generateChatRooms: (userId:string, otherId:string, talentId:string) => Promise<IchatRoomDocument>;
}
