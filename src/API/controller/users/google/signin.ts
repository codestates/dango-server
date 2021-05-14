import { GooglePayload } from './../../../../@types/google.d';
import { Request, Response } from 'express';
import UserModel from '../../../../models/user';
import GoogleAuth from '../../../../service/google';

export default async (req: Request, res: Response) => {
  const IdToken: string = req.headers.authorization?.split(' ')[1]!;
  try {
    // IdToken으로 유저정보 가져온다.
    const userData = await GoogleAuth.getGoogleProfile(IdToken);
    if (userData) {
      const result = await UserModel.findOne({ 'socialData.id': userData.sub }).select('nickname socialData');
      if (result) {
        res.send({ message: '로그인에 성공했습니다.', userInfo: result.socialData, nickname: result.nickname });
      } else {
        res.status(404).send({ message: '등록된 회원이 아닙니다.' });
      }
    } else {
      res.status(401).send({ message: '유효하지 않은 토큰입니다.' });
    }
  } catch (err) {
    console.log(err);
    res.send('err');
  }
};

/**
 *  {
  iss: 'accounts.google.com',
  azp: '968179737316-gj1srqd2qki48du5bqgnpu9ffq825c39.apps.googleusercontent.com',
  aud: '968179737316-gj1srqd2qki48du5bqgnpu9ffq825c39.apps.googleusercontent.com',
  sub: '103179440432725431001',
  email: 'jjooh10@naver.com',
  email_verified: true,
  at_hash: '00YI9MeK2sSz-Guv3HjAcw',
  name: 'Juhyeon Ji',
  picture: 'https://lh3.googleusercontent.com/a-/AOh14GiOxRT8w6zDU9gEM6MBg_5wPEAMDaCCTdqpItPF=s96-c',
  given_name: 'Juhyeon',
  family_name: 'Ji',
  locale: 'ko',
  iat: 1620990095,
  exp: 1620993695,
  jti: 'f01194a6d18753d7cdac5c9993a418367fd76d20'
}
 */
