import { Request, NextFunction, Response, Express } from 'express';
import multer from 'multer';

// 파일 저장 위치
// const storage = multer.memoryStorage()
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/');
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    // cb(null, `${file.fieldname}-${file.originalname.slice(0, 20)}-${uniqueSuffix}`);
    cb(null, file.originalname);
  },
});

// 파일 필터링
// validate with multer :: options :: [fieldNameSize, fieldSize, fields, fileSize, files, parts, headerPairs]
const limits = {
  fieldNameSize: 10,
  // fileSize: 170000,
};

// 커스텀 validate
function fileFilter(req: Request, file: Express.Multer.File, callback: any) {
  const validate = mimeTypeValidator(file.mimetype);

  if (validate) {
    callback(null, true);
  } else if (!validate) {
    callback(null, false);
  } else {
    callback(new Error('something wrong... please check multerMiddleware'));
  }
}

function mimeTypeValidator(type: string) {
  const typeRegEx = new RegExp(type.split('/')[1], 'g');

  const acceptableExtension = 'jpg,png,gif,bmp';
  const matchValue = acceptableExtension.match(typeRegEx);
  if (matchValue) {
    return true;
  }
  return false;
}

// 미들 웨어, 에러처리
const upload = multer({ storage, fileFilter, limits }).array('file', 3);

export default (req: Request, res: Response, next: NextFunction) => {
  upload(req, res, (err: any) => {
    if (err) {
      console.log('err', err.code);
      console.log(err);
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        res.status(400).json({ message: '사진 갯수 초과' });
      } else if (err.code === 'LIMIT_FILE_SIZE') {
        res.status(400).json({ message: '파일 크기가 초과됩니다.' });
      } else {
        res.status(500).json({ message: '이미지 업로드에 실패했습니다.' });
      }
      return;
    }
    next();
  });
};
