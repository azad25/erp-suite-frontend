"use client";

import { useSidebar } from "@/context/SidebarContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import React, { memo, useMemo, Suspense, lazy } from "react";

// Lazy load components for better performance
const AppHeader = lazy(() => import("@/layout/AppHeader"));
const AppSidebar = lazy(() => import("@/layout/AppSidebar"));
const Backdrop = lazy(() => import("@/layout/Backdrop"));

// Loading fallback components
const HeaderSkeleton = () => (
  <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 animate-pulse" />
);

const SidebarSkeleton = () => (
  <div className="fixed inset-y-0 left-0 z-50 w-[290px] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 animate-pulse lg:translate-x-0" />
);

function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  // Memoize the margin calculation to prevent unnecessary re-renders
  const mainContentMargin = useMemo(() => {
    if (isMobileOpen) return "ml-0";
    if (isExpanded || isHovered) return "lg:ml-[290px]";
    return "lg:ml-[90px]";
  }, [isMobileOpen, isExpanded, isHovered]);

  // Memoize the main content styles
  const mainContentStyles = useMemo(() => ({
    className: `flex-1 transition-all duration-150 ease-in-out ${mainContentMargin}`,
    style: {
      willChange: 'margin-left',
      transform: 'translateZ(0)', // Force hardware acceleration
    }
  }), [mainContentMargin]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 xl:flex">
        {/* Sidebar with Suspense for lazy loading */}
        <Suspense fallback={<SidebarSkeleton />}>
          <AppSidebar />
        </Suspense>
        
        {/* Backdrop with Suspense */}
        <Suspense fallback={null}>
          <Backdrop />
        </Suspense>
        
        {/* Main Content Area */}
        <div {...mainContentStyles}>
          {/* Header with Suspense for lazy loading */}
          <Suspense fallback={<HeaderSkeleton />}>
            <AppHeader />
          </Suspense>
          
          {/* Page Content - full width container */}
          <main className="w-full max-w-none p-4 md:p-6">
            <div style={{ contain: 'layout style paint' }}>
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// Memoize the entire layout to prevent unnecessary re-renders
export default memo(AdminLayout);
