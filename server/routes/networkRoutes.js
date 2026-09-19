import express from 'express';
import { getSuggestedUsers, sendConnectionRequest } from '../controllers/networkController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/suggestions', verifyToken, getSuggestedUsers);
router.post('/connect', verifyToken, sendConnectionRequest);

export default router;
