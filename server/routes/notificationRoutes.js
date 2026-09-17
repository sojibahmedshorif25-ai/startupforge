import express from 'express';
import { getNotifications, markAsRead } from '../controllers/notificationController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', verifyToken, getNotifications);
router.patch('/read/:id', verifyToken, markAsRead);

export default router;
