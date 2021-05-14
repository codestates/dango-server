import { Router } from 'express';
import { signin, signup, signout } from '../../controller/users/kakao/index';

const router = Router();

router.get('/signup', signup);

router.get('/signin', signin);

router.get('/signout', signout);

export default router;
