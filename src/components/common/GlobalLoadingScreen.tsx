"use client";

import React, { useEffect } from 'react';
import { useLoading } from '@/context/LoadingContext';
import { useAppPreloader } from '@/hooks/useAppPreloader';
import LoadingLogo from './LoadingLogo';

export default function GlobalLoadingScreen() {
  const { isLoading, loadingMessage } = useLoading();
  const { progress, isComplete, startPreloading } = useAppPreloader();

  useEffect(() => {
    if (isLoading && !isComplete) {
      startPreloading();
    }
  }, [isLoading, isComplete, startPreloading]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center space-y-4">
        <LoadingLogo 
          withText={true}
          className=""
          textClassName="text-gray-900 dark:text-white"
          progress={progress.total}
          loadingText={progress.currentTask || loadingMessage || 'Loading...'}
        />
      </div>
    </div>
  );
}