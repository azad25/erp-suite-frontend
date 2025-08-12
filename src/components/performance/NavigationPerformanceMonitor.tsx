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
      
      // Performance monitoring (console logs removed for production)
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
