import { Router } from 'express';
import getTalentsBylocation from '../controller/talents/map';
import createTalent from '../controller/talents/create';

const router = Router();

router.get('/map', getTalentsBylocation);
router.post('/create', createTalent);
export default router;

/*
'/talents/map'
'/talents/preview'
'/talents/detail'
'/talents/create'
'/talents/edit'
'/talents/'

*/
