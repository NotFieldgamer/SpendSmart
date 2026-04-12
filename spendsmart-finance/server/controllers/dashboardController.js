import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import { sendSuccess } from '../utils/responseHelper.js';

export const getDashboard = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate) dateFilter.$gte = new Date(startDate);
    if (endDate)   dateFilter.$lte = new Date(endDate);

    const baseMatch = {
      userId,
      ...(Object.keys(dateFilter).length ? { date: dateFilter } : {}),
    };

    const [summary = {}] = await Transaction.aggregate([
      { $match: baseMatch },
      {
        $group: {
          _id: null,
          totalIncome:  { $sum: { $cond: [{ $eq: ['$type', 'income']  }, '$amount', 0] } },
          totalExpense: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } },
          count: { $sum: 1 },
        },
      },
    ]);

    const income  = summary.totalIncome  ?? 0;
    const expense = summary.totalExpense ?? 0;

    const categoryBreakdown = await Transaction.aggregate([
      { $match: { ...baseMatch, type: 'expense' } },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
      {
        $project: {
          _id: 0,
          category: '$_id',
          total: { $round: ['$total', 2] },
          count: 1,
          percentage: { $round: [{ $multiply: [{ $divide: ['$total', { $max: [expense, 1] }] }, 100] }, 1] },
        },
      },
    ]);

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const rawMonthly = await Transaction.aggregate([
      { $match: { userId, date: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' }, type: '$type' },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const monthlyMap = {};
    rawMonthly.forEach(({ _id, total }) => {
      const key = `${_id.year}-${String(_id.month).padStart(2, '0')}`;
      if (!monthlyMap[key]) monthlyMap[key] = { month: key, income: 0, expenses: 0 };
      if (_id.type === 'income')  monthlyMap[key].income   = +total.toFixed(2);
      if (_id.type === 'expense') monthlyMap[key].expenses = +total.toFixed(2);
    });

    const monthlyCashFlow   = Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month));
    const recentTransactions = await Transaction.find({ userId }).sort({ date: -1 }).limit(5).lean();

    return sendSuccess(res, {
      balance:  +(income - expense).toFixed(2),
      income:   +income.toFixed(2),
      expense:  +expense.toFixed(2),
      transactionCount: summary.count ?? 0,
      savingsRate: income > 0 ? +(((income - expense) / income) * 100).toFixed(1) : 0,
      categoryBreakdown,
      monthlyCashFlow,
      recentTransactions,
    }, 'Dashboard data fetched');
  } catch (err) {
    next(err);
  }
};
