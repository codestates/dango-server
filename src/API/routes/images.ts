import { Router } from 'express';
import uploadImage from '../controller/imgages/upload';
import uploadImageToS3 from '../middleware/uploadImageToS3';

const router = Router();

router.post('/upload', uploadImageToS3, uploadImage);

export default router;
