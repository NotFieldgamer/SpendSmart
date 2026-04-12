import express from 'express';
import { exportTransactions } from '../controllers/exportController.js';
import authenticate from '../middleware/authMiddleware.js';
import requirePro from '../middleware/proMiddleware.js';
import { validateDateRange } from '../utils/validators.js';

const router = express.Router();

router.get('/', authenticate, requirePro, validateDateRange, exportTransactions);

export default router;
