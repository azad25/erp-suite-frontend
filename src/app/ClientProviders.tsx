"use client";

import React from "react";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/hooks/useAuth";
import { LoadingProvider } from "@/context/LoadingContext";
import { LanguageProvider } from "@/context/LanguageContext";
import dynamic from "next/dynamic";

// Lazy-load non-critical client helpers to reduce hydration and nav overhead
const GlobalLoadingScreen = dynamic(
  () => import("@/components/common/GlobalLoadingScreen"),
  { ssr: false, loading: () => null }
);

const NavigationLoadingProvider = dynamic(
  () => import("@/components/navigation/NavigationLoadingProvider"),
  { ssr: false, loading: () => null }
);

const AuthGuard = dynamic(
  () => import("@/components/auth/AuthGuard"),
  { ssr: false, loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  )}
);

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <LoadingProvider>
          <AuthProvider>
            <SidebarProvider>
              <AuthGuard>
                {children}
              </AuthGuard>
              <GlobalLoadingScreen />
              <NavigationLoadingProvider />
            </SidebarProvider>
          </AuthProvider>
        </LoadingProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}


