// User Management service using GraphQL (via API Gateway) and WebSocket
import { websocketService } from './websocket';
import { graphqlService, GET_USERS, GET_USER_BY_ID } from './graphql';
import { apiClient } from '@/lib/api';
import { User } from '@/types/user';

export interface UserManagementConfig {
  useWebSocket: boolean;
  enableRealTimeUpdates: boolean;
}

class UserManagementService {
  private config: UserManagementConfig = {
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

  // Authentication methods - delegate to existing API client
  async login(email: string, password: string, rememberMe = false) {
    return await apiClient.login({ email, password, remember_me: rememberMe });
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    organizationName: string;
    domain: string;
  }) {
    return await apiClient.register({
      first_name: userData.firstName,
      last_name: userData.lastName,
      email: userData.email,
      password: userData.password,
      password_confirmation: userData.password,
      organization_name: userData.organizationName,
      domain: userData.domain,
    });
  }

  async logout() {
    return await apiClient.logout();
  }

  async refreshToken() {
    return await apiClient.refreshToken();
  }

  // User data methods using existing API client
  async getCurrentUser() {
    return await apiClient.getCurrentUser();
  }

  async getUserById(userId: string) {
    try {
      // For now, use GraphQL for user data if available
      const response = await graphqlService.request(GET_USER_BY_ID, { id: userId });
      return response.user;
    } catch (error) {
      console.error('GraphQL getUserById failed:', error);
      // Fallback to mock data for development
      return {
        id: userId,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        isActive: true,
        isVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  }

  async getUsers(limit = 10, offset = 0, search?: string) {
    try {
      // For now, use GraphQL for user data if available
      const response = await graphqlService.request(GET_USERS, {
        limit,
        offset,
        search,
      });
      
      return {
        users: response.users?.nodes || [],
        total: response.users?.totalCount || 0,
        page: Math.floor(offset / limit) + 1,
        limit,
        hasNextPage: response.users?.pageInfo?.hasNextPage || false,
        hasPreviousPage: response.users?.pageInfo?.hasPreviousPage || false,
      };
    } catch (error) {
      console.error('GraphQL getUsers failed:', error);
      // Fallback to mock data for development
      return {
        users: [],
        total: 0,
        page: 1,
        limit,
        hasNextPage: false,
        hasPreviousPage: false,
      };
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
    return apiClient.getCurrentUserFromStorage();
  }

  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }
}

export const userManagementService = new UserManagementService();