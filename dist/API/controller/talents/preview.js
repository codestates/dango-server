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
const talents_1 = __importDefault(require("../../../models/talents"));
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const oid = req.params.talentId;
    try {
        const result = yield talents_1.default.findOne({ _id: oid }).select('-__v -images -reviews -userInfo').lean();
        if (result) {
            res.json(result);
        }
        else {
            res.status(404).json({ message: '재능 정보를 찾을 수 없습니다.' });
        }
    }
    catch (err) {
        if (err.name === 'CastError') {
            res.status(404).json({ message: '유효하지 않은 id 입니다' });
        }
        else {
            res.status(500).json({ message: '서버응답에 실패했습니다' });
        }
    }
});
// 위치, 카테고리, 닉네임,  별점 평균, 가격, 글 제목, 글 내용, 지역
