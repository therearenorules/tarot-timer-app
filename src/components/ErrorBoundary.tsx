/**
 * ErrorBoundary - Global error handling for React components
 */

import React, { Component, ReactNode } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button } from '@/components';
import { theme } from '@/constants';
import monitoringService from '../utils/monitoring';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorId: string;
}

export class ErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Report error to monitoring service
    monitoringService.captureError(error, {
      errorInfo,
      severity: 'critical',
      context: {
        componentStack: errorInfo.componentStack || '',
        retryCount: this.retryCount,
        errorBoundary: true,
      },
    });
    
    // Log the error
    this.logError(error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
      errorId: this.state.errorId,
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  private logError = (error: Error, errorInfo?: React.ErrorInfo) => {
    const errorData = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      timestamp: new Date().toISOString(),
      errorId: this.state.errorId,
      componentStack: errorInfo?.componentStack,
      retryCount: this.retryCount,
    };

    // Log to console
    console.error('🚨 Error Boundary Caught Error:', errorData);

    // In production, you would send this to a logging service
    if (__DEV__) {
      console.group('Error Details');
      console.error('Error:', error);
      console.error('Component Stack:', errorInfo?.componentStack);
      console.groupEnd();
    }
  };

  private handleRetry = () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount += 1;
      console.log(`🔄 Retrying... (${this.retryCount}/${this.maxRetries})`);
      
      // Log retry attempt
      monitoringService.addBreadcrumb(`Error boundary retry attempt ${this.retryCount}`, 'info');
      
      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
      });
    } else {
      // Log failed recovery
      monitoringService.addBreadcrumb('Error boundary max retries reached', 'error');
      
      Alert.alert(
        'Error',
        'Maximum retry attempts reached. Please restart the app.',
        [{ text: 'OK' }]
      );
    }
  };

  private handleReportError = () => {
    const { error, errorInfo, errorId } = this.state;
    
    const errorReport = {
      id: errorId,
      message: error?.message || 'Unknown error',
      stack: error?.stack || 'No stack trace',
      timestamp: new Date().toISOString(),
      componentStack: errorInfo?.componentStack || 'No component stack',
      retryCount: this.retryCount,
    };

    // In a real app, you would send this to your error reporting service
    console.log('📤 Error Report:', errorReport);
    
    Alert.alert(
      'Error Reported',
      `Error ID: ${errorId}\nThe error has been logged for debugging.`,
      [{ text: 'OK' }]
    );
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { error, errorId } = this.state;
      const canRetry = this.retryCount < this.maxRetries;

      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text variant="title2" style={styles.title}>
              오류가 발생했습니다
            </Text>
            
            <Text variant="body" color={theme.colors.textSecondary} style={styles.message}>
              앱에서 예상치 못한 오류가 발생했습니다.{'\n'}
              잠시 후 다시 시도해 주세요.
            </Text>

            {__DEV__ && (
              <View style={styles.debugInfo}>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  Error ID: {errorId}
                </Text>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  Message: {error?.message || 'Unknown error'}
                </Text>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  Retry Count: {this.retryCount}/{this.maxRetries}
                </Text>
              </View>
            )}

            <View style={styles.actions}>
              {canRetry && (
                <Button
                  title="다시 시도"
                  variant="primary"
                  onPress={this.handleRetry}
                  style={styles.button}
                />
              )}
              
              <Button
                title="오류 신고"
                variant="outline"
                onPress={this.handleReportError}
                style={styles.button}
              />
            </View>

            <Text variant="caption" color={theme.colors.textSecondary} style={styles.help}>
              문제가 지속되면 앱을 재시작해 주세요.
            </Text>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
    width: '100%',
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    color: theme.colors.accent,
  },
  message: {
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: theme.spacing.xl,
  },
  debugInfo: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    width: '100%',
  },
  actions: {
    width: '100%',
    gap: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  button: {
    width: '100%',
  },
  help: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

// 새로 추가된 메서드들을 위한 확장
declare module 'react' {
  namespace Component {
    interface Component<P = {}, S = {}> {
      generateSessionId?(): string;
      getDeviceInfo?(): any;
      getAppInfo?(): any;
      getUserContext?(): any;
      attemptAutoRecovery?(): Promise<void>;
      handleAppReset?(): void;
    }
  }
}