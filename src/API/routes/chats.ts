import { Router } from 'express';
import getChats from '../controller/chat/getChat';
import createRoom from '../controller/chat/createRoom';

const router = Router();

router.post('/createchat', createRoom)
router.post('/:roomId', getChats);

export default router;
