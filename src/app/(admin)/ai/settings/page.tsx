'use client';

import React, { useState, useEffect } from 'react';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useTranslation } from '@/hooks/useTranslation';

interface LLMProvider {
  id: number;
  provider_name: string;
  display_name: string;
  api_key_configured: boolean;
  base_url: string | null;
  is_enabled: boolean;
  is_default: boolean;
  priority: number;
  config: any;
  available_models: string[];
  default_model: string | null;
}

interface ProviderStatus {
  provider_name: string;
  display_name: string;
  is_enabled: boolean;
  is_available: boolean;
  is_default: boolean;
  error_message: string | null;
}

export default function AISettingsPage() {
  usePageTitle('AI Settings');
  const { t } = useTranslation();
  
  const [providers, setProviders] = useState<LLMProvider[]>([]);
  const [providerStatuses, setProviderStatuses] = useState<ProviderStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProvider, setEditingProvider] = useState<LLMProvider | null>(null);
  const [showApiKey, setShowApiKey] = useState<{ [key: number]: boolean }>({});
  const [testingProvider, setTestingProvider] = useState<number | null>(null);
  const [testResults, setTestResults] = useState<{ [key: number]: any }>({});

  useEffect(() => {
    fetchProviders();
    fetchProviderStatuses();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/ai-copilot/llm-settings/providers');
      if (!response.ok) throw new Error('Failed to fetch providers');
      const data = await response.json();
      setProviders(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProviderStatuses = async () => {
    try {
      const response = await fetch('/api/ai-copilot/llm-settings/providers/status');
      if (!response.ok) throw new Error('Failed to fetch provider statuses');
      const data = await response.json();
      setProviderStatuses(data);
    } catch (err: any) {
      console.error('Error fetching provider statuses:', err);
    }
  };

  const handleUpdateProvider = async (providerId: number, updates: Partial<LLMProvider>) => {
    try {
      const response = await fetch(`/api/ai-copilot/llm-settings/providers/${providerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) throw new Error('Failed to update provider');
      
      await fetchProviders();
      await fetchProviderStatuses();
      setEditingProvider(null);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleTestProvider = async (providerId: number) => {
    try {
      setTestingProvider(providerId);
      const response = await fetch(`/api/ai-copilot/llm-settings/providers/${providerId}/test`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to test provider');
      
      const result = await response.json();
      setTestResults({ ...testResults, [providerId]: result });
    } catch (err: any) {
      setTestResults({ ...testResults, [providerId]: { success: false, message: err.message } });
    } finally {
      setTestingProvider(null);
    }
  };

  const getStatusBadge = (provider: LLMProvider) => {
    const status = providerStatuses.find(s => s.provider_name === provider.provider_name);
    
    if (!provider.is_enabled) {
      return <span className="px-2 py-1 text-xs rounded bg-gray-200 text-gray-700">Disabled</span>;
    }
    
    if (status?.is_available) {
      return <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">Active</span>;
    }
    
    return <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700">Unavailable</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading AI providers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Provider Settings</h1>
        <p className="text-gray-600">
          Configure and manage LLM providers for AI Copilot. Enable multiple providers for automatic fallback.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <div className="grid gap-6">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {provider.display_name}
                  </h3>
                  {getStatusBadge(provider)}
                  {provider.is_default && (
                    <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                      Default
                    </span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleTestProvider(provider.id)}
                    disabled={!provider.is_enabled || testingProvider === provider.id}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {testingProvider === provider.id ? 'Testing...' : 'Test'}
                  </button>
                  
                  <button
                    onClick={() => setEditingProvider(provider)}
                    className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Edit
                  </button>
                </div>
              </div>

              {testResults[provider.id] && (
                <div
                  className={`mb-4 p-3 rounded ${
                    testResults[provider.id].success
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <p
                    className={
                      testResults[provider.id].success ? 'text-green-700' : 'text-red-700'
                    }
                  >
                    {testResults[provider.id].message}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Provider:</span>
                  <span className="ml-2 font-medium">{provider.provider_name}</span>
                </div>
                
                <div>
                  <span className="text-gray-600">Priority:</span>
                  <span className="ml-2 font-medium">{provider.priority}</span>
                </div>
                
                <div>
                  <span className="text-gray-600">API Key:</span>
                  <span className="ml-2 font-medium">
                    {provider.api_key_configured ? '✓ Configured' : '✗ Not configured'}
                  </span>
                </div>
                
                <div>
                  <span className="text-gray-600">Default Model:</span>
                  <span className="ml-2 font-medium">{provider.default_model || 'N/A'}</span>
                </div>
              </div>

              {provider.available_models && provider.available_models.length > 0 && (
                <div className="mt-4">
                  <span className="text-sm text-gray-600">Available Models:</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {provider.available_models.map((model) => (
                      <span
                        key={model}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                      >
                        {model}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={provider.is_enabled}
                    onChange={(e) =>
                      handleUpdateProvider(provider.id, { is_enabled: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Enabled</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={provider.is_default}
                    onChange={(e) =>
                      handleUpdateProvider(provider.id, { is_default: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Set as Default</span>
                </label>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Provider Modal */}
      {editingProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Edit {editingProvider.display_name}</h2>
              
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const updates: any = {};
                  
                  const apiKey = formData.get('api_key') as string;
                  if (apiKey) updates.api_key = apiKey;
                  
                  const baseUrl = formData.get('base_url') as string;
                  if (baseUrl) updates.base_url = baseUrl;
                  
                  const priority = formData.get('priority') as string;
                  if (priority) updates.priority = parseInt(priority);
                  
                  const defaultModel = formData.get('default_model') as string;
                  if (defaultModel) updates.default_model = defaultModel;
                  
                  handleUpdateProvider(editingProvider.id, updates);
                }}
              >
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      API Key / Token
                    </label>
                    <input
                      type="password"
                      name="api_key"
                      placeholder="Enter API key"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Leave empty to keep current key
                    </p>
                  </div>

                  {editingProvider.provider_name !== 'ollama' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Base URL (Optional)
                      </label>
                      <input
                        type="text"
                        name="base_url"
                        defaultValue={editingProvider.base_url || ''}
                        placeholder="https://api.example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority (Higher = Tried First)
                    </label>
                    <input
                      type="number"
                      name="priority"
                      defaultValue={editingProvider.priority}
                      min="0"
                      max="100"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default Model
                    </label>
                    <select
                      name="default_model"
                      defaultValue={editingProvider.default_model || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a model</option>
                      {editingProvider.available_models?.map((model) => (
                        <option key={model} value={model}>
                          {model}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingProvider(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
