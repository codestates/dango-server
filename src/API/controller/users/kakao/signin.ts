import { Request, Response } from 'express';
import UserModel from '../../../../models/user';
import KakaoAuth from '../../../../service/kakao';

export default async (req: Request, res: Response) => {
  const accessToken: string = req.body.accessToken;
  try {
    // 유저정보 받아오고
    const data = await KakaoAuth.getUserInfo(accessToken);
    // DB에 id가 있는지 확인
    const result = await UserModel.findOne({ 'socialData.id': data.id }).select('nickname');
    // 데이터가 있으면 토큰과 닉네임 보내준다.
    if (result) {
      res.send({ accessToken, nickname: result.nickname });
    } else {
      res.status(404).send({ message: '회원정보가 없습니다.' });
    }
  } catch (err) {
    res.status(500).send({ message: '서버오류로 데이터를 불러오지 못했습니다.' });
  }
};
