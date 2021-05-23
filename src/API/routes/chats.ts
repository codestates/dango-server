import { Router } from 'express';
import getChats from '../controller/chat/getChat';
import createRoom from '../controller/chat/createRoom';

const router = Router();

router.post('/:roomId', getChats);
router.post('/createchat', createRoom)

export default router;
