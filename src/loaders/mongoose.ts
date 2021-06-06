import mongoose from 'mongoose';
import { Db } from 'mongodb';
import config from '../config/key';
import UserModel from '../models/user';
import TalentModel from '../models/talents';

export default async (): Promise<Db> => {
  const connection = await mongoose.connect(config.databaseURL!, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  return connection.connection.db;
};
