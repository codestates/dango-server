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
const kakao_1 = __importDefault(require("../../../../service/kakao"));
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const accessToken = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    try {
        const result = yield kakao_1.default.signOut(accessToken);
        if (result) {
            res.send({ message: '로그아웃에 성공했습니다.' });
        }
        else {
            res.status(401).send({ message: "유효하지 않은 토큰입니다." });
        }
    }
    catch (err) {
        winston_1.default.debug(`${__dirname} kakao/signout err message :: ${err.message}`);
        res.status(500).send({ message: '서버응답에 실패했습니다.' });
    }
});
