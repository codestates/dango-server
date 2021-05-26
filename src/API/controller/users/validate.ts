import { KakaoUserInfo } from './../../../@types/service.d';
import { Request, Response } from 'express';
import UserModel from '../../../models/user';
import GoogleAuth from '../../../service/google';
import KakaoAuth from '../../../service/kakao';

export default async (req: Request, res: Response) => {
  const { token, social } = req.body;
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
    res.status(500).send({ message: '서버응답에 실패했습니다.' });
  }
};
