import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { upload as uploadMiddleware } from '../middleware/upload.middleware.js';
import { upload, list, remove } from '../controllers/documents.controller.js';

const router = Router();

router.use(requireAuth);
router.get('/', list);
router.post('/', uploadMiddleware.single('file'), upload);
router.delete('/:id', remove);

export default router;
