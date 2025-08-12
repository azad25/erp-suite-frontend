"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';

// All ERP routes that need preloading
const ERP_ROUTES =
  process.env.NODE_ENV === 'production'
    ? [
        '/',
        '/dashboard',
        '/users',
        '/crm',
        '/sales',
        '/inventory',
        '/finance',
        '/projects',
        '/hrm',
        '/reports',
        '/settings',
        '/analytics',
        '/notifications',
        '/profile',
      ]
    : ['/', '/dashboard'];

// Critical API endpoints to preload
const API_ENDPOINTS =
  process.env.NODE_ENV === 'production'
    ? ['/api/config', '/api/v1/auth/me', '/api/v1/users', '/api/v1/dashboard/stats']
    : ['/api/config'];

interface PreloadProgress {
  routes: number;
  apis: number;
  components: number;
  total: number;
  currentTask: string;
}

export function useAppPreloader() {
  const router = useRouter();
  // Ensure we only run expensive preloads once per session (guards StrictMode double-invoke as well)
  const hasPreloadedRef = useRef(false);
  const [progress, setProgress] = useState<PreloadProgress>({
    routes: 0,
    apis: 0,
    components: 0,
    total: 0,
    currentTask: 'Initializing...'
  });
  const [isComplete, setIsComplete] = useState(false);

  // Schedule work for browser idle time to avoid competing with navigation/render
  const runWhenIdle = useCallback((fn: () => void) => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      // @ts-ignore - requestIdleCallback exists in modern browsers
      (window as any).requestIdleCallback(fn, { timeout: 1200 });
    } else {
      setTimeout(fn, 150);
    }
  }, []);

  const updateProgress = useCallback((update: Partial<PreloadProgress>) => {
    setProgress(prev => {
      const newProgress = { ...prev, ...update };
      const total = Math.round(
        ((newProgress.routes + newProgress.apis + newProgress.components) / 3) * 100
      );
      return { ...newProgress, total };
    });
  }, []);

  const preloadRoutes = useCallback(async () => {
    updateProgress({ currentTask: 'Preloading routes...' });
    
    const routePromises = ERP_ROUTES.map((route, index) => 
      new Promise<void>((resolve) => {
        router.prefetch(route);
        setTimeout(() => {
          const routeProgress = ((index + 1) / ERP_ROUTES.length) * 100;
          updateProgress({ routes: routeProgress });
          resolve();
        }, 50); // Small delay to show progress
      })
    );

    await Promise.all(routePromises);
  }, [router, updateProgress]);

  const preloadAPIs = useCallback(async () => {
    updateProgress({ currentTask: 'Preloading API data...' });
    
    const apiPromises = API_ENDPOINTS.map((endpoint, index) =>
      new Promise<void>((resolve) =>
        runWhenIdle(() => {
          fetch(endpoint, {
            method: 'GET',
            // Encourage caching and avoid competing with primary nav requests
            cache: 'force-cache',
            headers: { 'Cache-Control': 'max-age=300' },
            keepalive: true,
          })
            .catch(() => void 0)
            .finally(() => {
              const apiProgress = ((index + 1) / API_ENDPOINTS.length) * 100;
              updateProgress({ apis: apiProgress });
              resolve();
            });
        })
      )
    );

    await Promise.all(apiPromises);
  }, [updateProgress]);

  const preloadComponents = useCallback(async () => {
    updateProgress({ currentTask: 'Loading components...' });
    
    // Simulate component preloading with dynamic imports
    const componentTasks = [
      () => import('@/components/user-management/UserManagementDashboard'),
      () => import('@/components/common/StatsCard'),
      () => import('@/components/common/FeatureCard'),
      () => import('@/layout/AppSidebar'),
      () => import('@/layout/AppHeader'),
    ];

    const componentPromises = componentTasks.map((task, index) =>
      new Promise<void>((resolve) =>
        runWhenIdle(() => {
          task()
            .catch(() => void 0)
            .finally(() => {
              const componentProgress = ((index + 1) / componentTasks.length) * 100;
              updateProgress({ components: componentProgress });
              resolve();
            });
        })
      )
    );

    await Promise.all(componentPromises);
  }, [updateProgress]);

  const startPreloading = useCallback(async () => {
    if (hasPreloadedRef.current) return;
    hasPreloadedRef.current = true;

    try {
      setIsComplete(false);

      await new Promise<void>((resolve) =>
        runWhenIdle(async () => {
          try {
            await Promise.all([
              preloadRoutes(),
              preloadAPIs(),
              preloadComponents(),
            ]);
            updateProgress({ currentTask: '', total: 100 });
            setTimeout(() => setIsComplete(true), 300);
          } catch (error) {
            // Preloading failed - silently handle
            setIsComplete(true);
          } finally {
            resolve();
          }
        })
      );
    } catch (error) {
      // Preloading scheduler failed - silently handle
      setIsComplete(true);
    }
  }, [preloadRoutes, preloadAPIs, preloadComponents, updateProgress, runWhenIdle]);

  return {
    progress,
    isComplete,
    startPreloading
  };
}