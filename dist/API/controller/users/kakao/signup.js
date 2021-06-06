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
const key_1 = __importDefault(require("../../../../config/key"));
const winston_1 = __importDefault(require("../../../../log/winston"));
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const accessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    const nickname = req.body.nickname;
    try {
        // 이미 로그인 요청을 통해 회원정보가 없다는 것이 확인된 상태
        // 먼저 nickname이 있는지 확인
        const result = yield user_1.default.findOne({ nickname: nickname });
        if (result) {
            res.status(409).send({ message: '이미 존재하는 닉네임 입니다.' });
        }
        else {
            // 카카오 정보요청
            const data = yield kakao_1.default.getUserInfo(accessToken);
            if (data) {
                const { id, kakao_account: { email }, } = data;
                const userInfo = {
                    nickname,
                    socialData: {
                        id,
                        social: 'kakao',
                        name: (_b = data.properties) === null || _b === void 0 ? void 0 : _b.nickname,
                        email: email,
                        image: ((_c = data.kakao_account.profile) === null || _c === void 0 ? void 0 : _c.thumbnail_image_url) || key_1.default.defaultImage,
                    },
                };
                const newUser = new user_1.default(userInfo);
                newUser.save((err, user) => __awaiter(void 0, void 0, void 0, function* () {
                    if (err) {
                        winston_1.default.debug(`${__dirname} kakao/signup err message :: ${err.message}`);
                        return res.status(404).json({ message: '유저정보 저장에 실패했습니다.' });
                    }
                    const chatRooms = (yield user_1.default.getchatRoomsByUserId(user._id)) || null;
                    res.send({
                        message: '회원가입에 성공했습니다.',
                        _id: user._id,
                        accessToken,
                        nickname,
                        socialData: {
                            social: 'kakao',
                            email: email,
                            image: key_1.default.defaultImage,
                        },
                        chatRooms,
                        selling: user.selling,
                        buying: user.buying.map((el) => el && el._id),
                        unreviewed: user.unreviewed,
                        reviewed: user.reviewed.map((el) => el && el._id),
                    });
                }));
            }
            else {
                res.status(401).send({ message: '유효하지 않은 토큰입니다.' });
            }
        }
    }
    catch (err) {
        winston_1.default.debug(`${__dirname} kakao/signup err message :: ${err.message}`);
        res.status(500).send({ message: '서버오류로 데이터를 불러오지 못했습니다.' });
    }
});
