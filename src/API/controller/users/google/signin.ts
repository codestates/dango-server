import { Request, Response } from 'express';
import UserModel from '../../../../models/user';
import GoogleAuth from '../../../../service/google';

export default async (req: Request, res: Response) => {
  const IdToken: string = req.headers.authorization?.split(' ')[1]!;
  try {
    // IdToken으로 유저정보 가져온다.
    const userData = await GoogleAuth.getGoogleProfile(IdToken);
    if (userData) {
      const result = await UserModel.findOne({ 'socialData.id': userData.sub }).select('nickname socialData _id');
      if (result) {
        const { social, email, image } = result.socialData;
        res.send({
          message: '로그인에 성공했습니다.',
          _id: result._id,
          socialData: {
            social,
            email,
            image,
          },
          nickname: result.nickname,
        });
      } else {
        res.status(404).send({ message: '등록된 회원이 아닙니다.' });
      }
    } else {
      res.status(401).send({ message: '유효하지 않은 토큰입니다.' });
    }
  } catch (err) {
    res.status(500).send({ message: '서버 응답에 실패했습니다.' });
  }
};
