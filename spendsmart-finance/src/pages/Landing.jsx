// src/pages/Landing.jsx
import { Link } from 'react-router-dom';
import { features, pricingPlans } from '../utils/data';

export default function Landing() {
  return (
    <div className="min-h-screen bg-background font-body">
      {/* ── Navbar ── */}
      <header className="fixed top-0 inset-x-0 z-50 glass-sidebar border-b border-outline-variant/20">
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary-gradient flex items-center justify-center shadow-sm">
              <span className="material-icons-round text-white text-base">currency_exchange</span>
            </div>
            <span className="font-headline font-bold text-on-surface text-base">SpendSmart</span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {['Features', 'Pricing', 'Company'].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-label text-on-surface-variant hover:text-on-surface transition-colors">
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-semibold text-on-surface hover:text-primary transition-colors hidden md:block">
              Sign In
            </Link>
            <Link
              to="/login"
              className="px-5 py-2.5 bg-primary-gradient text-white rounded-2xl text-sm font-semibold shadow-sm hover:-translate-y-0.5 hover:shadow-premium transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="pt-32 pb-20 px-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-primary-fixed rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-label font-semibold text-primary uppercase tracking-widest">Financial Sanctuary</span>
            </div>

            <h1 className="text-5xl font-headline font-bold text-on-surface leading-tight mb-6">
              Smarter<br />
              <span className="primary-gradient-text">spending</span><br />
              starts here.
            </h1>

            <p className="text-base text-on-surface-variant leading-relaxed mb-8 max-w-lg">
              Track, visualize, and optimize your financial life with production-ready insights.
              Join the sanctuary of financial peace.
            </p>

            <div className="flex items-center gap-4 flex-wrap">
              <Link
                to="/login"
                className="px-7 py-3.5 bg-primary-gradient text-white rounded-2xl font-semibold text-sm shadow-sm hover:-translate-y-0.5 hover:shadow-premium transition-all"
              >
                Start Free Trial
              </Link>
              <a href="#features" className="flex items-center gap-2 text-sm font-semibold text-on-surface hover:text-primary transition-colors">
                <span className="material-icons-round text-base">play_circle</span>
                Watch Demo
              </a>
            </div>

            <p className="text-xs text-on-surface-variant mt-5">
              Join 50,000+ users who saved an average of{' '}
              <span className="text-secondary font-semibold">$450/month</span>
            </p>
          </div>

          {/* Balance Overview Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-primary/5 rounded-4xl blur-3xl" />
            <div className="relative bg-surface-container-lowest rounded-4xl shadow-premium p-8 border border-outline-variant/20">
              <p className="text-xs font-label uppercase tracking-widest text-on-surface-variant mb-1">Balance Overview</p>
              <h3 className="text-sm text-on-surface-variant mb-6">
                Sophisticated tools wrapped in an architectural interface, designed to give you clarity over your capital.
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-on-surface-variant mb-1">Total Balance</p>
                  <p className="text-4xl font-headline font-bold text-on-surface">$42,850.24</p>
                </div>

                <div className="h-px bg-outline-variant/20" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-on-surface-variant mb-1 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
                      Income
                    </p>
                    <p className="text-xl font-headline font-bold text-secondary">$12,400.00</p>
                  </div>
                  <div>
                    <p className="text-xs text-on-surface-variant mb-1 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-tertiary inline-block" />
                      Expenses
                    </p>
                    <p className="text-xl font-headline font-bold text-tertiary">$6,120.45</p>
                  </div>
                </div>

                {/* Mini bar chart */}
                <div className="flex items-end gap-1.5 h-16 pt-4">
                  {[40, 65, 55, 80, 70, 90].map((h, i) => (
                    <div key={i} className="flex-1 flex gap-0.5 items-end">
                      <div className="flex-1 chart-bar-income rounded-t" style={{ height: `${h}%` }} />
                      <div className="flex-1 chart-bar-expense rounded-t" style={{ height: `${h * 0.52}%` }} />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between">
                  {['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'].map((m) => (
                    <span key={m} className="text-[10px] font-label text-on-surface-variant">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section id="features" className="py-20 px-8 bg-surface-container-low/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-label uppercase tracking-widest text-primary font-semibold mb-3">Features</p>
            <h2 className="text-4xl font-headline font-bold text-on-surface mb-4">Everything you need</h2>
            <p className="text-base text-on-surface-variant max-w-xl mx-auto">
              Defining the new standard of financial mastery through elegant engineering.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-surface-container-lowest rounded-3xl p-7 shadow-card hover:shadow-premium transition-shadow">
                <div className={`w-12 h-12 rounded-2xl ${f.bg} ${f.color} flex items-center justify-center mb-5`}>
                  <span className="material-icons-round text-xl">{f.icon}</span>
                </div>
                <h3 className="text-base font-headline font-semibold text-on-surface mb-3">{f.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing Section ── */}
      <section id="pricing" className="py-20 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-label uppercase tracking-widest text-primary font-semibold mb-3">Pricing</p>
            <h2 className="text-4xl font-headline font-bold text-on-surface mb-4">Simple, transparent pricing</h2>
            <p className="text-base text-on-surface-variant">No hidden fees. Cancel anytime.</p>
          </div>

          <div className="grid grid-cols-3 gap-6 items-start">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-3xl p-7 border transition-shadow hover:shadow-premium ${
                  plan.highlight
                    ? 'bg-primary-gradient text-white shadow-premium border-transparent'
                    : 'bg-surface-container-lowest shadow-card border-outline-variant/20'
                }`}
              >
                <p className={`text-xs font-label uppercase tracking-widest font-semibold mb-1 ${plan.highlight ? 'text-white/70' : 'text-on-surface-variant'}`}>
                  {plan.name}
                </p>
                <div className="flex items-end gap-1 mb-1">
                  <span className={`text-4xl font-headline font-bold ${plan.highlight ? 'text-white' : 'text-on-surface'}`}>{plan.price}</span>
                  <span className={`text-sm mb-1 ${plan.highlight ? 'text-white/70' : 'text-on-surface-variant'}`}>{plan.period}</span>
                </div>
                <p className={`text-sm mb-6 ${plan.highlight ? 'text-white/80' : 'text-on-surface-variant'}`}>{plan.description}</p>

                <ul className="space-y-3 mb-7">
                  {plan.features.map((feat) => (
                    <li key={feat} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-white/90' : 'text-on-surface'}`}>
                      <span className={`material-icons-round text-base ${plan.highlight ? 'text-white' : 'text-secondary'}`}>check_circle</span>
                      {feat}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/login"
                  className={`block text-center py-3 rounded-2xl text-sm font-semibold transition-all ${
                    plan.highlight
                      ? 'bg-white text-primary hover:bg-white/90'
                      : 'bg-primary-gradient text-white hover:shadow-premium hover:-translate-y-0.5'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="company" className="border-t border-outline-variant/20 py-14 px-8 bg-surface-container-low/40">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-xl bg-primary-gradient flex items-center justify-center">
                  <span className="material-icons-round text-white text-sm">currency_exchange</span>
                </div>
                <span className="font-headline font-bold text-on-surface">SpendSmart</span>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                Defining the new standard of financial mastery through elegant engineering.
              </p>
              <div className="flex gap-3 mt-4">
                {['language', 'share'].map((icon) => (
                  <button key={icon} className="w-8 h-8 rounded-xl bg-surface-container flex items-center justify-center hover:bg-surface-container-high transition-colors">
                    <span className="material-icons-round text-on-surface-variant text-base">{icon}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Product links */}
            {[
              { heading: 'Product', links: ['Features', 'Security', 'API for Developers', 'Mobile App'] },
              { heading: 'Company', links: ['About Us', 'Careers', 'Press', 'Blog'] },
              { heading: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'] },
            ].map((col) => (
              <div key={col.heading}>
                <p className="text-xs font-label uppercase tracking-widest text-on-surface font-semibold mb-4">{col.heading}</p>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-outline-variant/20">
            <p className="text-xs text-on-surface-variant">© 2024 SpendSmart Inc. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-xs text-on-surface-variant hover:text-on-surface">Status</a>
              <a href="#" className="text-xs text-on-surface-variant hover:text-on-surface">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
