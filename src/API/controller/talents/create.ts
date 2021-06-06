import { CreateTalent } from './../../../@types/request.d';
import { Request, Response } from 'express';
import TalentModel from '../../../models/talents';
import UserModel from '../../../models/user';
import logger from '../../../log/winston';

export default async (req: Request, res: Response) => {
  const reqData: CreateTalent = req.body;
  try {
    // 스키마에 맞게 구조 변경
    const talent = {
      ...reqData,
      userInfo: reqData.userId,
      location: reqData.location.reverse(),// 클라에선 위도경도로 보내고, DB엔 경도위도로 저장.
    };
    delete talent.userId;

    // 저장 시작
    const talentDoc = new TalentModel(talent);
    const result = await talentDoc.save();
    if (result) {
      // 저장 된 경우 해당 글을 작성한 유저의 selling배열에 talentId 푸쉬
      const usersResult = await UserModel.findOneAndUpdate({ _id: result.userInfo }, { $push: { selling: result._id } }).select('_id').lean();
      if (usersResult) {
        // 성공
        res.json({ message: '재능 등록에 성공했습니다.', talentId: usersResult._id });
      } else {
        // 푸쉬에 실패한 경우 저장했던 talent document 지운다.
        const deleteResult = await TalentModel.deleteOne({ _id: result._id });
        res.status(500).json({ message: '데이터 저장에 실패했습니다.' });
      }
    } else {
      res.status(500).json({ message: '데이터 저장에 실패했습니다.' });
    }
  } catch (err) {
    logger.debug(`${__dirname} talents/create err message :: ${err.message}`);
    res.status(500).json({ message: '서버 응답에 실패했습니다.' });
  }
};
