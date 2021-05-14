import { Router } from 'express';
import { signin, signup } from '../../controller/users/google/index';
import withdraw from '../../controller/users/withdraw';

const router = Router();

router.post('/signin', signin);

router.post('/signup', signup);

router.delete('/withdrawal', withdraw);

export default router;
