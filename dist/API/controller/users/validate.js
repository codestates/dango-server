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
const google_1 = __importDefault(require("../../../service/google"));
const kakao_1 = __importDefault(require("../../../service/kakao"));
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { social } = req.body;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    try {
        if (social === 'google') {
            const googleUserInfo = yield google_1.default.getGoogleProfile(token);
            if (googleUserInfo) {
                const dbData = yield user_1.default.findOne({ 'socialData.id': googleUserInfo.sub }).select('_id').lean();
                if (dbData) {
                    res.json({ message: '유효한 유저입니다.' });
                }
            }
            else {
                res.status(401).send({ message: '유효하지 않은 토큰입니다.' });
            }
        }
        else if (social === 'kakao') {
            const kakaoResult = yield kakao_1.default.validate(token);
            if (kakaoResult) {
                const dbData = yield user_1.default.findOne({ 'socialData.id': kakaoResult.id }).select('_id').lean();
                if (dbData) {
                    res.json({ message: '유효한 유저입니다.' });
                }
            }
            else {
                res.status(401).send({ message: '유효하지 않은 토큰입니다.' });
            }
        }
    }
    catch (err) {
        res.status(500).send({ message: '서버응답에 실패했습니다.' });
    }
});
