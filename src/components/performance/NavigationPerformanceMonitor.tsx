"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function NavigationPerformanceMonitor() {
  const pathname = usePathname();

  useEffect(() => {
    // Measure navigation performance
    const startTime = performance.now();
    
    const measureNavigation = () => {
      const endTime = performance.now();
      const navigationTime = endTime - startTime;
      
      // Log slow navigations (>2 seconds)
      if (navigationTime > 2000) {
        console.warn('🐌 Slow navigation to ' + pathname + ': ' + navigationTime.toFixed(2) + 'ms');
      } else {
        console.log('⚡ Navigation to ' + pathname + ': ' + navigationTime.toFixed(2) + 'ms');
      }
    };

    // Use requestIdleCallback for non-blocking measurement
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      requestIdleCallback(measureNavigation);
    } else {
      setTimeout(measureNavigation, 0);
    }
  }, [pathname]);

  return null;
}
