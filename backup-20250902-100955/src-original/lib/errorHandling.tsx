/**
 * Error Handling Utilities
 * Centralized error processing, logging, and recovery
 */

import { Alert } from 'react-native';

// Error types for better categorization
export enum ErrorType {
  NETWORK = 'NETWORK',
  DATABASE = 'DATABASE',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  PERMISSION = 'PERMISSION',
  UNKNOWN = 'UNKNOWN',
  USER_ACTION = 'USER_ACTION',
  SYSTEM = 'SYSTEM',
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

// Enhanced error interface
export interface AppError {
  id: string;
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  originalError?: Error;
  context?: Record<string, any>;
  timestamp: Date;
  stack?: string;
  recoverable: boolean;
  userMessage?: string;
}

// Error logging service
class ErrorLogger {
  private errors: AppError[] = [];
  private maxErrors = 100; // Keep last 100 errors

  log(error: AppError): void {
    this.errors.unshift(error);
    
    // Keep only recent errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(0, this.maxErrors);
    }

    // Console logging with formatting
    this.logToConsole(error);

    // In production, send to remote logging service
    if (!__DEV__) {
      this.sendToRemoteService(error);
    }
  }

  private logToConsole(error: AppError): void {
    const logLevel = this.getConsoleLogLevel(error.severity);
    const prefix = this.getLogPrefix(error);
    
    console.group(`${prefix} ${error.message}`);
    console[logLevel]('Error ID:', error.id);
    console[logLevel]('Type:', error.type);
    console[logLevel]('Severity:', error.severity);
    console[logLevel]('Timestamp:', error.timestamp.toISOString());
    console[logLevel]('Recoverable:', error.recoverable);
    
    if (error.context) {
      console[logLevel]('Context:', error.context);
    }
    
    if (error.originalError) {
      console[logLevel]('Original Error:', error.originalError);
    }
    
    if (error.stack) {
      console[logLevel]('Stack:', error.stack);
    }
    
    console.groupEnd();
  }

  private getConsoleLogLevel(severity: ErrorSeverity): 'log' | 'warn' | 'error' {
    switch (severity) {
      case ErrorSeverity.LOW:
        return 'log';
      case ErrorSeverity.MEDIUM:
        return 'warn';
      case ErrorSeverity.HIGH:
      case ErrorSeverity.CRITICAL:
        return 'error';
      default:
        return 'error';
    }
  }

  private getLogPrefix(error: AppError): string {
    const typeEmojis = {
      [ErrorType.NETWORK]: '🌐',
      [ErrorType.DATABASE]: '🗄️',
      [ErrorType.VALIDATION]: '✅',
      [ErrorType.AUTHENTICATION]: '🔐',
      [ErrorType.PERMISSION]: '🔒',
      [ErrorType.USER_ACTION]: '👤',
      [ErrorType.SYSTEM]: '⚙️',
      [ErrorType.UNKNOWN]: '❓',
    };

    const severityEmojis = {
      [ErrorSeverity.LOW]: '🔵',
      [ErrorSeverity.MEDIUM]: '🟡',
      [ErrorSeverity.HIGH]: '🟠',
      [ErrorSeverity.CRITICAL]: '🔴',
    };

    return `${typeEmojis[error.type]} ${severityEmojis[error.severity]}`;
  }

  private async sendToRemoteService(error: AppError): Promise<void> {
    try {
      // In production, implement actual remote logging
      // Example: await fetch('/api/errors', { method: 'POST', body: JSON.stringify(error) })
      console.log('📤 Would send error to remote service:', error.id);
    } catch (e) {
      console.error('Failed to send error to remote service:', e);
    }
  }

  getErrors(): AppError[] {
    return [...this.errors];
  }

  clearErrors(): void {
    this.errors = [];
  }

  getErrorById(id: string): AppError | undefined {
    return this.errors.find(error => error.id === id);
  }
}

// Global error logger instance
export const errorLogger = new ErrorLogger();

// Error creation helpers
export function createAppError(
  type: ErrorType,
  severity: ErrorSeverity,
  message: string,
  originalError?: Error,
  context?: Record<string, any>
): AppError {
  return {
    id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    severity,
    message,
    originalError,
    context,
    timestamp: new Date(),
    stack: originalError?.stack || new Error().stack,
    recoverable: severity !== ErrorSeverity.CRITICAL,
    userMessage: getUserMessage(type, message),
  };
}

// User-friendly error messages
function getUserMessage(type: ErrorType, message: string): string {
  switch (type) {
    case ErrorType.NETWORK:
      return '네트워크 연결을 확인해 주세요. 인터넷 연결이 불안정할 수 있습니다.';
    case ErrorType.DATABASE:
      return '데이터를 처리하는 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
    case ErrorType.VALIDATION:
      return '입력하신 정보를 확인해 주세요.';
    case ErrorType.AUTHENTICATION:
      return '인증에 문제가 발생했습니다. 다시 로그인해 주세요.';
    case ErrorType.PERMISSION:
      return '이 기능을 사용하기 위한 권한이 필요합니다.';
    case ErrorType.USER_ACTION:
      return '작업을 완료할 수 없습니다. 다시 시도해 주세요.';
    case ErrorType.SYSTEM:
      return '시스템 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
    default:
      return '예상치 못한 오류가 발생했습니다. 문제가 지속되면 고객지원에 문의해 주세요.';
  }
}

// Error handler functions
export function handleError(error: Error | AppError, context?: Record<string, any>): void {
  let appError: AppError;

  if ('id' in error && 'type' in error) {
    // Already an AppError
    appError = error;
  } else {
    // Convert Error to AppError
    appError = createAppError(
      ErrorType.UNKNOWN,
      ErrorSeverity.MEDIUM,
      error.message || 'Unknown error occurred',
      error as Error,
      context
    );
  }

  // Log the error
  errorLogger.log(appError);

  // Handle based on severity
  handleErrorBySeverity(appError);
}

function handleErrorBySeverity(error: AppError): void {
  switch (error.severity) {
    case ErrorSeverity.LOW:
      // Log only, no user notification
      break;
    
    case ErrorSeverity.MEDIUM:
      // Show brief notification
      if (__DEV__) {
        Alert.alert('알림', error.userMessage || error.message, [{ text: '확인' }]);
      }
      break;
    
    case ErrorSeverity.HIGH:
      // Show detailed error with options
      Alert.alert(
        '오류 발생',
        error.userMessage || error.message,
        [
          { text: '확인', style: 'default' },
          ...(error.recoverable ? [{ text: '다시 시도', onPress: () => retryLastAction(error) }] : [])
        ]
      );
      break;
    
    case ErrorSeverity.CRITICAL:
      // Show critical error with recovery options
      Alert.alert(
        '심각한 오류',
        `심각한 오류가 발생했습니다.\n\n${error.userMessage || error.message}\n\n앱을 재시작하는 것을 권장합니다.`,
        [
          { text: '확인', style: 'default' },
          { text: '오류 신고', onPress: () => reportError(error) }
        ]
      );
      break;
  }
}

// Recovery functions
function retryLastAction(error: AppError): void {
  console.log('🔄 Retrying action for error:', error.id);
  // Implement retry logic based on error context
  // This would be customized based on the specific action that failed
}

function reportError(error: AppError): void {
  console.log('📤 Reporting error:', error.id);
  
  Alert.alert(
    '오류 신고됨',
    `오류가 신고되었습니다.\n\nError ID: ${error.id}\n\n개발팀에서 검토 후 수정하겠습니다.`,
    [{ text: '확인' }]
  );
}

// Async error handler for promises
export async function handleAsyncError<T>(
  promise: Promise<T>,
  context?: Record<string, any>
): Promise<T | null> {
  try {
    return await promise;
  } catch (error) {
    handleError(error as Error, context);
    return null;
  }
}

// Error boundary helper
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  errorBoundaryProps?: {
    fallback?: React.ReactNode;
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  }
): React.ComponentType<P> {
  return function WithErrorBoundaryComponent(props: P) {
    const { ErrorBoundary } = require('@/components/ErrorBoundary');
    
    return (
      <ErrorBoundary {...errorBoundaryProps}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

// Common error creators
export const createNetworkError = (message: string, originalError?: Error, context?: Record<string, any>) =>
  createAppError(ErrorType.NETWORK, ErrorSeverity.HIGH, message, originalError, context);

export const createDatabaseError = (message: string, originalError?: Error, context?: Record<string, any>) =>
  createAppError(ErrorType.DATABASE, ErrorSeverity.HIGH, message, originalError, context);

export const createValidationError = (message: string, context?: Record<string, any>) =>
  createAppError(ErrorType.VALIDATION, ErrorSeverity.MEDIUM, message, undefined, context);

export const createUserActionError = (message: string, originalError?: Error, context?: Record<string, any>) =>
  createAppError(ErrorType.USER_ACTION, ErrorSeverity.LOW, message, originalError, context);

// Error recovery utilities
export class ErrorRecovery {
  private static recoveryStrategies: Map<ErrorType, () => Promise<void>> = new Map();

  static registerRecoveryStrategy(type: ErrorType, strategy: () => Promise<void>): void {
    this.recoveryStrategies.set(type, strategy);
  }

  static async tryRecover(error: AppError): Promise<boolean> {
    const strategy = this.recoveryStrategies.get(error.type);
    
    if (strategy && error.recoverable) {
      try {
        await strategy();
        console.log(`✅ Recovery successful for error type: ${error.type}`);
        return true;
      } catch (recoveryError) {
        console.error(`❌ Recovery failed for error type: ${error.type}`, recoveryError);
        return false;
      }
    }
    
    return false;
  }
}

// Export commonly used functions
export { ErrorLogger };