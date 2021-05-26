import { Request, Response } from 'express';
import UserModel from '../../../models/user';

export default async (req: Request, res: Response) => {
  const { userId, nickname } = req.body;
  try {
    const newUser = await UserModel.updateOne({ _id: userId }, { $set: { nickname } });
    if (newUser.nModified > 0) {
      res.json({ message: '닉네임 변경에 성공했습니다.', nickname });
    } else {
      res.status(406).send({ message: '동일한 닉네임입니다.' });
    }
  } catch (err) {
    if (err.code === 11000) {
      res.status(406).json({ message: '이미 존재하는 닉네임입니다.' });
    } else {
      res.status(500).json({ message: '서버 응답에 실패했습니다.' });
    }
  }
};
