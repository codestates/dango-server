import { User } from './../@types/index.d';
import { Schema, model, Types } from 'mongoose';
import { IUserDocument, IUserModel } from '../@types/userModel';

const schema: Schema<IUserDocument> = new Schema({
  nickname: { type: String, required: true, unique: true },
  socialData: {
    id: { type: Number, required: false, unique: true },
    social: { type: String, required: true },
    name: { type: String, required: false },
    email: { type: String, required: false, unique: true },
    image: { type: String, required: false },
  },
  selling: { type: [String], default: [] },
  buying: [
    {
      _id: String,
      confirmed: [String],
    },
  ],
  unreviewed: { type: [String], default: [] },
  reviewed: { type: [String], default: [] },
  talks: { type: [String], default: [] },
});

schema.statics.getchatRoomsByUserId = async function (userId: string) {
  try {
    // 방이랑 상대방 유저Id랑 몇개 안읽었는지 확인 핗요


    // TODO : 거래중 상태인지 확인 필요
    // 내가 거래완료를 눌렀는지, 상대방이 거래완료를 눌렀는지, :::: 메세지의 타입을 confirmed로 해서 채팅에 추가

    const result = await this.aggregate([
      { $match: { _id: Types.ObjectId(userId) } },
      { $set: { _id: userId } },
      {
        $unwind: '$talks',
      },
      {
        $lookup: {
          from: 'chatrooms',
          localField: 'talks',
          foreignField: '_id',
          as: 'chatRoomUsers',
        },
      },
      {
        $lookup: {
          from: 'messages',
          localField: 'talks',
          foreignField: 'roomId',
          as: 'count',
        },
      },
      {
        $replaceWith: {
          _id: '$_id',
          talks: '$talks',
          users: { $arrayElemAt: ['$chatRoomUsers.users', 0] },
          count: '$count.readBy',
        },
      },
      {
        $project: {
          roomId: '$talks',
          other: {
            $function: {
              body: function (usersArr: string[], userId: string) {
                if (!usersArr) return null;
                return usersArr.filter((user) => user !== userId)[0];
              },
              args: ['$users', '$_id'],
              lang: 'js',
            },
          },
          // count: '$count',
          count: {
            $function: {
              body: function (countArr: any[], userId: string) {
                if (countArr.length === 0) return 0;
                return countArr.reduce((acc: number, cur: any[]) => {
                  let isRead = false;
                  cur.forEach((el: any) => {
                    if (el.readUser === userId) isRead = true;
                  });
                  return isRead ? acc : acc + 1;
                }, 0);
              },
              args: ['$count', '$_id'],
              lang: 'js',
            },
          },
        },
      },
      {
        $replaceWith: {
          roomId: '$roomId',
          other: '$other',
          count: '$count',
        },
      },
    ]);
    return result;
  } catch (err) {
    console.log(err)
  }
};

const UserModel = model<IUserDocument, IUserModel>('users', schema);

export default UserModel;
