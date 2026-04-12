// src/components/ProGate.jsx
// Wraps any Pro-only feature: shows lock overlay if user is on free plan
import { useApp } from '../context/AppContext';

export default function ProGate({ children, feature = 'This feature' }) {
  const { isPro } = useApp();

  if (isPro) return children;

  return (
    <div className="relative group">
      {/* Blurred / disabled children */}
      <div className="pointer-events-none select-none opacity-40 blur-[2px]" aria-hidden>
        {children}
      </div>

      {/* Lock overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-container-lowest/80 backdrop-blur-sm rounded-3xl z-10 px-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-primary-fixed/40 flex items-center justify-center mb-3">
          <span className="material-icons-round text-primary text-2xl">lock</span>
        </div>
        <p className="text-sm font-semibold text-on-surface font-headline mb-1">Pro Feature</p>
        <p className="text-xs text-on-surface-variant mb-4">
          {feature} is only available on SpendSmart Pro.
        </p>
        <a
          href="/settings"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-gradient text-on-primary rounded-2xl text-xs font-semibold shadow-sm hover:-translate-y-0.5 hover:shadow-premium transition-all"
        >
          <span className="material-icons-round text-sm">stars</span>
          Upgrade to Pro
        </a>
      </div>
    </div>
  );
}
