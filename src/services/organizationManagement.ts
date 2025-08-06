// Organization Management service using GraphQL (via API Gateway)
import { graphqlService } from './graphql';

export interface Organization {
  id: string;
  name: string;
  domain: string;
  description?: string;
  logo?: string;
  website?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  isActive: boolean;
  isVerified: boolean;
  subscriptionPlan?: string;
  subscriptionStatus?: string;
  userCount: number;
  adminCount: number;
  createdAt: string;
  updatedAt: string;
  users?: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    isActive: boolean;
    role: string;
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
  description?: string;
  website?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  adminEmail: string;
  adminFirstName: string;
  adminLastName: string;
  adminPassword: string;
}

export interface UpdateOrganizationInput {
  name?: string;
  description?: string;
  website?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  isActive?: boolean;
}

// GraphQL queries and mutations
const GET_ORGANIZATIONS = `
  query GetOrganizations($limit: Int, $offset: Int, $search: String) {
    organizations(limit: $limit, offset: $offset, search: $search) {
      nodes {
        id
        name
        domain
        description
        website
        phone
        address
        city
        state
        country
        postalCode
        isActive
        isVerified
        subscriptionPlan
        subscriptionStatus
        userCount
        adminCount
        createdAt
        updatedAt
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
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
      description
      website
      phone
      address
      city
      state
      country
      postalCode
      isActive
      isVerified
      subscriptionPlan
      subscriptionStatus
      userCount
      adminCount
      createdAt
      updatedAt
      users {
        id
        firstName
        lastName
        email
        isActive
        role
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
      
      return {
        organizations: response.organizations?.nodes || [],
        total: response.organizations?.totalCount || 0,
        page: Math.floor(offset / limit) + 1,
        limit,
        hasNextPage: response.organizations?.pageInfo?.hasNextPage || false,
        hasPreviousPage: response.organizations?.pageInfo?.hasPreviousPage || false,
      };
    } catch (error) {
      console.error('GraphQL getOrganizations failed:', error);
      throw new Error(`Failed to fetch organizations: ${error}`);
    }
  }

  async getOrganizationById(organizationId: string) {
    try {
      const response = await graphqlService.request(GET_ORGANIZATION_BY_ID, { id: organizationId });
      return response.organization;
    } catch (error) {
      console.error('GraphQL getOrganizationById failed:', error);
      throw new Error(`Failed to fetch organization with ID ${organizationId}: ${error}`);
    }
  }

  async getOrganizationStats() {
    try {
      const response = await graphqlService.request(GET_ORGANIZATION_STATS);
      return response.organizationStats;
    } catch (error) {
      console.error('GraphQL getOrganizationStats failed:', error);
      throw new Error(`Failed to fetch organization statistics: ${error}`);
    }
  }

  async createOrganization(organizationData: CreateOrganizationInput) {
    try {
      const response = await graphqlService.request(CREATE_ORGANIZATION, { input: organizationData });
      return response.createOrganization;
    } catch (error) {
      console.error('GraphQL createOrganization failed:', error);
      throw new Error(`Failed to create organization: ${error}`);
    }
  }

  async updateOrganization(organizationId: string, organizationData: UpdateOrganizationInput) {
    try {
      const response = await graphqlService.request(UPDATE_ORGANIZATION, { 
        id: organizationId, 
        input: organizationData 
      });
      return response.updateOrganization;
    } catch (error) {
      console.error('GraphQL updateOrganization failed:', error);
      throw new Error(`Failed to update organization: ${error}`);
    }
  }

  async deleteOrganization(organizationId: string) {
    try {
      const response = await graphqlService.request(DELETE_ORGANIZATION, { id: organizationId });
      return response.deleteOrganization;
    } catch (error) {
      console.error('GraphQL deleteOrganization failed:', error);
      throw new Error(`Failed to delete organization: ${error}`);
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