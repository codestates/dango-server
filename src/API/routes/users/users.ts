import { Router } from 'express';
import google from './google';
import kakao from './kakao';
import finishdeal from '../../controller/users/finishdeal';
import validateUser from '../../controller/users/validate';
import checkNickname from '../../controller/users/checkNickname';

const router = Router();

// router
router.use('/google', google)
router.use('/kakao', kakao)

// Rest
router.post('/confirm', finishdeal)
router.post('/validate', validateUser)
router.post('/doublecheck', checkNickname)

export default router;