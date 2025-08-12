"use client";

import React from "react";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/hooks/useAuth";
import { LoadingProvider } from "@/context/LoadingContext";
import dynamic from "next/dynamic";

// Lazy-load non-critical client helpers to reduce hydration and nav overhead
const GlobalLoadingScreen = dynamic(
  () => import("@/components/common/GlobalLoadingScreen"),
  { ssr: false, loading: () => null }
);

const NavigationPerformanceMonitor = dynamic(
  () => import("@/components/performance/NavigationPerformanceMonitor").then((m) => ({ default: m.NavigationPerformanceMonitor })),
  { ssr: false, loading: () => null }
);

const RoutePreloader = dynamic(
  () => import("@/components/performance/RoutePreloader").then((m) => ({ default: m.RoutePreloader })),
  { ssr: false, loading: () => null }
);

const NavigationOptimizer = dynamic(
  () => import("@/components/performance/NavigationOptimizer").then((m) => ({ default: m.NavigationOptimizer })),
  { ssr: false, loading: () => null }
);

const LinkLoadingIndicator = dynamic(
  () => import("@/components/performance/LinkLoadingIndicator"),
  { ssr: false, loading: () => null }
);

const SitePreloaderWrapper = dynamic(
  () => import("@/components/performance/SitePreloaderWrapper").then((m) => ({ default: m.SitePreloaderWrapper })),
  { ssr: false, loading: () => null }
);

const ProductionPerformanceMonitor = dynamic(
  () => import("@/components/performance/ProductionPerformanceMonitor").then((m) => ({ default: m.ProductionPerformanceMonitor })),
  { ssr: false, loading: () => null }
);

const GlobalRouteLoading = dynamic(
  () => import("@/components/performance/GlobalRouteLoading"),
  { ssr: false, loading: () => null }
);

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <LoadingProvider>
        <AuthProvider>
          <SidebarProvider>
            {children}
            <GlobalLoadingScreen />
            <LinkLoadingIndicator />
            <GlobalRouteLoading />
            {process.env.NODE_ENV === "production" && (
              <>
                <NavigationPerformanceMonitor />
                <RoutePreloader />
                <NavigationOptimizer />
                <SitePreloaderWrapper />
                <ProductionPerformanceMonitor />
              </>
            )}
          </SidebarProvider>
        </AuthProvider>
      </LoadingProvider>
    </ThemeProvider>
  );
}


