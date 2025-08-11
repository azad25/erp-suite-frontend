"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

interface UseOptimizedDataOptions<T> {
  initialData?: T;
  cacheKey?: string;
  cacheDuration?: number; // in milliseconds
  enableCache?: boolean;
  onError?: (error: Error) => void;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

// In-memory cache for data
const dataCache = new Map<string, CacheEntry<any>>();

// Cache cleanup interval
let cacheCleanupInterval: NodeJS.Timeout | null = null;

const startCacheCleanup = () => {
  if (cacheCleanupInterval) return;
  
  cacheCleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of dataCache.entries()) {
      if (now > entry.expiry) {
        dataCache.delete(key);
      }
    }
  }, 60000); // Clean up every minute
};

export function useOptimizedData<T>(
  dataFetcher: () => Promise<T> | T,
  options: UseOptimizedDataOptions<T> = {}
) {
  const {
    initialData,
    cacheKey,
    cacheDuration = 300000, // 5 minutes default
    enableCache = true,
    onError,
  } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Start cache cleanup on first use
  useEffect(() => {
    if (enableCache) {
      startCacheCleanup();
    }
  }, [enableCache]);

  // Check cache for existing data
  const getCachedData = useCallback((): T | null => {
    if (!enableCache || !cacheKey) return null;
    
    const cached = dataCache.get(cacheKey);
    if (cached && Date.now() < cached.expiry) {
      return cached.data;
    }
    
    return null;
  }, [enableCache, cacheKey]);

  // Cache data
  const setCachedData = useCallback((newData: T) => {
    if (!enableCache || !cacheKey) return;
    
    dataCache.set(cacheKey, {
      data: newData,
      timestamp: Date.now(),
      expiry: Date.now() + cacheDuration,
    });
  }, [enableCache, cacheKey, cacheDuration]);

  // Optimized data fetcher
  const fetchData = useCallback(async (force = false) => {
    // Check cache first
    if (!force) {
      const cachedData = getCachedData();
      if (cachedData) {
        setData(cachedData);
        return cachedData;
      }
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const result = await dataFetcher();
      
      // Check if request was aborted
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      setData(result);
      setCachedData(result);
      return result;
    } catch (err) {
      if (abortControllerRef.current?.signal.aborted) {
        return;
      }

      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [dataFetcher, getCachedData, setCachedData, onError]);

  // Refresh data
  const refresh = useCallback(() => fetchData(true), [fetchData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Memoized return value
  const returnValue = useMemo(() => ({
    data,
    loading,
    error,
    fetchData,
    refresh,
    isStale: cacheKey ? !getCachedData() : false,
  }), [data, loading, error, fetchData, refresh, cacheKey, getCachedData]);

  return returnValue;
}

// Hook for static data that doesn't need fetching
export function useStaticData<T>(data: T) {
  return useMemo(() => ({
    data,
    loading: false,
    error: null,
    fetchData: () => Promise.resolve(data),
    refresh: () => Promise.resolve(data),
    isStale: false,
  }), [data]);
}

// Hook for optimized list rendering
export function useOptimizedList<T>(
  items: T[],
  keyExtractor: (item: T, index: number) => string | number = (_, index) => index
) {
  const memoizedItems = useMemo(() => items, [items]);
  const memoizedKeys = useMemo(
    () => memoizedItems.map(keyExtractor),
    [memoizedItems, keyExtractor]
  );

  return {
    items: memoizedItems,
    keys: memoizedKeys,
    count: memoizedItems.length,
  };
}

export default useOptimizedData;