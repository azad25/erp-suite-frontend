"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useNavigationPerformance() {
  const pathname = usePathname();

  useEffect(() => {
    // Prefetch likely next routes based on current page
    const prefetchRoutes = () => {
      const commonRoutes = [
        '/',
        '/profile',
        '/calendar',
        '/form-elements',
        '/basic-tables',
      ];

      // Prefetch routes that user is likely to visit
      commonRoutes.forEach(route => {
        if (route !== pathname) {
          // Use requestIdleCallback for non-blocking prefetch
          if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
              const link = document.createElement('link');
              link.rel = 'prefetch';
              link.href = route;
              document.head.appendChild(link);
            });
          }
        }
      });
    };

    // Delay prefetching to not interfere with current page load
    const timer = setTimeout(prefetchRoutes, 1000);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Preload critical resources
  useEffect(() => {
    // Preload fonts
    const preloadFont = (href: string) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      link.href = href;
      document.head.appendChild(link);
    };

    // Add any critical fonts here
    // preloadFont('/fonts/inter-var.woff2');
  }, []);
}

// Hook to measure and log navigation performance
export function useNavigationMetrics() {
  const pathname = usePathname();

  useEffect(() => {
    const startTime = performance.now();

    const measureNavigation = () => {
      const endTime = performance.now();
      const navigationTime = endTime - startTime;

      // Log slow navigations for debugging
      if (navigationTime > 1000) {
        console.warn(`Slow navigation to ${pathname}: ${navigationTime.toFixed(2)}ms`);
      }

      // Send metrics to analytics (if needed)
      // analytics.track('page_navigation', {
      //   path: pathname,
      //   duration: navigationTime,
      // });
    };

    // Measure when page is fully loaded
    if (document.readyState === 'complete') {
      measureNavigation();
    } else {
      window.addEventListener('load', measureNavigation);
      return () => window.removeEventListener('load', measureNavigation);
    }
  }, [pathname]);
}