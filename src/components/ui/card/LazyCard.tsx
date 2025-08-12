"use client";

import React, { lazy, Suspense } from "react";
import { LazyComponentLoader } from "@/components/performance/LazyComponentLoader";

// Lazy load the card components
const Card = lazy(() => import("./Card").then(mod => ({ default: mod.Card })));
const CardHeader = lazy(() => import("./Card").then(mod => ({ default: mod.CardHeader })));
const CardTitle = lazy(() => import("./Card").then(mod => ({ default: mod.CardTitle })));
const CardContent = lazy(() => import("./Card").then(mod => ({ default: mod.CardContent })));

// Card skeleton for loading state
const CardSkeleton = ({ height = "h-32" }: { height?: string }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${height}`}>
    <div className="p-4">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
    </div>
  </div>
);

// Lazy Card with intersection observer
interface LazyCardProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
}

export const LazyCard: React.FC<LazyCardProps> = ({ 
  children, 
  className = "",
  threshold = 0.1,
  rootMargin = "50px"
}) => {
  return (
    <LazyComponentLoader 
      threshold={threshold}
      rootMargin={rootMargin}
      fallback={<CardSkeleton />}
    >
      <Card className={className}>
        {children}
      </Card>
    </LazyComponentLoader>
  );
};

// Lazy Card Header
interface LazyCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const LazyCardHeader: React.FC<LazyCardHeaderProps> = ({ children, className = "" }) => {
  return (
    <Suspense fallback={<div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-t-lg animate-pulse" />}>
      <CardHeader className={className}>
        {children}
      </CardHeader>
    </Suspense>
  );
};

// Lazy Card Title
interface LazyCardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const LazyCardTitle: React.FC<LazyCardTitleProps> = ({ children, className = "" }) => {
  return (
    <Suspense fallback={<div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />}>
      <CardTitle className={className}>
        {children}
      </CardTitle>
    </Suspense>
  );
};

// Lazy Card Content
interface LazyCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const LazyCardContent: React.FC<LazyCardContentProps> = ({ children, className = "" }) => {
  return (
    <Suspense fallback={<div className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />}>
      <CardContent className={className}>
        {children}
      </CardContent>
    </Suspense>
  );
};

// Export all components
export { CardSkeleton };