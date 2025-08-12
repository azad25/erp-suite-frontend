"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { User, LoginRequest, RegisterRequest } from '@/types/user';
import { useLoading } from '@/context/LoadingContext';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<{ success: boolean; message?: string; errors?: Record<string, string[]> }>;
  register: (userData: RegisterRequest) => Promise<{ success: boolean; message?: string; errors?: Record<string, string[]> }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();
  const { showLoading, hideLoading } = useLoading();

  const initAuth = () => {
    try {
      // Synchronous check for immediate response
      if (apiClient.isAuthenticated()) {
        const storedUser = apiClient.getCurrentUserFromStorage();
        if (storedUser) {
          // Use cached user data immediately - no async operations
          setUser(storedUser);
          setLoading(false);
          setInitialized(true);
          return; // Exit early with cached data
        }
      }

      // If no cached data, set as unauthenticated immediately
      setUser(null);
      setLoading(false);
      setInitialized(true);

    } catch (error) {
      // Auth initialization error - silently handle
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
      setUser(null);
      setLoading(false);
      setInitialized(true);
    }
  };

  useEffect(() => {
    if (!initialized) {
      initAuth();
    }
  }, []); // Removed `initialized` from dependency array

  const login = async (credentials: LoginRequest) => {
    try {
      showLoading('Signing in to dashboard...');
      const response = await apiClient.login(credentials);

      if (response.success && response.data) {
        setUser(response.data.user);

        // Verify tokens are set with a single check
        const hasToken = apiClient.isAuthenticated();
        const storedUser = apiClient.getCurrentUserFromStorage();
        const cookieExists = document.cookie.includes('access_token=');

        if (!hasToken || !storedUser || !cookieExists) {
          hideLoading();
          return {
            success: false,
            message: 'Authentication setup failed. Please try again.',
          };
        }

        // Use replace instead of push to avoid back button issues
        router.replace('/');

        return { success: true };
      } else {
        hideLoading();
        return {
          success: false,
          message: response.message,
          errors: response.errors,
        };
      }
    } catch (error) {
      // Login error - silently handle
      hideLoading();
      return {
        success: false,
        message: 'An unexpected error occurred',
      };
    }
  };

  const register = async (userData: RegisterRequest) => {
    try {
      showLoading('Creating account and signing in...');
      const response = await apiClient.register(userData);

      if (response.success && response.data) {
        setUser(response.data.user);

        // Verify tokens are set with a single check
        const hasToken = apiClient.isAuthenticated();
        const storedUser = apiClient.getCurrentUserFromStorage();
        const cookieExists = document.cookie.includes('access_token=');

        if (!hasToken || !storedUser || !cookieExists) {
          hideLoading();
          return {
            success: false,
            message: 'Authentication setup failed. Please try logging in manually.',
          };
        }

        // Use replace instead of push to avoid back button issues
        router.replace('/');

        return { success: true };
      } else {
        hideLoading();
        return {
          success: false,
          message: response.message,
          errors: response.errors,
        };
      }
    } catch (error) {
      // Registration error - silently handle
      hideLoading();
      return {
        success: false,
        message: 'An unexpected error occurred',
      };
    }
  };

  const logout = async () => {
    try {
      showLoading('Logging out...');
      await apiClient.logout();
    } catch (error) {
      // Logout error - silently handle
    } finally {
      setUser(null);
      hideLoading();

      // Use Next.js router for navigation
      router.push('/signin');
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await apiClient.forgotPassword({ email });
      return {
        success: response.success,
        message: response.message,
      };
    } catch (error) {
      // Forgot password error - silently handle
      return {
        success: false,
        message: 'An unexpected error occurred',
      };
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}