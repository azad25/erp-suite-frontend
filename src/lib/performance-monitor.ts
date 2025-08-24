// Performance monitoring for auth operations
interface PerformanceMetric {
  operation: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();
  private static instance: PerformanceMonitor;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTiming(operation: string): void {
    this.metrics.set(operation, {
      operation,
      startTime: performance.now(),
    });
  }

  endTiming(operation: string): number | null {
    const metric = this.metrics.get(operation);
    if (!metric) return null;

    const endTime = performance.now();
    const duration = endTime - metric.startTime;

    metric.endTime = endTime;
    metric.duration = duration;

    // Log slow operations in development
    if (process.env.NODE_ENV === 'development' && duration > 1000) {
      console.warn(`Slow operation detected: ${operation} took ${duration.toFixed(2)}ms`);
    }

    return duration;
  }

  getMetric(operation: string): PerformanceMetric | undefined {
    return this.metrics.get(operation);
  }

  getAllMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values()).filter(m => m.duration !== undefined);
  }

  clearMetrics(): void {
    this.metrics.clear();
  }

  // Helper methods for common operations
  startLogin(): void {
    this.startTiming('login');
  }

  endLogin(): number | null {
    return this.endTiming('login');
  }

  startTokenValidation(): void {
    this.startTiming('token_validation');
  }

  endTokenValidation(): number | null {
    return this.endTiming('token_validation');
  }

  startPageLoad(pageName: string): void {
    this.startTiming(`page_load_${pageName}`);
  }

  endPageLoad(pageName: string): number | null {
    return this.endTiming(`page_load_${pageName}`);
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

// Export helper functions for easier use
export const {
  startLogin,
  endLogin,
  startTokenValidation,
  endTokenValidation,
  startPageLoad,
  endPageLoad,
} = performanceMonitor;