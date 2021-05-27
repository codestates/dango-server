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
app.use('/chats', route.chats);
app.use('/talents', route.talents);
app.use('/users', route.users);
app.use('/images', route.images);

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'hello ngrok!' });
});


// 404 
app.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: 'API endpoint doesnt exist',
  });
});



// ---------------------------------TEST ENDPOINT---------------------------------- //
// ---------------------------------TEST ENDPOINT---------------------------------- //
// ---------------------------------TEST ENDPOINT---------------------------------- //
import ChatRoomModel from './models/chatrooms';
import MessageModel from './models/chatmessages';
import UserModel from './models/user';

app.get('/test', async (req: Request, res: Response) => {
  console.time('test');
  // const b = await MessageModel.updateReadBy('cf1f0166a9a04c78ae8d4a13e57923bb', "60a631d45e496eae79fc9c01");

  console.timeEnd('test');
  // res.json({ message: 'success', data: a });
  res.json({ message: 'success' });
});


export default app;
