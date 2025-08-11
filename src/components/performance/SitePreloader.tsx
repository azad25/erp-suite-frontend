"use client";

import React from 'react';
import { useSitePreloader } from '@/hooks/useSitePreloader';

interface SitePreloaderProps {
  isAuthenticated: boolean;
  showProgress?: boolean;
}

export const SitePreloader: React.FC<SitePreloaderProps> = ({ 
  isAuthenticated, 
  showProgress = true 
}) => {
  const { progress, isPreloading, wasRecentlyPreloaded } = useSitePreloader(isAuthenticated);

  // Don't show anything if not preloading or recently preloaded
  if (!isPreloading || wasRecentlyPreloaded) {
    return null;
  }

  if (!showProgress) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 min-w-[320px] max-w-[400px]">
      <div className="flex items-start gap-3">
        {/* Loading spinner */}
        <div className="flex-shrink-0 mt-0.5">
          <svg 
            className="animate-spin h-5 w-5 text-blue-600" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                🚀 Turbo Loading
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Making all pages instant...
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {progress.percentage}%
              </span>
            </div>
          </div>
          
          {/* Enhanced Progress bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${progress.percentage}%` }}
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600 dark:text-gray-300 truncate font-medium">
              {progress.current.replace('/', '').replace('-', ' ') || 'Starting...'}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {progress.loaded}/{progress.total}
              </span>
              {progress.percentage === 100 && (
                <span className="text-xs text-green-600 dark:text-green-400 font-semibold">
                  ✨ Complete!
                </span>
              )}
            </div>
          </div>

          {/* ETA and speed indicator */}
          {progress.loaded > 0 && progress.percentage < 100 && (
            <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500 dark:text-gray-400">
                  ⚡ Ultra-fast preloading
                </span>
                <span className="text-gray-500 dark:text-gray-400">
                  ~{Math.ceil((progress.total - progress.loaded) * 0.2)}s remaining
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SitePreloader;