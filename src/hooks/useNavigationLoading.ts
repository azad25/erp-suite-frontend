"use client";

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useLoading } from '@/context/LoadingContext';

export function useNavigationLoading() {
    const router = useRouter();
    const pathname = usePathname();
    const { showLoading, hideLoading } = useLoading();
    const isNavigatingRef = useRef(false);
    const navigationTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

    useEffect(() => {
        // Store original router methods
        const originalPush = router.push;
        const originalReplace = router.replace;
        const originalBack = router.back;
        const originalForward = router.forward;

        // Enhanced navigation with loading states
        const enhancedNavigation = (
            originalMethod: typeof router.push,
            href: string,
            options?: any,
            loadingMessage?: string
        ) => {
            // Don't show loading for same page navigation
            if (href === pathname) {
                return originalMethod(href, options);
            }

            // Show loading immediately
            isNavigatingRef.current = true;
            showLoading();

            // Set a timeout to hide loading if navigation takes too long
            navigationTimeoutRef.current = setTimeout(() => {
                if (isNavigatingRef.current) {
                    hideLoading();
                    isNavigatingRef.current = false;
                }
            }, 10000); // 10 second timeout

            return originalMethod(href, options);
        };

        // Override router methods
        router.push = (href: string, options?: any) =>
            enhancedNavigation(originalPush, href, options);

        router.replace = (href: string, options?: any) =>
            enhancedNavigation(originalReplace, href, options);

        router.back = () => {
            isNavigatingRef.current = true;
            showLoading();
            navigationTimeoutRef.current = setTimeout(() => {
                if (isNavigatingRef.current) {
                    hideLoading();
                    isNavigatingRef.current = false;
                }
            }, 10000);
            return originalBack();
        };

        router.forward = () => {
            isNavigatingRef.current = true;
            showLoading();
            navigationTimeoutRef.current = setTimeout(() => {
                if (isNavigatingRef.current) {
                    hideLoading();
                    isNavigatingRef.current = false;
                }
            }, 10000);
            return originalForward();
        };

        // Cleanup function
        return () => {
            router.push = originalPush;
            router.replace = originalReplace;
            router.back = originalBack;
            router.forward = originalForward;

            if (navigationTimeoutRef.current) {
                clearTimeout(navigationTimeoutRef.current);
            }
        };
    }, [router, pathname, showLoading, hideLoading]);

    // Hide loading when pathname changes (navigation completed)
    useEffect(() => {
        if (isNavigatingRef.current) {
            // Small delay to ensure smooth transition
            const timer = setTimeout(() => {
                hideLoading();
                isNavigatingRef.current = false;

                if (navigationTimeoutRef.current) {
                    clearTimeout(navigationTimeoutRef.current);
                }
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [pathname, hideLoading]);

    // Handle browser navigation (back/forward buttons)
    useEffect(() => {
        const handlePopState = () => {
            if (!isNavigatingRef.current) {
                isNavigatingRef.current = true;
                showLoading();
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [showLoading]);

    // Handle link clicks for Next.js Link components
    useEffect(() => {
        const handleLinkClick = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const link = target.closest('a[href]') as HTMLAnchorElement;

            if (!link) return;

            const href = link.getAttribute('href');
            if (!href || href === pathname) return;

            // Check if it's an internal link
            if (href.startsWith('/') && !href.startsWith('//')) {
                // Don't show loading for external links or same page
                if (!isNavigatingRef.current) {
                    isNavigatingRef.current = true;
                    showLoading();

                    navigationTimeoutRef.current = setTimeout(() => {
                        if (isNavigatingRef.current) {
                            hideLoading();
                            isNavigatingRef.current = false;
                        }
                    }, 10000);
                }
            }
        };

        document.addEventListener('click', handleLinkClick);
        return () => document.removeEventListener('click', handleLinkClick);
    }, [pathname, showLoading, hideLoading]);
}