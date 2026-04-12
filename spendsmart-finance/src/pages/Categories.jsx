// src/pages/Categories.jsx
import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import TransactionForm from '../components/TransactionForm';
import EmptyState from '../components/EmptyState';
import { useApp } from '../context/AppContext';

export default function Categories() {
  const { categoryData, transactions } = useApp();
  const [showForm, setShowForm] = useState(false);

  return (
    <DashboardLayout>
      <div className="flex items-start justify-between mb-8 animate-fade-in">
        <div>
          <h2 className="text-2xl font-headline font-bold text-on-surface">Categories</h2>
          <p className="text-sm text-on-surface-variant mt-1">Visualize your spending by category.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-gradient text-on-primary rounded-2xl text-sm font-semibold shadow-sm hover:-translate-y-0.5 hover:shadow-premium transition-all"
        >
          <span className="material-icons-round text-base">add</span>
          New Transaction
        </button>
      </div>

      {categoryData.length === 0 ? (
        <EmptyState
          icon="category"
          title="No expense data yet"
          description="Add expense transactions to see your category breakdown."
          action={() => setShowForm(true)}
          actionLabel="Add Transaction"
        />
      ) : (
        <div className="grid grid-cols-3 gap-5 animate-fade-in">
          {categoryData.map((cat) => {
            const txCount = transactions.filter(t => t.category === cat.category && t.amount < 0).length;
            return (
              <div key={cat.category} className="bg-surface-container-lowest rounded-3xl p-6 shadow-card hover:shadow-premium transition-shadow">
                <div className="flex items-start justify-between mb-5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: cat.color + '22' }}
                  >
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-headline font-bold text-on-surface">{cat.percentage}%</span>
                    <p className="text-xs text-on-surface-variant">{txCount} transaction{txCount !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <p className="text-sm font-semibold font-headline text-on-surface mb-1">{cat.category}</p>
                <p className="text-xs text-on-surface-variant mb-4">
                  ${cat.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} total spent
                </p>
                <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && <TransactionForm onClose={() => setShowForm(false)} />}
    </DashboardLayout>
  );
}
