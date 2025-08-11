"use client";

import { lazy, Suspense, ComponentType, ReactNode } from 'react';
import { useInView } from '@/hooks/useInView';

interface LazyComponentLoaderProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
}

// Default loading fallback
const DefaultFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

// Lazy load component only when it comes into view
export function LazyComponentLoader({ 
  children, 
  fallback = <DefaultFallback />,
  threshold = 0.1,
  rootMargin = '50px'
}: LazyComponentLoaderProps) {
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce: true
  });

  return (
    <div ref={ref}>
      {inView ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        <div className="h-32 flex items-center justify-center">
          <div className="text-gray-400 text-sm">Loading...</div>
        </div>
      )}
    </div>
  );
}

// HOC for lazy loading components
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  fallback?: ReactNode
) {
  const LazyComponent = lazy(() => Promise.resolve({ default: Component }));
  
  return function LazyLoadedComponent(props: P) {
    return (
      <Suspense fallback={fallback || <DefaultFallback />}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// Utility for creating lazy-loaded components with intersection observer
export function createLazyComponent<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  fallback?: ReactNode
) {
  const LazyComponent = lazy(importFn);
  
  return function LazyLoadedComponent(props: P) {
    return (
      <LazyComponentLoader fallback={fallback}>
        <LazyComponent {...props} />
      </LazyComponentLoader>
    );
  };
}