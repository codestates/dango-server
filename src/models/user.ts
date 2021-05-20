import { User } from './../@types/index.d';
import { Schema, model } from 'mongoose';

const schema = new Schema<User>({
  nickname: { type: String, required: true, unique: true },
  socialData: {
    id: { type: Number, required: false, unique: true },
    social: { type: String, required: true },
    name: { type: String, required: false },
    email: { type: String, required: false, unique: true },
    image: { type: String, required: false },
  },
  selling: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'talents',
        required: false,
        _id: false,
      },
    ],
    required: false,
  },
  bought: {
    type: [
      {
        type: Schema.Types.ObjectId,
        ref: 'talents',
        required: false,
        _id: false,
      },
    ],
    required: false,
  },
  // talks:{
  //   type: [
  //     {
  //       type: Schema.Types.ObjectId,
  //       ref: 'talents',
  //       required: false,
  //       _id: false,
  //     },
  //   ],
  //   required: false,
  // }
});

const UserModel = model<User>('users', schema);

export default UserModel;
