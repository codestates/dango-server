import { Request, Response } from 'express';

export default async (req: Request, res: Response) => {
  console.log(req.files);
  const length = req.files.length;
  if (typeof length === 'number') {
    const fakeData = new Array(length).fill('https://placeimg.com/120/120/people/grayscale');
    res.json({ message: '업로드에 성공했습니다.', images: fakeData });
  } else {
    res.json({ message: 'something wrong!' });
  }
};
