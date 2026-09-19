import express from 'express';
import { getPosts, createPost, likePost, addComment } from '../controllers/communityController.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/posts', getPosts);
router.post('/posts', verifyToken, createPost);
router.post('/posts/:id/like', verifyToken, likePost);
router.post('/posts/:id/comment', verifyToken, addComment);

export default router;
