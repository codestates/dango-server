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
const user_1 = __importDefault(require("../../../models/user"));
const winston_1 = __importDefault(require("../../../log/winston"));
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { talentId, userId, replyDescription, reviewId, replyDate } = req.body;
    try {
        const validUser = yield user_1.default.find({ _id: userId, selling: talentId }).select('nickname _id').lean();
        if (validUser.length > 0) {
            const newReply = {
                replyDescription,
                replyDate,
            };
            const saveReply = yield talents_1.default.findOneAndUpdate({ _id: talentId, 'reviews.reviewId': reviewId }, { $set: { 'reviews.$.reply': newReply } });
            res.json({ message: '답글 등록에 성공했습니다.' });
        }
        else {
            res.status(404).json({ message: '유효하지 않은 유저입니다.' });
        }
    }
    catch (err) {
        winston_1.default.debug(`${__dirname} talents/reply err message :: ${err.message}`);
        winston_1.default;
        res.status(500).json({ message: '서버 응답에 실패했습니다.' });
    }
});
