import { Request, Response } from 'express';
import logger from '../../../../log/winston';
import UserModel from '../../../../models/user';
import GoogleAuth from '../../../../service/google';

export default async (req: Request, res: Response) => {
  const IdToken: string = req.headers.authorization?.split(' ')[1]!;
  try {
    // IdToken으로 유저정보 가져온다.
    const userData = await GoogleAuth.getGoogleProfile(IdToken);
    if (userData) {
      const result = await UserModel.findOne({ 'socialData.id': userData.sub });
      if (result) {
        const { social, email, image } = result.socialData;
        const chatRooms = (await UserModel.getchatRoomsByUserId(result._id)) || null;
        res.send({
          message: '로그인에 성공했습니다.',
          _id: result._id,
          accessToken: IdToken,
          socialData: {
            social,
            email,
            image,
          },
          chatRooms,
          selling: result.selling,
          buying: result.buying.map((el) => el && el._id),
          unreviewed: result.unreviewed,
          reviewed: result.reviewed.map((el) => el && el._id),
          nickname: result.nickname,
        });
      } else {
        res.status(404).json({ message: '등록된 회원이 아닙니다.' });
      }
    } else {
      res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    }
  } catch (err) {
    logger.debug(`${__dirname} google/signin err message :: ${err.message}`);
    res.status(500).json({ message: '서버 응답에 실패했습니다.' });
  }
};
