"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useLoading } from '@/context/LoadingContext';

// Ensures the global loading overlay appears on every route change.
// Shows immediately and keeps it visible for a minimum duration to avoid flicker.
export default function GlobalRouteLoading() {
  const pathname = usePathname();
  const { showLoading, hideLoading } = useLoading();
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(false);

  // Initial load: show briefly
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      showLoading('');
      hideTimerRef.current = setTimeout(() => hideLoading(), 400);
    }
    // Cleanup on unmount
    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      hideLoading();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // On every pathname change: show and then hide after a minimum duration
  useEffect(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }

    showLoading('');
    hideTimerRef.current = setTimeout(() => hideLoading(), 400);

    return () => {
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [pathname, showLoading, hideLoading]);

  return null;
}


