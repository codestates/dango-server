import { User } from './index.d';
import mongoose, { Schema, Document, Model } from 'mongoose';


// methods
export interface IUserDocument extends User, Document {}

// statics
export interface IUserModel extends Model<IUserDocument> {
  getchatRoomsByUserId: (userId:string) => Promise<IUserDocument>;
}
