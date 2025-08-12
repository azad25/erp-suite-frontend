#!/usr/bin/env node

/**
 * Health Check Script with Memory Monitoring
 * Used by Docker healthcheck to monitor both service health and memory usage
 */

const http = require('http');

function checkHealth() {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/health',
      method: 'GET',
      timeout: 5000
    }, (res) => {
      if (res.statusCode === 200) {
        resolve(true);
      } else {
        reject(new Error(`Health check failed with status ${res.statusCode}`));
      }
    });

    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Health check timeout')));
    req.end();
  });
}

function checkMemory() {
  const used = process.memoryUsage();
  const formatBytes = (bytes) => Math.round(bytes / 1024 / 1024 * 100) / 100;
  
  const heapUsedMB = formatBytes(used.heapUsed);
  const rssMB = formatBytes(used.rss);
  
  // Memory thresholds (in MB)
  const HEAP_WARNING = 1500;
  const RSS_WARNING = 2000;
  const HEAP_CRITICAL = 1800;
  const RSS_CRITICAL = 2500;
  
  if (heapUsedMB > HEAP_CRITICAL || rssMB > RSS_CRITICAL) {
    throw new Error(`Critical memory usage: Heap ${heapUsedMB}MB, RSS ${rssMB}MB`);
  }
  
  if (heapUsedMB > HEAP_WARNING || rssMB > RSS_WARNING) {
    console.warn(`⚠️  High memory usage: Heap ${heapUsedMB}MB, RSS ${rssMB}MB`);
  }
  
  return { heapUsed: heapUsedMB, rss: rssMB };
}

async function main() {
  try {
    // Check service health
    await checkHealth();
    
    // Check memory usage
    const memory = checkMemory();
    
    console.log(`✅ Health check passed - Memory: Heap ${memory.heapUsed}MB, RSS ${memory.rss}MB`);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Health check failed: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkHealth, checkMemory };