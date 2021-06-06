import { Request, Response } from 'express';
import UserModel from '../../../models/user';
import ChatRoomModel from '../../../models/chatrooms';
import MessageModel from '../../../models/chatmessages';
import logger from '../../../log/winston';

export default async (req: Request, res: Response) => {
  const { talentId, userId, chatroomId } = req.body;
  let buyerId = null;
  try {
    /**
     * userId의 selling에 talentid가 있는지 확인 :::
     * true? 구매자임
     * false? 판매자임
     * 구매자인 경우 buying의 목록들 중 talentid를 가지고 있는 목록을 찾아서 confirmed update
     *            채팅빙의 메세지에 type:confirmed 추가
     * 판매자인 경우 채팅방을 만든 id의 buying 목록의 talentid를 가진 confirmed 배열에 추가
     *            채팅빙의 메세지에 type:confirmed 추가
     * 그런데 confirmed배열에 이미 한명이 존재할 경우엔 거래를 끝내야 함
     * 이 경우 users의 buying의 talentid에 해당하는 목록을 삭제하고 그 아이디를 unreviewed에 추가해야 됨
     *
     */

    const isSeller = await UserModel.find({ _id: userId, selling: talentId }).select('nickname').lean();

    if (isSeller.length > 0) {
      // 판매자인 경우 구매자 아이디를 가져옴
      const id = await ChatRoomModel.find({ _id: chatroomId }).select('initiator').lean();
      buyerId = id[0].initiator;
    } else {
      buyerId = userId;
    }

    const updatedData = await UserModel.findOneAndUpdate(
      { _id: buyerId, 'buying._id': talentId },
      {
        $addToSet: { 'buying.$.confirmed': userId },
      },
      { new: true },
    )
      .select('buying')
      .lean();
    if (updatedData && updatedData.buying?.length > 0) {
      const buyingArr: any[] = updatedData.buying;
      if (buyingArr.find((list: any) => list._id === talentId).confirmed.length >= 2) {
        // 업데이트 된 결과가 모두 confirm한 경우이므로 buying에서 unreviewed로 이동
        const buyingToUnreviewed = await UserModel.findOneAndUpdate(
          { _id: buyerId },
          {
            $pull: {
              buying: { _id: talentId },
            },
            $push: { unreviewed: talentId },
          },
          { multi: true },
        ).lean();
        // unreviewed로 이동하고 거래완료 메세지 표시
        const confirmedChat = await MessageModel.createPost(chatroomId, '거래가 완료됐습니다.', userId, true);
        res.json({ message: '거래가 완료됐습니다.', confirmed: true, confirmedChat });
      } else {
        // confirm한 상대의 id를 채팅에 저장
        const confirmedChat = await MessageModel.createPost(chatroomId, '거래 완료를 눌러주세요.', userId, true);
        res.json({ message: '거래완료 요청에 성공했습니다.', confirmed: false, confirmedChat });
      }
    } else {
      res.status(500).json({ message: '서버 응답에 실패했습니다.' });
    }
  } catch (err) {
    logger.debug(`${__dirname} users/finishdeal err message :: ${err.message}`);

    res.status(500).json({ message: '서버 응답에 실패했습니다.' });
  }
};
