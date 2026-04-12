import { body, param, query, validationResult } from 'express-validator';
import Transaction from '../models/Transaction.js';

const validate = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array().map(e => ({ field: e.path, message: e.msg }));
    return res.status(400).json({ success: false, message: errors[0].message, errors, timestamp: new Date().toISOString() });
  }
  next();
};

export const validateSignup = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
  body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate,
];

export const validateLogin = [
  body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validate,
];

export const validateTransaction = [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('type').isIn(['income', 'expense']).withMessage('Type must be "income" or "expense"'),
  body('category').notEmpty().withMessage('Category is required').custom(value => {
    if (!Transaction.ALL_CATEGORIES.includes(value)) throw new Error(`"${value}" is not a valid category`);
    return true;
  }),
  body('date').optional().isISO8601().withMessage('Date must be a valid ISO 8601 date'),
  body('method').optional().trim().isLength({ max: 100 }).withMessage('Method cannot exceed 100 characters'),
  body('notes').optional().trim().isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters'),
  validate,
];

export const validateObjectId = (field = 'id') => [
  param(field).isMongoId().withMessage(`Invalid ${field} format`),
  validate,
];

export const validateDateRange = [
  query('startDate').optional().isISO8601().withMessage('startDate must be a valid ISO 8601 date'),
  query('endDate').optional().isISO8601().withMessage('endDate must be a valid ISO 8601 date'),
  validate,
];
