import { Request, Response } from 'express';
import logger from '../../../log/winston';
import TalentModel from '../../../models/talents';

export default async (req: Request, res: Response) => {
  const oid: string = req.params.talentId;
  try {
    const result = await TalentModel.findOne({ _id: oid }).select('-__v -images -reviews -userInfo').lean();
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: '재능 정보를 찾을 수 없습니다.' });
    }
  } catch (err) {
    logger.debug(`${__dirname} talents/preview err message :: ${err.message}`);
    if (err.name === 'CastError') {
      res.status(404).json({ message: '유효하지 않은 id 입니다' });
    } else {
      res.status(500).json({ message: '서버응답에 실패했습니다' });
    }
  }
};
// 위치, 카테고리, 닉네임,  별점 평균, 가격, 글 제목, 글 내용, 지역
