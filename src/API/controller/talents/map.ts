import { Request, Response } from 'express';
import TalentModel from '../../../models/talents';
import solveMapWidth from '../../../service/coordinates';

export default async (req: Request, res: Response) => {
  const [S, N]: number[] = req.body.width;
  const [lon, lat]: number[] = req.body.location;
  const category: string = req.body.category;

  const width = solveMapWidth([S, N]);

  try {
    const previewsArr = await TalentModel.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [lon, lat] },
          $minDistance: 0,
          $maxDistance: width / 2,
        },
      },
    })
      .find({ category })
      .populate('userInfo', 'nickname')
      .select('location ratings category title')
      .lean();

    res.json({ result: previewsArr, message: '주변 데이터 불러오기에 성공했습니다.' });
  } catch (err) {
    res.json({ message: '서버 응답에 실패했습니다.' });
  }
};

// 123,50 :::
