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
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, otherId, chatRoomId } = req.body;
    try {
        // 채팅방, 채팅목록은 두명 다 나간 상태일 때 지운다.
        // 한명만 나간 경우 deleteUserTalks 하나만 실행
        // 한명만 나간 경우 메세지를 보내도 디비에 저장은 되지만, 상대방한테 메세지가 가면 안됨.................
        // 마지막에 하자
        const deleteUser1Talks = user_1.default.updateOne({ _id: userId }, { $pull: { talks: chatRoomId } });
        const deleteUser2Talks = user_1.default.updateOne({ _id: otherId }, { $pull: { talks: chatRoomId } });
        const deleteChatRoom = chatrooms_1.default.deleteOne({ _id: chatRoomId });
        const deleteChats = chatmessages_1.default.deleteMany({ roomId: chatRoomId });
        const deleteResult = yield Promise.all([deleteUser1Talks, deleteUser2Talks, deleteChatRoom, deleteChats]);
        res.send({ message: '채팅방 나가기에 성공했습니다. 거래가 종료되었습니다.' });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: '서버 응답에 실패했습니다.' });
    }
});
