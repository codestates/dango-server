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
const user_1 = __importDefault(require("../../../../models/user"));
const kakao_1 = __importDefault(require("../../../../service/kakao"));
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const accessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    try {
        // 유저정보 받아오고
        const data = yield kakao_1.default.getUserInfo(accessToken);
        // DB에 id가 있는지 확인
        const result = yield user_1.default.findOne({ 'socialData.id': data.id });
        // 데이터가 있으면 토큰과 닉네임 보내준다.
        if (result) {
            const { social, email, image } = result.socialData;
            const chatRooms = (yield user_1.default.getchatRoomsByUserId(result._id)) || null;
            res.send({
                message: '로그인에 성공했습니다.',
                accessToken,
                _id: result._id,
                socialData: {
                    social,
                    email,
                    image,
                },
                chatRooms,
                selling: result.selling,
                buying: result.buying.map(el => el && el._id),
                unreviewed: result.unreviewed,
                reviewed: result.reviewed.map(el => el && el._id),
                nickname: result.nickname,
            });
        }
        else {
            res.status(404).send({ message: '회원정보가 없습니다.' });
        }
    }
    catch (err) {
        res.status(500).send({ message: '서버응답에 실패했습니다.' });
    }
});
