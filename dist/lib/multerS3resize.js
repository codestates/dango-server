"use strict";
/*
import { Request, NextFunction, Response } from 'express';
import multer from 'multer';
import aws from 'aws-sdk';
import multers3 from 'multer-s3-transform';
import sharp from 'sharp';
import path from 'path';
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
  bucket: 'dango/image/original',
  contentType: multers3.AUTO_CONTENT_TYPE,
  shouldTransform: true,
  transforms: [
    {
      id: 'resized',
      key: function (req: any, file: Express.Multer.File, cb: any) {
        let extension = path.extname(file.originalname);
        cb(null, Date.now().toString() + extension);
      },
      transform: function (req: any, file: Express.Multer.File, cb: any) {
        cb(null, sharp().resize({ width: 100, fit: sharp.fit.contain }));
      },
    },
  ],
  acl: 'public-read-write',
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

  const acceptableExtension = 'jpg,png,gif,bmp';
  const matchValue = acceptableExtension.match(typeRegEx);
  if (matchValue) {
    return true;
  }
  return false;
}

// 미들 웨어, 에러처리
const upload = multer({ fileFilter, storage, limits }).array('file', 3);

export default upload;
*/ 
