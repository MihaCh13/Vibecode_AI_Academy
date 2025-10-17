import axios from 'axios';
import Cookies from 'js-cookie';
import { AuthResponse, LoginCredentials, RegisterData, Roles } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  // Check both localStorage and cookies for token
  const token = localStorage.getItem('token') || Cookies.get('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/login', credentials);
    const { token } = response.data;
    Cookies.set('auth_token', token, { expires: 7 });
    return response.data;
  },

  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/register', data);
    const { token } = response.data;
    Cookies.set('auth_token', token, { expires: 7 });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/logout');
    Cookies.remove('auth_token');
  },

  me: async () => {
    const response = await api.get('/me');
    return response.data;
  },

  getRoles: async (): Promise<{ roles: Roles }> => {
    const response = await api.get('/roles');
    return response.data;
  },
};

export const toolsAPI = {
  getTools: async () => {
    const response = await api.get('/tools');
    return response.data;
  },

  createTool: async (toolData: any) => {
    const config = {
      headers: {
        'Content-Type': toolData instanceof FormData ? 'multipart/form-data' : 'application/json',
      },
    };
    const response = await api.post('/tools', toolData, config);
    return response.data;
  },

  getTool: async (id: number) => {
    const response = await api.get(`/tools/${id}`);
    return response.data;
  },

  updateTool: async (id: number, toolData: any) => {
    const response = await api.put(`/tools/${id}`, toolData);
    return response.data;
  },

  deleteTool: async (id: number) => {
    const response = await api.delete(`/tools/${id}`);
    return response.data;
  },
};

export const categoriesAPI = {
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
};

export const rolesAPI = {
  getRoles: async () => {
    const response = await api.get('/roles');
    return response.data;
  },
};

export const newToolsAPI = {
  getTools: async (filters?: {
    role?: string;
    category?: number;
    name?: string;
    tags?: string[];
  }) => {
    const params = new URLSearchParams();
    if (filters?.role) params.append('role', filters.role);
    if (filters?.category) params.append('category', filters.category.toString());
    if (filters?.name) params.append('name', filters.name);
    if (filters?.tags?.length) params.append('tags', filters.tags.join(','));
    
    const url = `/tools-new${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
  },

  getTool: async (id: number) => {
    const response = await api.get(`/tools-new/${id}`);
    return response.data;
  },

  getMyTools: async () => {
    const response = await api.get('/tools-new/my-tools');
    return response.data;
  },

  createTool: async (toolData: any) => {
    const response = await api.post('/tools-new', toolData);
    return response.data;
  },

  updateTool: async (id: number, toolData: any) => {
    const response = await api.put(`/tools-new/${id}`, toolData);
    return response.data;
  },

  deleteTool: async (id: number) => {
    const response = await api.delete(`/tools-new/${id}`);
    return response.data;
  },
};

export const statsAPI = {
  getStats: async () => {
    const response = await api.get('/stats');
    return response.data;
  },

  getAdminStats: async () => {
    const response = await api.get('/stats/admin');
    return response.data;
  },

  getCacheStats: async () => {
    const response = await api.get('/stats/cache');
    return response.data;
  },

  warmCache: async () => {
    const response = await api.post('/stats/warm-cache');
    return response.data;
  },

  clearCache: async () => {
    const response = await api.post('/stats/clear-cache');
    return response.data;
  },
};

export const auditAPI = {
  getLogs: async (filters?: {
    user_id?: number;
    action?: string;
    target_type?: string;
    start_date?: string;
    end_date?: string;
    search?: string;
    per_page?: number;
    page?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const url = `/audit-logs${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await api.get(url);
    return response.data;
  },

  getLog: async (id: number) => {
    const response = await api.get(`/audit-logs/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/audit-logs/stats');
    return response.data;
  },

  exportToCsv: async (filters?: {
    user_id?: number;
    action?: string;
    target_type?: string;
    start_date?: string;
    end_date?: string;
    search?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    
    const url = `/audit-logs/export${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await api.get(url, { responseType: 'blob' });
    return response.data;
  },

  getFilterOptions: async () => {
    const response = await api.get('/audit-logs/filter-options');
    return response.data;
  },
};

export const twoFactorAPI = {
  getStatus: async () => {
    const response = await api.get('/2fa/status');
    return response.data;
  },

  enableEmail: async () => {
    const response = await api.post('/2fa/enable/email');
    return response.data;
  },

  enableTelegram: async () => {
    const response = await api.post('/2fa/enable/telegram');
    return response.data;
  },

  enableTotp: async () => {
    const response = await api.post('/2fa/enable/totp');
    return response.data;
  },

  verify: async (code: string, method: string) => {
    const response = await api.post('/2fa/verify', { code, method });
    return response.data;
  },

  disable: async () => {
    const response = await api.delete('/2fa/disable');
    return response.data;
  },

  generateCode: async (method: string) => {
    const response = await api.post('/2fa/generate-code', { method });
    return response.data;
  },

  connectTelegram: async (telegramChatId: string) => {
    const response = await api.post('/2fa/connect-telegram', { telegram_chat_id: telegramChatId });
    return response.data;
  },

  getTelegramBotInfo: async () => {
    const response = await api.get('/2fa/telegram-bot-info');
    return response.data;
  },
};

export default api;
