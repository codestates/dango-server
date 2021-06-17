import { Request, Response } from 'express';
import TalentModel from '../../../models/talents';
import UserModel from '../../../models/user';
import logger from '../../../log/winston';

export default async (req: Request, res: Response) => {
  const { talentId, userId, replyDescription, reviewId, replyDate } = req.body;
  try {
    const validUser = await UserModel.find({ _id: userId, selling: talentId }).select('nickname _id').lean();
    if (validUser.length > 0) {
      const newReply = {
        replyDescription,
        replyDate,
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
    logger.debug(`${__dirname} talents/reply err message :: ${err.message}`); logger
    res.status(500).json({ message: '서버 응답에 실패했습니다.' });
  }
};
