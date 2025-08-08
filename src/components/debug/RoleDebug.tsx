"use client";
import React from 'react';
import { useUserRole } from '@/hooks/useUserRole';
import { graphqlService } from '@/services/graphql';

const RoleDebug: React.FC = () => {
  const { roleType, isAppAdmin, isOrganizationAdmin, loading, error } = useUserRole();
  const [testResult, setTestResult] = React.useState<any>(null);

  const testUserRoleQuery = async () => {
    try {
      const response = await graphqlService.request(`
        query {
          userRoleType
          me {
            id
            firstName
            lastName
            email
            roles {
              name
            }
          }
        }
      `);
      setTestResult(response);
      console.log('Direct GraphQL test result:', response);
    } catch (err) {
      console.error('Direct GraphQL test error:', err);
      setTestResult({ error: err instanceof Error ? err.message : String(err) });
    }
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg m-4">
      <h3 className="text-lg font-bold mb-4">Role Debug Information</h3>
      
      <div className="space-y-2">
        <p><strong>Role Type:</strong> {roleType}</p>
        <p><strong>Is App Admin:</strong> {isAppAdmin ? 'Yes' : 'No'}</p>
        <p><strong>Is Org Admin:</strong> {isOrganizationAdmin ? 'Yes' : 'No'}</p>
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <p><strong>Error:</strong> {error || 'None'}</p>
      </div>

      <button 
        onClick={testUserRoleQuery}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Test Direct GraphQL Query
      </button>

      {testResult && (
        <div className="mt-4">
          <h4 className="font-bold">Direct Query Result:</h4>
          <pre className="bg-gray-200 dark:bg-gray-700 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(testResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default RoleDebug;