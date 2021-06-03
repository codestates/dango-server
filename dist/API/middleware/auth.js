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
const user_1 = __importDefault(require("../../models/user"));
const google_1 = __importDefault(require("../../service/google"));
const kakao_1 = __importDefault(require("../../service/kakao"));
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (token.length > 100) {
        const data = yield google_1.default.getGoogleProfile(token);
        if (data) {
            const isInDB = yield user_1.default.findOne({ 'socialData.id': data.sub });
            if (isInDB) {
                next();
            }
            else {
                res.status(401).json({ message: '등록된 회원이 아닙니다.' });
            }
        }
        else {
            res.status(404).json({ message: '유효하지 않은 토큰입니다.' });
        }
    }
    else {
        const data = yield kakao_1.default.getUserInfo(token);
        if (data) {
            const isInDB = yield user_1.default.findOne({ 'socialData.id': data.id });
            if (isInDB) {
                next();
            }
            else {
                res.status(401).json({ message: '등록된 회원이 아닙니다.' });
            }
        }
        else {
            res.status(404).json({ message: '유효하지 않은 토큰입니다.' });
        }
    }
});
