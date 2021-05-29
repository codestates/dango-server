import { S3Payload } from './../../../@types/service.d';
import { Request, Response } from 'express';

export default async (req: Request, res: Response) => {
  const imgUrlArr: string[] = [];
  try {
    Array.prototype.forEach.call(req.files, (file: S3Payload) => {
      imgUrlArr.push(file.transforms[0].location);
    });
    if (imgUrlArr.length > 0) {
      res.json({ message: '이미지 등록에 성공했습니다.', data: imgUrlArr });
    } else {
      res.status(404).json({ message: '이미지 등록에 실패했습니다.' });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: '서버 응답에 실패했습니다.' });
  }
};
