import { Router } from 'express';
import { signin, signup, signout, withdraw } from '../../controller/users/kakao/index';

const router = Router();

router.post('/signup', signup);

router.post('/signin', signin);

router.post('/signout', signout);

router.delete('/withdrawal', withdraw);

export default router;
