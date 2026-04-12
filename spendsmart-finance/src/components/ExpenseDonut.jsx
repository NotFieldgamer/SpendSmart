// src/components/ExpenseDonut.jsx
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../context/AppContext';
import EmptyState from './EmptyState';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-premium p-3 border border-outline-variant/20">
      <p className="text-xs font-label text-on-surface-variant">{d.category}</p>
      <p className="text-sm font-bold font-headline text-on-surface">
        ${d.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </p>
      <p className="text-xs text-on-surface-variant">{d.percentage}%</p>
    </div>
  );
};

export default function ExpenseDonut({ data: dataProp }) {
  const { categoryData } = useApp();
  const data = dataProp ?? categoryData;

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-card">
      <h3 className="text-base font-headline font-semibold text-on-surface mb-1">Expense Distribution</h3>
      <p className="text-xs text-on-surface-variant mb-5">By category this month</p>

      {!data.length ? (
        <EmptyState icon="pie_chart" title="No expenses yet" description="Add expense transactions to see the breakdown." />
      ) : (
        <div className="flex items-center gap-4">
          {/* Donut */}
          <div className="w-32 h-32 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%" cy="50%"
                  innerRadius={36} outerRadius={58}
                  paddingAngle={2}
                  dataKey="amount"
                >
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-1.5 min-w-0">
            {data.slice(0, 6).map(item => (
              <div key={item.category} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <p className="text-xs text-on-surface-variant flex-1 truncate">{item.category}</p>
                <p className="text-xs font-semibold text-on-surface flex-shrink-0">{item.percentage}%</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
