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

/**
 * Get AI-enhanced movie description
 * @param movieId The ID of the movie
 * @returns Promise with the AI-enhanced description
 */
export const enhanceMovieDescription = async (movieId: string) => {
  return api.get(`/ai/enhance/${movieId}`);
};

/**
 * Generate AI recommendations based on user preferences
 * @param preferences User preferences object
 * @returns Promise with recommended movies/shows
 */
export const generateRecommendations = async (preferences: any) => {
  return api.post('/ai/recommendations', preferences);
};
