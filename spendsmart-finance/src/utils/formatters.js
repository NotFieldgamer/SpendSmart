// src/utils/formatters.js

/**
 * Format a number as USD currency string.
 * @param {number} amount - The amount to format (absolute value is used)
 * @param {boolean} showSign - Whether to prepend + for positive amounts
 */
export const formatCurrency = (amount, showSign = false) => {
  const abs = Math.abs(amount);
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(abs);

  if (showSign) {
    return amount >= 0 ? `+${formatted}` : `-${formatted}`;
  }
  return formatted;
};

/**
 * Format a transaction amount with sign prefix.
 * Positive → "+$1,234.56", Negative → "-$1,234.56"
 */
export const formatAmount = (amount) => {
  const abs = Math.abs(amount);
  const sign = amount >= 0 ? '+' : '-';
  return `${sign}$${abs.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

/**
 * Return true if this is an income transaction
 */
export const isIncome = (amount) => amount >= 0;

/**
 * Format a date string (YYYY-MM-DD) to a readable label.
 * Example: '2024-06-14' → 'Jun 14'
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format a date string to a full readable label.
 * Example: '2024-06-14' → 'June 14, 2024'
 */
export const formatDateFull = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format a number as a compact string.
 * Example: 12400 → '$12.4k', 142 → '$142'
 */
export const formatCompact = (amount) => {
  const abs = Math.abs(amount);
  if (abs >= 1000) return `$${(abs / 1000).toFixed(1)}k`;
  return `$${abs.toFixed(0)}`;
};
