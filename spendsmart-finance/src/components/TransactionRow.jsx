// src/components/TransactionRow.jsx
import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getCategoryConfig } from '../utils/data';

export default function TransactionRow({ transaction, onEdit }) {
  const { deleteTransaction } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const menuRef = useRef(null);

  const { merchant, title, category, date, amount, method, type } = transaction;
  const displayTitle = title || merchant || 'Transaction';
  const cfg = getCategoryConfig(category, amount);
  const isIncome = type === 'income' || amount >= 0;

  // Format date display
  const displayDate = date
    ? new Date(date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'Unknown';

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (!menuRef.current?.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const handleDelete = () => {
    if (confirmDelete) {
      deleteTransaction(transaction._id || transaction.id);
    } else {
      setConfirmDelete(true);
    }
  };

  if (confirmDelete) {
    return (
      <div className="flex items-center gap-3 py-3 px-4 rounded-2xl bg-error-container/20 border border-error/20 animate-fade-in">
        <span className="material-icons-round text-error text-base">warning</span>
        <p className="flex-1 text-sm text-on-surface">Delete "{displayTitle}"?</p>
        <button
          onClick={() => setConfirmDelete(false)}
          className="px-3 py-1.5 text-xs font-semibold text-on-surface-variant bg-surface-container rounded-xl hover:bg-surface-container-high transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className="px-3 py-1.5 text-xs font-semibold text-white bg-error rounded-xl hover:opacity-90 transition-opacity"
        >
          Delete
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 py-3 px-4 rounded-2xl hover:bg-surface-container-low transition-colors group">
      {/* Category icon */}
      <div className={`w-9 h-9 rounded-2xl ${cfg.iconBg} ${cfg.iconColor} flex items-center justify-center flex-shrink-0`}>
        <span className="material-icons-round text-base">{cfg.icon}</span>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-on-surface font-headline truncate">{displayTitle}</p>
        <p className="text-xs text-on-surface-variant truncate">{category} · {displayDate}</p>
      </div>

      {/* Amount */}
      <div className="text-right flex-shrink-0 mr-1">
        <p className={`text-sm font-bold font-headline ${isIncome ? 'text-secondary' : 'text-on-surface'}`}>
          {isIncome ? '+' : '-'}${amount.toFixed(2)}
        </p>
        <p className="text-xs text-on-surface-variant">{method}</p>
      </div>

      {/* 3-dot menu */}
      <div ref={menuRef} className="relative flex-shrink-0">
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Transaction options"
        >
          <span className="material-icons-round text-base">more_vert</span>
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-9 w-36 bg-surface-container-lowest rounded-2xl shadow-premium border border-outline-variant/20 overflow-hidden z-20 animate-fade-in">
            <button
              onClick={() => { setMenuOpen(false); onEdit(transaction); }}
              className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
            >
              <span className="material-icons-round text-base text-on-surface-variant">edit</span>
              Edit
            </button>
            <button
              onClick={() => { setMenuOpen(false); setConfirmDelete(true); }}
              className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-error hover:bg-error-container/20 transition-colors"
            >
              <span className="material-icons-round text-base">delete</span>
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
