"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const google_1 = __importDefault(require("./google"));
const kakao_1 = __importDefault(require("./kakao"));
const finishdeal_1 = __importDefault(require("../../controller/users/finishdeal"));
const validate_1 = __importDefault(require("../../controller/users/validate"));
const checkNickname_1 = __importDefault(require("../../controller/users/checkNickname"));
const nicknameEdit_1 = __importDefault(require("../../controller/users/nicknameEdit"));
const mypage_1 = __importDefault(require("../../controller/users/mypage"));
const chatroomInfo_1 = __importDefault(require("../../controller/users/chatroomInfo"));
const router = express_1.Router();
// router
router.use('/google', google_1.default);
router.use('/kakao', kakao_1.default);
// Rest
router.post('/confirm', finishdeal_1.default);
router.post('/validate', validate_1.default);
router.post('/doublecheck', checkNickname_1.default);
router.post('/edit', nicknameEdit_1.default);
router.get('/chatinfo/:userid', chatroomInfo_1.default);
router.get('/mypage/:userid', mypage_1.default);
exports.default = router;
