import { Request, Response } from 'express';
import MessageModel from '../../../models/chatmessages';

export default async (req: Request, res: Response) => {
  const userId = req.body.id;
  const { page, skip, limit } = req.body;
  const roomId: string = req.params.roomId;

  try {
    let result = null;
    if (page && skip && limit) {
      result = await MessageModel.getMessagesByRoomId(roomId, userId, { page, skip, limit });
    } else {
      result = await MessageModel.getMessagesByRoomId(roomId, userId);
    }
    if (result) {
      MessageModel.updateReadBy(roomId, userId);
    }
    res.json({ message: '채팅 불러오기에 성공했습니다.', data: result });
  } catch (err) {
    res.status(500).json({ message: '서버 응답에 실패했습니다.' });
  }
};
