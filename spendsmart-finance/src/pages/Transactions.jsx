// src/pages/Transactions.jsx
import { useState, useMemo } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import TransactionRow from '../components/TransactionRow';
import TransactionForm from '../components/TransactionForm';
import EmptyState from '../components/EmptyState';
import { useApp } from '../context/AppContext';
import { ALL_CATEGORIES } from '../utils/data';

const SORT_OPTIONS = [
  { value: 'date-desc',   label: 'Newest first'    },
  { value: 'date-asc',    label: 'Oldest first'    },
  { value: 'amount-desc', label: 'Highest amount'  },
  { value: 'amount-asc',  label: 'Lowest amount'   },
];

export default function Transactions() {
  const { transactions, txLoading } = useApp();

  const [search, setSearch]       = useState('');
  const [category, setCategory]   = useState('All');
  const [typeFilter, setTypeFilter] = useState('All'); // All | Income | Expense
  const [sortBy, setSortBy]       = useState('date-desc');
  const [showForm, setShowForm]   = useState(false);
  const [editTx, setEditTx]       = useState(null);

  // ── Filtered + sorted transactions ──────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...transactions];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(tx =>
        (tx.title || tx.merchant || '').toLowerCase().includes(q) ||
        tx.category.toLowerCase().includes(q) ||
        (tx.method || '').toLowerCase().includes(q)
      );
    }

    if (category !== 'All') {
      list = list.filter(tx => tx.category === category);
    }

    // type field is 'income' | 'expense' from API
    if (typeFilter === 'Income')  list = list.filter(tx => tx.type === 'income');
    if (typeFilter === 'Expense') list = list.filter(tx => tx.type === 'expense');

    const [field, dir] = sortBy.split('-');
    list.sort((a, b) => {
      const av = field === 'date' ? new Date(a.date) : a.amount;
      const bv = field === 'date' ? new Date(b.date) : b.amount;
      return dir === 'desc' ? bv - av : av - bv;
    });

    return list;
  }, [transactions, search, category, typeFilter, sortBy]);

  // ── Stats for the filtered set (amounts are always positive from API) ──
  const filteredStats = useMemo(() => {
    const income   = filtered.filter(t => t.type === 'income') .reduce((s, t) => s + t.amount, 0);
    const expenses = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expenses, count: filtered.length };
  }, [filtered]);

  const openEdit  = (tx) => { setEditTx(tx); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditTx(null); };

  const clearFilters = () => {
    setSearch(''); setCategory('All'); setTypeFilter('All'); setSortBy('date-desc');
  };

  const hasFilters = search || category !== 'All' || typeFilter !== 'All';

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-8 animate-fade-in">
        <div>
          <h2 className="text-2xl font-headline font-bold text-on-surface">Transactions</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            {txLoading
              ? 'Loading your transactions…'
              : `Monitor and manage your sanctuary's flow. (${transactions.length} total)`}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          disabled={txLoading}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-gradient text-on-primary rounded-2xl text-sm font-semibold shadow-sm hover:-translate-y-0.5 hover:shadow-premium transition-all disabled:opacity-60"
        >
          <span className="material-icons-round text-base">add</span>
          New Entry
        </button>
      </div>

      {/* Loading skeleton */}
      {txLoading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 animate-fade-in">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-on-surface-variant">Loading transactions from server…</p>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4 mb-5 animate-fade-in">
        {[
          { label: 'Shown',    value: filteredStats.count, icon: 'receipt_long',   color: 'text-primary',   bg: 'bg-primary-fixed/60'       },
          { label: 'Income',   value: `$${filteredStats.income.toFixed(2)}`,    icon: 'trending_up',    color: 'text-secondary', bg: 'bg-secondary-container/30' },
          { label: 'Expenses', value: `$${filteredStats.expenses.toFixed(2)}`,  icon: 'trending_down',  color: 'text-tertiary',  bg: 'bg-tertiary-container/20'  },
          { label: 'Net',
            value: `${(filteredStats.income - filteredStats.expenses) >= 0 ? '+' : ''}$${(filteredStats.income - filteredStats.expenses).toFixed(2)}`,
            icon: 'account_balance', color: 'text-primary', bg: 'bg-primary-fixed/60' },
        ].map(s => (
          <div key={s.label} className="bg-surface-container-lowest rounded-3xl p-5 shadow-card flex items-center gap-4">
            <div className={`w-9 h-9 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center flex-shrink-0`}>
              <span className="material-icons-round text-base">{s.icon}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-on-surface-variant font-label">{s.label}</p>
              <p className="text-base font-bold font-headline text-on-surface truncate">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="bg-surface-container-lowest rounded-3xl shadow-card p-4 mb-5 animate-fade-in">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base pointer-events-none">search</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search merchant, category…"
              className="w-full pl-9 pr-4 py-2.5 bg-surface-container-low rounded-2xl text-sm text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:ring-1 focus:ring-primary/20 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface">
                <span className="material-icons-round text-base">close</span>
              </button>
            )}
          </div>

          {/* Type pills */}
          {['All', 'Income', 'Expense'].map(t => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all ${
                typeFilter === t
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {t}
            </button>
          ))}

          {/* Category */}
          <div className="relative">
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2.5 bg-surface-container-low rounded-2xl text-sm text-on-surface outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              {ALL_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <span className="material-icons-round absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-base pointer-events-none">expand_more</span>
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-8 py-2.5 bg-surface-container-low rounded-2xl text-sm text-on-surface outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <span className="material-icons-round absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-base pointer-events-none">sort</span>
          </div>

          {/* Clear filters */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2.5 text-sm text-on-surface-variant hover:text-on-surface bg-surface-container-low rounded-2xl transition-colors"
            >
              <span className="material-icons-round text-base">filter_alt_off</span>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Transaction list */}
      <div className="bg-surface-container-lowest rounded-3xl shadow-card overflow-hidden animate-fade-in">
        {/* Table header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_auto] gap-4 px-6 py-3.5 border-b border-outline-variant/20">
          {['Transaction', 'Category', 'Date', 'Amount'].map(h => (
            <p key={h} className="text-xs font-label uppercase tracking-widest text-on-surface-variant font-semibold">{h}</p>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-outline-variant/10">
          {filtered.length === 0 ? (
            <EmptyState
              icon="receipt_long"
              title="No transactions found"
              description={hasFilters ? 'Try adjusting your filters.' : 'Add your first transaction to get started.'}
              action={!hasFilters ? () => setShowForm(true) : clearFilters}
              actionLabel={!hasFilters ? 'Add Transaction' : 'Clear Filters'}
            />
          ) : (
            filtered.map(tx => (
              <div key={tx._id || tx.id} className="px-2">
                <TransactionRow transaction={tx} onEdit={openEdit} />
              </div>
            ))
          )}
        </div>

        {/* Footer count */}
        {filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-outline-variant/20">
            <p className="text-xs text-on-surface-variant font-label">
              Showing {filtered.length} of {transactions.length} transactions
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit modal */}
      {showForm && (
        <TransactionForm transaction={editTx} onClose={closeForm} />
      )}
    </DashboardLayout>
  );
}
