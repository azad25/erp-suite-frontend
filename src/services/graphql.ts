// GraphQL service for ERP system integration via API Gateway
import { apiClient } from '@/lib/api';

// API Response Types
interface ApiUserStatsResponse {
  total_users?: number;
  active_users?: number;
  inactive_users?: number;
  verified_users?: number;
  unverified_users?: number;
  recent_signups?: number;
  recent_logins?: number;
}

interface ApiSecurityStatsResponse {
  failed_logins_today?: number;
  locked_accounts?: number;
  security_alerts?: number;
  two_factor_enabled?: number;
  password_resets_today?: number;
}

interface ApiUserActivityResponse {
  activities?: Array<{
    id: string;
    user_id: string;
    action: string;
    resource: string;
    details: Record<string, any>;
    ip_address: string;
    user_agent: string;
    created_at: string;
    user?: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
    };
  }>;
}

interface ApiRolesResponse {
  roles?: Array<{
    id: string;
    organization_id: string;
    name: string;
    description: string;
    is_system: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  }>;
}

interface ApiPermissionsResponse {
  permissions?: Array<{
    id: string;
    name: string;
    resource: string;
    action: string;
    scope: string;
    description: string;
    is_system: boolean;
    created_at: string;
    updated_at: string;
  }>;
}

interface ApiUserResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_verified: boolean;
  two_factor_enabled?: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
  organization?: {
    id: string;
    name: string;
    domain: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
}

// Simple GraphQL client that uses the API Gateway
class GraphQLService {
  constructor() {
    // No need to store baseUrl since apiClient handles configuration
  }

  // Execute GraphQL query via API Gateway REST endpoints
  async request<T = any>(query: string, variables?: any): Promise<T> {
    try {
      // Parse the query to determine the operation
      const operationType = this.getOperationType(query);
      const operationName = this.getOperationName(query);

      // Map GraphQL queries to REST API endpoints
      return await this.mapToRestEndpoint(operationType, operationName, variables);
    } catch (error: any) {
      console.error('GraphQL request failed:', error);
      throw error;
    }
  }

  private getOperationType(query: string): 'query' | 'mutation' {
    if (query.trim().startsWith('mutation')) {
      return 'mutation';
    }
    return 'query';
  }

  private getOperationName(query: string): string {
    const match = query.match(/(?:query|mutation)\s+(\w+)/);
    return match ? match[1] : 'Unknown';
  }

  private async mapToRestEndpoint(_operationType: string, operationName: string, variables?: any): Promise<any> {
    switch (operationName) {
      case 'GetUsers':
        return this.getUsers(variables);
      case 'GetUserById':
        return this.getUserById(variables);
      case 'GetUserStats':
        return this.getUserStats();
      case 'GetSecurityStats':
        return this.getSecurityStats();
      case 'GetUserActivity':
        return this.getUserActivity(variables);
      case 'GetRoles':
        return this.getRoles();
      case 'GetPermissions':
        return this.getPermissions();
      case 'CreateUser':
        return this.createUser(variables);
      case 'UpdateUser':
        return this.updateUser(variables);
      case 'DeleteUser':
        return this.deleteUser(variables);
      case 'ActivateUser':
        return this.activateUser(variables);
      case 'DeactivateUser':
        return this.deactivateUser(variables);
      case 'VerifyUser':
        return this.verifyUser(variables);
      default:
        throw new Error(`Unsupported GraphQL operation: ${operationName}`);
    }
  }

  private async getUsers(variables?: any) {
    try {
      const params = new URLSearchParams();
      if (variables?.filter?.search) params.append('search', variables.filter.search);
      if (variables?.pagination?.first) params.append('limit', variables.pagination.first.toString());
      if (variables?.pagination?.after) params.append('offset', variables.pagination.after.toString());

      const response = await apiClient.makeRequest<{
        users: any[];
        total: number;
        has_next_page: boolean;
      }>(`/api/v1/users?${params}`);

      if (!response.success) {
        console.error('API request failed:', response.message);
        // Return empty result structure for graceful degradation
        return {
          users: {
            edges: [],
            totalCount: 0,
            pageInfo: {
              hasNextPage: false,
              hasPreviousPage: false,
              startCursor: null,
              endCursor: null
            }
          }
        };
      }

      const responseData = response.data || { users: [], total: 0, has_next_page: false };

      return {
        users: {
          edges: (responseData.users || []).map((user: any, index: number) => ({
            node: {
              ...user,
              firstName: user.first_name,
              lastName: user.last_name,
              isActive: user.is_active,
              isVerified: user.is_verified,
              twoFactorEnabled: user.two_factor_enabled,
              lastLoginAt: user.last_login_at,
              createdAt: user.created_at,
              updatedAt: user.updated_at,
              name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email
            },
            cursor: (variables?.pagination?.after || 0) + index + 1
          })),
          totalCount: responseData.total || 0,
          pageInfo: {
            hasNextPage: responseData.has_next_page || false,
            hasPreviousPage: (variables?.pagination?.after || 0) > 0,
            startCursor: responseData.users?.length > 0 ? '1' : null,
            endCursor: responseData.users?.length > 0 ? responseData.users.length.toString() : null
          }
        }
      };
    } catch (error) {
      console.error('Error in getUsers:', error);
      // Return empty result structure for graceful degradation
      return {
        users: {
          edges: [],
          totalCount: 0,
          pageInfo: {
            hasNextPage: false,
            hasPreviousPage: false,
            startCursor: null,
            endCursor: null
          }
        }
      };
    }
  }

  private async getUserById(variables: any) {
    try {
      const response = await apiClient.makeRequest<ApiUserResponse>(`/api/v1/users/${variables.id}`);
      
      if (!response.success) {
        console.error('Failed to fetch user:', response.message);
        return { user: null };
      }

      const user = response.data;

      return {
        user: user ? {
          ...user,
          firstName: user.first_name,
          lastName: user.last_name,
          isActive: user.is_active,
          isVerified: user.is_verified,
          twoFactorEnabled: user.two_factor_enabled,
          lastLoginAt: user.last_login_at,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
          name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email
        } : null
      };
    } catch (error) {
      console.error('Error in getUserById:', error);
      return { user: null };
    }
  }

  private async getUserStats() {
    try {
      const response = await apiClient.makeRequest<ApiUserStatsResponse>('/api/v1/users/stats');

      if (!response.success) {
        console.warn('User stats endpoint not available:', response.message);
        // Return default stats if endpoint doesn't exist or fails
        return {
          userStats: {
            totalUsers: 0,
            activeUsers: 0,
            inactiveUsers: 0,
            verifiedUsers: 0,
            unverifiedUsers: 0,
            recentSignups: 0,
            recentLogins: 0
          }
        };
      }

      const responseData = response.data || {};

      return {
        userStats: {
          totalUsers: responseData.total_users || 0,
          activeUsers: responseData.active_users || 0,
          inactiveUsers: responseData.inactive_users || 0,
          verifiedUsers: responseData.verified_users || 0,
          unverifiedUsers: responseData.unverified_users || 0,
          recentSignups: responseData.recent_signups || 0,
          recentLogins: responseData.recent_logins || 0
        }
      };
    } catch (error) {
      console.warn('Error fetching user stats:', error);
      // Return default stats if endpoint doesn't exist
      return {
        userStats: {
          totalUsers: 0,
          activeUsers: 0,
          inactiveUsers: 0,
          verifiedUsers: 0,
          unverifiedUsers: 0,
          recentSignups: 0,
          recentLogins: 0
        }
      };
    }
  }

  private async getSecurityStats() {
    try {
      const response = await apiClient.makeRequest<ApiSecurityStatsResponse>('/api/v1/users/security-stats');
      
      if (!response.success) {
        console.warn('Security stats endpoint not available:', response.message);
        return {
          securityStats: {
            failedLoginsToday: 0,
            lockedAccounts: 0,
            securityAlerts: 0,
            twoFactorEnabled: 0,
            passwordResetsToday: 0
          }
        };
      }

      const data = response.data || {};
      return {
        securityStats: {
          failedLoginsToday: data.failed_logins_today || 0,
          lockedAccounts: data.locked_accounts || 0,
          securityAlerts: data.security_alerts || 0,
          twoFactorEnabled: data.two_factor_enabled || 0,
          passwordResetsToday: data.password_resets_today || 0
        }
      };
    } catch (error) {
      console.warn('Error fetching security stats:', error);
      return {
        securityStats: {
          failedLoginsToday: 0,
          lockedAccounts: 0,
          securityAlerts: 0,
          twoFactorEnabled: 0,
          passwordResetsToday: 0
        }
      };
    }
  }

  private async getUserActivity(variables?: any) {
    const params = new URLSearchParams();
    if (variables?.userId) params.append('user_id', variables.userId);
    if (variables?.limit) params.append('limit', variables.limit.toString());
    if (variables?.offset) params.append('offset', variables.offset.toString());

    try {
      const response = await apiClient.makeRequest<ApiUserActivityResponse>(`/api/v1/users/activity?${params}`);
      
      if (!response.success) {
        console.warn('User activity endpoint not available:', response.message);
        return { userActivity: [] };
      }

      const data = response.data || {};
      return {
        userActivity: (data.activities || []).map((activity) => ({
          ...activity,
          userId: activity.user_id,
          ipAddress: activity.ip_address,
          userAgent: activity.user_agent,
          createdAt: activity.created_at,
          user: activity.user ? {
            ...activity.user,
            firstName: activity.user.first_name,
            lastName: activity.user.last_name,
            name: `${activity.user.first_name || ''} ${activity.user.last_name || ''}`.trim() || activity.user.email
          } : null
        }))
      };
    } catch (error) {
      console.warn('Error fetching user activity:', error);
      return { userActivity: [] };
    }
  }

  private async getRoles() {
    try {
      const response = await apiClient.makeRequest<ApiRolesResponse>('/api/v1/roles');
      
      if (!response.success) {
        console.warn('Roles endpoint not available:', response.message);
        return { roles: [] };
      }

      const data = response.data || {};
      return {
        roles: (data.roles || []).map((role) => ({
          ...role,
          organizationId: role.organization_id,
          isSystem: role.is_system,
          isActive: role.is_active,
          createdAt: role.created_at,
          updatedAt: role.updated_at
        }))
      };
    } catch (error) {
      console.warn('Error fetching roles:', error);
      return { roles: [] };
    }
  }

  private async getPermissions() {
    try {
      const response = await apiClient.makeRequest<ApiPermissionsResponse>('/api/v1/permissions');
      
      if (!response.success) {
        console.warn('Permissions endpoint not available:', response.message);
        return { permissions: [] };
      }

      const data = response.data || {};
      return {
        permissions: (data.permissions || []).map((permission) => ({
          ...permission,
          isSystem: permission.is_system,
          createdAt: permission.created_at,
          updatedAt: permission.updated_at
        }))
      };
    } catch (error) {
      console.warn('Error fetching permissions:', error);
      return { permissions: [] };
    }
  }

  private async createUser(variables: any) {
    try {
      const response = await apiClient.makeRequest<ApiUserResponse>('/api/v1/users', {
        method: 'POST',
        body: JSON.stringify({
          email: variables.input.email,
          password: variables.input.password,
          first_name: variables.input.firstName,
          last_name: variables.input.lastName,
          is_active: variables.input.isActive,
          is_verified: variables.input.isVerified
        })
      });

      const user = response.data;
      return {
        createUser: {
          success: response.success,
          user: user ? {
            ...user,
            firstName: user.first_name,
            lastName: user.last_name,
            isActive: user.is_active,
            isVerified: user.is_verified,
            createdAt: user.created_at,
            updatedAt: user.updated_at
          } : null,
          errors: response.errors ? Object.entries(response.errors).map(([field, messages]) => ({
            field,
            message: Array.isArray(messages) ? messages.join(', ') : messages
          })) : [],
          message: response.message
        }
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return {
        createUser: {
          success: false,
          user: null,
          errors: [{ field: 'general', message: 'Failed to create user. Please try again.' }],
          message: 'Network error occurred'
        }
      };
    }
  }

  private async updateUser(variables: any) {
    try {
      const response = await apiClient.makeRequest<ApiUserResponse>(`/api/v1/users/${variables.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          email: variables.input.email,
          first_name: variables.input.firstName,
          last_name: variables.input.lastName,
          is_active: variables.input.isActive,
          is_verified: variables.input.isVerified
        })
      });

      const user = response.data;
      return {
        updateUser: {
          success: response.success,
          user: user ? {
            ...user,
            firstName: user.first_name,
            lastName: user.last_name,
            isActive: user.is_active,
            isVerified: user.is_verified,
            updatedAt: user.updated_at
          } : null,
          errors: response.errors ? Object.entries(response.errors).map(([field, messages]) => ({
            field,
            message: Array.isArray(messages) ? messages.join(', ') : messages
          })) : [],
          message: response.message
        }
      };
    } catch (error) {
      console.error('Error updating user:', error);
      return {
        updateUser: {
          success: false,
          user: null,
          errors: [{ field: 'general', message: 'Failed to update user. Please try again.' }],
          message: 'Network error occurred'
        }
      };
    }
  }

  private async deleteUser(variables: any) {
    try {
      const response = await apiClient.makeRequest(`/api/v1/users/${variables.id}`, {
        method: 'DELETE'
      });

      return {
        deleteUser: {
          success: response.success,
          message: response.message || (response.success ? 'User deleted successfully' : 'Failed to delete user'),
          errors: response.errors ? Object.entries(response.errors).map(([field, messages]) => ({
            field,
            message: Array.isArray(messages) ? messages.join(', ') : messages
          })) : []
        }
      };
    } catch (error) {
      console.error('Error deleting user:', error);
      return {
        deleteUser: {
          success: false,
          message: 'Failed to delete user. Please try again.',
          errors: [{ field: 'general', message: 'Network error occurred' }]
        }
      };
    }
  }

  private async activateUser(variables: any) {
    try {
      const response = await apiClient.makeRequest<ApiUserResponse>(`/api/v1/users/${variables.id}/activate`, {
        method: 'POST'
      });

      const user = response.data;
      return {
        activateUser: {
          success: response.success,
          user: user ? {
            ...user,
            firstName: user.first_name,
            lastName: user.last_name,
            isActive: user.is_active,
            isVerified: user.is_verified,
            updatedAt: user.updated_at
          } : null,
          errors: response.errors ? Object.entries(response.errors).map(([field, messages]) => ({
            field,
            message: Array.isArray(messages) ? messages.join(', ') : messages
          })) : [],
          message: response.message || (response.success ? 'User activated successfully' : 'Failed to activate user')
        }
      };
    } catch (error) {
      console.error('Error activating user:', error);
      return {
        activateUser: {
          success: false,
          user: null,
          errors: [{ field: 'general', message: 'Failed to activate user. Please try again.' }],
          message: 'Network error occurred'
        }
      };
    }
  }

  private async deactivateUser(variables: any) {
    try {
      const response = await apiClient.makeRequest<ApiUserResponse>(`/api/v1/users/${variables.id}/deactivate`, {
        method: 'POST'
      });

      const user = response.data;
      return {
        deactivateUser: {
          success: response.success,
          user: user ? {
            ...user,
            firstName: user.first_name,
            lastName: user.last_name,
            isActive: user.is_active,
            isVerified: user.is_verified,
            updatedAt: user.updated_at
          } : null,
          errors: response.errors ? Object.entries(response.errors).map(([field, messages]) => ({
            field,
            message: Array.isArray(messages) ? messages.join(', ') : messages
          })) : [],
          message: response.message || (response.success ? 'User deactivated successfully' : 'Failed to deactivate user')
        }
      };
    } catch (error) {
      console.error('Error deactivating user:', error);
      return {
        deactivateUser: {
          success: false,
          user: null,
          errors: [{ field: 'general', message: 'Failed to deactivate user. Please try again.' }],
          message: 'Network error occurred'
        }
      };
    }
  }

  private async verifyUser(variables: any) {
    try {
      const response = await apiClient.makeRequest<ApiUserResponse>(`/api/v1/users/${variables.id}/verify`, {
        method: 'POST'
      });

      const user = response.data;
      return {
        verifyUser: {
          success: response.success,
          user: user ? {
            ...user,
            firstName: user.first_name,
            lastName: user.last_name,
            isActive: user.is_active,
            isVerified: user.is_verified,
            updatedAt: user.updated_at
          } : null,
          errors: response.errors ? Object.entries(response.errors).map(([field, messages]) => ({
            field,
            message: Array.isArray(messages) ? messages.join(', ') : messages
          })) : [],
          message: response.message || (response.success ? 'User verified successfully' : 'Failed to verify user')
        }
      };
    } catch (error) {
      console.error('Error verifying user:', error);
      return {
        verifyUser: {
          success: false,
          user: null,
          errors: [{ field: 'general', message: 'Failed to verify user. Please try again.' }],
          message: 'Network error occurred'
        }
      };
    }
  }
}

// Create singleton instance
export const graphqlService = new GraphQLService();

// GraphQL Queries and Mutations for User Management (mapped to REST API)

// User Queries
export const GET_USERS = `
  query GetUsers($filter: UserFilter, $pagination: PaginationInput, $sort: SortInput) {
    users(filter: $filter, pagination: $pagination, sort: $sort) {
      edges {
        node {
          id
          email
          firstName
          lastName
          name
          role
          isActive
          isVerified
          twoFactorEnabled
          lastLoginAt
          createdAt
          updatedAt
          organization {
            id
            name
            domain
          }
        }
        cursor
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const GET_USER_BY_ID = `
  query GetUserById($id: ID!) {
    user(id: $id) {
      id
      email
      firstName
      lastName
      name
      role
      isActive
      isVerified
      twoFactorEnabled
      lastLoginAt
      createdAt
      updatedAt
      organization {
        id
        name
        domain
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_USER_STATS = `
  query GetUserStats {
    userStats {
      totalUsers
      activeUsers
      inactiveUsers
      verifiedUsers
      unverifiedUsers
      recentSignups
      recentLogins
    }
  }
`;

export const GET_SECURITY_STATS = `
  query GetSecurityStats {
    securityStats {
      failedLoginsToday
      lockedAccounts
      securityAlerts
      twoFactorEnabled
      passwordResetsToday
    }
  }
`;

export const GET_USER_ACTIVITY = `
  query GetUserActivity($userId: ID, $limit: Int, $offset: Int) {
    userActivity(userId: $userId, limit: $limit, offset: $offset) {
      id
      userId
      action
      resource
      details
      ipAddress
      userAgent
      createdAt
      user {
        id
        firstName
        lastName
        name
        email
      }
    }
  }
`;

// Role Queries
export const GET_ROLES = `
  query GetRoles {
    roles {
      id
      organizationId
      name
      description
      isSystem
      isActive
      createdAt
      updatedAt
      permissions {
        id
        name
        resource
        action
        scope
        description
      }
    }
  }
`;

export const GET_PERMISSIONS = `
  query GetPermissions {
    permissions {
      id
      name
      resource
      action
      scope
      description
      isSystem
      createdAt
      updatedAt
    }
  }
`;

// User Mutations
export const CREATE_USER = `
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      success
      user {
        id
        organizationId
        email
        firstName
        lastName
        isActive
        isVerified
        createdAt
        updatedAt
      }
      errors {
        field
        message
      }
    }
  }
`;

export const UPDATE_USER = `
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      success
      user {
        id
        organizationId
        email
        firstName
        lastName
        isActive
        isVerified
        updatedAt
        userRoles {
          id
          role {
            id
            name
            description
          }
        }
      }
      errors {
        field
        message
      }
    }
  }
`;

export const DELETE_USER = `
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      success
      message
      errors {
        field
        message
      }
    }
  }
`;

export const ACTIVATE_USER = `
  mutation ActivateUser($id: ID!) {
    activateUser(id: $id) {
      success
      user {
        id
        isActive
        updatedAt
      }
      errors {
        field
        message
      }
    }
  }
`;

export const DEACTIVATE_USER = `
  mutation DeactivateUser($id: ID!) {
    deactivateUser(id: $id) {
      success
      user {
        id
        isActive
        updatedAt
      }
      errors {
        field
        message
      }
    }
  }
`;

export const VERIFY_USER = `
  mutation VerifyUser($id: ID!) {
    verifyUser(id: $id) {
      success
      user {
        id
        isVerified
        updatedAt
      }
      errors {
        field
        message
      }
    }
  }
`;

export const RESET_USER_PASSWORD = `
  mutation ResetUserPassword($id: ID!, $newPassword: String!) {
    resetUserPassword(id: $id, newPassword: $newPassword) {
      success
      message
      errors {
        field
        message
      }
    }
  }
`;

// Role Mutations
export const CREATE_ROLE = `
  mutation CreateRole($input: CreateRoleInput!) {
    createRole(input: $input) {
      success
      role {
        id
        organizationId
        name
        description
        isSystem
        isActive
        createdAt
        updatedAt
      }
      errors {
        field
        message
      }
    }
  }
`;

export const UPDATE_ROLE = `
  mutation UpdateRole($id: ID!, $input: UpdateRoleInput!) {
    updateRole(id: $id, input: $input) {
      success
      role {
        id
        name
        description
        updatedAt
      }
      errors {
        field
        message
      }
    }
  }
`;

export const DELETE_ROLE = `
  mutation DeleteRole($id: ID!) {
    deleteRole(id: $id) {
      success
      message
      errors {
        field
        message
      }
    }
  }
`;

export const ASSIGN_USER_ROLE = `
  mutation AssignUserRole($userId: ID!, $roleId: ID!) {
    assignUserRole(userId: $userId, roleId: $roleId) {
      success
      message
      errors {
        field
        message
      }
    }
  }
`;

export const REVOKE_USER_ROLE = `
  mutation RevokeUserRole($userId: ID!, $roleId: ID!) {
    revokeUserRole(userId: $userId, roleId: $roleId) {
      success
      message
      errors {
        field
        message
      }
    }
  }
`;

export const ASSIGN_PERMISSIONS = `
  mutation AssignPermissions($roleId: ID!, $permissionIds: [ID!]!) {
    assignPermissions(roleId: $roleId, permissionIds: $permissionIds) {
      success
      message
      errors {
        field
        message
      }
    }
  }
`;

// Bulk Operations
export const BULK_CREATE_USERS = `
  mutation BulkCreateUsers($input: BulkCreateUsersInput!) {
    bulkCreateUsers(input: $input) {
      success
      results {
        success
        user {
          id
          email
          firstName
          lastName
        }
        error
        email
      }
      createdCount
      failedCount
      errors {
        field
        message
      }
    }
  }
`;

export const BULK_UPDATE_USERS = `
  mutation BulkUpdateUsers($input: BulkUpdateUsersInput!) {
    bulkUpdateUsers(input: $input) {
      success
      results {
        success
        user {
          id
          email
          firstName
          lastName
          isActive
          isVerified
        }
        error
        userId
      }
      updatedCount
      failedCount
      errors {
        field
        message
      }
    }
  }
`;

export const BULK_DELETE_USERS = `
  mutation BulkDeleteUsers($userIds: [ID!]!) {
    bulkDeleteUsers(userIds: $userIds) {
      success
      deletedCount
      failedCount
      errors {
        userId
        error
      }
    }
  }
`;

// Check Permission
export const CHECK_PERMISSION = `
  query CheckPermission($userId: ID!, $resource: String!, $action: String!) {
    checkPermission(userId: $userId, resource: $resource, action: $action) {
      hasPermission
    }
  }
`;

// Subscriptions for real-time updates (not implemented via REST)
export const USER_CREATED_SUBSCRIPTION = `
  subscription UserCreated {
    userCreated {
      id
      email
      firstName
      lastName
      isActive
      isVerified
      createdAt
      organization {
        id
        name
      }
    }
  }
`;

export const USER_UPDATED_SUBSCRIPTION = `
  subscription UserUpdated {
    userUpdated {
      id
      email
      firstName
      lastName
      isActive
      isVerified
      updatedAt
    }
  }
`;

export const USER_ACTIVITY_SUBSCRIPTION = `
  subscription UserActivity {
    userActivity {
      id
      userId
      action
      resource
      details
      ipAddress
      createdAt
      user {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

// GraphQL response and mutation types

export interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: Array<string | number>;
  }>;
}

export interface MutationResponse {
  success: boolean;
  message?: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

export interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive?: boolean;
  isVerified?: boolean;
  roleIds?: string[];
}

export interface UpdateUserInput {
  email?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  isVerified?: boolean;
  roleIds?: string[];
}

export interface CreateRoleInput {
  name: string;
  description: string;
}

export interface UpdateRoleInput {
  name?: string;
  description?: string;
}