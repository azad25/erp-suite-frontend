"use client";

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useLoading } from '@/context/LoadingContext';
import { useSidebar } from '@/context/SidebarContext';
import { useAppPreloader } from '@/hooks/useAppPreloader';
import LoadingLogo from './LoadingLogo';

export default function GlobalLoadingScreen() {
  const pathname = usePathname();
  const { isLoading, loadingMessage } = useLoading();
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();
  const { progress, isComplete, startPreloading } = useAppPreloader();
  const initialPreloadStartedRef = useRef(false);

  // State for smooth transitions
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Kick off a single, idle-time preload on first mount to warm caches without blocking navigation
  useEffect(() => {
    if (!initialPreloadStartedRef.current) {
      initialPreloadStartedRef.current = true;
      // Let the page render first
      const t = setTimeout(() => startPreloading(), 0);
      return () => clearTimeout(t);
    }
  }, [startPreloading]);

  // Handle smooth show/hide transitions
  useEffect(() => {
    if (isLoading) {
      setShouldRender(true);
      // Small delay to ensure DOM is ready for transition
      const showTimer = setTimeout(() => setIsVisible(true), 10);
      return () => clearTimeout(showTimer);
    } else {
      setIsVisible(false);
      // Wait for fade out transition to complete before unmounting
      const hideTimer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(hideTimer);
    }
  }, [isLoading]);

  if (!shouldRender) return null;

  // Determine if this should be full screen or content-area only
  const shouldBeFullScreen = () => {
    // Full screen for auth pages
    if (pathname?.startsWith('/signin') || pathname?.startsWith('/signup') ||
      pathname?.startsWith('/forgot-password') || pathname?.startsWith('/reset-password')) {
      return true;
    }

    // Full screen for logout or authentication-related loading messages
    if (loadingMessage?.toLowerCase().includes('logout') ||
      loadingMessage?.toLowerCase().includes('signing out') ||
      loadingMessage?.toLowerCase().includes('authenticating') ||
      loadingMessage?.toLowerCase().includes('redirecting')) {
      return true;
    }

    return false;
  };

  // Calculate the left margin based on sidebar state (same logic as AdminLayout)
  const getLeftMargin = () => {
    // Always full screen if it should be
    if (shouldBeFullScreen()) return "ml-0";

    // Mobile sidebar is overlay, so no margin needed
    if (isMobileOpen) return "ml-0";

    // On desktop, adjust margin based on sidebar state
    if (isExpanded || isHovered) return "lg:ml-[290px]";
    return "lg:ml-[90px]";
  };

  const getTopMargin = () => {
    // No top margin for full screen
    if (shouldBeFullScreen()) return "";

    // Add top margin for admin layout
    return "lg:mt-16";
  };

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-white/40 dark:bg-gray-900/40 backdrop-blur-sm transition-all duration-300 ease-in-out ${getLeftMargin()} ${getTopMargin()} ${isVisible ? 'opacity-100' : 'opacity-0'
        }`}
    >
      <div
        className={`flex flex-col items-center justify-center space-y-4 transition-all duration-300 ease-in-out transform ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-2'
          }`}
      >
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