// src/pages/Login.jsx
import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p className="flex items-center gap-1 mt-1.5 text-xs text-error animate-fade-in">
      <span className="material-icons-round text-sm">error_outline</span>
      {msg}
    </p>
  );
}

export default function Login() {
  const [isSignup, setIsSignup]     = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { login, signup, addToast } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  // Redirect back to the page the user originally tried to visit
  const from = location.state?.from?.pathname || '/dashboard';

  const [form, setForm]     = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});

  const setField = useCallback((k, v) => {
    setForm(prev => ({ ...prev, [k]: v }));
    setErrors(prev => ({ ...prev, [k]: '' }));
  }, []);

  const validate = () => {
    const errs = {};
    if (isSignup && !form.name.trim())           errs.name     = 'Full name is required';
    if (!form.email.includes('@'))               errs.email    = 'Enter a valid email address';
    if (form.password.length < 6)                errs.password = 'Password must be at least 6 characters';
    if (isSignup && form.password !== form.confirm) errs.confirm = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      if (isSignup) {
        await signup(form.name.trim(), form.email, form.password);
        addToast('Account created! Welcome to SpendSmart.', 'success');
      } else {
        const u = await login(form.email, form.password);
        addToast(`Welcome back, ${u?.name?.split(' ')[0] || 'back'}!`, 'success');
      }
      navigate(from, { replace: true });
    } catch (err) {
      addToast(err.message || 'Authentication failed. Please try again.', 'error');
      if (err.data?.errors) {
        const fieldErrs = {};
        err.data.errors.forEach(fe => { fieldErrs[fe.field] = fe.message; });
        setErrors(fieldErrs);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* ── Left panel — branding ── */}
      <div className="hidden lg:flex flex-col w-[55%] bg-primary-gradient relative overflow-hidden p-12">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white/5 translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full bg-white/5" />

        {/* Logo */}
        <div className="flex items-center gap-3 mb-auto relative">
          <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
            <span className="material-icons-round text-white text-xl">currency_exchange</span>
          </div>
          <div>
            <p className="font-headline font-bold text-white text-xl">SpendSmart</p>
            <p className="text-white/60 text-xs tracking-widest uppercase font-label">Financial Sanctuary</p>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          <h1 className="text-5xl font-headline font-bold text-white leading-tight mb-6">
            Master your<br />financial sanctuary.
          </h1>
          <p className="text-white/70 text-base leading-relaxed mb-10 max-w-md">
            Join over 50,000 users curating their wealth with architectural precision and serene clarity.
          </p>

          {/* Testimonial */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/10 max-w-md">
            <p className="text-white/90 text-base leading-relaxed italic mb-4">
              &ldquo;The most intuitive financial interface I've used in a decade.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                MC
              </div>
              <div>
                <p className="text-white font-semibold text-sm font-headline">Marcus Chen</p>
                <p className="text-white/60 text-xs">Architect &amp; Early Adopter</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { label: 'Active Users',        val: '50K+'  },
              { label: 'Avg Monthly Savings', val: '$450'  },
              { label: 'Banks Connected',     val: '10K+'  },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-headline font-bold text-white">{s.val}</p>
                <p className="text-white/60 text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-xl bg-primary-gradient flex items-center justify-center">
              <span className="material-icons-round text-white text-base">currency_exchange</span>
            </div>
            <p className="font-headline font-bold text-on-surface text-lg">SpendSmart</p>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-headline font-bold text-on-surface">
              {isSignup ? 'Create account' : 'Welcome back'}
            </h2>
            <p className="text-on-surface-variant mt-2">
              {isSignup
                ? 'Start your financial sanctuary today.'
                : 'Enter your credentials to access your dashboard.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Full name (signup only) */}
            {isSignup && (
              <div className="animate-fade-in">
                <label className="text-xs font-label uppercase tracking-widest text-on-surface-variant block mb-2">
                  Full Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setField('name', e.target.value)}
                  placeholder="Alex Mercer"
                  autoComplete="name"
                  className={`w-full px-4 py-3.5 bg-surface-container-low rounded-2xl text-sm text-on-surface outline-none placeholder:text-on-surface-variant/50 transition-all
                    ${errors.name ? 'ring-2 ring-error/40' : 'focus:ring-2 focus:ring-primary/20'}`}
                />
                <FieldError msg={errors.name} />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="text-xs font-label uppercase tracking-widest text-on-surface-variant block mb-2">
                Email <span className="text-error">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => setField('email', e.target.value)}
                placeholder="alex@example.com"
                autoComplete="email"
                className={`w-full px-4 py-3.5 bg-surface-container-low rounded-2xl text-sm text-on-surface outline-none placeholder:text-on-surface-variant/50 transition-all
                  ${errors.email ? 'ring-2 ring-error/40' : 'focus:ring-2 focus:ring-primary/20'}`}
              />
              <FieldError msg={errors.email} />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
                  Password <span className="text-error">*</span>
                </label>
                {!isSignup && (
                  <a href="#" className="text-xs text-primary font-semibold hover:underline font-label">
                    Forgot Password?
                  </a>
                )}
              </div>
              <input
                type="password"
                value={form.password}
                onChange={e => setField('password', e.target.value)}
                placeholder="••••••••"
                autoComplete={isSignup ? 'new-password' : 'current-password'}
                className={`w-full px-4 py-3.5 bg-surface-container-low rounded-2xl text-sm text-on-surface outline-none transition-all
                  ${errors.password ? 'ring-2 ring-error/40' : 'focus:ring-2 focus:ring-primary/20'}`}
              />
              <FieldError msg={errors.password} />
            </div>

            {/* Confirm password (signup only) */}
            {isSignup && (
              <div className="animate-fade-in">
                <label className="text-xs font-label uppercase tracking-widest text-on-surface-variant block mb-2">
                  Confirm Password <span className="text-error">*</span>
                </label>
                <input
                  type="password"
                  value={form.confirm}
                  onChange={e => setField('confirm', e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className={`w-full px-4 py-3.5 bg-surface-container-low rounded-2xl text-sm text-on-surface outline-none transition-all
                    ${errors.confirm ? 'ring-2 ring-error/40' : 'focus:ring-2 focus:ring-primary/20'}`}
                />
                <FieldError msg={errors.confirm} />
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-primary-gradient text-on-primary rounded-2xl font-semibold text-sm shadow-sm hover:-translate-y-0.5 hover:shadow-premium transition-all mt-2 disabled:opacity-60 disabled:translate-y-0 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isSignup ? 'Creating account…' : 'Signing in…'}
                </>
              ) : (
                isSignup ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          {/* Toggle signup/login */}
          <p className="text-sm text-on-surface-variant text-center mt-6">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => { setIsSignup(prev => !prev); setErrors({}); setForm({ name: '', email: '', password: '', confirm: '' }); }}
              className="text-primary font-semibold hover:underline"
            >
              {isSignup ? 'Sign in' : 'Create an account'}
            </button>
          </p>

          {/* Demo credentials hint */}
          <div className="mt-4 p-4 bg-surface-container-low rounded-2xl text-center">
            <p className="text-xs text-on-surface-variant mb-2">
              <span className="material-icons-round text-sm align-middle mr-1">info</span>
              Create a free account or use the demo credentials below
            </p>
            <button
              type="button"
              onClick={() => setForm({ name: 'Alex Mercer', email: 'alex@demo.com', password: 'demo123', confirm: 'demo123' })}
              className="text-xs text-primary font-semibold hover:underline"
            >
              Fill with demo credentials
            </button>
          </div>

          {/* Footer links */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <a href="#" className="text-xs text-on-surface-variant hover:text-on-surface">Privacy Policy</a>
            <span className="text-outline-variant">•</span>
            <a href="#" className="text-xs text-on-surface-variant hover:text-on-surface">Terms of Service</a>
          </div>
        </div>
      </div>
    </div>
  );
}
