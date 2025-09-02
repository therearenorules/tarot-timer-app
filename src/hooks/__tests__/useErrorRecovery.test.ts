/**
 * useErrorRecovery Hook 테스트 수트
 * 에러 복구 전략, 자동 복구, 수동 복구 검증
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { useErrorRecovery } from '../useErrorRecovery';

// React Native 모킹
jest.mock('react-native', () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

// Context 모킹
const mockAppActions = {
  resetToInitialState: jest.fn(),
  restoreFromBackup: jest.fn(),
  refreshSession: jest.fn(),
  syncLocalData: jest.fn(),
  clearAppCache: jest.fn(),
  loadEssentialData: jest.fn(),
  forceComponentRemount: jest.fn(),
  saveUserDataToStorage: jest.fn(),
};

const mockAppState = {
  sessionId: 'test-session-123',
  userPreferences: { theme: 'dark' },
  currentSession: { startTime: Date.now() },
};

const mockAppContext = {
  state: mockAppState,
  actions: mockAppActions,
};

jest.mock('@/contexts', () => ({
  useAppContext: () => mockAppContext,
}));

// SecureErrorHandler 모킹
jest.mock('@/lib/errorHandling/SecureErrorHandler', () => ({
  __esModule: true,
  default: {
    getInstance: jest.fn(() => ({
      handleError: jest.fn((error) => ({
        id: 'sanitized-error-123',
        type: 'runtime',
        severity: 'medium',
        message: error.message,
        timestamp: Date.now(),
      })),
    })),
  },
}));

// ErrorReportingService 모킹
jest.mock('@/lib/errorHandling/ErrorReportingService', () => ({
  __esModule: true,
  default: {
    getInstance: jest.fn(() => ({
      updateRecovery: jest.fn(),
    })),
  },
}));

describe('useErrorRecovery', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
    jest.clearAllTimers();
    jest.useFakeTimers();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    jest.useRealTimers();
  });

  describe('Hook 초기화', () => {
    it('기본 옵션으로 초기화되어야 함', () => {
      const { result } = renderHook(() => useErrorRecovery());

      expect(result.current.isRecovering).toBe(false);
      expect(result.current.lastError).toBe(null);
      expect(result.current.currentStrategy).toBe(null);
      expect(result.current.recoveryAttempts).toBe(0);
      expect(result.current.availableStrategies).toHaveLength(6);
    });

    it('사용자 정의 옵션이 적용되어야 함', () => {
      const customOptions = {
        enableAutoRecovery: false,
        recoveryTimeout: 10000,
        maxRecoveryAttempts: 5,
        notifyUser: false,
        preserveUserData: false,
      };

      const { result } = renderHook(() => useErrorRecovery(customOptions));

      expect(result.current.availableStrategies).toHaveLength(6);
      // 옵션이 내부적으로 올바르게 설정되는지는 실제 복구 시도를 통해 검증
    });
  });

  describe('복구 전략', () => {
    it('모든 복구 전략이 생성되어야 함', () => {
      const { result } = renderHook(() => useErrorRecovery());

      const strategies = result.current.availableStrategies;
      const strategyIds = strategies.map(s => s.id);

      expect(strategyIds).toContain('context_reset');
      expect(strategyIds).toContain('session_refresh');
      expect(strategyIds).toContain('data_sync');
      expect(strategyIds).toContain('cache_clear');
      expect(strategyIds).toContain('component_remount');
      expect(strategyIds).toContain('app_restart');
    });

    it('전략이 우선순위 순으로 정렬되어야 함', () => {
      const { result } = renderHook(() => useErrorRecovery());

      const strategies = result.current.availableStrategies;
      const priorities = strategies.map(s => s.priority);

      for (let i = 1; i < priorities.length; i++) {
        expect(priorities[i]).toBeGreaterThanOrEqual(priorities[i - 1]);
      }
    });

    it('각 전략이 올바른 에러 타입을 감지해야 함', () => {
      const { result } = renderHook(() => useErrorRecovery());

      const strategies = result.current.availableStrategies;
      
      // Context reset 전략 테스트
      const contextStrategy = strategies.find(s => s.id === 'context_reset');
      expect(contextStrategy?.canRecover(new Error('state is undefined'))).toBe(true);
      expect(contextStrategy?.canRecover(new Error('network timeout'))).toBe(false);

      // Session refresh 전략 테스트
      const sessionStrategy = strategies.find(s => s.id === 'session_refresh');
      expect(sessionStrategy?.canRecover(new Error('session expired'))).toBe(true);
      expect(sessionStrategy?.canRecover(new Error('validation error'))).toBe(false);

      // Network/Data sync 전략 테스트
      const dataStrategy = strategies.find(s => s.id === 'data_sync');
      expect(dataStrategy?.canRecover(new Error('network error'))).toBe(true);
      expect(dataStrategy?.canRecover(new Error('render error'))).toBe(false);
    });
  });

  describe('자동 복구', () => {
    it('자동 복구가 성공적으로 실행되어야 함', async () => {
      mockAppActions.resetToInitialState.mockResolvedValue(undefined);
      mockAppActions.restoreFromBackup.mockResolvedValue(undefined);

      const { result } = renderHook(() => useErrorRecovery({
        enableAutoRecovery: true,
        notifyUser: true,
      }));

      const testError = new Error('context is undefined');

      await act(async () => {
        const success = await result.current.attemptRecovery(testError);
        expect(success).toBe(true);
      });

      expect(mockAppActions.resetToInitialState).toHaveBeenCalled();
      expect(Alert.alert).toHaveBeenCalledWith(
        '복구 중...',
        expect.stringContaining('앱 상태를 초기값으로 재설정합니다'),
        [],
        { cancelable: false }
      );
    });

    it('자동 복구가 비활성화되면 실행되지 않아야 함', async () => {
      const { result } = renderHook(() => useErrorRecovery({
        enableAutoRecovery: false,
      }));

      const testError = new Error('test error');

      await act(async () => {
        const success = await result.current.attemptRecovery(testError);
        expect(success).toBe(false);
      });

      expect(mockAppActions.resetToInitialState).not.toHaveBeenCalled();
    });

    it('최대 복구 시도 횟수에 도달하면 중단되어야 함', async () => {
      const { result } = renderHook(() => useErrorRecovery({
        maxRecoveryAttempts: 2,
      }));

      const testError = new Error('persistent error');

      // 첫 번째와 두 번째 시도
      await act(async () => {
        await result.current.attemptRecovery(testError);
      });
      await act(async () => {
        await result.current.attemptRecovery(testError);
      });

      // 세 번째 시도는 거부되어야 함
      await act(async () => {
        const success = await result.current.attemptRecovery(testError);
        expect(success).toBe(false);
      });

      expect(consoleLogSpy).toHaveBeenCalledWith('최대 복구 시도 횟수에 도달했습니다.');
    });

    it('복구 타임아웃이 작동해야 함', async () => {
      // 타임아웃을 발생시키기 위해 느린 복구 액션 모킹
      mockAppActions.resetToInitialState.mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 10000))
      );

      const { result } = renderHook(() => useErrorRecovery({
        recoveryTimeout: 1000, // 1초 타임아웃
      }));

      const testError = new Error('context error');

      await act(async () => {
        const recoveryPromise = result.current.attemptRecovery(testError);
        
        // 타이머 진행
        jest.advanceTimersByTime(1500);
        
        const success = await recoveryPromise;
        expect(success).toBe(false);
      });
    });
  });

  describe('수동 복구', () => {
    it('특정 전략으로 수동 복구가 실행되어야 함', async () => {
      mockAppActions.refreshSession.mockResolvedValue(undefined);

      const { result } = renderHook(() => useErrorRecovery());

      const testError = new Error('session expired');

      // 먼저 에러를 설정
      await act(async () => {
        await result.current.attemptRecovery(testError);
      });

      // 특정 전략으로 수동 복구
      await act(async () => {
        const success = await result.current.manualRecovery('session_refresh');
        expect(success).toBe(true);
      });

      expect(mockAppActions.refreshSession).toHaveBeenCalled();
    });

    it('마지막 에러가 없으면 수동 복구가 실패해야 함', async () => {
      const { result } = renderHook(() => useErrorRecovery());

      await act(async () => {
        const success = await result.current.manualRecovery();
        expect(success).toBe(false);
      });

      expect(consoleLogSpy).toHaveBeenCalledWith('복구할 에러가 없습니다.');
    });

    it('존재하지 않는 전략 ID로 수동 복구 시 실패해야 함', async () => {
      const { result } = renderHook(() => useErrorRecovery());

      const testError = new Error('test error');

      // 에러 설정
      await act(async () => {
        await result.current.attemptRecovery(testError);
      });

      // 잘못된 전략 ID로 복구 시도
      await act(async () => {
        const success = await result.current.manualRecovery('non_existent_strategy');
        expect(success).toBe(false);
      });

      expect(consoleLogSpy).toHaveBeenCalledWith('유효한 복구 전략을 찾을 수 없습니다.');
    });
  });

  describe('복구 기록', () => {
    it('복구 시도가 기록되어야 함', async () => {
      mockAppActions.resetToInitialState.mockResolvedValue(undefined);

      const { result } = renderHook(() => useErrorRecovery());

      const testError = new Error('test error');

      await act(async () => {
        await result.current.attemptRecovery(testError);
      });

      expect(result.current.recoveryHistory).toHaveLength(1);
      expect(result.current.recoveryHistory[0]).toMatchObject({
        error: testError,
        successful: true,
      });
    });

    it('복구 기록을 정리할 수 있어야 함', async () => {
      const { result } = renderHook(() => useErrorRecovery());

      const testError = new Error('test error');

      // 복구 시도
      await act(async () => {
        await result.current.attemptRecovery(testError);
      });

      // 기록 정리
      act(() => {
        result.current.clearRecoveryHistory();
      });

      expect(result.current.recoveryHistory).toHaveLength(0);
      expect(result.current.recoveryAttempts).toBe(0);
    });

    it('복구 통계가 올바르게 계산되어야 함', async () => {
      mockAppActions.resetToInitialState
        .mockResolvedValueOnce(undefined) // 성공
        .mockRejectedValueOnce(new Error('Failed')); // 실패

      const { result } = renderHook(() => useErrorRecovery());

      const testError = new Error('test error');

      // 성공하는 복구
      await act(async () => {
        await result.current.attemptRecovery(testError);
      });

      // 실패하는 복구
      await act(async () => {
        await result.current.attemptRecovery(testError);
      });

      const stats = result.current.getRecoveryStats();
      
      expect(stats.totalAttempts).toBe(2);
      expect(stats.successfulAttempts).toBe(1);
      expect(stats.successRate).toBe(50);
    });
  });

  describe('알림 시스템', () => {
    it('사용자 알림이 활성화되면 Alert가 표시되어야 함', async () => {
      const { result } = renderHook(() => useErrorRecovery({
        notifyUser: true,
      }));

      const testError = new Error('context error');

      await act(async () => {
        await result.current.attemptRecovery(testError);
      });

      expect(Alert.alert).toHaveBeenCalledWith(
        '복구 중...',
        expect.any(String),
        [],
        { cancelable: false }
      );
    });

    it('사용자 알림이 비활성화되면 Alert가 표시되지 않아야 함', async () => {
      const { result } = renderHook(() => useErrorRecovery({
        notifyUser: false,
      }));

      const testError = new Error('context error');

      await act(async () => {
        await result.current.attemptRecovery(testError);
      });

      expect(Alert.alert).not.toHaveBeenCalled();
    });

    it('복구 성공 시 성공 알림이 표시되어야 함', async () => {
      mockAppActions.resetToInitialState.mockResolvedValue(undefined);

      const { result } = renderHook(() => useErrorRecovery({
        notifyUser: true,
      }));

      const testError = new Error('context error');

      await act(async () => {
        await result.current.attemptRecovery(testError);
      });

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('복구 완료', '문제가 해결되었습니다.');
      });
    });
  });

  describe('에러 처리', () => {
    it('복구 전략 실행 중 에러가 발생해도 안전하게 처리되어야 함', async () => {
      mockAppActions.resetToInitialState.mockRejectedValue(new Error('Recovery failed'));

      const { result } = renderHook(() => useErrorRecovery());

      const testError = new Error('context error');

      await act(async () => {
        const success = await result.current.attemptRecovery(testError);
        expect(success).toBe(false);
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith('복구 프로세스 중 오류:', expect.any(Error));
      expect(result.current.isRecovering).toBe(false);
    });

    it('적용 가능한 복구 전략이 없으면 실패해야 함', async () => {
      const { result } = renderHook(() => useErrorRecovery());

      // 어떤 전략도 적용할 수 없는 에러
      const unsupportedError = new Error('unsupported error type');

      await act(async () => {
        const success = await result.current.attemptRecovery(unsupportedError);
        expect(success).toBe(false);
      });

      expect(consoleLogSpy).toHaveBeenCalledWith('적용 가능한 복구 전략을 찾을 수 없습니다.');
    });
  });

  describe('데이터 보존', () => {
    it('사용자 데이터 보존이 활성화되면 백업/복원이 수행되어야 함', async () => {
      mockAppActions.resetToInitialState.mockResolvedValue(undefined);
      mockAppActions.restoreFromBackup.mockResolvedValue(undefined);

      const { result } = renderHook(() => useErrorRecovery({
        preserveUserData: true,
      }));

      const testError = new Error('context error');

      await act(async () => {
        await result.current.attemptRecovery(testError);
      });

      expect(mockAppActions.resetToInitialState).toHaveBeenCalled();
      expect(mockAppActions.restoreFromBackup).toHaveBeenCalledWith({
        sessionId: mockAppState.sessionId,
        userPreferences: mockAppState.userPreferences,
        currentSession: mockAppState.currentSession,
      });
    });

    it('사용자 데이터 보존이 비활성화되면 백업 없이 복구되어야 함', async () => {
      mockAppActions.resetToInitialState.mockResolvedValue(undefined);

      const { result } = renderHook(() => useErrorRecovery({
        preserveUserData: false,
      }));

      const testError = new Error('context error');

      await act(async () => {
        await result.current.attemptRecovery(testError);
      });

      expect(mockAppActions.resetToInitialState).toHaveBeenCalled();
      expect(mockAppActions.restoreFromBackup).not.toHaveBeenCalled();
    });
  });
});