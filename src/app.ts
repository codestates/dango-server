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
app.use('/chats',route.chats);



app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'hello ngrok!' });
});

import ChatRoomModel from './models/chatrooms';
import MessageModel from './models/chatmessages';
import UserModel from './models/user';

app.get('/test', async (req: Request, res: Response) => {
  console.time('test');
  // const a = await MessageModel.getMessagesByRoomId('f83f39e21a7449898246ac3b61fcfe16', '60a631d45e496eae79fc9c01', {
  //   page: 0,
  //   limit: 10,
  //   skip: 0,
  // });
  // const b = await MessageModel.updateReadBy('cf1f0166a9a04c78ae8d4a13e57923bb', "60a631d45e496eae79fc9c01");
  // MessageModel.createPost("cf1f0166a9a04c78ae8d4a13e57923bb",'2203',"609ec5a42b6cd4396e5d2bcf")
  // ChatRoomModel.generateChatRooms("60a631d45e496eae79fc9c01","609ec5a42b6cd4396e5d2bcf");
  const a = await UserModel.getchatRoomsByUserId("60a631d45e496eae79fc9c01")
  console.timeEnd('test');
  res.json({ message: 'success', data: a });
  // res.json({ message: 'success' });
});
// 404 page
app.use('*', (req, res) => {
  return res.status(404).json({
    success: false,
    message: 'API endpoint doesnt exist',
  });
});

export default app;
/*
{
            "_id": "d82b002195194967b5b06bff4761d0fb",
            "type": "text",
            "message": "2203",
            "postedBy": {
                "_id": "609ec5a42b6cd4396e5d2bcf",
                "nickname": "SYH",
                "image": "https://placeimg.com/120/120/people/grayscale"
            },
            "createdAt": "2021-05-21T18:18:20.662Z",
            "isRead": false
        }
*/

/*
{
            "_id": "4461def29baf40129993b5630b65e839",
            "type": "text",
            "message": "2203",
            "postedBy": [
                {
                    "_id": "609ec5a42b6cd4396e5d2bcf",
                    "selling": [],
                    "bought": [],
                    "nickname": "SYH",
                    "socialData": {
                        "id": 1679231556,
                        "social": "kakao",
                        "name": "신영호",
                        "email": "dydh1324@naver.com",
                        "image": "https://placeimg.com/120/120/people/grayscale"
                    },
                    "__v": 0
                }
            ],
            "createdAt": "2021-05-21T18:18:29.356Z"
        }
*/
