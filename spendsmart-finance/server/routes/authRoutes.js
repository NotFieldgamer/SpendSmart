import express from 'express';
import { signup, login, getMe, updateMe, deleteMe } from '../controllers/authController.js';
import authenticate from '../middleware/authMiddleware.js';
import { validateSignup, validateLogin } from '../utils/validators.js';

const router = express.Router();

router.post('/signup', validateSignup, signup);
router.post('/login',  validateLogin,  login);

router.use(authenticate);
router.get('/me',    getMe);
router.put('/me',    updateMe);
router.delete('/me', deleteMe);

export default router;
