// src/pages/Budget.jsx
import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useApp } from '../context/AppContext';

export default function Budget() {
  const { budgetsWithSpend, updateBudget } = useApp();
  const [editingCategory, setEditingCategory] = useState(null);
  const [editValue, setEditValue]             = useState('');

  const totalAllocated = budgetsWithSpend.reduce((s, b) => s + b.allocated, 0);
  const totalSpent     = budgetsWithSpend.reduce((s, b) => s + b.spent, 0);
  const overBudget     = budgetsWithSpend.filter(b => b.spent > b.allocated);

  const startEdit = (b) => {
    setEditingCategory(b.category);
    setEditValue(String(b.allocated));
  };

  const commitEdit = (category) => {
    const val = parseFloat(editValue);
    if (!isNaN(val) && val > 0) updateBudget(category, val);
    setEditingCategory(null);
  };

  const handleKeyDown = (e, category) => {
    if (e.key === 'Enter')  commitEdit(category);
    if (e.key === 'Escape') setEditingCategory(null);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-8 animate-fade-in">
        <div>
          <h2 className="text-2xl font-headline font-bold text-on-surface">Budget</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Track your spending against monthly allocations. Click <span className="material-icons-round text-xs align-middle">edit</span> on any card to adjust.
          </p>
        </div>
        {overBudget.length > 0 && (
          <div className="flex items-center gap-2 text-sm font-medium text-tertiary bg-tertiary-container/15 px-4 py-2 rounded-2xl">
            <span className="material-icons-round text-base">warning</span>
            {overBudget.length} {overBudget.length === 1 ? 'category' : 'categories'} over budget
          </div>
        )}
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-5 mb-7 animate-fade-in">
        {[
          { label: 'Total Allocated', value: `$${totalAllocated.toLocaleString()}`,          icon: 'account_balance_wallet', color: 'text-primary',   bg: 'bg-primary-fixed/60'         },
          { label: 'Total Spent',     value: `$${totalSpent.toFixed(2)}`,                     icon: 'payments',               color: 'text-tertiary',  bg: 'bg-tertiary-container/20'    },
          { label: 'Remaining',       value: `$${Math.max(0, totalAllocated - totalSpent).toFixed(2)}`, icon: 'savings', color: 'text-secondary', bg: 'bg-secondary-container/30' },
        ].map(s => (
          <div key={s.label} className="bg-surface-container-lowest rounded-3xl p-5 shadow-card flex items-center gap-4">
            <div className={`w-10 h-10 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center flex-shrink-0`}>
              <span className="material-icons-round text-base">{s.icon}</span>
            </div>
            <div>
              <p className="text-xs text-on-surface-variant font-label">{s.label}</p>
              <p className="text-lg font-bold font-headline text-on-surface">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Budget cards */}
      <div className="grid grid-cols-2 gap-5 animate-fade-in">
        {budgetsWithSpend.map((b) => {
          const pct       = b.allocated > 0 ? Math.min(100, Math.round((b.spent / b.allocated) * 100)) : 0;
          const isOver    = b.spent > b.allocated;
          const isWarning = pct >= 80 && !isOver;
          const remaining = Math.max(0, b.allocated - b.spent);
          const barColor  = isOver ? '#ba1a1a' : isWarning ? '#d97706' : b.color;
          const textColor = isOver ? 'text-error' : isWarning ? 'text-[#d97706]' : 'text-secondary';
          const isEditing = editingCategory === b.category;

          return (
            <div
              key={b.category}
              className={`bg-surface-container-lowest rounded-3xl p-6 shadow-card border transition-colors ${
                isOver ? 'border-error/20' : 'border-transparent'
              }`}
            >
              {/* Card header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: b.color + '22', color: b.color }}
                  >
                    <span className="material-icons-round text-base">{b.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold font-headline text-on-surface">{b.category}</p>

                    {/* Editable allocation */}
                    {isEditing ? (
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-xs text-on-surface-variant">$</span>
                        <input
                          autoFocus
                          type="number"
                          min="1"
                          step="10"
                          value={editValue}
                          onChange={e => setEditValue(e.target.value)}
                          onBlur={() => commitEdit(b.category)}
                          onKeyDown={e => handleKeyDown(e, b.category)}
                          className="w-24 text-xs font-semibold text-on-surface bg-surface-container rounded-lg px-2 py-0.5 outline-none focus:ring-2 focus:ring-primary/30"
                        />
                        <button
                          onClick={() => commitEdit(b.category)}
                          className="text-secondary hover:opacity-80 transition-opacity"
                          title="Save"
                        >
                          <span className="material-icons-round text-sm">check</span>
                        </button>
                        <button
                          onClick={() => setEditingCategory(null)}
                          className="text-on-surface-variant hover:opacity-80 transition-opacity"
                          title="Cancel"
                        >
                          <span className="material-icons-round text-sm">close</span>
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs text-on-surface-variant">
                        ${b.spent.toFixed(2)}{' '}
                        <span className="opacity-60">of</span>{' '}
                        ${b.allocated.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <span className={`text-sm font-bold font-headline ${textColor}`}>{pct}%</span>
                  {!isEditing && (
                    <button
                      onClick={() => startEdit(b)}
                      className="w-7 h-7 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors ml-1"
                      title={`Edit ${b.category} budget`}
                    >
                      <span className="material-icons-round text-sm">edit</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2.5 bg-surface-container rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${pct}%`, backgroundColor: barColor }}
                />
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center">
                <p className="text-xs text-on-surface-variant">
                  {isOver
                    ? <span className="text-error font-semibold">Over by ${(b.spent - b.allocated).toFixed(2)}</span>
                    : `$${remaining.toFixed(2)} remaining`
                  }
                </p>
                {isWarning && (
                  <p className="text-xs text-[#d97706] font-semibold flex items-center gap-1">
                    <span className="material-icons-round text-xs">warning</span>
                    Near limit
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-on-surface-variant text-center mt-6">
        Budget spend is calculated from current month's expense transactions only.
        Click <span className="material-icons-round text-xs align-middle">edit</span> on any card to adjust the allocation.
      </p>
    </DashboardLayout>
  );
}
