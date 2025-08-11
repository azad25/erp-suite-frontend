"use client";

import React from 'react';
import { useLoading } from '@/context/LoadingContext';
import LoadingLogo from './LoadingLogo';

export default function GlobalLoadingScreen() {
  const { isLoading, loadingMessage } = useLoading();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center space-y-4">
        <LoadingLogo 
          withText={true}
          className="animate-pulse"
          textClassName="text-gray-900 dark:text-white"
        />
        
        {loadingMessage && (
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
              {loadingMessage}
            </p>
          </div>
        )}
        
        {/* Loading dots animation */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
}