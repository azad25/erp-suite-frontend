// ============================================================================
// GRAPHQL SERVICE EXPORTS
// ============================================================================

// Export client
export { GraphQLClient } from './client';

// Export types
export * from './types';

// Export queries
export * from './queries';

// Export mutations
export * from './mutations';

// Create singleton instance
import { GraphQLClient } from './client';
export const graphqlService = new GraphQLClient();