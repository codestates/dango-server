import { Router } from 'express';
import { signin } from '../../controller/users/google/index';

const router = Router();

router.post('/signin', signin);

export default router;
