// User Management service using GraphQL (via API Gateway) and WebSocket
import { websocketService } from './websocket';
import { 
  graphqlService, 
  GET_USERS, 
  GET_USER_BY_ID, 
  GET_USER_STATS, 
  GET_SECURITY_STATS, 
  GET_USER_ACTIVITY,
  GET_ROLES,
  GET_PERMISSIONS,
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER,
  ACTIVATE_USER,
  DEACTIVATE_USER,
  VERIFY_USER,
  RESET_USER_PASSWORD,
  CREATE_ROLE,
  UPDATE_ROLE,
  DELETE_ROLE,
  ASSIGN_USER_ROLE,
  REVOKE_USER_ROLE,
  ASSIGN_PERMISSIONS,
  BULK_CREATE_USERS,
  BULK_UPDATE_USERS,
  BULK_DELETE_USERS,
  CHECK_PERMISSION,
  CreateUserInput,
  UpdateUserInput,
  CreateRoleInput,
  UpdateRoleInput,
  MutationResponse
} from './graphql';
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
    
    // Only setup WebSocket on client-side
    if (typeof window !== 'undefined' && this.config.useWebSocket) {
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
      const response = await graphqlService.request(GET_USER_BY_ID, { id: userId });
      return response.user;
    } catch (error) {
      console.error('GraphQL getUserById failed:', error);
      throw new Error(`Failed to fetch user with ID ${userId}: ${error}`);
    }
  }

  async getUsers(limit = 10, offset = 0, search?: string) {
    try {
      const response = await graphqlService.request(GET_USERS, {
        filter: { search },
        pagination: { first: limit, after: offset.toString() },
        sort: { field: 'createdAt', direction: 'DESC' }
      });
      
      return {
        users: response.users?.edges?.map((edge: any) => edge.node) || [],
        total: response.users?.totalCount || 0,
        page: Math.floor(offset / limit) + 1,
        limit,
        hasNextPage: response.users?.pageInfo?.hasNextPage || false,
        hasPreviousPage: response.users?.pageInfo?.hasPreviousPage || false,
      };
    } catch (error) {
      console.error('GraphQL getUsers failed:', error);
      throw new Error(`Failed to fetch users: ${error}`);
    }
  }

  // Dashboard statistics
  async getDashboardStats() {
    try {
      const [userStatsResponse, securityStatsResponse] = await Promise.all([
        graphqlService.request(GET_USER_STATS),
        graphqlService.request(GET_SECURITY_STATS)
      ]);

      return {
        userStats: userStatsResponse.userStats,
        securityStats: securityStatsResponse.securityStats,
      };
    } catch (error) {
      console.error('GraphQL getDashboardStats failed:', error);
      throw new Error(`Failed to fetch dashboard statistics: ${error}`);
    }
  }

  // Activity logs
  async getUserActivity(userId?: string, limit = 10, offset = 0) {
    try {
      const response = await graphqlService.request(GET_USER_ACTIVITY, {
        userId,
        limit,
        offset,
      });

      return {
        activities: response.userActivity || [],
        total: response.userActivity?.length || 0,
        page: Math.floor(offset / limit) + 1,
        limit,
        hasNextPage: false,
        hasPreviousPage: offset > 0,
      };
    } catch (error) {
      console.error('GraphQL getUserActivity failed:', error);
      throw new Error(`Failed to fetch user activity: ${error}`);
    }
  }

  // User CRUD operations
  async createUser(userData: CreateUserInput) {
    try {
      const response = await graphqlService.request(CREATE_USER, { input: userData });
      return response.createUser;
    } catch (error) {
      console.error('GraphQL createUser failed:', error);
      throw new Error(`Failed to create user: ${error}`);
    }
  }

  async updateUser(userId: string, userData: UpdateUserInput) {
    try {
      const response = await graphqlService.request(UPDATE_USER, { 
        id: userId, 
        input: userData 
      });
      return response.updateUser;
    } catch (error) {
      console.error('GraphQL updateUser failed:', error);
      throw new Error(`Failed to update user: ${error}`);
    }
  }

  async deleteUser(userId: string) {
    try {
      const response = await graphqlService.request(DELETE_USER, { id: userId });
      return response.deleteUser;
    } catch (error) {
      console.error('GraphQL deleteUser failed:', error);
      throw new Error(`Failed to delete user: ${error}`);
    }
  }

  async activateUser(userId: string) {
    try {
      const response = await graphqlService.request(ACTIVATE_USER, { id: userId });
      return response.activateUser;
    } catch (error) {
      console.error('GraphQL activateUser failed:', error);
      throw new Error(`Failed to activate user: ${error}`);
    }
  }

  async deactivateUser(userId: string) {
    try {
      const response = await graphqlService.request(DEACTIVATE_USER, { id: userId });
      return response.deactivateUser;
    } catch (error) {
      console.error('GraphQL deactivateUser failed:', error);
      throw new Error(`Failed to deactivate user: ${error}`);
    }
  }

  async verifyUser(userId: string) {
    try {
      const response = await graphqlService.request(VERIFY_USER, { id: userId });
      return response.verifyUser;
    } catch (error) {
      console.error('GraphQL verifyUser failed:', error);
      throw new Error(`Failed to verify user: ${error}`);
    }
  }

  async resetUserPassword(userId: string, newPassword: string) {
    try {
      const response = await graphqlService.request(RESET_USER_PASSWORD, { 
        id: userId, 
        newPassword 
      });
      return response.resetUserPassword;
    } catch (error) {
      console.error('GraphQL resetUserPassword failed:', error);
      throw new Error(`Failed to reset user password: ${error}`);
    }
  }

  // Role management
  async getRoles() {
    try {
      const response = await graphqlService.request(GET_ROLES);
      return response.roles || [];
    } catch (error) {
      console.error('GraphQL getRoles failed:', error);
      throw new Error(`Failed to fetch roles: ${error}`);
    }
  }

  async getPermissions() {
    try {
      const response = await graphqlService.request(GET_PERMISSIONS);
      return response.permissions || [];
    } catch (error) {
      console.error('GraphQL getPermissions failed:', error);
      throw new Error(`Failed to fetch permissions: ${error}`);
    }
  }

  async createRole(roleData: CreateRoleInput) {
    try {
      const response = await graphqlService.request(CREATE_ROLE, { input: roleData });
      return response.createRole;
    } catch (error) {
      console.error('GraphQL createRole failed:', error);
      throw new Error(`Failed to create role: ${error}`);
    }
  }

  async updateRole(roleId: string, roleData: UpdateRoleInput) {
    try {
      const response = await graphqlService.request(UPDATE_ROLE, { 
        id: roleId, 
        input: roleData 
      });
      return response.updateRole;
    } catch (error) {
      console.error('GraphQL updateRole failed:', error);
      throw new Error(`Failed to update role: ${error}`);
    }
  }

  async deleteRole(roleId: string) {
    try {
      const response = await graphqlService.request(DELETE_ROLE, { id: roleId });
      return response.deleteRole;
    } catch (error) {
      console.error('GraphQL deleteRole failed:', error);
      throw new Error(`Failed to delete role: ${error}`);
    }
  }

  async assignUserRole(userId: string, roleId: string) {
    try {
      const response = await graphqlService.request(ASSIGN_USER_ROLE, { 
        userId, 
        roleId 
      });
      return response.assignUserRole;
    } catch (error) {
      console.error('GraphQL assignUserRole failed:', error);
      throw new Error(`Failed to assign user role: ${error}`);
    }
  }

  async revokeUserRole(userId: string, roleId: string) {
    try {
      const response = await graphqlService.request(REVOKE_USER_ROLE, { 
        userId, 
        roleId 
      });
      return response.revokeUserRole;
    } catch (error) {
      console.error('GraphQL revokeUserRole failed:', error);
      throw new Error(`Failed to revoke user role: ${error}`);
    }
  }

  async assignPermissions(roleId: string, permissionIds: string[]) {
    try {
      const response = await graphqlService.request(ASSIGN_PERMISSIONS, { 
        roleId, 
        permissionIds 
      });
      return response.assignPermissions;
    } catch (error) {
      console.error('GraphQL assignPermissions failed:', error);
      throw new Error(`Failed to assign permissions: ${error}`);
    }
  }

  async checkPermission(userId: string, resource: string, action: string) {
    try {
      const response = await graphqlService.request(CHECK_PERMISSION, { 
        userId, 
        resource, 
        action 
      });
      return response.checkPermission;
    } catch (error) {
      console.error('GraphQL checkPermission failed:', error);
      throw new Error(`Failed to check permission: ${error}`);
    }
  }

  // Bulk operations
  async bulkCreateUsers(users: CreateUserInput[]) {
    try {
      const response = await graphqlService.request(BULK_CREATE_USERS, { 
        input: { users } 
      });
      return response.bulkCreateUsers;
    } catch (error) {
      console.error('GraphQL bulkCreateUsers failed:', error);
      throw new Error(`Failed to bulk create users: ${error}`);
    }
  }

  async bulkUpdateUsers(updates: Array<{ id: string; input: UpdateUserInput }>) {
    try {
      const response = await graphqlService.request(BULK_UPDATE_USERS, { 
        input: { updates } 
      });
      return response.bulkUpdateUsers;
    } catch (error) {
      console.error('GraphQL bulkUpdateUsers failed:', error);
      throw new Error(`Failed to bulk update users: ${error}`);
    }
  }

  async bulkDeleteUsers(userIds: string[]) {
    try {
      const response = await graphqlService.request(BULK_DELETE_USERS, { userIds });
      return response.bulkDeleteUsers;
    } catch (error) {
      console.error('GraphQL bulkDeleteUsers failed:', error);
      throw new Error(`Failed to bulk delete users: ${error}`);
    }
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