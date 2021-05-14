import { KakaoUserInfo } from './../../../../@types/kakao.d';
import { Request, Response } from 'express';
import UserModel from '../../../../models/user';
import KakaoAuth from '../../../../service/kakao';
import config from '../../../../config';

export default async (req: Request, res: Response) => {
  const accessToken: string = req.body.accessToken;
  const nickname: string = req.body.nickname;
  try {
    // 이미 로그인 요청을 통해 회원정보가 없다는 것이 확인된 상태
    // 먼저 nickname이 있는지 확인
    const result = await UserModel.findOne({ nickname: nickname });
    if (result) {
      res.status(401).send({ message: '이미 존재하는 닉네임 입니다.' });
    } else {
      // 카카오 정보요청
      const data: KakaoUserInfo = await KakaoAuth.getUserInfo(accessToken);
      const {
        id,
        properties,
        kakao_account: {
          // has_email,
          // email_needs_agreement,
          // is_email_valid,
          // is_email_verified,
          email,
          // has_gender,
          // gender_needs_agreement,
          // gender,
        },
      } = data;
      if (data) {
        const newUser = new UserModel({
          nickname,
          socialData: {
            id,
            type: 'kakao',
            name: properties && properties.nickname,
            email: email,
            image: config.defaultImage,
          },
        });
        await newUser.save();
        res.send({ message: '회원가입에 성공했습니다.' });
      } else {
        res.status(401).send({ message: '유효하지 않은 토큰입니다.' });
      }
    }
  } catch (err) {
    res.status(500).send({ message: '서버오류로 데이터를 불러오지 못했습니다.' });
  }
};
