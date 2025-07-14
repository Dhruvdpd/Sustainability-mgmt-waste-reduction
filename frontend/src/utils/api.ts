import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('Response error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Product API functions
export const productAPI = {
  // Get all products
  getAll: () => api.get('/products'),
  
  // Get single product
  getById: (id: string) => api.get(`/products/${id}`),
  
  // Create new product
  create: (productData: any) => api.post('/products', productData),
  
  // Update product
  update: (id: string, productData: any) => api.put(`/products/${id}`, productData),
  
  // Delete product
  delete: (id: string) => api.delete(`/products/${id}`),
  
  // Export products to Excel
  export: () => api.get('/products/export', { responseType: 'blob' })
};

// Tips API functions
export const tipAPI = {
  // Get all tips
  getAll: (params?: { category?: string; approved?: boolean }) => 
    api.get('/tips', { params }),
  
  // Get single tip
  getById: (id: string) => api.get(`/tips/${id}`),
  
  // Create new tip
  create: (tipData: any) => api.post('/tips', tipData),
  
  // Update tip
  update: (id: string, tipData: any) => api.put(`/tips/${id}`, tipData),
  
  // Delete tip
  delete: (id: string) => api.delete(`/tips/${id}`),
  
  // Like tip
  like: (id: string) => api.put(`/tips/${id}/like`),
  
  // Search tips
  search: (query: string) => api.get(`/tips/search?query=${encodeURIComponent(query)}`)
};

// Health check
export const healthCheck = () => api.get('/health');

export default api;