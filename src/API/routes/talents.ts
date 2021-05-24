import { Router } from 'express';
import getTalentsBylocation from '../controller/talents/map';
import createTalent from '../controller/talents/create';
import getPreview from '../controller/talents/preview';
import getDetail from '../controller/talents/detail';
import createReview from '../controller/talents/review';


const router = Router();

router.post('/map', getTalentsBylocation);
router.post('/create', createTalent);
router.get('/preview/:talentId', getPreview);
router.get('/detail/:talentId', getDetail);
router.post('/review', createReview)

export default router;

/*
'/talents/map'
'/talents/preview'
'/talents/create'
'/talents/detail'-get

'/talents/edit' - post
'/talents/review/:talentId'-post
'/talents/reply/:userId'-post

*/
