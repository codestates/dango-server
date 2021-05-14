import { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import UserModel from '../../../../models/user';
import KakaoAuth from '../../../../service/kakao';

export default async (req: Request, res: Response) => {
  const accessToken: string = req.headers.authorization?.split(' ')[1]!;
  try {
    const result = await KakaoAuth.signOut(accessToken);
    if (result) {
      res.send({ message: '로그아웃에 성공했습니다.' });
    } else {
      res.status(401).send({message:"유효하지 않은 토큰입니다."})
    }
  } catch (err) {
    res.status(500).send({ message: '서버응답에 실패했습니다.' });
  }
};
