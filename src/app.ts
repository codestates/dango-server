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
app.use('/talents',route.talents);


app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'hello world!' });
});


import UserModel from './models/user';
import TalentModel from './models/talents';
app.get('/test', async (req: Request, res: Response) => {
  const a = await UserModel.find({ nickname: 'SYH' }).select('_id');
  const b = await TalentModel.updateOne({ category: 'coding' }, { $set: { userInfo: a[0]._id } });
  res.send(b);
});

export default app;
