import { Request, Response } from 'express';
import UserModel from '../../../../models/user';
import GoogleAuth from '../../../../service/google';
import config from '../../../../config/index';

export default async (req: Request, res: Response) => {
  const IdToken: string = req.headers.authorization?.split(' ')[1]!;
  const nickname: string = req.body.nickname;

  try {
    const dbNickname = await UserModel.findOne({ nickname: nickname });
    if (dbNickname) {
      res.status(409).send({ message: '이미 존재하는 닉네임입니다.' });
    } else {
      const userData = await GoogleAuth.getGoogleProfile(IdToken);
      if (userData) {
        const dbData = await UserModel.findOne({ 'socialData.id': userData.sub });
        if (dbData) {
          res.status(409).send({ message: '이미 회원가입이 된 유저입니다.' });
        } else {
          const userInfo = {
            nickname,
            socialData: {
              id: userData.sub,
              social: 'google',
              name: userData.name,
              email: userData.email,
              image: userData.picture || config.defaultImage,
            },
          };
          const newUser = new UserModel(userInfo);
          newUser.save((err, user) => {
            res.status(200).send({
              message: '회원가입에 성공했습니다.',
              _id: user._id,
              nickname,
              socialData: {
                social: 'google',
                email: userData.email,
                image: userData.picture || config.defaultImage,
              },
            });
          });
        }
      } else {
        res.status(401).send({ message: '유효하지 않은 토큰입니다.' });
      }
    }
  } catch (err) {
    res.status(500).send({ message: '서버오류로 응답에 실패했습니다.' });
  }
};
