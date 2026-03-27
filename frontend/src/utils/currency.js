const USD_TO_INR = 83.5;

export const formatINR = (usd) => {
  if (usd == null) return '—';
  const inr = usd * USD_TO_INR;
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(inr);
};

export const formatINRChange = (usd) => {
  if (usd == null) return '—';
  const inr = usd * USD_TO_INR;
  const formatted = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(Math.abs(inr));
  return `${inr >= 0 ? '+' : '-'}${formatted}`;
};

export const toINR = (usd) => (usd ?? 0) * USD_TO_INR;
