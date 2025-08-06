"use client";
import React, { useState } from 'react';
import { userManagementService } from '@/services/userManagement';
import Button from '@/components/ui/button/Button';

interface TestResult {
  success: boolean;
  data?: any;
  error?: string;
}

interface TestResults {
  [key: string]: TestResult;
}

export default function TestApiPage() {
  const [results, setResults] = useState<TestResults>({});
  const [loading, setLoading] = useState<string | null>(null);

  const testEndpoint = async (name: string, testFn: () => Promise<any>) => {
    setLoading(name);
    try {
      const result = await testFn();
      setResults((prev: TestResults) => ({ ...prev, [name]: { success: true, data: result } }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      setResults((prev: TestResults) => ({ ...prev, [name]: { success: false, error: errorMessage } }));
    } finally {
      setLoading(null);
    }
  };

  const tests = [
    {
      name: 'Get Users',
      test: () => userManagementService.getUsers(5, 0)
    },
    {
      name: 'Get User Stats',
      test: () => userManagementService.getDashboardStats()
    },
    {
      name: 'Get User Activity',
      test: () => userManagementService.getUserActivity(undefined, 5, 0)
    },
    {
      name: 'Get Roles',
      test: () => userManagementService.getRoles()
    },
    {
      name: 'Get Permissions',
      test: () => userManagementService.getPermissions()
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          API Gateway Connection Test
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Test the connection to the API Gateway and verify data retrieval
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {tests.map((test) => (
          <div key={test.name} className="p-4 border border-gray-200 rounded-xl bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-800 dark:text-white/90">
                {test.name}
              </h3>
              <Button
                size="sm"
                onClick={() => testEndpoint(test.name, test.test)}
                disabled={loading === test.name}
              >
                {loading === test.name ? 'Testing...' : 'Test'}
              </Button>
            </div>
            
            {results[test.name] && (
              <div className="mt-3">
                {results[test.name].success ? (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg dark:bg-green-900/20 dark:border-green-800">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-medium text-green-800 dark:text-green-200">Success</span>
                    </div>
                    <pre className="text-xs text-green-700 dark:text-green-300 overflow-auto max-h-32">
                      {JSON.stringify(results[test.name].data, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg dark:bg-red-900/20 dark:border-red-800">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-sm font-medium text-red-800 dark:text-red-200">Error</span>
                    </div>
                    <p className="text-xs text-red-700 dark:text-red-300">
                      {results[test.name].error}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-6 border border-gray-200 rounded-xl bg-gray-50 dark:border-gray-800 dark:bg-white/[0.02]">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
          Test All Endpoints
        </h3>
        <Button
          onClick={() => {
            tests.forEach(test => {
              setTimeout(() => testEndpoint(test.name, test.test), Math.random() * 1000);
            });
          }}
          disabled={loading !== null}
        >
          Run All Tests
        </Button>
      </div>

      {Object.keys(results).length > 0 && (
        <div className="p-6 border border-gray-200 rounded-xl bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
            Test Summary
          </h3>
          <div className="space-y-2">
            {Object.entries(results).map(([name, result]: [string, any]) => (
              <div key={name} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg dark:border-gray-800">
                <span className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {name}
                </span>
                <span className={`text-sm font-medium ${
                  result.success 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {result.success ? 'PASS' : 'FAIL'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}