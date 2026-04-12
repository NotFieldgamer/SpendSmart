import Transaction from '../models/Transaction.js';
import { sendError } from '../utils/responseHelper.js';

const csvCell = (value) => {
  if (value === null || value === undefined) return '';
  const str = String(value);
  return str.includes(',') || str.includes('"') || str.includes('\n')
    ? `"${str.replace(/"/g, '""')}"`
    : str;
};

export const exportTransactions = async (req, res, next) => {
  try {
    const { format = 'json', startDate, endDate, type, category } = req.query;

    if (format !== 'json' && format !== 'csv') {
      return sendError(res, 'Invalid format. Use "json" or "csv".', 400);
    }

    const filter = { userId: req.user.userId };
    if (type)     filter.type     = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate)   filter.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 }).lean();
    const timestamp    = new Date().toISOString().replace(/[:.]/g, '-');

    if (format === 'csv') {
      const headers = ['ID', 'Title', 'Amount', 'Type', 'Category', 'Date', 'Method', 'Notes'];
      const rows = transactions.map(tx =>
        [tx._id, tx.title, tx.amount, tx.type, tx.category,
          new Date(tx.date).toISOString().split('T')[0], tx.method, tx.notes
        ].map(csvCell).join(',')
      );
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="spendsmart-${timestamp}.csv"`);
      res.setHeader('X-Record-Count', String(transactions.length));
      return res.send('\uFEFF' + [headers.join(','), ...rows].join('\r\n'));
    }

    const totalIncome  = transactions.filter(t => t.type === 'income') .reduce((s, t) => s + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="spendsmart-${timestamp}.json"`);
    res.setHeader('X-Record-Count', String(transactions.length));
    return res.json({
      exportedAt: new Date().toISOString(),
      filters: { startDate, endDate, type, category },
      summary: {
        count: transactions.length,
        totalIncome:  +totalIncome.toFixed(2),
        totalExpense: +totalExpense.toFixed(2),
        balance: +(totalIncome - totalExpense).toFixed(2),
      },
      transactions,
    });
  } catch (err) {
    next(err);
  }
};
