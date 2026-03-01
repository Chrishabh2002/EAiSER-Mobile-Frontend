import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.eaiser.com';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error retrieving token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear stored auth data
      await SecureStore.deleteItemAsync('auth_token');
      await SecureStore.deleteItemAsync('user_data');
      
      // You can trigger a logout action here or redirect to login
      // This depends on your navigation setup
    }

    return Promise.reject(error);
  }
);

// API helper functions
export const apiService = {
  // Auth
  login: (email: string, password: string) => 
    api.post('/auth/login', { email, password }),
  
  signup: (name: string, email: string, password: string) => 
    api.post('/auth/signup', { name, email, password }),
  
  logout: () => 
    api.post('/auth/logout'),
  
  // Chat
  sendMessage: (message: string) => 
    api.post('/chat', { message }),
  
  getChatHistory: () => 
    api.get('/chat/history'),
  
  // User
  getProfile: () => 
    api.get('/user/profile'),
  
  updateProfile: (data: { name?: string; email?: string }) => 
    api.put('/user/profile', data),
};