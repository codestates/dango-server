import { Router, Request, Response } from 'express';
const router = Router();

router.get('/signup',(req:Request, res:Response)=>{
  console.log(1);
  res.send('123');
})





export default router;