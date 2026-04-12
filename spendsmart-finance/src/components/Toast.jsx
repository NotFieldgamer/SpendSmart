// src/components/Toast.jsx
import { useApp } from '../context/AppContext';

const TOAST_STYLES = {
  success: {
    bar: 'bg-secondary',
    icon: 'check_circle',
    iconColor: 'text-secondary',
    bg: 'bg-secondary-container/20 border-secondary/20',
  },
  error: {
    bar: 'bg-error',
    icon: 'error',
    iconColor: 'text-error',
    bg: 'bg-error-container/40 border-error/20',
  },
  info: {
    bar: 'bg-primary-container',
    icon: 'info',
    iconColor: 'text-primary',
    bg: 'bg-primary-fixed/40 border-primary/20',
  },
  warning: {
    bar: 'bg-[#d97706]',
    icon: 'warning',
    iconColor: 'text-[#d97706]',
    bg: 'bg-[#fef3c7]/40 border-[#d97706]/20',
  },
};

function ToastItem({ toast }) {
  const { removeToast } = useApp();
  const s = TOAST_STYLES[toast.type] || TOAST_STYLES.info;

  return (
    <div
      className={`relative flex items-start gap-3 w-80 rounded-2xl p-3.5 shadow-premium border
        ${s.bg} ${toast.exiting ? 'animate-toast-out' : 'animate-toast-in'}
        bg-surface-container-lowest overflow-hidden`}
    >
      {/* Color accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${s.bar} rounded-l-2xl`} />

      {/* Icon */}
      <span className={`material-icons-round text-xl mt-0.5 flex-shrink-0 ${s.iconColor}`}>
        {s.icon}
      </span>

      {/* Message */}
      <p className="flex-1 text-sm text-on-surface leading-snug pt-0.5">{toast.message}</p>

      {/* Close */}
      <button
        onClick={() => removeToast(toast.id)}
        className="w-6 h-6 rounded-xl flex items-center justify-center hover:bg-surface-container transition-colors flex-shrink-0"
      >
        <span className="material-icons-round text-base text-on-surface-variant">close</span>
      </button>
    </div>
  );
}

export default function ToastContainer() {
  const { toasts } = useApp();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 items-end">
      {toasts.map(toast => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
