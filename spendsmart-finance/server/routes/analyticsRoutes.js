import express from 'express';
import { getAdvancedAnalytics } from '../controllers/analyticsController.js';
import authenticate from '../middleware/authMiddleware.js';
import requirePro from '../middleware/proMiddleware.js';

const router = express.Router();

router.get('/advanced', authenticate, requirePro, getAdvancedAnalytics);

export default router;
