import { KakaoUserInfo } from './../../../../@types/service.d';
import { Request, Response } from 'express';
import UserModel from '../../../../models/user';
import KakaoAuth from '../../../../service/kakao';
import config from '../../../../config/key';
import logger from '../../../../log/winston';

export default async (req: Request, res: Response) => {
  const accessToken: string = req.headers.authorization?.split(' ')[1]!;
  const nickname: string = req.body.nickname;
  try {
    // 이미 로그인 요청을 통해 회원정보가 없다는 것이 확인된 상태
    // 먼저 nickname이 있는지 확인
    const result = await UserModel.findOne({ nickname: nickname });
    if (result) {
      res.status(409).json({ message: '이미 존재하는 닉네임 입니다.' });
    } else {
      // 카카오 정보요청
      const data: KakaoUserInfo = await KakaoAuth.getUserInfo(accessToken);
      if (data) {
        const {
          id,
          kakao_account: { email },
        } = data;
        const userInfo = {
          nickname,
          socialData: {
            id,
            social: 'kakao',
            name: data.properties?.nickname,
            email: email,
            image: data.kakao_account.profile?.profile_image_url || config.defaultImage,
          },
        };
        const newUser = new UserModel(userInfo);
        newUser.save(async (err, user) => {
          if (err) {
            logger.debug(`${__dirname} kakao/signup err message :: ${err.message}`);
            return res.status(404).json({ message: '유저정보 저장에 실패했습니다.' });
          }
          const chatRooms = (await UserModel.getchatRoomsByUserId(user._id)) || null;
          res.json({
            message: '회원가입에 성공했습니다.',
            _id: user._id,
            accessToken,
            nickname,
            socialData: {
              social: 'kakao',
              email: email,
              image: userInfo.socialData.image || config.defaultImage,
            },
            chatRooms,
            selling: user.selling,
            buying: user.buying.map((el) => el && el._id),
            unreviewed: user.unreviewed,
            reviewed: user.reviewed.map((el) => el && el._id),
          });
        });
      } else {
        res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
      }
    }
  } catch (err) {
    logger.debug(`${__dirname} kakao/signup err message :: ${err.message}`);
    res.status(500).json({ message: '서버오류로 데이터를 불러오지 못했습니다.' });
  }
};
