import express from 'express';
import {
  generateOpportunityPitch,
  calculateSkillMatch,
  generateUserBio,
  matchOpportunities,
  analyzeResume,
  assistantChat,
} from '../controllers/aiController.js';

const router = express.Router();

router.post('/generate-opportunity', generateOpportunityPitch);
router.post('/match-percentage', calculateSkillMatch);
router.post('/generate-bio', generateUserBio);
router.post('/match', matchOpportunities);
router.post('/resume', analyzeResume);
router.post('/assistant', assistantChat);

export default router;
