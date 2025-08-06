"use client";

import { useEffect, useRef, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';

// Performance optimization hook
export function useNavigationPerformance() {
  const pathname = usePathname();
  const router = useRouter();
  const prefetchedRoutes = useRef<Set<string>>(new Set());
  const prefetchQueue = useRef<string[]>([]);
  const isProcessingQueue = useRef(false);

  // Optimized prefetch function with queue management
  const processPrefetchQueue = useCallback(() => {
    if (isProcessingQueue.current || prefetchQueue.current.length === 0) {
      return;
    }

    isProcessingQueue.current = true;
    
    const processNext = () => {
      if (prefetchQueue.current.length === 0) {
        isProcessingQueue.current = false;
        return;
      }

      const route = prefetchQueue.current.shift()!;
      
      if (!prefetchedRoutes.current.has(route)) {
        try {
          // Use Next.js router prefetch for better optimization
          router.prefetch(route);
          prefetchedRoutes.current.add(route);
        } catch (error) {
          console.warn('Failed to prefetch route:', route, error);
        }
      }

      // Process next route with small delay to avoid overwhelming
      setTimeout(processNext, 50);
    };

    processNext();
  }, [router]);

  // Intelligent route prefetching based on user behavior patterns
  const prefetchIntelligentRoutes = useCallback(() => {
    const routeMap: Record<string, string[]> = {
      '/': ['/users', '/profile', '/calendar', '/form-elements'],
      '/users': ['/users/roles', '/users/activity', '/users/organizations', '/profile'],
      '/users/roles': ['/users', '/users/activity', '/users/organizations'],
      '/users/activity': ['/users', '/users/roles', '/profile'],
      '/users/organizations': ['/users', '/users/roles', '/users/activity'],
      '/profile': ['/users', '/calendar', '/form-elements'],
      '/calendar': ['/profile', '/form-elements', '/basic-tables'],
      '/form-elements': ['/basic-tables', '/calendar', '/line-chart'],
      '/basic-tables': ['/form-elements', '/line-chart', '/bar-chart'],
      '/line-chart': ['/bar-chart', '/basic-tables', '/form-elements'],
      '/bar-chart': ['/line-chart', '/basic-tables', '/form-elements'],
    };

    const routesToPrefetch = routeMap[pathname] || ['/users', '/profile', '/calendar'];
    
    // Add routes to queue
    routesToPrefetch.forEach(route => {
      if (!prefetchedRoutes.current.has(route) && !prefetchQueue.current.includes(route)) {
        prefetchQueue.current.push(route);
      }
    });

    // Process the queue
    processPrefetchQueue();
  }, [pathname, processPrefetchQueue]);

  useEffect(() => {
    // Start prefetching after a short delay to not interfere with current page load
    const timer = setTimeout(prefetchIntelligentRoutes, 300);
    return () => clearTimeout(timer);
  }, [prefetchIntelligentRoutes]);

  // Preload critical resources
  useEffect(() => {
    const preloadCriticalResources = () => {
      // Only preload API config if user is authenticated to avoid unnecessary requests
      if (typeof window !== 'undefined' && localStorage.getItem('access_token')) {
        const configLink = document.createElement('link');
        configLink.rel = 'preload';
        configLink.href = '/api/config';
        configLink.as = 'fetch';
        configLink.crossOrigin = 'anonymous';
        document.head.appendChild(configLink);
      }

      // Skip health check preload as it's not critical for navigation performance
      // Health checks should be done on-demand
    };

    // Use requestIdleCallback for non-blocking preload
    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadCriticalResources, { timeout: 1000 });
    } else {
      setTimeout(preloadCriticalResources, 100);
    }
  }, []);
}

// Enhanced navigation metrics hook
export function useNavigationMetrics() {
  const pathname = usePathname();
  const navigationStartTime = useRef<number>(0);
  const performanceEntries = useRef<PerformanceEntry[]>([]);

  useEffect(() => {
    navigationStartTime.current = performance.now();

    const measureNavigation = () => {
      const endTime = performance.now();
      const navigationTime = endTime - navigationStartTime.current;

      // Collect performance entries
      const entries = performance.getEntriesByType('navigation');
      const paintEntries = performance.getEntriesByType('paint');
      
      if (process.env.NODE_ENV === 'development') {
        console.group(`🚀 Navigation Performance: ${pathname}`);
        console.log(`Total Time: ${navigationTime.toFixed(2)}ms`);
        
        // Log paint metrics
        paintEntries.forEach(entry => {
          if (entry.name === 'first-contentful-paint') {
            console.log(`First Contentful Paint: ${entry.startTime.toFixed(2)}ms`);
          }
          if (entry.name === 'largest-contentful-paint') {
            console.log(`Largest Contentful Paint: ${entry.startTime.toFixed(2)}ms`);
          }
        });

        // Log navigation timing if available
        if (entries.length > 0) {
          const navEntry = entries[0] as PerformanceNavigationTiming;
          console.log(`DNS Lookup: ${(navEntry.domainLookupEnd - navEntry.domainLookupStart).toFixed(2)}ms`);
          console.log(`TCP Connect: ${(navEntry.connectEnd - navEntry.connectStart).toFixed(2)}ms`);
          console.log(`Request: ${(navEntry.responseStart - navEntry.requestStart).toFixed(2)}ms`);
          console.log(`Response: ${(navEntry.responseEnd - navEntry.responseStart).toFixed(2)}ms`);
          console.log(`DOM Processing: ${(navEntry.domComplete - navEntry.domContentLoadedEventStart).toFixed(2)}ms`);
        }

        // Performance recommendations
        if (navigationTime > 1000) {
          console.warn('⚠️ Slow navigation detected. Consider:');
          console.log('- Reducing bundle size');
          console.log('- Implementing code splitting');
          console.log('- Optimizing API calls');
          console.log('- Adding more aggressive caching');
        }

        console.groupEnd();
      }

      // Send metrics to analytics in production
      if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
        // Send to analytics service
        try {
          // Example: Google Analytics 4
          if ('gtag' in window) {
            // @ts-ignore
            window.gtag('event', 'page_navigation_performance', {
              navigation_time: Math.round(navigationTime),
              page_path: pathname,
              custom_parameter_1: navigationTime > 1000 ? 'slow' : 'fast',
            });
          }

          // Example: Custom analytics endpoint
          fetch('/api/analytics/performance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              pathname,
              navigationTime: Math.round(navigationTime),
              timestamp: Date.now(),
              userAgent: navigator.userAgent,
            }),
          }).catch(() => {
            // Silently fail analytics
          });
        } catch (error) {
          // Silently fail analytics
        }
      }
    };

    // Measure when page is fully loaded
    if (document.readyState === 'complete') {
      measureNavigation();
    } else {
      const handleLoad = () => {
        measureNavigation();
        window.removeEventListener('load', handleLoad);
      };
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [pathname]);

  // Monitor Core Web Vitals
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observeWebVitals = () => {
      // Cumulative Layout Shift (CLS)
      if ('PerformanceObserver' in window) {
        try {
          const clsObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
                if (process.env.NODE_ENV === 'development') {
                  console.log(`Layout Shift: ${(entry as any).value.toFixed(4)}`);
                }
              }
            }
          });
          clsObserver.observe({ entryTypes: ['layout-shift'] });

          // First Input Delay (FID)
          const fidObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'first-input') {
                const fid = (entry as any).processingStart - entry.startTime;
                if (process.env.NODE_ENV === 'development') {
                  console.log(`First Input Delay: ${fid.toFixed(2)}ms`);
                }
              }
            }
          });
          fidObserver.observe({ entryTypes: ['first-input'] });

          return () => {
            clsObserver.disconnect();
            fidObserver.disconnect();
          };
        } catch (error) {
          console.warn('Performance Observer not supported:', error);
        }
      }
    };

    const cleanup = observeWebVitals();
    return cleanup;
  }, []);
}