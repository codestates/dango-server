import { Request, Response } from 'express';
import logger from '../../../log/winston';
import UserModel from '../../../models/user';

export default async (req: Request, res: Response) => {
  const userId = req.params.userid;
  try {
    const chatRoomInfo: any[] = await UserModel.getchatRoomsByUserId(userId);
    if (chatRoomInfo && chatRoomInfo.length > 0) {
      res.json({ message: '채팅목록 불러오기에 성공했습니다.', chatrooms: chatRoomInfo });
    } else {
      res.status(404).json({ message: '불러올 채팅목록이 없습니다.' });
    }
  } catch (err) {
    logger.debug(`${__dirname} users/chatRoomInfo err message :: ${err.message}`);

    res.status(500).json({ message: '서버응답에 실패했습니다.' });
  }
};
