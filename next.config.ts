import type { NextConfig } from "next";
import path from "path";
import fs from "fs";

const nextConfig: NextConfig = {
  // Enable React strict mode for better performance
  reactStrictMode: true,

  // Optimize power consumption
  poweredByHeader: false,

  webpack(config, { dev, isServer, webpack }) {
    // Development optimizations for faster compilation and lower memory usage
    if (dev) {
      // Memory optimization for development
      config.optimization.removeAvailableModules = false;
      config.optimization.removeEmptyChunks = false;
      config.optimization.splitChunks = false;
      
      // Faster module resolution with memory optimization
      config.resolve.symlinks = false;
      config.resolve.cacheWithContext = false;
      
      // Reduce memory usage in development
      config.watchOptions = {
        ignored: /node_modules/,
        aggregateTimeout: 300,
        poll: false,
      };
      
      // Limit concurrent processing to reduce memory spikes
      config.parallelism = 1;
      
      // Disable source maps in Docker to save memory
      if (process.env.DOCKER_ENV) {
        config.devtool = false;
      }
    }

    // Ensure webpack uses a Node-safe global object when bundling server code
    // to avoid `self is not defined` in server chunks
    if (isServer) {
      if (!config.output) config.output = {} as any;
      (config.output as any).globalObject = 'globalThis';
    }

    // Production optimizations (scope to client bundle to avoid server runtime issues)
    if (!dev && !isServer) {
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

    // Generate bundle stats for analyzer when ANALYZE=true
    if (process.env.ANALYZE && !isServer) {
      try {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        const analyzeDir = path.resolve(process.cwd(), '.next/analyze');
        try { fs.mkdirSync(analyzeDir, { recursive: true }); } catch {}
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'disabled',
            generateStatsFile: true,
            statsFilename: path.join(analyzeDir, 'client.json'),
            statsOptions: { source: false },
          })
        );
      } catch (err) {
        console.warn('Bundle analyzer not available:', err);
      }
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

      // Do not customize externals; rely on dynamic imports with ssr: false
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

  // Avoid serverExternalPackages customizations to reduce build-time issues
  serverExternalPackages: [],

  // Experimental features for maximum performance
  experimental: {
    // Disable aggressive import and turbo tweaks to stabilize prod build
    optimizePackageImports: undefined,
    optimizeCss: false,
    turbo: undefined,
  },

  // Optimize output
  // output: 'standalone',

  // Dev proxy for backend APIs to avoid 404s and speed up data fetching
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://localhost/api/v1/:path*',
      },
      {
        source: '/graphql',
        destination: 'http://localhost/graphql',
      },
    ];
  },

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
