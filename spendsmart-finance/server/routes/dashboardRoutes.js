import express from 'express';
import { getDashboard } from '../controllers/dashboardController.js';
import authenticate from '../middleware/authMiddleware.js';
import { validateDateRange } from '../utils/validators.js';

const router = express.Router();

router.get('/', authenticate, validateDateRange, getDashboard);

export default router;
