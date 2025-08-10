"use client";

import React, { useState } from "react";

export default function ConfigExample() {
  const [configData, setConfigData] = useState({
    database: {
      host: "localhost",
      port: 5432,
      name: "erp_suite",
      user: "admin"
    },
    api: {
      baseUrl: "https://api.erpsuite.com",
      timeout: 30000,
      retries: 3
    },
    features: {
      darkMode: true,
      notifications: true,
      analytics: false
    }
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleConfigChange = (section: string, key: string, value: any) => {
    setConfigData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const saveConfig = () => {
    // Here you would typically save to backend
    console.log("Saving config:", configData);
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Configuration Example
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Example configuration management page
        </p>
      </div>

      {/* Configuration Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Database Configuration */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Database Configuration
          </h2>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Host
              </label>
              <input
                type="text"
                value={configData.database.host}
                onChange={(e) => handleConfigChange('database', 'host', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Port
              </label>
              <input
                type="number"
                value={configData.database.port}
                onChange={(e) => handleConfigChange('database', 'port', parseInt(e.target.value))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Database Name
              </label>
              <input
                type="text"
                value={configData.database.name}
                onChange={(e) => handleConfigChange('database', 'name', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>

        {/* API Configuration */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            API Configuration
          </h2>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Base URL
              </label>
              <input
                type="text"
                value={configData.api.baseUrl}
                onChange={(e) => handleConfigChange('api', 'baseUrl', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Timeout (ms)
              </label>
              <input
                type="number"
                value={configData.api.timeout}
                onChange={(e) => handleConfigChange('api', 'timeout', parseInt(e.target.value))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Retries
              </label>
              <input
                type="number"
                value={configData.api.retries}
                onChange={(e) => handleConfigChange('api', 'retries', parseInt(e.target.value))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Configuration */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Feature Flags
        </h2>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Dark Mode
            </span>
            <input
              type="checkbox"
              checked={configData.features.darkMode}
              onChange={(e) => handleConfigChange('features', 'darkMode', e.target.checked)}
              disabled={!isEditing}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Notifications
            </span>
            <input
              type="checkbox"
              checked={configData.features.notifications}
              onChange={(e) => handleConfigChange('features', 'notifications', e.target.checked)}
              disabled={!isEditing}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Analytics
            </span>
            <input
              type="checkbox"
              checked={configData.features.analytics}
              onChange={(e) => handleConfigChange('features', 'analytics', e.target.checked)}
              disabled={!isEditing}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Edit Configuration
          </button>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={saveConfig}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Save Changes
            </button>
          </>
        )}
      </div>
    </div>
  );
} 