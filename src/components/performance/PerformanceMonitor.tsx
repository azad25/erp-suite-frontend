"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function PerformanceMonitor() {
  const pathname = usePathname();

  useEffect(() => {
    // Monitor Core Web Vitals
    if (typeof window !== 'undefined' && 'performance' in window) {
      // Measure page load time
      const startTime = performance.now();
      
      const measurePerformance = () => {
        const endTime = performance.now();
        const loadTime = endTime - startTime;
        
        // Performance monitoring (console logs removed for production)
      };

      // Use requestIdleCallback for non-blocking measurement
      if ('requestIdleCallback' in window) {
        requestIdleCallback(measurePerformance);
      } else {
        setTimeout(measurePerformance, 0);
      }
    }
  }, [pathname]);

  return null;
}