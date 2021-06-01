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
const chatrooms_1 = __importDefault(require("../../../models/chatrooms"));
const chatmessages_1 = __importDefault(require("../../../models/chatmessages"));
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { talentId, userId, chatroomId } = req.body;
    let buyerId = null;
    try {
        /**
         * userId의 selling에 talentid가 있는지 확인 :::
         * true? 구매자임
         * false? 판매자임
         * 구매자인 경우 buying의 목록들 중 talentid를 가지고 있는 목록을 찾아서 confirmed update
         *            채팅빙의 메세지에 type:confirmed 추가
         * 판매자인 경우 채팅방을 만든 id의 buying 목록의 talentid를 가진 confirmed 배열에 추가
         *            채팅빙의 메세지에 type:confirmed 추가
         * 그런데 confirmed배열에 이미 한명이 존재할 경우엔 거래를 끝내야 함
         * 이 경우 users의 buying의 talentid에 해당하는 목록을 삭제하고 그 아이디를 unreviewed에 추가해야 됨
         *
         */
        const isSeller = yield user_1.default.find({ _id: userId, selling: talentId }).select('nickname').lean();
        if (isSeller.length > 0) {
            // 판매자인 경우 구매자 아이디를 가져옴
            const id = yield chatrooms_1.default.find({ _id: chatroomId }).select('initiator').lean();
            buyerId = id[0].initiator;
        }
        else {
            buyerId = userId;
        }
        const updatedData = yield user_1.default.findOneAndUpdate({ _id: buyerId, 'buying._id': talentId }, {
            $addToSet: { 'buying.$.confirmed': userId },
        }, { new: true })
            .select('buying')
            .lean();
        if (updatedData && ((_a = updatedData.buying) === null || _a === void 0 ? void 0 : _a.length) > 0) {
            const buyingArr = updatedData.buying;
            if (buyingArr.find((list) => list._id === talentId).confirmed.length >= 2) {
                // 업데이트 된 결과가 모두 confirm한 경우이므로 buying에서 unreviewed로 이동
                const buyingToUnreviewed = yield user_1.default.findOneAndUpdate({ _id: buyerId }, {
                    $pull: {
                        buying: { _id: talentId },
                    },
                    $push: { unreviewed: talentId },
                }, { multi: true }).lean();
                // unreviewed로 이동하고 거래완료 메세지 표시
                const confirmedChat = yield chatmessages_1.default.createPost(chatroomId, '거래가 완료됐습니다.', userId, true);
                res.json({ message: '거래가 완료됐습니다.', confirmed: true, confirmedChat });
            }
            else {
                // confirm한 상대의 id를 채팅에 저장
                const confirmedChat = yield chatmessages_1.default.createPost(chatroomId, '거래 완료를 눌러주세요', userId, true);
                res.json({ message: '거래완료 요청에 성공했습니다.', confirmed: false, confirmedChat });
            }
        }
        else {
            res.status(500).json({ message: '서버 응답에 실패했습니다.' });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: '서버 응답에 실패했습니다.' });
    }
});
