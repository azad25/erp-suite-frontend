import { useState, useEffect } from 'react';
import { graphqlService } from '@/services/graphql';
import { GET_USER_ROLE, GET_USER_ROLE_TYPE } from '@/services/graphql/queries';

export type UserRoleType = 'app_admin' | 'organization_admin' | 'user';

export const useUserRole = () => {
  const [roleType, setRoleType] = useState<UserRoleType>('user');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Don't query until token exists to avoid redirect churn
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUserRoleType = async () => {
      try {
        setLoading(true);
        setError(null);
        // Prefer structured field if available
        const structured = await graphqlService.request(GET_USER_ROLE);
        if (structured && structured.userRole) {
          setRoleType(structured.userRole.roleType as UserRoleType);
        } else {
          // Fallback to legacy string field
          const legacy = await graphqlService.request(GET_USER_ROLE_TYPE);
          if (legacy && legacy.userRoleType) {
            setRoleType(legacy.userRoleType as UserRoleType);
          } else {
            setRoleType('user');
          }
        }
      } catch (err) {
        console.error('Error fetching user role type:', err);
        setError('Failed to fetch user role type');
        // Default to 'user' role on error
        setRoleType('user');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRoleType();
  }, []);

  const isAppAdmin = roleType === 'app_admin';
  const isOrganizationAdmin = roleType === 'organization_admin';
  const isRegularUser = roleType === 'user';

  return {
    roleType,
    loading,
    error,
    isAppAdmin,
    isOrganizationAdmin,
    isRegularUser,
  };
};