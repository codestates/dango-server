import { Request, Response, NextFunction } from 'express';
import UserModel from '../../models/user';
import GoogleAuth from '../../service/google';
import KakaoAuth from '../../service/kakao';

export default async (req: Request, res: Response, next: NextFunction) => {
  const token: string = req.headers.authorization?.split(' ')[1]!;
  if (token.length > 100) {
    const data = await GoogleAuth.getGoogleProfile(token);
    if (data) {
      const isInDB = await UserModel.findOne({ 'socialData.id': data.sub });
      if (isInDB) {
        next();
      } else {
        res.status(401).json({ message: '등록된 회원이 아닙니다.' });
      }
    } else {
      res.status(404).json({ message: '유효하지 않은 토큰입니다.' });
    }
  } else {
    const data = await KakaoAuth.getUserInfo(token);
    if (data) {
      const isInDB = await UserModel.findOne({ 'socialData.id': data.id });
      if (isInDB) {
        next();
      } else {
        res.status(401).json({ message: '등록된 회원이 아닙니다.' });
      }
    } else {
      res.status(404).json({ message: '유효하지 않은 토큰입니다.' });
    }
  }
};
