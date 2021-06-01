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
    const nickname = req.body.nickname;
    console.log(nickname);
    try {
        const data = yield user_1.default.deleteOne({ nickname: nickname });
        if (data.ok) {
            res.send({ message: '회원 탈퇴에 성공했습니다.' });
        }
        else {
            res.status(404).send({ message: '미가입된 회원입니다.' });
        }
    }
    catch (err) {
        res.status(500).send({ message: '서버응답에 실패했습니다.' });
    }
});
