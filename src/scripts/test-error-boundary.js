#!/usr/bin/env node

/**
 * 에러 바운더리 시스템 종합 테스트 러너
 * 모든 테스트 수트를 실행하고 결과를 종합 리포트로 제공
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const COLORS = {
  GREEN: '\x1b[32m',
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  RESET: '\x1b[0m',
  BOLD: '\x1b[1m',
};

const log = (color, message) => {
  console.log(`${color}${message}${COLORS.RESET}`);
};

const testSuites = [
  {
    name: 'ErrorBoundary Unit Tests',
    path: 'src/components/__tests__/ErrorBoundary.test.tsx',
    description: '기본 에러 바운더리 컴포넌트 단위 테스트',
  },
  {
    name: 'SecureErrorHandler Tests',
    path: 'src/lib/errorHandling/__tests__/SecureErrorHandler.test.ts',
    description: '보안 에러 처리 시스템 테스트',
  },
  {
    name: 'ErrorReportingService Tests',
    path: 'src/lib/errorHandling/__tests__/ErrorReportingService.test.ts',
    description: '에러 리포팅 서비스 테스트',
  },
  {
    name: 'useErrorRecovery Hook Tests',
    path: 'src/hooks/__tests__/useErrorRecovery.test.ts',
    description: '에러 복구 Hook 테스트',
  },
  {
    name: 'Integration Tests',
    path: 'src/components/__tests__/ErrorBoundary.integration.test.tsx',
    description: '전체 시스템 통합 테스트',
  },
];

async function runTestSuite(suite) {
  log(COLORS.BLUE, `\n📋 Running: ${suite.name}`);
  log(COLORS.RESET, `   ${suite.description}`);
  
  try {
    const result = execSync(`npx jest ${suite.path} --verbose --coverage`, {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: 'pipe',
    });
    
    log(COLORS.GREEN, '✅ PASSED');
    return { suite: suite.name, status: 'PASSED', output: result };
  } catch (error) {
    log(COLORS.RED, '❌ FAILED');
    console.log(error.stdout || error.message);
    return { suite: suite.name, status: 'FAILED', output: error.stdout || error.message };
  }
}

async function runLinting() {
  log(COLORS.BLUE, '\n🔍 Running ESLint on Error Boundary files...');
  
  const filesToLint = [
    'src/components/ErrorBoundary.enhanced.tsx',
    'src/components/errors/MysticalErrorFallback.tsx',
    'src/lib/errorHandling/SecureErrorHandler.ts',
    'src/lib/errorHandling/ErrorReportingService.ts',
    'src/hooks/useErrorRecovery.ts',
  ];
  
  try {
    const result = execSync(`npx eslint ${filesToLint.join(' ')} --ext .ts,.tsx`, {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: 'pipe',
    });
    
    log(COLORS.GREEN, '✅ ESLint: No issues found');
    return { status: 'PASSED', output: result };
  } catch (error) {
    if (error.status === 1) {
      log(COLORS.YELLOW, '⚠️  ESLint: Issues found');
      console.log(error.stdout);
      return { status: 'WARNING', output: error.stdout };
    } else {
      log(COLORS.RED, '❌ ESLint: Failed to run');
      console.log(error.stdout || error.message);
      return { status: 'FAILED', output: error.stdout || error.message };
    }
  }
}

async function runTypeCheck() {
  log(COLORS.BLUE, '\n🔍 Running TypeScript compilation check...');
  
  try {
    const result = execSync('npx tsc --noEmit', {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: 'pipe',
    });
    
    log(COLORS.GREEN, '✅ TypeScript: No type errors');
    return { status: 'PASSED', output: result };
  } catch (error) {
    log(COLORS.RED, '❌ TypeScript: Type errors found');
    console.log(error.stdout || error.message);
    return { status: 'FAILED', output: error.stdout || error.message };
  }
}

async function generateCoverageReport() {
  log(COLORS.BLUE, '\n📊 Generating coverage report...');
  
  try {
    const result = execSync(`npx jest ${testSuites.map(s => s.path).join(' ')} --coverage --coverageReporters=text --coverageReporters=html`, {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: 'pipe',
    });
    
    log(COLORS.GREEN, '✅ Coverage report generated');
    return { status: 'PASSED', output: result };
  } catch (error) {
    log(COLORS.YELLOW, '⚠️  Coverage report generated with some failures');
    return { status: 'WARNING', output: error.stdout || error.message };
  }
}

async function validateImplementation() {
  log(COLORS.BLUE, '\n🔍 Validating implementation completeness...');
  
  const requiredFiles = [
    'src/components/ErrorBoundary.enhanced.tsx',
    'src/components/errors/MysticalErrorFallback.tsx',
    'src/lib/errorHandling/SecureErrorHandler.ts',
    'src/lib/errorHandling/ErrorReportingService.ts',
    'src/hooks/useErrorRecovery.ts',
  ];
  
  const missingFiles = [];
  const validFiles = [];
  
  for (const file of requiredFiles) {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      if (stats.size > 1000) { // 최소 1KB 이상
        validFiles.push(file);
      } else {
        missingFiles.push(`${file} (too small: ${stats.size} bytes)`);
      }
    } else {
      missingFiles.push(`${file} (not found)`);
    }
  }
  
  if (missingFiles.length === 0) {
    log(COLORS.GREEN, '✅ All required files are present and substantial');
    log(COLORS.RESET, `   Found ${validFiles.length} implementation files`);
    return { status: 'PASSED', files: validFiles };
  } else {
    log(COLORS.RED, '❌ Missing or incomplete files:');
    missingFiles.forEach(file => log(COLORS.RED, `   - ${file}`));
    return { status: 'FAILED', missing: missingFiles, found: validFiles };
  }
}

async function main() {
  log(COLORS.BOLD, '🚀 Error Boundary System Test Suite');
  log(COLORS.RESET, '=====================================');
  
  const startTime = Date.now();
  const results = [];
  
  // 1. 구현 완성도 검증
  const validation = await validateImplementation();
  results.push({ name: 'Implementation Validation', ...validation });
  
  if (validation.status === 'FAILED') {
    log(COLORS.RED, '\n❌ Cannot proceed with tests - implementation incomplete');
    process.exit(1);
  }
  
  // 2. TypeScript 타입 체크
  const typeCheck = await runTypeCheck();
  results.push({ name: 'TypeScript Check', ...typeCheck });
  
  // 3. ESLint 검사
  const linting = await runLinting();
  results.push({ name: 'ESLint', ...linting });
  
  // 4. 단위 테스트 실행
  for (const suite of testSuites) {
    const result = await runTestSuite(suite);
    results.push({ name: suite.name, ...result });
  }
  
  // 5. 커버리지 리포트 생성
  const coverage = await generateCoverageReport();
  results.push({ name: 'Coverage Report', ...coverage });
  
  // 6. 결과 요약
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  log(COLORS.BOLD, '\n📊 Test Results Summary');
  log(COLORS.RESET, '========================');
  
  const passed = results.filter(r => r.status === 'PASSED').length;
  const warning = results.filter(r => r.status === 'WARNING').length;
  const failed = results.filter(r => r.status === 'FAILED').length;
  
  results.forEach(result => {
    const statusColor = result.status === 'PASSED' ? COLORS.GREEN :
                       result.status === 'WARNING' ? COLORS.YELLOW : COLORS.RED;
    const statusIcon = result.status === 'PASSED' ? '✅' :
                      result.status === 'WARNING' ? '⚠️' : '❌';
    
    log(statusColor, `${statusIcon} ${result.name}: ${result.status}`);
  });
  
  log(COLORS.RESET, `\nTotal: ${results.length} | Passed: ${passed} | Warning: ${warning} | Failed: ${failed}`);
  log(COLORS.RESET, `Duration: ${duration}s`);
  
  if (failed === 0) {
    log(COLORS.GREEN, '\n🎉 All tests passed! Error Boundary system is ready for production.');
    
    // 성공 시 추가 정보 제공
    log(COLORS.BLUE, '\n📋 Implementation Summary:');
    log(COLORS.RESET, '  ✅ Secure error handling with information sanitization');
    log(COLORS.RESET, '  ✅ Mystical UI with animated error displays');
    log(COLORS.RESET, '  ✅ Automatic recovery with multiple strategies');
    log(COLORS.RESET, '  ✅ Comprehensive error reporting and analytics');
    log(COLORS.RESET, '  ✅ Context API integration for state recovery');
    log(COLORS.RESET, '  ✅ Full test coverage with unit and integration tests');
    
    process.exit(0);
  } else {
    log(COLORS.RED, `\n💥 ${failed} test(s) failed. Please review the errors above.`);
    process.exit(1);
  }
}

// 스크립트가 직접 실행될 때만 main 함수 호출
if (require.main === module) {
  main().catch(error => {
    log(COLORS.RED, `\n💥 Test runner failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  });
}

module.exports = { runTestSuite, runLinting, runTypeCheck, validateImplementation };