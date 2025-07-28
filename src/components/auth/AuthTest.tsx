"use client";

import { useState } from 'react';
import { apiClient } from '@/lib/api';
import Button from '@/components/ui/button/Button';

export default function AuthTest() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await apiClient.login({
        email: 'test@example.com',
        password: 'password123'
      });
      
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testRegister = async () => {
    setLoading(true);
    try {
      const response = await apiClient.register({
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        password: 'password123',
        password_confirmation: 'password123'
      });
      
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testCurrentUser = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getCurrentUser();
      setResult(JSON.stringify(response, null, 2));
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Authentication Test</h2>
      
      <div className="space-y-4 mb-6">
        <Button onClick={testRegister} disabled={loading}>
          Test Register
        </Button>
        <Button onClick={testLogin} disabled={loading}>
          Test Login
        </Button>
        <Button onClick={testCurrentUser} disabled={loading}>
          Test Current User
        </Button>
      </div>

      {result && (
        <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Result:</h3>
          <pre className="text-sm overflow-auto">{result}</pre>
        </div>
      )}
    </div>
  );
}