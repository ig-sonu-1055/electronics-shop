const DEFAULT_API_BASE = 'https://electronics-shop-backend-nax9.onrender.com/api';

const normalizeApiBase = (rawUrl) => {
  const value = (rawUrl || '').trim();

  if (!value) return DEFAULT_API_BASE;

  let resolved = value;

  // Handle accidental host-less values like :5000/api
  if (resolved.startsWith(':') && typeof window !== 'undefined') {
    resolved = `${window.location.protocol}//${window.location.hostname}${resolved}`;
  }

  // Handle root-relative values like /api
  if (resolved.startsWith('/') && typeof window !== 'undefined') {
    resolved = `${window.location.origin}${resolved}`;
  }

  // Handle bare host values like electronics-shop-backend.onrender.com
  if (!/^https?:\/\//i.test(resolved) && /^[-a-z0-9.]+(?::\d+)?(\/.*)?$/i.test(resolved)) {
    resolved = `https://${resolved}`;
  }

  resolved = resolved.replace(/\/$/, '');

  if (!resolved.endsWith('/api')) {
    resolved = `${resolved}/api`;
  }

  try {
    const parsed = new URL(resolved);
    if (!parsed.protocol || !parsed.host) {
      return DEFAULT_API_BASE;
    }
    return resolved;
  } catch {
    return DEFAULT_API_BASE;
  }
};

export const API_BASE_URL = normalizeApiBase(process.env.REACT_APP_API_URL);
