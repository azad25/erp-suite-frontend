"use client";

import React, { useState } from "react";

export default function TestApi() {
  const [testResult, setTestResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const testApiConnection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/health');
      const data = await response.json();
      setTestResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setTestResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          API Test Page
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Test API connections and endpoints
        </p>
      </div>

      {/* Test API Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Test API Connection
        </h2>
        
        <div className="space-y-4">
          <button
            onClick={testApiConnection}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Testing..." : "Test API Health"}
          </button>

          {testResult && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                API Response:
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
                {testResult}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* API Endpoints Info */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Available API Endpoints
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              GET
            </span>
            <code className="text-sm text-gray-700 dark:text-gray-300">/api/health</code>
            <span className="text-sm text-gray-500">API health check</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              POST
            </span>
            <code className="text-sm text-gray-700 dark:text-gray-300">/api/auth/login</code>
            <span className="text-sm text-gray-500">User authentication</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
              GET
            </span>
            <code className="text-sm text-gray-700 dark:text-gray-300">/api/users</code>
            <span className="text-sm text-gray-500">Get users list</span>
          </div>
        </div>
      </div>
    </div>
  );
} 