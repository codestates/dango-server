import { Router } from 'express';
import getChats from '../controller/chat/getChat';

const router = Router();

router.post('/:roomId', getChats);

export default router;
