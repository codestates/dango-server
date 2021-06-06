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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("./loaders/mongoose"));
const index_1 = __importDefault(require("./API/routes/index"));
const app = express_1.default();
// app.use()
require('./loaders/express').default({ app });
// mongoose
mongoose_1.default().then(() => {
    console.log('database connected');
});
// route
app.use('/chats', index_1.default.chats);
app.use('/talents', index_1.default.talents);
app.use('/users', index_1.default.users);
app.use('/images', index_1.default.images);
app.get('/', (req, res) => {
    res.send({ message: 'hello ngrok!' });
});
const user_1 = __importDefault(require("./models/user"));
app.get('/test', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.time('test');
    // const b = await MessageModel.updateReadBy('888a1fd92535469e82c7938d8aa7feb0', "60b899f9fe40231d9bf6c08c");
    const b = yield user_1.default.getchatRoomsByUserId("60ba5a9633dbe13a7f41d301");
    // const b = await MessageModel.aggregate([{ $match: { roomId: "33b62e0574984010b0dafeb868f4e033" } }]);
    // const b = await UserModel.getTalents("60b0c38a16391c2718926987")
    // const b = await TalentModel.updateOne(
    //   { _id: talentId },
    //   { $push: { reviews: newReview }, $inc: { 'rating.0': rating, 'rating.1': 1 } },
    // );
    // const b = await MessageModel.getMessagesByRoomId('6aaeef4efdb04be59934ec0c541eb3a9', '60ba1f1961bc5cff11f47f61');
    // const b = await MessageModel.createPost("6aaeef4efdb04be59934ec0c541eb3a9", '123', "60ba1f1961bc5cff11f47f61")
    console.timeEnd('test');
    // res.json({ message: 'success', data: a });
    res.json({ message: 'success', data: b });
}));
// ---------------------------------TEST ENDPOINT---------------------------------- //
// ---------------------------------TEST ENDPOINT---------------------------------- //
// 404
app.use('*', (req, res) => {
    return res.status(404).json({
        success: false,
        message: 'API endpoint doesnt exist',
    });
});
exports.default = app;
