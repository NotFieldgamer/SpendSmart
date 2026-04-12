// src/components/Sidebar.jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { navItems } from '../utils/data';
import { useApp } from '../context/AppContext';

export default function Sidebar() {
  const { user, isPro, logout } = useApp();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  // Derive initials from user name
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <aside className="fixed left-0 top-0 h-full w-64 glass-sidebar border-r border-outline-variant/20 flex flex-col z-40">
      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-primary-gradient flex items-center justify-center shadow-sm">
          <span className="material-icons-round text-on-primary text-base">currency_exchange</span>
        </div>
        <div>
          <p className="font-headline font-bold text-on-surface text-base leading-tight">SpendSmart</p>
          <p className="text-[10px] font-label text-on-surface-variant tracking-widest uppercase">Financial Sanctuary</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-label font-medium transition-all duration-200 group relative ${
                isActive
                  ? 'bg-primary-fixed/50 text-primary font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active pill indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary-gradient rounded-r-full" />
                )}
                <span
                  className={`material-icons-round text-lg transition-colors ${
                    isActive ? 'text-primary' : 'text-on-surface-variant group-hover:text-on-surface'
                  }`}
                >
                  {item.icon}
                </span>
                {item.label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Profile + Sign Out */}
      <div className="p-4 border-t border-outline-variant/20">
        <div className="flex items-center gap-3 p-3 rounded-2xl hover:bg-surface-container-low cursor-pointer transition-colors">
          <div className="w-9 h-9 rounded-full bg-primary-gradient flex items-center justify-center text-on-primary font-bold text-sm shadow-sm flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-on-surface truncate font-headline">
              {user?.name || 'User'}
            </p>
            <p className="text-[11px] text-on-surface-variant truncate">
              {isPro ? '✦ Pro Member' : 'Free Plan'}
            </p>
          </div>
          <span className="material-icons-round text-on-surface-variant text-base">more_vert</span>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full mt-1 flex items-center gap-3 px-3 py-2 rounded-2xl text-sm font-label text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
        >
          <span className="material-icons-round text-lg">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
