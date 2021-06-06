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
const winston_1 = __importDefault(require("../../../log/winston"));
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const oid = req.params.talentId;
    try {
        const result = yield talents_1.default.findOne({ _id: oid })
            .populate({ path: 'userInfo reviews._id', select: 'nickname socialData' })
            .select('-__v')
            .lean();
        if (result) {
            delete result.userInfo.socialData.id;
            delete result.userInfo.socialData.social;
            const newReviews = result.reviews.map((el) => {
                const data = el._id;
                const { _id, nickname, socialData: { email, image }, } = el._id;
                return Object.assign(Object.assign({}, el), { _id, socialData: { email, image } });
            });
            res.json(Object.assign(Object.assign({}, result), { images: result.images.map((url) => {
                    return url.replace('original', 'small');
                }), reviews: newReviews, ratings: [result.ratings[0] === 0 ? 0 : result.ratings[0] / result.ratings[1], result.ratings[1]] }));
        }
        else {
            res.status(404).json({ message: '재능 정보를 찾을 수 없습니다.' });
        }
    }
    catch (err) {
        winston_1.default.debug(`${__dirname} talents/detail err message :: ${err.message}`);
        if (err.name === 'CastError') {
            res.status(404).json({ message: '유효하지 않은 id 입니다' });
        }
        else {
            res.status(500).json({ message: '서버응답에 실패했습니다' });
        }
    }
});
