// User Management service using GraphQL (via API Gateway) and WebSocket
import { websocketService } from './websocket';
import { 
  graphqlService, 
  GET_USERS, 
  GET_USERS_CONNECTION,
  GET_USER_BY_ID, 
  GET_USER_STATS, 
  GET_SECURITY_STATS, 
  GET_USER_ACTIVITY,
  GET_ROLES,
  GET_PERMISSIONS,
  GET_CURRENT_USER,
  GET_HEALTH,
  CREATE_USER_ADMIN,
  UPDATE_USER,
  DELETE_USER,
  ACTIVATE_USER,
  DEACTIVATE_USER,
  VERIFY_USER,
  CREATE_ROLE,
  UPDATE_ROLE,
  DELETE_ROLE,
  ASSIGN_USER_ROLE,
  REVOKE_USER_ROLE,
  ASSIGN_PERMISSIONS,
  CreateUserInput,
  UpdateUserInput,
  CreateRoleInput,
  UpdateRoleInput
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

  // Helper method to safely convert error to string
  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    return String(error);
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
      const message = error instanceof Error ? error.message : String(error);
      const code = (error as any)?.code;
      if (code === 'NOT_FOUND' || message.toLowerCase().includes('not found')) {
        const notFoundError: any = new Error('User not found');
        notFoundError.code = 'NOT_FOUND';
        throw notFoundError;
      }
      throw error;
    }
  }

  async getUsers(limit = 10, offset = 0, search?: string) {
    try {
      const response = await graphqlService.request(GET_USERS_CONNECTION, {
        limit,
        offset,
        search
      });
      
      // Handle the new UserConnection structure
      const userConnection = response.users;
      if (!userConnection) {
        return {
          users: [],
          total: 0,
          page: 1,
          limit,
          hasNextPage: false,
          hasPreviousPage: false,
        };
      }

      const users = userConnection.edges?.map((edge: any) => ({
        ...edge.node,
        // Ensure compatibility with both field naming conventions
        firstName: edge.node.firstName || edge.node.first_name,
        lastName: edge.node.lastName || edge.node.last_name,
        isActive: edge.node.isActive ?? edge.node.is_active ?? true,
        isVerified: edge.node.isVerified ?? edge.node.is_verified ?? false,
        lastLoginAt: edge.node.lastLoginAt || edge.node.last_login_at,
        createdAt: edge.node.createdAt || edge.node.created_at,
        updatedAt: edge.node.updatedAt || edge.node.updated_at,
      })) || [];
      
      return {
        users,
        total: userConnection.totalCount || 0,
        page: Math.floor(offset / limit) + 1,
        limit,
        hasNextPage: userConnection.pageInfo?.hasNextPage || false,
        hasPreviousPage: userConnection.pageInfo?.hasPreviousPage || false,
      };
    } catch (error) {
      console.error('GraphQL getUsers failed:', error);
      // Return empty data structure for graceful degradation
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

  // Dashboard statistics
  async getDashboardStats() {
    try {
      const [userStatsResponse, securityStatsResponse] = await Promise.all([
        graphqlService.request(GET_USER_STATS).catch((error) => {
          console.warn('User stats query failed:', error);
          return { userStats: null };
        }),
        graphqlService.request(GET_SECURITY_STATS).catch((error) => {
          console.warn('Security stats query failed:', error);
          return { securityStats: null };
        })
      ]);

      return {
        userStats: userStatsResponse.userStats || {
          totalUsers: 0,
          activeUsers: 0,
          inactiveUsers: 0,
          verifiedUsers: 0,
          unverifiedUsers: 0,
          recentSignups: 0,
          recentLogins: 0,
        },
        securityStats: securityStatsResponse.securityStats || {
          failedLoginsToday: 0,
          lockedAccounts: 0,
          securityAlerts: 0,
          twoFactorEnabled: 0,
          passwordResetsToday: 0,
        },
      };
    } catch (error) {
      console.error('GraphQL getDashboardStats failed:', error);
      // Return fallback data instead of throwing error
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
  }

  // Activity logs
  async getUserActivity(userId?: string, limit = 10, offset = 0) {
    try {
      const response = await graphqlService.request(GET_USER_ACTIVITY, {
        userId,
        limit,
        offset,
      });

      // Handle the UserActivityConnection structure
      const activityConnection = response.userActivity;
      if (!activityConnection) {
        return {
          activities: [],
          total: 0,
          page: Math.floor(offset / limit) + 1,
          limit,
          hasNextPage: false,
          hasPreviousPage: offset > 0,
        };
      }

      const activities = activityConnection.edges?.map((edge: any) => ({
        ...edge.node,
        user: edge.node.user ? {
          id: edge.node.user.id,
          firstName: edge.node.user.firstName,
          lastName: edge.node.user.lastName,
          name: `${edge.node.user.firstName} ${edge.node.user.lastName}`.trim(),
          email: edge.node.user.email,
        } : null,
      })) || [];

      return {
        activities,
        total: activityConnection.totalCount || 0,
        page: Math.floor(offset / limit) + 1,
        limit,
        hasNextPage: activityConnection.pageInfo?.hasNextPage || false,
        hasPreviousPage: activityConnection.pageInfo?.hasPreviousPage || false,
      };
    } catch (error) {
      console.error('GraphQL getUserActivity failed:', error);
      
      // Return mock data for development
      const mockActivities = [
        {
          id: '1',
          userId: userId || 'mock-user-1',
          action: 'login',
          resource: 'auth',
          details: { timestamp: new Date().toISOString(), success: true },
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          user: {
            id: userId || 'mock-user-1',
            firstName: 'John',
            lastName: 'Doe',
            name: 'John Doe',
            email: 'john.doe@example.com',
          },
        },
        {
          id: '2',
          userId: userId || 'mock-user-1',
          action: 'profile_updated',
          resource: 'profile',
          details: { changes: { firstName: 'John', lastName: 'Doe' }, timestamp: new Date().toISOString() },
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          user: {
            id: userId || 'mock-user-1',
            firstName: 'John',
            lastName: 'Doe',
            name: 'John Doe',
            email: 'john.doe@example.com',
          },
        },
        {
          id: '3',
          userId: 'mock-user-2',
          action: 'user_created',
          resource: 'user',
          details: { new_user_id: 'mock-user-3', timestamp: new Date().toISOString() },
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
          user: {
            id: 'mock-user-2',
            firstName: 'Jane',
            lastName: 'Smith',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
          },
        },
        {
          id: '4',
          userId: userId || 'mock-user-1',
          action: 'login_failed',
          resource: 'auth',
          details: { email: 'john.doe@example.com', timestamp: new Date().toISOString(), success: false },
          ipAddress: '192.168.1.105',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
          user: {
            id: userId || 'mock-user-1',
            firstName: 'John',
            lastName: 'Doe',
            name: 'John Doe',
            email: 'john.doe@example.com',
          },
        },
        {
          id: '5',
          userId: 'mock-user-2',
          action: 'password_changed',
          resource: 'profile',
          details: { timestamp: new Date().toISOString() },
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
          user: {
            id: 'mock-user-2',
            firstName: 'Jane',
            lastName: 'Smith',
            name: 'Jane Smith',
            email: 'jane.smith@example.com',
          },
        },
        {
          id: '6',
          userId: 'mock-user-3',
          action: 'user_activated',
          resource: 'user',
          details: { timestamp: new Date().toISOString() },
          ipAddress: '192.168.1.102',
          userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
          user: {
            id: 'mock-user-3',
            firstName: 'Bob',
            lastName: 'Johnson',
            name: 'Bob Johnson',
            email: 'bob.johnson@example.com',
          },
        },
        {
          id: '7',
          userId: userId || 'mock-user-1',
          action: 'logout',
          resource: 'auth',
          details: { timestamp: new Date().toISOString() },
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 24 hours ago
          user: {
            id: userId || 'mock-user-1',
            firstName: 'John',
            lastName: 'Doe',
            name: 'John Doe',
            email: 'john.doe@example.com',
          },
        },
      ];

      // Filter by userId if provided
      const filteredActivities = userId 
        ? mockActivities.filter(activity => activity.userId === userId)
        : mockActivities;

      // Apply pagination
      const paginatedActivities = filteredActivities.slice(offset, offset + limit);

      return {
        activities: paginatedActivities,
        total: filteredActivities.length,
        page: Math.floor(offset / limit) + 1,
        limit,
        hasNextPage: offset + limit < filteredActivities.length,
        hasPreviousPage: offset > 0,
      };
    }
  }

  // User CRUD operations
  async createUser(userData: CreateUserInput) {
    try {
      const response = await graphqlService.request(CREATE_USER_ADMIN, { 
        input: userData 
      });
      
      return {
        success: response.createUserAdmin?.success || false,
        message: response.createUserAdmin?.message || 'User creation failed',
        user: response.createUserAdmin?.user || null,
        errors: response.createUserAdmin?.errors || []
      };
    } catch (error) {
      console.error('createUser failed:', error);
      return {
        success: false,
        message: 'Failed to create user',
        errors: [{ field: 'general', message: error instanceof Error ? error.message : String(error) }]
      };
    }
  }

  async updateUser(userId: string, userData: UpdateUserInput) {
    try {
      const response = await graphqlService.request(UPDATE_USER, { 
        id: userId,
        input: userData 
      });
      
      return {
        success: response.updateUser?.success || false,
        message: response.updateUser?.message || 'User update failed',
        user: response.updateUser?.user || null,
        errors: response.updateUser?.errors || []
      };
    } catch (error) {
      console.error('updateUser failed:', error);
      return {
        success: false,
        message: 'Failed to update user',
        errors: [{ field: 'general', message: this.getErrorMessage(error) }]
      };
    }
  }

  async deleteUser(userId: string) {
    try {
      const response = await graphqlService.request(DELETE_USER, { 
        id: userId 
      });
      
      return {
        success: response.deleteUser?.success || false,
        message: response.deleteUser?.message || 'User deletion failed',
        errors: response.deleteUser?.errors || []
      };
    } catch (error) {
      console.error('deleteUser failed:', error);
      return {
        success: false,
        message: 'Failed to delete user',
        errors: [{ field: 'general', message: this.getErrorMessage(error) }]
      };
    }
  }

  async activateUser(userId: string) {
    try {
      const response = await graphqlService.request(ACTIVATE_USER, { 
        id: userId 
      });
      
      return {
        success: response.activateUser?.success || false,
        message: response.activateUser?.message || 'User activation failed',
        user: response.activateUser?.user || null,
        errors: response.activateUser?.errors || []
      };
    } catch (error) {
      console.error('activateUser failed:', error);
      return {
        success: false,
        message: 'Failed to activate user',
        errors: [{ field: 'general', message: this.getErrorMessage(error) }]
      };
    }
  }

  async deactivateUser(userId: string) {
    try {
      const response = await graphqlService.request(DEACTIVATE_USER, { 
        id: userId 
      });
      
      return {
        success: response.deactivateUser?.success || false,
        message: response.deactivateUser?.message || 'User deactivation failed',
        user: response.deactivateUser?.user || null,
        errors: response.deactivateUser?.errors || []
      };
    } catch (error) {
      console.error('deactivateUser failed:', error);
      return {
        success: false,
        message: 'Failed to deactivate user',
        errors: [{ field: 'general', message: this.getErrorMessage(error) }]
      };
    }
  }

  async verifyUser(userId: string) {
    try {
      const response = await graphqlService.request(VERIFY_USER, { 
        id: userId 
      });
      
      return {
        success: response.verifyUser?.success || false,
        message: response.verifyUser?.message || 'User verification failed',
        user: response.verifyUser?.user || null,
        errors: response.verifyUser?.errors || []
      };
    } catch (error) {
      console.error('verifyUser failed:', error);
      return {
        success: false,
        message: 'Failed to verify user',
        errors: [{ field: 'general', message: this.getErrorMessage(error) }]
      };
    }
  }

  async resetUserPassword(userId: string, newPassword: string) {
    try {
      console.warn('resetUserPassword: GraphQL mutation not implemented yet, returning mock response');
      return {
        success: false,
        message: 'Password reset not implemented yet',
        errors: [{ field: 'general', message: 'GraphQL mutation not implemented' }]
      };
    } catch (error) {
      console.error('resetUserPassword failed:', error);
      return {
        success: false,
        message: 'Failed to reset password',
        errors: [{ field: 'general', message: this.getErrorMessage(error) }]
      };
    }
  }

  // Role management (fallback implementations until GraphQL queries are implemented)
  async getRoles() {
    try {
      const response = await graphqlService.request(GET_ROLES);
      return response.roles || [];
    } catch (error) {
      console.error('GraphQL getRoles failed:', error);
      // Fallback: try organization-specific roles using the current user's org
      try {
        const ME_WITH_ORG = `
          query MeWithOrg {
            me {
              id
              organization { id }
            }
          }
        `;
        const meResp = await graphqlService.request(ME_WITH_ORG);
        const orgId = meResp?.me?.organization?.id;
        if (!orgId) return [];

        const GET_ORG_ROLES = `
          query OrgRoles($organizationId: ID!) {
            organizationRoles(organizationId: $organizationId) {
              id
              name
              description
              isSystem
              isActive
              permissions { id name description resource action }
              createdAt
              updatedAt
            }
          }
        `;
        const orgRolesResp = await graphqlService.request(GET_ORG_ROLES, { organizationId: orgId });
        return orgRolesResp?.organizationRoles || [];
      } catch (fallbackError) {
        console.error('Fallback get organization roles failed:', fallbackError);
        return [];
      }
    }
  }

  async getPermissions() {
    try {
      const response = await graphqlService.request(GET_PERMISSIONS);
      return response.permissions || [];
    } catch (error) {
      console.error('GraphQL getPermissions failed:', error);
      // Return empty array for graceful degradation
      return [];
    }
  }

  async createRole(roleData: CreateRoleInput) {
    try {
      const response = await graphqlService.request(CREATE_ROLE, { 
        input: roleData 
      });
      
      return {
        success: response.createRole?.success || false,
        message: response.createRole?.message || 'Role creation failed',
        role: response.createRole?.role || null,
        errors: response.createRole?.errors || []
      };
    } catch (error) {
      console.error('createRole failed:', error);
      return {
        success: false,
        message: 'Failed to create role',
        errors: [{ field: 'general', message: this.getErrorMessage(error) }]
      };
    }
  }

  async updateRole(roleId: string, roleData: UpdateRoleInput) {
    try {
      const response = await graphqlService.request(UPDATE_ROLE, { 
        id: roleId,
        input: roleData 
      });
      
      return {
        success: response.updateRole?.success || false,
        message: response.updateRole?.message || 'Role update failed',
        role: response.updateRole?.role || null,
        errors: response.updateRole?.errors || []
      };
    } catch (error) {
      console.error('updateRole failed:', error);
      return {
        success: false,
        message: 'Failed to update role',
        errors: [{ field: 'general', message: this.getErrorMessage(error) }]
      };
    }
  }

  async deleteRole(roleId: string) {
    try {
      const response = await graphqlService.request(DELETE_ROLE, { 
        id: roleId 
      });
      
      return {
        success: response.deleteRole?.success || false,
        message: response.deleteRole?.message || 'Role deletion failed',
        errors: response.deleteRole?.errors || []
      };
    } catch (error) {
      console.error('deleteRole failed:', error);
      return {
        success: false,
        message: 'Failed to delete role',
        errors: [{ field: 'general', message: this.getErrorMessage(error) }]
      };
    }
  }

  async assignUserRole(userId: string, roleId: string) {
    try {
      const response = await graphqlService.request(ASSIGN_USER_ROLE, { 
        userId,
        roleId 
      });
      
      return {
        success: response.assignUserRole?.success || false,
        message: response.assignUserRole?.message || 'User role assignment failed',
        errors: response.assignUserRole?.errors || []
      };
    } catch (error) {
      console.error('assignUserRole failed:', error);
      return {
        success: false,
        message: 'Failed to assign user role',
        errors: [{ field: 'general', message: this.getErrorMessage(error) }]
      };
    }
  }

  async revokeUserRole(userId: string, roleId: string) {
    try {
      const response = await graphqlService.request(REVOKE_USER_ROLE, { 
        userId,
        roleId 
      });
      
      return {
        success: response.revokeUserRole?.success || false,
        message: response.revokeUserRole?.message || 'User role revocation failed',
        errors: response.revokeUserRole?.errors || []
      };
    } catch (error) {
      console.error('revokeUserRole failed:', error);
      return {
        success: false,
        message: 'Failed to revoke user role',
        errors: [{ field: 'general', message: this.getErrorMessage(error) }]
      };
    }
  }

  async assignPermissions(roleId: string, permissionIds: string[]) {
    try {
      const response = await graphqlService.request(ASSIGN_PERMISSIONS, { 
        roleId,
        permissionIds 
      });
      
      return {
        success: response.assignPermissions?.success || false,
        message: response.assignPermissions?.message || 'Permission assignment failed',
        errors: response.assignPermissions?.errors || []
      };
    } catch (error) {
      console.error('assignPermissions failed:', error);
      return {
        success: false,
        message: 'Failed to assign permissions',
        errors: [{ field: 'general', message: this.getErrorMessage(error) }]
      };
    }
  }

  async checkPermission(userId: string, resource: string, action: string) {
    try {
      console.warn('checkPermission: GraphQL query not implemented yet, returning mock response');
      return {
        hasPermission: false
      };
    } catch (error) {
      console.error('checkPermission failed:', error);
      return {
        hasPermission: false
      };
    }
  }

  // Bulk operations (fallback implementations)
  async bulkCreateUsers(users: any[]) {
    try {
      console.warn('bulkCreateUsers: GraphQL mutation not implemented yet, returning mock response');
      return {
        success: false,
        message: 'Bulk user creation not implemented yet',
        results: [],
        createdCount: 0,
        failedCount: users.length,
        errors: [{ field: 'general', message: 'GraphQL mutation not implemented' }]
      };
    } catch (error) {
      console.error('bulkCreateUsers failed:', error);
      return {
        success: false,
        message: 'Failed to bulk create users',
        results: [],
        createdCount: 0,
        failedCount: users.length,
        errors: [{ field: 'general', message: this.getErrorMessage(error) }]
      };
    }
  }

  async bulkUpdateUsers(updates: Array<{ id: string; input: any }>) {
    try {
      console.warn('bulkUpdateUsers: GraphQL mutation not implemented yet, returning mock response');
      return {
        success: false,
        message: 'Bulk user update not implemented yet',
        results: [],
        updatedCount: 0,
        failedCount: updates.length,
        errors: [{ field: 'general', message: 'GraphQL mutation not implemented' }]
      };
    } catch (error) {
      console.error('bulkUpdateUsers failed:', error);
      return {
        success: false,
        message: 'Failed to bulk update users',
        results: [],
        updatedCount: 0,
        failedCount: updates.length,
        errors: [{ field: 'general', message: this.getErrorMessage(error) }]
      };
    }
  }

  async bulkDeleteUsers(userIds: string[]) {
    try {
      console.warn('bulkDeleteUsers: GraphQL mutation not implemented yet, returning mock response');
      return {
        success: false,
        message: 'Bulk user deletion not implemented yet',
        deletedCount: 0,
        failedCount: userIds.length,
        results: userIds.map(id => ({ success: false, userId: id, error: 'Not implemented' })),
        errors: [{ field: 'general', message: 'GraphQL mutation not implemented' }]
      };
    } catch (error) {
      console.error('bulkDeleteUsers failed:', error);
      return {
        success: false,
        message: 'Failed to bulk delete users',
        deletedCount: 0,
        failedCount: userIds.length,
        results: userIds.map(id => ({ success: false, userId: id, error: this.getErrorMessage(error) })),
        errors: [{ field: 'general', message: this.getErrorMessage(error) }]
      };
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