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
  const a = await MessageModel.getMessagesByRoomId('f83f39e21a7449898246ac3b61fcfe16',{ page: 0, limit: 10, skip: 0 });

  res.json({ message: 'success', data: a });
});
// 404 page
app.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: 'API endpoint doesnt exist',
  });
});

export default app;
