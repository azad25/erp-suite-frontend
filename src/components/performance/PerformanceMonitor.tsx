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
        
        // Log performance metrics
        console.log(`📊 Page: ${pathname}`);
        console.log(`⏱️  Load Time: ${loadTime.toFixed(2)}ms`);
        
        // Warn about slow pages
        if (loadTime > 1000) {
          console.warn(`🐌 Slow page load: ${pathname} took ${loadTime.toFixed(2)}ms`);
        } else if (loadTime < 500) {
          console.log(`⚡ Fast page load: ${pathname} took ${loadTime.toFixed(2)}ms`);
        }
        
        // Measure memory usage
        if ('memory' in performance) {
          const memory = (performance as any).memory;
          console.log(`💾 Memory: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
        }
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