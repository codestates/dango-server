import { Router } from 'express';
import getTalentsBylocation from '../controller/talents/map';

const router = Router();

router.get('/map', getTalentsBylocation);

export default router;


/*
'/talents/map'
'/talents/preview'
'/talents/detail'
'/talents/create'
'/talents/edit'
'/talents/'

*/