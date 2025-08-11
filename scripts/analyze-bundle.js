#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Bundle analyzer for Next.js applications
class BundleAnalyzer {
  constructor() {
    this.buildDir = path.join(process.cwd(), '.next');
    this.results = {
      pages: {},
      chunks: {},
      totalSize: 0,
      recommendations: [],
    };
  }

  async analyze() {
    console.log('📊 Analyzing bundle...\n');

    if (!fs.existsSync(this.buildDir)) {
      console.error('❌ Build directory not found. Run "npm run build" first.');
      process.exit(1);
    }

    try {
      await this.analyzePages();
      await this.analyzeChunks();
      this.generateRecommendations();
      this.printResults();
    } catch (error) {
      console.error('Error analyzing bundle:', error);
      process.exit(1);
    }
  }

  async analyzePages() {
    const pagesManifest = path.join(this.buildDir, 'server/pages-manifest.json');
    
    if (!fs.existsSync(pagesManifest)) {
      console.log('⚠️  Pages manifest not found, skipping page analysis');
      return;
    }

    try {
      const manifest = JSON.parse(fs.readFileSync(pagesManifest, 'utf8'));
      
      for (const [route, file] of Object.entries(manifest)) {
        const filePath = path.join(this.buildDir, 'server', file);
        
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          this.results.pages[route] = {
            file,
            size: stats.size,
            sizeFormatted: this.formatBytes(stats.size),
          };
          this.results.totalSize += stats.size;
        }
      }
    } catch (error) {
      console.log('⚠️  Could not analyze pages:', error.message);
    }
  }

  async analyzeChunks() {
    const staticDir = path.join(this.buildDir, 'static');
    
    if (!fs.existsSync(staticDir)) {
      console.log('⚠️  Static directory not found, skipping chunk analysis');
      return;
    }

    try {
      const chunks = this.findChunks(staticDir);
      
      chunks.forEach(chunk => {
        const stats = fs.statSync(chunk.path);
        const relativePath = path.relative(this.buildDir, chunk.path);
        
        this.results.chunks[relativePath] = {
          type: chunk.type,
          size: stats.size,
          sizeFormatted: this.formatBytes(stats.size),
        };
        
        this.results.totalSize += stats.size;
      });
    } catch (error) {
      console.log('⚠️  Could not analyze chunks:', error.message);
    }
  }

  findChunks(dir) {
    const chunks = [];
    
    const scanDirectory = (currentDir) => {
      try {
        const items = fs.readdirSync(currentDir);
        
        items.forEach(item => {
          const fullPath = path.join(currentDir, item);
          const stats = fs.statSync(fullPath);
          
          if (stats.isDirectory()) {
            scanDirectory(fullPath);
          } else if (this.isChunkFile(item)) {
            chunks.push({
              path: fullPath,
              name: item,
              type: this.getChunkType(item),
            });
          }
        });
      } catch (error) {
        // Ignore permission errors
      }
    };

    scanDirectory(dir);
    return chunks;
  }

  isChunkFile(filename) {
    return filename.endsWith('.js') || 
           filename.endsWith('.css') || 
           filename.endsWith('.wasm');
  }

  getChunkType(filename) {
    if (filename.includes('framework')) return 'framework';
    if (filename.includes('main')) return 'main';
    if (filename.includes('webpack')) return 'webpack';
    if (filename.includes('commons')) return 'commons';
    if (filename.endsWith('.css')) return 'css';
    if (filename.includes('pages/')) return 'page';
    return 'chunk';
  }

  generateRecommendations() {
    const largePages = Object.entries(this.results.pages)
      .filter(([, data]) => data.size > 500 * 1024) // 500KB
      .map(([route]) => route);

    const largeChunks = Object.entries(this.results.chunks)
      .filter(([, data]) => data.size > 1024 * 1024) // 1MB
      .map(([chunk]) => chunk);

    if (largePages.length > 0) {
      this.results.recommendations.push({
        type: 'large-pages',
        message: `Large pages detected: ${largePages.join(', ')}`,
        suggestion: 'Consider code splitting or lazy loading for these pages',
      });
    }

    if (largeChunks.length > 0) {
      this.results.recommendations.push({
        type: 'large-chunks',
        message: `Large chunks detected: ${largeChunks.join(', ')}`,
        suggestion: 'Consider splitting these chunks further',
      });
    }

    if (this.results.totalSize > 5 * 1024 * 1024) { // 5MB
      this.results.recommendations.push({
        type: 'total-size',
        message: `Total bundle size is ${this.formatBytes(this.results.totalSize)}`,
        suggestion: 'Consider aggressive code splitting and tree shaking',
      });
    }

    // Check for duplicate dependencies
    const chunkNames = Object.keys(this.results.chunks);
    const possibleDuplicates = this.findPossibleDuplicates(chunkNames);
    
    if (possibleDuplicates.length > 0) {
      this.results.recommendations.push({
        type: 'duplicates',
        message: `Possible duplicate chunks: ${possibleDuplicates.join(', ')}`,
        suggestion: 'Review webpack configuration for chunk optimization',
      });
    }
  }

  findPossibleDuplicates(chunkNames) {
    const duplicates = [];
    const seen = new Set();
    
    chunkNames.forEach(chunk => {
      const baseName = chunk.replace(/\.[a-f0-9]+\./, '.').replace(/\d+\./, '');
      if (seen.has(baseName)) {
        duplicates.push(chunk);
      } else {
        seen.add(baseName);
      }
    });
    
    return duplicates;
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  printResults() {
    console.log('='.repeat(60));
    console.log('📦 BUNDLE ANALYSIS RESULTS');
    console.log('='.repeat(60));

    // Total size
    console.log(`\n📊 Total Bundle Size: ${this.formatBytes(this.results.totalSize)}`);

    // Pages analysis
    if (Object.keys(this.results.pages).length > 0) {
      console.log('\n📄 Pages:');
      const sortedPages = Object.entries(this.results.pages)
        .sort(([,a], [,b]) => b.size - a.size)
        .slice(0, 10); // Top 10 largest pages

      sortedPages.forEach(([route, data]) => {
        console.log(`  ${route.padEnd(30)} ${data.sizeFormatted.padStart(10)}`);
      });

      if (Object.keys(this.results.pages).length > 10) {
        console.log(`  ... and ${Object.keys(this.results.pages).length - 10} more pages`);
      }
    }

    // Chunks analysis
    if (Object.keys(this.results.chunks).length > 0) {
      console.log('\n🧩 Chunks:');
      const sortedChunks = Object.entries(this.results.chunks)
        .sort(([,a], [,b]) => b.size - a.size)
        .slice(0, 15); // Top 15 largest chunks

      sortedChunks.forEach(([chunk, data]) => {
        const name = path.basename(chunk);
        const type = `[${data.type}]`;
        console.log(`  ${name.padEnd(40)} ${type.padEnd(12)} ${data.sizeFormatted.padStart(10)}`);
      });

      if (Object.keys(this.results.chunks).length > 15) {
        console.log(`  ... and ${Object.keys(this.results.chunks).length - 15} more chunks`);
      }
    }

    // Recommendations
    if (this.results.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      this.results.recommendations.forEach((rec, index) => {
        console.log(`\n  ${index + 1}. ${rec.message}`);
        console.log(`     💡 ${rec.suggestion}`);
      });
    }

    // Performance assessment
    console.log('\n' + '='.repeat(60));
    this.printPerformanceAssessment();
  }

  printPerformanceAssessment() {
    const totalSizeMB = this.results.totalSize / (1024 * 1024);
    
    console.log('🎯 Performance Assessment:');
    
    if (totalSizeMB < 1) {
      console.log('🎉 Excellent! Bundle size is under 1MB');
    } else if (totalSizeMB < 3) {
      console.log('👍 Good! Bundle size is reasonable');
    } else if (totalSizeMB < 5) {
      console.log('⚠️  Warning! Bundle size is getting large');
    } else {
      console.log('🚨 Critical! Bundle size is too large');
    }

    console.log('\n📋 Quick Optimization Checklist:');
    console.log('  □ Enable gzip/brotli compression');
    console.log('  □ Implement code splitting');
    console.log('  □ Use dynamic imports for large components');
    console.log('  □ Optimize images and assets');
    console.log('  □ Remove unused dependencies');
    console.log('  □ Enable tree shaking');
    console.log('  □ Use production builds');
  }
}

// Run the analyzer
if (require.main === module) {
  const analyzer = new BundleAnalyzer();
  analyzer.analyze().catch(console.error);
}

module.exports = BundleAnalyzer;