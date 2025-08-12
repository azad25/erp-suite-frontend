"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Performance thresholds
const PERFORMANCE_THRESHOLDS = {
  GOOD: 500,
  NEEDS_IMPROVEMENT: 1000,
  POOR: 2000,
} as const;

// Route priority for prefetching
const ROUTE_PRIORITIES = {
  HIGH: [
    '/',
    '/users',
    '/profile',
  ],
  MEDIUM: [
    '/calendar',
    '/form-elements',
    '/basic-tables',
  ],
  LOW: [
    '/line-chart',
    '/bar-chart',
    '/alerts',
    '/avatars',
    '/badge',
    '/buttons',
    '/images',
    '/videos',
    '/modals',
  ],
} as const;

export default function PerformanceMonitor() {
  const pathname = usePathname();
  const navigationStartTime = useRef<number>(0);
  const prefetchedRoutes = useRef<Set<string>>(new Set());

  useEffect(() => {
    navigationStartTime.current = performance.now();

    const measurePerformance = () => {
      const endTime = performance.now();
      const navigationTime = endTime - navigationStartTime.current;

      // Log performance metrics
      if (process.env.NODE_ENV === 'development') {
        const status = 
          navigationTime <= PERFORMANCE_THRESHOLDS.GOOD ? '🟢 GOOD' :
          navigationTime <= PERFORMANCE_THRESHOLDS.NEEDS_IMPROVEMENT ? '🟡 NEEDS IMPROVEMENT' :
          '🔴 POOR';
        
        // Navigation performance monitoring (console logs removed for production)
      }

      // Send metrics to analytics in production
      if (typeof window !== 'undefined' && 'gtag' in window) {
        // @ts-ignore
        window.gtag('event', 'page_navigation', {
          custom_map: { metric1: 'navigation_time' },
          metric1: Math.round(navigationTime),
          page_path: pathname,
        });
      }
    };

    // Measure when page is interactive
    if (document.readyState === 'complete') {
      measurePerformance();
    } else {
      const handleLoad = () => {
        measurePerformance();
        window.removeEventListener('load', handleLoad);
      };
      window.addEventListener('load', handleLoad);
    }

    // Intelligent prefetching based on current route
    const intelligentPrefetch = () => {
      const currentRouteType = getCurrentRouteType(pathname);
      const routesToPrefetch = getRoutesToPrefetch(pathname, currentRouteType);

      routesToPrefetch.forEach((route, index) => {
        if (!prefetchedRoutes.current.has(route)) {
          // Stagger prefetching to avoid overwhelming the browser
          const delay = index * 100;
          
          setTimeout(() => {
            if ('requestIdleCallback' in window) {
              requestIdleCallback(() => {
                prefetchRoute(route);
                prefetchedRoutes.current.add(route);
              });
            } else {
              setTimeout(() => {
                prefetchRoute(route);
                prefetchedRoutes.current.add(route);
              }, 50);
            }
          }, delay);
        }
      });
    };

    // Start prefetching after initial page load
    const prefetchTimer = setTimeout(intelligentPrefetch, 500);

    return () => {
      clearTimeout(prefetchTimer);
    };
  }, [pathname]);

  // Preload critical resources on mount
  useEffect(() => {
    const preloadCriticalResources = () => {
      // Only preload resources that are actually used
      // Removed config API call to prevent 502 errors
      
      // Preload critical images that exist
      const criticalImages: string[] = [
        '/images/logo/logo.svg',
        '/images/logo/logo-dark.svg',
      ];
      
      // Only preload images that actually exist
      criticalImages.forEach(src => {
        // Check if image exists before preloading
        const img = new Image();
        img.onload = () => preloadResource(src, 'image');
        img.onerror = () => {}; // Image not found - silently handle
        img.src = src;
      });
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadCriticalResources);
    } else {
      setTimeout(preloadCriticalResources, 100);
    }
  }, []);

  return null;
}

// Helper functions
function getCurrentRouteType(pathname: string): 'dashboard' | 'users' | 'ui' | 'forms' | 'charts' | 'other' {
  if (pathname === '/') return 'dashboard';
  if (pathname.startsWith('/users')) return 'users';
  if (pathname.includes('form')) return 'forms';
  if (pathname.includes('chart')) return 'charts';
  if (pathname.includes('alert') || pathname.includes('avatar') || pathname.includes('badge') || 
      pathname.includes('button') || pathname.includes('image') || pathname.includes('video') || 
      pathname.includes('modal')) return 'ui';
  return 'other';
}

function getRoutesToPrefetch(currentPath: string, routeType: string): string[] {
  const routes: string[] = [];
  
  // Always prefetch high priority routes
  routes.push(...ROUTE_PRIORITIES.HIGH.filter(route => route !== currentPath));
  
  // Add context-specific routes
  switch (routeType) {
    case 'dashboard':
      routes.push('/users', '/calendar', '/form-elements');
      break;
    case 'users':
      routes.push('/users/roles', '/users/activity', '/profile');
      break;
    case 'forms':
      routes.push('/basic-tables', '/calendar');
      break;
    case 'charts':
      routes.push('/basic-tables', '/form-elements');
      break;
    case 'ui':
      routes.push(...ROUTE_PRIORITIES.MEDIUM);
      break;
  }
  
  // Add medium priority routes if we have capacity
  routes.push(...ROUTE_PRIORITIES.MEDIUM.filter(route => 
    route !== currentPath && !routes.includes(route)
  ).slice(0, 3));
  
  return routes.slice(0, 8); // Limit to 8 routes to avoid overwhelming
}

function prefetchRoute(href: string): void {
  try {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    link.as = 'document';
    document.head.appendChild(link);
  } catch (error) {
    // Failed to prefetch route - silently handle
  }
}

function preloadResource(href: string, as: string): void {
  try {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (as === 'font') {
      link.crossOrigin = 'anonymous';
    }
    if (as === 'fetch') {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  } catch (error) {
    // Failed to preload resource - silently handle
  }
}