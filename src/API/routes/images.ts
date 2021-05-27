import { Router } from 'express';
import uploadImage from '../controller/imgages/upload';
import multerUploadMiddleware from '../middleware/multerUpload';

const router = Router();

router.post('/upload', multerUploadMiddleware, uploadImage);

export default router;
