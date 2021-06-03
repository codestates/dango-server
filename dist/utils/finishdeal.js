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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const chatrooms_1 = __importDefault(require("../models/chatrooms"));
const chatmessages_1 = __importDefault(require("../models/chatmessages"));
exports.default = (talentId, userId, chatroomId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let buyerId = null;
    try {
        const isSeller = yield user_1.default.find({ _id: userId, selling: talentId }).select('nickname').lean();
        if (isSeller.length > 0) {
            // 판매자인 경우 구매자 아이디를 가져옴
            const id = yield chatrooms_1.default.find({ _id: chatroomId }).select('initiator').lean();
            buyerId = id[0].initiator;
        }
        else {
            buyerId = userId;
        }
        const updatedData = yield user_1.default.findOneAndUpdate({ _id: buyerId, 'buying._id': talentId }, {
            $addToSet: { 'buying.$.confirmed': userId },
        }, { new: true })
            .select('buying')
            .lean();
        if (updatedData && ((_a = updatedData.buying) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            const buyingArr = updatedData.buying;
            if (buyingArr.find((list) => list._id === talentId).confirmed.length >= 2) {
                // 업데이트 된 결과가 모두 confirm한 경우이므로 buying에서 unreviewed로 이동
                const buyingToUnreviewed = yield user_1.default.findOneAndUpdate({ _id: buyerId }, {
                    $pull: {
                        buying: { _id: talentId },
                    },
                    $push: { unreviewed: talentId },
                }, { multi: true }).lean();
                // unreviewed로 이동하고 거래완료 메세지 표시
                return yield chatmessages_1.default.createPost(chatroomId, '거래가 완료됐습니다.', userId, true);
            }
            else {
                // confirm한 상대의 id를 채팅에 저장
                return yield chatmessages_1.default.createPost(chatroomId, '거래 완료를 눌러주세요.', userId, true);
            }
        }
    }
    catch (err) {
        console.log(err);
    }
});
