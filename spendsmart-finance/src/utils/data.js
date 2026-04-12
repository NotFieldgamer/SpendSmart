// src/utils/data.js
// Static seed data + shared config constants

// ── Category configuration (single source of truth) ──────────────────
export const CATEGORY_CONFIG = {
  // Expense categories
  'Food & Groceries':  { icon: 'local_grocery_store', iconColor: 'text-secondary',          iconBg: 'bg-secondary-container/30', color: '#4edea3' },
  'Entertainment':     { icon: 'movie',                iconColor: 'text-tertiary',           iconBg: 'bg-tertiary-container/20',  color: '#bf0f3c' },
  'Transportation':    { icon: 'directions_car',       iconColor: 'text-on-surface-variant', iconBg: 'bg-surface-container',      color: '#c3c0ff' },
  'Shopping':          { icon: 'shopping_bag',         iconColor: 'text-primary',            iconBg: 'bg-primary-fixed/50',       color: '#3525cd' },
  'Utilities':         { icon: 'bolt',                 iconColor: 'text-on-surface-variant', iconBg: 'bg-surface-container',      color: '#777587' },
  'Health & Fitness':  { icon: 'fitness_center',       iconColor: 'text-secondary',          iconBg: 'bg-secondary-container/20', color: '#006c49' },
  'Housing':           { icon: 'home',                 iconColor: 'text-primary',            iconBg: 'bg-primary-fixed/50',       color: '#4f46e5' },
  'Education':         { icon: 'school',               iconColor: 'text-on-surface-variant', iconBg: 'bg-surface-container',      color: '#9ca3af' },
  'Personal':          { icon: 'person',               iconColor: 'text-on-surface-variant', iconBg: 'bg-surface-container',      color: '#6b7280' },
  'Other':             { icon: 'receipt',              iconColor: 'text-on-surface-variant', iconBg: 'bg-surface-container',      color: '#9ca3af' },
  // Income categories
  'Salary':            { icon: 'account_balance',      iconColor: 'text-primary',            iconBg: 'bg-primary-fixed/50',       color: '#3525cd' },
  'Freelance':         { icon: 'work',                 iconColor: 'text-primary',            iconBg: 'bg-primary-fixed/50',       color: '#4f46e5' },
  'Investment':        { icon: 'trending_up',          iconColor: 'text-secondary',          iconBg: 'bg-secondary-container/30', color: '#006c49' },
  'Bonus':             { icon: 'star',                 iconColor: 'text-secondary',          iconBg: 'bg-secondary-container/30', color: '#4edea3' },
  'Other Income':      { icon: 'attach_money',         iconColor: 'text-primary',            iconBg: 'bg-primary-fixed/50',       color: '#3525cd' },
};

export const EXPENSE_CATEGORIES = [
  'Food & Groceries', 'Entertainment', 'Transportation', 'Shopping',
  'Utilities', 'Health & Fitness', 'Housing', 'Education', 'Personal', 'Other',
];

export const INCOME_CATEGORIES = [
  'Salary', 'Freelance', 'Investment', 'Bonus', 'Other Income',
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

// Helper: derive icon/color from category + amount sign
export function getCategoryConfig(category, amount) {
  return CATEGORY_CONFIG[category] ?? {
    icon: amount >= 0 ? 'attach_money' : 'receipt',
    iconColor: amount >= 0 ? 'text-primary' : 'text-on-surface-variant',
    iconBg: amount >= 0 ? 'bg-primary-fixed/50' : 'bg-surface-container',
    color: '#777587',
  };
}

// ── Static user ───────────────────────────────────────────────────────
export const user = {
  name: 'Alex Mercer',
  email: 'alex.mercer@email.com',
  tier: 'Premium Member',
  avatar: 'AM',
};

// ── Seed transactions (with ISO dates) ───────────────────────────────
export const SEED_TRANSACTIONS = [
  { id: 1,  merchant: 'Whole Foods Market',    category: 'Food & Groceries', amount: -142.50, date: '2024-06-14', method: 'VISA •••• 4242' },
  { id: 2,  merchant: 'TechCorp Salary',       category: 'Salary',           amount: 6200.00, date: '2024-06-13', method: 'ACH Deposit'   },
  { id: 3,  merchant: 'Netflix',               category: 'Entertainment',    amount: -19.99,  date: '2024-06-12', method: 'Recurring'     },
  { id: 4,  merchant: 'Starbucks',             category: 'Food & Groceries', amount: -8.75,   date: '2024-06-11', method: 'VISA •••• 4242' },
  { id: 5,  merchant: 'Uber',                  category: 'Transportation',   amount: -22.30,  date: '2024-06-10', method: 'VISA •••• 4242' },
  { id: 6,  merchant: 'Amazon',                category: 'Shopping',         amount: -156.00, date: '2024-06-09', method: 'VISA •••• 4242' },
  { id: 7,  merchant: 'Freelance Payment',     category: 'Freelance',        amount: 2500.00, date: '2024-06-08', method: 'ACH Deposit'   },
  { id: 8,  merchant: 'Spotify',               category: 'Entertainment',    amount: -9.99,   date: '2024-06-07', method: 'Recurring'     },
  { id: 9,  merchant: 'Planet Fitness',        category: 'Health & Fitness', amount: -49.99,  date: '2024-06-06', method: 'VISA •••• 4242' },
  { id: 10, merchant: 'Electric Bill',         category: 'Utilities',        amount: -87.42,  date: '2024-06-05', method: 'Auto Pay'      },
  { id: 11, merchant: 'Target',                category: 'Shopping',         amount: -63.20,  date: '2024-05-28', method: 'VISA •••• 4242' },
  { id: 12, merchant: 'TechCorp Salary',       category: 'Salary',           amount: 6200.00, date: '2024-05-15', method: 'ACH Deposit'   },
  { id: 13, merchant: 'Chipotle',              category: 'Food & Groceries', amount: -14.50,  date: '2024-05-22', method: 'VISA •••• 4242' },
  { id: 14, merchant: 'Water Bill',            category: 'Utilities',        amount: -42.00,  date: '2024-05-18', method: 'Auto Pay'      },
  { id: 15, merchant: 'Side Project Income',   category: 'Freelance',        amount: 800.00,  date: '2024-05-12', method: 'PayPal'        },
  { id: 16, merchant: 'Trader Joes',           category: 'Food & Groceries', amount: -98.30,  date: '2024-05-10', method: 'VISA •••• 4242' },
  { id: 17, merchant: 'Lyft',                  category: 'Transportation',   amount: -18.20,  date: '2024-05-08', method: 'VISA •••• 4242' },
  { id: 18, merchant: 'Investment Returns',    category: 'Investment',       amount: 450.00,  date: '2024-04-30', method: 'Brokerage'     },
  { id: 19, merchant: 'TechCorp Salary',       category: 'Salary',           amount: 6200.00, date: '2024-04-15', method: 'ACH Deposit'   },
  { id: 20, merchant: 'Apple Store',           category: 'Shopping',         amount: -299.00, date: '2024-04-12', method: 'VISA •••• 4242' },
  { id: 21, merchant: 'CVS Pharmacy',          category: 'Health & Fitness', amount: -32.80,  date: '2024-04-08', method: 'VISA •••• 4242' },
  { id: 22, merchant: 'Gas Station',           category: 'Transportation',   amount: -55.00,  date: '2024-04-05', method: 'VISA •••• 4242' },
  { id: 23, merchant: 'TechCorp Salary',       category: 'Salary',           amount: 6200.00, date: '2024-03-15', method: 'ACH Deposit'   },
  { id: 24, merchant: 'Whole Foods Market',    category: 'Food & Groceries', amount: -120.40, date: '2024-03-20', method: 'VISA •••• 4242' },
  { id: 25, merchant: 'Q1 Bonus',             category: 'Bonus',             amount: 2000.00, date: '2024-03-28', method: 'ACH Deposit'   },
  { id: 26, merchant: 'Netflix',               category: 'Entertainment',    amount: -19.99,  date: '2024-03-12', method: 'Recurring'     },
  { id: 27, merchant: 'TechCorp Salary',       category: 'Salary',           amount: 6200.00, date: '2024-02-15', method: 'ACH Deposit'   },
  { id: 28, merchant: 'Amazon',                category: 'Shopping',         amount: -89.99,  date: '2024-02-20', method: 'VISA •••• 4242' },
  { id: 29, merchant: 'Electric Bill',         category: 'Utilities',        amount: -94.20,  date: '2024-02-08', method: 'Auto Pay'      },
  { id: 30, merchant: 'TechCorp Salary',       category: 'Salary',           amount: 6200.00, date: '2024-01-15', method: 'ACH Deposit'   },
];

// ── Budget allocations (static defaults) ────────────────────────────
export const DEFAULT_BUDGETS = [
  { category: 'Food & Groceries', allocated: 500  },
  { category: 'Shopping',         allocated: 300  },
  { category: 'Entertainment',    allocated: 150  },
  { category: 'Transportation',   allocated: 200  },
  { category: 'Utilities',        allocated: 250  },
  { category: 'Health & Fitness', allocated: 100  },
  { category: 'Housing',          allocated: 1500 },
  { category: 'Education',        allocated: 100  },
];

// ── Credit card (static) ─────────────────────────────────────────────
export const creditCard = {
  number: '4242 8812 0031 9904',
  holder: 'ALEX MERCER',
  expires: '12/28',
  type: 'VISA',
};

// ── Landing page content ─────────────────────────────────────────────
export const features = [
  {
    icon: 'analytics',
    title: 'Real-time Analytics',
    description: 'Watch your wealth grow in high definition. Every transaction is categorized instantly using our AI models.',
    color: 'text-primary',
    bg: 'bg-primary-fixed/50',
  },
  {
    icon: 'lock',
    title: 'Secure Sync',
    description: 'Bank-level 256-bit AES encryption. We sync with 10,000+ institutions globally with read-only access.',
    color: 'text-secondary',
    bg: 'bg-secondary-container/30',
  },
  {
    icon: 'account_balance_wallet',
    title: 'Smart Budgets',
    description: 'Set adaptive limits that learn from your lifestyle. SpendSmart nudges you before you overspend.',
    color: 'text-primary',
    bg: 'bg-primary-fixed/50',
  },
];

export const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    description: 'Perfect for getting started',
    features: ['Up to 3 bank accounts', 'Basic expense tracking', '3 months of history', 'Standard reports'],
    cta: 'Get Started',
    highlight: false,
  },
  {
    name: 'Premium',
    price: '$9',
    period: '/month',
    description: 'For serious financial mastery',
    features: ['Unlimited bank accounts', 'Real-time analytics', 'Full transaction history', 'Smart budgets & AI insights', 'Priority support', 'Export CSV/PDF'],
    cta: 'Start Free Trial',
    highlight: true,
  },
  {
    name: 'Family',
    price: '$19',
    period: '/month',
    description: 'Share with up to 5 members',
    features: ['Everything in Premium', 'Up to 5 user accounts', 'Shared budgets', 'Family spending insights', 'Dedicated support'],
    cta: 'Start Free Trial',
    highlight: false,
  },
];

export const navItems = [
  { label: 'Dashboard',    icon: 'dashboard',           path: '/dashboard'    },
  { label: 'Transactions', icon: 'receipt_long',        path: '/transactions' },
  { label: 'Categories',   icon: 'category',            path: '/categories'   },
  { label: 'Budget',       icon: 'account_balance_wallet', path: '/budget'   },
  { label: 'Analytics',   icon: 'analytics',            path: '/analytics'    },
  { label: 'Settings',    icon: 'settings',             path: '/settings'     },
];
