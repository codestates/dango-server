import { Router } from 'express';
import { signin, signup, signout } from '../../controller/users/kakao/index';
import withdraw from '../../controller/users/withdraw';

const router = Router();

router.post('/signup', signup);

router.post('/signin', signin);

router.post('/signout', signout);

router.delete('/withdrawal', withdraw);

export default router;
