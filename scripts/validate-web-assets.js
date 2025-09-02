#!/usr/bin/env node

/**
 * Web Assets Validation Script
 * Validates all web-specific assets and configurations
 */

const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const srcDir = path.join(__dirname, '../src');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileExists(filePath, description) {
  const exists = fs.existsSync(filePath);
  if (exists) {
    log('green', `✓ ${description}: ${path.relative(process.cwd(), filePath)}`);
    return true;
  } else {
    log('red', `✗ ${description}: ${path.relative(process.cwd(), filePath)} (missing)`);
    return false;
  }
}

function validateJsonFile(filePath, description) {
  if (!checkFileExists(filePath, description)) {
    return false;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    JSON.parse(content);
    log('green', `✓ ${description}: Valid JSON`);
    return true;
  } catch (error) {
    log('red', `✗ ${description}: Invalid JSON - ${error.message}`);
    return false;
  }
}

function validateHtmlFile(filePath, description) {
  if (!checkFileExists(filePath, description)) {
    return false;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const checks = [
    { test: content.includes('<!DOCTYPE html>'), name: 'DOCTYPE declaration' },
    { test: content.includes('lang='), name: 'Language attribute' },
    { test: content.includes('viewport'), name: 'Viewport meta tag' },
    { test: content.includes('manifest.json'), name: 'Manifest link' },
    { test: content.includes('favicon'), name: 'Favicon link' },
    { test: content.includes('theme-color'), name: 'Theme color meta' },
    { test: content.includes('apple-mobile-web-app'), name: 'iOS PWA meta tags' },
    { test: content.includes('Content-Security-Policy'), name: 'CSP header' },
    { test: content.includes('id="root"'), name: 'Root element' }
  ];
  
  let passed = 0;
  checks.forEach(check => {
    if (check.test) {
      log('green', `  ✓ ${check.name}`);
      passed++;
    } else {
      log('yellow', `  ⚠ ${check.name} (missing or malformed)`);
    }
  });
  
  log('blue', `  ${passed}/${checks.length} HTML checks passed`);
  return passed === checks.length;
}

function validateServiceWorker(filePath, description) {
  if (!checkFileExists(filePath, description)) {
    return false;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const checks = [
    { test: content.includes('addEventListener'), name: 'Event listeners' },
    { test: content.includes('install'), name: 'Install event' },
    { test: content.includes('activate'), name: 'Activate event' },
    { test: content.includes('fetch'), name: 'Fetch event' },
    { test: content.includes('caches'), name: 'Cache API usage' },
    { test: content.includes('CACHE_NAME'), name: 'Cache naming' },
    { test: content.includes('skipWaiting'), name: 'Skip waiting' },
    { test: content.includes('clients.claim'), name: 'Clients claim' }
  ];
  
  let passed = 0;
  checks.forEach(check => {
    if (check.test) {
      log('green', `  ✓ ${check.name}`);
      passed++;
    } else {
      log('red', `  ✗ ${check.name}`);
    }
  });
  
  log('blue', `  ${passed}/${checks.length} Service Worker checks passed`);
  return passed >= 6; // Allow some flexibility
}

function validateWebHook(filePath, description) {
  if (!checkFileExists(filePath, description)) {
    return false;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const checks = [
    { test: content.includes('useEffect'), name: 'React hooks' },
    { test: content.includes('Platform.OS'), name: 'Platform detection' },
    { test: content.includes('web'), name: 'Web platform check' },
    { test: content.includes('navigator'), name: 'Web APIs' },
    { test: content.includes('window'), name: 'Window object usage' }
  ];
  
  let passed = 0;
  checks.forEach(check => {
    if (check.test) {
      log('green', `  ✓ ${check.name}`);
      passed++;
    } else {
      log('yellow', `  ⚠ ${check.name}`);
    }
  });
  
  log('blue', `  ${passed}/${checks.length} Web hook checks passed`);
  return passed >= 3; // Allow some flexibility
}

function validateWebCSS(filePath, description) {
  if (!checkFileExists(filePath, description)) {
    return false;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const checks = [
    { test: content.includes(':root'), name: 'CSS custom properties' },
    { test: content.includes('@media'), name: 'Media queries' },
    { test: content.includes('prefers-'), name: 'Preference queries' },
    { test: content.includes('safe-area-inset'), name: 'Safe area support' },
    { test: content.includes('accessibility'), name: 'Accessibility styles' },
    { test: content.includes('focus'), name: 'Focus management' },
    { test: content.includes('--color'), name: 'Color variables' },
    { test: content.includes('animation'), name: 'Animations' }
  ];
  
  let passed = 0;
  checks.forEach(check => {
    if (check.test) {
      log('green', `  ✓ ${check.name}`);
      passed++;
    } else {
      log('yellow', `  ⚠ ${check.name}`);
    }
  });
  
  log('blue', `  ${passed}/${checks.length} Web CSS checks passed`);
  return passed >= 6; // Allow some flexibility
}

function main() {
  log('bold', '\n🔮 Tarot Timer - Web Assets Validation\n');
  
  const results = {
    total: 0,
    passed: 0
  };
  
  // Core web assets
  log('blue', '📁 Core Web Assets:');
  results.total++;
  if (validateHtmlFile(path.join(publicDir, 'index.html'), 'Main HTML file')) {
    results.passed++;
  }
  
  results.total++;
  if (validateJsonFile(path.join(publicDir, 'manifest.json'), 'PWA Manifest')) {
    results.passed++;
  }
  
  results.total++;
  if (validateServiceWorker(path.join(publicDir, 'sw.js'), 'Service Worker')) {
    results.passed++;
  }
  
  // SEO and metadata files
  log('blue', '\n🔍 SEO & Metadata Files:');
  const seoFiles = [
    'robots.txt',
    'sitemap.xml',
    '_headers',
    '_redirects'
  ];
  
  seoFiles.forEach(file => {
    results.total++;
    if (checkFileExists(path.join(publicDir, file), `${file}`)) {
      results.passed++;
    }
  });
  
  // Icon files (check if at least favicon exists)
  log('blue', '\n🎨 Icon Files:');
  results.total++;
  if (checkFileExists(path.join(publicDir, 'favicon.ico'), 'Favicon')) {
    results.passed++;
  }
  
  // Web-specific source files
  log('blue', '\n💻 Web-Specific Source Files:');
  results.total++;
  if (checkFileExists(path.join(__dirname, '../index.web.js'), 'Web entry point')) {
    results.passed++;
  }
  
  results.total++;
  if (validateWebHook(path.join(srcDir, 'hooks/useWebOptimizations.ts'), 'Web optimizations hook')) {
    results.passed++;
  }
  
  results.total++;
  if (checkFileExists(path.join(srcDir, 'components/WebWrapper.tsx'), 'Web wrapper component')) {
    results.passed++;
  }
  
  results.total++;
  if (validateWebCSS(path.join(srcDir, 'styles/web.css'), 'Web-specific CSS')) {
    results.passed++;
  }
  
  // Summary
  log('blue', '\n📊 Validation Summary:');
  const percentage = Math.round((results.passed / results.total) * 100);
  
  if (percentage >= 90) {
    log('green', `✅ Excellent! ${results.passed}/${results.total} checks passed (${percentage}%)`);
    log('green', '🎉 Web assets are properly configured and ready for deployment!');
  } else if (percentage >= 70) {
    log('yellow', `⚠️  Good! ${results.passed}/${results.total} checks passed (${percentage}%)`);
    log('yellow', '🔧 Some improvements recommended but assets are functional.');
  } else {
    log('red', `❌ Needs work! ${results.passed}/${results.total} checks passed (${percentage}%)`);
    log('red', '🛠️  Several issues need to be addressed before deployment.');
  }
  
  // Recommendations
  if (percentage < 100) {
    log('blue', '\n💡 Recommendations:');
    log('blue', '• Ensure all core web assets are present and valid');
    log('blue', '• Check that icons are properly sized and optimized');
    log('blue', '• Verify PWA manifest includes all required fields');
    log('blue', '• Test Service Worker functionality in a browser');
    log('blue', '• Validate HTML structure and accessibility features');
  }
  
  process.exit(percentage >= 70 ? 0 : 1);
}

if (require.main === module) {
  main();
}