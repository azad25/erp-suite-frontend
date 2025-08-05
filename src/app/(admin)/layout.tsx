"use client";

import { useSidebar } from "@/context/SidebarContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AppHeader from "@/layout/AppHeader";
import AppSidebar from "@/layout/AppSidebar";
import Backdrop from "@/layout/Backdrop";
import React, { memo, useMemo } from "react";

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

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 xl:flex">
        {/* Sidebar and Backdrop - memoized to prevent re-renders */}
        <AppSidebar />
        <Backdrop />
        {/* Main Content Area */}
        <div
          className={`flex-1 transition-all duration-150 ease-in-out ${mainContentMargin}`}
        >
          {/* Header - memoized */}
          <AppHeader />
          {/* Page Content - optimized container */}
          <main className="p-4 mx-auto max-w-7xl md:p-6">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}

// Memoize the entire layout to prevent unnecessary re-renders
export default memo(AdminLayout);
