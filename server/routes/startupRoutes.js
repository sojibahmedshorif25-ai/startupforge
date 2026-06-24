import { Router } from 'express';
import {
  createStartup, getMyStartup, updateStartup, deleteStartup,
  getAllStartups, getStartupById, getFeaturedStartups,
  adminGetAllStartups, adminApproveStartup, adminRemoveStartup
} from '../controllers/startupController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.get('/featured', getFeaturedStartups);
router.get('/all', getAllStartups);
router.get('/admin/all', verifyToken, authorizeRoles('admin'), adminGetAllStartups);
router.put('/admin/approve/:id', verifyToken, authorizeRoles('admin'), adminApproveStartup);
router.delete('/admin/remove/:id', verifyToken, authorizeRoles('admin'), adminRemoveStartup);
router.get('/:id', getStartupById);
router.post('/', verifyToken, authorizeRoles('founder'), createStartup);
router.get('/', verifyToken, authorizeRoles('founder'), getMyStartup);
router.put('/:id', verifyToken, authorizeRoles('founder'), updateStartup);
router.delete('/:id', verifyToken, authorizeRoles('founder'), deleteStartup);

export default router;
