// src/components/Topbar.jsx
import { useLocation } from 'react-router-dom';
import { navItems } from '../utils/data';
import { useApp } from '../context/AppContext';

export default function Topbar() {
  const location = useLocation();
  const { theme, toggleTheme } = useApp();
  const current = navItems.find(n => location.pathname.startsWith(n.path));

  return (
    <header className="fixed top-0 right-0 left-64 h-16 glass-sidebar border-b border-outline-variant/20 z-30 flex items-center justify-between px-8">
      {/* Page title */}
      <div>
        <h1 className="text-lg font-headline font-bold text-on-surface leading-tight">
          {current?.label ?? 'SpendSmart'}
        </h1>
        <p className="text-xs text-on-surface-variant font-label">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="relative">
          <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="Search transactions…"
            className="pl-9 pr-4 py-2 bg-surface-container-low rounded-2xl text-sm text-on-surface placeholder:text-on-surface-variant/60 outline-none focus:bg-surface-container focus:ring-1 focus:ring-primary/20 w-52 transition-all"
          />
        </div>

        {/* Dark / Light toggle */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="relative w-9 h-9 rounded-2xl bg-surface-container-low flex items-center justify-center hover:bg-surface-container transition-colors overflow-hidden"
        >
          <span
            className={`material-icons-round text-base absolute transition-all duration-300 ${
              theme === 'dark'
                ? 'opacity-100 scale-100 rotate-0 text-yellow-400'
                : 'opacity-0 scale-50 rotate-90 text-yellow-400'
            }`}
          >
            light_mode
          </span>
          <span
            className={`material-icons-round text-base absolute transition-all duration-300 ${
              theme === 'light'
                ? 'opacity-100 scale-100 rotate-0 text-on-surface-variant'
                : 'opacity-0 scale-50 -rotate-90 text-on-surface-variant'
            }`}
          >
            dark_mode
          </span>
        </button>

        {/* Notifications */}
        <button className="relative w-9 h-9 rounded-2xl bg-surface-container-low flex items-center justify-center hover:bg-surface-container transition-colors">
          <span className="material-icons-round text-on-surface-variant text-base">notifications</span>
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-tertiary rounded-full" />
        </button>

        {/* Help */}
        <button className="w-9 h-9 rounded-2xl bg-surface-container-low flex items-center justify-center hover:bg-surface-container transition-colors">
          <span className="material-icons-round text-on-surface-variant text-base">help_outline</span>
        </button>
      </div>
    </header>
  );
}
