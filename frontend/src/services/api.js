import axios from 'axios';

// Produção (build): URL relativa - nginx faz proxy de /api para o backend (mesma origem)
// Desenvolvimento (npm start): hostname:8080
const getApiBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  if (process.env.NODE_ENV === 'production') return '';
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:8080`;
  }
  return 'http://localhost:8080';
};
const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor: extract backend error message for better UX
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const backendMessage =
      error.response?.data?.details ||
      error.response?.data?.message ||
      (typeof error.response?.data === 'string' ? error.response.data : null);
    const fallbackMessage =
      error.response?.status === 404
        ? 'Resource not found'
        : error.response?.status === 409
        ? 'A resource with this code already exists.'
        : error.response?.status >= 500
        ? 'Server error. Please try again later.'
        : error.message || 'An error occurred';
    error.userMessage = backendMessage || fallbackMessage;
    return Promise.reject(error);
  }
);

// Products API
export const productsApi = {
  getAll: () => api.get('/api/products'),
  getById: (id) => api.get(`/api/products/${id}`),
  create: (data) => api.post('/api/products', data),
  update: (id, data) => api.put(`/api/products/${id}`, data),
  delete: (id) => api.delete(`/api/products/${id}`),
};

// Raw Materials API
export const rawMaterialsApi = {
  getAll: () => api.get('/api/raw-materials'),
  getById: (id) => api.get(`/api/raw-materials/${id}`),
  create: (data) => api.post('/api/raw-materials', data),
  update: (id, data) => api.put(`/api/raw-materials/${id}`, data),
  delete: (id) => api.delete(`/api/raw-materials/${id}`),
};

// Product-RawMaterial Associations API
export const productRawMaterialsApi = {
  getAll: () => api.get('/api/product-raw-materials'),
  getById: (id) => api.get(`/api/product-raw-materials/${id}`),
  getByProductId: (productId) => api.get(`/api/product-raw-materials/product/${productId}`),
  getByRawMaterialId: (rawMaterialId) => api.get(`/api/product-raw-materials/raw-material/${rawMaterialId}`),
  create: (data) => api.post('/api/product-raw-materials', data),
  update: (id, data) => api.put(`/api/product-raw-materials/${id}`, data),
  delete: (id) => api.delete(`/api/product-raw-materials/${id}`),
};

// Production API
export const productionApi = {
  calculate: () => api.get('/api/production/calculate'),
};

export default api;
