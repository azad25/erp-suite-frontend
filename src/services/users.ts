// User management service for ERP Auth Service integration
import apiClient from './api';
import { User } from './auth';

export interface Role {
  id: string;
  organization_id: string;
  name: string;
  description: string;
  is_system: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  action: string;
  scope: string;
  description: string;
  is_system: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  created_at: string;
  role?: Role;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  is_active?: boolean;
  is_verified?: boolean;
  role_ids?: string[];
}

export interface UpdateUserRequest {
  email?: string;
  first_name?: string;
  last_name?: string;
  is_active?: boolean;
  is_verified?: boolean;
  role_ids?: string[];
}

export interface CreateRoleRequest {
  name: string;
  description: string;
}

export interface AssignPermissionsRequest {
  permission_ids: string[];
}

export interface AssignUserRoleRequest {
  user_id: string;
  role_id: string;
}

export interface CheckPermissionRequest {
  user_id: string;
  resource: string;
  action: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  resource: string;
  details: Record<string, any>;
  ip_address: string;
  user_agent: string;
  created_at: string;
  user?: User;
}

class UserService {
  // User Management
  async getUsers(page = 1, limit = 10, search?: string): Promise<UserListResponse> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (search) {
      params.append('search', search);
    }
    
    const response = await apiClient.get(`/users?${params.toString()}`);
    return response.data;
  }

  async getUserById(userId: string): Promise<User> {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    const response = await apiClient.post('/users', userData);
    return response.data;
  }

  async updateUser(userId: string, userData: UpdateUserRequest): Promise<User> {
    const response = await apiClient.put(`/users/${userId}`, userData);
    return response.data;
  }

  async deleteUser(userId: string): Promise<void> {
    await apiClient.delete(`/users/${userId}`);
  }

  async activateUser(userId: string): Promise<User> {
    const response = await apiClient.patch(`/users/${userId}/activate`);
    return response.data;
  }

  async deactivateUser(userId: string): Promise<User> {
    const response = await apiClient.patch(`/users/${userId}/deactivate`);
    return response.data;
  }

  async verifyUser(userId: string): Promise<User> {
    const response = await apiClient.patch(`/users/${userId}/verify`);
    return response.data;
  }

  async resetUserPassword(userId: string, newPassword: string): Promise<void> {
    await apiClient.post(`/users/${userId}/reset-password`, {
      new_password: newPassword,
    });
  }

  // Role Management
  async getRoles(): Promise<Role[]> {
    const response = await apiClient.get('/roles');
    return response.data;
  }

  async getRoleById(roleId: string): Promise<Role> {
    const response = await apiClient.get(`/roles/${roleId}`);
    return response.data;
  }

  async createRole(roleData: CreateRoleRequest): Promise<Role> {
    const response = await apiClient.post('/roles', roleData);
    return response.data;
  }

  async updateRole(roleId: string, roleData: CreateRoleRequest): Promise<Role> {
    const response = await apiClient.put(`/roles/${roleId}`, roleData);
    return response.data;
  }

  async deleteRole(roleId: string): Promise<void> {
    await apiClient.delete(`/roles/${roleId}`);
  }

  async assignPermissions(roleId: string, permissionIds: string[]): Promise<void> {
    await apiClient.post(`/roles/${roleId}/permissions`, {
      permission_ids: permissionIds,
    });
  }

  async removePermission(roleId: string, permissionId: string): Promise<void> {
    await apiClient.delete(`/roles/${roleId}/permissions/${permissionId}`);
  }

  // User Role Management
  async getUserRoles(userId: string): Promise<UserRole[]> {
    const response = await apiClient.get(`/users/${userId}/roles`);
    return response.data;
  }

  async assignUserRole(userId: string, roleId: string): Promise<void> {
    await apiClient.post('/roles/assign', {
      user_id: userId,
      role_id: roleId,
    });
  }

  async revokeUserRole(userId: string, roleId: string): Promise<void> {
    await apiClient.post('/roles/revoke', {
      user_id: userId,
      role_id: roleId,
    });
  }

  // Permission Management
  async getPermissions(): Promise<Permission[]> {
    const response = await apiClient.get('/permissions');
    return response.data;
  }

  async checkPermission(userId: string, resource: string, action: string): Promise<boolean> {
    const response = await apiClient.post('/roles/check-permission', {
      user_id: userId,
      resource,
      action,
    });
    return response.data.has_permission;
  }

  // Activity Logs
  async getUserActivity(userId?: string, page = 1, limit = 10): Promise<{
    activities: ActivityLog[];
    total: number;
    page: number;
    limit: number;
  }> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    if (userId) {
      params.append('user_id', userId);
    }
    
    const response = await apiClient.get(`/activity?${params.toString()}`);
    return response.data;
  }

  // Bulk Operations
  async bulkCreateUsers(users: CreateUserRequest[]): Promise<{
    success: boolean;
    results: Array<{
      success: boolean;
      user?: User;
      error?: string;
      email: string;
    }>;
    created_count: number;
    failed_count: number;
  }> {
    const response = await apiClient.post('/users/bulk', {
      users,
    });
    return response.data;
  }

  async bulkUpdateUsers(users: Array<UpdateUserRequest & { user_id: string }>): Promise<{
    success: boolean;
    results: Array<{
      success: boolean;
      user?: User;
      error?: string;
      user_id: string;
    }>;
    updated_count: number;
    failed_count: number;
  }> {
    const response = await apiClient.put('/users/bulk', {
      users,
    });
    return response.data;
  }

  async bulkDeleteUsers(userIds: string[]): Promise<{
    success: boolean;
    deleted_count: number;
    failed_count: number;
    errors: Array<{
      user_id: string;
      error: string;
    }>;
  }> {
    const response = await apiClient.delete('/users/bulk', {
      data: { user_ids: userIds },
    });
    return response.data;
  }

  // Statistics and Analytics
  async getUserStats(): Promise<{
    total_users: number;
    active_users: number;
    inactive_users: number;
    verified_users: number;
    unverified_users: number;
    recent_signups: number;
    recent_logins: number;
  }> {
    const response = await apiClient.get('/users/stats');
    return response.data;
  }

  async getSecurityStats(): Promise<{
    failed_logins_today: number;
    locked_accounts: number;
    security_alerts: number;
    two_factor_enabled: number;
    password_resets_today: number;
  }> {
    const response = await apiClient.get('/security/stats');
    return response.data;
  }
}

export const userService = new UserService();