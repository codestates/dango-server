import { Request, Response } from 'express';
import logger from '../../../log/winston';
import ChatRoomModel from '../../../models/chatrooms';
import UserModel from '../../../models/user';

export default async (req: Request, res: Response) => {
  const { userId, otherId, talentId } = req.body;
  try {
    const isValid = await UserModel.findOne({ _id: otherId }).select('nickname').lean();
    if (!isValid) {
      res.status(404).json({ message: '상대 유저정보를 찾을 수 없습니다.' });
    } else if (isValid.nickname === '탈퇴한 유저') {
      res.status(401).json({ message: '탈퇴한 회원입니다.' });
    } else {
      const roomId = await ChatRoomModel.generateChatRooms(userId, otherId, talentId);
      // 해당 방에는 메세지가 없는 상태
      // 채팅을 위해선 roomId 필요함
      // 나중에 메세지 불러올때도 roomId만 필요함
      res.json({ message: '방 생성에 성공했습니다.', roomId });
    }
  } catch (err) {
    logger.debug(`${__dirname} chat/createRoom err message :: ${err.message}`);
    res.status(500).json({ message: '서버 응답에 실패했습니다.' });
  }
};
