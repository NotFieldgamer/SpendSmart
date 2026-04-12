// src/pages/Settings.jsx
import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ProGate from '../components/ProGate';
import { useApp } from '../context/AppContext';
import { exportApi } from '../api/dashboard';

function Toggle({ enabled, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      role="switch"
      aria-checked={enabled}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 cursor-pointer flex-shrink-0 ${
        enabled ? 'bg-primary' : 'bg-surface-container-high'
      }`}
    >
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-on-primary shadow transition-all duration-200 ${
        enabled ? 'right-0.5' : 'left-0.5 bg-on-surface-variant'
      }`} />
    </button>
  );
}

export default function Settings() {
  const { theme, toggleTheme, addToast, user, isPro, logout } = useApp();

  const [profile, setProfile]           = useState({
    name:  user?.name  || '',
    email: user?.email || '',
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [exporting, setExporting]         = useState(false);

  const [notifications, setNotifications] = useState({
    transactions:   true,
    weeklySummary:  true,
    budgetWarnings: false,
    insights:       true,
  });

  const validateProfile = () => {
    const errs = {};
    if (!profile.name.trim())        errs.name  = 'Name is required';
    if (!profile.email.includes('@')) errs.email = 'Enter a valid email';
    return errs;
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    const errs = validateProfile();
    if (Object.keys(errs).length) { setProfileErrors(errs); return; }
    setSavingProfile(true);
    try {
      // Update via API (PUT /auth/me)
      const { api } = await import('../api/client');
      await api.put('/auth/me', { name: profile.name });
      addToast('Profile saved successfully', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to save profile', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const toggleNotif = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    addToast('Notification preference updated', 'info');
  };

  const handleExport = async (format) => {
    setExporting(true);
    try {
      await exportApi.download({ format });
      addToast(`Exported as ${format.toUpperCase()} successfully`, 'success');
    } catch (err) {
      addToast(err.message || 'Export failed', 'error');
    } finally {
      setExporting(false);
    }
  };

  const handleDangerAction = (label) => {
    addToast(`${label} — feature coming soon`, 'warning');
  };

  return (
    <DashboardLayout>
      <div className="mb-8 animate-fade-in">
        <h2 className="text-2xl font-headline font-bold text-on-surface">Settings</h2>
        <p className="text-sm text-on-surface-variant mt-1">Manage your account and preferences.</p>
      </div>

      <div className="max-w-2xl space-y-5 animate-fade-in">
        {/* ── Appearance ── */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-2xl bg-primary-fixed/60 text-primary flex items-center justify-center">
              <span className="material-icons-round text-base">palette</span>
            </div>
            <h3 className="text-base font-headline font-semibold text-on-surface">Appearance</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-on-surface font-headline">Dark Mode</p>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Currently: <span className="font-semibold capitalize">{theme} mode</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`material-icons-round text-base ${theme === 'light' ? 'text-yellow-500' : 'text-on-surface-variant'}`}>light_mode</span>
              <Toggle enabled={theme === 'dark'} onToggle={toggleTheme} />
              <span className={`material-icons-round text-base ${theme === 'dark' ? 'text-primary' : 'text-on-surface-variant'}`}>dark_mode</span>
            </div>
          </div>
        </div>

        {/* ── Profile ── */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-2xl bg-primary-fixed/60 text-primary flex items-center justify-center">
              <span className="material-icons-round text-base">person</span>
            </div>
            <h3 className="text-base font-headline font-semibold text-on-surface">Profile</h3>
          </div>

          <form onSubmit={saveProfile} className="space-y-4">
            {[
              { key: 'name',  label: 'Full Name', type: 'text',  placeholder: 'Alex Mercer' },
              { key: 'email', label: 'Email',     type: 'email', placeholder: 'alex@example.com', readOnly: true },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-label uppercase tracking-widest text-on-surface-variant block mb-2">{f.label}</label>
                <input
                  type={f.type}
                  value={profile[f.key]}
                  readOnly={f.readOnly}
                  onChange={e => {
                    setProfile(p => ({ ...p, [f.key]: e.target.value }));
                    setProfileErrors(pe => ({ ...pe, [f.key]: '' }));
                  }}
                  placeholder={f.placeholder}
                  className={`w-full px-4 py-3 bg-surface-container-low rounded-2xl text-sm text-on-surface outline-none transition-all
                    ${f.readOnly ? 'opacity-60 cursor-not-allowed' : ''}
                    ${profileErrors[f.key] ? 'ring-2 ring-error/40' : 'focus:ring-2 focus:ring-primary/20'}`}
                />
                {profileErrors[f.key] && (
                  <p className="flex items-center gap-1 mt-1 text-xs text-error animate-fade-in">
                    <span className="material-icons-round text-sm">error_outline</span>
                    {profileErrors[f.key]}
                  </p>
                )}
              </div>
            ))}

            <div>
              <label className="text-xs font-label uppercase tracking-widest text-on-surface-variant block mb-2">Membership</label>
              <input
                type="text"
                value={isPro ? '✦ Pro Member' : 'Free Plan'}
                readOnly
                className="w-full px-4 py-3 bg-surface-container-low rounded-2xl text-sm text-on-surface-variant outline-none cursor-not-allowed opacity-70"
              />
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-gradient text-on-primary rounded-2xl text-sm font-semibold shadow-sm hover:-translate-y-0.5 hover:shadow-premium transition-all disabled:opacity-60 disabled:translate-y-0"
            >
              {savingProfile ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
              ) : 'Save Changes'}
            </button>
          </form>
        </div>

        {/* ── Export Data (Pro only) ── */}
        <ProGate feature="Data Export">
          <div className="bg-surface-container-lowest rounded-3xl shadow-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-2xl bg-primary-fixed/60 text-primary flex items-center justify-center">
                <span className="material-icons-round text-base">download</span>
              </div>
              <h3 className="text-base font-headline font-semibold text-on-surface">Export Data</h3>
            </div>
            <p className="text-sm text-on-surface-variant mb-5">
              Download all your transactions as a file. Includes all dates, amounts, and categories.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleExport('json')}
                disabled={exporting}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary-gradient text-on-primary rounded-2xl text-sm font-semibold shadow-sm hover:-translate-y-0.5 hover:shadow-premium transition-all disabled:opacity-60"
              >
                {exporting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span className="material-icons-round text-sm">data_object</span>
                )}
                Export JSON
              </button>
              <button
                onClick={() => handleExport('csv')}
                disabled={exporting}
                className="flex items-center gap-2 px-5 py-2.5 bg-surface-container-high text-on-surface rounded-2xl text-sm font-semibold hover:bg-surface-container transition-all disabled:opacity-60"
              >
                <span className="material-icons-round text-sm">table_chart</span>
                Export CSV
              </button>
            </div>
          </div>
        </ProGate>

        {/* ── Notifications ── */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-2xl bg-primary-fixed/60 text-primary flex items-center justify-center">
              <span className="material-icons-round text-base">notifications</span>
            </div>
            <h3 className="text-base font-headline font-semibold text-on-surface">Notifications</h3>
          </div>
          <div className="space-y-4 divide-y divide-outline-variant/20">
            {[
              { key: 'transactions',   label: 'Transaction alerts',  desc: 'Get notified for every new transaction'     },
              { key: 'weeklySummary',  label: 'Weekly summary',      desc: 'Receive a weekly financial digest email'    },
              { key: 'budgetWarnings', label: 'Budget warnings',     desc: 'Alert when approaching budget limits'       },
              { key: 'insights',       label: 'AI insights',         desc: 'Smart spending recommendations & nudges'    },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-on-surface font-headline">{label}</p>
                  <p className="text-xs text-on-surface-variant mt-0.5">{desc}</p>
                </div>
                <Toggle enabled={notifications[key]} onToggle={() => toggleNotif(key)} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Security ── */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-2xl bg-primary-fixed/60 text-primary flex items-center justify-center">
              <span className="material-icons-round text-base">security</span>
            </div>
            <h3 className="text-base font-headline font-semibold text-on-surface">Security</h3>
          </div>
          <div className="space-y-2">
            {[
              { label: 'Change Password',  icon: 'lock'            },
              { label: 'Enable 2FA',       icon: 'verified_user'   },
              { label: 'Active Sessions',  icon: 'devices'         },
            ].map(b => (
              <button
                key={b.label}
                onClick={() => handleDangerAction(b.label)}
                className="flex items-center gap-3 w-full px-4 py-3 bg-surface-container-low rounded-2xl text-sm font-medium text-on-surface hover:bg-surface-container transition-colors"
              >
                <span className="material-icons-round text-on-surface-variant text-base">{b.icon}</span>
                {b.label}
                <span className="material-icons-round text-on-surface-variant text-base ml-auto">chevron_right</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Danger zone ── */}
        <div className="bg-surface-container-lowest rounded-3xl shadow-card p-6 border border-error/15">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-2xl bg-error-container/30 text-error flex items-center justify-center">
              <span className="material-icons-round text-base">warning</span>
            </div>
            <h3 className="text-base font-headline font-semibold text-on-surface">Danger Zone</h3>
          </div>
          <p className="text-sm text-on-surface-variant mb-4">Irreversible account actions. Proceed with caution.</p>
          <button
            onClick={() => handleDangerAction('Delete Account')}
            className="px-5 py-2.5 bg-error/10 text-error rounded-2xl text-sm font-semibold hover:bg-error/20 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
