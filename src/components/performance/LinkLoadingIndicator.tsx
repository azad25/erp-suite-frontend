"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useLoading } from '@/context/LoadingContext';

// Shows the global loading overlay during client-side navigations initiated by link clicks.
export default function LinkLoadingIndicator() {
  const pathname = usePathname();
  const { showLoading, hideLoading } = useLoading();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const navigatingRef = useRef(false);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Find closest anchor
      const anchor = target.closest('a') as HTMLAnchorElement | null;
      if (!anchor) return;

      // Only internal links
      const href = anchor.getAttribute('href') || '';
      if (!href.startsWith('/') || href.startsWith('//')) return;

      // Ignore modified clicks (new tab, etc.)
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
        return;
      }

      // Already navigating
      if (navigatingRef.current) return;

      navigatingRef.current = true;

      // Show immediately (no delay) so animation starts instantly
      showLoading('Loading page...');
    };

    document.addEventListener('click', onClick, { capture: true, passive: true });
    return () => document.removeEventListener('click', onClick, { capture: true } as any);
  }, [showLoading]);

  // Hide loader when the route actually changes
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    hideLoading();
    navigatingRef.current = false;
  }, [pathname, hideLoading]);

  return null;
}


