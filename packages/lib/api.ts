const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Generic fetch wrapper with error handling
async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${url}:`, error);
    throw error;
  }
}

// Admin API functions
export const adminApi = {
  // Dashboard
  getDashboardStats: () =>
    apiFetch<any>('/admin/dashboard'),

  getSalesData: (days?: number) =>
    apiFetch<any>(`/admin/dashboard/sales${days ? `?days=${days}` : ''}`),

  getUserRegistrationData: (days?: number) =>
    apiFetch<any>(`/admin/dashboard/registrations${days ? `?days=${days}` : ''}`),

  // User management
  getUsers: (role?: string, search?: string) =>
    apiFetch<any[]>(`/admin/users?${new URLSearchParams({ ...(role && { role }), ...(search && { search }) })}`),

  getUser: (id: string) =>
    apiFetch<any>(`/admin/users/${id}`),

  createUser: (userData: { name: string; email: string; role?: string }) =>
    apiFetch<any>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  updateUserRole: (id: string, role: string) =>
    apiFetch<any>(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),

  deleteUser: (id: string) =>
    apiFetch<any>(`/admin/users/${id}`, {
      method: 'DELETE',
      body: JSON.stringify({ reason: 'Deleted by admin' }),
    }),

  banUser: (id: string, reason: string) =>
    apiFetch<any>(`/admin/users/${id}/ban`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  unbanUser: (id: string, reason: string) =>
    apiFetch<any>(`/admin/users/${id}/unban`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),

  getSuspendedUsers: () =>
    apiFetch<any[]>('/admin/users?suspended=true'),

  getBannedUsers: (search?: string) =>
    apiFetch<any[]>(`/admin/users/banned?${new URLSearchParams({ ...(search && { search }) })}`),

  // Vendor Management
  getVendors: (status?: string, search?: string) =>
    apiFetch<any[]>(`/admin/vendors?${new URLSearchParams({ ...(status && { status }), ...(search && { search }) })}`),

  getVendor: (id: string) =>
    apiFetch<any>(`/admin/vendors/${id}`),

  updateVendorStatus: (id: string, status: string) =>
    apiFetch<any>(`/admin/vendors/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  deleteVendor: (id: string) =>
    apiFetch<any>(`/admin/vendors/${id}`, {
      method: 'DELETE',
    }),

  getVendorApplications: (status?: string, search?: string) =>
    apiFetch<any[]>(`/admin/vendors/applications?${new URLSearchParams({ ...(status && { status }), ...(search && { search }) })}`),

  approveVendorApplication: (id: string) =>
    apiFetch<any>(`/admin/vendors/applications/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ reviewedBy: 'admin' }),
    }),

  rejectVendorApplication: (id: string, reason: string) =>
    apiFetch<any>(`/admin/vendors/applications/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reviewedBy: 'admin', reason }),
    }),

  // Platform settings
  getPlatformSettings: () =>
    apiFetch<any>('/admin/settings'),

  updatePlatformSettings: (settings: {
    platformFeePercent?: number;
    cryptoPaymentEnabled?: boolean;
    btcpayUrl?: string;
    btcpayApiKey?: string;
    btcpayStoreId?: string;
  }) =>
    apiFetch<any>('/admin/settings', {
      method: 'PATCH',
      body: JSON.stringify(settings),
    }),

  // Orders
  getOrders: (status?: string, search?: string) =>
    apiFetch<any[]>(`/admin/orders?${new URLSearchParams({ ...(status && { status }), ...(search && { search }) })}`),

  updateOrderStatus: (id: string, status: string) =>
    apiFetch<any>(`/admin/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // Disputes
  getDisputes: (status?: string, search?: string) =>
    apiFetch<any[]>(`/admin/disputes?${new URLSearchParams({ ...(status && { status }), ...(search && { search }) })}`),

  resolveDispute: (id: string, resolution: string) =>
    apiFetch<any>(`/admin/disputes/${id}/resolve`, {
      method: 'PATCH',
      body: JSON.stringify({ resolution }),
    }),

  // Reports
  getProfitReport: (startDate?: string, endDate?: string) =>
    apiFetch<any>(`/admin/reports/profit?${new URLSearchParams({ ...(startDate && { startDate }), ...(endDate && { endDate }) })}`),

  // Product Management
  getProducts: (status?: string, search?: string) =>
    apiFetch<any[]>(`/admin/products?${new URLSearchParams({ ...(status && { status }), ...(search && { search }) })}`),

  getProduct: (id: string) =>
    apiFetch<any>(`/admin/products/${id}`),

  updateProductStatus: (id: string, status: string) =>
    apiFetch<any>(`/admin/products/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  deleteProduct: (id: string) =>
    apiFetch<any>(`/admin/products/${id}`, {
      method: 'DELETE',
    }),

  createProduct: (productData: any) =>
    apiFetch<any>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    }),

  getPendingProducts: (search?: string) =>
    apiFetch<any[]>(`/admin/products/pending?${new URLSearchParams({ ...(search && { search }) })}`),

  approveProduct: (id: string) =>
    apiFetch<any>(`/admin/products/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'PUBLISHED' }),
    }),

  rejectProduct: (id: string, reason: string) =>
    apiFetch<any>(`/admin/products/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'REJECTED', reason }),
    }),

  // Tag Management
  getTags: (search?: string) =>
    apiFetch<any[]>(`/admin/tags?${new URLSearchParams({ ...(search && { search }) })}`),

  getTag: (id: string) =>
    apiFetch<any>(`/admin/tags/${id}`),

  createTag: (tagData: { name: string; isActive?: boolean }) =>
    apiFetch<any>('/admin/tags', {
      method: 'POST',
      body: JSON.stringify(tagData),
    }),

  updateTag: (id: string, tagData: { name?: string; isActive?: boolean }) =>
    apiFetch<any>(`/admin/tags/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(tagData),
    }),

  deleteTag: (id: string) =>
    apiFetch<any>(`/admin/tags/${id}`, {
      method: 'DELETE',
    }),

  // Category Management
  getCategories: (search?: string) =>
    apiFetch<any[]>(`/admin/categories?${new URLSearchParams({ ...(search && { search }) })}`),

  getCategory: (id: string) =>
    apiFetch<any>(`/admin/categories/${id}`),

  createCategory: (categoryData: { name: string; isActive?: boolean; parentId?: string }) => {
    console.log('API: Creating category with data:', categoryData);
    return apiFetch<any>('/admin/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  updateCategory: (id: string, categoryData: { name?: string; isActive?: boolean; parentId?: string }) =>
    apiFetch<any>(`/admin/categories/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(categoryData),
    }),

  deleteCategory: (id: string) =>
    apiFetch<any>(`/admin/categories/${id}`, {
      method: 'DELETE',
    }),

  // Statistics
  getUserStats: () =>
    apiFetch<any>('/admin/stats/users'),

  getBannedUserStats: () =>
    apiFetch<any>('/admin/stats/banned-users'),

  getVendorStats: () =>
    apiFetch<any>('/admin/stats/vendors'),

  getVendorApplicationStats: () =>
    apiFetch<any>('/admin/stats/vendor-applications'),

  // SEO Management
  getSeoSettings: () =>
    apiFetch<any[]>('/admin/seo'),

  getSeoSettingsByPage: (page: string) =>
    apiFetch<any>(`/admin/seo/${page}`),

  updateSeoSettings: (page: string, data: { title?: string; description?: string; keywords?: string; author?: string }) =>
    apiFetch<any>(`/admin/seo/${page}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  createSeoSettings: (data: { page: string; title?: string; description?: string; keywords?: string; author?: string }) =>
    apiFetch<any>('/admin/seo', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// Seller API functions
export const sellerApi = {
  // Products
  getProducts: (page?: number, limit?: number, search?: string, status?: string) =>
    apiFetch<any>(`/vendor/products?${new URLSearchParams({
      ...(page && { page: page.toString() }),
      ...(limit && { limit: limit.toString() }),
      ...(search && { search }),
      ...(status && { status })
    })}`),

  createProduct: (product: any) =>
    apiFetch<any>('/vendor/products', {
      method: 'POST',
      body: JSON.stringify(product),
    }),

  updateProduct: (id: string, product: any) =>
    apiFetch<any>(`/vendor/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(product),
    }),

  deleteProduct: (id: string) =>
    apiFetch<any>(`/vendor/products/${id}`, {
      method: 'DELETE',
    }),

  // Orders
  getOrders: (page?: number, limit?: number, status?: string) =>
    apiFetch<any>(`/vendor/orders?${new URLSearchParams({
      ...(page && { page: page.toString() }),
      ...(limit && { limit: limit.toString() }),
      ...(status && { status })
    })}`),

  // Disputes
  getDisputes: () =>
    apiFetch<any[]>('/vendor/disputes'),

  sendMessage: (disputeId: string, conversationId: string, content: string) =>
    apiFetch<any>(`/vendor/disputes/${disputeId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ conversationId, content }),
    }),
};

// Buyer API functions
export const buyerApi = {
  // Orders
  getOrders: () =>
    apiFetch<any[]>('/orders/buyer'),

  createOrder: (productId: string, quantity: number = 1) =>
    apiFetch<any>('/orders/buyer', {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    }),

  getOrder: (id: string) =>
    apiFetch<any>(`/orders/buyer/${id}`),

  // Disputes
  getDisputes: () =>
    apiFetch<any[]>('/disputes/buyer'),

  createDispute: (orderId: string, productId: string, reason: string) =>
    apiFetch<any>('/disputes/buyer', {
      method: 'POST',
      body: JSON.stringify({ orderId, productId, reason }),
    }),

  cancelDispute: (id: string) =>
    apiFetch<any>(`/disputes/buyer/${id}/cancel`, {
      method: 'PATCH',
    }),
};

// Public API functions
export const publicApi = {
  // Products
  getProducts: (category?: string, minPrice?: string, maxPrice?: string, search?: string) =>
    apiFetch<any[]>(`/products?${new URLSearchParams({ ...(category && { category }), ...(minPrice && { minPrice }), ...(maxPrice && { maxPrice }), ...(search && { search }) })}`),

  getProduct: (id: string) =>
    apiFetch<any>(`/products/${id}`),

  // Public Products API (new endpoints)
  getPublishedProducts: (params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    search?: string;
    sortBy?: string;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.categoryId) queryParams.append('categoryId', params.categoryId);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);

    return apiFetch<{ success: boolean; data: any[]; pagination: any }>(`/api/products?${queryParams.toString()}`);
  },

  getPublishedProduct: (id: string) =>
    apiFetch<{ success: boolean; data: any }>(`/api/products/${id}`),

  getCategories: () =>
    apiFetch<{ success: boolean; data: any[] }>('/api/products/categories'),

  getPublishedProductsByIds: (ids: string[]) =>
    apiFetch<{ success: boolean; data: any[] }>('/api/products/batch', {
      method: 'POST',
      body: JSON.stringify({ ids }),
    }),
};