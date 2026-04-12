// src/components/StatCard.jsx

export default function StatCard({
  label,
  value,
  icon,
  trend,
  trendLabel,
  iconBg  = 'bg-primary-fixed/50',
  iconColor = 'text-primary',
}) {
  const isPositive = trend > 0;

  return (
    <div className="bg-surface-container-lowest rounded-3xl p-6 shadow-card hover:shadow-premium transition-shadow duration-300 flex flex-col gap-4 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${iconBg} opacity-30 blur-2xl pointer-events-none`} />

      <div className="flex items-start justify-between relative">
        <div className="flex-1">
          <p className="text-xs font-label uppercase tracking-widest text-on-surface-variant mb-1.5">{label}</p>
          <p className="text-3xl font-headline font-bold text-on-surface leading-tight">{value}</p>
        </div>
        <div className={`w-11 h-11 rounded-2xl ${iconBg} ${iconColor} flex items-center justify-center flex-shrink-0 ml-3`}>
          <span className="material-icons-round text-lg">{icon}</span>
        </div>
      </div>

      {trend !== undefined && (
        <div className="flex items-center gap-1.5 relative">
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
            isPositive
              ? 'bg-secondary-container/30 text-secondary'
              : 'bg-tertiary-container/20 text-tertiary'
          }`}>
            <span className="material-icons-round text-xs">
              {isPositive ? 'trending_up' : 'trending_down'}
            </span>
            {isPositive ? '+' : ''}{trend}%
          </div>
          <span className="text-xs text-on-surface-variant">{trendLabel}</span>
        </div>
      )}
    </div>
  );
}
