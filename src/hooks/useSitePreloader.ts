"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

// All routes in your application
const ALL_ROUTES = [
  // Main routes
  '/',
  '/dashboard',
  
  // Sales & Commerce
  '/sales',
  '/sales/orders',
  '/sales/customers',
  '/sales/products',
  '/sales/analytics',
  
  // Purchases
  '/purchases',
  '/purchases/orders',
  '/purchases/suppliers',
  '/purchases/analytics',
  
  // Inventory
  '/inventory',
  '/inventory/products',
  '/inventory/categories',
  '/inventory/stock',
  '/inventory/movements',
  
  // Projects
  '/projects',
  '/projects/tasks',
  '/projects/teams',
  '/projects/analytics',
  
  // HRM
  '/hrm',
  '/hrm/employees',
  '/hrm/departments',
  '/hrm/payroll',
  '/hrm/attendance',
  
  // Finance
  '/finance',
  '/finance/accounts',
  '/finance/transactions',
  '/finance/reports',
  '/finance/budgets',
  
  // CRM
  '/crm',
  '/crm/contacts',
  '/crm/leads',
  '/crm/opportunities',
  '/crm/campaigns',
  
  // AI
  '/ai',
  '/ai/analytics',
  '/ai/insights',
  '/ai/automation',
  
  // Reports
  '/reports',
  '/reports/sales',
  '/reports/financial',
  '/reports/inventory',
  '/reports/hr',
  
  // Communication
  '/inbox',
  '/inbox/messages',
  '/inbox/notifications',
  '/inbox/discussions',
  
  // Documents
  '/documents',
  '/documents/files',
  '/documents/templates',
  '/documents/shared',
  
  // Personal
  '/personal',
  '/personal/tasks',
  '/personal/calendar',
  '/personal/notes',
  
  // User Management
  '/users',
  '/users/activity',
  '/users/roles',
  '/users/organizations',
  
  // Settings
  '/settings',
  '/settings/general',
  '/settings/security',
  '/settings/integrations',
  '/settings/system',
  '/settings/data',
  
  // Profile
  '/profile',
  
  // Calendar
  '/calendar',
  
  // Forms & Tables
  '/form-elements',
  '/basic-tables',
  
  // Charts
  '/line-chart',
  '/bar-chart',
  
  // UI Components
  '/alerts',
  '/avatars',
  '/badge',
  '/buttons',
  '/images',
  '/videos',
  '/modals',
  
  // Other
  '/blank',
  '/subscriptions',
  '/test-api',
  '/config-example',
];

interface PreloadProgress {
  total: number;
  loaded: number;
  current: string;
  percentage: number;
  isComplete: boolean;
}

export const useSitePreloader = (isAuthenticated: boolean) => {
  const router = useRouter();
  const [progress, setProgress] = useState<PreloadProgress>({
    total: ALL_ROUTES.length,
    loaded: 0,
    current: '',
    percentage: 0,
    isComplete: false,
  });
  const [isPreloading, setIsPreloading] = useState(false);

  const preloadRoute = useCallback(async (route: string): Promise<boolean> => {
    try {
      // Use router.prefetch for Next.js route preloading
      await router.prefetch(route);
      
      // Also preload the actual page content
      await fetch(route, { 
        method: 'HEAD',
        credentials: 'include',
      });
      
      return true;
    } catch (error) {
      // Failed to preload route - silently handle
      return false;
    }
  }, [router]);

  const preloadAllRoutes = useCallback(async () => {
    if (!isAuthenticated || isPreloading) return;

    // Starting site preload (console logs removed for production)
    setIsPreloading(true);
    
    const startTime = performance.now();
    let loadedCount = 0;

    // Preload routes in batches for better performance
    const BATCH_SIZE = 5;
    const batches = [];
    
    for (let i = 0; i < ALL_ROUTES.length; i += BATCH_SIZE) {
      batches.push(ALL_ROUTES.slice(i, i + BATCH_SIZE));
    }

    for (const batch of batches) {
      const batchPromises = batch.map(async (route) => {
        setProgress(prev => ({
          ...prev,
          current: route,
          percentage: Math.round((loadedCount / ALL_ROUTES.length) * 100),
        }));

        const success = await preloadRoute(route);
        if (success) {
          loadedCount++;
          setProgress(prev => ({
            ...prev,
            loaded: loadedCount,
            percentage: Math.round((loadedCount / ALL_ROUTES.length) * 100),
          }));
        }
        return success;
      });

      // Wait for current batch to complete before starting next
      await Promise.allSettled(batchPromises);
      
      // Small delay between batches to prevent overwhelming the browser
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const endTime = performance.now();
    const totalTime = Math.round(endTime - startTime);

    setProgress(prev => ({
      ...prev,
      isComplete: true,
      current: 'Complete',
      percentage: 100,
    }));

    setIsPreloading(false);
    
    // Site preload complete (console logs removed for production)

    // Store preload completion in localStorage
    localStorage.setItem('site_preloaded', Date.now().toString());
  }, [isAuthenticated, isPreloading, preloadRoute]);

  // Check if site was recently preloaded (within last hour)
  const wasRecentlyPreloaded = useCallback(() => {
    // const lastPreload = localStorage.getItem('site_preloaded');
    // if (!lastPreload) return false;
    
    // const oneHour = 60 * 60 * 1000;
    // return (Date.now() - parseInt(lastPreload)) < oneHour;
    return true
  }, []);

  // Start preloading when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && !wasRecentlyPreloaded()) {
      // Use requestIdleCallback to preload during idle time
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
          preloadAllRoutes();
        }, { timeout: 5000 });
      } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(preloadAllRoutes, 2000);
      }
    }
  }, [isAuthenticated, preloadAllRoutes, wasRecentlyPreloaded]);

  return {
    progress,
    isPreloading,
    preloadAllRoutes,
    wasRecentlyPreloaded: wasRecentlyPreloaded(),
  };
};