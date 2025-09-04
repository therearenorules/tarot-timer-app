/**
 * Extension Filter Test Suite
 * Comprehensive tests for the extension filtering system
 */

import { ExtensionFilter } from './extensionFilter';

interface TestCase {
  name: string;
  url: string;
  expectedBlocked: boolean;
  expectedReason?: string;
  expectedType?: string;
  minConfidence?: number;
}

/**
 * Test cases for extension filtering
 */
const TEST_CASES: TestCase[] = [
  // Chrome Extension URLs (should be blocked)
  {
    name: 'Chrome Extension - AdBlock',
    url: 'chrome-extension://bhhhlbepdkbapadjdnnojkbgioiodbic/background.js',
    expectedBlocked: true,
    expectedType: 'protocol',
    minConfidence: 95
  },
  {
    name: 'Chrome Extension - Honey',
    url: 'chrome-extension://dheimbmpmkbepjjcobigjacfepohombn/content_script.js',
    expectedBlocked: true,
    expectedType: 'protocol',
    minConfidence: 95
  },
  {
    name: 'Chrome Extension - Generic',
    url: 'chrome-extension://abcdefghijklmnopqrstuvwxyzabcdef/popup.html',
    expectedBlocked: true,
    expectedType: 'protocol',
    minConfidence: 90
  },
  
  // Firefox Extension URLs (should be blocked)
  {
    name: 'Firefox Extension',
    url: 'moz-extension://12345678-1234-1234-1234-123456789012/background.js',
    expectedBlocked: true,
    expectedType: 'protocol',
    minConfidence: 90
  },
  
  // Safari Extension URLs (should be blocked)
  {
    name: 'Safari Extension',
    url: 'safari-extension://com.company.extension/script.js',
    expectedBlocked: true,
    expectedType: 'protocol',
    minConfidence: 90
  },
  
  // Edge Extension URLs (should be blocked)
  {
    name: 'Edge Extension',
    url: 'edge-extension://abcdefghijklmnopqrstuvwxyzabcdef/options.html',
    expectedBlocked: true,
    expectedType: 'protocol',
    minConfidence: 90
  },
  
  // Pattern-based detection (should be blocked)
  {
    name: 'Extension Pattern - Content Script',
    url: 'https://example.com/content_script.js',
    expectedBlocked: true,
    expectedType: 'pattern',
    minConfidence: 75
  },
  {
    name: 'Extension Pattern - Background Script',
    url: 'https://extension-domain.com/background.js',
    expectedBlocked: true,
    expectedType: 'pattern',
    minConfidence: 75
  },
  {
    name: 'Extension Pattern - Manifest',
    url: 'https://ext.com/manifest.json',
    expectedBlocked: false, // manifest.json alone shouldn't be blocked
    minConfidence: 0
  },
  {
    name: 'Extension Pattern - Icon',
    url: 'https://extension.com/assets/icons/48x48.png',
    expectedBlocked: true,
    expectedType: 'pattern',
    minConfidence: 75
  },
  
  // Legitimate URLs (should NOT be blocked)
  {
    name: 'Legitimate - Same Origin',
    url: 'https://tarot-timer.com/api/cards',
    expectedBlocked: false,
    minConfidence: 0
  },
  {
    name: 'Legitimate - CDN',
    url: 'https://cdn.jsdelivr.net/npm/package@1.0.0/dist/package.min.js',
    expectedBlocked: false,
    minConfidence: 0
  },
  {
    name: 'Legitimate - Google Fonts',
    url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap',
    expectedBlocked: false,
    minConfidence: 0
  },
  {
    name: 'Legitimate - Regular Script',
    url: 'https://example.com/js/app.js',
    expectedBlocked: false,
    minConfidence: 0
  },
  
  // Whitelisted extensions (should not be blocked if whitelist enabled)
  {
    name: 'Whitelisted - MetaMask',
    url: 'chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/inpage.js',
    expectedBlocked: true, // Blocked by default unless whitelist is enabled
    expectedType: 'protocol',
    minConfidence: 95
  },
  
  // Edge cases
  {
    name: 'Edge Case - Malformed URL',
    url: 'chrome-extension://invalid-extension-url',
    expectedBlocked: true,
    expectedType: 'protocol',
    minConfidence: 80
  },
  {
    name: 'Edge Case - Empty URL',
    url: '',
    expectedBlocked: false,
    minConfidence: 0
  },
  {
    name: 'Edge Case - Data URL',
    url: 'data:text/javascript,console.log("test")',
    expectedBlocked: false,
    minConfidence: 0
  }
];

/**
 * Run extension filter tests
 */
export function runExtensionFilterTests(): Promise<{
  passed: number;
  failed: number;
  total: number;
  results: Array<{
    testCase: TestCase;
    result: any;
    passed: boolean;
    error?: string;
  }>;
}> {
  return new Promise((resolve) => {
    const filter = new ExtensionFilter({
      enableLogging: false, // Disable logging during tests
      enableStats: false
    });

    const results: Array<{
      testCase: TestCase;
      result: any;
      passed: boolean;
      error?: string;
    }> = [];

    let passed = 0;
    let failed = 0;

    TEST_CASES.forEach((testCase) => {
      try {
        const result = filter.analyzeRequest(testCase.url);
        
        let testPassed = true;
        let error = '';

        // Check if blocked status matches expectation
        if (result.shouldBlock !== testCase.expectedBlocked) {
          testPassed = false;
          error += `Expected blocked: ${testCase.expectedBlocked}, got: ${result.shouldBlock}. `;
        }

        // Check extension type if specified
        if (testCase.expectedType && result.extensionType !== testCase.expectedType) {
          testPassed = false;
          error += `Expected type: ${testCase.expectedType}, got: ${result.extensionType}. `;
        }

        // Check minimum confidence if specified
        if (testCase.minConfidence && result.confidence < testCase.minConfidence) {
          testPassed = false;
          error += `Expected confidence >= ${testCase.minConfidence}, got: ${result.confidence}. `;
        }

        results.push({
          testCase,
          result,
          passed: testPassed,
          error: error || undefined
        });

        if (testPassed) {
          passed++;
        } else {
          failed++;
        }

      } catch (err) {
        results.push({
          testCase,
          result: null,
          passed: false,
          error: `Test threw exception: ${err instanceof Error ? err.message : String(err)}`
        });
        failed++;
      }
    });

    resolve({
      passed,
      failed,
      total: TEST_CASES.length,
      results
    });
  });
}

/**
 * Performance test for extension filter
 */
export function runExtensionFilterPerformanceTest(): Promise<{
  averageTime: number;
  minTime: number;
  maxTime: number;
  totalTests: number;
  testsPerSecond: number;
}> {
  return new Promise((resolve) => {
    const filter = new ExtensionFilter({
      enableLogging: false,
      enableStats: false
    });

    const testUrls = [
      'chrome-extension://bhhhlbepdkbapadjdnnojkbgioiodbic/background.js',
      'https://example.com/script.js',
      'moz-extension://12345678-1234-1234-1234-123456789012/content.js',
      'https://cdn.jsdelivr.net/npm/package/dist/bundle.js',
      'chrome-extension://invalid/test.js'
    ];

    const times: number[] = [];
    const totalTests = testUrls.length * 100; // 100 iterations per URL
    
    const startTime = performance.now();

    for (let i = 0; i < 100; i++) {
      testUrls.forEach((url) => {
        const testStart = performance.now();
        filter.analyzeRequest(url);
        const testEnd = performance.now();
        times.push(testEnd - testStart);
      });
    }

    const endTime = performance.now();
    const totalTime = endTime - startTime;

    const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;
    const minTime = Math.min(...times);
    const maxTime = Math.max(...times);
    const testsPerSecond = (totalTests / totalTime) * 1000;

    resolve({
      averageTime,
      minTime,
      maxTime,
      totalTests,
      testsPerSecond
    });
  });
}

/**
 * Generate test report
 */
export function generateTestReport(testResults: any, performanceResults?: any): string {
  let report = '# Extension Filter Test Report\n\n';
  
  report += `## Summary\n`;
  report += `- **Total Tests**: ${testResults.total}\n`;
  report += `- **Passed**: ${testResults.passed} (${((testResults.passed / testResults.total) * 100).toFixed(1)}%)\n`;
  report += `- **Failed**: ${testResults.failed} (${((testResults.failed / testResults.total) * 100).toFixed(1)}%)\n\n`;

  if (performanceResults) {
    report += `## Performance\n`;
    report += `- **Average Time**: ${performanceResults.averageTime.toFixed(3)}ms\n`;
    report += `- **Min Time**: ${performanceResults.minTime.toFixed(3)}ms\n`;
    report += `- **Max Time**: ${performanceResults.maxTime.toFixed(3)}ms\n`;
    report += `- **Tests per Second**: ${performanceResults.testsPerSecond.toFixed(0)}\n\n`;
  }

  if (testResults.failed > 0) {
    report += `## Failed Tests\n`;
    testResults.results
      .filter((result: any) => !result.passed)
      .forEach((result: any) => {
        report += `### ${result.testCase.name}\n`;
        report += `- **URL**: ${result.testCase.url}\n`;
        report += `- **Error**: ${result.error}\n`;
        if (result.result) {
          report += `- **Actual Result**: shouldBlock=${result.result.shouldBlock}, confidence=${result.result.confidence}\n`;
        }
        report += '\n';
      });
  }

  report += `## Detailed Results\n`;
  testResults.results.forEach((result: any) => {
    const status = result.passed ? '✅' : '❌';
    report += `${status} **${result.testCase.name}**: `;
    if (result.result) {
      report += `blocked=${result.result.shouldBlock}, confidence=${result.result.confidence}%`;
    } else {
      report += 'Exception thrown';
    }
    report += '\n';
  });

  return report;
}

/**
 * Quick validation function for basic extension detection
 */
export function quickExtensionTest(url: string): {
  isExtension: boolean;
  shouldBlock: boolean;
  confidence: number;
  reason: string;
} {
  const filter = new ExtensionFilter({
    enableLogging: false,
    enableStats: false
  });

  return filter.analyzeRequest(url);
}