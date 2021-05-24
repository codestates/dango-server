import { CreateTalent } from '../../../@types/request';
import { Request, Response } from 'express';
import TalentModel from '../../../models/talents';
import UserModel from '../../../models/user';

export default async (req: Request, res: Response) => {
  const {talentId, userId, role } = req.body;
  try {
    /**
     * userId의 selling에 talentid가 있는지 확인 ::: 클라이언트에서 확인이 가능한가..
     * true? 구매자임
     * false? 판매자임
     * 구매자인 경우 buying의 목록들 중 talentid를 가지고 있는 목록을 찾아서 confirmed update
     * 판매자인 경우 채팅방을 만든 id의 buying 목록의 talentid를 가진 confirmed 배열에 추가
     * 
     * 그런데 confirmed배열에 이미 한명이 존재할 경우엔 거래를 끝내야 함
     * 이 경우 users의 buying의 talentid에 해당하는 목록을 삭제하고 그 아이디를 unreviewed에 추가해야 됨
     * 
     */

  } catch (err) {
  }
};
