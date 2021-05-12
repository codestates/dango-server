import dotenv from "dotenv";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const envFound = dotenv.config();

if (envFound.error) {
  // This error should crash whole process

  throw new Error("check src/config/index.ts");
}

export default {
  port: parseInt(process.env.PORT!),
  databaseURL: process.env.MONGO_URI,
};
