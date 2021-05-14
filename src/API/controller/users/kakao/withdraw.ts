import { KakaoUserInfo, WithdrawKakao } from './../../../../@types/kakao.d';
import { Request, Response } from 'express';
import UserModel from '../../../../models/user';
import KakaoAuth from '../../../../service/kakao';

export default async (req: Request, res: Response) => {
  const accessToken: string = req.body.accessToken;
  try {
    console.log(accessToken)
    const result:WithdrawKakao = await KakaoAuth.withdraw(accessToken);
    console.log(result.id);
    // 카카오 요청이 가지 않는다....
    if (result.id) {
      const a = await UserModel.findOne({ 'socialData.id': result.id });
      res.send('a')
    } else {
      res.status(401).send({ message: '유효하지 않은 토큰입니다.' });
    }
  } catch (err) {
    res.status(500).send({ message: '서버오류로 데이터를 불러오지 못했습니다.' });
  }
};
