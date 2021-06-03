import UserModel from '../models/user';
import ChatRoomModel from '../models/chatrooms';
import MessageModel from '../models/chatmessages';

export default async (talentId: string, userId: string, chatroomId: string) => {
  let buyerId = null;
  try {
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
        return await MessageModel.createPost(chatroomId, '거래가 완료됐습니다.', userId, true);
      } else {
        // confirm한 상대의 id를 채팅에 저장
        return await MessageModel.createPost(chatroomId, '거래 완료를 눌러주세요.', userId, true);
      }
    }
  } catch (err) {
    console.log(err);
  }
};
