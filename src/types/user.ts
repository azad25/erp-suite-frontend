// Unified User types for the ERP system

export interface User {
    id: string;
    organizationId?: string;
    email: string;
    firstName?: string;
    lastName?: string;
    first_name?: string; // API compatibility
    last_name?: string;  // API compatibility
    isActive?: boolean;
    is_active?: boolean; // API compatibility
    isVerified?: boolean;
    is_verified?: boolean; // API compatibility
    twoFactorEnabled?: boolean;
    lastLoginAt?: string;
    last_login_at?: string; // API compatibility
    createdAt?: string;
    updatedAt?: string;
    created_at?: string; // API compatibility
    updated_at?: string; // API compatibility
    email_verified_at?: string; // API compatibility
    organization?: Organization;
    userRoles?: UserRole[];
    // GraphQL schema fields
    roles?: Role[];
    permissions?: Permission[];
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
    organizationId?: string;
    name: string;
    description: string;
    isSystem?: boolean;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
    rolePermissions?: RolePermission[];
}

export interface Permission {
    id: string;
    name: string;
    resource: string;
    action: string;
    scope: string;
    description: string;
    isSystem?: boolean;
    createdAt?: string;
    updatedAt?: string;
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
    userAgent?: string;
    createdAt: string;
    user?: User;
}

// API Request/Response types
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

export interface AuthResponse {
    user: User;
    access_token: string;
    refresh_token: string;
    expires_in: number;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: Record<string, string[]>;
}

// Utility functions for User type compatibility
export function normalizeUser(user: any): User {
    return {
        id: user.id,
        organizationId: user.organizationId || user.organization_id,
        email: user.email,
        firstName: user.firstName || user.first_name,
        lastName: user.lastName || user.last_name,
        first_name: user.first_name || user.firstName,
        last_name: user.last_name || user.lastName,
        isActive: user.isActive ?? user.is_active ?? true,
        isVerified: user.isVerified ?? user.is_verified ?? false,
        twoFactorEnabled: user.twoFactorEnabled ?? user.two_factor_enabled ?? false,
        lastLoginAt: user.lastLoginAt || user.last_login_at,
        last_login_at: user.last_login_at || user.lastLoginAt,
        createdAt: user.createdAt || user.created_at,
        updatedAt: user.updatedAt || user.updated_at,
        created_at: user.created_at || user.createdAt,
        updated_at: user.updated_at || user.updatedAt,
        email_verified_at: user.email_verified_at || user.emailVerifiedAt,
        organization: user.organization,
        userRoles: user.userRoles || user.user_roles,
    };
}