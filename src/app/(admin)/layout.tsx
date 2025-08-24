"use client";

import { useSidebar } from "@/context/SidebarContext";
import { useNavigation } from "@/context/NavigationContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppDrawerBreadcrumb from "@/components/navigation/AppDrawerBreadcrumb";
import AppDrawerOverlay from "@/components/overlay/AppDrawerOverlay";
import { NavigationProvider } from "@/context/NavigationContext";
import React, { memo, useMemo, Suspense, lazy } from "react";
// import { usePerformanceMonitor } from "@/components/performance/PerformanceMonitor";

// Lazy load components for better performance
const AppHeader = lazy(() => import("@/layout/AppHeader"));
const AppSidebar = lazy(() => import("@/layout/AppSidebar"));
const Backdrop = lazy(() => import("@/layout/Backdrop"));

// Loading fallback components
const HeaderSkeleton = () => (
  <div className="h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 animate-pulse" />
);

const SidebarSkeleton = () => (
  <div className="fixed inset-y-0 left-0 z-50 w-[290px] lg:w-[90px] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 animate-pulse" />
);

function AdminLayoutInner({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { isAppDrawerOverlayOpen, setAppDrawerOverlayOpen } = useNavigation();

  // Performance monitoring for the layout
  // usePerformanceMonitor({ componentName: 'AdminLayout' });

  // Memoize the margin calculation to prevent unnecessary re-renders
  const mainContentMargin = useMemo(() => {
    // Mobile sidebar is overlay, so no margin needed
    if (isMobileOpen) return "ml-0";

    // On desktop, adjust margin based on sidebar state
    if (isExpanded || isHovered) return "lg:ml-[290px]";
    return "lg:ml-[90px]";
  }, [isMobileOpen, isExpanded, isHovered]);

  // Memoize the main content styles
  const mainContentStyles = useMemo(() => ({
    className: `flex flex-col flex-1 h-screen transition-all duration-200 ease-in-out ${mainContentMargin}`,
    style: {
      willChange: 'margin-left',
      transform: 'translateZ(0)', // Force hardware acceleration
    }
  }), [mainContentMargin]);

  return (
    <div className="h-screen bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
      {/* Fixed Sidebar with Suspense for lazy loading */}
      <Suspense fallback={<SidebarSkeleton />}>
        <AppSidebar />
      </Suspense>

      {/* Backdrop with Suspense */}
      <Suspense fallback={null}>
        <Backdrop />
      </Suspense>

      {/* Main Content Area - Fixed positioning with scroll */}
      <div {...mainContentStyles}>
        {/* Fixed Header with Suspense for lazy loading */}
        <Suspense fallback={<HeaderSkeleton />}>
          <AppHeader />
        </Suspense>

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="w-full p-4 md:p-6 lg:p-8" style={{ contain: 'layout style paint' }}>
            {/* Center content on large screens (>1920px) */}
            <div className="w-full max-w-none 2xl:max-w-7xl 2xl:mx-auto">
              <AppDrawerBreadcrumb />
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* App Drawer Overlay */}
      <AppDrawerOverlay
        isOpen={isAppDrawerOverlayOpen}
        onClose={() => setAppDrawerOverlayOpen(false)}
      />
    </div>
  );
}

function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <NavigationProvider>
        <AdminLayoutInner>
          {children}
        </AdminLayoutInner>
      </NavigationProvider>
    </ProtectedRoute>
  );
}

// Memoize the entire layout to prevent unnecessary re-renders
export default memo(AdminLayout);
