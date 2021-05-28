import { Router } from 'express';
import uploadImage from '../controller/imgages/upload';
import multerUploadMiddleware from '../middleware/multerUpload';
import resizeImageWithSharp from '../../lib/resizeImage';

const router = Router();

router.post('/upload', multerUploadMiddleware, resizeImageWithSharp, uploadImage);

export default router;
