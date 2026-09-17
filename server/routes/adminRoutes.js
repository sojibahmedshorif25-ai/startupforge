import { Router } from 'express';
import {
  getDashboardStats,
  getUsers,
  toggleBlockUser,
  getAllStartupsAdmin,
  approveStartup,
  removeStartup,
  getTransactions,
  getAllApplicationsAdmin,
  getActivityLogs,
} from '../controllers/adminController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.get('/stats', verifyToken, authorizeRoles('admin'), getDashboardStats);
router.get('/users', verifyToken, authorizeRoles('admin'), getUsers);
router.put('/users/:id/toggle-block', verifyToken, authorizeRoles('admin'), toggleBlockUser);
router.get('/startups', verifyToken, authorizeRoles('admin'), getAllStartupsAdmin);
router.put('/startups/:id/approve', verifyToken, authorizeRoles('admin'), approveStartup);
router.delete('/startups/:id', verifyToken, authorizeRoles('admin'), removeStartup);
router.get('/transactions', verifyToken, authorizeRoles('admin'), getTransactions);
router.get('/applications', verifyToken, authorizeRoles('admin'), getAllApplicationsAdmin);
router.get('/activity', verifyToken, authorizeRoles('admin'), getActivityLogs);

export default router;
