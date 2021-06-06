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
const winston_1 = __importDefault(require("../../../../log/winston"));
const user_1 = __importDefault(require("../../../../models/user"));
const google_1 = __importDefault(require("../../../../service/google"));
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const IdToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    try {
        // IdToken으로 유저정보 가져온다.
        const userData = yield google_1.default.getGoogleProfile(IdToken);
        if (userData) {
            const result = yield user_1.default.findOne({ 'socialData.id': userData.sub });
            if (result) {
                const { social, email, image } = result.socialData;
                const chatRooms = (yield user_1.default.getchatRoomsByUserId(result._id)) || null;
                res.send({
                    message: '로그인에 성공했습니다.',
                    _id: result._id,
                    socialData: {
                        social,
                        email,
                        image,
                    },
                    chatRooms,
                    selling: result.selling,
                    buying: result.buying.map((el) => el && el._id),
                    unreviewed: result.unreviewed,
                    reviewed: result.reviewed.map(el => el && el._id),
                    nickname: result.nickname,
                });
            }
            else {
                res.status(404).send({ message: '등록된 회원이 아닙니다.' });
            }
        }
        else {
            res.status(401).send({ message: '유효하지 않은 토큰입니다.' });
        }
    }
    catch (err) {
        winston_1.default.debug(`${__dirname} google/signin err message :: ${err.message}`);
        res.status(500).send({ message: '서버 응답에 실패했습니다.' });
    }
});
