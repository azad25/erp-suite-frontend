#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting ERP Frontend Performance Optimization...\n');

// 1. Optimize package.json for faster installs
function optimizePackageJson() {
  console.log('📦 Optimizing package.json...');
  
  const packagePath = path.join(__dirname, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  // Add performance optimizations
  packageJson.sideEffects = false;
  
  // Optimize scripts for performance
  packageJson.scripts = {
    ...packageJson.scripts,
    'dev': 'next dev --turbo',
    'dev:fast': 'next dev --turbo --experimental-https',
    'build': 'next build',
    'build:fast': 'next build --experimental-build-mode=compile',
    'start': 'next start',
    'start:fast': 'next start --turbo'
  };
  
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log('✅ Package.json optimized');
}

// 2. Create performance monitoring utilities
function createPerformanceUtils() {
  console.log('📊 Creating performance monitoring utilities...');
  
  const perfUtilsDir = path.join(__dirname, '..', 'src', 'utils', 'performance');
  if (!fs.existsSync(perfUtilsDir)) {
    fs.mkdirSync(perfUtilsDir, { recursive: true });
  }
  
  // Performance metrics utility
  const perfMetricsContent = `
export class PerformanceMetrics {
  private static instance: PerformanceMetrics;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMetrics {
    if (!PerformanceMetrics.instance) {
      PerformanceMetrics.instance = new PerformanceMetrics();
    }
    return PerformanceMetrics.instance;
  }

  startTiming(label: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (!this.metrics.has(label)) {
        this.metrics.set(label, []);
      }
      
      this.metrics.get(label)!.push(duration);
      
      // Log slow operations
      if (duration > 1000) {
        console.warn(\`🐌 Slow operation "\${label}": \${duration.toFixed(2)}ms\`);
      }
      
      return duration;
    };
  }

  getAverageTime(label: string): number {
    const times = this.metrics.get(label);
    if (!times || times.length === 0) return 0;
    
    return times.reduce((sum, time) => sum + time, 0) / times.length;
  }

  getMetrics(): Record<string, { average: number; count: number; total: number }> {
    const result: Record<string, { average: number; count: number; total: number }> = {};
    
    this.metrics.forEach((times, label) => {
      const total = times.reduce((sum, time) => sum + time, 0);
      result[label] = {
        average: total / times.length,
        count: times.length,
        total
      };
    });
    
    return result;
  }

  clearMetrics(): void {
    this.metrics.clear();
  }
}

export const perfMetrics = PerformanceMetrics.getInstance();
`;
  
  fs.writeFileSync(
    path.join(perfUtilsDir, 'metrics.ts'),
    perfMetricsContent.trim()
  );
  
  console.log('✅ Performance utilities created');
}

// 3. Create optimized component templates
function createOptimizedComponents() {
  console.log('⚡ Creating optimized component templates...');
  
  const componentsDir = path.join(__dirname, '..', 'src', 'components', 'optimized');
  if (!fs.existsSync(componentsDir)) {
    fs.mkdirSync(componentsDir, { recursive: true });
  }
  
  // Optimized button component
  const optimizedButtonContent = `
import React, { memo, forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface OptimizedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const OptimizedButton = memo(forwardRef<HTMLButtonElement, OptimizedButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const variants = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
      ghost: 'hover:bg-accent hover:text-accent-foreground'
    };
    
    const sizes = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 py-2',
      lg: 'h-11 px-8'
    };
    
    return (
      <button
        ref={ref}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
));

OptimizedButton.displayName = 'OptimizedButton';

export default OptimizedButton;
`;
  
  fs.writeFileSync(
    path.join(componentsDir, 'OptimizedButton.tsx'),
    optimizedButtonContent.trim()
  );
  
  console.log('✅ Optimized components created');
}

// 4. Create bundle analysis script
function createBundleAnalysis() {
  console.log('📈 Creating bundle analysis tools...');
  
  const scriptsDir = path.join(__dirname);
  
  const bundleAnalysisContent = `
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('📊 Analyzing bundle size...');

try {
  // Build the project
  console.log('Building project...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Check if .next directory exists
  const nextDir = path.join(__dirname, '..', '.next');
  if (!fs.existsSync(nextDir)) {
    console.error('❌ .next directory not found. Build may have failed.');
    process.exit(1);
  }
  
  // Analyze bundle
  const staticDir = path.join(nextDir, 'static');
  if (fs.existsSync(staticDir)) {
    const chunks = fs.readdirSync(path.join(staticDir, 'chunks')).filter(f => f.endsWith('.js'));
    
    console.log('\\n📦 Bundle Analysis:');
    console.log('==================');
    
    chunks.forEach(chunk => {
      const chunkPath = path.join(staticDir, 'chunks', chunk);
      const stats = fs.statSync(chunkPath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      
      if (stats.size > 100000) { // > 100KB
        console.log(\`🔴 Large chunk: \${chunk} (\${sizeKB}KB)\`);
      } else if (stats.size > 50000) { // > 50KB
        console.log(\`🟡 Medium chunk: \${chunk} (\${sizeKB}KB)\`);
      } else {
        console.log(\`🟢 Small chunk: \${chunk} (\${sizeKB}KB)\`);
      }
    });
  }
  
  console.log('\\n✅ Bundle analysis complete');
  
} catch (error) {
  console.error('❌ Bundle analysis failed:', error.message);
  process.exit(1);
}
`;
  
  fs.writeFileSync(
    path.join(scriptsDir, 'analyze-bundle.js'),
    bundleAnalysisContent.trim()
  );
  
  console.log('✅ Bundle analysis tools created');
}

// 5. Create performance audit script
function createPerformanceAudit() {
  console.log('🔍 Creating performance audit script...');
  
  const scriptsDir = path.join(__dirname);
  
  const auditContent = `
const fs = require('fs');
const path = require('path');

console.log('🔍 Running Performance Audit...');
console.log('================================\\n');

// Check for common performance issues
const srcDir = path.join(__dirname, '..', 'src');

function auditComponents(dir) {
  const issues = [];
  
  function scanDirectory(currentDir) {
    const files = fs.readdirSync(currentDir);
    
    files.forEach(file => {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        scanDirectory(filePath);
      } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for missing React.memo
        if (content.includes('export default function') && !content.includes('memo(')) {
          issues.push(\`⚠️  Consider using React.memo: \${path.relative(srcDir, filePath)}\`);
        }
        
        // Check for large inline objects/arrays
        if (content.match(/\\{[^}]{200,}\\}/g)) {
          issues.push(\`⚠️  Large inline object detected: \${path.relative(srcDir, filePath)}\`);
        }
        
        // Check for missing key props in lists
        if (content.includes('.map(') && !content.includes('key=')) {
          issues.push(\`⚠️  Missing key prop in map: \${path.relative(srcDir, filePath)}\`);
        }
        
        // Check for console.log statements
        if (content.includes('console.log')) {
          issues.push(\`🐛 Console.log found: \${path.relative(srcDir, filePath)}\`);
        }
      }
    });
  }
  
  scanDirectory(dir);
  return issues;
}

const issues = auditComponents(srcDir);

if (issues.length === 0) {
  console.log('✅ No performance issues found!');
} else {
  console.log(\`Found \${issues.length} potential issues:\\n\`);
  issues.forEach(issue => console.log(issue));
  console.log('\\n💡 Consider addressing these issues for better performance.');
}

console.log('\\n🔍 Performance audit complete');
`;
  
  fs.writeFileSync(
    path.join(scriptsDir, 'performance-audit.js'),
    auditContent.trim()
  );
  
  console.log('✅ Performance audit script created');
}

// Run all optimizations
async function runOptimizations() {
  try {
    optimizePackageJson();
    createPerformanceUtils();
    createOptimizedComponents();
    createBundleAnalysis();
    createPerformanceAudit();
    
    console.log('\n🎉 Performance optimization complete!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run dev:fast');
    console.log('2. Run: npm run perf:test');
    console.log('3. Monitor navigation times in browser console');
    
  } catch (error) {
    console.error('❌ Optimization failed:', error.message);
    process.exit(1);
  }
}

runOptimizations();