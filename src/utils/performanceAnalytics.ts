// Performance Analytics Utility for Production Monitoring
export interface PerformanceMetrics {
  route: string;
  navigationTime: number;
  renderTime: number;
  totalTime: number;
  timestamp: number;
  userAgent?: string;
  connectionType?: string;
}

export interface PerformanceReport {
  totalRoutes: number;
  averageLoadTime: number;
  fastestRoute: { route: string; time: number };
  slowestRoute: { route: string; time: number };
  routePerformance: Record<string, {
    averageTime: number;
    samples: number;
    fastest: number;
    slowest: number;
  }>;
  performanceGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  recommendations: string[];
}

class PerformanceAnalytics {
  private static instance: PerformanceAnalytics;
  private metrics: PerformanceMetrics[] = [];

  static getInstance(): PerformanceAnalytics {
    if (!PerformanceAnalytics.instance) {
      PerformanceAnalytics.instance = new PerformanceAnalytics();
    }
    return PerformanceAnalytics.instance;
  }

  // Load existing metrics from localStorage
  loadMetrics(): void {
    try {
      const stored = localStorage.getItem('performance_metrics');
      if (stored) {
        this.metrics = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load performance metrics:', error);
      this.metrics = [];
    }
  }

  // Add a new performance metric
  addMetric(metric: PerformanceMetrics): void {
    this.metrics.push(metric);
    
    // Keep only last 500 metrics to prevent storage bloat
    if (this.metrics.length > 500) {
      this.metrics = this.metrics.slice(-500);
    }

    // Save to localStorage
    try {
      localStorage.setItem('performance_metrics', JSON.stringify(this.metrics));
    } catch (error) {
      console.warn('Failed to save performance metrics:', error);
    }
  }

  // Generate comprehensive performance report
  generateReport(): PerformanceReport {
    if (this.metrics.length === 0) {
      return {
        totalRoutes: 0,
        averageLoadTime: 0,
        fastestRoute: { route: 'N/A', time: 0 },
        slowestRoute: { route: 'N/A', time: 0 },
        routePerformance: {},
        performanceGrade: 'F',
        recommendations: ['No performance data available. Navigate through the app to collect metrics.']
      };
    }

    // Calculate overall metrics
    const totalTime = this.metrics.reduce((sum, m) => sum + m.totalTime, 0);
    const averageLoadTime = totalTime / this.metrics.length;

    // Find fastest and slowest routes
    const sortedByTime = [...this.metrics].sort((a, b) => a.totalTime - b.totalTime);
    const fastestRoute = { route: sortedByTime[0].route, time: sortedByTime[0].totalTime };
    const slowestRoute = { route: sortedByTime[sortedByTime.length - 1].route, time: sortedByTime[sortedByTime.length - 1].totalTime };

    // Calculate per-route performance
    const routeGroups = this.groupByRoute();
    const routePerformance: Record<string, any> = {};

    Object.entries(routeGroups).forEach(([route, metrics]) => {
      const times = metrics.map(m => m.totalTime);
      routePerformance[route] = {
        averageTime: times.reduce((sum, time) => sum + time, 0) / times.length,
        samples: times.length,
        fastest: Math.min(...times),
        slowest: Math.max(...times)
      };
    });

    // Calculate performance grade
    const performanceGrade = this.calculateGrade(averageLoadTime);

    // Generate recommendations
    const recommendations = this.generateRecommendations(averageLoadTime, routePerformance);

    return {
      totalRoutes: Object.keys(routeGroups).length,
      averageLoadTime: Math.round(averageLoadTime),
      fastestRoute,
      slowestRoute,
      routePerformance,
      performanceGrade,
      recommendations
    };
  }

  // Group metrics by route
  private groupByRoute(): Record<string, PerformanceMetrics[]> {
    return this.metrics.reduce((groups, metric) => {
      if (!groups[metric.route]) {
        groups[metric.route] = [];
      }
      groups[metric.route].push(metric);
      return groups;
    }, {} as Record<string, PerformanceMetrics[]>);
  }

  // Calculate performance grade based on average load time
  private calculateGrade(averageTime: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (averageTime < 100) return 'A';
    if (averageTime < 300) return 'B';
    if (averageTime < 500) return 'C';
    if (averageTime < 1000) return 'D';
    return 'F';
  }

  // Generate performance recommendations
  private generateRecommendations(averageTime: number, routePerformance: Record<string, any>): string[] {
    const recommendations: string[] = [];

    if (averageTime < 100) {
      recommendations.push('🎉 Excellent performance! Your app is blazing fast.');
    } else if (averageTime < 300) {
      recommendations.push('👍 Good performance! Consider optimizing slower routes.');
    } else if (averageTime < 500) {
      recommendations.push('⚠️ Moderate performance. Focus on code splitting and lazy loading.');
    } else {
      recommendations.push('🚨 Poor performance detected. Immediate optimization needed.');
    }

    // Find slow routes
    const slowRoutes = Object.entries(routePerformance)
      .filter(([, perf]) => perf.averageTime > 500)
      .sort(([, a], [, b]) => b.averageTime - a.averageTime)
      .slice(0, 3);

    if (slowRoutes.length > 0) {
      recommendations.push(`🐌 Slowest routes: ${slowRoutes.map(([route]) => route).join(', ')}`);
      recommendations.push('💡 Consider lazy loading heavy components on these routes.');
    }

    // Check for inconsistent performance
    const inconsistentRoutes = Object.entries(routePerformance)
      .filter(([, perf]) => (perf.slowest - perf.fastest) > 1000)
      .slice(0, 2);

    if (inconsistentRoutes.length > 0) {
      recommendations.push(`📊 Inconsistent performance on: ${inconsistentRoutes.map(([route]) => route).join(', ')}`);
      recommendations.push('🔧 Check for conditional rendering or data loading issues.');
    }

    return recommendations;
  }

  // Export metrics for external analysis
  exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2);
  }

  // Clear all metrics
  clearMetrics(): void {
    this.metrics = [];
    localStorage.removeItem('performance_metrics');
  }

  // Get recent metrics (last N entries)
  getRecentMetrics(count: number = 10): PerformanceMetrics[] {
    return this.metrics.slice(-count);
  }
}

// Console utilities for easy performance monitoring
export const performanceAnalytics = PerformanceAnalytics.getInstance();

// Global utilities for browser console
if (typeof window !== 'undefined') {
  (window as any).performanceReport = () => {
    performanceAnalytics.loadMetrics();
    const report = performanceAnalytics.generateReport();
    
    console.log('📊 ERP Performance Report');
    console.log('========================');
    console.log(`🎯 Performance Grade: ${report.performanceGrade}`);
    console.log(`⚡ Average Load Time: ${report.averageLoadTime}ms`);
    console.log(`🚀 Fastest Route: ${report.fastestRoute.route} (${report.fastestRoute.time}ms)`);
    console.log(`🐌 Slowest Route: ${report.slowestRoute.route} (${report.slowestRoute.time}ms)`);
    console.log(`📈 Total Routes Analyzed: ${report.totalRoutes}`);
    console.log('\n💡 Recommendations:');
    report.recommendations.forEach(rec => console.log(`   ${rec}`));
    console.log('\n📋 Detailed Route Performance:');
    console.table(report.routePerformance);
    
    return report;
  };

  (window as any).clearPerformanceData = () => {
    performanceAnalytics.clearMetrics();
    console.log('🗑️ Performance data cleared');
  };

  (window as any).exportPerformanceData = () => {
    performanceAnalytics.loadMetrics();
    const data = performanceAnalytics.exportMetrics();
    console.log('📤 Performance data exported:');
    console.log(data);
    return data;
  };
}

export default performanceAnalytics;