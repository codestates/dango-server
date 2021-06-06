import { KakaoUserInfo } from './../../../@types/service.d';
import { Request, Response } from 'express';
import UserModel from '../../../models/user';
import GoogleAuth from '../../../service/google';
import KakaoAuth from '../../../service/kakao';
import logger from '../../../log/winston';

export default async (req: Request, res: Response) => {
  const { social } = req.body;
  const token = req.headers.authorization?.split(' ')[1]!;
  try {
    if (social === 'google') {
      const googleUserInfo = await GoogleAuth.getGoogleProfile(token);
      if (googleUserInfo) {
        const dbData = await UserModel.findOne({ 'socialData.id': googleUserInfo.sub }).select('_id').lean();
        if (dbData) {
          res.json({ message: '유효한 유저입니다.' });
        }
      } else {
        res.status(401).send({ message: '유효하지 않은 토큰입니다.' });
      }
    } else if (social === 'kakao') {
      const kakaoResult: KakaoUserInfo = await KakaoAuth.validate(token);
      if (kakaoResult) {
        const dbData = await UserModel.findOne({ 'socialData.id': kakaoResult.id }).select('_id').lean();
        if (dbData) {
          res.json({ message: '유효한 유저입니다.' });
        }
      } else {
        res.status(401).send({ message: '유효하지 않은 토큰입니다.' });
      }
    }
  } catch (err) {
    logger.debug(`${__dirname} users/validate err message :: ${err.message}`);
    res.status(500).send({ message: '서버응답에 실패했습니다.' });
  }
};
