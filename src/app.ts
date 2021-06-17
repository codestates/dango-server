import { Request, Response } from 'express';
import express from 'express';
import route from './API/routes/index';
import dbLoader from './loaders/mongoose';
import appLoader from './loaders/express';

const app = express();

// app.use()
appLoader({ app });

// mongoose
dbLoader().then(() => {
  console.log('database connected');
});

// route
app.use('/chats', route.chats);
app.use('/talents', route.talents);
app.use('/users', route.users);
app.use('/images', route.images);

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'hello ngrok!' });
});

// ---------------------------------TEST ENDPOINT---------------------------------- //
// ---------------------------------TEST ENDPOINT---------------------------------- //

import UserModel from './models/user';

app.get('/test', async (req: Request, res: Response) => {
  console.time('test');
  const b = await UserModel.getTalents('');
  console.timeEnd('test');
  res.json({ message: 'success', data: b });
});

// ---------------------------------TEST ENDPOINT---------------------------------- //
// ---------------------------------TEST ENDPOINT---------------------------------- //

// 404
app.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: 'API endpoint doesnt exist',
  });
});

export default app;
