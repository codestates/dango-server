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
const key_1 = __importDefault(require("../../../config/key"));
const winston_1 = __importDefault(require("../../../log/winston"));
const user_1 = __importDefault(require("../../../models/user"));
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const nickname = req.body.nickname;
    try {
        const data = yield user_1.default.updateOne({ nickname: nickname }, {
            $set: {
                nickname: '탈퇴한 유저',
                'socialData.id': Date.now(),
                'socialData.name': '알수 없음',
                'socialData.email': '',
                'socialData.image': key_1.default.defaultImage,
            },
        });
        if (data.nModified > 0) {
            res.send({ message: '회원 탈퇴에 성공했습니다.' });
        }
        else {
            res.status(404).send({ message: '미가입된 회원입니다.' });
        }
    }
    catch (err) {
        winston_1.default.debug(`${__dirname} users/withdraw err message :: ${err.message}`);
        res.status(500).send({ message: '서버응답에 실패했습니다.' });
    }
});
// 닉네임
