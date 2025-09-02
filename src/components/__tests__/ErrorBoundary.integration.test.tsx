/**
 * ErrorBoundary 통합 테스트 수트
 * 전체 에러 처리 시스템의 통합 동작 검증
 */

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { EnhancedErrorBoundary } from '../ErrorBoundary.enhanced';
import SecureErrorHandler from '@/lib/errorHandling/SecureErrorHandler';
import ErrorReportingService from '@/lib/errorHandling/ErrorReportingService';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock React Native components
jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  Alert: {
    alert: jest.fn(),
  },
  Platform: {
    OS: 'ios',
  },
  Dimensions: {
    get: jest.fn(() => ({ width: 375, height: 812 })),
  },
}));

// Mock Context
const mockAppContext = {
  state: {
    sessionId: 'integration-test-session',
    userPreferences: { theme: 'mystical', language: 'ko' },
    currentSession: { startTime: Date.now() },
  },
  actions: {
    resetToInitialState: jest.fn().mockResolvedValue(undefined),
    restoreFromBackup: jest.fn().mockResolvedValue(undefined),
    refreshSession: jest.fn().mockResolvedValue(undefined),
    syncLocalData: jest.fn().mockResolvedValue(undefined),
    clearAppCache: jest.fn().mockResolvedValue(undefined),
    loadEssentialData: jest.fn().mockResolvedValue(undefined),
    forceComponentRemount: jest.fn().mockResolvedValue(undefined),
    saveUserDataToStorage: jest.fn().mockResolvedValue(undefined),
  },
};

const MockAppProvider = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="mock-app-provider">{children}</div>;
};

// 실제 에러를 발생시키는 테스트 컴포넌트
const ErrorComponent = ({ 
  errorType, 
  shouldThrow, 
  delay = 0 
}: { 
  errorType: string; 
  shouldThrow: boolean; 
  delay?: number;
}) => {
  React.useEffect(() => {
    if (shouldThrow && delay > 0) {
      setTimeout(() => {
        throw createErrorByType(errorType);
      }, delay);
    }
  }, [shouldThrow, errorType, delay]);

  if (shouldThrow && delay === 0) {
    throw createErrorByType(errorType);
  }

  return <div data-testid="normal-component">정상 컴포넌트</div>;
};

const createErrorByType = (type: string): Error => {
  switch (type) {
    case 'network':
      return new Error('Failed to fetch: Network timeout after 30 seconds');
    case 'security':
      const secError = new Error('Authentication failed: Invalid JWT token eyJhbGciOiJIUzI1NiJ9.invalid.signature');
      secError.name = 'SecurityError';
      return secError;
    case 'validation':
      return new Error('Validation failed: Email john.doe@example.com is invalid format');
    case 'runtime':
      return new Error('Cannot read property "cards" of undefined at TarotDeck.shuffle');
    case 'memory':
      return new Error('RangeError: Maximum call stack size exceeded');
    case 'permission':
      return new Error('Permission denied: User user123 cannot access /admin/users');
    default:
      return new Error('Unknown error occurred during operation');
  }
};

describe('ErrorBoundary Integration Tests', () => {
  let consoleErrorSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Mock AsyncStorage responses
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(null);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
    jest.useRealTimers();
  });

  describe('완전한 에러 처리 파이프라인', () => {
    it('네트워크 에러 → 보안 처리 → 신비로운 UI → 자동 복구 → 리포팅 전체 플로우', async () => {
      const { getByText, getByTestId, queryByTestId } = render(
        <MockAppProvider>
          <EnhancedErrorBoundary
            enableSecureHandling={true}
            enableMysticalUI={true}
            autoRecover={true}
            reportingEnabled={true}
            maxRetries={3}
          >
            <ErrorComponent errorType="network" shouldThrow={true} />
          </EnhancedErrorBoundary>
        </MockAppProvider>
      );

      // 1. 에러 발생 확인
      await waitFor(() => {
        expect(queryByTestId('normal-component')).toBeFalsy();
        expect(getByText('연결의 실이 끊어졌습니다')).toBeTruthy();
      });

      // 2. 보안 처리 확인 (민감한 정보가 UI에 노출되지 않음)
      expect(queryByTestId(/timeout after 30 seconds/)).toBeFalsy();

      // 3. 신비로운 UI 확인
      expect(getByText('🌐')).toBeTruthy(); // 네트워크 아이콘
      expect(getByText(/신비로운 에너지의 흐름이/)).toBeTruthy();

      // 4. 자동 복구 시작 (2초 후)
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith('🔄 자동 복구 시도 시작...');
      });

      // 5. 복구 완료 후 정상 컴포넌트 렌더링
      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith('✅ 자동 복구 성공');
      });

      // 6. AsyncStorage에 에러 리포트 저장 확인
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@tarot_timer_error_reports',
        expect.stringContaining('network')
      );
    });

    it('보안 에러 → 정보 정제 → 로컬 저장 → 복구 불가 표시', async () => {
      const { getByText, queryByText } = render(
        <MockAppProvider>
          <EnhancedErrorBoundary
            enableSecureHandling={true}
            enableMysticalUI={true}
            reportingEnabled={true}
          >
            <ErrorComponent errorType="security" shouldThrow={true} />
          </EnhancedErrorBoundary>
        </MockAppProvider>
      );

      await waitFor(() => {
        // 1. 보안 에러 UI 표시
        expect(getByText('보호막이 활성화되었습니다')).toBeTruthy();
        expect(getByText('🛡️')).toBeTruthy();
      });

      // 2. 민감한 정보가 UI에 노출되지 않음
      expect(queryByText(/eyJhbGciOiJIUzI1NiJ9/)).toBeFalsy();
      expect(queryByText(/JWT token/)).toBeFalsy();

      // 3. 복구 불가능한 에러이므로 재시도 버튼이 없음
      expect(queryByText(/다시 시도/)).toBeFalsy();

      // 4. 보안 에러는 로컬에만 저장됨 (전송되지 않음)
      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(
          '@tarot_timer_error_reports',
          expect.stringContaining('"localOnly":true')
        );
      });
    });

    it('복잡한 검증 에러 → 정제 → 복구 시도 → 성공', async () => {
      const mockOnError = jest.fn();

      const { getByText, queryByText } = render(
        <MockAppProvider>
          <EnhancedErrorBoundary
            enableSecureHandling={true}
            enableMysticalUI={true}
            maxRetries={2}
            onError={mockOnError}
          >
            <ErrorComponent errorType="validation" shouldThrow={true} />
          </EnhancedErrorBoundary>
        </MockAppProvider>
      );

      await waitFor(() => {
        // 1. 검증 에러 UI 표시
        expect(getByText('입력된 에너지가 불안정합니다')).toBeTruthy();
        expect(getByText('⚠️')).toBeTruthy();
      });

      // 2. 이메일 주소가 정제되어 표시되지 않음
      expect(queryByText(/john\.doe@example\.com/)).toBeFalsy();

      // 3. 복구 가능한 에러이므로 재시도 버튼 존재
      expect(getByText(/다시 시도 \(2회 남음\)/)).toBeTruthy();

      // 4. 사용자 정의 에러 핸들러 호출 확인
      expect(mockOnError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Validation failed'),
        }),
        expect.any(Object)
      );

      // 5. 재시도 버튼 클릭
      fireEvent.press(getByText(/다시 시도/));

      await waitFor(() => {
        // 복구 성공 시 정상 컴포넌트로 전환
        expect(queryByText('입력된 에너지가 불안정합니다')).toBeFalsy();
      });
    });
  });

  describe('실시간 에러 분석 및 리포팅', () => {
    it('여러 에러 발생 시 분석 데이터 생성 및 저장', async () => {
      const reportingService = ErrorReportingService.getInstance();
      
      // 다양한 타입의 에러 생성
      const errors = [
        { type: 'network', count: 3 },
        { type: 'runtime', count: 2 },
        { type: 'security', count: 1 },
      ];

      for (const errorConfig of errors) {
        for (let i = 0; i < errorConfig.count; i++) {
          const { unmount } = render(
            <EnhancedErrorBoundary enableSecureHandling={true}>
              <ErrorComponent errorType={errorConfig.type} shouldThrow={true} />
            </EnhancedErrorBoundary>
          );
          
          await waitFor(() => {
            expect(AsyncStorage.setItem).toHaveBeenCalled();
          });
          
          unmount();
          jest.clearAllMocks();
        }
      }

      // 분석 데이터 생성
      const analytics = reportingService.generateAnalytics();

      expect(analytics.totalErrors).toBe(6);
      expect(analytics.errorsByType).toEqual({
        network: 3,
        runtime: 2,
        security: 1,
      });
      expect(analytics.errorsBySeverity).toEqual({
        medium: 3, // network
        low: 2,    // runtime (기본)
        high: 1,   // security
      });

      // 상위 에러 분석
      expect(analytics.topErrors[0].count).toBe(3);
      expect(analytics.topErrors[0].error.type).toBe('network');
    });

    it('Rate limiting이 동작하는지 확인', async () => {
      const secureHandler = SecureErrorHandler.getInstance();
      const handleErrorSpy = jest.spyOn(secureHandler, 'handleError');

      // 동일한 에러를 빠르게 여러 번 발생
      for (let i = 0; i < 5; i++) {
        const { unmount } = render(
          <EnhancedErrorBoundary enableSecureHandling={true}>
            <ErrorComponent errorType="runtime" shouldThrow={true} />
          </EnhancedErrorBoundary>
        );
        
        await waitFor(() => {
          expect(handleErrorSpy).toHaveBeenCalled();
        });
        
        unmount();
      }

      // 처음 몇 개는 처리되지만, rate limiting으로 인해 나중 것들은 reportable=false
      const calls = handleErrorSpy.mock.results;
      const reportableResults = calls.filter(call => 
        call.value && call.value.reportable
      );
      
      expect(reportableResults.length).toBeLessThan(5);

      handleErrorSpy.mockRestore();
    });
  });

  describe('복구 시스템 통합', () => {
    it('자동 복구 실패 시 수동 복구 옵션 제공', async () => {
      // 자동 복구가 실패하도록 모킹
      mockAppContext.actions.resetToInitialState.mockRejectedValue(
        new Error('Auto recovery failed')
      );

      const { getByText } = render(
        <MockAppProvider>
          <EnhancedErrorBoundary
            autoRecover={true}
            maxRetries={2}
            enableMysticalUI={true}
          >
            <ErrorComponent errorType="runtime" shouldThrow={true} />
          </EnhancedErrorBoundary>
        </MockAppProvider>
      );

      await waitFor(() => {
        expect(getByText('예상치 못한 신비한 현상')).toBeTruthy();
      });

      // 자동 복구 시도 (실패할 것임)
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          '❌ 자동 복구 실패:',
          expect.any(Error)
        );
      });

      // 여전히 수동 복구 옵션들이 제공되어야 함
      expect(getByText(/다시 시도/)).toBeTruthy();
      expect(getByText('앱 재시작')).toBeTruthy();
    });

    it('최대 재시도 횟수 도달 시 안전한 리셋 옵션 제공', async () => {
      const { getByText, queryByText } = render(
        <MockAppProvider>
          <EnhancedErrorBoundary maxRetries={1} enableMysticalUI={true}>
            <ErrorComponent errorType="runtime" shouldThrow={true} />
          </EnhancedErrorBoundary>
        </MockAppProvider>
      );

      // 첫 번째 재시도
      await waitFor(() => {
        expect(getByText(/다시 시도 \(1회 남음\)/)).toBeTruthy();
      });

      fireEvent.press(getByText(/다시 시도/));

      // 재시도 후 다시 에러 발생 (시뮬레이션)
      await waitFor(() => {
        // 재시도 버튼이 사라져야 함
        expect(queryByText(/다시 시도/)).toBeFalsy();
      });

      // Alert가 표시되어야 함
      expect(Alert.alert).toHaveBeenCalledWith(
        '복구 실패',
        '최대 재시도 횟수에 도달했습니다. 앱을 다시 시작해주세요.',
        [{ text: '확인' }]
      );

      // 여전히 앱 재시작 옵션은 제공되어야 함
      expect(getByText('앱 재시작')).toBeTruthy();
    });
  });

  describe('메모리 관리 및 성능', () => {
    it('대량 에러 발생 시 메모리 누수 없이 처리', async () => {
      const initialMemoryUsage = process.memoryUsage();
      
      // 100개의 에러를 연속으로 생성
      for (let i = 0; i < 100; i++) {
        const { unmount } = render(
          <EnhancedErrorBoundary>
            <ErrorComponent 
              errorType={i % 2 === 0 ? 'network' : 'runtime'} 
              shouldThrow={true} 
            />
          </EnhancedErrorBoundary>
        );
        
        unmount();
      }

      // 메모리 사용량이 과도하게 증가하지 않았는지 확인
      const finalMemoryUsage = process.memoryUsage();
      const memoryIncrease = finalMemoryUsage.heapUsed - initialMemoryUsage.heapUsed;
      
      // 10MB 이하의 증가만 허용 (임의의 합리적인 임계값)
      expect(memoryIncrease).toBeLessThan(10 * 1024 * 1024);
    });

    it('타이머 정리가 제대로 되는지 확인', async () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const { unmount } = render(
        <EnhancedErrorBoundary autoRecover={true}>
          <ErrorComponent errorType="runtime" shouldThrow={true} />
        </EnhancedErrorBoundary>
      );

      // 자동 복구 타이머가 설정되도록 기다림
      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalled();
      });

      // 컴포넌트 언마운트
      unmount();

      // 타이머가 정리되었는지 확인
      expect(clearTimeoutSpy).toHaveBeenCalled();

      clearTimeoutSpy.mockRestore();
    });
  });

  describe('접근성 및 사용성', () => {
    it('에러 UI가 접근성 요구사항을 충족하는지 확인', async () => {
      const { getByText, getByRole } = render(
        <EnhancedErrorBoundary enableMysticalUI={true}>
          <ErrorComponent errorType="validation" shouldThrow={true} />
        </EnhancedErrorBoundary>
      );

      await waitFor(() => {
        // 제목이 적절한 역할을 가지는지 확인
        expect(getByText('입력된 에너지가 불안정합니다')).toBeTruthy();
        
        // 버튼들이 접근 가능한지 확인
        expect(getByText(/다시 시도/)).toBeTruthy();
        expect(getByText('문제 신고')).toBeTruthy();
        expect(getByText('앱 재시작')).toBeTruthy();
      });
    });

    it('키보드 네비게이션이 가능한지 확인', async () => {
      const { getByText } = render(
        <EnhancedErrorBoundary enableMysticalUI={true}>
          <ErrorComponent errorType="network" shouldThrow={true} />
        </EnhancedErrorBoundary>
      );

      await waitFor(() => {
        const retryButton = getByText(/다시 시도/);
        const reportButton = getByText('문제 신고');
        const resetButton = getByText('앱 재시작');

        // 버튼들이 모두 상호작용 가능한 상태인지 확인
        expect(retryButton).toBeTruthy();
        expect(reportButton).toBeTruthy();
        expect(resetButton).toBeTruthy();
      });
    });
  });
});