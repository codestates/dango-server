import { Schema } from 'mongoose';
import { Request, Response } from 'express';
import UserModel from '../../../models/user';
import MessageModel from '../../../models/chatmessages';
import ChatRoomModel from '../../../models/chatrooms';
import logger from '../../../log/winston';

export default async (req: Request, res: Response) => {
  const { userId, otherId, chatRoomId } = req.body;
  try {
    // 채팅방, 채팅목록은 두명 다 나간 상태일 때 지운다.
    // 한명만 나간 경우 deleteUserTalks 하나만 실행
    // 한명만 나간 경우 메세지를 보내도 디비에 저장은 되지만, 상대방한테 메세지가 가면 안됨.................
    // 마지막에 하자
    /**
     * 채팅방 유저가 한명인지 두명인지 확인해야됨.
     * 두명인 경우
     *      => 나간사람이 구매자이면 구매자의 buying에서 지우고 talks에서 지운다.
     *      => 나간사람이 판매자이면 talks에서만 지운다
     * 한명인 경우
     *      => 남은 한명이 구매자이면 구매자의 buying에서 지우고 talks에서 지운다. 이후 방이랑 채팅 모두 지운다.
     *      => 남은 한명이 판매자이면 talks에서만 지운다.
     */
    const buyerId = await ChatRoomModel.findOne({ _id: chatRoomId }).select('initiator talentId').lean();

    if (!buyerId) {
      res.status(401).json({ message: '유효하지 않은 접근입니다.' });
    } else if (buyerId.initiator === userId) {
      // 신청한 사람이 구매자인 경우
      const isOther = await UserModel.findOne({ _id: otherId, talks: chatRoomId }).select('_id').lean();
      if (isOther) {
        // 두명인 경우
        const deleteBuyer = await UserModel.updateOne(
          { _id: userId },
          { $pull: { talks: chatRoomId, buying: { _id: buyerId.talentId } } },
        );
        if (deleteBuyer.nModified > 0) {
          res.json({ message: '방 나가기에 성공했습니다.' });
        } else {
          res.status(500).json({ message: '방 나가기에 실패했습니다.' });
        }
      } else {
        // 한명인 경우
        const deleteBuyerAll = UserModel.updateOne(
          { _id: userId },
          { $pull: { talks: chatRoomId, buying: { _id: buyerId.talentId } } },
        );
        const deleteChatRoom = ChatRoomModel.deleteOne({ _id: chatRoomId });
        const deleteChats = MessageModel.deleteMany({ roomId: chatRoomId });
        const deleteResult = await Promise.all([deleteBuyerAll, deleteChatRoom, deleteChats]);
        if (deleteResult) {
          res.json({ message: '방 나가기에 성공했습니다.' });
        } else {
          res.status(500).json({ message: '방 나가기에 실패했습니다.' });
        }
      }
    } else if (buyerId.initiator !== userId) {
      // 신청한 사람이 판매자인 경우
      const isOther = await UserModel.findOne({ _id: otherId, talks: chatRoomId }).select('_id').lean();
      if (isOther) {
        // 두명인 경우
        const deleteSeller = await UserModel.updateOne({ _id: userId }, { $pull: { talks: chatRoomId } });
        if (deleteSeller.nModified > 0) {
          res.json({ message: '방 나가기에 성공했습니다.' });
        } else {
          res.status(500).json({ message: '방 나가기에 실패했습니다.' });
        }
      } else {
        // 한명인 경우
        const deleteSellerAll = UserModel.updateOne({ _id: userId }, { $pull: { talks: chatRoomId } });
        const deleteChatRoom = ChatRoomModel.deleteOne({ _id: chatRoomId });
        const deleteChats = MessageModel.deleteMany({ roomId: chatRoomId });
        const deleteResult = await Promise.all([deleteSellerAll, deleteChatRoom, deleteChats]);
        if (deleteResult) {
          res.json({ message: '방 나가기에 성공했습니다.' });
        } else {
          res.status(500).json({ message: '방 나가기에 실패했습니다.' });
        }
      }
    }
  } catch (err) {
    logger.debug(`${__dirname} chats/endChat err message :: ${err.message}`);
    res.status(500).json({ message: '서버 응답에 실패했습니다.' });
  }
};
