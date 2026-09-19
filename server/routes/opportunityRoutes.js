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
router.post('/', verifyToken, authorizeRoles('founder', 'admin'), createOpportunity);
router.get('/', verifyToken, authorizeRoles('founder', 'admin'), (req, res, next) => {
  if (req.user?.role === 'admin' || req.query.limit || req.query.page) {
    return getAllOpportunities(req, res, next);
  }
  return getMyOpportunities(req, res, next);
});
router.put('/:id', verifyToken, authorizeRoles('founder', 'admin'), updateOpportunity);
router.delete('/:id', verifyToken, authorizeRoles('founder', 'admin'), deleteOpportunity);


export default router;
