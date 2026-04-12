// src/components/CashFlowChart.jsx
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { useApp } from '../context/AppContext';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-premium p-4 border border-outline-variant/20 text-sm">
      <p className="text-xs font-label uppercase tracking-widest text-on-surface-variant mb-2">{label}</p>
      {payload.map(entry => (
        <p key={entry.name} className="font-semibold font-headline" style={{ color: entry.color }}>
          {entry.name}: ${entry.value.toLocaleString('en-US', { minimumFractionDigits: 0 })}
        </p>
      ))}
    </div>
  );
};

export default function CashFlowChart({ data: dataProp }) {
  const { monthlyData, theme } = useApp();
  const data = dataProp ?? monthlyData;

  // Theme-aware chart colors
  const tickColor  = theme === 'dark' ? '#8f9ab5' : '#777587';
  const gridColor  = theme === 'dark' ? '#2a3449' : '#c7c4d8';
  const incomeColor  = theme === 'dark' ? '#4edea3' : '#006c49';
  const expenseColor = theme === 'dark' ? '#ff94aa' : '#bf0f3c';

  if (!data.length) {
    return (
      <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-card flex items-center justify-center h-56">
        <p className="text-sm text-on-surface-variant">No cash flow data yet</p>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-card">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-base font-headline font-semibold text-on-surface">Monthly Cash Flow</h3>
          <p className="text-xs text-on-surface-variant mt-0.5">Income vs Expenses — last 6 months</p>
        </div>
        <div className="flex items-center gap-3 text-xs font-label text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: incomeColor }} />
            Income
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: expenseColor }} />
            Expenses
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barGap={4} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} strokeOpacity={0.5} vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: tickColor, fontFamily: 'Inter', fontWeight: 500 }}
            axisLine={false} tickLine={false} dy={8}
          />
          <YAxis
            tick={{ fontSize: 11, fill: tickColor, fontFamily: 'Inter' }}
            axisLine={false} tickLine={false}
            tickFormatter={v => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
            dx={-4}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: gridColor, fillOpacity: 0.3, radius: 4 }} />
          <Bar dataKey="income"   name="Income"   fill={incomeColor}  radius={[6, 6, 0, 0]} maxBarSize={32} />
          <Bar dataKey="expenses" name="Expenses" fill={expenseColor} radius={[6, 6, 0, 0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
