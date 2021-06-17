import { Request, Response } from 'express';
import logger from '../../../../log/winston';
import KakaoAuth from '../../../../service/kakao';

export default async (req: Request, res: Response) => {
  const accessToken: string = req.headers.authorization?.split(' ')[1]!;
  try {
    const result = await KakaoAuth.signOut(accessToken);
    if (result) {
      res.json({ message: '로그아웃에 성공했습니다.' });
    } else {
      res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
  } catch (err) {
    logger.debug(`${__dirname} kakao/signout err message :: ${err.message}`);
    res.status(500).json({ message: '서버응답에 실패했습니다.' });
  }
};
