import mongoose from 'mongoose';
import Transaction from '../models/Transaction.js';
import { sendSuccess } from '../utils/responseHelper.js';

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export const getAdvancedAnalytics = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const year   = parseInt(req.query.year) || new Date().getFullYear();

    const yearStart = new Date(`${year}-01-01T00:00:00.000Z`);
    const yearEnd   = new Date(`${year}-12-31T23:59:59.999Z`);

    const rawMonthly = await Transaction.aggregate([
      { $match: { userId, date: { $gte: yearStart, $lte: yearEnd } } },
      { $group: { _id: { month: { $month: '$date' }, type: '$type' }, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { '_id.month': 1 } },
    ]);

    const monthlyBreakdown = MONTH_NAMES.map((name, i) => {
      const m   = i + 1;
      const inc = rawMonthly.find(r => r._id.month === m && r._id.type === 'income');
      const exp = rawMonthly.find(r => r._id.month === m && r._id.type === 'expense');
      return {
        month:    name,
        income:   +(inc?.total ?? 0).toFixed(2),
        expenses: +(exp?.total ?? 0).toFixed(2),
        net:      +((inc?.total ?? 0) - (exp?.total ?? 0)).toFixed(2),
        txCount:  (inc?.count ?? 0) + (exp?.count ?? 0),
      };
    });

    const topCategories = await Transaction.aggregate([
      { $match: { userId, type: 'expense' } },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 }, avgTransaction: { $avg: '$amount' }, lastDate: { $max: '$date' } } },
      { $sort: { total: -1 } },
      { $limit: 5 },
      { $project: { _id: 0, category: '$_id', total: { $round: ['$total', 2] }, count: 1, avgTransaction: { $round: ['$avgTransaction', 2] }, lastDate: 1 } },
    ]);

    const eightWeeksAgo = new Date();
    eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

    const rawWeekly = await Transaction.aggregate([
      { $match: { userId, type: 'expense', date: { $gte: eightWeeksAgo } } },
      { $group: { _id: { week: { $week: '$date' }, year: { $year: '$date' } }, total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { '_id.year': 1, '_id.week': 1 } },
    ]);

    const weeklyTrend = rawWeekly.map(({ _id, total, count }) => ({
      week: `${_id.year}-W${String(_id.week).padStart(2, '0')}`,
      total: +total.toFixed(2),
      count,
    }));

    const now        = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const [monthExpense = {}] = await Transaction.aggregate([
      { $match: { userId, type: 'expense', date: { $gte: monthStart } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const incomeSources = await Transaction.aggregate([
      { $match: { userId, type: 'income' } },
      { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { total: -1 } },
      { $project: { _id: 0, category: '$_id', total: { $round: ['$total', 2] }, count: 1 } },
    ]);

    return sendSuccess(res, {
      year,
      monthlyBreakdown,
      topCategories,
      weeklyTrend,
      avgDailySpend: +((monthExpense.total ?? 0) / now.getDate()).toFixed(2),
      incomeSources,
    }, 'Advanced analytics fetched');
  } catch (err) {
    next(err);
  }
};
