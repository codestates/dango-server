import { Request, Response } from 'express';
import logger from '../../../log/winston';
import MessageModel from '../../../models/chatmessages';

export default async (req: Request, res: Response) => {
  const userId = req.body.id;
  const { page, skip, limit } = req.body;
  const roomId: string = req.params.roomId;
  console.log(userId, page, skip, limit, roomId);
  try {
    let result = null;
    if (page >= 0 && skip >= 0 && limit >= 0) {
      result = await MessageModel.getMessagesByRoomId(roomId, userId, { page, skip, limit });
    } else {
      result = await MessageModel.getMessagesByRoomId(roomId, userId);
    }
    console.log(result);
    if (result) {
      setTimeout(async () => {
        await MessageModel.updateReadBy(roomId, userId);
      }, 1);
      res.json({ message: '채팅 불러오기에 성공했습니다.', data: result });
    } else {
      res.json({ message: '채팅 불러오기에 실패했습니다.' });
    }
  } catch (err) {
    logger.debug(`${__dirname} chat/getChat err message :: ${err.message}`);
    res.status(500).json({ message: '서버 응답에 실패했습니다.' });
  }
};
