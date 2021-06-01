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
const chatrooms_1 = __importDefault(require("../../../models/chatrooms"));
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, otherId, talentId } = req.body;
    try {
        const roomId = yield chatrooms_1.default.generateChatRooms(userId, otherId, talentId);
        // 해당 방에는 메세지가 없는 상태
        // 채팅을 위해선 roomId 필요함
        // 나중에 메세지 불러올때도 roomId만 필요함
        res.json({ message: '방 생성에 성공했습니다.', roomId });
    }
    catch (err) {
        res.status(500).json({ message: '서버 응답에 실패했습니다.' });
    }
});
