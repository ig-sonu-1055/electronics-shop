const USD_TO_INR_RATE = 83;

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const convertToINR = (value) => toNumber(value) * USD_TO_INR_RATE;

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
