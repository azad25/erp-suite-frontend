#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Performance audit script for the ERP frontend
class PerformanceAuditor {
  constructor() {
    this.results = {
      bundleSize: {},
      componentCount: 0,
      unusedDependencies: [],
      largeFiles: [],
      recommendations: [],
    };
  }

  // Analyze bundle sizes
  analyzeBundleSize() {
    const buildDir = path.join(process.cwd(), '.next');
    
    if (!fs.existsSync(buildDir)) {
      console.log('❌ Build directory not found. Run "npm run build" first.');
      return;
    }

    try {
      const staticDir = path.join(buildDir, 'static');
      if (fs.existsSync(staticDir)) {
        this.analyzeDirectory(staticDir, 'static');
      }

      const serverDir = path.join(buildDir, 'server');
      if (fs.existsSync(serverDir)) {
        this.analyzeDirectory(serverDir, 'server');
      }
    } catch (error) {
      console.error('Error analyzing bundle size:', error.message);
    }
  }

  analyzeDirectory(dir, type) {
    const files = this.getFilesRecursively(dir);
    let totalSize = 0;

    files.forEach(file => {
      const stats = fs.statSync(file);
      const size = stats.size;
      totalSize += size;

      // Flag large files (>500KB)
      if (size > 500 * 1024) {
        this.results.largeFiles.push({
          file: path.relative(process.cwd(), file),
          size: this.formatBytes(size),
        });
      }
    });

    this.results.bundleSize[type] = {
      totalSize: this.formatBytes(totalSize),
      fileCount: files.length,
    };
  }

  getFilesRecursively(dir) {
    let files = [];
    
    try {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          files = files.concat(this.getFilesRecursively(fullPath));
        } else {
          files.push(fullPath);
        }
      });
    } catch (error) {
      // Ignore permission errors
    }
    
    return files;
  }

  // Analyze component usage
  analyzeComponents() {
    const srcDir = path.join(process.cwd(), 'src');
    
    if (!fs.existsSync(srcDir)) {
      return;
    }

    const componentFiles = this.findComponentFiles(srcDir);
    this.results.componentCount = componentFiles.length;

    // Check for potential optimizations
    componentFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for missing React.memo
      if (content.includes('export default') && !content.includes('memo(') && !content.includes('React.memo')) {
        this.results.recommendations.push({
          type: 'memoization',
          file: path.relative(process.cwd(), file),
          message: 'Consider using React.memo for this component',
        });
      }

      // Check for large components (>500 lines)
      const lineCount = content.split('\n').length;
      if (lineCount > 500) {
        this.results.recommendations.push({
          type: 'component-size',
          file: path.relative(process.cwd(), file),
          message: `Large component (${lineCount} lines) - consider splitting`,
        });
      }
    });
  }

  findComponentFiles(dir) {
    let files = [];
    
    try {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
          files = files.concat(this.findComponentFiles(fullPath));
        } else if (item.endsWith('.tsx') || item.endsWith('.jsx')) {
          files.push(fullPath);
        }
      });
    } catch (error) {
      // Ignore permission errors
    }
    
    return files;
  }

  // Check for unused dependencies
  analyzeUnusedDependencies() {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
      
      const srcDir = path.join(process.cwd(), 'src');
      const allFiles = this.getFilesRecursively(srcDir);
      
      // Read all source files
      let allContent = '';
      allFiles.forEach(file => {
        if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx')) {
          try {
            allContent += fs.readFileSync(file, 'utf8') + '\n';
          } catch (error) {
            // Ignore read errors
          }
        }
      });

      // Check which dependencies are not imported
      Object.keys(dependencies).forEach(dep => {
        const importPatterns = [
          new RegExp(`from ['"]${dep}['"]`, 'g'),
          new RegExp(`import ['"]${dep}['"]`, 'g'),
          new RegExp(`require\\(['"]${dep}['"]\\)`, 'g'),
        ];

        const isUsed = importPatterns.some(pattern => pattern.test(allContent));
        
        if (!isUsed && !this.isEssentialDependency(dep)) {
          this.results.unusedDependencies.push(dep);
        }
      });
    } catch (error) {
      console.error('Error analyzing dependencies:', error.message);
    }
  }

  isEssentialDependency(dep) {
    const essential = [
      'next',
      'react',
      'react-dom',
      'typescript',
      '@types/node',
      '@types/react',
      '@types/react-dom',
      'eslint',
      'tailwindcss',
      'postcss',
      'autoprefixer',
    ];
    
    return essential.includes(dep) || dep.startsWith('@types/');
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Generate performance recommendations
  generateRecommendations() {
    // Bundle size recommendations
    if (this.results.largeFiles.length > 0) {
      this.results.recommendations.push({
        type: 'bundle-optimization',
        message: `Found ${this.results.largeFiles.length} large files. Consider code splitting or lazy loading.`,
      });
    }

    // Unused dependencies
    if (this.results.unusedDependencies.length > 0) {
      this.results.recommendations.push({
        type: 'dependency-cleanup',
        message: `Found ${this.results.unusedDependencies.length} potentially unused dependencies.`,
      });
    }

    // Component count
    if (this.results.componentCount > 100) {
      this.results.recommendations.push({
        type: 'component-organization',
        message: `High component count (${this.results.componentCount}). Consider better organization and lazy loading.`,
      });
    }
  }

  // Run the complete audit
  async run() {
    console.log('🔍 Starting performance audit...\n');

    console.log('📦 Analyzing bundle size...');
    this.analyzeBundleSize();

    console.log('🧩 Analyzing components...');
    this.analyzeComponents();

    console.log('📋 Checking dependencies...');
    this.analyzeUnusedDependencies();

    console.log('💡 Generating recommendations...');
    this.generateRecommendations();

    this.printResults();
  }

  printResults() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 PERFORMANCE AUDIT RESULTS');
    console.log('='.repeat(60));

    // Bundle size
    console.log('\n📦 Bundle Analysis:');
    Object.entries(this.results.bundleSize).forEach(([type, data]) => {
      console.log(`  ${type}: ${data.totalSize} (${data.fileCount} files)`);
    });

    // Large files
    if (this.results.largeFiles.length > 0) {
      console.log('\n⚠️  Large Files:');
      this.results.largeFiles.forEach(file => {
        console.log(`  ${file.file}: ${file.size}`);
      });
    }

    // Components
    console.log(`\n🧩 Components: ${this.results.componentCount} total`);

    // Unused dependencies
    if (this.results.unusedDependencies.length > 0) {
      console.log('\n📋 Potentially Unused Dependencies:');
      this.results.unusedDependencies.forEach(dep => {
        console.log(`  - ${dep}`);
      });
    }

    // Recommendations
    if (this.results.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      this.results.recommendations.forEach((rec, index) => {
        console.log(`  ${index + 1}. [${rec.type}] ${rec.message}`);
        if (rec.file) {
          console.log(`     File: ${rec.file}`);
        }
      });
    }

    console.log('\n✅ Audit complete!');
    
    // Performance score
    const score = this.calculatePerformanceScore();
    console.log(`\n🎯 Performance Score: ${score}/100`);
    
    if (score >= 90) {
      console.log('🎉 Excellent performance!');
    } else if (score >= 70) {
      console.log('👍 Good performance, room for improvement.');
    } else {
      console.log('⚠️  Performance needs attention.');
    }
  }

  calculatePerformanceScore() {
    let score = 100;

    // Deduct points for issues
    score -= this.results.largeFiles.length * 10;
    score -= this.results.unusedDependencies.length * 2;
    score -= Math.max(0, (this.results.componentCount - 50) * 0.5);
    score -= this.results.recommendations.filter(r => r.type === 'memoization').length * 3;

    return Math.max(0, Math.round(score));
  }
}

// Run the audit
if (require.main === module) {
  const auditor = new PerformanceAuditor();
  auditor.run().catch(console.error);
}

module.exports = PerformanceAuditor;