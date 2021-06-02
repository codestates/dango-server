"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const uuid_1 = require("uuid");
const readbySchema = new mongoose_1.Schema({
    _id: false,
    readUser: { type: String, required: false },
    readAt: { type: Date, required: true, default: Date.now() },
}, {
    timestamps: false,
});
const messageSchema = new mongoose_1.Schema({
    _id: {
        type: String,
        default: () => uuid_1.v4().replace(/\-/g, ''),
    },
    roomId: String,
    message: mongoose_1.Schema.Types.Mixed,
    type: {
        type: String,
        default: 'text',
    },
    postedBy: String,
    readBy: [readbySchema],
}, {
    timestamps: true,
});
messageSchema.statics.getMessagesByRoomId = function (roomId, userId, options = { page: 0, limit: 10, skip: 0 }) {
    return __awaiter(this, void 0, void 0, function* () {
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
        }
        catch (err) {
            console.log(err);
        }
    });
};
// Need $push Test 
messageSchema.statics.updateReadBy = function (roomId, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield this.updateOne({
                roomId,
                'readBy.readUser': { $ne: userId },
            }, { $push: { readBy: { readUser: userId } } });
        }
        catch (err) {
            console.log(err);
        }
    });
};
messageSchema.statics.createPost = function (roomId, message, postedBy, confirm, isStart) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // 저장
            const createdResult = yield this.create({
                roomId,
                message: isStart ? '거래가 시작됐습니다.' : message,
                type: confirm ? 'confirm' : isStart ? 'start' : 'text',
                postedBy,
                readBy: { readUser: postedBy },
            });
            if (createdResult) {
                const findWithPostedBy = yield this.aggregate([
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
        }
        catch (err) {
            console.log(err);
        }
    });
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
const MessageModel = mongoose_1.model('messages', messageSchema);
// const ReadByModel = model<ReadBy>('chatrooms', readbySchema); : 도큐먼트에 저장 안함?
exports.default = MessageModel;