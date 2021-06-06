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
const user_1 = __importDefault(require("../../../models/user"));
const chatmessages_1 = __importDefault(require("../../../models/chatmessages"));
const chatrooms_1 = __importDefault(require("../../../models/chatrooms"));
const winston_1 = __importDefault(require("../../../log/winston"));
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, otherId, chatRoomId } = req.body;
    try {
        // 채팅방, 채팅목록은 두명 다 나간 상태일 때 지운다.
        // 한명만 나간 경우 deleteUserTalks 하나만 실행
        // 한명만 나간 경우 메세지를 보내도 디비에 저장은 되지만, 상대방한테 메세지가 가면 안됨.................
        // 마지막에 하자
        /**
         * 채팅방 유저가 한명인지 두명인지 확인해야됨.
         * 두명인 경우
         *      => 나간사람이 구매자이면 구매자의 buying에서 지우고 talks에서 지운다.
         *      => 나간사람이 판매자이면 talks에서만 지운다
         * 한명인 경우
         *      => 남은 한명이 구매자이면 구매자의 buying에서 지우고 talks에서 지운다. 이후 방이랑 채팅 모두 지운다.
         *      => 남은 한명이 판매자이면 talks에서만 지운다.
         */
        const buyerId = yield chatrooms_1.default.findOne({ _id: chatRoomId }).select('initiator talentId').lean();
        if (!buyerId) {
            res.status(401).json({ message: '유효하지 않은 접근입니다.' });
        }
        else if (buyerId.initiator === userId) {
            // 신청한 사람이 구매자인 경우
            const isOther = yield user_1.default.findOne({ _id: otherId, talks: chatRoomId }).select('_id').lean();
            if (isOther) {
                // 두명인 경우
                const deleteBuyer = yield user_1.default.updateOne({ _id: userId }, { $pull: { talks: chatRoomId, buying: { _id: buyerId.talentId } } });
                if (deleteBuyer.nModified > 0) {
                    res.json({ message: '방 나가기에 성공했습니다.' });
                }
                else {
                    res.status(500).json({ message: '방 나가기에 실패했습니다.' });
                }
            }
            else {
                // 한명인 경우
                const deleteBuyerAll = user_1.default.updateOne({ _id: userId }, { $pull: { talks: chatRoomId, buying: { _id: buyerId.talentId } } });
                const deleteChatRoom = chatrooms_1.default.deleteOne({ _id: chatRoomId });
                const deleteChats = chatmessages_1.default.deleteMany({ roomId: chatRoomId });
                const deleteResult = yield Promise.all([deleteBuyerAll, deleteChatRoom, deleteChats]);
                if (deleteResult) {
                    res.json({ message: '방 나가기에 성공했습니다.' });
                }
                else {
                    res.status(500).json({ message: '방 나가기에 실패했습니다.' });
                }
            }
        }
        else if (buyerId.initiator !== userId) {
            // 신청한 사람이 판매자인 경우
            const isOther = yield user_1.default.findOne({ _id: otherId, talks: chatRoomId }).select('_id').lean();
            if (isOther) {
                // 두명인 경우
                const deleteSeller = yield user_1.default.updateOne({ _id: userId }, { $pull: { talks: chatRoomId } });
                if (deleteSeller.nModified > 0) {
                    res.json({ message: '방 나가기에 성공했습니다.' });
                }
                else {
                    res.status(500).json({ message: '방 나가기에 실패했습니다.' });
                }
            }
            else {
                // 한명인 경우
                const deleteSellerAll = user_1.default.updateOne({ _id: userId }, { $pull: { talks: chatRoomId } });
                const deleteChatRoom = chatrooms_1.default.deleteOne({ _id: chatRoomId });
                const deleteChats = chatmessages_1.default.deleteMany({ roomId: chatRoomId });
                const deleteResult = yield Promise.all([deleteSellerAll, deleteChatRoom, deleteChats]);
                if (deleteResult) {
                    res.json({ message: '방 나가기에 성공했습니다.' });
                }
                else {
                    res.status(500).json({ message: '방 나가기에 실패했습니다.' });
                }
            }
        }
    }
    catch (err) {
        winston_1.default.debug(`${__dirname} chats/endChat err message :: ${err.message}`);
        res.status(500).json({ message: '서버 응답에 실패했습니다.' });
    }
});
