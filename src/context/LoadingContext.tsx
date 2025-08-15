"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  loadingMessage?: string;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
  setLoading: (loading: boolean, message?: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>();
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showLoading = useCallback((message?: string) => {
    // Clear any pending hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    // Clear any existing loading timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }

    // Show loading immediately for fast operations
    setLoadingMessage(message);
    setIsLoading(true);

    // Auto-hide after 5 seconds to prevent stuck loading states
    loadingTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      setLoadingMessage(undefined);
      loadingTimeoutRef.current = null;
    }, 5000);
  }, []);

  const hideLoading = useCallback(() => {
    // Clear loading timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }

    // Add small delay to prevent flashing for very fast operations
    hideTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
      setLoadingMessage(undefined);
      hideTimeoutRef.current = null;
    }, 100);
  }, []);

  const setLoading = useCallback((loading: boolean, message?: string) => {
    // Clear all timeouts
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
      loadingTimeoutRef.current = null;
    }
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    setIsLoading(loading);
    setLoadingMessage(loading ? message : undefined);
  }, []);

  const value = {
    isLoading,
    loadingMessage,
    showLoading,
    hideLoading,
    setLoading,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}