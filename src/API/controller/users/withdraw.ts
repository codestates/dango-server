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
      res.status(404).send({ message: '미가입된 회원입니다.' });
    }
  } catch (err) {
    res.status(500).send({ message: '서버응답에 실패했습니다.' });
  }
};
