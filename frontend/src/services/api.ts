import axios, { AxiosInstance } from 'axios';
import { LoginRequest, AuthResponse, User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization header to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (credentials: LoginRequest) =>
    apiClient.post<AuthResponse>('/auth/login', credentials),
  getMe: () => apiClient.get<{ success: boolean; data: User }>('/auth/me'),
};

export const customerApi = {
  getAll: (page = 1, limit = 10, search?: string, status?: string) =>
    apiClient.get('/customers', { params: { page, limit, search, status } }),
  getById: (id: string) => apiClient.get(`/customers/${id}`),
  create: (data: any) => apiClient.post('/customers', data),
  update: (id: string, data: any) => apiClient.put(`/customers/${id}`, data),
  delete: (id: string) => apiClient.delete(`/customers/${id}`),
  getNotes: (customerId: string, page = 1, limit = 10) =>
    apiClient.get(`/customers/${customerId}/notes`, { params: { page, limit } }),
  addNote: (customerId: string, noteText: string) =>
    apiClient.post(`/customers/${customerId}/notes`, { noteText }),
  updateNote: (customerId: string, noteId: string, noteText: string) =>
    apiClient.put(`/customers/${customerId}/notes/${noteId}`, { noteText }),
  deleteNote: (customerId: string, noteId: string) =>
    apiClient.delete(`/customers/${customerId}/notes/${noteId}`),
};

export const productApi = {
  getAll: (page = 1, limit = 10, search?: string, active?: boolean) =>
    apiClient.get('/products', { params: { page, limit, search, active } }),
  getById: (id: string) => apiClient.get(`/products/${id}`),
  create: (data: any) => apiClient.post('/products', data),
  update: (id: string, data: any) => apiClient.put(`/products/${id}`, data),
  delete: (id: string) => apiClient.delete(`/products/${id}`),
};

export const inventoryApi = {
  stockIn: (productId: string, quantity: number, reason: string) =>
    apiClient.post('/inventory/stock-in', { productId, quantity, reason }),
  stockOut: (productId: string, quantity: number, reason: string) =>
    apiClient.post('/inventory/stock-out', { productId, quantity, reason }),
  getMovements: (page = 1, limit = 10) =>
    apiClient.get('/inventory/movements', { params: { page, limit } }),
  getProductMovements: (productId: string, page = 1, limit = 10) =>
    apiClient.get(`/inventory/products/${productId}/movements`, { params: { page, limit } }),
};

export const challanApi = {
  getAll: (page = 1, limit = 10, status?: string) =>
    apiClient.get('/challans', { params: { page, limit, status } }),
  getById: (id: string) => apiClient.get(`/challans/${id}`),
  create: (data: any) => apiClient.post('/challans', data),
  update: (id: string, data: any) => apiClient.put(`/challans/${id}`, data),
  confirm: (id: string) => apiClient.post(`/challans/${id}/confirm`),
  cancel: (id: string) => apiClient.post(`/challans/${id}/cancel`),
};

export default apiClient;
