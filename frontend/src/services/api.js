const normalizeApiBase = (url) => {
  const trimmed = (url || '').trim().replace(/\/$/, '');
  if (!trimmed) return '';
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const API_BASE_URL = normalizeApiBase(
  process.env.REACT_APP_API_URL || 'https://electronics-shop-backend-nax9.onrender.com/api'
);

// Helper function for making requests 
const fetchAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem('adminToken');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : { message: `Request failed with status ${response.status}` };

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// Products API
export const productsAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`/products${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => fetchAPI(`/products/${id}`),
  create: (productData) => fetchAPI('/products', {
    method: 'POST',
    body: JSON.stringify(productData)
  }),
  update: (id, productData) => fetchAPI(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData)
  }),
  delete: (id) => fetchAPI(`/products/${id}`, {
    method: 'DELETE'
  })
};

// Users API
export const usersAPI = {
  getAll: () => fetchAPI('/users'),
  getById: (id) => fetchAPI(`/users/${id}`),
  update: (id, userData) => fetchAPI(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData)
  }),
  delete: (id) => fetchAPI(`/users/${id}`, {
    method: 'DELETE'
  }),
  toggleStatus: (id) => fetchAPI(`/users/${id}/toggle-status`, {
    method: 'PATCH'
  })
};

// Orders API
export const ordersAPI = {
  getAll: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI(`/orders${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id) => fetchAPI(`/orders/${id}`),
  updateStatus: (id, status) => fetchAPI(`/orders/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),
  updatePayment: (id, paymentStatus) => fetchAPI(`/orders/${id}/payment`, {
    method: 'PATCH',
    body: JSON.stringify({ paymentStatus })
  }),
  updateTracking: (id, trackingNumber) => fetchAPI(`/orders/${id}/tracking`, {
    method: 'PATCH',
    body: JSON.stringify({ trackingNumber })
  }),
  delete: (id) => fetchAPI(`/orders/${id}`, {
    method: 'DELETE'
  })
};

// Admin API
export const adminAPI = {
  login: (credentials) => fetchAPI('/admin/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  getDashboard: () => fetchAPI('/admin/dashboard'),
  createAdmin: (adminData) => fetchAPI('/admin/create', {
    method: 'POST',
    body: JSON.stringify(adminData)
  })
};

export default {
  products: productsAPI,
  users: usersAPI,
  orders: ordersAPI,
  admin: adminAPI
};
