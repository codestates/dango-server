import { User } from './../@types/index.d';
import { Schema, model } from 'mongoose';

const schema = new Schema<User>({
  nickname: { type: String, required: true },
  socialData: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: true },
  },
  selling: {type:[String], required:false},
  bought: {type:[String], required:false},
});

const userModel = model<User>('users', schema);

export default userModel;

