// API service for connecting to the ERP API Gateway
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { apiClient as unifiedApiClient } from '@/lib/api';

// API Configuration - Connect to API Gateway, not directly to auth service
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost';
const API_GATEWAY_URL = `${API_BASE_URL}/api/v1`;

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_GATEWAY_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_GATEWAY_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });
          
          const { access_token, refresh_token: newRefreshToken } = response.data;
          // Use unified client to ensure cookie is also updated for middleware
          unifiedApiClient.setAccessToken(access_token);
          localStorage.setItem('refresh_token', newRefreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens (cookie + localStorage) and bubble up
        unifiedApiClient.clearAuth();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;