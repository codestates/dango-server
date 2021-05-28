import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

export default async (req: Request, res: Response, next: NextFunction) => {
  if (!req.files) return next();

  const images = [];
  console.time('bufferTest');
  await Promise.all(
    req.files.map(async (file) => {
      console.log(file);
      await sharp(file.path) //
        .resize(640, 320) //
        .toBuffer() //
        // .png({ quality: 90 }) //
        .then((data) => {
          images.push(data);
        });
    }),
  );
  console.timeEnd('bufferTest');
  console.log(images);

  req.files = images;
  next();
};
// export interface IFile {
//   fieldname: string;
//   originalname: string;
//   encoding: string;
//   mimetype: string;
//   destination: string;
//   filename: string;
//   path: string;
//   size: number;
// }
