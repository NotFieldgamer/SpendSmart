// src/components/EmptyState.jsx

export default function EmptyState({
  icon = 'inbox',
  title = 'Nothing here yet',
  description = 'Add items to see them here.',
  action,
  actionLabel,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="w-16 h-16 rounded-3xl bg-surface-container flex items-center justify-center mb-5">
        <span className="material-icons-round text-3xl text-on-surface-variant/50">{icon}</span>
      </div>
      <h3 className="text-base font-headline font-semibold text-on-surface mb-2">{title}</h3>
      <p className="text-sm text-on-surface-variant max-w-xs leading-relaxed mb-6">{description}</p>
      {action && actionLabel && (
        <button
          onClick={action}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary-gradient text-on-primary rounded-2xl text-sm font-semibold hover:-translate-y-0.5 hover:shadow-premium transition-all"
        >
          <span className="material-icons-round text-base">add</span>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
