import { Router } from 'express';
import { createCheckoutSession, paymentSuccess, getAllPayments } from '../controllers/paymentController.js';
import { verifyToken, authorizeRoles } from '../middleware/auth.js';

const router = Router();

router.post('/create-checkout', verifyToken, authorizeRoles('founder'), createCheckoutSession);
router.get('/success', verifyToken, paymentSuccess);
router.get('/all', verifyToken, authorizeRoles('admin'), getAllPayments);

export default router;
