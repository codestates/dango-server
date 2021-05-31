import { CreateTalent, Review } from './../../../@types/request.d';
import { Request, Response } from 'express';
import TalentModel from '../../../models/talents';
import UserModel from '../../../models/user';

export default async (req: Request, res: Response) => {
  const data: Review = req.body;
  const { talentId, userId, review, rating, nickname, date } = data;
  try {
    /**
     * 유효한 유저인지 확인(unreviewed에 talentId 존재하는지 확인)
     * 유효한 유저이면 talent collection에 review등록
     * talent의 ratings 업데이트
     * userId의 unreviewed 의 talentid에 존재하는 talentid 삭제
     * reviewed 에 talentid 등록
     *
     * 이것들 체크하려면 앞의 메소드 먼저 작성해야겠다.
     */
    const validUser = await UserModel.findOne({ _id: userId, unreviewed: talentId }).select('unreviewed').lean();
    if (validUser) {
      const newReview = {
        _id: userId,
        nickname,
        rating,
        review,
        date,
      };
      const updatedResult = await TalentModel.findOneAndUpdate(
        { _id: talentId },
        { $push: { reviews: newReview }, $inc: { 'rating.0': rating, 'rating.1': 1 } },
        { new: true },
      )
        .select('reviews')
        .lean();
      console.log('reviews', updatedResult);
      if (updatedResult) {
        const matchReview = updatedResult.reviews.find((el) => {
          if (el._id.toString() === userId && el.nickname === nickname && el.rating === rating) {
            return true;
          }
        });
        console.log('matchReview', matchReview);
        if (matchReview) {
          await UserModel.updateOne(
            { _id: userId },
            {
              $pull: {
                unreviewed: talentId,
              },
              $push: {
                reviewed: {
                  _id: talentId,
                  reviewId: matchReview.reviewId,
                },
              },
            },
          );
          res.json({ message: '리뷰 쓰기에 성공했습니다.' });
        } else {
          res.status(500).json({ message: '서버 응답에 실패했습니다.' });
        }
      } else {
        res.status(500).json({ message: '서버 응답에 실패했습니다.' });
      }
    } else {
      res.status(404).json({ message: '유효하지 않은 유저입니다.' });
    }
  } catch (err) {
    res.status(500).json({ message: '서버 응답에 실패했습니다.' });
    console.log(err);
  }
};

/**
 * 탤런트별 리뷰 여러개 존재
 *
 */
