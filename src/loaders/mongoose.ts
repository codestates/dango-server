import mongoose from "mongoose";
import { Db } from "mongodb";
import config from "../config/index";
import UserModel from "../models/user";

export default async (): Promise<Db> => {
  const connection = await mongoose.connect(config.databaseURL!, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
  const userdoc = new UserModel({
    nickname:"TestUser",
    socialData:{
      id:1679231556,
      name:"username",
      email:"qwer@qwer.qw",
      image:"https://placeimg.com/120/120/people/grayscale"
    },
    selling:[],
    bought:[]
  })
  // db 생성시 아래 주석을 풀어주세요.
  // await userdoc.save();
  return connection.connection.db;
};
