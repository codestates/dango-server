import { Request, Response } from 'express';
import TalentModel from '../../../models/talents';
import solveMapWidth from '../../../service/coordinates';

export default async (req: Request, res: Response) => {
  const [S, N]: number[] = req.body.width;
  const [lat, lon]: number[] = req.body.location; // 쿼리 보낼땐 반대로
  const categorys: string[] = req.body.category;
  const sort: 'price' | 'ratings' | 'review' | undefined = req.body.sort;
  const finalSort = sort === 'price' ? 'price' : sort === 'ratings' ? '-ratings.0' : '-ratings.1' || '';
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
      .find({
        $or: categorys.sort().map((category) => {
          return { category };
        }),
      })
      .populate('userInfo', 'nickname')
      .select('location ratings category title price')
      .sort(`${finalSort}`)
      .lean();
    res.json({ result: previewsArr, message: '주변 데이터 불러오기에 성공했습니다.' });
  } catch (err) {
    console.log(err);
    res.json({ message: '서버 응답에 실패했습니다.' });
  }
};

// sort : price, ratings, review
