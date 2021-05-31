import { Router } from 'express';
import google from './google';
import kakao from './kakao';
import finishdeal from '../../controller/users/finishdeal';
import validateUser from '../../controller/users/validate';
import checkNickname from '../../controller/users/checkNickname';
import nicknameEdit from '../../controller/users/nicknameEdit';
import getTalentPreview from '../../controller/users/mypage';
import getChatRooms from '../../controller/users/chatroomInfo';

const router = Router();

// router
router.use('/google', google)
router.use('/kakao', kakao)

// Rest
router.post('/confirm', finishdeal)
router.post('/validate', validateUser)
router.post('/doublecheck', checkNickname)
router.post('/edit', nicknameEdit)
router.get('/chatinfo/:userid', getChatRooms)
router.get('/mypage/:userid', getTalentPreview)

export default router;