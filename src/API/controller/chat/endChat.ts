import { Schema } from 'mongoose';
import { Request, Response } from 'express';
import UserModel from '../../../models/user';
import MessageModel from '../../../models/chatmessages';
import ChatRoomModel from '../../../models/chatrooms';

export default async (req: Request, res: Response) => {
  const { userId, otherId, chatRoomId } = req.body;
  try {
    // 채팅방, 채팅목록은 두명 다 나간 상태일 때 지운다.
    // 한명만 나간 경우 deleteUserTalks 하나만 실행
    // 한명만 나간 경우 메세지를 보내도 디비에 저장은 되지만, 상대방한테 메세지가 가면 안됨.................
    // 마지막에 하자
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
