// ============================================================================
// GRAPHQL MUTATIONS
// ============================================================================

// Authentication Mutations
export const AUTHENTICATE = `
  mutation Authenticate($input: LoginInput!) {
    Authenticate(input: $input) {
      user {
        id
        firstName
        lastName
        email
        emailVerifiedAt
        createdAt
        updatedAt
      }
      accessToken
      refreshToken
      expiresIn
    }
  }
`;

export const CREATE_USER_REGISTER = `
  mutation CreateUser($input: RegisterInput!) {
    CreateUser(input: $input) {
      user {
        id
        firstName
        lastName
        email
        emailVerifiedAt
        createdAt
        updatedAt
      }
      accessToken
      refreshToken
      expiresIn
    }
  }
`;

export const REVOKE_TOKEN = `
  mutation RevokeToken {
    RevokeToken {
      success
      message
      errors {
        field
        message
      }
    }
  }
`;

export const REFRESH_TOKEN = `
  mutation RefreshToken($refreshToken: String!) {
    RefreshToken(refreshToken: $refreshToken) {
      user {
        id
        firstName
        lastName
        email
      }
      accessToken
      refreshToken
      expiresIn
    }
  }
`;

// User Management Mutations (to be implemented)
export const CREATE_USER_ADMIN = `
  mutation CreateUserAdmin($input: CreateUserInput!) {
    createUserAdmin(input: $input) {
      success
      message
      user {
        id
        organizationId
        firstName
        lastName
        email
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
      message
      user {
        id
        organizationId
        firstName
        lastName
        email
        isActive
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
      message
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
      message
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
      message
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

// Role Management Mutations
export const CREATE_ROLE = `
  mutation CreateRole($input: CreateRoleInput!) {
    createRole(input: $input) {
      success
      message
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
      message
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