import { Router } from 'express';
import getChats from '../controller/chat/getChat';
import createRoom from '../controller/chat/createRoom';
import deleteChat from '../controller/chat/endChat';

const router = Router();

router.post('/createchat', createRoom);
router.post('/:roomId', getChats);
router.delete('/delete', deleteChat);

export default router;
