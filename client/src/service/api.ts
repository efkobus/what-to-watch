import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const movieService = {
  search: (query: string) => api.get(`/movies/search?query=${encodeURIComponent(query)}`),
  getDetails: (id: string) => api.get(`/movies/${id}`),
  getRecommendations: (id: string) => api.get(`/movies/${id}/recommendations`),
};

export const aiService = {
  enhanceDescription: (id: string) => api.get(`/ai/enhance/${id}`),
  generateRecommendations: (preferences: any) => api.post('/ai/recommendations', preferences),
};

export const authService = {
  login: (credentials: any) => api.post('/users/login', credentials),
  register: (userData: any) => api.post('/users/register', userData),
  getProfile: () => api.get('/users/profile'),
};

export default api;