const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

// Prices in this project are stored as direct catalog values.
// We format them as INR without applying a conversion multiplier.
export const convertToINR = (value) => toNumber(value);

export const formatINR = (value, options = {}) => {
  const amount = convertToINR(value);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    ...options,
  }).format(amount);
};

export const formatINRCompact = (value) => {
  const amount = convertToINR(value);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
};
