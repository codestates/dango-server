import { User } from './../@types/index.d';
import { Schema, model, Types } from 'mongoose';
import { IBuyingArr, IUserDocument, IUserModel } from '../@types/userModel';

const schema: Schema<IUserDocument> = new Schema({
  nickname: { type: String, required: true },
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
  reviewed: [
    {
      _id: String,
      reviewId: String,
    },
  ],
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
          talks: 1,
          chatRoomUsers: 1,
          count: 1,
          buyerId: {
            $toObjectId: {
              $arrayElemAt: ['$chatRoomUsers.initiator', 0],
            },
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'buyerId',
          foreignField: '_id',
          as: 'buyerId',
        },
      },
      {
        $project: {
          _id: {
            $toString: '$_id',
          },
          talks: 1,
          buyerId: { $arrayElemAt: ['$buyerId', 0] },
          talentId: { $arrayElemAt: ['$chatRoomUsers.talentId', 0] },
          users: { $arrayElemAt: ['$chatRoomUsers.users', 0] },
          count: '$count.readBy',
        },
      },
      {
        $project: {
          _id: 1,
          talks: 1,
          users: 1,
          talentId: 1,
          buyerId: {
            _id: {
              $toString: '$buyerId._id',
            },
            buying: '$buyerId.buying',
          },
          count: 1,
        },
      },
      {
        $project: {
          _id: 1,
          roomId: '$talks',
          talentId: 1,
          clickPurchase: {
            $function: {
              body: function (buyingArr: IBuyingArr[], talentId: string, userId: string) {
                const confirmedArr = buyingArr.find((el) => el._id === talentId)?.confirmed;
                if (confirmedArr) {
                  return confirmedArr.length >= 2
                    ? [true, true]
                    : confirmedArr.length === 0
                      ? [false, false]
                      : confirmedArr.indexOf(userId) !== -1
                        ? [true, false]
                        : [false, false];
                } else {
                  return [true, true];
                }
              },
              args: ['$buyerId.buying', '$talentId', '$_id'],
              lang: 'js',
            },
          },
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
        $project: {
          _id: 0,
          roomId: 1,
          clickPurchase: 1,
          count: 1,
          talentId: 1,
          other: {
            $toObjectId: '$other',
          },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'other',
          foreignField: '_id',
          as: 'other',
        },
      },
      {
        $project: {
          roomId: 1,
          count: 1,
          talentId: 1,
          clickPurchase: 1,
          otherId: '$other._id',
          otherNickname: '$other.nickname',
          profileImage: '$other.socialData.image',
        },
      },
      {
        $project: {
          roomId: 1,
          talentId: 1,
          talks: 1,
          count: 1,
          clickPurchase: 1,
          otherId: { $arrayElemAt: ['$otherId', 0] },
          otherNickname: { $arrayElemAt: ['$otherNickname', 0] },
          profileImage: { $arrayElemAt: ['$profileImage', 0] },
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
          unreviewed: 1,
          selling: 1,
          reviewed: '$reviewed._id',
          myReviews: "$reviewed.reviewId"
        },
      },
      {
        $project: {
          myReviews: 1,
          dat: {
            $function: {
              body: function (u: string[], r: string[], s: string[]) {
                const arr1 = ['unreviewed', 'reviewed', 'selling'];
                const arr2 = [u, r, s];
                return arr2.reduce((acc: any[], cur: string[], idx: number): any[] => {
                  return [
                    ...acc,
                    ...cur.map((el) => {
                      return {
                        type: arr1[idx],
                        talentId: el,
                      };
                    }),
                  ];
                }, []);
              },
              args: ['$unreviewed', '$reviewed', '$selling'],
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
          myReviews: 1,
          type: '$dat.type',
          talent: {
            title: 1,
            address: 1,
            category: 1,
            price: 1,
            reviews: {
              _id: 1,
              reviewId: 1,
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
