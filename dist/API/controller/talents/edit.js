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
const winston_1 = __importDefault(require("../../../log/winston"));
const talents_1 = __importDefault(require("../../../models/talents"));
const user_1 = __importDefault(require("../../../models/user"));
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, talentId, description, price, category, title } = req.body;
    try {
        // 유효한 유저인지 확인 :::::::: 
        // userId와 talentId로 판매자인지 확인
        // 판매자이면  데이터 변경
        const seller = yield user_1.default.findOne({ _id: userId, selling: talentId }).select('userId').lean();
        if (seller) {
            // 판매자임
            const result = yield talents_1.default.findOneAndUpdate({ _id: talentId }, { $set: { description, price, category, title } }, { new: true })
                .select('description price category title')
                .lean();
            res.json({ message: '재능 수정에 성공했습니다.', data: result });
        }
        else {
            res.status(401).json({ message: '유효하지 않은 유저입니다.' });
        }
    }
    catch (err) {
        winston_1.default.debug(`${__dirname} talents/edit err message :: ${err.message}`);
        res.status(500).json({ message: '서버 응답에 실패했습니다.' });
    }
});
//description, price, category, title
