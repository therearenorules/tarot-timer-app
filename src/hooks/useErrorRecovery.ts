/**
 * 에러 복구를 위한 React Hook
 * Context API와 통합된 자동 복구 시스템
 */

import { useEffect, useCallback, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useAppContext } from '@/contexts';
import SecureErrorHandler from '@/lib/errorHandling/SecureErrorHandler';
import ErrorReportingService from '@/lib/errorHandling/ErrorReportingService';

interface RecoveryStrategy {
  id: string;
  name: string;
  description: string;
  execute: () => Promise<boolean>;
  canRecover: (error: Error) => boolean;
  priority: number; // 높을수록 우선순위
  maxRetries: number;
}

interface RecoveryOptions {
  enableAutoRecovery?: boolean;
  recoveryTimeout?: number; // milliseconds
  maxRecoveryAttempts?: number;
  notifyUser?: boolean;
  preserveUserData?: boolean;
}

interface RecoveryState {
  isRecovering: boolean;
  lastError: Error | null;
  recoveryAttempts: number;
  lastRecoveryTime: number;
  availableStrategies: RecoveryStrategy[];
  currentStrategy: RecoveryStrategy | null;
  recoveryHistory: Array<{
    error: Error;
    strategy: string;
    successful: boolean;
    timestamp: number;
  }>;
}

export function useErrorRecovery(options: RecoveryOptions = {}) {
  const {
    enableAutoRecovery = true,
    recoveryTimeout = 5000,
    maxRecoveryAttempts = 3,
    notifyUser = true,
    preserveUserData = true,
  } = options;

  const { state: appState, actions: appActions } = useAppContext();
  const secureErrorHandler = useRef(SecureErrorHandler.getInstance());
  const reportingService = useRef(ErrorReportingService.getInstance());
  
  const [recoveryState, setRecoveryState] = useState<RecoveryState>({
    isRecovering: false,
    lastError: null,
    recoveryAttempts: 0,
    lastRecoveryTime: 0,
    availableStrategies: [],
    currentStrategy: null,
    recoveryHistory: [],
  });

  // 복구 전략들 정의
  const createRecoveryStrategies = useCallback((): RecoveryStrategy[] => [
    {
      id: 'context_reset',
      name: '컨텍스트 초기화',
      description: '앱 상태를 초기값으로 재설정합니다',
      priority: 1,
      maxRetries: 2,
      canRecover: (error) => {
        const message = error.message.toLowerCase();
        return message.includes('state') || 
               message.includes('context') || 
               message.includes('undefined');
      },
      execute: async () => {
        try {
          // 중요한 사용자 데이터 백업
          const backup = preserveUserData ? {
            sessionId: appState.sessionId,
            userPreferences: appState.userPreferences,
            currentSession: appState.currentSession,
          } : null;

          // 앱 상태 초기화
          await appActions.resetToInitialState();

          // 필요시 백업 데이터 복원
          if (backup) {
            await appActions.restoreFromBackup(backup);
          }

          return true;
        } catch (error) {
          console.error('컨텍스트 재설정 실패:', error);
          return false;
        }
      },
    },
    {
      id: 'session_refresh',
      name: '세션 갱신',
      description: '현재 세션을 새로 고침합니다',
      priority: 2,
      maxRetries: 3,
      canRecover: (error) => {
        const message = error.message.toLowerCase();
        return message.includes('session') || 
               message.includes('expired') || 
               message.includes('timeout');
      },
      execute: async () => {
        try {
          // 세션 관련 상태만 새로 고침
          await appActions.refreshSession();
          return true;
        } catch (error) {
          console.error('세션 갱신 실패:', error);
          return false;
        }
      },
    },
    {
      id: 'data_sync',
      name: '데이터 동기화',
      description: '로컬 데이터를 다시 동기화합니다',
      priority: 3,
      maxRetries: 2,
      canRecover: (error) => {
        const message = error.message.toLowerCase();
        return message.includes('data') || 
               message.includes('sync') || 
               message.includes('network');
      },
      execute: async () => {
        try {
          // 데이터 동기화 시도
          await appActions.syncLocalData();
          return true;
        } catch (error) {
          console.error('데이터 동기화 실패:', error);
          return false;
        }
      },
    },
    {
      id: 'cache_clear',
      name: '캐시 정리',
      description: '앱 캐시를 정리하고 새로 로드합니다',
      priority: 4,
      maxRetries: 1,
      canRecover: (error) => {
        const message = error.message.toLowerCase();
        return message.includes('cache') || 
               message.includes('storage') || 
               message.includes('memory');
      },
      execute: async () => {
        try {
          // 앱 캐시 정리
          await appActions.clearAppCache();
          
          // 필수 데이터 다시 로드
          await appActions.loadEssentialData();
          return true;
        } catch (error) {
          console.error('캐시 정리 실패:', error);
          return false;
        }
      },
    },
    {
      id: 'component_remount',
      name: '컴포넌트 재마운트',
      description: '문제가 있는 컴포넌트를 다시 마운트합니다',
      priority: 5,
      maxRetries: 2,
      canRecover: (error) => {
        const stack = error.stack || '';
        return stack.includes('render') || 
               stack.includes('component') || 
               error.message.includes('render');
      },
      execute: async () => {
        try {
          // 컴포넌트 재마운트를 위한 키 변경
          await appActions.forceComponentRemount();
          return true;
        } catch (error) {
          console.error('컴포넌트 재마운트 실패:', error);
          return false;
        }
      },
    },
    {
      id: 'app_restart',
      name: '앱 재시작',
      description: '앱을 완전히 재시작합니다 (최후 수단)',
      priority: 10,
      maxRetries: 1,
      canRecover: () => true, // 모든 에러에 대해 최후 수단으로 가능
      execute: async () => {
        try {
          // 중요 데이터 저장
          if (preserveUserData) {
            await appActions.saveUserDataToStorage();
          }
          
          // 앱 재시작 (React Native에서는 RNRestart 등 사용)
          // 웹에서는 window.location.reload()
          if (typeof window !== 'undefined') {
            window.location.reload();
          }
          
          return true;
        } catch (error) {
          console.error('앱 재시작 실패:', error);
          return false;
        }
      },
    },
  ], [appActions, appState, preserveUserData]);

  // 전략 초기화
  useEffect(() => {
    setRecoveryState(prev => ({
      ...prev,
      availableStrategies: createRecoveryStrategies(),
    }));
  }, [createRecoveryStrategies]);

  // 에러에 적합한 복구 전략 선택
  const selectRecoveryStrategy = useCallback((error: Error): RecoveryStrategy | null => {
    const availableStrategies = recoveryState.availableStrategies
      .filter(strategy => strategy.canRecover(error))
      .sort((a, b) => a.priority - b.priority); // 우선순위 순으로 정렬

    return availableStrategies.length > 0 ? availableStrategies[0] : null;
  }, [recoveryState.availableStrategies]);

  // 자동 복구 실행
  const attemptRecovery = useCallback(async (error: Error): Promise<boolean> => {
    if (!enableAutoRecovery || recoveryState.isRecovering) {
      return false;
    }

    if (recoveryState.recoveryAttempts >= maxRecoveryAttempts) {
      console.warn('최대 복구 시도 횟수에 도달했습니다.');
      return false;
    }

    const strategy = selectRecoveryStrategy(error);
    if (!strategy) {
      console.warn('적용 가능한 복구 전략을 찾을 수 없습니다.');
      return false;
    }

    console.log(`🔄 에러 복구 시도: ${strategy.name}`);

    setRecoveryState(prev => ({
      ...prev,
      isRecovering: true,
      lastError: error,
      currentStrategy: strategy,
      recoveryAttempts: prev.recoveryAttempts + 1,
      lastRecoveryTime: Date.now(),
    }));

    // 사용자에게 알림
    if (notifyUser) {
      Alert.alert(
        '복구 중...',
        `${strategy.description}\n잠시만 기다려주세요.`,
        [],
        { cancelable: false }
      );
    }

    try {
      // 복구 타임아웃 설정
      const recoveryPromise = strategy.execute();
      const timeoutPromise = new Promise<boolean>((_, reject) =>
        setTimeout(() => reject(new Error('복구 타임아웃')), recoveryTimeout)
      );

      const success = await Promise.race([recoveryPromise, timeoutPromise]);

      // 복구 결과 기록
      const historyEntry = {
        error,
        strategy: strategy.name,
        successful: success,
        timestamp: Date.now(),
      };

      setRecoveryState(prev => ({
        ...prev,
        isRecovering: false,
        currentStrategy: null,
        recoveryHistory: [...prev.recoveryHistory.slice(-9), historyEntry], // 최근 10개만 유지
      }));

      // 에러 리포팅 서비스에 복구 시도 정보 업데이트
      const sanitizedError = secureErrorHandler.current.handleError(error, {
        sessionId: appState.sessionId,
        customData: { recoveryStrategy: strategy.name, recoverySuccess: success },
      }, 'recovery');

      await reportingService.current.updateRecovery(sanitizedError.id, {
        attempted: true,
        successful: success,
        strategy: strategy.id as any,
        retryCount: recoveryState.recoveryAttempts,
        timestamp: Date.now(),
      });

      if (success) {
        console.log(`✅ 복구 성공: ${strategy.name}`);
        if (notifyUser) {
          Alert.alert('복구 완료', '문제가 해결되었습니다.');
        }
        
        // 복구 성공 시 카운터 리셋
        setRecoveryState(prev => ({
          ...prev,
          recoveryAttempts: 0,
        }));
      } else {
        console.warn(`❌ 복구 실패: ${strategy.name}`);
      }

      return success;

    } catch (recoveryError) {
      console.error('복구 프로세스 중 오류:', recoveryError);
      
      setRecoveryState(prev => ({
        ...prev,
        isRecovering: false,
        currentStrategy: null,
        recoveryHistory: [...prev.recoveryHistory, {
          error,
          strategy: strategy.name,
          successful: false,
          timestamp: Date.now(),
        }],
      }));

      return false;
    }
  }, [
    enableAutoRecovery, 
    recoveryState.isRecovering, 
    recoveryState.recoveryAttempts, 
    maxRecoveryAttempts, 
    selectRecoveryStrategy, 
    recoveryTimeout, 
    notifyUser,
    appState.sessionId
  ]);

  // 수동 복구 실행
  const manualRecovery = useCallback(async (strategyId?: string): Promise<boolean> => {
    if (!recoveryState.lastError) {
      console.warn('복구할 에러가 없습니다.');
      return false;
    }

    let strategy: RecoveryStrategy | null = null;

    if (strategyId) {
      strategy = recoveryState.availableStrategies.find(s => s.id === strategyId) || null;
    } else {
      strategy = selectRecoveryStrategy(recoveryState.lastError);
    }

    if (!strategy) {
      console.warn('유효한 복구 전략을 찾을 수 없습니다.');
      return false;
    }

    return attemptRecovery(recoveryState.lastError);
  }, [recoveryState.lastError, recoveryState.availableStrategies, selectRecoveryStrategy, attemptRecovery]);

  // 복구 기록 정리
  const clearRecoveryHistory = useCallback(() => {
    setRecoveryState(prev => ({
      ...prev,
      recoveryHistory: [],
      recoveryAttempts: 0,
    }));
  }, []);

  // 복구 통계
  const getRecoveryStats = useCallback(() => {
    const history = recoveryState.recoveryHistory;
    const totalAttempts = history.length;
    const successfulAttempts = history.filter(h => h.successful).length;
    const successRate = totalAttempts > 0 ? (successfulAttempts / totalAttempts) * 100 : 0;

    const strategyCounts = history.reduce((acc, h) => {
      acc[h.strategy] = (acc[h.strategy] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalAttempts,
      successfulAttempts,
      successRate,
      strategyCounts,
      lastRecoveryTime: recoveryState.lastRecoveryTime,
    };
  }, [recoveryState]);

  return {
    // 상태
    isRecovering: recoveryState.isRecovering,
    lastError: recoveryState.lastError,
    currentStrategy: recoveryState.currentStrategy,
    recoveryAttempts: recoveryState.recoveryAttempts,
    availableStrategies: recoveryState.availableStrategies,
    
    // 액션
    attemptRecovery,
    manualRecovery,
    clearRecoveryHistory,
    
    // 통계
    recoveryHistory: recoveryState.recoveryHistory,
    getRecoveryStats,
  };
}