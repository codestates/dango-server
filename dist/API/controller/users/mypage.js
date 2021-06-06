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
const winston_1 = __importDefault(require("../../../log/winston"));
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = req.params.userid;
    console.log(req.params.userId);
    try {
        const talentData = yield user_1.default.getTalents(userId);
        if (talentData) {
            let reviewIds = (_a = talentData[0]) === null || _a === void 0 ? void 0 : _a.myReviews;
            const devided = talentData.reduce((acc, cur) => {
                var _a;
                return Object.assign(Object.assign({}, acc), { [cur.type]: [
                        ...acc[cur.type],
                        Object.assign(Object.assign({}, cur.talent[0]), { _id: cur._id, reviews: (_a = cur.talent[0].reviews.find((el) => {
                                const idx = reviewIds.indexOf(el.reviewId);
                                if (idx !== -1) {
                                    reviewIds.splice(idx, 1);
                                    return true;
                                }
                            })) === null || _a === void 0 ? void 0 : _a.rating }),
                    ] });
            }, { unreviewed: [], reviewed: [], selling: [] });
            res.json({ message: '데이터 응답에 성공했습니다.', data: devided });
        }
        else {
            res.json({ m: '' });
        }
    }
    catch (err) {
        winston_1.default.debug(`${__dirname} users/mypage err message :: ${err.message}`);
        res.status(500).json({ message: '서버 응답에 실패했습니다.' });
    }
});
