import { Request, Response } from 'express';
import ChatRoomModel from '../../../models/chatrooms';

export default async (req: Request, res: Response) => {
  const { userId, otherId, talentId } = req.body;
  try {
    const roomId = await ChatRoomModel.generateChatRooms(userId, otherId, talentId);
    // 해당 방에는 메세지가 없는 상태
    // 채팅을 위해선 roomId 필요함
    // 나중에 메세지 불러올때도 roomId만 필요함
    res.json({ message: '방 생성에 성공했습니다.', roomId });
  } catch (err) {
    res.status(500).json({ message: '서버 응답에 실패했습니다.' });
  }
};
