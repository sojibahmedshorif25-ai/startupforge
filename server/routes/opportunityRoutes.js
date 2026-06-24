import { Router } from 'express';
import {
  createOpportunity, getMyOpportunities, updateOpportunity, deleteOpportunity,
  getAllOpportunities, getOpportunityById, getFeaturedOpportunities
} from '../controllers/opportunityController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.get('/featured', getFeaturedOpportunities);
router.get('/all', getAllOpportunities);
router.get('/:id', getOpportunityById);
router.post('/', verifyToken, authorizeRoles('founder'), createOpportunity);
router.get('/', verifyToken, authorizeRoles('founder'), getMyOpportunities);
router.put('/:id', verifyToken, authorizeRoles('founder'), updateOpportunity);
router.delete('/:id', verifyToken, authorizeRoles('founder'), deleteOpportunity);

export default router;
