import { User } from './index.d';
import mongoose, { Schema, Document, Model } from 'mongoose';

// methods
export interface IUserDocument extends User, Document { }

// statics
export interface IUserModel extends Model<IUserDocument> {
  getchatRoomsByUserId: (userId: string) => Promise<any>;
  getTalents: (userId: string) => Promise<any>;
}

// others

export interface IBuyingArr {
  confirmed: string[];
  _id: string;
}
