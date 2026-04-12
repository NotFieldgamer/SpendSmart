import { useState, useCallback, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../utils/data';


const TODAY = new Date().toISOString().split('T')[0];

const initialForm = {
  title: '',
  amount: '',
  type: 'expense',
  category: '',
  date: TODAY,
  method: '',
  notes: '',
};

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 mt-1.5 text-xs text-error animate-fade-in">
      <span className="material-icons-round text-sm">error_outline</span>
      {message}
    </p>
  );
}

export default function TransactionForm({ transaction, onClose }) {
  const { addTransaction, editTransaction } = useApp();
  const isEdit = Boolean(transaction);
  const firstInputRef = useRef(null);

  const [form, setForm] = useState(() => {
    if (!transaction) return initialForm;
    return {
      title:    transaction.title || transaction.merchant || '',
      amount:   String(transaction.amount || ''),
      type:     transaction.type || (transaction.amount >= 0 ? 'income' : 'expense'),
      category: transaction.category || '',
      date:     transaction.date || TODAY,
      method:   transaction.method || '',
      notes:    transaction.notes || '',
    };
  });

  const [errors, setErrors]   = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Auto-focus first field
  useEffect(() => { firstInputRef.current?.focus(); }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Clear category when type changes (income/expense have different categories)
  const setType = (type) => {
    setForm(prev => ({ ...prev, type, category: '' }));
    setErrors(prev => ({ ...prev, category: '' }));
  };

  const setField = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
  }, []);

  // ── Validation ────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!form.title.trim())
      errs.title = 'Title / description is required';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      errs.amount = 'Enter a valid amount greater than zero';
    if (!form.category)
      errs.category = 'Please select a category';
    if (!form.date)
      errs.date = 'Date is required';
    return errs;
  };

  // ── Submit ─────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const payload = {
        title:    form.title.trim(),
        amount:   Number(form.amount),
        type:     form.type,
        category: form.category,
        date:     form.date,
        method:   form.method.trim() || (form.type === 'income' ? 'ACH Deposit' : 'VISA •••• 4242'),
        notes:    form.notes.trim(),
      };

      if (isEdit) {
        await editTransaction(transaction._id || transaction.id, payload);
      } else {
        await addTransaction(payload);
      }
      onClose();
    } catch {
      // Error already shown via toast inside context
    } finally {
      setSubmitting(false);
    }
  };

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    // Backdrop
    <div
      className="fixed inset-0 bg-on-surface/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-surface-container-lowest rounded-3xl shadow-premium w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-4 border-b border-outline-variant/20">
          <h2 className="text-lg font-headline font-bold text-on-surface">
            {isEdit ? 'Edit Transaction' : 'New Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-2xl bg-surface-container hover:bg-surface-container-high flex items-center justify-center transition-colors"
          >
            <span className="material-icons-round text-on-surface-variant text-base">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="p-7 space-y-5">
          {/* Type toggle */}
          <div>
            <label className="text-xs font-label uppercase tracking-widest text-on-surface-variant block mb-2">
              Type
            </label>
            <div className="flex rounded-2xl bg-surface-container p-1 gap-1">
              {['expense', 'income'].map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
                    form.type === t
                      ? t === 'income'
                        ? 'bg-secondary-container/30 text-secondary shadow-sm'
                        : 'bg-primary-fixed/60 text-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {t === 'income' ? '↑ Income' : '↓ Expense'}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-label uppercase tracking-widest text-on-surface-variant block mb-2">
              Title / Description <span className="text-error">*</span>
            </label>
            <input
              ref={firstInputRef}
              type="text"
              value={form.title}
              onChange={e => setField('title', e.target.value)}
              placeholder="e.g. Whole Foods, Netflix..."
              className={`w-full px-4 py-3 bg-surface-container-low rounded-2xl text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none transition-all
                ${errors.title ? 'ring-2 ring-error/40' : 'focus:ring-2 focus:ring-primary/20'}`}
            />
            <FieldError message={errors.title} />
          </div>

          {/* Amount + Date row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-label uppercase tracking-widest text-on-surface-variant block mb-2">
                Amount ($) <span className="text-error">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">$</span>
                <input
                  type="number"
                  value={form.amount}
                  onChange={e => setField('amount', e.target.value)}
                  placeholder="0.00"
                  min="0.01"
                  step="0.01"
                  className={`w-full pl-7 pr-4 py-3 bg-surface-container-low rounded-2xl text-sm text-on-surface outline-none transition-all
                    ${errors.amount ? 'ring-2 ring-error/40' : 'focus:ring-2 focus:ring-primary/20'}`}
                />
              </div>
              <FieldError message={errors.amount} />
            </div>

            <div>
              <label className="text-xs font-label uppercase tracking-widest text-on-surface-variant block mb-2">
                Date <span className="text-error">*</span>
              </label>
              <input
                type="date"
                value={form.date}
                onChange={e => setField('date', e.target.value)}
                max={TODAY}
                className={`w-full px-4 py-3 bg-surface-container-low rounded-2xl text-sm text-on-surface outline-none transition-all
                  ${errors.date ? 'ring-2 ring-error/40' : 'focus:ring-2 focus:ring-primary/20'}`}
              />
              <FieldError message={errors.date} />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-label uppercase tracking-widest text-on-surface-variant block mb-2">
              Category <span className="text-error">*</span>
            </label>
            <div className="relative">
              <select
                value={form.category}
                onChange={e => setField('category', e.target.value)}
                className={`w-full appearance-none px-4 py-3 pr-9 bg-surface-container-low rounded-2xl text-sm outline-none cursor-pointer transition-all
                  ${form.category ? 'text-on-surface' : 'text-on-surface-variant/50'}
                  ${errors.category ? 'ring-2 ring-error/40' : 'focus:ring-2 focus:ring-primary/20'}`}
              >
                <option value="">Select a category…</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <span className="material-icons-round absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base pointer-events-none">
                expand_more
              </span>
            </div>
            <FieldError message={errors.category} />
          </div>

          {/* Payment method (optional) */}
          <div>
            <label className="text-xs font-label uppercase tracking-widest text-on-surface-variant block mb-2">
              Payment Method
              <span className="ml-1 text-on-surface-variant/50 normal-case tracking-normal">(optional)</span>
            </label>
            <input
              type="text"
              value={form.method}
              onChange={e => setField('method', e.target.value)}
              placeholder="e.g. VISA •••• 4242, ACH Deposit…"
              className="w-full px-4 py-3 bg-surface-container-low rounded-2xl text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 py-3 bg-surface-container hover:bg-surface-container-high rounded-2xl text-sm font-semibold text-on-surface-variant transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 bg-primary-gradient text-on-primary rounded-2xl text-sm font-semibold shadow-sm hover:-translate-y-0.5 hover:shadow-premium transition-all disabled:opacity-60 disabled:translate-y-0 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                isEdit ? 'Update Transaction' : 'Add Transaction'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
