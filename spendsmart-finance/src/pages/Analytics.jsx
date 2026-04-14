// src/pages/Analytics.jsx
import { useMemo } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import CashFlowChart from '../components/CashFlowChart';
import ExpenseDonut from '../components/ExpenseDonut';
import EmptyState from '../components/EmptyState';
import ProGate from '../components/ProGate';
import { useApp } from '../context/AppContext';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

export default function Analytics() {
  const { monthlyData, financials, categoryData, transactions, theme } = useApp();

  const tickColor  = theme === 'dark' ? '#8f9ab5' : '#777587';
  const gridColor  = theme === 'dark' ? '#2a3449' : '#c7c4d8';
  const fillColor  = theme === 'dark' ? 'rgba(195,192,255,0.1)' : 'rgba(53,37,205,0.06)';
  const strokeColor = theme === 'dark' ? '#c3c0ff' : '#3525cd';

  const savingsRate = financials.income > 0
    ? Math.round(((financials.income - financials.expenses) / financials.income) * 100)
    : 0;

  // Net balance trend per month
  const netTrend = monthlyData.map(m => ({
    month: m.month,
    net: +(m.income - m.expenses).toFixed(2),
  }));

  // Top expense category
  const topCategory = categoryData[0];

  const kpiCards = [
    { label: 'Savings Rate',       value: `${savingsRate}%`,            icon: 'savings',          color: 'text-secondary', bg: 'bg-secondary-container/30', positive: savingsRate >= 20 },
    { label: 'Avg Monthly Spend',  value: monthlyData.length ? `$${Math.round(monthlyData.reduce((s,m) => s+m.expenses,0)/monthlyData.length).toLocaleString()}` : '—', icon: 'credit_card', color: 'text-primary', bg: 'bg-primary-fixed/60' },
    { label: 'Top Expense',        value: topCategory ? topCategory.category : '—',  icon: 'receipt_long', color: 'text-tertiary', bg: 'bg-tertiary-container/20' },
    { label: 'Total Transactions', value: transactions.length,          icon: 'format_list_numbered', color: 'text-primary', bg: 'bg-primary-fixed/60' },
  ];

  return (
    <DashboardLayout>
      <div className="mb-8 animate-fade-in">
        <h2 className="text-2xl font-headline font-bold text-on-surface">Analytics</h2>
        <p className="text-sm text-on-surface-variant mt-1">Deep insights into your financial patterns.</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-4 gap-5 mb-7 animate-fade-in">
        {kpiCards.map(s => (
          <div key={s.label} className="bg-surface-container-lowest rounded-3xl p-5 shadow-card flex items-center gap-4">
            <div className={`w-10 h-10 rounded-2xl ${s.bg} ${s.color} flex items-center justify-center flex-shrink-0`}>
              <span className="material-icons-round text-base">{s.icon}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-on-surface-variant font-label truncate">{s.label}</p>
              <p className="text-base font-bold font-headline text-on-surface truncate">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-5 animate-fade-in">
        {/* Left 2/3 */}
        <div className="col-span-2 space-y-5">
          {/* Cash flow bar chart */}
          <CashFlowChart />

          {/* Net balance trend */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-card">
            <h3 className="text-base font-headline font-semibold text-on-surface mb-1">Net Balance Trend</h3>
            <p className="text-xs text-on-surface-variant mb-5">Monthly surplus / deficit</p>

            {netTrend.length < 2 ? (
              <EmptyState icon="show_chart" title="More data needed" description="Add transactions across multiple months to see your trend." />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={netTrend}>
                  <defs>
                    <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={strokeColor} stopOpacity={0.15} />
                      <stop offset="95%" stopColor={strokeColor} stopOpacity={0}    />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} strokeOpacity={0.4} vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: tickColor, fontFamily: 'Inter' }} axisLine={false} tickLine={false} dy={8} />
                  <YAxis tick={{ fontSize: 11, fill: tickColor, fontFamily: 'Inter' }} axisLine={false} tickLine={false} tickFormatter={v => `$${v >= 1000 ? `${(v/1000).toFixed(0)}k` : v}`} dx={-4} />
                  <Tooltip
                    formatter={v => [`$${v.toLocaleString()}`, 'Net']}
                    contentStyle={{ background: 'var(--tw-shadow-colored)', borderRadius: '1rem', border: 'none', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="net" stroke={strokeColor} strokeWidth={2} fill="url(#netGrad)" dot={{ fill: strokeColor, strokeWidth: 0, r: 3 }} activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Month-over-month table */}
          {monthlyData.length > 0 && (
            <div className="bg-surface-container-lowest rounded-3xl shadow-card p-6">
              <h3 className="text-base font-headline font-semibold text-on-surface mb-5">Month-over-Month Breakdown</h3>
              <div className="space-y-3.5">
                {monthlyData.map(m => {
                  const net   = m.income - m.expenses;
                  const maxVal = Math.max(...monthlyData.map(d => Math.max(d.income, d.expenses)));
                  return (
                    <div key={m.month} className="flex items-center gap-4">
                      <span className="w-10 text-xs font-label font-semibold text-on-surface-variant">{m.month}</span>
                      {/* Income bar */}
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                          <div className="h-full chart-bar-income rounded-full transition-all" style={{ width: `${(m.income / maxVal) * 100}%` }} />
                        </div>
                        <span className="text-xs text-secondary font-semibold w-14 text-right">${(m.income/1000).toFixed(1)}k</span>
                      </div>
                      {/* Expense bar */}
                      <div className="flex-1 flex items-center gap-2">
                        <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                          <div className="h-full chart-bar-expense rounded-full transition-all" style={{ width: `${(m.expenses / maxVal) * 100}%` }} />
                        </div>
                        <span className="text-xs text-tertiary font-semibold w-14 text-right">${(m.expenses/1000).toFixed(1)}k</span>
                      </div>
                      {/* Net */}
                      <span className={`text-xs font-bold w-16 text-right ${net >= 0 ? 'text-secondary' : 'text-tertiary'}`}>
                        {net >= 0 ? '+' : ''}${net.toFixed(0)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right 1/3 */}
        <div className="col-span-1 space-y-5">
          <ExpenseDonut />

          {/* Savings goal — Pro only */}
          <ProGate feature="Savings Goal tracking">
            <div className="bg-surface-container-lowest rounded-3xl shadow-card p-6">
              <h3 className="text-base font-headline font-semibold text-on-surface mb-1">Savings Goal</h3>
              <p className="text-xs text-on-surface-variant mb-5">Emergency Fund — $20,000 target</p>
              <div className="relative flex items-center justify-center mb-2">
                <svg viewBox="0 0 100 60" className="w-full max-w-[180px]">
                  <path d="M10 55 A45 45 0 0 1 90 55" fill="none" stroke="var(--color-secondary-container-high)" strokeWidth="8" strokeLinecap="round" />
                  <path d="M10 55 A45 45 0 0 1 90 55" fill="none" stroke="url(#sg)" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray="141.4" strokeDashoffset={`${141.4 * (1 - 0.64)}`} />
                  <defs>
                    <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%"   stopColor="var(--color-primary)" />
                      <stop offset="100%" stopColor="var(--color-secondary-fdim)" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute bottom-0 text-center">
                  <p className="text-2xl font-headline font-bold text-on-surface">64%</p>
                  <p className="text-[10px] text-on-surface-variant font-label">$12,800</p>
                </div>
              </div>
              <p className="text-xs text-on-surface-variant text-center">$7,200 remaining to reach goal</p>
            </div>
          </ProGate>
        </div>
      </div>
    </DashboardLayout>
  );
}
