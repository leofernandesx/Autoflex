import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
