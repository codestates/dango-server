import { Request, Response } from 'express';
import app from './loaders/express';

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'hello world!' });
});

export default app;
