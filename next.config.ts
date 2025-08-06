import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config, { dev, isServer }) {
    // SVG handling
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    // Production optimizations
    if (!dev && !isServer) {
      // Enable tree shaking for better bundle size
      config.optimization.usedExports = true;
      
      // Split chunks for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            enforce: true,
          },
        },
      };
    }

    return config;
  },
  
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Enable compression
  compress: true,
  
  // Experimental features for performance
  experimental: {
    optimizePackageImports: [
      'react-icons', 
      'lodash', 
      '@fullcalendar/core',
      'apexcharts',
      'react-apexcharts'
    ],
    // Enable modern bundling
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
  
  // Cache configuration
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
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, max-age=0, must-revalidate',
          },
        ],
      },
      // Preload critical resources
      {
        source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
        headers: [
          {
            key: 'Link',
            value: '</api/config>; rel=preload; as=fetch; crossorigin',
          },
        ],
      },
    ];
  },
  
  // Redirect configuration for better SEO and performance
  async redirects() {
    return [
      // Add any necessary redirects here
    ];
  },
};

export default nextConfig;
