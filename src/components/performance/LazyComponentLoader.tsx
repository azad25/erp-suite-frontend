"use client";

import React, { Suspense, lazy, ComponentType } from 'react';

interface LazyComponentLoaderProps {
  loader: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  children?: React.ReactNode;
}

// Optimized skeleton components
const DefaultSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
  </div>
);

const CardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 animate-pulse">
    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
    <div className="space-y-2">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
    </div>
  </div>
);

const TableSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden animate-pulse">
    <div className="h-12 bg-gray-200 dark:bg-gray-700"></div>
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-16 border-t border-gray-200 dark:border-gray-700 flex items-center px-6">
        <div className="flex space-x-4 w-full">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
        </div>
      </div>
    ))}
  </div>
);

// Pre-defined skeleton types
export const SkeletonTypes = {
  default: DefaultSkeleton,
  card: CardSkeleton,
  table: TableSkeleton,
} as const;

export type SkeletonType = keyof typeof SkeletonTypes;

// High-performance lazy component loader
export const LazyComponentLoader: React.FC<LazyComponentLoaderProps> = ({
  loader,
  fallback = <DefaultSkeleton />,
  children,
}) => {
  const LazyComponent = lazy(loader);

  return (
    <Suspense fallback={fallback}>
      <LazyComponent>{children}</LazyComponent>
    </Suspense>
  );
};

// Hook for creating optimized lazy components
export const useLazyComponent = (
  loader: () => Promise<{ default: ComponentType<any> }>,
  skeletonType: SkeletonType = 'default'
) => {
  const LazyComponent = lazy(loader);
  const SkeletonComponent = SkeletonTypes[skeletonType];

  return {
    Component: LazyComponent,
    Skeleton: SkeletonComponent,
    render: (props?: any) => (
      <Suspense fallback={<SkeletonComponent />}>
        <LazyComponent {...props} />
      </Suspense>
    ),
  };
};

export default LazyComponentLoader;