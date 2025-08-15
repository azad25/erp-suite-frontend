'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authInterceptor } from '@/lib/auth-interceptor';
import { tokenMonitor } from '@/lib/token-monitor';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Define public routes that don't need authentication
  const publicRoutes = [
    '/signin',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/error-404'
  ];

  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Skip auth check for public routes
        if (isPublicRoute) {
          setIsAuthenticated(false);
          setIsChecking(false);
          return;
        }

        // Check authentication status
        const authStatus = await authInterceptor.checkAuthStatus();
        
        if (!authStatus) {
          // Not authenticated or token expired, redirect to signin
          const redirectUrl = `/signin?redirect=${encodeURIComponent(pathname)}`;
          router.replace(redirectUrl);
          return;
        }

        setIsAuthenticated(true);
        
        // Start token monitoring for authenticated users
        tokenMonitor.startMonitoring();
      } catch (error) {
        console.error('Auth check failed:', error);
        
        // Check if this is a network error (backend not available)
        if (error instanceof Error && (
          error.message.includes('fetch') || 
          error.message.includes('network') ||
          error.message.includes('ECONNREFUSED')
        )) {
          console.warn('Backend services appear to be unavailable. Allowing access for development.');
          // In development, allow access if backend is not available
          if (process.env.NODE_ENV === 'development') {
            setIsAuthenticated(true);
            setIsChecking(false);
            return;
          }
        }
        
        // On error, redirect to signin
        const redirectUrl = `/signin?redirect=${encodeURIComponent(pathname)}`;
        router.replace(redirectUrl);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [pathname, router, isPublicRoute]);

  // Cleanup token monitoring when component unmounts or user becomes unauthenticated
  useEffect(() => {
    return () => {
      if (!isAuthenticated) {
        tokenMonitor.stopMonitoring();
      }
    };
  }, [isAuthenticated]);

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // For public routes, always render children
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // For protected routes, only render if authenticated
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // This should not be reached due to redirects above, but just in case
  return null;
}