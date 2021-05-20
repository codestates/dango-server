import { PopulatedTalent } from './../../../@types/index.d';
import { Request, Response } from 'express';
import TalentModel from '../../../models/talents';
import solveMapWidth from '../../../utils/coordinates';

export default async (req: Request, res: Response) => {
  const [S, N]: number[] = req.body.width;
  const [lat, lon]: number[] = req.body.location; // 쿼리 보낼땐 반대로
  const categorys: string[] = req.body.category || [''];
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
          if (!category) return {};
          return { category };
        }),
      })
      .populate({ path: 'userInfo', select: 'nickname' })
      // .select('location ratings category title price')
      .select('-__v -reviews -images ')
      .sort(`${finalSort}`)
      .lean();

    previewsArr.map((preview: any) => {
      return preview;
    });
    res.json({ result: previewsArr, message: '주변 데이터 불러오기에 성공했습니다.' });
  } catch (err) {
    console.log(err);
    res.json({ message: '서버 응답에 실패했습니다.' });
  }
};

