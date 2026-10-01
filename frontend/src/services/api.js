const BASE_URL = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('aura_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  // If body is FormData, don't set Content-Type header so browser sets multipart boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errMessage = 'An unexpected error occurred';
    try {
      const errData = await response.json();
      errMessage = errData.detail || errData.message || JSON.stringify(errData);
    } catch {
      errMessage = `Server error (${response.status}): ${response.statusText}`;
    }
    throw new Error(errMessage);
  }

  return response.json();
}

export const api = {
  // Auth
  login: (creds) => request('/auth/login', { method: 'POST', body: JSON.stringify(creds) }),
  register: (data) => request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request('/auth/me'),
  updateProfile: (data) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
  forgotPassword: (data) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify(data) }),

  // Categories
  getCategories: () => request('/categories'),
  createCategory: (data) => request('/categories', { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id, data) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id) => request(`/categories/${id}`, { method: 'DELETE' }),

  // Products
  getProducts: (params = {}) => {
    const cleanParams = Object.entries(params)
      .filter(([_, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');
    return request(`/products${cleanParams ? `?${cleanParams}` : ''}`);
  },
  getFeaturedSections: () => request('/products/featured-sections'),
  getProduct: (idOrSlug) => request(`/products/${idOrSlug}`),
  createProduct: (data) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/products/upload-image', { method: 'POST', body: formData });
  },

  // Cart
  getCart: () => request('/cart'),
  addToCart: (data) => request('/cart/add', { method: 'POST', body: JSON.stringify(data) }),
  updateCartItem: (id, quantity) => request(`/cart/${id}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
  deleteCartItem: (id) => request(`/cart/${id}`, { method: 'DELETE' }),
  clearCart: () => request('/cart/clear/all', { method: 'DELETE' }),

  // Wishlist
  getWishlist: () => request('/wishlist'),
  toggleWishlist: (productId) => request(`/wishlist/toggle/${productId}`, { method: 'POST' }),
  removeFromWishlist: (productId) => request(`/wishlist/${productId}`, { method: 'DELETE' }),

  // Addresses
  getAddresses: () => request('/addresses'),
  createAddress: (data) => request('/addresses', { method: 'POST', body: JSON.stringify(data) }),
  updateAddress: (id, data) => request(`/addresses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteAddress: (id) => request(`/addresses/${id}`, { method: 'DELETE' }),
  setDefaultAddress: (id) => request(`/addresses/${id}/set-default`, { method: 'POST' }),

  // Orders
  placeOrder: (data) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getMyOrders: () => request('/orders/my-orders'),
  getOrderById: (id) => request(`/orders/${id}`),
  trackOrder: (id) => request(`/orders/${id}/track`),
  cancelOrder: (id) => request(`/orders/${id}/cancel`, { method: 'POST' }),
  getAdminOrders: (params = {}) => {
    const cleanParams = Object.entries(params)
      .filter(([_, v]) => v !== undefined && v !== null && v !== '')
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');
    return request(`/orders/admin/all${cleanParams ? `?${cleanParams}` : ''}`);
  },
  updateOrderStatus: (id, data) => request(`/orders/admin/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }),

  // Payments
  processPaymentSimulation: (data) => request('/payments/process-simulation', { method: 'POST', body: JSON.stringify(data) }),

  // Reviews
  getProductReviews: (productId) => request(`/reviews/product/${productId}`),
  addReview: (data) => request('/reviews', { method: 'POST', body: JSON.stringify(data) }),
  getAdminReviews: () => request('/reviews/admin/all'),
  deleteAdminReview: (id) => request(`/reviews/admin/${id}`, { method: 'DELETE' }),

  // Coupons
  getActiveCoupons: () => request('/coupons/active'),
  applyCoupon: (code, subtotal) => request('/coupons/apply', { method: 'POST', body: JSON.stringify({ code, subtotal }) }),
  getAdminCoupons: () => request('/coupons/admin/all'),
  createAdminCoupon: (data) => request('/coupons/admin', { method: 'POST', body: JSON.stringify(data) }),
  deleteAdminCoupon: (id) => request(`/coupons/admin/${id}`, { method: 'DELETE' }),

  // Notifications
  getNotifications: () => request('/notifications'),
  markNotificationRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
  markAllNotificationsRead: () => request('/notifications/read-all', { method: 'PUT' }),

  // Admin Analytics
  getDashboardStats: () => request('/admin/dashboard/stats'),
  getDashboardCharts: () => request('/admin/dashboard/charts'),
  getInventory: () => request('/admin/inventory'),
  updateInventory: (productId, stock) => request(`/admin/inventory/${productId}`, { method: 'PUT', body: JSON.stringify({ stock }) }),
  getCustomers: () => request('/admin/customers'),
};
