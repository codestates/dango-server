import { Router } from 'express';
import { signin, signup, signout } from '../../controller/users/kakao/index';

const router = Router();

router.post('/signup', signup);

router.post('/signin', signin);

router.post('/signout', signout);

export default router;
