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
exports.default = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const imgUrlArr = [];
    try {
        Array.prototype.forEach.call(req.files, (file) => {
            imgUrlArr.push(file.location);
        });
        if (imgUrlArr.length > 0) {
            res.json({ message: '이미지 등록에 성공했습니다.', data: imgUrlArr });
        }
        else {
            res.status(404).json({ message: '이미지 등록에 실패했습니다.' });
        }
    }
    catch (err) {
        winston_1.default.debug(`${__dirname} images/upload err message :: ${err.message}`);
        res.status(500).json({ message: '서버 응답에 실패했습니다.' });
    }
});
