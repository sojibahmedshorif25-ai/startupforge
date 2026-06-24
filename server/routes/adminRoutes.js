import { Router } from 'express';
import { getDashboardStats, getUsers, toggleBlockUser } from '../controllers/adminController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.get('/stats', verifyToken, authorizeRoles('admin'), getDashboardStats);
router.get('/users', verifyToken, authorizeRoles('admin'), getUsers);
router.put('/users/:id/toggle-block', verifyToken, authorizeRoles('admin'), toggleBlockUser);

export default router;
