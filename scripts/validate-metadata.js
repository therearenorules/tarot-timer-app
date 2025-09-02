#!/usr/bin/env node

/**
 * Comprehensive Metadata Validation Script
 * Validates HTML metadata optimization for SEO, social media, and performance
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const publicDir = path.join(__dirname, '../public');
const srcDir = path.join(__dirname, '../src');

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m'
};

function log(color, message, indent = 0) {
  const indentation = '  '.repeat(indent);
  console.log(`${indentation}${colors[color]}${message}${colors.reset}`);
}

function validateHTML() {
  const htmlPath = path.join(publicDir, 'index.html');
  
  if (!fs.existsSync(htmlPath)) {
    log('red', '✗ index.html not found');
    return { score: 0, details: [] };
  }

  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  const dom = new JSDOM(htmlContent);
  const document = dom.window.document;
  
  let score = 0;
  const maxScore = 100;
  const details = [];

  // Basic HTML Structure (10 points)
  const basicChecks = [
    { 
      test: () => document.doctype?.name === 'html',
      name: 'HTML5 DOCTYPE',
      points: 2
    },
    { 
      test: () => document.documentElement.getAttribute('lang'),
      name: 'Language attribute',
      points: 2
    },
    { 
      test: () => document.querySelector('meta[charset]'),
      name: 'Character encoding',
      points: 2
    },
    { 
      test: () => document.querySelector('meta[name="viewport"]'),
      name: 'Viewport meta tag',
      points: 2
    },
    { 
      test: () => document.title && document.title.length > 0,
      name: 'Page title',
      points: 2
    }
  ];

  log('blue', '📄 Basic HTML Structure:');
  basicChecks.forEach(check => {
    if (check.test()) {
      log('green', `✓ ${check.name}`, 1);
      score += check.points;
      details.push({ category: 'Basic', check: check.name, status: 'pass' });
    } else {
      log('red', `✗ ${check.name}`, 1);
      details.push({ category: 'Basic', check: check.name, status: 'fail' });
    }
  });

  // SEO Metadata (25 points)
  const seoChecks = [
    {
      test: () => {
        const desc = document.querySelector('meta[name="description"]');
        return desc && desc.getAttribute('content').length >= 120 && desc.getAttribute('content').length <= 160;
      },
      name: 'Meta description (120-160 chars)',
      points: 5
    },
    {
      test: () => document.querySelector('meta[name="keywords"]'),
      name: 'Keywords meta tag',
      points: 3
    },
    {
      test: () => document.querySelector('meta[name="author"]'),
      name: 'Author meta tag',
      points: 2
    },
    {
      test: () => document.querySelector('meta[name="robots"]'),
      name: 'Robots meta tag',
      points: 3
    },
    {
      test: () => document.querySelector('link[rel="canonical"]'),
      name: 'Canonical URL',
      points: 4
    },
    {
      test: () => document.querySelector('link[rel="alternate"][hreflang]'),
      name: 'Hreflang tags',
      points: 3
    },
    {
      test: () => document.querySelector('script[type="application/ld+json"]'),
      name: 'Structured data',
      points: 5
    }
  ];

  log('blue', '\n🔍 SEO Metadata:');
  seoChecks.forEach(check => {
    if (check.test()) {
      log('green', `✓ ${check.name}`, 1);
      score += check.points;
      details.push({ category: 'SEO', check: check.name, status: 'pass' });
    } else {
      log('red', `✗ ${check.name}`, 1);
      details.push({ category: 'SEO', check: check.name, status: 'fail' });
    }
  });

  // Open Graph Metadata (20 points)
  const ogChecks = [
    {
      test: () => document.querySelector('meta[property="og:title"]'),
      name: 'OG title',
      points: 3
    },
    {
      test: () => document.querySelector('meta[property="og:description"]'),
      name: 'OG description',
      points: 3
    },
    {
      test: () => document.querySelector('meta[property="og:image"]'),
      name: 'OG image',
      points: 4
    },
    {
      test: () => document.querySelector('meta[property="og:url"]'),
      name: 'OG URL',
      points: 3
    },
    {
      test: () => document.querySelector('meta[property="og:type"]'),
      name: 'OG type',
      points: 2
    },
    {
      test: () => document.querySelector('meta[property="og:locale"]'),
      name: 'OG locale',
      points: 2
    },
    {
      test: () => document.querySelector('meta[property="og:site_name"]'),
      name: 'OG site name',
      points: 3
    }
  ];

  log('blue', '\n📱 Open Graph (Facebook):');
  ogChecks.forEach(check => {
    if (check.test()) {
      log('green', `✓ ${check.name}`, 1);
      score += check.points;
      details.push({ category: 'OpenGraph', check: check.name, status: 'pass' });
    } else {
      log('red', `✗ ${check.name}`, 1);
      details.push({ category: 'OpenGraph', check: check.name, status: 'fail' });
    }
  });

  // Twitter Cards (15 points)
  const twitterChecks = [
    {
      test: () => document.querySelector('meta[name="twitter:card"]'),
      name: 'Twitter card type',
      points: 3
    },
    {
      test: () => document.querySelector('meta[name="twitter:title"]'),
      name: 'Twitter title',
      points: 3
    },
    {
      test: () => document.querySelector('meta[name="twitter:description"]'),
      name: 'Twitter description',
      points: 3
    },
    {
      test: () => document.querySelector('meta[name="twitter:image"]'),
      name: 'Twitter image',
      points: 4
    },
    {
      test: () => document.querySelector('meta[name="twitter:site"]') || document.querySelector('meta[name="twitter:creator"]'),
      name: 'Twitter attribution',
      points: 2
    }
  ];

  log('blue', '\n🐦 Twitter Cards:');
  twitterChecks.forEach(check => {
    if (check.test()) {
      log('green', `✓ ${check.name}`, 1);
      score += check.points;
      details.push({ category: 'Twitter', check: check.name, status: 'pass' });
    } else {
      log('red', `✗ ${check.name}`, 1);
      details.push({ category: 'Twitter', check: check.name, status: 'fail' });
    }
  });

  // Performance Optimization (20 points)
  const perfChecks = [
    {
      test: () => document.querySelector('link[rel="preconnect"]'),
      name: 'Preconnect hints',
      points: 4
    },
    {
      test: () => document.querySelector('link[rel="dns-prefetch"]'),
      name: 'DNS prefetch hints',
      points: 3
    },
    {
      test: () => document.querySelector('link[rel="preload"]'),
      name: 'Preload hints',
      points: 4
    },
    {
      test: () => document.querySelector('link[rel="prefetch"]'),
      name: 'Prefetch hints',
      points: 3
    },
    {
      test: () => document.querySelector('link[rel="modulepreload"]'),
      name: 'Module preload',
      points: 3
    },
    {
      test: () => document.querySelector('style'),
      name: 'Critical CSS inline',
      points: 3
    }
  ];

  log('blue', '\n⚡ Performance Optimization:');
  perfChecks.forEach(check => {
    if (check.test()) {
      log('green', `✓ ${check.name}`, 1);
      score += check.points;
      details.push({ category: 'Performance', check: check.name, status: 'pass' });
    } else {
      log('yellow', `⚠ ${check.name}`, 1);
      details.push({ category: 'Performance', check: check.name, status: 'warning' });
    }
  });

  // PWA & Mobile (10 points)
  const pwaChecks = [
    {
      test: () => document.querySelector('link[rel="manifest"]'),
      name: 'Web app manifest',
      points: 3
    },
    {
      test: () => document.querySelector('meta[name="theme-color"]'),
      name: 'Theme color',
      points: 2
    },
    {
      test: () => document.querySelector('meta[name="apple-mobile-web-app-capable"]'),
      name: 'iOS web app capable',
      points: 2
    },
    {
      test: () => document.querySelector('link[rel="apple-touch-icon"]'),
      name: 'Apple touch icon',
      points: 3
    }
  ];

  log('blue', '\n📱 PWA & Mobile:');
  pwaChecks.forEach(check => {
    if (check.test()) {
      log('green', `✓ ${check.name}`, 1);
      score += check.points;
      details.push({ category: 'PWA', check: check.name, status: 'pass' });
    } else {
      log('yellow', `⚠ ${check.name}`, 1);
      details.push({ category: 'PWA', check: check.name, status: 'warning' });
    }
  });

  return { score, maxScore, details, htmlContent };
}

function validateStructuredData(htmlContent) {
  log('blue', '\n🏗️ Structured Data Validation:');
  
  const scriptTags = htmlContent.match(/<script type="application\/ld\+json">(.*?)<\/script>/gs);
  
  if (!scriptTags) {
    log('red', '✗ No structured data found', 1);
    return { valid: false, schemas: [] };
  }

  const schemas = [];
  let validCount = 0;

  scriptTags.forEach((script, index) => {
    try {
      const jsonContent = script.replace(/<script[^>]*>|<\/script>/g, '').trim();
      const data = JSON.parse(jsonContent);
      
      if (data['@context'] && data['@type']) {
        log('green', `✓ Schema ${index + 1}: ${data['@type']}`, 1);
        validCount++;
        schemas.push({ type: data['@type'], valid: true, data });
      } else {
        log('red', `✗ Schema ${index + 1}: Invalid structure`, 1);
        schemas.push({ type: 'Unknown', valid: false, error: 'Missing @context or @type' });
      }
    } catch (error) {
      log('red', `✗ Schema ${index + 1}: JSON Parse Error`, 1);
      log('dim', `  ${error.message}`, 1);
      schemas.push({ type: 'Unknown', valid: false, error: error.message });
    }
  });

  log('blue', `  Found ${validCount}/${scriptTags.length} valid schemas`, 1);
  return { valid: validCount > 0, schemas, count: validCount, total: scriptTags.length };
}

function validateMetadataFiles() {
  log('blue', '\n🔧 Metadata System Files:');
  
  const files = [
    { path: path.join(srcDir, 'hooks/useMetadata.ts'), name: 'useMetadata hook' },
    { path: path.join(srcDir, 'components/SEO/MetadataManager.tsx'), name: 'MetadataManager component' },
    { path: path.join(srcDir, 'utils/seoUtils.ts'), name: 'SEO utilities' },
    { path: path.join(srcDir, 'examples/MetadataExamples.tsx'), name: 'Metadata examples' }
  ];

  let filesExist = 0;
  
  files.forEach(file => {
    if (fs.existsSync(file.path)) {
      log('green', `✓ ${file.name}`, 1);
      filesExist++;
    } else {
      log('red', `✗ ${file.name}`, 1);
    }
  });

  return { filesExist, totalFiles: files.length };
}

function generateReport(results) {
  const { score, maxScore, details } = results.html;
  const percentage = Math.round((score / maxScore) * 100);
  
  log('bold', '\n📊 METADATA OPTIMIZATION REPORT', 0);
  log('cyan', '═'.repeat(50), 0);
  
  // Overall Score
  if (percentage >= 90) {
    log('green', `🎉 EXCELLENT: ${score}/${maxScore} points (${percentage}%)`, 0);
    log('green', '✨ Your metadata is production-ready!', 0);
  } else if (percentage >= 75) {
    log('yellow', `👍 GOOD: ${score}/${maxScore} points (${percentage}%)`, 0);
    log('yellow', '🔧 Minor improvements recommended', 0);
  } else if (percentage >= 50) {
    log('yellow', `⚠️ FAIR: ${score}/${maxScore} points (${percentage}%)`, 0);
    log('yellow', '🛠️ Several improvements needed', 0);
  } else {
    log('red', `❌ POOR: ${score}/${maxScore} points (${percentage}%)`, 0);
    log('red', '🚨 Major improvements required', 0);
  }

  // Category breakdown
  const categories = ['Basic', 'SEO', 'OpenGraph', 'Twitter', 'Performance', 'PWA'];
  
  log('cyan', '\n📋 Category Breakdown:', 0);
  categories.forEach(category => {
    const categoryDetails = details.filter(d => d.category === category);
    const passed = categoryDetails.filter(d => d.status === 'pass').length;
    const total = categoryDetails.length;
    
    if (total > 0) {
      const categoryPercentage = Math.round((passed / total) * 100);
      const status = categoryPercentage >= 80 ? 'green' : categoryPercentage >= 60 ? 'yellow' : 'red';
      log(status, `  ${category}: ${passed}/${total} (${categoryPercentage}%)`, 0);
    }
  });

  // Structured Data Results
  if (results.structuredData) {
    log('cyan', '\n🏗️ Structured Data:', 0);
    const { valid, count, total } = results.structuredData;
    const structuredDataStatus = count === total && count > 0 ? 'green' : 'yellow';
    log(structuredDataStatus, `  ${count}/${total} schemas valid`, 0);
  }

  // Files Status
  if (results.files) {
    log('cyan', '\n📁 Implementation Files:', 0);
    const { filesExist, totalFiles } = results.files;
    const filesStatus = filesExist === totalFiles ? 'green' : 'red';
    log(filesStatus, `  ${filesExist}/${totalFiles} files present`, 0);
  }

  // Recommendations
  log('cyan', '\n💡 Recommendations:', 0);
  
  if (percentage < 100) {
    const failedChecks = details.filter(d => d.status === 'fail');
    if (failedChecks.length > 0) {
      log('blue', '  Priority fixes:', 0);
      failedChecks.slice(0, 5).forEach(check => {
        log('yellow', `    • ${check.check}`, 0);
      });
    }
  }

  if (percentage >= 90) {
    log('blue', '  • Consider A/B testing different meta descriptions', 0);
    log('blue', '  • Monitor Core Web Vitals and adjust resource hints', 0);
    log('blue', '  • Validate with Google Rich Results Test', 0);
  } else {
    log('blue', '  • Focus on missing SEO fundamentals first', 0);
    log('blue', '  • Ensure all social media metadata is complete', 0);
    log('blue', '  • Test with Facebook Sharing Debugger and Twitter Card Validator', 0);
  }

  // Testing Tools
  log('cyan', '\n🔧 Testing Tools:', 0);
  log('blue', '  • Google Search Console: https://search.google.com/search-console', 0);
  log('blue', '  • Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/', 0);
  log('blue', '  • Twitter Card Validator: https://cards-dev.twitter.com/validator', 0);
  log('blue', '  • Google Rich Results Test: https://search.google.com/test/rich-results', 0);
  log('blue', '  • Schema.org Validator: https://validator.schema.org/', 0);

  return percentage >= 75;
}

function main() {
  try {
    log('bold', '\n🔮 Tarot Timer - Metadata Optimization Validation\n');
    
    const results = {
      html: validateHTML(),
      structuredData: null,
      files: validateMetadataFiles()
    };

    // Validate structured data
    if (results.html.htmlContent) {
      results.structuredData = validateStructuredData(results.html.htmlContent);
    }

    // Generate comprehensive report
    const isValid = generateReport(results);
    
    log('cyan', '\n═'.repeat(50));
    log(isValid ? 'green' : 'red', 
        isValid ? '🎉 Metadata optimization passed!' : '❌ Metadata optimization needs improvement');
    
    // Export detailed results for CI/CD
    if (process.env.CI) {
      const reportPath = path.join(__dirname, '../metadata-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
      log('blue', `📄 Detailed report saved to: ${reportPath}`);
    }

    process.exit(isValid ? 0 : 1);
    
  } catch (error) {
    log('red', `❌ Validation failed: ${error.message}`);
    if (process.env.DEBUG) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateHTML, validateStructuredData, validateMetadataFiles };