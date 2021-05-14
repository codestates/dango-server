import { Request, Response } from 'express';
import UserModel from '../../../models/user';

export default async (req: Request, res: Response) => {
  const nickname: string = req.body.nickname;
  console.log(nickname);
  try {
    const data = await UserModel.deleteOne({ nickname: nickname });

    if (data.ok) {
      res.send({ message: '회원 탈퇴에 성공했습니다.' });
    } else {
      res.status(404).send({ message: '유효하지 않은 요청입니다.' });
    }
  } catch (err) {
    res.status(500).send({ message: '서버요청에 실패했습니다.' });
  }
};
