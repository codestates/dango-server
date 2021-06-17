import { Request, Response } from 'express';
import UserModel from '../../../../models/user';
import GoogleAuth from '../../../../service/google';
import config from '../../../../config/key';
import logger from '../../../../log/winston';

export default async (req: Request, res: Response) => {
  const IdToken: string = req.headers.authorization?.split(' ')[1]!;
  const nickname: string = req.body.nickname;

  try {
    const dbNickname = await UserModel.findOne({ nickname: nickname });
    if (dbNickname) {
      res.status(409).json({ message: '이미 존재하는 닉네임입니다.' });
    } else {
      const userData = await GoogleAuth.getGoogleProfile(IdToken);
      if (userData) {
        const dbData = await UserModel.findOne({ 'socialData.id': userData.sub });
        if (dbData) {
          res.status(409).json({ message: '이미 회원가입이 된 유저입니다.' });
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
          newUser.save(async (err, user) => {
            if (err) {
              logger.debug(`${__dirname} google/signup err message :: ${err.message}`);
              return res.status(404).json({ message: '유저정보 저장에 실패했습니다.' });
            }
            const chatRooms = (await UserModel.getchatRoomsByUserId(user._id)) || null;
            res.json({
              message: '회원가입에 성공했습니다.',
              _id: user._id,
              accessToken: IdToken,
              nickname,
              socialData: {
                social: 'google',
                email: userData.email,
                image: userData.picture || config.defaultImage,
              },
              chatRooms,
              selling: user.selling,
              buying: user.buying.map((el) => el && el._id),
              unreviewed: user.unreviewed,
              reviewed: user.reviewed.map((el) => el && el._id),
            });
          });
        }
      } else {
        res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
      }
    }
  } catch (err) {
    logger.debug(`${__dirname} google/signup err message :: ${err.message}`);
    res.status(500).json({ message: '서버오류로 응답에 실패했습니다.' });
  }
};
