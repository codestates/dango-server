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
  console.log(req);
  res.send({ message: 'hello ngrok!' });
});

// ---------------------------------TEST ENDPOINT---------------------------------- //
// ---------------------------------TEST ENDPOINT---------------------------------- //

import ChatRoomModel from './models/chatrooms';
import MessageModel from './models/chatmessages';
import UserModel from './models/user';
import TalentModel from './models/talents';

app.get('/test', async (req: Request, res: Response) => {
  console.time('test');
  // const b = await MessageModel.updateReadBy('888a1fd92535469e82c7938d8aa7feb0', "60b899f9fe40231d9bf6c08c");
  // const b = await UserModel.getchatRoomsByUserId("60b496a9177ebf3274f9911a");
  // const b = await MessageModel.aggregate([{ $match: { roomId: "33b62e0574984010b0dafeb868f4e033" } }]);
  // const b = await UserModel.getTalents("60b0c38a16391c2718926987")
  // const b = await MessageModel.getMessagesByRoomId('888a1fd92535469e82c7938d8aa7feb0', '60b8ab0b6a80d52761537f76');
  // const b = await TalentModel.updateOne(
  //   { _id: talentId },
  //   { $push: { reviews: newReview }, $inc: { 'rating.0': rating, 'rating.1': 1 } },
  // );
  console.timeEnd('test');
  // res.json({ message: 'success', data: a });
  // res.json({ message: 'success', data: b });
});

// ---------------------------------TEST ENDPOINT---------------------------------- //
// ---------------------------------TEST ENDPOINT---------------------------------- //

// 404
app.use('*', (req, res) => {
  console.log(req);
  return res.status(404).json({
    success: false,
    message: 'API endpoint doesnt exist',
  });
});

export default app;
