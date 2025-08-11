"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

// All ERP routes for aggressive preloading
const ALL_ROUTES = [
  '/',
  '/dashboard',
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
  '/profile'
];

// API endpoints to preload
const API_ENDPOINTS = [
  '/api/config',
  '/api/auth/me',
  '/api/users',
  '/api/dashboard/stats'
];

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
      const criticalRoutes = ['/', '/dashboard', '/users'];
      criticalRoutes.forEach(preloadRoute);
    };

    // Aggressive preloading of all routes
    const preloadAll = () => {
      ALL_ROUTES.forEach(preloadRoute);
      API_ENDPOINTS.forEach(preloadAPI);
    };

    // Start immediately
    preloadCritical();

    // Preload everything else after a tiny delay
    const timeoutId = setTimeout(preloadAll, 50);

    // Continue preloading on idle
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      requestIdleCallback(() => {
        ALL_ROUTES.forEach(preloadRoute);
      }, { timeout: 1000 });
    }

    return () => clearTimeout(timeoutId);
  }, [router]);

  return null;
}