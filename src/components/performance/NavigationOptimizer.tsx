"use client";

import { useEffect, useRef } from 'react';
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

  useEffect(() => {
    let navigationTimeout: NodeJS.Timeout;
    let isNavigating = false;

    // Aggressive route prefetching based on current location
    const smartPreload = () => {
      const routeMap = {
        '/': ['/dashboard', '/users', '/crm', '/sales'],
        '/dashboard': ['/users', '/sales', '/inventory', '/finance'],
        '/users': ['/dashboard', '/crm', '/hrm', '/settings'],
        '/crm': ['/sales', '/users', '/dashboard', '/reports'],
        '/sales': ['/inventory', '/finance', '/crm', '/reports'],
        '/inventory': ['/sales', '/finance', '/dashboard', '/reports'],
        '/finance': ['/sales', '/inventory', '/reports', '/analytics'],
        '/projects': ['/dashboard', '/hrm', '/reports', '/users'],
        '/hrm': ['/users', '/projects', '/dashboard', '/settings'],
        '/reports': ['/finance', '/analytics', '/dashboard', '/sales'],
        '/settings': ['/dashboard', '/users', '/profile', '/notifications'],
        '/analytics': ['/reports', '/dashboard', '/finance', '/sales'],
        '/notifications': ['/dashboard', '/settings', '/profile', '/users'],
        '/profile': ['/settings', '/dashboard', '/users', '/notifications']
      };

      const routes = routeMap[pathname as keyof typeof routeMap] || [];
      routes.forEach(route => router.prefetch(route));
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

      // Only show loading for slow navigations
      navigationTimeout = setTimeout(() => {
        showLoading('Loading page...');
      }, 200);

      const result = originalMethod(href, options);

      const cleanup = () => {
        clearTimeout(navigationTimeout);
        hideLoading();
        isNavigating = false;

        const endTime = performance.now();
        const duration = endTime - startTime;

        if (duration < 500) {
          console.log(`🚀 Ultra-fast navigation to ${href}: ${duration.toFixed(2)}ms`);
        } else if (duration < 1000) {
          console.log(`⚡ Fast navigation to ${href}: ${duration.toFixed(2)}ms`);
        } else {
          console.warn(`🐌 Slow navigation to ${href}: ${duration.toFixed(2)}ms`);
        }
      };

      setTimeout(cleanup, 50); // Faster cleanup
      return result;
    };

    // Setup hover preloading
    const setupHoverPreloading = () => {
      const links = document.querySelectorAll('a[href^="/"]');
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !componentCache.has(href)) {
          link.addEventListener('mouseenter', () => {
            router.prefetch(href);
            componentCache.set(href, true);
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
              if (href && href.startsWith('/')) {
                router.prefetch(href);
              }
            }
          });
        },
        { rootMargin: '100px' }
      );

      const links = document.querySelectorAll('a[href^="/"]');
      links.forEach(link => observerRef.current?.observe(link));
    };

    // Execute optimizations
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
      clearTimeout(navigationTimeout);
      clearTimeout(timeoutId);
      router.push = originalPush;
      router.replace = originalReplace;
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [router, pathname, showLoading, hideLoading]);

  // Hide loading when pathname changes
  useEffect(() => {
    hideLoading();
  }, [pathname, hideLoading]);

  return null;
}