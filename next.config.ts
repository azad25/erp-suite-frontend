import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React strict mode for better performance
  reactStrictMode: true,

  // Optimize power consumption
  poweredByHeader: false,

  webpack(config, { dev, isServer, webpack }) {
    // Development optimizations for faster compilation
    if (dev) {
      // Faster source maps in development
      config.devtool = 'eval-cheap-module-source-map';
      
      // Reduce bundle analysis overhead
      config.optimization.removeAvailableModules = false;
      config.optimization.removeEmptyChunks = false;
      config.optimization.splitChunks = false;
      
      // Faster module resolution
      config.resolve.symlinks = false;
      config.resolve.cacheWithContext = false;
    }

    // Production optimizations
    if (!dev) {
      // Enable aggressive tree shaking
      config.optimization.usedExports = true;
      config.optimization.sideEffects = false;
      config.optimization.concatenateModules = true;

      // Optimize chunk splitting for maximum caching
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 200000,
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
            test: /[\\/]node_modules[\\/](apexcharts|react-apexcharts)[\\/]/,
            name: 'charts',
            priority: 15,
            chunks: 'async',
          },
          ui: {
            test: /[\\/]src[\\/]components[\\/](ui|common)[\\/]/,
            name: 'ui',
            priority: 10,
            chunks: 'all',
          },
        },
      };
    }

    // SVG optimization
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // Server-side optimizations
    if (isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };

      // Fix 'self is not defined' error on server
      config.plugins.push(
        new webpack.DefinePlugin({
          self: 'globalThis',
          global: 'globalThis',
        })
      );

      // Exclude problematic packages from server bundle
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push({
          'apexcharts': 'apexcharts',
          'react-apexcharts': 'react-apexcharts',
          'canvas': 'canvas',
        });
      }
    }

    return config;
  },

  // Disable ESLint during builds for faster compilation
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Optimize images aggressively
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // Enable compression
  compress: true,

  // Handle chart packages and other client-only packages separately
  serverExternalPackages: [
    'apexcharts', 
    'react-apexcharts',
    'canvas',
    'jsdom',
    'sharp'
  ],

  // Experimental features for maximum performance
  experimental: {
    // Optimize package imports (excluding chart packages to avoid conflicts)
    optimizePackageImports: [
      'react-icons',
      'lodash',
      '@fullcalendar/core',
      'axios',
      'socket.io-client'
    ],
    // Enable optimized CSS
    optimizeCss: true,
    // Enable turbo mode
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // Optimize output
  output: 'standalone',

  // Performance headers
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
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
        ],
      },
    ];
  },
};

export default nextConfig;
