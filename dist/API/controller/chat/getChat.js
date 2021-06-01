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
const chatmessages_1 = __importDefault(require("../../../models/chatmessages"));
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.body.id;
    const { page, skip, limit } = req.body;
    const roomId = req.params.roomId;
    console.log(userId, page, skip, limit, roomId);
    try {
        let result = null;
        if (page >= 0 && skip >= 0 && limit >= 0) {
            result = yield chatmessages_1.default.getMessagesByRoomId(roomId, userId, { page, skip, limit });
        }
        else {
            result = yield chatmessages_1.default.getMessagesByRoomId(roomId, userId);
        }
        console.log(result);
        if (result) {
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                yield chatmessages_1.default.updateReadBy(roomId, userId);
            }), 1);
            res.json({ message: '채팅 불러오기에 성공했습니다.', data: result });
        }
        else {
            res.json({ message: '채팅 불러오기에 실패했습니다.' });
        }
    }
    catch (err) {
        res.status(500).json({ message: '서버 응답에 실패했습니다.' });
    }
});
