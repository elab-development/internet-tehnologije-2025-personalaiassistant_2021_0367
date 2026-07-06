import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware.js';
import { create, list, messages, sendMessage } from '../controllers/chat.controller.js';

const router = Router();

router.use(requireAuth);
router.post('/', create);
router.get('/', list);
router.get('/:id/messages', messages);
router.post('/:id/messages', sendMessage);

export default router;
