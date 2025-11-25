import apiClient from './apiClient';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'student' | 'canteen_manager';
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// Auth APIs
export const authApi = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};

// Admin APIs
export const adminApi = {
  createUser: async (userData: {
    name: string;
    email: string;
    password: string;
    role: string;
  }) => {
    const response = await apiClient.post('/admin/users', userData);
    return response.data;
  },

  getAllUsers: async (page: number = 1, limit: number = 50) => {
    const response = await apiClient.get('/admin/users', {
      params: { page, limit },
    });
    return response.data;
  },

  getUserById: async (id: number) => {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data;
  },

  updateUser: async (id: number, updates: any) => {
    const response = await apiClient.put(`/admin/users/${id}`, updates);
    return response.data;
  },

  deleteUser: async (id: number) => {
    const response = await apiClient.delete(`/admin/users/${id}`);
    return response.data;
  },

  getSystemStats: async () => {
    const response = await apiClient.get('/admin/stats');
    return response.data;
  },
};

// Student APIs
export const studentApi = {
  getFoodSuggestions: async () => {
    const response = await apiClient.get('/student/suggestions');
    return response.data;
  },

  getAvailableMenus: async () => {
    const response = await apiClient.get('/student/menus');
    return response.data;
  },

  placeOrder: async (orderData: {
    menuId: number;
    quantity: number;
    notes?: string;
  }) => {
    const response = await apiClient.post('/student/orders', orderData);
    return response.data;
  },

  getOrderHistory: async (page: number = 1, limit: number = 20) => {
    const response = await apiClient.get('/student/orders', {
      params: { page, limit },
    });
    return response.data;
  },

  getOrderById: async (id: number) => {
    const response = await apiClient.get(`/student/orders/${id}`);
    return response.data;
  },

  cancelOrder: async (id: number) => {
    const response = await apiClient.patch(`/student/orders/${id}/cancel`);
    return response.data;
  },
};

// Canteen Manager APIs
export const managerApi = {
  getSalesInsights: async (period: 'daily' | 'weekly' | 'monthly' = 'daily') => {
    const response = await apiClient.get('/manager/sales', {
      params: { period },
    });
    return response.data;
  },

  getIncomingOrders: async (status?: string) => {
    const response = await apiClient.get('/manager/orders', {
      params: status ? { status } : {},
    });
    return response.data;
  },

  updateOrderStatus: async (id: number, status: string) => {
    const response = await apiClient.patch(`/manager/orders/${id}/status`, {
      status,
    });
    return response.data;
  },

  getAllMenus: async () => {
    const response = await apiClient.get('/manager/menus');
    return response.data;
  },

  createMenu: async (menuData: {
    title: string;
    description: string;
    price: number;
    category: string;
    image_url?: string;
  }) => {
    const response = await apiClient.post('/manager/menus', menuData);
    return response.data;
  },

  updateMenu: async (id: number, updates: any) => {
    const response = await apiClient.put(`/manager/menus/${id}`, updates);
    return response.data;
  },

  deleteMenu: async (id: number) => {
    const response = await apiClient.delete(`/manager/menus/${id}`);
    return response.data;
  },
};
