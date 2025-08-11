"use client";

import { useEffect } from 'react';
import { useLoading } from '@/context/LoadingContext';

interface UsePageLoadingOptions {
  loadingMessage?: string;
  autoHide?: boolean;
  delay?: number;
}

export function usePageLoading(
  isPageLoading: boolean, 
  options: UsePageLoadingOptions = {}
) {
  const { showLoading, hideLoading } = useLoading();
  const { loadingMessage = 'Loading...', autoHide = true, delay = 0 } = options;

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isPageLoading) {
      if (delay > 0) {
        timeoutId = setTimeout(() => {
          showLoading(loadingMessage);
        }, delay);
      } else {
        showLoading(loadingMessage);
      }
    } else if (autoHide) {
      hideLoading();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (autoHide) {
        hideLoading();
      }
    };
  }, [isPageLoading, loadingMessage, autoHide, delay, showLoading, hideLoading]);
}

// Hook for API loading states
export function useApiLoading() {
  const { showLoading, hideLoading, setLoading } = useLoading();

  const withLoading = async <T>(
    asyncOperation: () => Promise<T>,
    loadingMessage?: string
  ): Promise<T> => {
    try {
      showLoading(loadingMessage || 'Processing...');
      const result = await asyncOperation();
      return result;
    } finally {
      hideLoading();
    }
  };

  return {
    showLoading,
    hideLoading,
    setLoading,
    withLoading,
  };
}