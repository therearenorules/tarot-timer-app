#!/usr/bin/env node
/**
 * Web Configuration Validation Script
 * Validates Expo web configuration optimizations for production readiness
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class WebConfigValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.passed = [];
    this.projectRoot = process.cwd();
  }

  log(message, type = 'info') {
    const colors = {
      error: chalk.red,
      warning: chalk.yellow,
      success: chalk.green,
      info: chalk.blue,
      dim: chalk.dim,
    };
    
    console.log(colors[type](message));
  }

  addResult(test, status, message) {
    const result = { test, message };
    
    switch (status) {
      case 'pass':
        this.passed.push(result);
        this.log(`✅ ${test}: ${message}`, 'success');
        break;
      case 'warning':
        this.warnings.push(result);
        this.log(`⚠️  ${test}: ${message}`, 'warning');
        break;
      case 'error':
        this.errors.push(result);
        this.log(`❌ ${test}: ${message}`, 'error');
        break;
    }
  }

  fileExists(filePath) {
    return fs.existsSync(path.join(this.projectRoot, filePath));
  }

  readFile(filePath) {
    try {
      return fs.readFileSync(path.join(this.projectRoot, filePath), 'utf8');
    } catch (error) {
      return null;
    }
  }

  readJson(filePath) {
    try {
      const content = this.readFile(filePath);
      return content ? JSON.parse(content) : null;
    } catch (error) {
      return null;
    }
  }

  async validateWebpackConfig() {
    this.log('\n📦 Validating Webpack Configuration...', 'info');

    // Check if webpack config exists
    if (!this.fileExists('webpack.config.js')) {
      this.addResult('Webpack Config', 'error', 'webpack.config.js not found');
      return;
    }

    const webpackConfig = this.readFile('webpack.config.js');
    
    // Check for security headers
    if (webpackConfig.includes('getSecurityHeaders')) {
      this.addResult('Security Headers', 'pass', 'Security headers configured in webpack dev server');
    } else {
      this.addResult('Security Headers', 'warning', 'Security headers not found in webpack config');
    }

    // Check for bundle optimization
    if (webpackConfig.includes('splitChunks')) {
      this.addResult('Code Splitting', 'pass', 'Code splitting configuration found');
    } else {
      this.addResult('Code Splitting', 'warning', 'Code splitting not optimally configured');
    }

    // Check for compression
    if (webpackConfig.includes('CompressionPlugin')) {
      this.addResult('Compression', 'pass', 'Gzip/Brotli compression enabled');
    } else {
      this.addResult('Compression', 'warning', 'Asset compression not configured');
    }

    // Check for bundle analyzer
    if (webpackConfig.includes('BundleAnalyzerPlugin')) {
      this.addResult('Bundle Analysis', 'pass', 'Bundle analyzer configured');
    } else {
      this.addResult('Bundle Analysis', 'warning', 'Bundle analyzer not configured');
    }

    // Check for performance budgets
    if (webpackConfig.includes('performance')) {
      this.addResult('Performance Budgets', 'pass', 'Performance budgets configured');
    } else {
      this.addResult('Performance Budgets', 'warning', 'Performance budgets not set');
    }
  }

  async validateBabelConfig() {
    this.log('\n🔄 Validating Babel Configuration...', 'info');

    if (!this.fileExists('babel.config.js')) {
      this.addResult('Babel Config', 'error', 'babel.config.js not found');
      return;
    }

    const babelConfig = this.readFile('babel.config.js');

    // Check for production optimizations
    if (babelConfig.includes('transform-remove-console')) {
      this.addResult('Console Removal', 'pass', 'Console statements removed in production');
    } else {
      this.addResult('Console Removal', 'warning', 'Console statements not removed in production');
    }

    // Check for tree shaking
    if (babelConfig.includes('transform-imports')) {
      this.addResult('Tree Shaking', 'pass', 'Import transformations configured');
    } else {
      this.addResult('Tree Shaking', 'warning', 'Import transformations not optimized');
    }

    // Check for React optimizations
    if (babelConfig.includes('transform-react-inline-elements')) {
      this.addResult('React Optimization', 'pass', 'React element inlining enabled');
    } else {
      this.addResult('React Optimization', 'warning', 'React optimizations not fully configured');
    }
  }

  async validateMetroConfig() {
    this.log('\n🚇 Validating Metro Configuration...', 'info');

    if (!this.fileExists('metro.config.js')) {
      this.addResult('Metro Config', 'error', 'metro.config.js not found');
      return;
    }

    const metroConfig = this.readFile('metro.config.js');

    // Check for alias configuration
    if (metroConfig.includes('alias')) {
      this.addResult('Path Aliases', 'pass', 'Path aliases configured');
    } else {
      this.addResult('Path Aliases', 'warning', 'Path aliases not configured');
    }

    // Check for minification settings
    if (metroConfig.includes('minifierConfig')) {
      this.addResult('Minification', 'pass', 'Custom minification settings configured');
    } else {
      this.addResult('Minification', 'warning', 'Using default minification settings');
    }

    // Check for cache optimization
    if (metroConfig.includes('cacheVersion')) {
      this.addResult('Cache Settings', 'pass', 'Cache version specified');
    } else {
      this.addResult('Cache Settings', 'warning', 'Cache version not specified');
    }
  }

  async validateSecurityConfig() {
    this.log('\n🔒 Validating Security Configuration...', 'info');

    // Check for security utilities
    if (this.fileExists('src/utils/securityHeaders.ts')) {
      this.addResult('Security Utils', 'pass', 'Security headers utility found');
    } else {
      this.addResult('Security Utils', 'error', 'Security headers utility missing');
    }

    // Check for security config
    if (this.fileExists('src/lib/securityConfig.ts')) {
      this.addResult('Security Config', 'pass', 'Security configuration found');
    } else {
      this.addResult('Security Config', 'error', 'Security configuration missing');
    }

    // Validate HTML security headers
    if (this.fileExists('public/index.html')) {
      const html = this.readFile('public/index.html');
      
      if (html.includes('Content-Security-Policy')) {
        this.addResult('CSP Headers', 'pass', 'Content Security Policy configured');
      } else {
        this.addResult('CSP Headers', 'error', 'Content Security Policy missing');
      }

      if (html.includes('Strict-Transport-Security')) {
        this.addResult('HSTS Headers', 'pass', 'HTTP Strict Transport Security configured');
      } else {
        this.addResult('HSTS Headers', 'warning', 'HSTS headers missing');
      }

      if (html.includes('X-Frame-Options')) {
        this.addResult('Clickjacking Protection', 'pass', 'X-Frame-Options header present');
      } else {
        this.addResult('Clickjacking Protection', 'warning', 'X-Frame-Options header missing');
      }
    }
  }

  async validateMonitoringConfig() {
    this.log('\n📊 Validating Monitoring Configuration...', 'info');

    // Check for monitoring service
    if (this.fileExists('src/utils/monitoring.ts')) {
      this.addResult('Monitoring Service', 'pass', 'Monitoring service found');
    } else {
      this.addResult('Monitoring Service', 'error', 'Monitoring service missing');
    }

    // Check for error boundary
    if (this.fileExists('src/components/ErrorBoundary.tsx')) {
      this.addResult('Error Boundary', 'pass', 'Error boundary component found');
      
      const errorBoundary = this.readFile('src/components/ErrorBoundary.tsx');
      if (errorBoundary.includes('monitoringService')) {
        this.addResult('Error Reporting', 'pass', 'Error boundary integrated with monitoring');
      } else {
        this.addResult('Error Reporting', 'warning', 'Error boundary not integrated with monitoring');
      }
    } else {
      this.addResult('Error Boundary', 'error', 'Error boundary component missing');
    }

    // Check for web initializer
    if (this.fileExists('src/lib/webInitializer.ts')) {
      this.addResult('Web Initializer', 'pass', 'Web platform initializer found');
    } else {
      this.addResult('Web Initializer', 'warning', 'Web platform initializer missing');
    }
  }

  async validateCodeSplitting() {
    this.log('\n✂️  Validating Code Splitting...', 'info');

    // Check for loadable utility
    if (this.fileExists('src/utils/loadable.tsx')) {
      this.addResult('Loadable Components', 'pass', 'Loadable components utility found');
      
      const loadable = this.readFile('src/utils/loadable.tsx');
      if (loadable.includes('createRouteComponent')) {
        this.addResult('Route Splitting', 'pass', 'Route-based code splitting configured');
      } else {
        this.addResult('Route Splitting', 'warning', 'Route splitting helpers missing');
      }

      if (loadable.includes('ComponentPreloader')) {
        this.addResult('Component Preloading', 'pass', 'Component preloading utility available');
      } else {
        this.addResult('Component Preloading', 'warning', 'Component preloading not configured');
      }
    } else {
      this.addResult('Loadable Components', 'error', 'Loadable components utility missing');
    }
  }

  async validatePWAConfig() {
    this.log('\n📱 Validating PWA Configuration...', 'info');

    // Check for service worker
    if (this.fileExists('public/sw.js')) {
      this.addResult('Service Worker', 'pass', 'Service worker found');
    } else {
      this.addResult('Service Worker', 'warning', 'Service worker not found');
    }

    // Check for manifest
    if (this.fileExists('public/manifest.json')) {
      this.addResult('Web Manifest', 'pass', 'Web app manifest found');
      
      const manifest = this.readJson('public/manifest.json');
      if (manifest && manifest.icons && manifest.icons.length > 0) {
        this.addResult('PWA Icons', 'pass', 'PWA icons configured');
      } else {
        this.addResult('PWA Icons', 'warning', 'PWA icons missing or incomplete');
      }
    } else {
      this.addResult('Web Manifest', 'warning', 'Web app manifest not found');
    }

    // Check for offline support in HTML
    if (this.fileExists('public/index.html')) {
      const html = this.readFile('public/index.html');
      if (html.includes('theme-color')) {
        this.addResult('Theme Color', 'pass', 'PWA theme color configured');
      } else {
        this.addResult('Theme Color', 'warning', 'PWA theme color not configured');
      }
    }
  }

  async validatePerformanceOptimizations() {
    this.log('\n⚡ Validating Performance Optimizations...', 'info');

    if (this.fileExists('public/index.html')) {
      const html = this.readFile('public/index.html');

      // Check for resource hints
      if (html.includes('preconnect')) {
        this.addResult('Resource Hints', 'pass', 'Preconnect hints found');
      } else {
        this.addResult('Resource Hints', 'warning', 'Preconnect hints missing');
      }

      if (html.includes('preload')) {
        this.addResult('Critical Resources', 'pass', 'Critical resource preloading configured');
      } else {
        this.addResult('Critical Resources', 'warning', 'Critical resource preloading missing');
      }

      if (html.includes('dns-prefetch')) {
        this.addResult('DNS Prefetch', 'pass', 'DNS prefetch configured');
      } else {
        this.addResult('DNS Prefetch', 'warning', 'DNS prefetch not configured');
      }
    }

    // Check app config optimizations
    if (this.fileExists('app.config.js')) {
      const appConfig = this.readFile('app.config.js');
      
      if (appConfig.includes('turboModules')) {
        this.addResult('Turbo Modules', 'pass', 'Turbo Modules enabled');
      } else {
        this.addResult('Turbo Modules', 'warning', 'Turbo Modules not enabled');
      }

      if (appConfig.includes('newArchEnabled')) {
        this.addResult('New Architecture', 'pass', 'New React Native architecture enabled');
      } else {
        this.addResult('New Architecture', 'warning', 'New architecture not enabled');
      }
    }
  }

  async validateEnvironmentConfig() {
    this.log('\n🌍 Validating Environment Configuration...', 'info');

    // Check for package.json scripts
    const packageJson = this.readJson('package.json');
    if (packageJson && packageJson.scripts) {
      const scripts = packageJson.scripts;
      
      if (scripts['build:web']) {
        this.addResult('Build Script', 'pass', 'Web build script configured');
      } else {
        this.addResult('Build Script', 'warning', 'Web build script missing');
      }

      if (scripts.analyze) {
        this.addResult('Bundle Analysis Script', 'pass', 'Bundle analysis script available');
      } else {
        this.addResult('Bundle Analysis Script', 'warning', 'Bundle analysis script missing');
      }

      if (scripts['validate:web']) {
        this.addResult('Validation Script', 'pass', 'Web validation script configured');
      } else {
        this.addResult('Validation Script', 'warning', 'Web validation script missing');
      }
    }

    // Check TypeScript configuration
    if (this.fileExists('tsconfig.json')) {
      this.addResult('TypeScript Config', 'pass', 'TypeScript configuration found');
      
      const tsConfig = this.readJson('tsconfig.json');
      if (tsConfig && tsConfig.compilerOptions && tsConfig.compilerOptions.paths) {
        this.addResult('Path Mapping', 'pass', 'TypeScript path mapping configured');
      } else {
        this.addResult('Path Mapping', 'warning', 'TypeScript path mapping not configured');
      }
    } else {
      this.addResult('TypeScript Config', 'warning', 'TypeScript configuration not found');
    }
  }

  generateReport() {
    this.log('\n📋 Validation Report', 'info');
    this.log('='.repeat(50), 'dim');

    const total = this.passed.length + this.warnings.length + this.errors.length;
    const passRate = Math.round((this.passed.length / total) * 100);

    this.log(`\n📊 Summary:`, 'info');
    this.log(`   ✅ Passed: ${this.passed.length}`, 'success');
    this.log(`   ⚠️  Warnings: ${this.warnings.length}`, 'warning');
    this.log(`   ❌ Errors: ${this.errors.length}`, 'error');
    this.log(`   📈 Pass Rate: ${passRate}%\n`, passRate >= 80 ? 'success' : 'warning');

    // Overall status
    if (this.errors.length === 0 && this.warnings.length <= 3) {
      this.log('🎉 Configuration looks great! Ready for production.', 'success');
    } else if (this.errors.length === 0) {
      this.log('✅ Configuration is solid with some minor warnings.', 'warning');
    } else {
      this.log('⚠️  Configuration has issues that should be addressed.', 'error');
    }

    // Recommendations
    if (this.warnings.length > 0 || this.errors.length > 0) {
      this.log('\n🔧 Recommendations:', 'info');
      
      [...this.errors, ...this.warnings].forEach(({ test, message }, index) => {
        this.log(`   ${index + 1}. ${test}: ${message}`);
      });
    }

    this.log('\n' + '='.repeat(50), 'dim');
    
    return {
      passed: this.passed.length,
      warnings: this.warnings.length,
      errors: this.errors.length,
      total,
      passRate,
    };
  }

  async run() {
    this.log('🔍 Tarot Timer Web Configuration Validator', 'info');
    this.log('Checking web platform optimizations...\n', 'dim');

    await this.validateWebpackConfig();
    await this.validateBabelConfig();
    await this.validateMetroConfig();
    await this.validateSecurityConfig();
    await this.validateMonitoringConfig();
    await this.validateCodeSplitting();
    await this.validatePWAConfig();
    await this.validatePerformanceOptimizations();
    await this.validateEnvironmentConfig();

    const report = this.generateReport();
    
    // Exit with appropriate code
    process.exit(report.errors > 0 ? 1 : 0);
  }
}

// Run validation if called directly
if (require.main === module) {
  const validator = new WebConfigValidator();
  validator.run().catch(console.error);
}

module.exports = WebConfigValidator;