import { Router } from 'express';
import { updateProfile, getFounderStats, getCollaboratorStats } from '../controllers/userController.js';
import { verifyToken } from '../middleware/auth.js';

const router = Router();

router.put('/profile', verifyToken, updateProfile);
router.get('/founder-stats', verifyToken, getFounderStats);
router.get('/collaborator-stats', verifyToken, getCollaboratorStats);

export default router;
