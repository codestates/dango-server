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
const mongoose_1 = __importDefault(require("mongoose"));
const key_1 = __importDefault(require("../config/key"));
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield mongoose_1.default.connect(key_1.default.databaseURL, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    });
    // const userdoc = new UserModel(fakeUser);
    // const talentdoc = new TalentModel(fakeTalent);
    // 테스트 데이터 생성시 아래 주석을 풀어주세요.
    // 이제 create 요청으로 테스트데이터 만들 수 있습니다.
    // await userdoc.save();
    // await talentdoc.save();
    return connection.connection.db;
});
