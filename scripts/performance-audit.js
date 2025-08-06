#!/usr/bin/env node

/**
 * Performance Audit Script
 * Audits the application for performance issues and provides recommendations
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function performanceAudit() {
  log('\n🔍 Performance Audit Report', 'cyan');
  log('=' .repeat(60), 'cyan');
  
  const auditResults = {
    critical: [],
    warnings: [],
    suggestions: [],
    passed: []
  };

  // Run all audit checks
  auditNextConfig(auditResults);
  auditPackageJson(auditResults);
  auditSourceCode(auditResults);
  auditAssets(auditResults);
  auditCaching(auditResults);
  
  // Display results
  displayAuditResults(auditResults);
  
  // Provide action plan
  provideActionPlan(auditResults);
}

function auditNextConfig(results) {
  log('\n📋 Next.js Configuration Audit', 'yellow');
  
  const configPath = path.join(process.cwd(), 'next.config.ts');
  
  if (!fs.existsSync(configPath)) {
    results.critical.push('Missing next.config.ts file');
    return;
  }
  
  const configContent = fs.readFileSync(configPath, 'utf8');
  
  // Check for performance optimizations
  const checks = [
    {
      test: /compress:\s*true/,
      message: 'Compression enabled',
      type: 'passed'
    },
    {
      test: /experimental:\s*{[\s\S]*optimizePackageImports/,
      message: 'Package import optimization enabled',
      type: 'passed'
    },
    {
      test: /splitChunks/,
      message: 'Code splitting configured',
      type: 'passed'
    },
    {
      test: /Cache-Control/,
      message: 'Caching headers configured',
      type: 'passed'
    }
  ];
  
  checks.forEach(check => {
    if (check.test.test(configContent)) {
      results[check.type].push(`✅ ${check.message}`);
    } else {
      results.warnings.push(`⚠️ Missing: ${check.message}`);
    }
  });
}

function auditPackageJson(results) {
  log('\n📦 Package.json Audit', 'yellow');
  
  const packagePath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Check for heavy dependencies
  const heavyDependencies = [
    'moment', // Should use date-fns or dayjs
    'lodash', // Should use lodash-es or individual functions
    'jquery', // Should avoid in React apps
    'bootstrap', // Heavy CSS framework
  ];
  
  const foundHeavyDeps = heavyDependencies.filter(dep => 
    packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]
  );
  
  if (foundHeavyDeps.length > 0) {
    results.warnings.push(`Heavy dependencies found: ${foundHeavyDeps.join(', ')}`);
  } else {
    results.passed.push('✅ No heavy dependencies detected');
  }
  
  // Check for performance scripts
  const perfScripts = ['analyze', 'perf:audit', 'build:analyze'];
  const hasPerformanceScripts = perfScripts.some(script => packageJson.scripts?.[script]);
  
  if (hasPerformanceScripts) {
    results.passed.push('✅ Performance analysis scripts available');
  } else {
    results.suggestions.push('Add performance analysis scripts');
  }
  
  // Check dependency count
  const totalDeps = Object.keys(packageJson.dependencies || {}).length;
  if (totalDeps > 50) {
    results.warnings.push(`High dependency count: ${totalDeps} dependencies`);
  } else {
    results.passed.push(`✅ Reasonable dependency count: ${totalDeps}`);
  }
}

function auditSourceCode(results) {
  log('\n💻 Source Code Audit', 'yellow');
  
  const srcDir = path.join(process.cwd(), 'src');
  
  if (!fs.existsSync(srcDir)) {
    results.critical.push('Source directory not found');
    return;
  }
  
  // Check for dynamic imports
  const hasLazyLoading = checkForPattern(srcDir, /lazy\(|dynamic\(/);
  if (hasLazyLoading) {
    results.passed.push('✅ Lazy loading implemented');
  } else {
    results.suggestions.push('Implement lazy loading for large components');
  }
  
  // Check for React.memo usage
  const hasMemoization = checkForPattern(srcDir, /React\.memo|memo\(/);
  if (hasMemoization) {
    results.passed.push('✅ Component memoization found');
  } else {
    results.suggestions.push('Add React.memo for expensive components');
  }
  
  // Check for useCallback/useMemo
  const hasHookOptimization = checkForPattern(srcDir, /useCallback|useMemo/);
  if (hasHookOptimization) {
    results.passed.push('✅ Hook optimization found');
  } else {
    results.suggestions.push('Use useCallback/useMemo for expensive operations');
  }
  
  // Check for large files
  const largeFiles = findLargeFiles(srcDir, 50 * 1024); // 50KB
  if (largeFiles.length > 0) {
    results.warnings.push(`Large files found: ${largeFiles.slice(0, 3).map(f => f.name).join(', ')}`);
  } else {
    results.passed.push('✅ No excessively large source files');
  }
}

function auditAssets(results) {
  log('\n🖼️  Assets Audit', 'yellow');
  
  const publicDir = path.join(process.cwd(), 'public');
  
  if (!fs.existsSync(publicDir)) {
    results.suggestions.push('Create public directory for static assets');
    return;
  }
  
  // Check for unoptimized images
  const imageFiles = findFilesByExtension(publicDir, ['.jpg', '.jpeg', '.png', '.gif']);
  const largeImages = imageFiles.filter(file => file.size > 500 * 1024); // 500KB
  
  if (largeImages.length > 0) {
    results.warnings.push(`Large images found: ${largeImages.slice(0, 3).map(f => f.name).join(', ')}`);
  } else if (imageFiles.length > 0) {
    results.passed.push('✅ Image sizes are reasonable');
  }
  
  // Check for modern image formats
  const modernFormats = findFilesByExtension(publicDir, ['.webp', '.avif']);
  if (modernFormats.length > 0) {
    results.passed.push('✅ Modern image formats in use');
  } else if (imageFiles.length > 0) {
    results.suggestions.push('Consider using WebP/AVIF formats for better compression');
  }
}

function auditCaching(results) {
  log('\n🗄️  Caching Strategy Audit', 'yellow');
  
  // Check for service worker
  const swPath = path.join(process.cwd(), 'public', 'sw.js');
  if (fs.existsSync(swPath)) {
    results.passed.push('✅ Service worker found');
  } else {
    results.suggestions.push('Consider implementing service worker for caching');
  }
  
  // Check for API caching implementation
  const apiDir = path.join(process.cwd(), 'src', 'app', 'api');
  if (fs.existsSync(apiDir)) {
    const hasCaching = checkForPattern(apiDir, /Cache-Control|ETag|max-age/);
    if (hasCaching) {
      results.passed.push('✅ API caching headers implemented');
    } else {
      results.warnings.push('API endpoints missing caching headers');
    }
  }
}

// Helper functions
function checkForPattern(dir, pattern) {
  const files = getAllFiles(dir, ['.ts', '.tsx', '.js', '.jsx']);
  return files.some(file => {
    try {
      const content = fs.readFileSync(file, 'utf8');
      return pattern.test(content);
    } catch (error) {
      return false;
    }
  });
}

function findLargeFiles(dir, sizeThreshold) {
  const files = getAllFiles(dir, ['.ts', '.tsx', '.js', '.jsx']);
  return files
    .map(file => ({
      name: path.basename(file),
      path: file,
      size: fs.statSync(file).size
    }))
    .filter(file => file.size > sizeThreshold)
    .sort((a, b) => b.size - a.size);
}

function findFilesByExtension(dir, extensions) {
  const files = getAllFiles(dir, extensions);
  return files.map(file => ({
    name: path.basename(file),
    path: file,
    size: fs.statSync(file).size
  }));
}

function getAllFiles(dir, extensions) {
  const files = [];
  
  function traverse(currentDir) {
    try {
      const items = fs.readdirSync(currentDir);
      
      items.forEach(item => {
        const itemPath = path.join(currentDir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          traverse(itemPath);
        } else if (stat.isFile() && extensions.some(ext => item.endsWith(ext))) {
          files.push(itemPath);
        }
      });
    } catch (error) {
      // Skip directories we can't read
    }
  }
  
  traverse(dir);
  return files;
}

function displayAuditResults(results) {
  log('\n📊 Audit Results Summary', 'bright');
  log('-' .repeat(40), 'bright');
  
  if (results.critical.length > 0) {
    log(`\n🚨 Critical Issues (${results.critical.length}):`, 'red');
    results.critical.forEach(issue => log(`  ${issue}`, 'red'));
  }
  
  if (results.warnings.length > 0) {
    log(`\n⚠️  Warnings (${results.warnings.length}):`, 'yellow');
    results.warnings.forEach(warning => log(`  ${warning}`, 'yellow'));
  }
  
  if (results.suggestions.length > 0) {
    log(`\n💡 Suggestions (${results.suggestions.length}):`, 'blue');
    results.suggestions.forEach(suggestion => log(`  ${suggestion}`, 'blue'));
  }
  
  if (results.passed.length > 0) {
    log(`\n✅ Passed Checks (${results.passed.length}):`, 'green');
    results.passed.forEach(check => log(`  ${check}`, 'green'));
  }
}

function provideActionPlan(results) {
  log('\n🎯 Performance Action Plan', 'magenta');
  log('=' .repeat(40), 'magenta');
  
  const totalIssues = results.critical.length + results.warnings.length;
  const score = Math.max(0, 100 - (results.critical.length * 20) - (results.warnings.length * 10) - (results.suggestions.length * 2));
  
  log(`\nPerformance Score: ${score}/100`, score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red');
  
  if (totalIssues === 0) {
    log('\n🎉 Excellent! Your application is well optimized.', 'green');
    return;
  }
  
  log('\n📋 Immediate Actions (Priority Order):', 'bright');
  
  const actions = [
    {
      condition: results.critical.length > 0,
      action: '1. Fix critical issues first - these significantly impact performance',
      color: 'red'
    },
    {
      condition: results.warnings.some(w => w.includes('Heavy dependencies')),
      action: '2. Replace heavy dependencies with lighter alternatives',
      color: 'yellow'
    },
    {
      condition: results.warnings.some(w => w.includes('Large files')),
      action: '3. Split large components into smaller, lazy-loaded modules',
      color: 'yellow'
    },
    {
      condition: results.suggestions.some(s => s.includes('lazy loading')),
      action: '4. Implement code splitting and lazy loading',
      color: 'blue'
    },
    {
      condition: results.suggestions.some(s => s.includes('memoization')),
      action: '5. Add React.memo and hook optimizations',
      color: 'blue'
    },
    {
      condition: results.warnings.some(w => w.includes('caching')),
      action: '6. Implement proper caching strategies',
      color: 'yellow'
    }
  ];
  
  actions
    .filter(action => action.condition)
    .forEach(action => log(`  ${action.action}`, action.color));
  
  log('\n🚀 Quick Wins:', 'green');
  log('  • Enable Next.js Turbo mode: npm run dev:turbo', 'green');
  log('  • Use Next.js Image component for all images', 'green');
  log('  • Add loading="lazy" to non-critical images', 'green');
  log('  • Implement proper error boundaries', 'green');
  log('  • Use React DevTools Profiler to identify bottlenecks', 'green');
  
  log('\n📈 Monitoring:', 'cyan');
  log('  • Run this audit regularly: npm run perf:audit', 'cyan');
  log('  • Monitor bundle size: npm run analyze', 'cyan');
  log('  • Use Lighthouse for runtime performance', 'cyan');
  log('  • Set up performance budgets in CI/CD', 'cyan');
}

// Run the audit
if (require.main === module) {
  performanceAudit();
}

module.exports = { performanceAudit };