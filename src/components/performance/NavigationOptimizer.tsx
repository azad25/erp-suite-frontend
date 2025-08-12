"use client";

import { useEffect, useRef, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useLoading } from '@/context/LoadingContext';

// Component and data caches for instant loading
const componentCache = new Map();
const dataCache = new Map();

export function NavigationOptimizer() {
  const router = useRouter();
  const pathname = usePathname();
  const { showLoading, hideLoading } = useLoading();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const pendingHrefRef = useRef<string | null>(null);
  const showStartRef = useRef<number>(0);
  const prefetchedSet = useRef<Set<string>>(new Set());
  const intersectionPrefetchCountRef = useRef<number>(0);

  const runWhenIdle = useMemo(() => (fn: () => void) => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      // @ts-ignore
      (window as any).requestIdleCallback(fn, { timeout: 1200 });
    } else {
      setTimeout(fn, 100);
    }
  }, []);

  useEffect(() => {
    let navigationTimeout: NodeJS.Timeout | undefined;
    let isNavigating = false;

    // Light route warming: at most the two most likely routes, scheduled on idle
    const smartPreload = () => {
      const routeMap: Record<string, string[]> = {
        '/': ['/dashboard', '/users'],
        '/dashboard': ['/users', '/sales'],
        '/users': ['/dashboard', '/crm'],
        '/crm': ['/sales', '/users'],
        '/sales': ['/inventory', '/finance'],
        '/inventory': ['/sales', '/finance'],
        '/finance': ['/sales', '/reports'],
        '/projects': ['/dashboard', '/hrm'],
        '/hrm': ['/users', '/projects'],
        '/reports': ['/finance', '/analytics'],
        '/settings': ['/dashboard', '/users'],
        '/analytics': ['/reports', '/dashboard'],
        '/notifications': ['/dashboard', '/settings'],
        '/profile': ['/settings', '/dashboard']
      };

      const routes = (routeMap[pathname as keyof typeof routeMap] || []).slice(0, 2);
      routes.forEach((route) => {
        if (prefetchedSet.current.has(route)) return;
        runWhenIdle(() => {
          router.prefetch(route);
          prefetchedSet.current.add(route);
        });
      });
    };

    // Enhanced navigation with instant feedback
    const originalPush = router.push;
    const originalReplace = router.replace;

    const enhancedNavigation = (
      originalMethod: typeof router.push,
      href: string,
      options?: any
    ) => {
      if (isNavigating) return originalMethod(href, options);

      isNavigating = true;
      const startTime = performance.now();
      pendingHrefRef.current = href;

      // Show immediately so the animation starts instantly
      showStartRef.current = performance.now();
      showLoading('Loading page...');

      const result = originalMethod(href, options);

      return result;
    };

    // Setup hover preloading
    const setupHoverPreloading = () => {
      const links = document.querySelectorAll('a[href^="/"]');
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !componentCache.has(href)) {
          link.addEventListener('mouseenter', () => {
            if (prefetchedSet.current.has(href)) return;
            runWhenIdle(() => {
              router.prefetch(href);
              componentCache.set(href, true);
              prefetchedSet.current.add(href);
            });
          }, { passive: true });
        }
      });
    };

    // Setup intersection observer for visible links
    const setupIntersectionPreloading = () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const link = entry.target as HTMLAnchorElement;
              const href = link.getAttribute('href');
              if (!href || !href.startsWith('/')) return;
              if (prefetchedSet.current.has(href)) return;
              // Cap intersection-based prefetches per page to avoid flooding the network
              if (intersectionPrefetchCountRef.current >= 12) return;
              intersectionPrefetchCountRef.current += 1;
              runWhenIdle(() => {
                router.prefetch(href);
                prefetchedSet.current.add(href);
              });
            }
          });
        },
        { rootMargin: '100px' }
      );

      const links = document.querySelectorAll('a[href^="/"]');
      links.forEach(link => observerRef.current?.observe(link));
    };

    // Execute optimizations
    // Warm a tiny set of likely routes
    smartPreload();
    router.push = (href: string, options?: any) =>
      enhancedNavigation(originalPush, href, options);
    router.replace = (href: string, options?: any) =>
      enhancedNavigation(originalReplace, href, options);

    // Setup preloading after DOM is ready
    const timeoutId = setTimeout(() => {
      setupHoverPreloading();
      setupIntersectionPreloading();
    }, 50);

    return () => {
      if (navigationTimeout) clearTimeout(navigationTimeout);
      clearTimeout(timeoutId);
      router.push = originalPush;
      router.replace = originalReplace;
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      intersectionPrefetchCountRef.current = 0;
    };
  }, [router, pathname, showLoading, hideLoading, runWhenIdle]);

  // Hide loading when pathname changes
  useEffect(() => {
    if (pendingHrefRef.current) {
      // Ensure a minimum visible time of 400ms if it was shown
      const elapsed = performance.now() - (showStartRef.current || performance.now());
      const remaining = Math.max(0, 400 - elapsed);
      setTimeout(() => {
        hideLoading();
        pendingHrefRef.current = null;
      }, remaining);
    } else {
      hideLoading();
    }
  }, [pathname, hideLoading]);

  return null;
}