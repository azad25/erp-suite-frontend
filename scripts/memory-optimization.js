#!/usr/bin/env node

/**
 * Memory Optimization Script for Next.js Development
 * This script helps monitor and optimize memory usage during development
 */

const fs = require('fs');
const path = require('path');

// Memory monitoring function
function monitorMemory() {
  const used = process.memoryUsage();
  const formatBytes = (bytes) => Math.round(bytes / 1024 / 1024 * 100) / 100;
  
  console.log('\n📊 Memory Usage:');
  console.log(`RSS: ${formatBytes(used.rss)} MB`);
  console.log(`Heap Used: ${formatBytes(used.heapUsed)} MB`);
  console.log(`Heap Total: ${formatBytes(used.heapTotal)} MB`);
  console.log(`External: ${formatBytes(used.external)} MB`);
  
  // Warning thresholds
  const heapUsedMB = formatBytes(used.heapUsed);
  const rssMB = formatBytes(used.rss);
  
  if (heapUsedMB > 1500) {
    console.log('⚠️  High heap usage detected. Consider restarting the development server.');
  }
  
  if (rssMB > 2000) {
    console.log('⚠️  High RSS usage detected. Memory optimization recommended.');
  }
  
  return { heapUsed: heapUsedMB, rss: rssMB };
}

// Cleanup function
function cleanupCache() {
  const nextDir = path.join(process.cwd(), '.next');
  const cacheDir = path.join(nextDir, 'cache');
  
  try {
    if (fs.existsSync(cacheDir)) {
      fs.rmSync(cacheDir, { recursive: true, force: true });
      console.log('🧹 Cleared Next.js cache');
    }
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
      console.log('🗑️  Forced garbage collection');
    }
  } catch (error) {
    console.error('Error during cleanup:', error.message);
  }
}

// Memory optimization recommendations
function getOptimizationTips() {
  console.log('\n💡 Memory Optimization Tips:');
  console.log('1. Restart the development server periodically');
  console.log('2. Close unused browser tabs');
  console.log('3. Use npm run dev:fast for lighter development mode');
  console.log('4. Consider using npm run dev:classic if Turbo mode uses too much memory');
  console.log('5. Run npm run perf:optimize to apply optimizations');
}

// Main execution
if (require.main === module) {
  console.log('🚀 Next.js Memory Optimization Tool');
  
  const command = process.argv[2];
  
  switch (command) {
    case 'monitor':
      monitorMemory();
      // Set up periodic monitoring
      setInterval(monitorMemory, 30000); // Every 30 seconds
      break;
      
    case 'cleanup':
      cleanupCache();
      monitorMemory();
      break;
      
    case 'tips':
      getOptimizationTips();
      break;
      
    default:
      console.log('Usage:');
      console.log('  node scripts/memory-optimization.js monitor  - Monitor memory usage');
      console.log('  node scripts/memory-optimization.js cleanup  - Clean cache and GC');
      console.log('  node scripts/memory-optimization.js tips     - Show optimization tips');
      break;
  }
}

module.exports = { monitorMemory, cleanupCache, getOptimizationTips };