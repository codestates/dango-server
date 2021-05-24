import { CreateTalent } from './../../../@types/request.d';
import { Request, Response } from 'express';
import TalentModel from '../../../models/talents';
import UserModel from '../../../models/user';

export default async (req: Request, res: Response) => {
  const { talentId, userId, replyDescription, reviewId } = req.body;
  try {
    const validUser = await UserModel.find({ _id: userId, selling: talentId }).select('nickname _id').lean();
    if (validUser.length > 0) {
      const newReply = {
        replyDescription,
        replyDate: Date.now(),
      };
      const saveReply = await TalentModel.findOneAndUpdate(
        { _id: talentId, 'reviews.reviewId': reviewId },
        { $set: { 'reviews.$.reply': newReply } },
      );
      res.json({ message: '답글 등록에 성공했습니다.' });
    } else {
      res.status(404).json({ message: '유효하지 않은 유저입니다.' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: '서버 응답에 실패했습니다.' });
  }
};
