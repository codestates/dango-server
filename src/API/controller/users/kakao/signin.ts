import { Request, Response } from 'express';
import UserModel from '../../../../models/user';
import KakaoAuth from '../../../../service/kakao';

export default async (req: Request, res: Response) => {
  const accessToken: string = req.headers.authorization?.split(' ')[1]!;
  try {
    // 유저정보 받아오고
    const data = await KakaoAuth.getUserInfo(accessToken);
    // DB에 id가 있는지 확인
    const result = await UserModel.findOne({ 'socialData.id': data.id })
    // 데이터가 있으면 토큰과 닉네임 보내준다.
    if (result) {
      const { social, email, image } = result.socialData;
      const chatRooms = (await UserModel.getchatRoomsByUserId(result._id)) || null;
      res.send({
        message: '로그인에 성공했습니다.',
        accessToken,
        _id: result._id,
        socialData: {
          social,
          email,
          image,
        },
        chatRooms,
        selling: result.selling,
        buying: result.buying.map(el => el && el._id),
        unreviewed: result.unreviewed,
        reviewed: result.reviewed,
        nickname: result.nickname,
      });
    } else {
      res.status(404).send({ message: '회원정보가 없습니다.' });
    }
  } catch (err) {
    res.status(500).send({ message: '서버응답에 실패했습니다.' });
  }
};
