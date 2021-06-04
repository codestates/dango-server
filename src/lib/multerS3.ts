import { Request } from 'express';
import multer from 'multer';
import multers3 from 'multer-s3';
import aws from 'aws-sdk';

import config from '../config/key';

// 파일 저장 위치
// s3 storage
aws.config.update({
  apiVersion: '2006-03-01',
  accessKeyId: config.bucketKeyId,
  secretAccessKey: config.bucketAccessKey,
  region: config.bucketRegion,
});
const s3 = new aws.S3({});

const storage = multers3({
  s3,
  bucket: `${config.bucketName}/image/original`,
  contentType: multers3.AUTO_CONTENT_TYPE,
});

// 파일 필터링
// validate with multer :: options :: [fieldNameSize, fieldSize, fields, fileSize, files, parts, headerPairs]
const limits = {
  fieldNameSize: 10,
  // fileSize: 5000,
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

  const acceptableExtension = 'jpg,png,gif,bmp,jpeg';
  const matchValue = acceptableExtension.match(typeRegEx);
  if (matchValue) {
    return true;
  }
  return false;
}

// 미들 웨어, 에러처리
const upload = multer({ fileFilter, storage, limits }).array('file', 3);

export default upload;
