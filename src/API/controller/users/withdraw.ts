import { Request, Response } from 'express';
import UserModel from '../../../models/user';

export default async (req: Request, res: Response) => {
  const nickname: string = req.body.nickname;
  try {
    const data = await UserModel.updateOne(
      { nickname: nickname },
      {
        $set: {
          nickname: '탈퇴한 유저',
          'socialData.id': Date.now(),
          'socialData.name': '알수 없음',
          'socialData.email': '',
          'socialData.image': '',
        },
      },
    );

    if (data.nModified > 0) {
      res.send({ message: '회원 탈퇴에 성공했습니다.' });
    } else {
      res.status(404).send({ message: '미가입된 회원입니다.' });
    }
  } catch (err) {
    res.status(500).send({ message: '서버응답에 실패했습니다.' });
  }
};
// 닉네임
