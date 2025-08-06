// ============================================================================
// GRAPHQL TYPES AND INTERFACES
// ============================================================================

// API Response Types
export interface ApiUserStatsResponse {
  total_users?: number;
  active_users?: number;
  inactive_users?: number;
  verified_users?: number;
  unverified_users?: number;
  recent_signups?: number;
  recent_logins?: number;
}

export interface ApiSecurityStatsResponse {
  failed_logins_today?: number;
  locked_accounts?: number;
  security_alerts?: number;
  two_factor_enabled?: number;
  password_resets_today?: number;
}

export interface ApiUserActivityResponse {
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

export interface ApiRolesResponse {
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

export interface ApiPermissionsResponse {
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

export interface ApiUserResponse {
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