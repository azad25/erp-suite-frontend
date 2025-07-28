'use client';

import { useState, useEffect } from 'react';
import config from '@/lib/config';

const ConfigExample = () => {
  const [isConnected, setIsConnected] = useState<Record<string, boolean>>({
    api: false,
    graphql: false,
    websocket: false,
    elasticsearch: false,
    redis: false,
  });

  useEffect(() => {
    // This is just a demonstration - in a real app, you would implement
    // actual connection checks for each service
    const checkConnections = async () => {
      // Simulate API connection check
      try {
        const apiResponse = await fetch(`${config.apiUrls.base}/api/health`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        setIsConnected(prev => ({ ...prev, api: apiResponse.ok }));
      } catch (error) {
        console.error('API connection check failed:', error);
        setIsConnected(prev => ({ ...prev, api: false }));
      }

      // In a real application, you would implement similar checks for other services
      // For this example, we'll just simulate the checks
      
      // Simulate successful connections for demo purposes
      setTimeout(() => {
        setIsConnected({
          api: true,
          graphql: true,
          websocket: true,
          elasticsearch: config.environment === 'production',
          redis: config.environment === 'production',
        });
      }, 1500);
    };

    checkConnections();
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Environment Configuration</h2>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">API Endpoints</h3>
        <ul className="space-y-2">
          <li>
            <span className="font-medium">Base API:</span> {config.apiUrls.base}
            <span className={`ml-2 px-2 py-1 text-xs rounded ${isConnected.api ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isConnected.api ? 'Connected' : 'Disconnected'}
            </span>
          </li>
          <li><span className="font-medium">Auth API:</span> {config.apiUrls.auth}</li>
          <li><span className="font-medium">CRM API:</span> {config.apiUrls.crm}</li>
          <li><span className="font-medium">HRM API:</span> {config.apiUrls.hrm}</li>
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">GraphQL</h3>
        <p>
          <span className="font-medium">GraphQL URL:</span> {config.graphql.url}
          <span className={`ml-2 px-2 py-1 text-xs rounded ${isConnected.graphql ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isConnected.graphql ? 'Connected' : 'Disconnected'}
          </span>
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">WebSocket</h3>
        <p>
          <span className="font-medium">WebSocket URL:</span> {config.websocket.url}
          <span className={`ml-2 px-2 py-1 text-xs rounded ${isConnected.websocket ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isConnected.websocket ? 'Connected' : 'Disconnected'}
          </span>
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Search & Cache</h3>
        <p>
          <span className="font-medium">Elasticsearch URL:</span> {config.elasticsearch.url}
          <span className={`ml-2 px-2 py-1 text-xs rounded ${isConnected.elasticsearch ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isConnected.elasticsearch ? 'Connected' : 'Disconnected'}
          </span>
        </p>
        <p className="mt-2">
          <span className="font-medium">Redis URL:</span> {config.redis.url}
          <span className={`ml-2 px-2 py-1 text-xs rounded ${isConnected.redis ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isConnected.redis ? 'Connected' : 'Disconnected'}
          </span>
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Feature Flags</h3>
        <ul className="space-y-2">
          <li>
            <span className="font-medium">AI Chatbot:</span>
            <span className={`ml-2 px-2 py-1 text-xs rounded ${config.features.aiChatbot ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {config.features.aiChatbot ? 'Enabled' : 'Disabled'}
            </span>
          </li>
          <li>
            <span className="font-medium">Realtime Updates:</span>
            <span className={`ml-2 px-2 py-1 text-xs rounded ${config.features.realtimeUpdates ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
              {config.features.realtimeUpdates ? 'Enabled' : 'Disabled'}
            </span>
          </li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Environment</h3>
        <p>
          <span className={`px-2 py-1 text-xs rounded ${config.environment === 'production' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
            {config.environment}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ConfigExample;