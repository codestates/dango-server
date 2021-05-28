import { Schema } from 'mongoose';
import { Request, Response } from 'express';
import UserModel from '../../../models/user';
import MessageModel from '../../../models/chatmessages';
import ChatRoomModel from '../../../models/chatrooms';

export default async (req: Request, res: Response) => {
  const { userId, otherId, chatRoomId } = req.body;
  try {
    const deleteUser1Talks = UserModel.updateOne({ _id: userId }, { $pull: { talks: chatRoomId } });
    const deleteUser2Talks = UserModel.updateOne({ _id: otherId }, { $pull: { talks: chatRoomId } });
    const deleteChatRoom = ChatRoomModel.deleteOne({ _id: chatRoomId });
    const deleteChats = MessageModel.deleteMany({ roomId: chatRoomId });

    const deleteResult = await Promise.all([deleteUser1Talks, deleteUser2Talks, deleteChatRoom, deleteChats]);
    res.send({ message: '채팅방 나가기에 성공했습니다. 거래가 종료되었습니다.' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: '서버 응답에 실패했습니다.' });
  }
};
