import express from 'express';
import { generateOpportunityPitch, calculateSkillMatch, generateUserBio } from '../controllers/aiController.js';

const router = express.Router();

router.post('/generate-opportunity', generateOpportunityPitch);
router.post('/match-percentage', calculateSkillMatch);
router.post('/generate-bio', generateUserBio);

export default router;
