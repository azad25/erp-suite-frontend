import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better performance
  reactStrictMode: true,
  
  // Optimize power consumption
  poweredByHeader: false,
  
  webpack(config, { dev, isServer }) {
    // SVG handling with optimization
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // Production optimizations
    if (!dev) {
      // Enable tree shaking for better bundle size
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;

      // Advanced chunk splitting for optimal caching
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            priority: 20,
            chunks: 'all',
          },
          charts: {
            test: /[\\/]node_modules[\\/](apexcharts|react-apexcharts|@fullcalendar)[\\/]/,
            name: 'charts',
            priority: 15,
            chunks: 'all',
          },
          ui: {
            test: /[\\/]src[\\/]components[\\/]ui[\\/]/,
            name: 'ui',
            priority: 10,
            chunks: 'all',
          },
        },
      };

      // Enable module concatenation
      config.optimization.concatenateModules = true;
    }

    // Resolve optimizations
    config.resolve.alias = {
      ...config.resolve.alias,
      // Reduce bundle size by aliasing to lighter alternatives
      'react/jsx-runtime': require.resolve('react/jsx-runtime'),
    };

    return config;
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  // Optimize images with modern formats
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Enable compression
  compress: true,

  // Experimental features for blazing performance
  experimental: {
    // Optimize package imports to reduce bundle size
    optimizePackageImports: [
      'react-icons',
      'lodash',
      '@fullcalendar/core',
      'axios',
      'socket.io-client'
    ],
    // Enable modern bundling with Turbo
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
    // Enable optimized CSS loading
    optimizeCss: true,
  },

  // Optimize output for production
  output: 'standalone',



  // Advanced caching and performance headers
  async headers() {
    return [
      // Static assets - aggressive caching
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
      // API routes - smart caching
      {
        source: '/api/config',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=300, s-maxage=300, stale-while-revalidate=60',
          },
          {
            key: 'Vary',
            value: 'Accept-Encoding',
          },
        ],
      },
      {
        source: '/api/health',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=60, s-maxage=60',
          },
        ],
      },
      // Default API caching
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, max-age=0, must-revalidate',
          },
        ],
      },
      // Performance and security headers for all pages
      {
        source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
          // Preload critical resources
          {
            key: 'Link',
            value: '</api/config>; rel=preload; as=fetch; crossorigin',
          },
        ],
      },
    ];
  },

  // Redirect configuration
  async redirects() {
    return [];
  },
};

export default nextConfig;
