import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// We'll use a simple check at runtime instead of dynamic imports
const isWeb = Platform.OS === 'web';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.eaiser.com';

// Helper to get storage (SecureStore for native, AsyncStorage for web)
const storage = {
  getItem: async (key: string): Promise<string | null> => {
    if (isWeb) {
      try {
        return await AsyncStorage.getItem(key);
      } catch {
        return null;
      }
    }
    try {
      const SecureStore = require('expo-secure-store');
      return await SecureStore.getItemAsync(key);
    } catch {
      // Fallback to AsyncStorage on error
      return AsyncStorage.getItem(key);
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (isWeb) {
      return AsyncStorage.setItem(key, value);
    }
    try {
      const SecureStore = require('expo-secure-store');
      await SecureStore.setItemAsync(key, value);
    } catch {
      // Fallback to AsyncStorage on error
      return AsyncStorage.setItem(key, value);
    }
  },
  deleteItem: async (key: string): Promise<void> => {
    if (isWeb) {
      return AsyncStorage.removeItem(key);
    }
    try {
      const SecureStore = require('expo-secure-store');
      await SecureStore.deleteItemAsync(key);
    } catch {
      // Fallback to AsyncStorage on error
      return AsyncStorage.removeItem(key);
    }
  },
};

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
      const token = await storage.getItem('auth_token');
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
      await storage.deleteItem('auth_token');
      await storage.deleteItem('user_data');
      
      // You can trigger a logout action here or redirect to login
      // This depends on your navigation setup
    }

    return Promise.reject(error);
  }
);

export { storage };

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