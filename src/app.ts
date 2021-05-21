import { Request, Response } from 'express';
import express from 'express';
import mongoose from './loaders/mongoose';
import route from './API/routes/index';

const app = express();

// app.use()
require('./loaders/express').default({ app });

// mongoose
mongoose().then(() => {
  console.log('database connected');
});

// route
app.use('/users', route.users);
app.use('/talents', route.talents);

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'hello ngrok!' });
});

import ChatRoomModel from './models/chatrooms';
import MessageModel from './models/chatmessages';

app.get('/test', async (req: Request, res: Response) => {
  // const a = await MessageModel.getMessagesByRoomId('f83f39e21a7449898246ac3b61fcfe16',"60a631d45e496eae79fc9c01",{ page: 0, limit: 10, skip: 0 });
  // const b = await MessageModel.updateReadBy('f83f39e21a7449898246ac3b61fcfe16', "60a631d45e496eae79fc9c01");
  MessageModel.createPost("f83f39e21a7449898246ac3b61fcfe16",'2203',"609ec5a42b6cd4396e5d2bcf")
  // res.json({ message: 'success', data: a });
  res.json({ message: 'success' });
});
// 404 page
app.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: 'API endpoint doesnt exist',
  });
});

export default app;
