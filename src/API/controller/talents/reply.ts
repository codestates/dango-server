import { CreateTalent } from './../../../@types/request.d';
import { Request, Response } from 'express';
import TalentModel from '../../../models/talents';
import UserModel from '../../../models/user';

export default async (req: Request, res: Response) => {
  const {talentId, userId } = req.body;
  try {
    /**
     * 유효한 유저인지 확인(userId의 selling에 talentid가 존재하는지 확인)
     * 유효한 유저이면 talent collection에 reply 등록
     * userId의 unreviewed 의 talentid에 존재하는 talentid 삭제
     * reviewed 에 talentid 등록
     * 
     * 이것들 체크하려면 앞의 메소드 먼저 작성해야겠다.
     */

  } catch (err) {
  }
};
