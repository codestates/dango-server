import { Router, Request, Response } from 'express';
import a from '../../controller/users/kakao/signin';

const router = Router();

router.get('/signup',(req:Request, res:Response)=>{
  console.log(1);
  res.send('123');
})

router.get('/signin',a)



export default router;