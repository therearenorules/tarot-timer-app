/**
 * Context Providers Export
 * Context API 기반 상태 관리 시스템 통합 export
 */

// ===== ERROR MANAGEMENT =====
export {
  AppErrorBoundary,
  ErrorProvider,
  useError,
  useErrorState,
  useErrorActions,
  useErrorReporter,
} from './ErrorBoundary';

export type {
  AppError,
  ErrorContextState,
} from './ErrorBoundary';

// ===== LOADING MANAGEMENT =====
export {
  LoadingProvider,
  LoadingOverlay,
  useLoading,
  useLoadingState,
  useLoadingActions,
  useAsyncLoading,
} from './LoadingContext';

export type {
  LoadingItem,
  LoadingContextState,
} from './LoadingContext';

// ===== DEVELOPMENT TOOLS =====
export {
  DevToolsProvider,
  useDevTools,
  usePerformanceTracking,
  useStateTracking,
} from './DevTools';

// ===== COMBINED PROVIDER =====
import React from 'react';
import { ErrorProvider, AppErrorBoundary } from './ErrorBoundary';
import { LoadingProvider, LoadingOverlay } from './LoadingContext';
import { DevToolsProvider } from './DevTools';

/**
 * 모든 Context Provider를 결합한 루트 프로바이더
 * 앱의 최상위에서 사용
 */
export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <DevToolsProvider>
      <ErrorProvider>
        <AppErrorBoundary>
          <LoadingProvider>
            {children}
            <LoadingOverlay />
          </LoadingProvider>
        </AppErrorBoundary>
      </ErrorProvider>
    </DevToolsProvider>
  );
};

// ===== HOOKS COMBINATIONS =====
export const useAppState = () => {
  const errorState = useErrorState();
  const loadingState = useLoadingState();
  
  return {
    errors: errorState,
    loading: loadingState,
  };
};

export const useAppActions = () => {
  const errorActions = useErrorActions();
  const loadingActions = useLoadingActions();
  
  return {
    ...errorActions,
    ...loadingActions,
  };
};