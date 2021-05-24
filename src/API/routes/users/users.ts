import { Router } from 'express';
import google from './google';
import kakao from './kakao';
import finishdeal from '../../controller/users/finishdeal';

const router = Router();

// router
router.use('/google', google)
router.use('/kakao', kakao)

// Rest
router.post('/confirm', finishdeal)


export default router;