/**
 * ErrorBoundary 테스트 수트
 * 보안 에러 처리, 복구 메커니즘, UI 렌더링 검증
 */

import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

import { EnhancedErrorBoundary } from '../ErrorBoundary.enhanced';
import { MysticalErrorFallback } from '../errors/MysticalErrorFallback';
import SecureErrorHandler from '@/lib/errorHandling/SecureErrorHandler';
import ErrorReportingService from '@/lib/errorHandling/ErrorReportingService';

// Mock implementations
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

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

// Test components
const ThrowError = ({ shouldThrow, errorType }: { shouldThrow: boolean; errorType: string }) => {
  if (shouldThrow) {
    switch (errorType) {
      case 'network':
        throw new Error('Network request failed');
      case 'security':
        throw new Error('Authentication failed - invalid token');
      case 'validation':
        throw new Error('Invalid user input provided');
      case 'runtime':
        throw new Error('Cannot read property of undefined');
      default:
        throw new Error('Test error');
    }
  }
  return <div data-testid="normal-component">Normal Component</div>;
};

const MockAppProvider = ({ children }: { children: React.ReactNode }) => {
  const mockAppContext = {
    state: {
      sessionId: 'test-session-123',
      userPreferences: {},
      currentSession: null,
    },
    actions: {
      resetToInitialState: jest.fn(),
      restoreFromBackup: jest.fn(),
      refreshSession: jest.fn(),
      syncLocalData: jest.fn(),
      clearAppCache: jest.fn(),
      loadEssentialData: jest.fn(),
      forceComponentRemount: jest.fn(),
      saveUserDataToStorage: jest.fn(),
    },
  };
  
  return (
    <div data-testid="mock-app-provider">
      {children}
    </div>
  );
};

describe('EnhancedErrorBoundary', () => {
  let consoleErrorSpy: jest.SpyInstance;
  let mockOnError: jest.Mock;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockOnError = jest.fn();
    jest.clearAllMocks();
    
    // Mock AsyncStorage
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(null);
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  describe('기본 에러 처리', () => {
    it('정상적인 컴포넌트가 렌더링되어야 함', () => {
      const { getByTestId } = render(
        <EnhancedErrorBoundary>
          <ThrowError shouldThrow={false} errorType="" />
        </EnhancedErrorBoundary>
      );

      expect(getByTestId('normal-component')).toBeTruthy();
    });

    it('에러 발생 시 에러 UI를 표시해야 함', async () => {
      const { getByText, queryByTestId } = render(
        <EnhancedErrorBoundary onError={mockOnError}>
          <ThrowError shouldThrow={true} errorType="runtime" />
        </EnhancedErrorBoundary>
      );

      await waitFor(() => {
        expect(queryByTestId('normal-component')).toBeFalsy();
        expect(getByText('오류가 발생했습니다')).toBeTruthy();
      });

      expect(mockOnError).toHaveBeenCalledTimes(1);
    });

    it('사용자 정의 onError 핸들러가 호출되어야 함', async () => {
      render(
        <EnhancedErrorBoundary onError={mockOnError}>
          <ThrowError shouldThrow={true} errorType="runtime" />
        </EnhancedErrorBoundary>
      );

      await waitFor(() => {
        expect(mockOnError).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'Cannot read property of undefined',
          }),
          expect.objectContaining({
            componentStack: expect.any(String),
          })
        );
      });
    });
  });

  describe('보안 에러 처리', () => {
    it('보안 에러가 적절히 sanitize되어야 함', async () => {
      const secureHandler = SecureErrorHandler.getInstance();
      const spy = jest.spyOn(secureHandler, 'handleError');

      render(
        <EnhancedErrorBoundary enableSecureHandling={true}>
          <ThrowError shouldThrow={true} errorType="security" />
        </EnhancedErrorBoundary>
      );

      await waitFor(() => {
        expect(spy).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'Authentication failed - invalid token',
          }),
          expect.objectContaining({
            sessionId: expect.any(String),
            timestamp: expect.any(Number),
          }),
          'component_error'
        );
      });

      spy.mockRestore();
    });

    it('민감한 정보가 포함된 에러 메시지가 정제되어야 함', async () => {
      const errorWithSensitiveInfo = new Error('Database error: user email john@example.com not found');
      
      const { queryByText } = render(
        <EnhancedErrorBoundary enableSecureHandling={true}>
          <div>{(() => { throw errorWithSensitiveInfo; })()}</div>
        </EnhancedErrorBoundary>
      );

      await waitFor(() => {
        // 원본 민감한 정보가 UI에 노출되지 않아야 함
        expect(queryByText(/john@example\.com/)).toBeFalsy();
        expect(queryByText(/Database error/)).toBeFalsy();
      });
    });
  });

  describe('에러 타입별 처리', () => {
    it.each([
      ['network', '연결의 실이 끊어졌습니다'],
      ['runtime', '예상치 못한 신비한 현상'],
      ['validation', '입력된 에너지가 불안정합니다'],
      ['security', '보호막이 활성화되었습니다'],
    ])('%s 에러 타입이 올바른 메시지를 표시해야 함', async (errorType, expectedMessage) => {
      const { getByText } = render(
        <EnhancedErrorBoundary enableMysticalUI={true}>
          <ThrowError shouldThrow={true} errorType={errorType} />
        </EnhancedErrorBoundary>
      );

      await waitFor(() => {
        expect(getByText(expectedMessage)).toBeTruthy();
      });
    });
  });

  describe('복구 메커니즘', () => {
    it('재시도 버튼이 작동해야 함', async () => {
      const { getByText, getByTestId } = render(
        <EnhancedErrorBoundary maxRetries={3}>
          <ThrowError shouldThrow={true} errorType="runtime" />
        </EnhancedErrorBoundary>
      );

      await waitFor(() => {
        expect(getByText('다시 시도')).toBeTruthy();
      });

      fireEvent.press(getByText('다시 시도'));

      await waitFor(() => {
        // 재시도 후 정상 컴포넌트가 렌더링되어야 함 (에러가 해결되었다고 가정)
        expect(getByTestId('normal-component')).toBeTruthy();
      });
    });

    it('최대 재시도 횟수에 도달하면 재시도 버튼이 비활성화되어야 함', async () => {
      const { getByText, queryByText, rerender } = render(
        <EnhancedErrorBoundary maxRetries={1}>
          <ThrowError shouldThrow={true} errorType="runtime" />
        </EnhancedErrorBoundary>
      );

      // 첫 번째 재시도
      await waitFor(() => {
        expect(getByText('다시 시도')).toBeTruthy();
      });

      fireEvent.press(getByText('다시 시도'));

      // 다시 에러가 발생한다고 가정하여 재렌더링
      rerender(
        <EnhancedErrorBoundary maxRetries={1}>
          <ThrowError shouldThrow={true} errorType="runtime" />
        </EnhancedErrorBoundary>
      );

      await waitFor(() => {
        expect(queryByText('다시 시도')).toBeFalsy();
      });
    });

    it('자동 복구가 활성화되었을 때 복구를 시도해야 함', async () => {
      jest.useFakeTimers();

      render(
        <MockAppProvider>
          <EnhancedErrorBoundary autoRecover={true}>
            <ThrowError shouldThrow={true} errorType="runtime" />
          </EnhancedErrorBoundary>
        </MockAppProvider>
      );

      // 자동 복구 타이머 실행
      act(() => {
        jest.advanceTimersByTime(2000);
      });

      await waitFor(() => {
        expect(console.log).toHaveBeenCalledWith('🔄 자동 복구 시도 시작...');
      });

      jest.useRealTimers();
    });
  });

  describe('에러 리포팅', () => {
    it('에러 신고 버튼이 작동해야 함', async () => {
      const { getByText } = render(
        <EnhancedErrorBoundary reportingEnabled={true}>
          <ThrowError shouldThrow={true} errorType="runtime" />
        </EnhancedErrorBoundary>
      );

      await waitFor(() => {
        expect(getByText('오류 신고')).toBeTruthy();
      });

      fireEvent.press(getByText('오류 신고'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          '에러 신고 완료',
          expect.stringMatching(/에러 ID: error_\d+_\w+/),
          [{ text: '확인' }]
        );
      });
    });

    it('에러 리포팅이 비활성화된 경우 리포팅하지 않아야 함', async () => {
      const reportingSpy = jest.spyOn(ErrorReportingService.getInstance(), 'reportError');

      render(
        <EnhancedErrorBoundary reportingEnabled={false}>
          <ThrowError shouldThrow={true} errorType="runtime" />
        </EnhancedErrorBoundary>
      );

      await waitFor(() => {
        expect(reportingSpy).not.toHaveBeenCalled();
      });

      reportingSpy.mockRestore();
    });
  });

  describe('사용자 정의 폴백 UI', () => {
    it('사용자 정의 폴백이 제공되면 기본 UI 대신 렌더링되어야 함', async () => {
      const CustomFallback = () => <div data-testid="custom-fallback">Custom Error UI</div>;

      const { getByTestId } = render(
        <EnhancedErrorBoundary fallback={<CustomFallback />}>
          <ThrowError shouldThrow={true} errorType="runtime" />
        </EnhancedErrorBoundary>
      );

      await waitFor(() => {
        expect(getByTestId('custom-fallback')).toBeTruthy();
      });
    });
  });

  describe('디바이스 정보 수집', () => {
    it('디바이스 정보가 올바르게 수집되어야 함', async () => {
      const component = new EnhancedErrorBoundary({
        children: null,
        enableSecureHandling: true,
      });

      const deviceInfo = (component as any).getDeviceInfo();

      expect(deviceInfo).toEqual({
        platform: 'ios',
        osVersion: undefined,
        appVersion: '1.0.0',
        screenSize: { width: 375, height: 812 },
        locale: 'ko-KR',
        timezone: expect.any(String),
      });
    });

    it('앱 정보가 올바르게 생성되어야 함', async () => {
      const component = new EnhancedErrorBoundary({
        children: null,
      });

      const appInfo = (component as any).getAppInfo();

      expect(appInfo).toEqual({
        version: '1.0.0',
        environment: __DEV__ ? 'development' : 'production',
        features: ['tarot-timer', 'error-boundary', 'secure-handling'],
      });
    });
  });

  describe('컴포넌트 생명주기', () => {
    it('컴포넌트 언마운트 시 타이머가 정리되어야 함', async () => {
      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      const { unmount } = render(
        <EnhancedErrorBoundary autoRecover={true}>
          <ThrowError shouldThrow={true} errorType="runtime" />
        </EnhancedErrorBoundary>
      );

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();

      clearTimeoutSpy.mockRestore();
    });
  });
});

describe('MysticalErrorFallback', () => {
  const mockError = {
    id: 'test-error-123',
    type: 'runtime' as const,
    severity: 'medium' as const,
    category: 'component',
    message: 'Test error message',
    timestamp: Date.now(),
    reportable: true,
    recovered: true,
    sanitizedStack: 'sanitized stack trace',
  };

  const defaultProps = {
    error: mockError,
    onRetry: jest.fn(),
    onReport: jest.fn(),
    onReset: jest.fn(),
    retryCount: 1,
    maxRetries: 3,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('UI 렌더링', () => {
    it('에러 정보가 올바르게 표시되어야 함', () => {
      const { getByText } = render(<MysticalErrorFallback {...defaultProps} />);

      expect(getByText('예상치 못한 신비한 현상')).toBeTruthy();
      expect(getByText(/카드들이 예기치 못한 움직임을 보이고 있습니다/)).toBeTruthy();
    });

    it('심각도가 올바르게 표시되어야 함', () => {
      const { getByText } = render(<MysticalErrorFallback {...defaultProps} />);

      expect(getByText('심각도: 보통')).toBeTruthy();
    });

    it('재시도 버튼이 올바른 텍스트로 표시되어야 함', () => {
      const { getByText } = render(<MysticalErrorFallback {...defaultProps} />);

      expect(getByText('다시 시도 (2회 남음)')).toBeTruthy();
    });
  });

  describe('사용자 인터랙션', () => {
    it('재시도 버튼 클릭 시 onRetry가 호출되어야 함', () => {
      const { getByText } = render(<MysticalErrorFallback {...defaultProps} />);

      fireEvent.press(getByText('다시 시도 (2회 남음)'));

      expect(defaultProps.onRetry).toHaveBeenCalledTimes(1);
    });

    it('문제 신고 버튼 클릭 시 onReport가 호출되어야 함', () => {
      const { getByText } = render(<MysticalErrorFallback {...defaultProps} />);

      fireEvent.press(getByText('문제 신고'));

      expect(defaultProps.onReport).toHaveBeenCalledTimes(1);
    });

    it('앱 재시작 버튼 클릭 시 onReset이 호출되어야 함', () => {
      const { getByText } = render(<MysticalErrorFallback {...defaultProps} />);

      fireEvent.press(getByText('앱 재시작'));

      expect(defaultProps.onReset).toHaveBeenCalledTimes(1);
    });

    it('상세 정보 토글이 작동해야 함', () => {
      const { getByText, queryByText } = render(<MysticalErrorFallback {...defaultProps} />);

      // 초기에는 상세 정보가 숨겨져 있어야 함
      expect(queryByText('기술적 세부사항:')).toBeFalsy();

      // 토글 클릭
      fireEvent.press(getByText('상세 정보 보기 ▼'));

      // 상세 정보가 표시되어야 함
      expect(getByText('기술적 세부사항:')).toBeTruthy();
      expect(getByText('상세 정보 숨기기 ▲')).toBeTruthy();
    });
  });

  describe('에러 타입별 메시지', () => {
    it.each([
      ['network', '연결의 실이 끊어졌습니다', '🌐'],
      ['runtime', '예상치 못한 신비한 현상', '🔮'],
      ['validation', '입력된 에너지가 불안정합니다', '⚠️'],
      ['security', '보호막이 활성화되었습니다', '🛡️'],
      ['unknown', '알 수 없는 신비한 힘', '✨'],
    ])('%s 타입 에러가 올바른 메시지와 아이콘을 표시해야 함', (type, title, icon) => {
      const errorWithType = { ...mockError, type: type as any };
      const { getByText } = render(
        <MysticalErrorFallback {...defaultProps} error={errorWithType} />
      );

      expect(getByText(title)).toBeTruthy();
      expect(getByText(icon)).toBeTruthy();
    });
  });

  describe('복구 가능성', () => {
    it('복구 불가능한 에러는 재시도 버튼을 표시하지 않아야 함', () => {
      const unrecoverableError = { ...mockError, recovered: false };
      const { queryByText } = render(
        <MysticalErrorFallback {...defaultProps} error={unrecoverableError} />
      );

      expect(queryByText(/다시 시도/)).toBeFalsy();
    });

    it('최대 재시도 횟수에 도달하면 재시도 버튼을 표시하지 않아야 함', () => {
      const { queryByText } = render(
        <MysticalErrorFallback {...defaultProps} retryCount={3} />
      );

      expect(queryByText(/다시 시도/)).toBeFalsy();
    });
  });

  describe('리포트 가능성', () => {
    it('리포트 불가능한 에러는 신고 버튼을 표시하지 않아야 함', () => {
      const nonReportableError = { ...mockError, reportable: false };
      const { queryByText } = render(
        <MysticalErrorFallback {...defaultProps} error={nonReportableError} />
      );

      expect(queryByText('문제 신고')).toBeFalsy();
    });
  });
});