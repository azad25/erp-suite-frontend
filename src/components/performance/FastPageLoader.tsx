"use client";

import React, { Suspense, lazy, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

// Minimal loading skeleton
const PageSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
      ))}
    </div>
  </div>
);

// Component skeleton for individual components
const ComponentSkeleton = ({ height = "h-32" }: { height?: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${height}`}></div>
);

// Dynamic page component map
const pageComponents = new Map();

// Register page components lazily
const registerPageComponent = (path: string, importFn: () => Promise<any>) => {
  if (!pageComponents.has(path)) {
    pageComponents.set(path, lazy(importFn));
  }
  return pageComponents.get(path);
};

// Fast page loader with route-based splitting
export function FastPageLoader({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false); // Start with false for instant loading

  useEffect(() => {
    // Only show loading for actual navigation changes
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800); // Increased delay for better UX
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <Suspense fallback={<PageSkeleton />}>
      {children}
    </Suspense>
  );
}

// Lazy component wrapper with intersection observer
export function LazyComponent({ 
  children, 
  fallback = <ComponentSkeleton />,
  threshold = 0.1 
}: { 
  children: React.ReactNode;
  fallback?: React.ReactNode;
  threshold?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(ref);
        }
      },
      { threshold, rootMargin: '50px' }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return (
    <div ref={setRef}>
      {isVisible ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}

// Preload components on hover
export function PreloadOnHover({ 
  children, 
  preloadFn 
}: { 
  children: React.ReactNode;
  preloadFn: () => Promise<any>;
}) {
  const handleMouseEnter = () => {
    preloadFn().catch(() => {
      // Silently handle preload failures
    });
  };

  return (
    <div onMouseEnter={handleMouseEnter}>
      {children}
    </div>
  );
}

// Export utilities for page registration
export { registerPageComponent, ComponentSkeleton, PageSkeleton };