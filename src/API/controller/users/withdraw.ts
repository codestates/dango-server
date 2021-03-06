import { Request, Response } from 'express';
import config from '../../../config/key';
import logger from '../../../log/winston';
import UserModel from '../../../models/user';

export default async (req: Request, res: Response) => {
  const nickname: string = req.body.nickname;
  try {
    const data = await UserModel.updateOne(
      { nickname: nickname },
      {
        $set: {
          nickname: '탈퇴한 유저',
          'socialData.id': Date.now(),
          'socialData.name': '알수 없음',
          'socialData.email': '',
          'socialData.image': config.defaultImage,
        },
      },
    );

    if (data.nModified > 0) {
      res.json({ message: '회원 탈퇴에 성공했습니다.' });
    } else {
      res.status(404).json({ message: '미가입된 회원입니다.' });
    }
  } catch (err) {
    logger.debug(`${__dirname} users/withdraw err message :: ${err.message}`);
    res.status(500).json({ message: '서버응답에 실패했습니다.' });
  }
};
// 닉네임
