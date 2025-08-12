"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface PerformanceMetrics {
  route: string;
  navigationTime: number;
  renderTime: number;
  totalTime: number;
  timestamp: number;
}

export const ProductionPerformanceMonitor: React.FC = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== 'production') return;

    let navigationStart = performance.now();
    let renderStart = performance.now();

    // Measure navigation start
    const measureNavigation = () => {
      const navigationEnd = performance.now();
      const navigationTime = navigationEnd - navigationStart;

      // Measure render complete
      const measureRender = () => {
        const renderEnd = performance.now();
        const renderTime = renderEnd - renderStart;
        const totalTime = renderEnd - navigationStart;

        const metrics: PerformanceMetrics = {
          route: pathname,
          navigationTime: Math.round(navigationTime),
          renderTime: Math.round(renderTime),
          totalTime: Math.round(totalTime),
          timestamp: Date.now(),
        };

        // Store metrics for analytics
        storePerformanceMetrics(metrics);

        // Performance monitoring (console logs removed for production)
      };

      // Use requestIdleCallback for non-blocking measurement
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        window.requestIdleCallback(measureRender);
      } else {
        setTimeout(measureRender, 0);
      }
    };

    // Measure when navigation completes
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(measureNavigation);
    } else {
      setTimeout(measureNavigation, 0);
    }

    // Reset timers for next navigation
    return () => {
      navigationStart = performance.now();
      renderStart = performance.now();
    };
  }, [pathname]);

  return null;
};

// Store performance metrics for analytics
function storePerformanceMetrics(metrics: PerformanceMetrics) {
  try {
    // Store in localStorage for now (could be sent to analytics service)
    const existingMetrics = JSON.parse(localStorage.getItem('performance_metrics') || '[]');
    existingMetrics.push(metrics);

    // Keep only last 100 metrics to prevent storage bloat
    if (existingMetrics.length > 100) {
      existingMetrics.splice(0, existingMetrics.length - 100);
    }

    localStorage.setItem('performance_metrics', JSON.stringify(existingMetrics));

    // Calculate averages for reporting
    const routeMetrics = existingMetrics.filter((m: PerformanceMetrics) => m.route === metrics.route);
    if (routeMetrics.length >= 5) {
      const avgTime = routeMetrics.reduce((sum: number, m: PerformanceMetrics) => sum + m.totalTime, 0) / routeMetrics.length;
      
      // Performance tracking (console logs removed for production)
    }
  } catch (error) {
    // Ignore storage errors
  }
}

export default ProductionPerformanceMonitor;