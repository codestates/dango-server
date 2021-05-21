import { IMessageModel, IMessageDocument, MessageOptions } from './../@types/models.d';
import { Schema, model } from 'mongoose';
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
  options = { page: 0, limit: 5, skip: 0 },
) {
  try {
    return this.aggregate([
      { $sort: { createdAt: -1 } },
      { $skip: options.page * options.limit + options.skip },
      { $limit: options.limit },
      { $match: { roomId } },
      {
        $set: {
          userId: userId,
        },
      },
      {
        $lookup: {
          let: { userObjId: { $toObjectId: '$postedBy' } },
          from: 'users',
          pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$userObjId'] } } }],
          as: 'postedBy',
        },
      },
      {
        $addFields: {
          postedBy: {
            $function: {
              body: function (postedBy: any) {
                const a = postedBy[0];
                return {
                  _id: a._id,
                  nickname: a.nickname,
                  image: a.socialData.image,
                };
              },
              args: ['$postedBy'],
              lang: 'js',
            },
          },
          isRead: {
            $function: {
              body: function (readBy: any[], userId: string) {
                if (readBy.find((readByArr: any) => readByArr.readUser === userId)) {
                  return true;
                }
                return false;
              },
              args: ['$readBy', '$userId'],
              lang: 'js',
            },
          },
        },
      },
      { $unset: ['__v', 'updatedAt', 'roomId', 'readBy', 'userId'] },
      { $sort: { createdAt: 1 } },
      // { $unwind: '$postedBy' },
    ]);
  } catch (err) {
    console.log(err);
  }
};

messageSchema.statics.updateReadBy = async function (roomId: string, userId: string) {
  try {
    await this.updateMany(
      {
        roomId,
        'readBy.readUser': { $ne: userId },
      },
      { $addToSet: { readBy: { readUser: userId } } },// 오류는 뜨지만 된다?
    );
  } catch (err) {
    console.log(err);
  }
};

messageSchema.statics.createPost = async function (roomId: string, message: string, postedBy: string) {
  try {
    // 저장
    const result = await this.create({
      roomId,
      message,
      postedBy,
      readBy: { readUser: postedBy },
    });
    console.log(result);
    delete result.return;
  } catch (err) {
    console.log(err);
  }
};

const MessageModel = model<IMessageDocument, IMessageModel>('messages', messageSchema);
// const ReadByModel = model<ReadBy>('chatrooms', readbySchema); : 도큐먼트에 저장 안함?
export default MessageModel;
