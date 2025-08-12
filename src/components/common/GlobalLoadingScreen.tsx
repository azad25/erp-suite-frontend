"use client";

import React, { useEffect, useRef } from 'react';
import { useLoading } from '@/context/LoadingContext';
import { useSidebar } from '@/context/SidebarContext';
import { useAppPreloader } from '@/hooks/useAppPreloader';
import LoadingLogo from './LoadingLogo';

export default function GlobalLoadingScreen() {
  const { isLoading, loadingMessage } = useLoading();
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { progress, isComplete, startPreloading } = useAppPreloader();
  const initialPreloadStartedRef = useRef(false);

  // Kick off a single, idle-time preload on first mount to warm caches without blocking navigation
  useEffect(() => {
    if (!initialPreloadStartedRef.current) {
      initialPreloadStartedRef.current = true;
      // Let the page render first
      const t = setTimeout(() => startPreloading(), 0);
      return () => clearTimeout(t);
    }
  }, [startPreloading]);

  if (!isLoading) return null;

  // Calculate the left margin based on sidebar state (same logic as AdminLayout)
  const getLeftMargin = () => {
    // Mobile sidebar is overlay, so no margin needed
    if (isMobileOpen) return "ml-0";
    
    // On desktop, adjust margin based on sidebar state
    if (isExpanded || isHovered) return "lg:ml-[290px]";
    return "lg:ml-[90px]";
  };

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm ${getLeftMargin()} lg:mt-16`}>
      <div className="flex flex-col items-center justify-center space-y-4">
        <LoadingLogo 
          withText={true}
          className=""
          textClassName="text-gray-900 dark:text-white"
          progress={0}
          loadingText={loadingMessage || ''}
        />
      </div>
    </div>
  );
}