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
    const data = req.body;
    const { talentId, userId, review, rating, nickname, date } = data;
    try {
        /**
         * 유효한 유저인지 확인(unreviewed에 talentId 존재하는지 확인)
         * 유효한 유저이면 talent collection에 review등록
         * talent의 ratings 업데이트
         * userId의 unreviewed 의 talentid에 존재하는 talentid 삭제
         * reviewed 에 talentid 등록
         *
         * 이것들 체크하려면 앞의 메소드 먼저 작성해야겠다.
         */
        const validUser = yield user_1.default.findOne({ _id: userId, unreviewed: talentId }).select('unreviewed').lean();
        if (validUser) {
            const newReview = {
                _id: userId,
                nickname,
                rating,
                review,
                date,
            };
            const updatedResult = yield talents_1.default.findOneAndUpdate({ _id: talentId }, { $push: { reviews: newReview }, $inc: { 'ratings.0': rating, 'ratings.1': 1 } }, { new: true })
                .select('reviews')
                .lean();
            console.log('reviews', updatedResult);
            if (updatedResult) {
                const matchReview = updatedResult.reviews.find((el) => {
                    if (el._id.toString() === userId && el.nickname === nickname && el.rating === rating) {
                        return true;
                    }
                });
                console.log('matchReview', matchReview);
                if (matchReview) {
                    yield user_1.default.updateOne({ _id: userId }, {
                        $pull: {
                            unreviewed: talentId,
                        },
                        $push: {
                            reviewed: {
                                _id: talentId,
                                reviewId: matchReview.reviewId,
                            },
                        },
                    });
                    res.json({ message: '리뷰 쓰기에 성공했습니다.' });
                }
                else {
                    res.status(500).json({ message: '서버 응답에 실패했습니다.' });
                }
            }
            else {
                res.status(500).json({ message: '서버 응답에 실패했습니다.' });
            }
        }
        else {
            res.status(404).json({ message: '유효하지 않은 유저입니다.' });
        }
    }
    catch (err) {
        winston_1.default.debug(`${__dirname} talents/review err message :: ${err.message}`);
        res.status(500).json({ message: '서버 응답에 실패했습니다.' });
    }
});
/**
 * 탤런트별 리뷰 여러개 존재
 *
 */
