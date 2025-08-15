"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useLoading } from '@/context/LoadingContext';

export default function NavigationLoadingProvider() {
  const pathname = usePathname();
  const { showLoading, hideLoading } = useLoading();
  const previousPathnameRef = useRef<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isNavigatingRef = useRef(false);

  // Handle instant loading on link clicks
  useEffect(() => {
    const handleLinkClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a[href]') as HTMLAnchorElement;
      
      if (link && link.href) {
        const url = new URL(link.href);
        const currentUrl = new URL(window.location.href);
        
        // Only show loading for internal navigation (same origin, different path)
        if (url.origin === currentUrl.origin && url.pathname !== currentUrl.pathname) {
          // Don't show loading for auth-related pages (they have their own loading)
          if (!url.pathname.includes('/signin') && 
              !url.pathname.includes('/signup') && 
              !url.pathname.includes('/forgot-password') &&
              !url.pathname.includes('/reset-password')) {
            
            isNavigatingRef.current = true;
            showLoading('Loading page...');
          }
        }
      }
    };

    // Handle form submissions that might cause navigation
    const handleFormSubmit = (event: SubmitEvent) => {
      const form = event.target as HTMLFormElement;
      if (form && form.action) {
        const url = new URL(form.action, window.location.href);
        const currentUrl = new URL(window.location.href);
        
        if (url.origin === currentUrl.origin && url.pathname !== currentUrl.pathname) {
          isNavigatingRef.current = true;
          showLoading('Processing...');
        }
      }
    };

    // Add event listeners
    document.addEventListener('click', handleLinkClick, true);
    document.addEventListener('submit', handleFormSubmit, true);

    return () => {
      document.removeEventListener('click', handleLinkClick, true);
      document.removeEventListener('submit', handleFormSubmit, true);
    };
  }, [showLoading]);

  // Handle pathname changes (navigation completion)
  useEffect(() => {
    // Skip loading on initial mount
    if (previousPathnameRef.current === null) {
      previousPathnameRef.current = pathname;
      return;
    }

    // Only process if pathname actually changed
    if (previousPathnameRef.current !== pathname) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // If we weren't already showing loading (e.g., programmatic navigation), show it briefly
      if (!isNavigatingRef.current) {
        showLoading('Loading page...');
      }
      
      // Hide loading after page has time to render
      timeoutRef.current = setTimeout(() => {
        hideLoading();
        isNavigatingRef.current = false;
        timeoutRef.current = null;
      }, 200); // Reduced to 200ms for even faster perceived performance

      // Update previous pathname
      previousPathnameRef.current = pathname;
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [pathname, showLoading, hideLoading]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      hideLoading();
    };
  }, [hideLoading]);

  return null;
}