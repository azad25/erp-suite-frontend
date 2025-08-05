// User Management service using REST API (via API Gateway) and WebSocket
import { websocketService } from './websocket';
import { authService, User } from './auth';
import apiClient from './api';

export interface UserManagementConfig {
  useWebSocket: boolean;
  enableRealTimeUpdates: boolean;
}

class UserManagementService {
  private config: UserManagementConfig = {
    useGraphQL: true,
    useWebSocket: true,
    enableRealTimeUpdates: true,
  };

  constructor(config?: Partial<UserManagementConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
    
    if (this.config.useWebSocket) {
      this.setupWebSocketSubscriptions();
    }
  }

  private setupWebSocketSubscriptions(): void {
    websocketService.subscribeToUserManagement();
    websocketService.subscribeToUserActivity();
    websocketService.subscribeToSecurityAlerts();
  }

  // Authentication methods using GraphQL
  async login(email: string, password: string, rememberMe = false) {
    try {
      const response = await graphqlService.request(LOGIN_MUTATION, {
        input: { email, password, rememberMe }
      });
      
      const authData = response.Authenticate;
      
      // Store tokens in localStorage
      localStorage.setItem('access_token', authData.accessToken);
      localStorage.setItem('refresh_token', authData.refreshToken);
      localStorage.setItem('user', JSON.stringify(authData.user));
      
      return authData;
    } catch (error) {
      console.error('GraphQL login failed:', error);
      throw error;
    }
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    try {
      const response = await graphqlService.request(REGISTER_MUTATION, {
        input: userData
      });
      
      const authData = response.CreateUser;
      
      // Store user data (CreateUser might not return tokens)
      if (authData.accessToken) {
        localStorage.setItem('access_token', authData.accessToken);
        localStorage.setItem('refresh_token', authData.refreshToken);
      }
      localStorage.setItem('user', JSON.stringify(authData.user));
      
      return authData;
    } catch (error) {
      console.error('GraphQL registration failed:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await graphqlService.request(LOGOUT_MUTATION);
    } catch (error) {
      console.error('GraphQL logout failed:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user');
    }
  }

  async refreshToken() {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await graphqlService.request(REFRESH_TOKEN_MUTATION, {
        refreshToken
      });
      
      const authData = response.RefreshToken;
      localStorage.setItem('access_token', authData.accessToken);
      localStorage.setItem('refresh_token', authData.refreshToken);
      
      return authData;
    } catch (error) {
      console.error('GraphQL token refresh failed:', error);
      throw error;
    }
  }

  // User data methods using GraphQL
  async getCurrentUser() {
    try {
      const response = await graphqlService.request(GET_ME);
      return response.me;
    } catch (error) {
      console.error('GraphQL getCurrentUser failed:', error);
      throw error;
    }
  }

  async getUserById(userId: string) {
    try {
      const response = await graphqlService.request(GET_USER_BY_ID, { id: userId });
      return response.user;
    } catch (error) {
      console.error('GraphQL getUserById failed:', error);
      throw error;
    }
  }

  async getUsers(limit = 10, offset = 0, search?: string) {
    try {
      const response = await graphqlService.request(GET_USERS, {
        limit,
        offset,
        search,
      });
      
      return {
        users: response.users || [],
        total: response.users?.length || 0,
        page: Math.floor(offset / limit) + 1,
        limit,
        hasNextPage: response.users?.length === limit,
        hasPreviousPage: offset > 0,
      };
    } catch (error) {
      console.error('GraphQL getUsers failed:', error);
      throw error;
    }
  }

  // Dashboard statistics - These would need to be added to the GraphQL schema
  async getDashboardStats() {
    // For now, return mock data since these queries aren't implemented in the GraphQL schema yet
    // TODO: Add these queries to the API Gateway GraphQL schema
    return {
      userStats: {
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        verifiedUsers: 0,
        unverifiedUsers: 0,
        recentSignups: 0,
        recentLogins: 0,
      },
      securityStats: {
        failedLoginsToday: 0,
        lockedAccounts: 0,
        securityAlerts: 0,
        twoFactorEnabled: 0,
        passwordResetsToday: 0,
      },
    };
  }

  // Activity logs - Would need to be added to the GraphQL schema
  async getUserActivity(userId?: string, limit = 10, offset = 0) {
    // For now, return mock data since this query isn't implemented in the GraphQL schema yet
    // TODO: Add this query to the API Gateway GraphQL schema
    return {
      activities: [],
      total: 0,
      page: Math.floor(offset / limit) + 1,
      limit,
      hasNextPage: false,
      hasPreviousPage: offset > 0,
    };
  }

  // Utility methods
  getCurrentUserFromStorage(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }
}

export const userManagementService = new UserManagementService();