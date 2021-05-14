import { User } from './../@types/index.d';
import { Schema, model } from 'mongoose';

const schema = new Schema<User>({
  nickname: { type: String, required: true, unique: true },
  socialData: {
    id: { type: Number, required: false, unique: true },
    type: { type: String, required: true },
    name: { type: String, required: false },
    email: { type: String, required: false, unique: true },
    image: { type: String, required: false },
  },
  selling: { type: [String], required: false },
  bought: { type: [String], required: false },
});

const UserModel = model<User>('users', schema);

export default UserModel;
