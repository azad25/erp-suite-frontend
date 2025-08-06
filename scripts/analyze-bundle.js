#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * Analyzes the Next.js bundle for performance optimization opportunities
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

function analyzeBundleSize() {
    log('\n🔍 Bundle Size Analysis', 'cyan');
    log('='.repeat(50), 'cyan');

    const buildDir = path.join(process.cwd(), '.next');

    if (!fs.existsSync(buildDir)) {
        log('❌ Build directory not found. Run "npm run build" first.', 'red');
        return;
    }

    // Analyze static chunks
    const staticDir = path.join(buildDir, 'static');
    if (fs.existsSync(staticDir)) {
        analyzeStaticAssets(staticDir);
    }

    // Analyze server chunks
    const serverDir = path.join(buildDir, 'server');
    if (fs.existsSync(serverDir)) {
        analyzeServerAssets(serverDir);
    }

    // Provide optimization recommendations
    provideOptimizationRecommendations();
}

function analyzeStaticAssets(staticDir) {
    log('\n📦 Static Assets Analysis:', 'yellow');

    const jsDir = path.join(staticDir, 'chunks');
    const cssDir = path.join(staticDir, 'css');

    if (fs.existsSync(jsDir)) {
        const jsFiles = getFilesRecursively(jsDir, '.js');
        const totalJSSize = jsFiles.reduce((total, file) => total + getFileSize(file.path), 0);

        log(`JavaScript Files: ${jsFiles.length}`, 'bright');
        log(`Total JS Size: ${formatBytes(totalJSSize)}`, 'bright');

        // Find large JS files
        const largeFiles = jsFiles
            .filter(file => file.size > 100 * 1024) // > 100KB
            .sort((a, b) => b.size - a.size)
            .slice(0, 10);

        if (largeFiles.length > 0) {
            log('\n🚨 Large JavaScript Files (>100KB):', 'red');
            largeFiles.forEach(file => {
                log(`  ${file.name}: ${formatBytes(file.size)}`, 'red');
            });
        }
    }

    if (fs.existsSync(cssDir)) {
        const cssFiles = getFilesRecursively(cssDir, '.css');
        const totalCSSSize = cssFiles.reduce((total, file) => total + file.size, 0);

        log(`\nCSS Files: ${cssFiles.length}`, 'bright');
        log(`Total CSS Size: ${formatBytes(totalCSSSize)}`, 'bright');
    }
}

function analyzeServerAssets(serverDir) {
    log('\n🖥️  Server Assets Analysis:', 'yellow');

    const appDir = path.join(serverDir, 'app');
    if (fs.existsSync(appDir)) {
        const serverFiles = getFilesRecursively(appDir, '.js');
        const totalServerSize = serverFiles.reduce((total, file) => total + file.size, 0);

        log(`Server Files: ${serverFiles.length}`, 'bright');
        log(`Total Server Size: ${formatBytes(totalServerSize)}`, 'bright');
    }
}

function getFilesRecursively(dir, extension) {
    const files = [];

    function traverse(currentDir) {
        const items = fs.readdirSync(currentDir);

        items.forEach(item => {
            const itemPath = path.join(currentDir, item);
            const stat = fs.statSync(itemPath);

            if (stat.isDirectory()) {
                traverse(itemPath);
            } else if (item.endsWith(extension)) {
                files.push({
                    name: item,
                    path: itemPath,
                    size: stat.size,
                });
            }
        });
    }

    traverse(dir);
    return files;
}

function getFileSize(filePath) {
    try {
        return fs.statSync(filePath).size;
    } catch (error) {
        return 0;
    }
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function provideOptimizationRecommendations() {
    log('\n💡 Optimization Recommendations:', 'green');
    log('='.repeat(50), 'green');

    const recommendations = [
        '1. Enable dynamic imports for large components',
        '2. Use Next.js Image component for optimized images',
        '3. Implement code splitting at route level',
        '4. Remove unused dependencies from package.json',
        '5. Enable compression in production',
        '6. Use tree shaking for unused code elimination',
        '7. Consider lazy loading for non-critical components',
        '8. Optimize third-party libraries (use lighter alternatives)',
        '9. Enable bundle analyzer: npm install --save-dev @next/bundle-analyzer',
        '10. Use Next.js built-in optimizations (SWC, etc.)',
    ];

    recommendations.forEach(rec => {
        log(`  ${rec}`, 'green');
    });

    log('\n🔧 Quick Fixes:', 'magenta');
    log('  • Add "sideEffects": false to package.json for better tree shaking', 'magenta');
    log('  • Use dynamic imports: const Component = dynamic(() => import("./Component"))', 'magenta');
    log('  • Enable experimental.optimizePackageImports in next.config.js', 'magenta');
    log('  • Use React.memo() for expensive components', 'magenta');
}

// Run the analysis
if (require.main === module) {
    analyzeBundleSize();
}

module.exports = { analyzeBundleSize };