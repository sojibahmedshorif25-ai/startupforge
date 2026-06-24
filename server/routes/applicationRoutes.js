import { Router } from 'express';
import {
  applyToOpportunity, getMyApplications,
  getFounderApplications, updateApplicationStatus
} from '../controllers/applicationController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.post('/', verifyToken, authorizeRoles('collaborator'), applyToOpportunity);
router.get('/my', verifyToken, authorizeRoles('collaborator'), getMyApplications);
router.get('/founder', verifyToken, authorizeRoles('founder'), getFounderApplications);
router.put('/:id', verifyToken, authorizeRoles('founder'), updateApplicationStatus);

export default router;
