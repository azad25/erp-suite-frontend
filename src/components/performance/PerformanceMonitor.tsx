"use client";

import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentName: string;
  timestamp: number;
}

// Simple performance tracking that works in both client and server environments
let performanceMetrics: PerformanceMetrics[] = [];

interface UsePerformanceMonitorOptions {
  componentName: string;
  enabled?: boolean;
  threshold?: number; // ms
}

export function usePerformanceMonitor({ 
  componentName, 
  enabled = false, // Disabled by default to prevent server-side issues
  threshold = 16 
}: UsePerformanceMonitorOptions) {
  const renderStartRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    renderStartRef.current = performance.now();
  });

  useEffect(() => {
    if (!enabled || typeof window === 'undefined' || !renderStartRef.current) return;

    const renderTime = performance.now() - renderStartRef.current;
    
    // Track the metric
    const metric: PerformanceMetrics = {
      renderTime,
      componentName,
      timestamp: Date.now(),
    };

    performanceMetrics.push(metric);
    
    // Keep only last 100 metrics to prevent memory leaks
    if (performanceMetrics.length > 100) {
      performanceMetrics = performanceMetrics.slice(-100);
    }

    // Log slow renders in development
    if (process.env.NODE_ENV === 'development' && renderTime > threshold) {
      console.warn(`Component ${componentName} render time: ${renderTime.toFixed(2)}ms`);
    }
  });

  return {
    getMetrics: () => performanceMetrics,
    getAverageRenderTime: () => {
      const componentMetrics = performanceMetrics.filter(m => m.componentName === componentName);
      if (componentMetrics.length === 0) return 0;
      const total = componentMetrics.reduce((sum, m) => sum + m.renderTime, 0);
      return total / componentMetrics.length;
    },
  };
}

// HOC for automatic performance monitoring
export function withPerformanceMonitor<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName?: string
) {
  const MonitoredComponent = (props: P) => {
    const name = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Unknown';
    usePerformanceMonitor({ componentName: name, enabled: process.env.NODE_ENV === 'development' });
    
    return <WrappedComponent {...props} />;
  };

  MonitoredComponent.displayName = `withPerformanceMonitor(${componentName || WrappedComponent.displayName || WrappedComponent.name})`;
  
  return MonitoredComponent;
}

// Performance metrics display component (for development)
export function PerformanceMetricsDisplay() {
  if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') {
    return null;
  }

  const slowRenders = performanceMetrics.filter(m => m.renderTime > 16);
  const avgRenderTime = performanceMetrics.length > 0 
    ? performanceMetrics.reduce((sum, m) => sum + m.renderTime, 0) / performanceMetrics.length 
    : 0;

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Performance Metrics</h3>
      <div className="space-y-1">
        <div>Total renders: {performanceMetrics.length}</div>
        <div>Slow renders (&gt;16ms): {slowRenders.length}</div>
        <div>Avg render time: {avgRenderTime.toFixed(2)}ms</div>
      </div>
      {slowRenders.length > 0 && (
        <div className="mt-2">
          <div className="font-semibold">Recent slow renders:</div>
          {slowRenders.slice(-3).map((metric, i) => (
            <div key={i} className="text-yellow-300">
              {metric.componentName}: {metric.renderTime.toFixed(2)}ms
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default usePerformanceMonitor;