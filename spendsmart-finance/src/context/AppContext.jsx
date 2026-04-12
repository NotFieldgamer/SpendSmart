// src/context/AppContext.jsx
import {
  createContext, useContext, useState, useEffect, useCallback, useMemo,
} from 'react';
import { DEFAULT_BUDGETS, getCategoryConfig } from '../utils/data';
import { api } from '../api/client';

const AppContext = createContext(null);

// ── Token helpers ──────────────────────────────────────────────────────
const TOKEN_KEY = 'ss-auth-token';
const getToken  = () => localStorage.getItem(TOKEN_KEY);
const saveToken = (t) => localStorage.setItem(TOKEN_KEY, t);
const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export function AppProvider({ children }) {
  // ── Auth state ────────────────────────────────────────────────────────
  const [user, setUser]         = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // true until initial check done

  // ── Transactions ──────────────────────────────────────────────────────
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading]       = useState(false);
  const [txError, setTxError]           = useState(null);

  // ── Dashboard data (from API aggregations) ────────────────────────────
  const [dashboardData, setDashboardData] = useState(null);
  const [dashLoading, setDashLoading]     = useState(false);

  // ── Budgets (local for now — Phase 5+ can persist via API) ────────────
  const [budgets, setBudgets] = useState(() => {
    try {
      const s = localStorage.getItem('ss-budgets');
      return s ? JSON.parse(s) : DEFAULT_BUDGETS;
    } catch { return DEFAULT_BUDGETS; }
  });

  // Persist budgets to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('ss-budgets', JSON.stringify(budgets));
  }, [budgets]);

  // ── Theme ─────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState(() => localStorage.getItem('ss-theme') || 'light');

  // ── Toasts ────────────────────────────────────────────────────────────
  const [toasts, setToasts] = useState([]);

  // ── Global loading flag (for legacy compatibility) ─────────────────────
  const [isLoading, setIsLoading] = useState(false);

  // ══ Apply theme ════════════════════════════════════════════════════════
  useEffect(() => {
    localStorage.setItem('ss-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = useCallback(() =>
    setTheme(prev => prev === 'light' ? 'dark' : 'light'), []);

  // ══ Toast helpers ══════════════════════════════════════════════════════
  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type, exiting: false }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t));
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 300);
  }, []);

  // ══ Auth: bootstrap on mount ═══════════════════════════════════════════
  // If a token exists in localStorage, fetch the user profile silently.
  useEffect(() => {
    const boot = async () => {
      const token = getToken();
      if (!token) { setAuthLoading(false); return; }
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
      } catch {
        // Token expired / invalid → clear it
        clearToken();
      } finally {
        setAuthLoading(false);
      }
    };
    boot();
  }, []);

  // ══ Auth: login ═══════════════════════════════════════════════════════
  const login = useCallback(async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    saveToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  // ══ Auth: signup ══════════════════════════════════════════════════════
  const signup = useCallback(async (name, email, password) => {
    const res = await api.post('/auth/signup', { name, email, password });
    saveToken(res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }, []);

  // ══ Auth: logout ══════════════════════════════════════════════════════
  const logout = useCallback(() => {
    clearToken();
    setUser(null);
    setTransactions([]);
    setDashboardData(null);
    addToast('You have been signed out.', 'info');
  }, [addToast]);

  // ══ Budget: update a single category's allocation ═════════════════════
  const updateBudget = useCallback((category, allocated) => {
    setBudgets(prev => prev.map(b =>
      b.category === category ? { ...b, allocated: Number(allocated) } : b
    ));
  }, []);

  // ══ Transactions: fetch from API ══════════════════════════════════════
  const fetchTransactions = useCallback(async (params = {}) => {
    if (!getToken()) return;
    setTxLoading(true);
    setTxError(null);
    try {
      const qs = new URLSearchParams(
        Object.entries({ limit: 100, sortBy: 'date', order: 'desc', ...params })
          .filter(([, v]) => v !== undefined && v !== '')
      ).toString();
      const res = await api.get(`/transactions?${qs}`);
      // Normalise: the backend uses _id, frontend uses id in some places
      const normalised = res.data.transactions.map(tx => ({
        ...tx,
        id: tx._id,
        ...getCategoryConfig(tx.category, tx.type === 'income' ? tx.amount : -tx.amount),
      }));
      setTransactions(normalised);
    } catch (err) {
      setTxError(err.message);
      addToast(err.message || 'Failed to load transactions', 'error');
    } finally {
      setTxLoading(false);
    }
  }, [addToast]);

  // Auto-fetch when user logs in
  useEffect(() => {
    if (user) {
      fetchTransactions();
      fetchDashboard();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  // ══ Dashboard: fetch from API ═════════════════════════════════════════
  const fetchDashboard = useCallback(async () => {
    if (!getToken()) return;
    setDashLoading(true);
    try {
      const res = await api.get('/dashboard');
      setDashboardData(res.data);
    } catch (err) {
      addToast(err.message || 'Failed to load dashboard', 'error');
    } finally {
      setDashLoading(false);
    }
  }, [addToast]);

  // ══ Transaction CRUD (API-backed) ═════════════════════════════════════
  const addTransaction = useCallback(async (txData) => {
    try {
      const payload = {
        title:    txData.title,
        amount:   Math.abs(txData.amount),
        type:     txData.type === 'income' ? 'income' : 'expense',
        category: txData.category,
        date:     txData.date || new Date().toISOString().split('T')[0],
        method:   txData.method || '',
        notes:    txData.notes  || '',
      };
      const res = await api.post('/transactions', payload);
      const tx  = res.data.transaction;
      const normalised = {
        ...tx, id: tx._id,
        ...getCategoryConfig(tx.category, payload.type === 'income' ? tx.amount : -tx.amount),
      };
      setTransactions(prev => [normalised, ...prev]);
      fetchDashboard(); // refresh stats
      addToast('Transaction added successfully', 'success');
      return normalised;
    } catch (err) {
      addToast(err.message || 'Failed to add transaction', 'error');
      throw err;
    }
  }, [addToast, fetchDashboard]);

  const editTransaction = useCallback(async (id, txData) => {
    try {
      const payload = {
        title:    txData.title,
        amount:   Math.abs(txData.amount),
        type:     txData.type === 'income' ? 'income' : 'expense',
        category: txData.category,
        date:     txData.date,
        method:   txData.method || '',
        notes:    txData.notes  || '',
      };
      const res = await api.put(`/transactions/${id}`, payload);
      const tx  = res.data.transaction;
      const normalised = {
        ...tx, id: tx._id,
        ...getCategoryConfig(tx.category, payload.type === 'income' ? tx.amount : -tx.amount),
      };
      setTransactions(prev => prev.map(t => (t._id === id || t.id === id) ? normalised : t));
      fetchDashboard();
      addToast('Transaction updated', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update transaction', 'error');
      throw err;
    }
  }, [addToast, fetchDashboard]);

  const deleteTransaction = useCallback(async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      setTransactions(prev => prev.filter(t => t._id !== id && t.id !== id));
      fetchDashboard();
      addToast('Transaction deleted', 'info');
    } catch (err) {
      addToast(err.message || 'Failed to delete transaction', 'error');
      throw err;
    }
  }, [addToast, fetchDashboard]);

  // ══ Computed values (from local transactions array, for UI responsiveness) ═
  const financials = useMemo(() => {
    if (dashboardData) {
      return {
        income:   dashboardData.income,
        expenses: dashboardData.expense,
        balance:  dashboardData.balance,
      };
    }
    const income   = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
    return { income, expenses, balance: income - expenses };
  }, [dashboardData, transactions]);

  const monthlyData = useMemo(() => {
    if (dashboardData?.monthlyCashFlow) {
      return dashboardData.monthlyCashFlow.map(m => ({
        key:      m.month,
        month:    m.month.slice(5), // "MM"
        income:   m.income,
        expenses: m.expenses,
      }));
    }
    // Fallback: compute from local transactions
    const months = {};
    transactions.forEach(tx => {
      if (!tx.date) return;
      const d = new Date(tx.date);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
      if (!months[key]) months[key] = { key, month, income: 0, expenses: 0 };
      if (tx.type === 'income') months[key].income   += tx.amount;
      else                      months[key].expenses += tx.amount;
    });
    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, v]) => v)
      .slice(-6);
  }, [dashboardData, transactions]);

  const categoryData = useMemo(() => {
    if (dashboardData?.categoryBreakdown) {
      return dashboardData.categoryBreakdown.map(c => ({
        category:   c.category,
        amount:     c.total,
        percentage: c.percentage,
        color:      getCategoryConfig(c.category, -1).color,
      }));
    }
    const cats = {};
    transactions.filter(t => t.type === 'expense').forEach(tx => {
      cats[tx.category] = (cats[tx.category] || 0) + tx.amount;
    });
    const total = Object.values(cats).reduce((s, v) => s + v, 0);
    return Object.entries(cats)
      .sort(([, a], [, b]) => b - a)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
        color: getCategoryConfig(category, -1).color,
      }));
  }, [dashboardData, transactions]);

  const budgetsWithSpend = useMemo(() => {
    const currentMonth = new Date().toISOString().slice(0, 7);
    const spent = {};
    transactions.filter(t => t.type === 'expense' && t.date?.startsWith(currentMonth))
      .forEach(tx => { spent[tx.category] = (spent[tx.category] || 0) + tx.amount; });
    return budgets.map(b => ({
      ...b, spent: spent[b.category] || 0,
      ...getCategoryConfig(b.category, -1),
    }));
  }, [transactions, budgets]);

  const recentTransactions = useMemo(() => {
    if (dashboardData?.recentTransactions?.length) {
      return dashboardData.recentTransactions.map(tx => ({
        ...tx, id: tx._id,
        ...getCategoryConfig(tx.category, tx.type === 'income' ? tx.amount : -tx.amount),
      }));
    }
    return [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
  }, [dashboardData, transactions]);

  // ── Pro flag helper ───────────────────────────────────────────────────
  const isPro = user?.isPro === true;

  const value = {
    // Auth
    user, authLoading, isPro, login, signup, logout,
    // Transactions
    transactions, txLoading, txError, fetchTransactions,
    addTransaction, editTransaction, deleteTransaction,
    // Dashboard
    dashboardData, dashLoading, fetchDashboard,
    // Computed UI data
    financials, monthlyData, categoryData, budgetsWithSpend, recentTransactions,
    // Budget
    updateBudget,
    // UI
    isLoading, setIsLoading,
    theme, toggleTheme,
    toasts, addToast, removeToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
