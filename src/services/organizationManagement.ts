// Organization Management service using GraphQL (via API Gateway)
import { graphqlService } from './graphql';

export interface Organization {
  id: string;
  name: string;
  domain: string;
  isActive: boolean;
  userCount: number;
  activeUserCount: number;
  createdAt: string;
  updatedAt: string;
  users?: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
    lastLoginAt?: string;
  }>;
}

export interface OrganizationStats {
  totalOrganizations: number;
  activeOrganizations: number;
  inactiveOrganizations: number;
  verifiedOrganizations: number;
  unverifiedOrganizations: number;
  totalUsers: number;
  averageUsersPerOrg: number;
}

export interface CreateOrganizationInput {
  name: string;
  domain: string;
  adminEmail: string;
  adminFirstName: string;
  adminLastName: string;
  adminPassword: string;
}

export interface UpdateOrganizationInput {
  name?: string;
  isActive?: boolean;
}

// GraphQL queries and mutations
const GET_ORGANIZATIONS = `
  query GetOrganizations($limit: Int, $offset: Int, $search: String) {
    organizations(limit: $limit, offset: $offset, search: $search) {
      edges {
        node {
          id
          name
          domain
          isActive
          userCount
          activeUserCount
          createdAt
          updatedAt
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

const GET_ORGANIZATION_BY_ID = `
  query GetOrganizationById($id: ID!) {
    organization(id: $id) {
      id
      name
      domain
      isActive
      userCount
      activeUserCount
      createdAt
      updatedAt
      users {
        id
        firstName
        lastName
        email
        isActive
        lastLoginAt
      }
    }
  }
`;

const GET_ORGANIZATION_STATS = `
  query GetOrganizationStats {
    organizationStats {
      totalOrganizations
      activeOrganizations
      inactiveOrganizations
      verifiedOrganizations
      unverifiedOrganizations
      totalUsers
      averageUsersPerOrg
    }
  }
`;

const CREATE_ORGANIZATION = `
  mutation CreateOrganization($input: CreateOrganizationInput!) {
    createOrganization(input: $input) {
      success
      organization {
        id
        name
        domain
      }
      errors
    }
  }
`;

const UPDATE_ORGANIZATION = `
  mutation UpdateOrganization($id: ID!, $input: UpdateOrganizationInput!) {
    updateOrganization(id: $id, input: $input) {
      success
      organization {
        id
        name
        domain
      }
      errors
    }
  }
`;

const DELETE_ORGANIZATION = `
  mutation DeleteOrganization($id: ID!) {
    deleteOrganization(id: $id) {
      success
      errors
    }
  }
`;

const ACTIVATE_ORGANIZATION = `
  mutation ActivateOrganization($id: ID!) {
    activateOrganization(id: $id) {
      success
      errors
    }
  }
`;

const DEACTIVATE_ORGANIZATION = `
  mutation DeactivateOrganization($id: ID!) {
    deactivateOrganization(id: $id) {
      success
      errors
    }
  }
`;

class OrganizationManagementService {
  async getOrganizations(limit = 10, offset = 0, search?: string) {
    try {
      const response = await graphqlService.request(GET_ORGANIZATIONS, {
        limit,
        offset,
        search,
      });

      // Handle empty or null response gracefully
      if (!response || !response.organizations) {
        return {
          organizations: [],
          total: 0,
          page: Math.floor(offset / limit) + 1,
          limit,
          hasNextPage: false,
          hasPreviousPage: false,
        };
      }

      const edges = response.organizations.edges || [];
      const organizations = edges.map((e: any) => e.node);

      return {
        organizations,
        total: response.organizations.totalCount || 0,
        page: Math.floor(offset / limit) + 1,
        limit,
        hasNextPage: response.organizations.pageInfo?.hasNextPage || false,
        hasPreviousPage: response.organizations.pageInfo?.hasPreviousPage || false,
      };
    } catch (error) {
      console.error('GraphQL getOrganizations failed:', error);
      // Return empty data structure instead of throwing error
      return {
        organizations: [],
        total: 0,
        page: Math.floor(offset / limit) + 1,
        limit,
        hasNextPage: false,
        hasPreviousPage: false,
      };
    }
  }

  async getOrganizationById(organizationId: string) {
    try {
      const response = await graphqlService.request(GET_ORGANIZATION_BY_ID, { id: organizationId });

      // Handle empty response or missing organization
      if (!response || !response.organization) {
        return null;
      }

      return response.organization;
    } catch (error) {
      console.error('GraphQL getOrganizationById failed:', error);

      // Check if it's a not found error
      const message = error instanceof Error ? error.message : String(error);
      const code = (error as any)?.code;

      if (code === 'NOT_FOUND' || message.toLowerCase().includes('not found')) {
        return null;
      }

      // For other errors, return null instead of throwing
      console.warn(`Organization ${organizationId} could not be fetched, returning null`);
      return null;
    }
  }

  async getOrganizationStats() {
    try {
      const response = await graphqlService.request(GET_ORGANIZATION_STATS);

      // Handle empty response gracefully
      if (!response || !response.organizationStats) {
        return {
          totalOrganizations: 0,
          activeOrganizations: 0,
          inactiveOrganizations: 0,
          verifiedOrganizations: 0,
          unverifiedOrganizations: 0,
          totalUsers: 0,
          averageUsersPerOrg: 0,
        };
      }

      return response.organizationStats;
    } catch (error) {
      console.error('GraphQL getOrganizationStats failed:', error);

      // Return default stats instead of throwing error
      return {
        totalOrganizations: 0,
        activeOrganizations: 0,
        inactiveOrganizations: 0,
        verifiedOrganizations: 0,
        unverifiedOrganizations: 0,
        totalUsers: 0,
        averageUsersPerOrg: 0,
      };
    }
  }

  async createOrganization(organizationData: CreateOrganizationInput) {
    try {
      const response = await graphqlService.request(CREATE_ORGANIZATION, { input: organizationData });

      // Handle empty response
      if (!response || !response.createOrganization) {
        return {
          success: false,
          organization: null,
          errors: ['No response received from server']
        };
      }

      return response.createOrganization;
    } catch (error) {
      console.error('GraphQL createOrganization failed:', error);
      return {
        success: false,
        organization: null,
        errors: [error instanceof Error ? error.message : String(error)]
      };
    }
  }

  async updateOrganization(organizationId: string, organizationData: UpdateOrganizationInput) {
    try {
      const response = await graphqlService.request(UPDATE_ORGANIZATION, {
        id: organizationId,
        input: organizationData
      });

      // Handle empty response
      if (!response || !response.updateOrganization) {
        return {
          success: false,
          organization: null,
          errors: ['No response received from server']
        };
      }

      return response.updateOrganization;
    } catch (error) {
      console.error('GraphQL updateOrganization failed:', error);
      return {
        success: false,
        organization: null,
        errors: [error instanceof Error ? error.message : String(error)]
      };
    }
  }

  async deleteOrganization(organizationId: string) {
    try {
      const response = await graphqlService.request(DELETE_ORGANIZATION, { id: organizationId });

      // Handle empty response
      if (!response || !response.deleteOrganization) {
        return {
          success: false,
          errors: ['No response received from server']
        };
      }

      return response.deleteOrganization;
    } catch (error) {
      console.error('GraphQL deleteOrganization failed:', error);
      return {
        success: false,
        errors: [error instanceof Error ? error.message : String(error)]
      };
    }
  }

  async activateOrganization(organizationId: string) {
    try {
      const response = await graphqlService.request(ACTIVATE_ORGANIZATION, { id: organizationId });
      return response.activateOrganization;
    } catch (error) {
      console.error('GraphQL activateOrganization failed:', error);
      throw new Error(`Failed to activate organization: ${error}`);
    }
  }

  async deactivateOrganization(organizationId: string) {
    try {
      const response = await graphqlService.request(DEACTIVATE_ORGANIZATION, { id: organizationId });
      return response.deactivateOrganization;
    } catch (error) {
      console.error('GraphQL deactivateOrganization failed:', error);
      throw new Error(`Failed to deactivate organization: ${error}`);
    }
  }
}

export const organizationManagementService = new OrganizationManagementService();