import React, { Suspense, ReactNode } from 'react';

interface LazyComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ComponentSkeletonProps {
  height?: string;
  width?: string;
  className?: string;
}

export const LazyComponent: React.FC<LazyComponentProps> = ({ 
  children, 
  fallback = <ComponentSkeleton /> 
}) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

export const ComponentSkeleton: React.FC<ComponentSkeletonProps> = ({ 
  height = "h-20", 
  width = "w-full",
  className = ""
}) => {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md ${height} ${width} ${className}`} />
  );
};