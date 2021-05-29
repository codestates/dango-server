import dotenv from "dotenv";

process.env.NODE_ENV = process.env.NODE_ENV || "production";

const envFound = dotenv.config();

if (envFound.error) {
  // This error should crash whole process

  throw new Error("check src/config/index.ts");
}
export default {
  port: parseInt(process.env.PROD_PORT!),
  databaseURL: process.env.PROD_MONGO_URI,
  clientURL: process.env.PROD_DEFAULT_URL,
  kakaoAdminKey: process.env.PROD_KAKAO_ADMIN_KEY!,
  kakaoRestAPIKey: process.env.PROD_KAKAO_REST_APIKEY!,
  redirectURI: process.env.PROD_REDIRECT_URI!,
  defaultImage: process.env.PROD_DEFAULT_USER_IMAGE,
  googleSecret: process.env.PROD_GOOGLE_SECRET,
  googleClientKey: process.env.PROD_GOOGLE_CLIENT_ID,
};
