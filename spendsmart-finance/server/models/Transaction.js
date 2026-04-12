import mongoose from 'mongoose';

const EXPENSE_CATEGORIES = [
  'Food & Groceries', 'Entertainment', 'Transportation', 'Shopping',
  'Utilities', 'Health & Fitness', 'Housing', 'Education', 'Personal', 'Other',
];

const INCOME_CATEGORIES = [
  'Salary', 'Freelance', 'Investment', 'Bonus', 'Other Income',
];

const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    type: {
      type: String,
      required: [true, 'Transaction type is required'],
      enum: { values: ['income', 'expense'], message: 'Type must be "income" or "expense"' },
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: { values: ALL_CATEGORIES, message: '"{VALUE}" is not a valid category' },
    },
    date:   { type: Date,   default: Date.now },
    method: { type: String, trim: true, maxlength: [100, 'Method cannot exceed 100 characters'], default: '' },
    notes:  { type: String, trim: true, maxlength: [500, 'Notes cannot exceed 500 characters'],  default: '' },
  },
  {
    timestamps: true,
    toJSON: { transform: (_doc, ret) => { delete ret.__v; return ret; } },
  }
);

transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1, date: -1 });
transactionSchema.index({ userId: 1, category: 1 });

transactionSchema.statics.ALL_CATEGORIES      = ALL_CATEGORIES;
transactionSchema.statics.EXPENSE_CATEGORIES  = EXPENSE_CATEGORIES;
transactionSchema.statics.INCOME_CATEGORIES   = INCOME_CATEGORIES;

export default mongoose.model('Transaction', transactionSchema);
