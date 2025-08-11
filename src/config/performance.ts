// Performance configuration for the ERP frontend

export const PERFORMANCE_CONFIG = {
  // Lazy loading thresholds
  LAZY_LOAD_THRESHOLD: '50px',
  
  // Cache durations (in milliseconds)
  CACHE_DURATIONS: {
    STATIC_DATA: 5 * 60 * 1000, // 5 minutes
    USER_DATA: 2 * 60 * 1000,   // 2 minutes
    DASHBOARD_DATA: 1 * 60 * 1000, // 1 minute
    REAL_TIME_DATA: 30 * 1000,  // 30 seconds
  },
  
  // Bundle splitting configuration
  CHUNK_SIZES: {
    MIN_SIZE: 20000,    // 20KB
    MAX_SIZE: 244000,   // 244KB
  },
  
  // Performance thresholds
  THRESHOLDS: {
    RENDER_TIME_WARNING: 16,    // 16ms (60fps)
    RENDER_TIME_ERROR: 100,     // 100ms
    BUNDLE_SIZE_WARNING: 500000, // 500KB
    BUNDLE_SIZE_ERROR: 1000000,  // 1MB
  },
  
  // Image optimization
  IMAGE_CONFIG: {
    QUALITY: 85,
    FORMATS: ['image/webp', 'image/avif'],
    DEVICE_SIZES: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    IMAGE_SIZES: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Virtual scrolling
  VIRTUAL_SCROLL: {
    ITEM_HEIGHT: 60,
    CONTAINER_HEIGHT: 400,
    BUFFER_SIZE: 2,
    OVERSCAN: 5,
  },
  
  // Debounce delays
  DEBOUNCE_DELAYS: {
    SEARCH: 300,
    RESIZE: 100,
    SCROLL: 16,
    INPUT: 150,
  },
  
  // Memory management
  MEMORY: {
    MAX_CACHE_ENTRIES: 100,
    CLEANUP_INTERVAL: 60000, // 1 minute
    MAX_COMPONENT_INSTANCES: 50,
  },
  
  // Network optimization
  NETWORK: {
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
    TIMEOUT: 10000,
    CONCURRENT_REQUESTS: 6,
  },
  
  // Development settings
  DEV: {
    ENABLE_PERFORMANCE_MONITORING: true,
    ENABLE_BUNDLE_ANALYZER: false,
    ENABLE_WHY_DID_YOU_RENDER: false,
    LOG_SLOW_RENDERS: true,
  },
} as const;

// Feature flags for performance optimizations
export const PERFORMANCE_FEATURES = {
  ENABLE_VIRTUAL_SCROLLING: true,
  ENABLE_LAZY_LOADING: true,
  ENABLE_IMAGE_OPTIMIZATION: true,
  ENABLE_COMPONENT_MEMOIZATION: true,
  ENABLE_BUNDLE_SPLITTING: true,
  ENABLE_PRELOADING: true,
  ENABLE_SERVICE_WORKER: false, // Disabled for now
  ENABLE_COMPRESSION: true,
  ENABLE_TREE_SHAKING: true,
  ENABLE_DEAD_CODE_ELIMINATION: true,
} as const;

// Environment-specific overrides
export const getPerformanceConfig = () => {
  const isDev = process.env.NODE_ENV === 'development';
  const isProd = process.env.NODE_ENV === 'production';
  
  return {
    ...PERFORMANCE_CONFIG,
    DEV: {
      ...PERFORMANCE_CONFIG.DEV,
      ENABLE_PERFORMANCE_MONITORING: isDev,
      LOG_SLOW_RENDERS: isDev,
    },
    // Adjust cache durations for development
    CACHE_DURATIONS: isDev ? {
      STATIC_DATA: 30 * 1000,     // 30 seconds in dev
      USER_DATA: 15 * 1000,       // 15 seconds in dev
      DASHBOARD_DATA: 10 * 1000,  // 10 seconds in dev
      REAL_TIME_DATA: 5 * 1000,   // 5 seconds in dev
    } : PERFORMANCE_CONFIG.CACHE_DURATIONS,
  };
};

export default PERFORMANCE_CONFIG;