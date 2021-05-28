import { User } from './../@types/index.d';
import { Schema, model, Types } from 'mongoose';
import { IUserDocument, IUserModel } from '../@types/userModel';

const schema: Schema<IUserDocument> = new Schema({
  nickname: { type: String, required: true, unique: true },
  socialData: {
    id: { type: Schema.Types.Mixed, required: false, unique: true },
    social: { type: String, required: true },
    name: { type: String, required: false },
    email: { type: String, required: false },
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
    // 메세지에 confirmed 누가했는지 추가
    console.log('userid', userId);
    const result = await this.aggregate([
      { $match: { _id: Types.ObjectId(userId) } },
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
        $project: {
          _id: {
            $toString: '$_id',
          },
          talks: '$talks',
          users: { $arrayElemAt: ['$chatRoomUsers.users', 0] },
          count: '$count.readBy',
        },
      },
      {
        $project: {
          _id: '$_id',
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
    console.log(err);
  }
};

schema.statics.getTalents = async function (userId: string) {
  try {
    return await this.aggregate([
      {
        $match: { _id: Types.ObjectId(userId) },
      },
      {
        $project: {
          reg: 1,
          unreviewed: 1,
          reviewed: 1,
          selling: 1,
        },
      },
      {
        $project: {
          dat: {
            $function: {
              body: function (u: string[], r: string[], s: string[], reg: string) {
                const arr1 = ['unreviewed', 'reviewed', 'selling'];
                const arr2 = [u, r, s];
                return arr2.reduce((acc: any[], cur: string[], idx: number): any[] => {
                  return [
                    ...acc,
                    ...cur.map((el) => {
                      return {
                        type: arr1[idx],
                        talentId: el,
                        reg,
                      };
                    }),
                  ];
                }, []);
              },
              args: ['$unreviewed', '$reviewed', '$selling', '$reg'],
              lang: 'js',
            },
          },
        },
      },
      { $unwind: '$dat' },
      {
        $lookup: {
          let: { talentObjId: { $toObjectId: '$dat.talentId' } },
          from: 'talents',
          pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$talentObjId'] } } }],
          as: 'talent',
        },
      },
      {
        $project: {
          _id: '$dat.talentId',
          type: '$dat.type',
          talent: {
            title: 1,
            address: 1,
            category: 1,
            price: 1,
            reviews: {
              _id: 1,
              rating: 1,
            },
          },
        },
      },
    ]);
  } catch (err) {
    console.log(err);
  }
};

const UserModel = model<IUserDocument, IUserModel>('users', schema);

export default UserModel;
