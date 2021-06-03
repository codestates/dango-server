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
const coordinates_1 = __importDefault(require("../../../utils/coordinates"));
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const [S, N] = req.body.width;
    const [lat, lon] = req.body.location; // 쿼리 보낼땐 반대로
    const categorys = req.body.category || [''];
    const sort = req.body.sort;
    const finalSort = sort === 'price' ? 'price' : sort === 'ratings' ? '-ratings.0' : '-ratings.1' || 'location';
    const width = coordinates_1.default([S, N]);
    try {
        const previewsArr = yield talents_1.default.find({
            location: {
                $near: {
                    $geometry: { type: 'Point', coordinates: [lon, lat] },
                    $minDistance: 0,
                    $maxDistance: width / 2,
                },
            },
        })
            .find({
            $or: categorys.sort().map((category) => {
                if (!category)
                    return {};
                return { category };
            }),
        })
            .populate({ path: 'userInfo', select: 'nickname' })
            // .select('location ratings category title price')
            .select('-__v -reviews -images ')
            // .sort(`${finalSort}`)
            .lean();
        const sortedArr = sort === 'price'
            ? previewsArr.sort((a, b) => b.price - a.price)
            : sort === 'ratings'
                ? previewsArr.sort((a, b) => {
                    const A = a.ratings[0] === 0 ? 0 : a.ratings[0] / a.ratings[1];
                    const B = b.ratings[0] === 0 ? 0 : b.ratings[0] / b.ratings[1];
                    return B - A;
                })
                : sort === 'review'
                    ? previewsArr.sort((a, b) => b.ratings[1] - a.ratings[1])
                    : previewsArr;
        const changeRatings = sortedArr.reduce((result, preview) => {
            if (preview.userInfo.nickname === '탈퇴한 유저') {
                return result;
            }
            return [
                ...result,
                Object.assign(Object.assign({}, preview), { ratings: [preview.ratings[0] === 0 ? 0 : preview.ratings[0] / preview.ratings[1], preview.ratings[1]] }),
            ];
        }, []);
        res.json({ result: changeRatings, message: '주변 데이터 불러오기에 성공했습니다.' });
    }
    catch (err) {
        console.log(err);
        res.json({ message: '서버 응답에 실패했습니다.' });
    }
});
