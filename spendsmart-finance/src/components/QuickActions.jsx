// src/components/QuickActions.jsx
const ACTIONS = [
  { label: 'Transfer',  icon: 'swap_horiz'       },
  { label: 'Savings',   icon: 'savings'           },
  { label: 'Invoices',  icon: 'description'       },
  { label: 'Support',   icon: 'headset_mic'       },
];

export default function QuickActions({ onAddTransaction }) {
  const handleAction = (label) => {
    if (label === 'Transfer' && onAddTransaction) {
      onAddTransaction();
    }
  };

  return (
    <div className="grid grid-cols-4 gap-2 mt-3">
      {ACTIONS.map(({ label, icon }) => (
        <button
          key={label}
          onClick={() => handleAction(label)}
          className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl hover:bg-surface-container-low transition-colors group"
        >
          <div className="w-8 h-8 rounded-xl bg-surface-container-low group-hover:bg-surface-container flex items-center justify-center transition-colors">
            <span className="material-icons-round text-on-surface-variant text-base">{icon}</span>
          </div>
          <span className="text-[10px] font-label text-on-surface-variant">{label}</span>
        </button>
      ))}
    </div>
  );
}
