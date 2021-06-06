import { Request, NextFunction, Response } from 'express';
import upload from '../../lib/multerS3';
import logger from '../../log/winston';

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    upload(req, res, (err: any) => {
      if (err) {
        logger.debug(`${__dirname} multerMiddleware err message :: ${err.message}`);
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          res.status(400).json({ message: '사진 갯수가 초과됩니다' });
        } else if (err.code === 'LIMIT_FILE_SIZE') {
          res.status(400).json({ message: '파일 크기가 초과됩니다.' });
        } else {
          res.status(500).json({ message: '이미지 업로드에 실패했습니다.' });
        }
        return;
      }
      next();
    });
  } catch (err) {
    res.status(500).json({ message: '서버 응답에 실패했습니다.' });
  }
};
