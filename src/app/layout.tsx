import { Outfit } from "next/font/google";
import "./globals.css";

import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/hooks/useAuth";
import { LoadingProvider } from "@/context/LoadingContext";
import GlobalLoadingScreen from "@/components/common/GlobalLoadingScreen";
import { NavigationPerformanceMonitor } from "@/components/performance/NavigationPerformanceMonitor";
import { RoutePreloader } from "@/components/performance/RoutePreloader";
import { NavigationOptimizer } from "@/components/performance/NavigationOptimizer";
import { SitePreloaderWrapper } from "@/components/performance/SitePreloaderWrapper";
import { ProductionPerformanceMonitor } from "@/components/performance/ProductionPerformanceMonitor";

const outfit = Outfit({
  subsets: ["latin"],
  display: 'swap', // Optimize font loading
  preload: true,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical resources */}
        <link rel="preload" href="/api/config" as="fetch" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="//fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${outfit.className} dark:bg-gray-900`}>
        <ThemeProvider>
          <LoadingProvider>
            <AuthProvider>
              <SidebarProvider>
                {children}
                <GlobalLoadingScreen />
                <NavigationPerformanceMonitor />
                <RoutePreloader />
                <NavigationOptimizer />
                <SitePreloaderWrapper />
                <ProductionPerformanceMonitor />
              </SidebarProvider>
            </AuthProvider>
          </LoadingProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
