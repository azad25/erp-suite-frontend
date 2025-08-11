#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Ultimate Performance Boost for ERP Frontend\n');

// 1. Create a performance-optimized layout component
const optimizedLayoutContent = `"use client";

import React, { Suspense, memo } from 'react';
import dynamic from 'next/dynamic';

// Lazy load heavy components
const AppSidebar = dynamic(() => import('./AppSidebar'), {
  loading: () => <div className="w-[90px] lg:w-[290px] h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800" />,
  ssr: false
});

const AppHeader = dynamic(() => import('./AppHeader'), {
  loading: () => <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800" />,
  ssr: false
});

const Backdrop = dynamic(() => import('./Backdrop'), {
  ssr: false
});

const OptimizedLayout = memo(({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Suspense fallback={<div className="w-[90px] lg:w-[290px] h-screen bg-white dark:bg-gray-900" />}>
        <AppSidebar />
      </Suspense>
      
      <div className="flex flex-col flex-1 overflow-hidden">
        <Suspense fallback={<div className="h-16 bg-white dark:bg-gray-900" />}>
          <AppHeader />
        </Suspense>
        
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
      
      <Suspense fallback={null}>
        <Backdrop />
      </Suspense>
    </div>
  );
});

OptimizedLayout.displayName = 'OptimizedLayout';

export default OptimizedLayout;
`;

// 2. Create performance monitoring hook
const performanceHookContent = `"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export const useNavigationPerformance = () => {
  const pathname = usePathname();
  const navigationStart = useRef<number>(0);

  useEffect(() => {
    // Mark navigation start
    navigationStart.current = performance.now();

    // Measure navigation complete
    const measureNavigation = () => {
      const navigationEnd = performance.now();
      const navigationTime = navigationEnd - navigationStart.current;
      
      if (navigationTime > 0) {
        console.log(\`🚀 Navigation to \${pathname}: \${Math.round(navigationTime)}ms\`);
        
        // Report slow navigations
        if (navigationTime > 1000) {
          console.warn(\`⚠️ Slow navigation detected: \${Math.round(navigationTime)}ms to \${pathname}\`);
        }
      }
    };

    // Use requestIdleCallback for non-blocking measurement
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(measureNavigation);
    } else {
      setTimeout(measureNavigation, 0);
    }
  }, [pathname]);
};
`;

// 3. Create route preloader utility
const routePreloaderContent = `"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const PRELOAD_ROUTES = [
  '/dashboard',
  '/sales',
  '/users',
  '/profile',
  '/settings'
];

export const useRoutePreloader = () => {
  const router = useRouter();

  useEffect(() => {
    // Preload critical routes on idle
    const preloadRoutes = () => {
      PRELOAD_ROUTES.forEach(route => {
        router.prefetch(route);
      });
    };

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(preloadRoutes, { timeout: 2000 });
    } else {
      setTimeout(preloadRoutes, 1000);
    }
  }, [router]);
};
`;

// 4. Create optimized component loader
const componentLoaderContent = `import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// High-performance dynamic component loader
export const createOptimizedComponent = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: {
    loading?: ComponentType;
    ssr?: boolean;
    preload?: boolean;
  } = {}
) => {
  const Component = dynamic(importFn, {
    loading: options.loading || (() => null),
    ssr: options.ssr ?? false,
  });

  // Preload component on hover/focus for instant navigation
  if (options.preload && typeof window !== 'undefined') {
    const preloadComponent = () => {
      importFn().catch(() => {
        // Ignore preload errors
      });
    };

    // Preload on mouse enter or focus
    document.addEventListener('mouseenter', preloadComponent, { once: true, passive: true });
    document.addEventListener('focus', preloadComponent, { once: true, passive: true });
  }

  return Component;
};
`;

try {
  // Create performance hooks directory
  const hooksDir = path.join(process.cwd(), 'src', 'hooks');
  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }

  // Create utils directory
  const utilsDir = path.join(process.cwd(), 'src', 'utils');
  if (!fs.existsSync(utilsDir)) {
    fs.mkdirSync(utilsDir, { recursive: true });
  }

  // Write performance files
  fs.writeFileSync(path.join(process.cwd(), 'src', 'layout', 'OptimizedLayout.tsx'), optimizedLayoutContent);
  fs.writeFileSync(path.join(hooksDir, 'useNavigationPerformance.ts'), performanceHookContent);
  fs.writeFileSync(path.join(hooksDir, 'useRoutePreloader.ts'), routePreloaderContent);
  fs.writeFileSync(path.join(utilsDir, 'componentLoader.ts'), componentLoaderContent);

  console.log('✅ Created OptimizedLayout.tsx');
  console.log('✅ Created useNavigationPerformance hook');
  console.log('✅ Created useRoutePreloader hook');
  console.log('✅ Created componentLoader utility');

  // 5. Update package.json scripts for performance monitoring
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    packageJson.scripts = {
      ...packageJson.scripts,
      'perf:test': 'node scripts/test-navigation-performance.js',
      'perf:analyze': 'ANALYZE=true npm run build',
      'perf:lighthouse': 'lighthouse http://localhost:3000 --output=html --output-path=./lighthouse-report.html'
    };

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    console.log('✅ Updated package.json with performance scripts');
  }

  console.log('\n🎉 Ultimate Performance Boost Complete!');
  console.log('\n📋 Next Steps:');
  console.log('1. Replace your current layout with OptimizedLayout');
  console.log('2. Add useNavigationPerformance() to your root layout');
  console.log('3. Add useRoutePreloader() to your main pages');
  console.log('4. Run "npm run perf:test" to monitor performance');
  console.log('5. Use createOptimizedComponent() for heavy components');

} catch (error) {
  console.error('❌ Error during performance optimization:', error.message);
  process.exit(1);
}