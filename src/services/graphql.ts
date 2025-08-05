// GraphQL service for ERP system integration
import { GraphQLClient } from 'graphql-request';
import { gql } from 'graphql-request';

// GraphQL Configuration - Connect through API Gateway/nginx proxy
const GRAPHQL_URL = process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost/graphql';

// Create GraphQL client
class GraphQLService {
  private client: GraphQLClient;

  constructor() {
    this.client = new GraphQLClient(GRAPHQL_URL, {
      headers: {},
    });
  }

  // Update authorization header with current token
  private updateAuthHeader() {
    const token = localStorage.getItem('access_token');
    if (token) {
      this.client.setHeader('Authorization', `Bearer ${token}`);
    } else {
      this.client.setHeader('Authorization', '');
    }
  }

  // Execute GraphQL query with automatic token refresh
  async request<T = any>(query: string, variables?: any): Promise<T> {
    this.updateAuthHeader();
    
    try {
      return await this.client.request<T>(query, variables);
    } catch (error: any) {
      // Handle token expiration
      if (error.response?.status === 401) {
        try {
          await this.refreshToken();
          this.updateAuthHeader();
          return await this.client.request<T>(query, variables);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/signin';
          throw refreshError;
        }
      }
      throw error;
    }
  }

  private async refreshToken(): Promise<void> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
  }
}

// Create singleton instance
export const graphqlService = new GraphQLService();

// GraphQL Queries and Mutations for User Management

// User Queries
export const GET_USERS = gql`
  query GetUsers($limit: Int, $offset: Int, $search: String) {
    users(limit: $limit, offset: $offset, search: $search) {
      nodes {
        id
        organizationId
        email
        firstName
        lastName
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
        userRoles {
          id
          role {
            id
            name
            description
          }
        }
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

export const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    user(id: $id) {
      id
      organizationId
      email
      firstName
      lastName
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
        settings {
          timezone
          dateFormat
          currency
          language
          twoFactorEnabled
          sessionTimeout
        }
      }
      userRoles {
        id
        role {
          id
          name
          description
          isSystem
          isActive
          rolePermissions {
            permission {
              id
              name
              resource
              action
              scope
              description
            }
          }
        }
      }
    }
  }
`;

export const GET_USER_STATS = gql`
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

export const GET_SECURITY_STATS = gql`
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

export const GET_USER_ACTIVITY = gql`
  query GetUserActivity($userId: ID, $limit: Int, $offset: Int) {
    userActivity(userId: $userId, limit: $limit, offset: $offset) {
      nodes {
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
          email
        }
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

// Role Queries
export const GET_ROLES = gql`
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
      rolePermissions {
        permission {
          id
          name
          resource
          action
          scope
          description
        }
      }
    }
  }
`;

export const GET_PERMISSIONS = gql`
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
export const CREATE_USER = gql`
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

export const UPDATE_USER = gql`
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

export const DELETE_USER = gql`
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

export const ACTIVATE_USER = gql`
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

export const DEACTIVATE_USER = gql`
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

export const VERIFY_USER = gql`
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

export const RESET_USER_PASSWORD = gql`
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
export const CREATE_ROLE = gql`
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

export const UPDATE_ROLE = gql`
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

export const DELETE_ROLE = gql`
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

export const ASSIGN_USER_ROLE = gql`
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

export const REVOKE_USER_ROLE = gql`
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

export const ASSIGN_PERMISSIONS = gql`
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
export const BULK_CREATE_USERS = gql`
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

export const BULK_UPDATE_USERS = gql`
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

export const BULK_DELETE_USERS = gql`
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
export const CHECK_PERMISSION = gql`
  query CheckPermission($userId: ID!, $resource: String!, $action: String!) {
    checkPermission(userId: $userId, resource: $resource, action: $action) {
      hasPermission
    }
  }
`;

// Subscriptions for real-time updates
export const USER_CREATED_SUBSCRIPTION = gql`
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

export const USER_UPDATED_SUBSCRIPTION = gql`
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

export const USER_ACTIVITY_SUBSCRIPTION = gql`
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

// TypeScript interfaces for GraphQL responses
export interface User {
  id: string;
  organizationId: string;
  email: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  isVerified: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  organization?: Organization;
  userRoles?: UserRole[];
}

export interface Organization {
  id: string;
  name: string;
  domain: string;
  settings?: OrganizationSettings;
}

export interface OrganizationSettings {
  timezone: string;
  dateFormat: string;
  currency: string;
  language: string;
  twoFactorEnabled: boolean;
  sessionTimeout: number;
}

export interface Role {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  isSystem: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  rolePermissions?: RolePermission[];
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  scope: string;
  description: string;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserRole {
  id: string;
  role: Role;
}

export interface RolePermission {
  permission: Permission;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  verifiedUsers: number;
  unverifiedUsers: number;
  recentSignups: number;
  recentLogins: number;
}

export interface SecurityStats {
  failedLoginsToday: number;
  lockedAccounts: number;
  securityAlerts: number;
  twoFactorEnabled: number;
  passwordResetsToday: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  user?: User;
}

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