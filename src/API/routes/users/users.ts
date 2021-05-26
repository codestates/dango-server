import { Router } from 'express';
import google from './google';
import kakao from './kakao';
import finishdeal from '../../controller/users/finishdeal';
import validateUser from '../../controller/users/validate';
const router = Router();

// router
router.use('/google', google)
router.use('/kakao', kakao)

// Rest
router.post('/confirm', finishdeal)
router.post('/validate', validateUser)

export default router;