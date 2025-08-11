"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

// All ERP routes that need preloading
const ERP_ROUTES = [
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
  '/profile'
];

// Critical API endpoints to preload
const API_ENDPOINTS = [
  '/api/config',
  '/api/auth/me',
  '/api/users',
  '/api/dashboard/stats'
];

interface PreloadProgress {
  routes: number;
  apis: number;
  components: number;
  total: number;
  currentTask: string;
}

export function useAppPreloader() {
  const router = useRouter();
  const [progress, setProgress] = useState<PreloadProgress>({
    routes: 0,
    apis: 0,
    components: 0,
    total: 0,
    currentTask: 'Initializing...'
  });
  const [isComplete, setIsComplete] = useState(false);

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
      fetch(endpoint, { 
        method: 'GET',
        headers: { 'Cache-Control': 'max-age=300' }
      })
        .then(() => {
          const apiProgress = ((index + 1) / API_ENDPOINTS.length) * 100;
          updateProgress({ apis: apiProgress });
        })
        .catch(() => {
          // Ignore errors, just update progress
          const apiProgress = ((index + 1) / API_ENDPOINTS.length) * 100;
          updateProgress({ apis: apiProgress });
        })
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
      task()
        .then(() => {
          const componentProgress = ((index + 1) / componentTasks.length) * 100;
          updateProgress({ components: componentProgress });
        })
        .catch(() => {
          const componentProgress = ((index + 1) / componentTasks.length) * 100;
          updateProgress({ components: componentProgress });
        })
    );

    await Promise.all(componentPromises);
  }, [updateProgress]);

  const startPreloading = useCallback(async () => {
    try {
      setIsComplete(false);
      
      // Run preloading tasks in parallel for maximum speed
      await Promise.all([
        preloadRoutes(),
        preloadAPIs(),
        preloadComponents()
      ]);

      updateProgress({ 
        currentTask: 'Ready!', 
        total: 100 
      });
      
      // Small delay to show completion
      setTimeout(() => {
        setIsComplete(true);
      }, 300);
      
    } catch (error) {
      console.error('Preloading failed:', error);
      setIsComplete(true); // Continue anyway
    }
  }, [preloadRoutes, preloadAPIs, preloadComponents, updateProgress]);

  return {
    progress,
    isComplete,
    startPreloading
  };
}