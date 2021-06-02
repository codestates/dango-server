"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
const envFound = dotenv_1.default.config({ path: __dirname + '/./../../.env' });
if (envFound.error) {
    // This error should crash whole process
    throw new Error('check src/config/index.ts');
}
exports.default = {
    port: parseInt(process.env.PORT),
    databaseURL: process.env.MONGO_URI,
    clientURL: process.env.DEFAULT_URL,
    kakaoAdminKey: process.env.KAKAO_ADMIN_KEY,
    kakaoRestAPIKey: process.env.KAKAO_REST_APIKEY,
    redirectURI: process.env.REDIRECT_URI,
    defaultImage: process.env.DEFAULT_USER_IMAGE,
    googleSecret: process.env.GOOGLE_SECRET,
    googleClientKey: process.env.GOOGLE_CLIENT_ID,
    bucketRegion: process.env.AWS_BUCKET_REGION,
    bucketKeyId: process.env.AWS_ACCESS_KEY_ID,
    bucketAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    bucketName: process.env.AWS_BUCKET_NAME
};
