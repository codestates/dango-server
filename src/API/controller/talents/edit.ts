import { Request, Response } from 'express';
import logger from '../../../log/winston';
import TalentModel from '../../../models/talents';
import UserModel from '../../../models/user';

export default async (req: Request, res: Response) => {
  const { userId, talentId, description, price, category, title } = req.body;
  try {
    // 유효한 유저인지 확인 :::::::: 
    // userId와 talentId로 판매자인지 확인
    // 판매자이면  데이터 변경
    const seller = await UserModel.findOne({ _id: userId, selling: talentId }).select('userId').lean();
    if (seller) {
      // 판매자
      const result = await TalentModel.findOneAndUpdate(
        { _id: talentId },
        { $set: { description, price, category, title } },
        { new: true },
      )
        .select('description price category title')
        .lean();
      res.json({ message: '재능 수정에 성공했습니다.', data: result });
    } else {
      res.status(401).json({ message: '유효하지 않은 유저입니다.' });
    }
  } catch (err) {
    logger.debug(`${__dirname} talents/edit err message :: ${err.message}`);
    res.status(500).json({ message: '서버 응답에 실패했습니다.' });
  }
};
