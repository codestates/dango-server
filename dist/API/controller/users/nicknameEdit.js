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
    const { userId, nickname } = req.body;
    try {
        const newUser = yield user_1.default.updateOne({ _id: userId }, { $set: { nickname } });
        if (newUser.nModified > 0) {
            res.json({ message: '닉네임 변경에 성공했습니다.', nickname });
        }
        else {
            res.status(406).send({ message: '동일한 닉네임입니다.' });
        }
    }
    catch (err) {
        if (err.code === 11000) {
            res.status(406).json({ message: '이미 존재하는 닉네임입니다.' });
        }
        else {
            res.status(500).json({ message: '서버 응답에 실패했습니다.' });
        }
    }
});
