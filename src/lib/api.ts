import { getErrorMessage, parseFieldErrors } from './errorMessages';
import { getRuntimeConfig } from './runtime-config';

// API configuration will be loaded at runtime - no hardcoded URLs

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

// Add a nested response interface for login endpoint
export interface NestedApiResponse<T = any> {
  success: boolean;
  data?: {
    data: T;
    message?: string;
  };
  message?: string;
  errors?: Record<string, string[]>;
}

export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  organization_name: string;
  domain: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

class ApiClient {
  private baseURL: string = '';
  private configLoaded: boolean = false;

  constructor() {
    // No hardcoded URLs - everything comes from runtime config
  }

  private async ensureConfigLoaded(): Promise<void> {
    if (this.configLoaded) return;

    try {
      const config = await getRuntimeConfig();
      this.baseURL = config.apiUrls.base;
      this.configLoaded = true;
    } catch (error) {
      console.error('Failed to load runtime config:', error);
      throw new Error('Configuration not available. Please ensure environment variables are set.');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    await this.ensureConfigLoaded();
    const url = `${this.baseURL}${endpoint}`;

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Add auth token if available
    const token = this.getToken();
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      // Handle non-JSON responses
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', jsonError);
        return {
          success: false,
          message: response.ok ? 'Invalid response format' : `Server error (${response.status})`,
        };
      }

      if (!response.ok) {
        // Handle different error response formats
        let errorMessage = 'An error occurred';
        let errors: Record<string, string[]> | undefined;

        if (data.error) {
          // Handle Go service error format: {"error": "message"}
          errorMessage = data.error;
        } else if (data.message) {
          // Handle Django error format: {"message": "error"}
          errorMessage = data.message;
        } else if (data.detail) {
          // Handle DRF error format: {"detail": "error"}
          errorMessage = data.detail;
        } else if (typeof data === 'string') {
          // Handle plain string errors
          errorMessage = data;
        }

        // Handle field-specific errors
        if (data.errors) {
          errors = data.errors;
        }

        // Provide user-friendly messages for common HTTP status codes
        if (response.status === 400) {
          errorMessage = errorMessage || 'Please check your input and try again';
        } else if (response.status === 401) {
          errorMessage = 'Invalid credentials. Please check your email and password';
        } else if (response.status === 403) {
          errorMessage = 'You do not have permission to perform this action';
        } else if (response.status === 404) {
          errorMessage = 'The requested resource was not found';
        } else if (response.status === 409) {
          errorMessage = errorMessage || 'This resource already exists';
        } else if (response.status === 422) {
          errorMessage = errorMessage || 'Please check your input data';
        } else if (response.status >= 500) {
          errorMessage = 'Server error. Please try again later';
        }

        return {
          success: false,
          message: getErrorMessage(errorMessage),
          errors: errors ? parseFieldErrors(errors) : undefined,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('API request failed:', error);

      // Provide more specific network error messages
      if (error instanceof TypeError && error.message.includes('fetch')) {
        return {
          success: false,
          message: 'Unable to connect to the server. Please check your internet connection',
        };
      }

      return {
        success: false,
        message: 'Network error occurred. Please try again',
      };
    }
  }

  // Token management
  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('access_token');
    if (token === 'undefined' || token === 'null') {
      localStorage.removeItem('access_token');
      return null;
    }
    return token;
  }

  private setToken(token: string): void {
    if (typeof window === 'undefined') return;
    
    // Set localStorage first
    localStorage.setItem('access_token', token);
    
    // Set cookie for middleware - ensure it's available immediately with multiple formats
    document.cookie = `access_token=${token}; path=/; max-age=86400; SameSite=Lax`;
    // Also set without SameSite for broader compatibility
    document.cookie = `access_token=${token}; path=/; max-age=86400`;
    
    // If cookie wasn't set, try alternative approach
    const cookieSet = document.cookie.includes('access_token=');
    if (!cookieSet) {
      document.cookie = `access_token=${token}; path=/`;
    }
  }

  private removeToken(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    // Clear the cookie with multiple variations to ensure it's removed
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; domain=localhost; SameSite=Lax';
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }

  // Auth methods - all go through API Gateway
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    // Use type assertion since we know this endpoint returns nested data
    const response = await this.request<{data: AuthResponse; message?: string}>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data && response.data.data) {
      const authData = response.data.data;

      this.setToken(authData.access_token);
      localStorage.setItem('refresh_token', authData.refresh_token);
      localStorage.setItem('user', JSON.stringify(authData.user));
    }

    // Return the flattened structure for consistency
    return {
      success: response.success,
      data: response.data?.data,
      message: response.data?.message || response.message,
      errors: response.errors
    };
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    // Try both nested and flat response formats
    const response = await this.request<any>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data) {
      let authData: AuthResponse;
      
      // Handle nested response format (like login)
      if (response.data.data) {
        authData = response.data.data;
      } 
      // Handle flat response format
      else if (response.data.access_token) {
        authData = response.data;
      } else {
        console.error('Unexpected registration response format:', response.data);
        return {
          success: false,
          message: 'Invalid response format from server',
        };
      }

      this.setToken(authData.access_token);
      localStorage.setItem('refresh_token', authData.refresh_token);
      localStorage.setItem('user', JSON.stringify(authData.user));

      // Return flattened structure for consistency
      return {
        success: true,
        data: authData,
        message: response.data.message || response.message,
      };
    }

    return response;
  }

  async logout(): Promise<ApiResponse> {
    try {
      const response = await this.request('/auth/logout/', {
        method: 'POST',
      });

      // Always remove token regardless of API response
      this.removeToken();
      return response;
    } catch (error) {
      // Even if logout API fails, clear local tokens
      this.removeToken();
      console.error('Logout API error:', error);
      return {
        success: true, // Return success since we cleared local tokens
        message: 'Logged out successfully',
      };
    }
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse> {
    return this.request('/auth/forgot-password/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
    return this.request('/auth/reset-password/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async refreshToken(): Promise<ApiResponse<AuthResponse>> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return { success: false, message: 'No refresh token available' };
    }

    const response = await this.request<AuthResponse>('/auth/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (response.success && response.data) {
      this.setToken(response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }

    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me/');
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Get current user from localStorage
  getCurrentUserFromStorage(): User | null {
    if (typeof window === 'undefined') return null;
    const userStr = localStorage.getItem('user');

    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      return null;
    }

    try {
      return JSON.parse(userStr);
    } catch (error) {
      localStorage.removeItem('user');
      return null;
    }
  }
}

export const apiClient = new ApiClient();