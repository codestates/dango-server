import { Request, NextFunction, Response, Express } from 'express';
import multer from 'multer';

const limits = {
  fieldNameSize: 10,
  // fileSize: 170000,
};

const upload = multer({ dest: 'images/', fileFilter, limits }).array('file', 3);

export default (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, (err: any) => {
    if (err) {
      console.log(err.code);
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        res.status(400).json({ message: '사진 갯수 초과' });
      } else if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({ message: '파일 크기가 초과됩니다.' });
      } else {
        res.status(500).json({ message: '이미지 업로드에 실패했습니다.' });
      }
      return;
    }
    // console.log(req.files);
    // req.file;
    next();
    // 정상적으로 완료됨
  });
};

function fileFilter(req: Request, file: Express.Multer.File, callback: any) {
  console.log(file);
  const validate = mimeTypeValidator(file.mimetype);

  if (validate) {
    callback(null, true);
  } else if (!validate) {
    callback(null, false);
  } else {
    callback(new Error("something wrong... please check multerMiddleware"));
  }
}

function mimeTypeValidator(type: string) {
  const typeRegEx = new RegExp(type.split('/')[1], 'g');

  const acceptableExtension = 'jpg,png,gif,bmp';
  const matchValue = acceptableExtension.match(typeRegEx);
  console.log(matchValue);
  if (matchValue) {
    return true;
  }
  return false;
}
