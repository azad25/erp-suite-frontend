import { lazy, ComponentType } from 'react';

// Lazy load pages with optimized imports
export const LazyDashboard = lazy(() => 
  import('@/app/(admin)/dashboard/page').then(module => ({ default: module.default }))
);

export const LazyUsersPage = lazy(() => 
  import('@/app/(admin)/users/page').then(module => ({ default: module.default }))
);

// Lazy load major components
export const LazyUserManagementDashboard = lazy(() => 
  import('@/components/user-management/UserManagementDashboard')
);

export const LazyUserListTable = lazy(() => 
  import('@/components/user-management/UserListTable')
);

export const LazyStatsCard = lazy(() => 
  import('@/components/common/StatsCard')
);

export const LazyFeatureCard = lazy(() => 
  import('@/components/common/FeatureCard')
);

// Chart components (heavy dependencies)
export const LazyApexChart = lazy(() => 
  import('react-apexcharts').then(module => ({ default: module.default }))
);

// Calendar components
export const LazyFullCalendar = lazy(() => 
  import('@fullcalendar/react').then(module => ({ default: module.default }))
);

// Create a higher-order component for lazy loading
export function withLazyLoading<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>
) {
  return lazy(importFn);
}

// Preload critical components after initial render
export const preloadCriticalComponents = () => {
  // Preload components that are likely to be used soon
  const preloadPromises = [
    import('@/components/common/StatsCard'),
    import('@/components/common/FeatureCard'),
    import('@/components/user-management/UserListTable'),
  ];

  // Preload in the background without blocking
  Promise.all(preloadPromises).catch(() => {
    // Silently fail - preloading is optional
  });
};

// Dynamic page imports for route-based code splitting
export const dynamicPageImports = {
  dashboard: () => import('@/app/(admin)/dashboard/page'),
  users: () => import('@/app/(admin)/users/page'),
  // Add more pages as needed
} as const;

// Utility to create lazy pages with consistent loading states
export function createLazyPage(importFn: () => Promise<any>) {
  return lazy(() => importFn().then(module => ({ 
    default: module.default || module 
  })));
}