import { Router } from 'express';
import getTalentsBylocation from '../controller/talents/map';
import createTalent from '../controller/talents/create';
import getPreview from '../controller/talents/preview';
  
const router = Router();

router.get('/map', getTalentsBylocation);
router.post('/create', createTalent);
router.get('/preview/:talentId',getPreview );

export default router;

/*
'/talents/map'
'/talents/preview'
'/talents/detail'
'/talents/create'
'/talents/edit'
'/talents/'

*/
