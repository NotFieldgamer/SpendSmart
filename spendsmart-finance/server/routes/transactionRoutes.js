import express from 'express';
import * as tx from '../controllers/transactionController.js';
import authenticate from '../middleware/authMiddleware.js';
import { validateTransaction, validateObjectId, validateDateRange } from '../utils/validators.js';

const router = express.Router();

router.use(authenticate);

router.route('/')
  .get(validateDateRange, tx.getTransactions)
  .post(validateTransaction, tx.addTransaction);

router.route('/:id')
  .get(validateObjectId('id'),                           tx.getTransaction)
  .put(validateObjectId('id'), validateTransaction,      tx.updateTransaction)
  .delete(validateObjectId('id'),                        tx.deleteTransaction);

export default router;
