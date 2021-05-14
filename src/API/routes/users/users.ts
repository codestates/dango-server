import { Router} from 'express';
import google from './google';
import kakao from './kakao';

const router = Router();

router.use('/google',google)
router.use('/kakao',kakao)



export default router;