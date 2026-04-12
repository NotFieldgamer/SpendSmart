// src/pages/Dashboard.jsx
import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import CashFlowChart from '../components/CashFlowChart';
import TransactionRow from '../components/TransactionRow';
import CreditCard from '../components/CreditCard';
import QuickActions from '../components/QuickActions';
import InsightBanner from '../components/InsightBanner';
import ExpenseDonut from '../components/ExpenseDonut';
import TransactionForm from '../components/TransactionForm';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { financials, recentTransactions, dashLoading, user } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editTx, setEditTx] = useState(null);

  const { balance, income, expenses } = financials;

  // Dynamic insight based on live data
  const savingsRate = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0;
  const insightMsg = savingsRate >= 30
    ? `You're saving ${savingsRate}% of your income this month. Excellent financial discipline!`
    : savingsRate >= 10
    ? `Your savings rate is ${savingsRate}% this month. Keep reducing non-essential expenses to grow faster.`
    : `Your savings rate is ${savingsRate}%. Try to reduce spending in your highest expense category.`;

  const openEdit = (tx) => setEditTx(tx);
  const closeForm = () => { setShowForm(false); setEditTx(null); };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-start justify-between mb-8 animate-fade-in">
        <div>
          <h2 className="text-2xl font-headline font-bold text-on-surface">Financial Overview</h2>
          <p className="text-sm text-on-surface-variant mt-1">
            Welcome back, {user?.name?.split(' ')[0] || 'Alex'}. Your sanctuary is balanced.
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-gradient text-on-primary rounded-2xl text-sm font-semibold shadow-sm hover:-translate-y-0.5 hover:shadow-premium transition-all"
        >
          <span className="material-icons-round text-base">add</span>
          New Transaction
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-5 mb-7 animate-fade-in">
        <StatCard
          label="Total Balance"
          value={`$${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon="account_balance"
          trend={8.2}
          trendLabel="vs last month"
          iconBg="bg-primary-fixed/60"
          iconColor="text-primary"
        />
        <StatCard
          label="Total Income"
          value={`$${income.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon="trending_up"
          trend={12.5}
          trendLabel="vs last month"
          iconBg="bg-secondary-container/30"
          iconColor="text-secondary"
        />
        <StatCard
          label="Total Expenses"
          value={`$${expenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon="trending_down"
          trend={-4.1}
          trendLabel="vs last month"
          iconBg="bg-tertiary-container/20"
          iconColor="text-tertiary"
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-3 gap-5 animate-fade-in">
        {/* Left 2/3 */}
        <div className="col-span-2 space-y-5">
          <CashFlowChart />
          <InsightBanner message={insightMsg} />

          {/* Recent Transactions */}
          <div className="bg-surface-container-lowest rounded-3xl shadow-card">
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-outline-variant/10">
              <div>
                <h3 className="text-base font-headline font-semibold text-on-surface">Recent Transactions</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">Your latest financial activity</p>
              </div>
              <Link to="/transactions" className="text-xs font-semibold text-primary hover:underline font-label">
                View All
              </Link>
            </div>
            <div className="px-2 py-2">
              {dashLoading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
              ) : recentTransactions.length === 0 ? (
                <p className="text-sm text-on-surface-variant text-center py-8">No transactions yet.</p>
              ) : (
                recentTransactions.map(tx => (
                  <TransactionRow key={tx._id || tx.id} transaction={tx} onEdit={openEdit} />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 1/3 */}
        <div className="col-span-1 space-y-5">
          <div className="bg-surface-container-lowest rounded-3xl p-5 shadow-card">
            <p className="text-xs font-label uppercase tracking-widest text-on-surface-variant mb-4">Your Card</p>
            <CreditCard />
            <div className="mt-4">
              <QuickActions onAddTransaction={() => setShowForm(true)} />
            </div>
          </div>
          <ExpenseDonut />
        </div>
      </div>

      {/* Add/Edit modal */}
      {(showForm || editTx) && (
        <TransactionForm transaction={editTx} onClose={closeForm} />
      )}
    </DashboardLayout>
  );
}
