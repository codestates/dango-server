import { Request, Response } from 'express';
import express from 'express';
import mongoose from './loaders/mongoose';
import route from './API/routes/index';

import UserModel from './models/user';

const app = express();

// app.use()
require('./loaders/express').default({ app });

// mongoose
mongoose().then(() => {
  console.log('database connected');
});

// route
app.use('/users', route.users);

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'hello world!' });
});
app.get('/test', (req:Request,res:Response)=>{

  res.send('');
})
export default app;
