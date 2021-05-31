import { IMessageModel, IMessageDocument, MessageOptions } from '../@types/messageModels';
import { Schema, model, Types } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { ReadBy } from './../@types/index.d';

const readbySchema = new Schema<ReadBy>(
  {
    _id: false,
    readUser: { type: String, required: false },
    readAt: { type: Date, required: true, default: Date.now() },
  },
  {
    timestamps: false,
  },
);

const messageSchema: Schema<IMessageDocument> = new Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ''),
    },
    roomId: String,
    message: Schema.Types.Mixed,
    type: {
      type: String,
      default: 'text',
    },
    postedBy: String,
    readBy: [readbySchema],
  },
  {
    timestamps: true,
  },
);

messageSchema.statics.getMessagesByRoomId = async function (
  roomId: string,
  userId: string,
  options = { page: 0, limit: 10, skip: 0 },
) {
  try {
    // 나중에 유저id로 방 있는지 유효성체크
    return this.aggregate([
      { $sort: { createdAt: -1 } },
      { $match: { roomId } },
      {
        $lookup: {
          let: { userObjId: { $toObjectId: '$postedBy' } },
          from: 'users',
          pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$userObjId'] } } }],
          as: 'postedBy',
        },
      },
      // {
      //   $addFields: {
      //     postedBy: {
      //       $function: {
      //         body: function (postedBy: any) {
      //           return {
      //             _id: postedBy[0]._id,
      //             nickname: postedBy[0].nickname,
      //             image: postedBy[0].socialData.image,
      //           };
      //         },
      //         args: ['$postedBy'],
      //         lang: 'js',
      //       },
      //     },
      //     isRead: {
      //       $function: {
      //         body: function (readBy: any[], userId: string) {
      //           if (readBy.find((readByArr: any) => readByArr.readUser === userId)) {
      //             return true;
      //           }
      //           return false;
      //         },
      //         args: ['$readBy', '$userId'],
      //         lang: 'js',
      //       },
      //     },
      //   },
      // },
      //
      {
        $replaceWith: {
          _id: '$_id',
          type: '$type',
          message: '$message',
          createdAt: '$createdAt',
          postedBy: {
            _id: { $arrayElemAt: ['$postedBy._id', 0] },
            nickname: { $arrayElemAt: ['$postedBy.nickname', 0] },
            image: { $arrayElemAt: ['$postedBy.socialData.image', 0] },
          },
        },
      },
      { $skip: options.page * options.limit + options.skip },
      { $limit: options.limit },
      { $sort: { createdAt: 1 } },
    ]);
  } catch (err) {
    console.log(err);
  }
};

messageSchema.statics.updateReadBy = async function (roomId: string, userId: string) {
  try {
    return await this.updateMany(
      {
        roomId,
        'readBy.readUser': { $ne: userId },
      },
      { $addToSet: { readBy: { readUser: userId } } }, // 오류는 뜨지만 된다?
    );
  } catch (err) {
    console.log(err);
  }
};

messageSchema.statics.createPost = async function (
  roomId: string,
  message: string,
  postedBy: string,
  confirm?: boolean,
  isStart?: boolean,
) {
  try {
    // 저장

    const createdResult = await this.create({
      roomId,
      message: isStart ? '거래가 시작됐습니다.' : message,
      type: confirm ? 'confirm' : isStart ? 'start' : 'text',
      postedBy,
      readBy: { readUser: postedBy },
    });
    if (createdResult) {
      const findWithPostedBy = await this.aggregate([
        { $sort: { createdAt: -1 } },
        { $limit: 1 },
        { $match: { _id: createdResult._id } },
        {
          $lookup: {
            let: { userObjId: { $toObjectId: '$postedBy' } },
            from: 'users',
            pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$userObjId'] } } }],
            as: 'postedBy',
          },
        },
        {
          $replaceWith: {
            _id: '$_id',
            type: '$type',
            message: '$message',
            createdAt: '$createdAt',
            postedBy: {
              _id: { $arrayElemAt: ['$postedBy._id', 0] },
              nickname: { $arrayElemAt: ['$postedBy.nickname', 0] },
              image: { $arrayElemAt: ['$postedBy.socialData.image', 0] },
            },
          },
        },
      ]);
      return findWithPostedBy[0];
    }
  } catch (err) {
    console.log(err);
  }
};
/*
{
  _id: 'a4dc151a4bb44733a9699b60c7e54e4b',
  type: 'text',
  message: '2203',
  createdAt: '2021-05-22T11:58:57.235Z',
  postedBy: {
    _id: '609ec5a42b6cd4396e5d2bcf',
    nickname: 'SYH',
    image: 'https://placeimg.com/120/120/people/grayscale',
  },
};
*/
const MessageModel = model<IMessageDocument, IMessageModel>('messages', messageSchema);
// const ReadByModel = model<ReadBy>('chatrooms', readbySchema); : 도큐먼트에 저장 안함?
export default MessageModel;
