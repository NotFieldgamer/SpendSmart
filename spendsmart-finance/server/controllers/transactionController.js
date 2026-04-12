import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';

const ALLOWED_SORT = ['date', 'amount', 'title', 'createdAt'];

export const addTransaction = async (req, res, next) => {
  try {
    const { title, amount, type, category, date, method, notes } = req.body;
    const transaction = await Transaction.create({
      userId: req.user.userId,
      title, amount, type, category,
      date:   date   || new Date(),
      method: method || '',
      notes:  notes  || '',
    });
    return sendSuccess(res, { transaction }, 'Transaction created', 201);
  } catch (err) {
    next(err);
  }
};

export const getTransactions = async (req, res, next) => {
  try {
    const { type, category, startDate, endDate, page = 1, limit = 20, sortBy = 'date', order = 'desc' } = req.query;

    const filter = { userId: req.user.userId };
    if (type)     filter.type     = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate)   filter.date.$lte = new Date(endDate);
    }

    const pageNum  = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
    const sortField = ALLOWED_SORT.includes(sortBy) ? sortBy : 'date';

    const [transactions, total] = await Promise.all([
      Transaction.find(filter).sort({ [sortField]: order === 'asc' ? 1 : -1 }).skip((pageNum - 1) * limitNum).limit(limitNum).lean(),
      Transaction.countDocuments(filter),
    ]);

    return sendSuccess(res, {
      transactions,
      pagination: {
        total, page: pageNum, limit: limitNum,
        pages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1,
      },
    }, 'Transactions fetched');
  } catch (err) {
    next(err);
  }
};

export const getTransaction = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return sendError(res, 'Invalid transaction ID', 400);
    const transaction = await Transaction.findOne({ _id: req.params.id, userId: req.user.userId });
    if (!transaction) return sendError(res, 'Transaction not found', 404);
    return sendSuccess(res, { transaction }, 'Transaction fetched');
  } catch (err) {
    next(err);
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return sendError(res, 'Invalid transaction ID', 400);
    const { title, amount, type, category, date, method, notes } = req.body;
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title, amount, type, category, date, method, notes },
      { new: true, runValidators: true }
    );
    if (!transaction) return sendError(res, 'Transaction not found', 404);
    return sendSuccess(res, { transaction }, 'Transaction updated');
  } catch (err) {
    next(err);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return sendError(res, 'Invalid transaction ID', 400);
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!transaction) return sendError(res, 'Transaction not found', 404);
    return sendSuccess(res, null, 'Transaction deleted');
  } catch (err) {
    next(err);
  }
};
