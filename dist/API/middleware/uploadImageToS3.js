"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multerS3_1 = __importDefault(require("../../lib/multerS3"));
const winston_1 = __importDefault(require("../../log/winston"));
exports.default = (req, res, next) => {
    try {
        multerS3_1.default(req, res, (err) => {
            if (err) {
                winston_1.default.debug(`${__dirname} multerMiddleware err message :: ${err.message}`);
                if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    res.status(400).json({ message: '사진 갯수가 초과됩니다' });
                }
                else if (err.code === 'LIMIT_FILE_SIZE') {
                    res.status(400).json({ message: '파일 크기가 초과됩니다.' });
                }
                else {
                    res.status(500).json({ message: '이미지 업로드에 실패했습니다.' });
                }
                return;
            }
            next();
        });
    }
    catch (err) {
        res.status(500).json({ message: '서버 응답에 실패했습니다.' });
    }
};
