import { Request, Response } from 'express';
import logger from '../../../log/winston';
import UserModel from '../../../models/user';

export default async (req: Request, res: Response) => {
  const { nickname } = req.body;
  try {
    const user = await UserModel.findOne({ nickname }).select('nickname').lean();
    if (user) {
      res.status(406).json({ message: '이미 존재하는 닉네임 입니다.' });
    } else {
      res.json({ message: '사용 가능한 닉네임입니다.' });
    }
  } catch (err) {
    logger.debug(`${__dirname} users/checkNickname err message :: ${err.message}`);

    res.status(500).json({ message: '서버응답에 실패했습니다.' });
  }
};
