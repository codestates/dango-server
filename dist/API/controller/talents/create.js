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
    const reqData = req.body;
    try {
        // 스키마에 맞게 구조 변경
        const talent = Object.assign(Object.assign({}, reqData), { userInfo: reqData.userId, location: reqData.location.reverse() });
        delete talent.userId;
        // 저장 시작
        const talentDoc = new talents_1.default(talent);
        const result = yield talentDoc.save();
        if (result) {
            // 저장 된 경우 해당 글을 작성한 유저의 selling배열에 talentId 푸쉬
            const usersResult = yield user_1.default.findOneAndUpdate({ _id: result.userInfo }, { $push: { selling: result._id } }).select('_id').lean();
            if (usersResult) {
                // 성공
                res.json({ message: '재능 등록에 성공했습니다.', talentId: usersResult._id });
            }
            else {
                // 푸쉬에 실패한 경우 저장했던 talent document 지운다.
                const deleteResult = yield talents_1.default.deleteOne({ _id: result._id });
                res.status(500).json({ message: '데이터 저장에 실패했습니다.' });
            }
        }
        else {
            res.status(500).json({ message: '데이터 저장에 실패했습니다.' });
        }
    }
    catch (err) {
        winston_1.default.debug(`${__dirname} talents/create err message :: ${err.message}`);
        res.status(500).json({ message: '서버 응답에 실패했습니다.' });
    }
});
