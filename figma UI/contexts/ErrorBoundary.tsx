/**
 * Error Boundary - 전역 에러 처리 및 복구
 * React Error Boundary와 Context API를 결합한 포괄적인 에러 관리
 */

import React, { 
  Component, 
  ErrorInfo, 
  ReactNode, 
  createContext, 
  useContext,
  useState,
  useCallback,
  useEffect
} from 'react';

// ===== ERROR TYPES =====
export interface AppError {
  id: string;
  type: 'runtime' | 'async' | 'network' | 'validation' | 'system';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  stack?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  recovered?: boolean;
  retryAttempts?: number;
  component?: string;
}

export interface ErrorContextState {
  errors: AppError[];
  lastError?: AppError;
  isRecovering: boolean;
  retryCount: number;
}

// ===== ERROR CONTEXT =====
interface ErrorContextValue {
  state: ErrorContextState;
  
  // Actions
  reportError: (error: Omit<AppError, 'id' | 'timestamp'>) => void;
  clearError: (id: string) => void;
  clearAllErrors: () => void;
  retryLastError: () => void;
  
  // Recovery
  recover: () => void;
  canRecover: () => boolean;
}

const ErrorContext = createContext<ErrorContextValue | null>(null);

// ===== ERROR PROVIDER =====
export const ErrorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ErrorContextState>({
    errors: [],
    isRecovering: false,
    retryCount: 0,
  });

  // Error reporting
  const reportError = useCallback((errorData: Omit<AppError, 'id' | 'timestamp'>) => {
    const error: AppError = {
      ...errorData,
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      retryAttempts: 0,
    };

    setState(prev => ({
      ...prev,
      errors: [...prev.errors, error],
      lastError: error,
    }));

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('🚨 App Error Reported:', error);
    }

    // Report to external service (예: Sentry, LogRocket 등)
    // reportToExternalService(error);
  }, []);

  // Error clearing
  const clearError = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      errors: prev.errors.filter(error => error.id !== id),
    }));
  }, []);

  const clearAllErrors = useCallback(() => {
    setState(prev => ({
      ...prev,
      errors: [],
      lastError: undefined,
      isRecovering: false,
      retryCount: 0,
    }));
  }, []);

  // Retry mechanism
  const retryLastError = useCallback(() => {
    if (!state.lastError || state.lastError.retryAttempts! >= 3) {
      return;
    }

    setState(prev => ({
      ...prev,
      isRecovering: true,
      retryCount: prev.retryCount + 1,
    }));

    // 에러 재시도 로직 (실제 구현에서는 상황에 따라 다름)
    setTimeout(() => {
      setState(prev => ({
        ...prev,
        isRecovering: false,
        lastError: prev.lastError ? {
          ...prev.lastError,
          retryAttempts: (prev.lastError.retryAttempts || 0) + 1
        } : undefined
      }));
    }, 2000);
  }, [state.lastError]);

  // Recovery mechanism
  const recover = useCallback(() => {
    setState(prev => ({
      ...prev,
      isRecovering: true,
    }));

    // 복구 로직 실행
    setTimeout(() => {
      setState(prev => ({
        errors: prev.errors.map(error => ({ ...error, recovered: true })),
        isRecovering: false,
        retryCount: 0,
      }));
    }, 1000);
  }, []);

  const canRecover = useCallback(() => {
    const criticalErrors = state.errors.filter(
      error => error.severity === 'critical' && !error.recovered
    );
    return criticalErrors.length === 0;
  }, [state.errors]);

  // Auto-recovery for minor errors
  useEffect(() => {
    const minorErrors = state.errors.filter(
      error => error.severity === 'low' && !error.recovered
    );

    if (minorErrors.length > 0) {
      const timer = setTimeout(() => {
        setState(prev => ({
          ...prev,
          errors: prev.errors.map(error => 
            error.severity === 'low' ? { ...error, recovered: true } : error
          )
        }));
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [state.errors]);

  const value: ErrorContextValue = {
    state,
    reportError,
    clearError,
    clearAllErrors,
    retryLastError,
    recover,
    canRecover,
  };

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
};

// ===== ERROR BOUNDARY COMPONENT =====
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  errorId?: string;
}

export class AppErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  ErrorBoundaryState
> {
  static contextType = ErrorContext;
  declare context: React.ContextType<typeof ErrorContext>;

  constructor(props: { children: ReactNode; fallback?: ReactNode }) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
      errorId: `boundary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      errorInfo,
    });

    // Report to error context
    if (this.context?.reportError) {
      this.context.reportError({
        type: 'runtime',
        severity: 'high',
        message: error.message,
        stack: error.stack,
        component: 'ErrorBoundary',
        metadata: {
          componentStack: errorInfo.componentStack,
        },
      });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      errorId: undefined,
    });

    if (this.context?.recover) {
      this.context.recover();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorFallback 
          error={this.state.error}
          onRetry={this.handleRetry}
          canRecover={this.context?.canRecover() ?? true}
        />
      );
    }

    return this.props.children;
  }
}

// ===== ERROR FALLBACK UI =====
interface ErrorFallbackProps {
  error?: Error;
  onRetry: () => void;
  canRecover: boolean;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  onRetry, 
  canRecover 
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '400px',
      padding: '2rem',
      textAlign: 'center',
      backgroundColor: '#fff5f5',
      border: '1px solid #fed7d7',
      borderRadius: '8px',
      margin: '1rem',
    }}>
      <div style={{
        fontSize: '3rem',
        marginBottom: '1rem',
      }}>
        😵
      </div>
      
      <h2 style={{
        color: '#e53e3e',
        marginBottom: '0.5rem',
        fontSize: '1.5rem',
      }}>
        앗! 문제가 발생했습니다
      </h2>
      
      <p style={{
        color: '#718096',
        marginBottom: '1.5rem',
        maxWidth: '500px',
      }}>
        {error?.message || '예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'}
      </p>
      
      {canRecover && (
        <button
          onClick={onRetry}
          style={{
            backgroundColor: '#3182ce',
            color: 'white',
            padding: '0.75rem 1.5rem',
            border: 'none',
            borderRadius: '6px',
            fontSize: '1rem',
            cursor: 'pointer',
            marginBottom: '1rem',
          }}
        >
          다시 시도
        </button>
      )}
      
      <button
        onClick={() => window.location.reload()}
        style={{
          backgroundColor: 'transparent',
          color: '#3182ce',
          padding: '0.5rem 1rem',
          border: '1px solid #3182ce',
          borderRadius: '6px',
          fontSize: '0.9rem',
          cursor: 'pointer',
        }}
      >
        페이지 새로고침
      </button>
      
      {process.env.NODE_ENV === 'development' && error?.stack && (
        <details style={{ marginTop: '2rem', textAlign: 'left', width: '100%' }}>
          <summary style={{ cursor: 'pointer', marginBottom: '1rem' }}>
            개발자 정보
          </summary>
          <pre style={{
            fontSize: '0.8rem',
            backgroundColor: '#f7fafc',
            padding: '1rem',
            borderRadius: '4px',
            overflow: 'auto',
            maxHeight: '200px',
          }}>
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  );
};

// ===== HOOKS =====
export const useError = (): ErrorContextValue => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within ErrorProvider');
  }
  return context;
};

// ===== CONVENIENCE HOOKS =====
export const useErrorState = () => {
  const { state } = useError();
  return state;
};

export const useErrorActions = () => {
  const { 
    reportError, 
    clearError, 
    clearAllErrors, 
    retryLastError, 
    recover, 
    canRecover 
  } = useError();
  return { 
    reportError, 
    clearError, 
    clearAllErrors, 
    retryLastError, 
    recover, 
    canRecover 
  };
};

// ===== ERROR REPORTER HOOK =====
export const useErrorReporter = () => {
  const { reportError } = useError();

  const reportAsyncError = useCallback((error: Error, metadata?: Record<string, any>) => {
    reportError({
      type: 'async',
      severity: 'medium',
      message: error.message,
      stack: error.stack,
      metadata,
    });
  }, [reportError]);

  const reportNetworkError = useCallback((error: Error, endpoint?: string) => {
    reportError({
      type: 'network',
      severity: 'medium',
      message: error.message,
      metadata: { endpoint },
    });
  }, [reportError]);

  const reportValidationError = useCallback((message: string, field?: string) => {
    reportError({
      type: 'validation',
      severity: 'low',
      message,
      metadata: { field },
    });
  }, [reportError]);

  return {
    reportAsyncError,
    reportNetworkError,
    reportValidationError,
  };
};