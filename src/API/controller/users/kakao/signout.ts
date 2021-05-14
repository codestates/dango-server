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
    res.status(500).send({ message: '서버오류로 데이터를 불러오지 못했습니다.' });
  }
};
