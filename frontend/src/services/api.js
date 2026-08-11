import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const apiClient = axios.create({
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
apiClient.interceptors.response.use((response) => response, (error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
    return Promise.reject(error);
});
export const authApi = {
    login: (credentials) => apiClient.post('/auth/login', credentials),
    getMe: () => apiClient.get('/auth/me'),
};
export const customerApi = {
    getAll: (page = 1, limit = 10, search, status) => apiClient.get('/customers', { params: { page, limit, search, status } }),
    getById: (id) => apiClient.get(`/customers/${id}`),
    create: (data) => apiClient.post('/customers', data),
    update: (id, data) => apiClient.put(`/customers/${id}`, data),
    delete: (id) => apiClient.delete(`/customers/${id}`),
    getNotes: (customerId, page = 1, limit = 10) => apiClient.get(`/customers/${customerId}/notes`, { params: { page, limit } }),
    addNote: (customerId, noteText) => apiClient.post(`/customers/${customerId}/notes`, { noteText }),
    updateNote: (customerId, noteId, noteText) => apiClient.put(`/customers/${customerId}/notes/${noteId}`, { noteText }),
    deleteNote: (customerId, noteId) => apiClient.delete(`/customers/${customerId}/notes/${noteId}`),
};
export const productApi = {
    getAll: (page = 1, limit = 10, search, active) => apiClient.get('/products', { params: { page, limit, search, active } }),
    getById: (id) => apiClient.get(`/products/${id}`),
    create: (data) => apiClient.post('/products', data),
    update: (id, data) => apiClient.put(`/products/${id}`, data),
    delete: (id) => apiClient.delete(`/products/${id}`),
};
export const inventoryApi = {
    stockIn: (productId, quantity, reason) => apiClient.post('/inventory/stock-in', { productId, quantity, reason }),
    stockOut: (productId, quantity, reason) => apiClient.post('/inventory/stock-out', { productId, quantity, reason }),
    getMovements: (page = 1, limit = 10) => apiClient.get('/inventory/movements', { params: { page, limit } }),
    getProductMovements: (productId, page = 1, limit = 10) => apiClient.get(`/inventory/products/${productId}/movements`, { params: { page, limit } }),
};
export const challanApi = {
    getAll: (page = 1, limit = 10, status) => apiClient.get('/challans', { params: { page, limit, status } }),
    getById: (id) => apiClient.get(`/challans/${id}`),
    create: (data) => apiClient.post('/challans', data),
    update: (id, data) => apiClient.put(`/challans/${id}`, data),
    confirm: (id) => apiClient.post(`/challans/${id}/confirm`),
    cancel: (id) => apiClient.post(`/challans/${id}/cancel`),
};
export default apiClient;
//# sourceMappingURL=api.js.map