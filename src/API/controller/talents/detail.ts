import { PopulatedTalent, UserInfo } from './../../../@types/index.d';
import { Request, Response } from 'express';
import TalentModel from '../../../models/talents';

export default async (req: Request, res: Response) => {
  const oid: string = req.params.talentId;
  try {
    const result: PopulatedTalent = await TalentModel.findOne({ _id: oid })
      .populate({ path: 'userInfo reviews._id', select: 'nickname socialData' })
      .select('-__v')
      .lean();
    if (result) {
      delete result.userInfo.socialData.id;
      delete result.userInfo.socialData.social;
      console.log(result);
      const newReviews = result.reviews.map((el) => {
        const data: UserInfo = el._id;
        const {
          _id,
          nickname,
          socialData: { email, image },
        } = el._id;
        return {
          ...el,
          _id,
          socialData: { email, image },
        };
      });

      res.json({
        ...result,
        reviews: newReviews,
        ratings: [result.ratings[0] === 0 ? 0 : result.ratings[0] / result.ratings[1], result.ratings[1]],
      });
    } else {
      res.status(404).json({ message: '재능 정보를 찾을 수 없습니다.' });
    }
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(404).json({ message: '유효하지 않은 id 입니다' });
    } else {
      res.status(500).json({ message: '서버응답에 실패했습니다' });
    }
  }
};
