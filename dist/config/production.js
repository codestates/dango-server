"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
process.env.NODE_ENV = process.env.NODE_ENV || "production";
const envFound = dotenv_1.default.config({ path: __dirname + '/./../../.env' });
if (envFound.error) {
    // This error should crash whole process
    throw new Error("check src/config/index.ts");
}
exports.default = {
    port: parseInt(process.env.PROD_PORT),
    databaseURL: process.env.PROD_MONGO_URI,
    clientURL: process.env.PROD_DEFAULT_URL,
    kakaoAdminKey: process.env.PROD_KAKAO_ADMIN_KEY,
    kakaoRestAPIKey: process.env.PROD_KAKAO_REST_APIKEY,
    redirectURI: process.env.PROD_REDIRECT_URI,
    defaultImage: process.env.PROD_DEFAULT_USER_IMAGE,
    googleSecret: process.env.PROD_GOOGLE_SECRET,
    googleClientKey: process.env.PROD_GOOGLE_CLIENT_ID,
    bucketRegion: process.env.PROD_AWS_BUCKET_REGION,
    bucketKeyId: process.env.PROD_AWS_ACCESS_KEY_ID,
    bucketAccessKey: process.env.PROD_AWS_SECRET_ACCESS_KEY,
    bucketName: process.env.PROD_AWS_BUCKET_NAME
};
