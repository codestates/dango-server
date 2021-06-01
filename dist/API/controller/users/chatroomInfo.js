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
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userid;
    try {
        const chatRoomInfo = yield user_1.default.getchatRoomsByUserId(userId);
        if (chatRoomInfo && chatRoomInfo.length > 0) {
            res.json({ message: '채팅목록 불러오기에 성공했습니다.', chatrooms: chatRoomInfo });
        }
        else {
            res.status(404).json({ message: '불러올 채팅목록이 없습니다.' });
        }
    }
    catch (err) {
        res.status(500).send({ message: '서버응답에 실패했습니다.' });
    }
});
