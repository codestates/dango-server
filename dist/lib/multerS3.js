"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const key_1 = __importDefault(require("../config/key"));
// 파일 저장 위치
// s3 storage
aws_sdk_1.default.config.update({
    apiVersion: '2006-03-01',
    accessKeyId: key_1.default.bucketKeyId,
    secretAccessKey: key_1.default.bucketAccessKey,
    region: key_1.default.bucketRegion,
});
const s3 = new aws_sdk_1.default.S3({});
const storage = multer_s3_1.default({
    s3,
    bucket: `${key_1.default.bucketName}/image/original`,
    contentType: multer_s3_1.default.AUTO_CONTENT_TYPE,
});
// 파일 필터링
// validate with multer :: options :: [fieldNameSize, fieldSize, fields, fileSize, files, parts, headerPairs]
const limits = {
    fieldNameSize: 10,
    // fileSize: 5000,
};
// 커스텀 validate
function fileFilter(req, file, callback) {
    const validate = mimeTypeValidator(file.mimetype);
    if (validate) {
        callback(null, true);
    }
    else if (!validate) {
        callback(null, false);
    }
    else {
        callback(new Error('something wrong... please check multerMiddleware'));
    }
}
function mimeTypeValidator(type) {
    const typeRegEx = new RegExp(type.split('/')[1], 'g');
    const acceptableExtension = 'jpg,png,gif,bmp,jpeg,heic';
    const matchValue = acceptableExtension.match(typeRegEx);
    if (matchValue) {
        return true;
    }
    return false;
}
// 미들 웨어, 에러처리
const upload = multer_1.default({ fileFilter, storage, limits }).array('file', 3);
exports.default = upload;
