"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// All ERP routes for aggressive preloading
const ALL_ROUTES = [
  '/',
  '/dashboard',
  // Trimmed list in development to reduce compile bursts
  ...(process.env.NODE_ENV === 'production' ? [
    '/users',
    '/crm',
    '/sales',
    '/inventory',
    '/finance',
    '/projects',
    '/hrm',
    '/reports',
    '/settings',
    '/analytics',
    '/notifications',
    '/profile',
  ] : [])
];

// API endpoints to preload
const API_ENDPOINTS = process.env.NODE_ENV === 'production'
  ? ['/api/config', '/api/v1/auth/me', '/api/v1/users', '/api/v1/dashboard/stats']
  : ['/api/config'];

export function RoutePreloader() {
  const router = useRouter();
  const preloadedRef = useRef(new Set<string>());

  useEffect(() => {
    const preloadRoute = (route: string) => {
      if (!preloadedRef.current.has(route)) {
        router.prefetch(route);
        preloadedRef.current.add(route);
      }
    };

    const preloadAPI = async (endpoint: string) => {
      if (!preloadedRef.current.has(endpoint)) {
        try {
          await fetch(endpoint, { 
            method: 'HEAD',
            headers: { 'Cache-Control': 'max-age=300' }
          });
          preloadedRef.current.add(endpoint);
        } catch (error) {
          // Silently handle errors
        }
      }
    };

    // Immediate preloading of critical routes
    const preloadCritical = () => {
      const criticalRoutes = ['/', '/dashboard'];
      criticalRoutes.forEach(preloadRoute);
    };

    // Aggressive preloading of all routes (disabled in development to avoid dev-server overload)
    const preloadAll = () => {
      if (process.env.NODE_ENV === 'production') {
        ALL_ROUTES.forEach(preloadRoute);
        API_ENDPOINTS.forEach(preloadAPI);
      }
    };

    // Start immediately
    preloadCritical();

    // Preload everything else after a tiny delay
    const timeoutId = setTimeout(preloadAll, 50);

    // Continue preloading on idle (production only)
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      requestIdleCallback(() => {
        ALL_ROUTES.forEach(preloadRoute);
      }, { timeout: 1000 });
    }

    return () => clearTimeout(timeoutId);
  }, [router]);

  return null;
}