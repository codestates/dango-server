import { CreateTalent } from './../../../@types/request.d';
import { Request, Response } from 'express';
import TalentModel from '../../../models/talents';

export default async (req: Request, res: Response) => {
  const reqData: CreateTalent = req.body;
  try {
    const talent = {
      ...reqData,
      userInfo: reqData._id,
    };
    delete talent._id;
    const talentDoc = new TalentModel(talent);
    talentDoc.save((err, talent) => {
      console.log(err);
      console.log(123);
      console.log(talent);
      res.send(talent);
    });
  } catch (err) {
    res.json({ message: '서버 응답에 실패했습니다.' });
  }
};

/**
 _id
 title
 location
 city
 category
 price
 detail
 images:[]
 */
