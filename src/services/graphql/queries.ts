// ============================================================================
// GRAPHQL QUERIES
// ============================================================================

// Working GraphQL Queries (based on current API Gateway implementation)

export const GET_CURRENT_USER = `
  query GetCurrentUser {
    me {
      id
      firstName
      lastName
      email
      emailVerifiedAt
      createdAt
      updatedAt
      roles {
        id
        name
        description
      }
      permissions {
        id
        name
        description
        resource
        action
      }
    }
  }
`;

export const GET_USER_ROLE_TYPE = `
  query GetUserRoleType {
    userRoleType
  }
`;

export const GET_USER_ROLE = `
  query GetUserRole {
    userRole {
      roleType
      isAppAdmin
      isOrganizationAdmin
      isRegularUser
    }
  }
`;

export const GET_USER_BY_ID = `
  query GetUserById($id: ID!) {
    user(id: $id) {
      id
      organizationId
      firstName
      lastName
      email
      emailVerifiedAt
      isActive
      isVerified
      lastLoginAt
      createdAt
      updatedAt
      organization {
        id
        name
        domain
      }
      roles {
        id
        name
        description
      }
      permissions {
        id
        name
        description
        resource
        action
      }
    }
  }
`;

export const GET_HEALTH = `
  query GetHealth {
    health
  }
`;

// User Management Queries
export const GET_USERS = `
  query GetUsers($limit: Int, $offset: Int, $search: String) {
    users(limit: $limit, offset: $offset, search: $search) {
      id
      firstName
      lastName
      email
      emailVerifiedAt
      createdAt
      updatedAt
      roles {
        id
        name
        description
      }
    }
  }
`;

export const GET_USERS_CONNECTION = `
  query GetUsersConnection($limit: Int, $offset: Int, $search: String) {
    users(limit: $limit, offset: $offset, search: $search) {
      edges {
        node {
          id
          organizationId
          firstName
          lastName
          email
          isActive
          isVerified
          lastLoginAt
          createdAt
          updatedAt
          organization {
            id
            name
            domain
          }
          roles {
            id
            name
            description
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

export const GET_SECURITY_EVENTS = `
  query GetSecurityEvents($limit: Int, $organizationId: ID) {
    securityEvents(limit: $limit, organizationId: $organizationId) {
      id
      type
      severity
      message
      ipAddress
      userAgent
      userEmail
      timestamp
      details
      count
    }
  }
`;

export const GET_USER_ACTIVITY = `
  query GetUserActivity($userId: ID, $limit: Int, $offset: Int) {
    userActivity(userId: $userId, limit: $limit, offset: $offset) {
      edges {
        node {
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

// Role and Permission Queries
export const GET_ROLES = `
  query GetRoles {
    roles {
      id
      name
      description
      permissions {
        id
        name
        description
        resource
        action
      }
    }
  }
`;

export const GET_PERMISSIONS = `
  query GetPermissions {
    permissions {
      id
      name
      description
      resource
      action
    }
  }
`;