"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function PerformanceMonitor() {
  const pathname = usePathname();

  useEffect(() => {
    // Monitor navigation performance
    const startTime = performance.now();

    const measurePerformance = () => {
      const endTime = performance.now();
      const navigationTime = endTime - startTime;

      // Log performance metrics
      if (process.env.NODE_ENV === 'development') {
        console.log(`Navigation to ${pathname}: ${navigationTime.toFixed(2)}ms`);
        
        // Log slow navigations
        if (navigationTime > 1000) {
          console.warn(`⚠️ Slow navigation detected: ${navigationTime.toFixed(2)}ms`);
        }
      }

      // Measure Core Web Vitals
      if ('web-vital' in window) {
        // This would integrate with a real performance monitoring service
        // like Google Analytics, DataDog, or New Relic
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      requestAnimationFrame(measurePerformance);
    });

    // Prefetch likely next pages
    const prefetchCommonRoutes = () => {
      const commonRoutes = [
        '/',
        '/profile',
        '/calendar',
        '/form-elements',
        '/basic-tables',
        '/line-chart',
        '/bar-chart',
      ];

      commonRoutes.forEach(route => {
        if (route !== pathname && typeof window !== 'undefined') {
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
    const prefetchTimer = setTimeout(prefetchCommonRoutes, 2000);

    return () => {
      clearTimeout(prefetchTimer);
    };
  }, [pathname]);

  // Preload critical resources on mount
  useEffect(() => {
    // Preload critical CSS for faster subsequent page loads
    const preloadCSS = () => {
      const criticalCSS = [
        '/_next/static/css/app/layout.css',
        '/_next/static/css/app/(admin)/layout.css',
      ];

      criticalCSS.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
      });
    };

    // Use requestIdleCallback to avoid blocking main thread
    if ('requestIdleCallback' in window) {
      requestIdleCallback(preloadCSS);
    } else {
      setTimeout(preloadCSS, 100);
    }
  }, []);

  return null; // This component doesn't render anything
}