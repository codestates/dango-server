import mongoose from 'mongoose';
import { Db } from 'mongodb';
import config from '../config/key';
import UserModel from '../models/user';
import TalentModel from '../models/talents';
import { fakeTalent, fakeUser } from '../common/fakeData/models';

export default async (): Promise<Db> => {
  const connection = await mongoose.connect(config.databaseURL!, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });

  const userdoc = new UserModel(fakeUser);
  const talentdoc = new TalentModel(fakeTalent);

  // 테스트 데이터 생성시 아래 주석을 풀어주세요.
  // 이제 create 요청으로 테스트데이터 만들 수 있습니다.
  // await userdoc.save();
  // await talentdoc.save();
  return connection.connection.db;
};
