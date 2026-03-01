import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api } from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      const userData = await SecureStore.getItemAsync(USER_KEY);
      
      if (token && userData) {
        setUser(JSON.parse(userData));
        // Set the token in API headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      // Mock API call - replace with actual API endpoint
      // const response = await api.post('/auth/login', { email, password });
      // const { token, user: userData } = response.data;

      // For demo purposes, creating a mock user
      const mockToken = 'mock_jwt_token_' + Date.now();
      const mockUser: User = {
        id: '1',
        name: 'Demo User',
        email: email,
      };

      await SecureStore.setItemAsync(TOKEN_KEY, mockToken);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(mockUser));

      api.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
      setUser(mockUser);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      // Mock API call - replace with actual API endpoint
      // const response = await api.post('/auth/signup', { name, email, password });
      // const { token, user: userData } = response.data;

      // For demo purposes, creating a mock user
      const mockToken = 'mock_jwt_token_' + Date.now();
      const mockUser: User = {
        id: '1',
        name: name,
        email: email,
      };

      await SecureStore.setItemAsync(TOKEN_KEY, mockToken);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(mockUser));

      api.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;
      setUser(mockUser);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_KEY);
      delete api.defaults.headers.common['Authorization'];
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}