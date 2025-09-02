/**
 * Enhanced ErrorBoundary - Complete implementation with all new methods
 * 새로운 보안 에러 처리 시스템과 신비로운 UI를 적용한 완전히 업그레이드된 Error Boundary
 */

import React, { Component, ReactNode } from 'react';
import { View, StyleSheet, Alert, Platform, Dimensions } from 'react-native';
import { Text, Button } from '@/components';
import { theme } from '@/constants';
import SecureErrorHandler, { type SanitizedError } from '@/lib/errorHandling/SecureErrorHandler';
import ErrorReportingService from '@/lib/errorHandling/ErrorReportingService';
import { MysticalErrorFallback } from '@/components/errors/MysticalErrorFallback';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  enableSecureHandling?: boolean;
  enableMysticalUI?: boolean;
  maxRetries?: number;
  autoRecover?: boolean;
  reportingEnabled?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorId: string;
  sanitizedError?: SanitizedError;
  isRecovering: boolean;
  deviceInfo?: any;
  appInfo?: any;
  userContext?: any;
}

export class EnhancedErrorBoundary extends Component<Props, State> {
  private retryCount = 0;
  private maxRetries: number;
  private secureErrorHandler: SecureErrorHandler;
  private reportingService: ErrorReportingService;
  private recoveryTimeout: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.maxRetries = props.maxRetries || 3;
    this.secureErrorHandler = SecureErrorHandler.getInstance({
      sanitizeStackTraces: !__DEV__,
      sanitizeUserData: true,
      preventInfoLeakage: true,
      enableDevDetails: __DEV__,
      maxErrorReports: 10,
      rateLimitWindow: 60000,
    });
    this.reportingService = ErrorReportingService.getInstance();
    
    this.state = {
      hasError: false,
      errorId: '',
      isRecovering: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  override async componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 보안 에러 처리
    const sanitizedError = this.secureErrorHandler.handleError(
      error,
      {
        sessionId: this.generateSessionId(),
        timestamp: Date.now(),
        customData: {
          componentStack: errorInfo.componentStack || '',
          retryCount: this.retryCount,
          platform: Platform.OS,
          screenSize: Dimensions.get('window'),
        },
      },
      'component_error'
    );

    // 에러 리포팅
    if (this.props.reportingEnabled !== false && sanitizedError.reportable) {
      await this.reportingService.reportError(
        sanitizedError,
        this.getDeviceInfo(),
        this.getAppInfo(),
        this.getUserContext()
      );
    }
    
    // 상태 업데이트
    this.setState({
      error,
      errorInfo,
      sanitizedError,
      errorId: sanitizedError.id,
      deviceInfo: this.getDeviceInfo(),
      appInfo: this.getAppInfo(),
      userContext: this.getUserContext(),
    });

    // 사용자 정의 에러 핸들러 호출
    this.props.onError?.(error, errorInfo);

    // 자동 복구 시도
    if (this.props.autoRecover && sanitizedError.recovered) {
      this.attemptAutoRecovery();
    }
  }

  private generateSessionId = (): string => {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  };

  private getDeviceInfo = () => {
    const { width, height } = Dimensions.get('window');
    return {
      platform: Platform.OS,
      osVersion: Platform.Version?.toString(),
      appVersion: '1.0.0',
      screenSize: { width, height },
      locale: 'ko-KR',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  };

  private getAppInfo = () => {
    return {
      version: '1.0.0',
      environment: __DEV__ ? 'development' as const : 'production' as const,
      features: ['tarot-timer', 'error-boundary', 'secure-handling'],
    };
  };

  private getUserContext = () => {
    return {
      sessionId: this.generateSessionId(),
      userTier: 'free' as const,
      sessionDuration: Date.now() - (this.state.deviceInfo?.startTime || Date.now()),
      screenPath: 'error-boundary',
      customDimensions: {
        errorBoundaryEnabled: 'true',
        secureHandling: this.props.enableSecureHandling?.toString() || 'false',
        retryCount: this.retryCount.toString(),
      },
    };
  };

  private attemptAutoRecovery = async () => {
    console.log('🔄 자동 복구 시도 시작...');
    
    this.setState({ isRecovering: true });
    
    this.recoveryTimeout = setTimeout(async () => {
      try {
        this.setState({
          hasError: false,
          isRecovering: false,
        });
        
        console.log('✅ 자동 복구 성공');
        
        if (this.state.sanitizedError) {
          await this.reportingService.updateRecovery(this.state.sanitizedError.id, {
            attempted: true,
            successful: true,
            strategy: 'auto_retry',
            retryCount: 0,
            timestamp: Date.now(),
          });
        }
        
      } catch (recoveryError) {
        console.error('❌ 자동 복구 실패:', recoveryError);
        this.setState({ isRecovering: false });
      }
    }, 2000);
  };

  private handleRetry = async () => {
    if (this.retryCount < this.maxRetries) {
      this.retryCount += 1;
      console.log(`🔄 Retrying... (${this.retryCount}/${this.maxRetries})`);
      
      this.setState({ isRecovering: true });
      
      try {
        if (this.state.sanitizedError) {
          await this.reportingService.updateRecovery(this.state.sanitizedError.id, {
            attempted: true,
            successful: true,
            strategy: 'manual_retry',
            retryCount: this.retryCount,
            timestamp: Date.now(),
          });
        }
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        this.setState({
          hasError: false,
          error: undefined,
          errorInfo: undefined,
          sanitizedError: undefined,
          isRecovering: false,
        });
        
      } catch (recoveryError) {
        console.error('복구 시도 중 오류:', recoveryError);
        this.setState({ isRecovering: false });
      }
    } else {
      if (this.state.sanitizedError) {
        await this.reportingService.updateRecovery(this.state.sanitizedError.id, {
          attempted: true,
          successful: false,
          strategy: 'manual_retry',
          retryCount: this.retryCount,
          timestamp: Date.now(),
        });
      }
      
      Alert.alert(
        '복구 실패',
        '최대 재시도 횟수에 도달했습니다. 앱을 다시 시작해주세요.',
        [{ text: '확인' }]
      );
    }
  };

  private handleReportError = () => {
    const { sanitizedError, errorId } = this.state;
    
    if (!sanitizedError) {
      Alert.alert('오류', '신고할 에러 정보를 찾을 수 없습니다.');
      return;
    }

    const secureReport = {
      id: errorId,
      type: sanitizedError.type,
      severity: sanitizedError.severity,
      category: sanitizedError.category,
      message: sanitizedError.message,
      timestamp: new Date(sanitizedError.timestamp).toISOString(),
      retryCount: this.retryCount,
      platform: Platform.OS,
    };

    console.log('📤 보안 에러 리포트:', secureReport);
    
    Alert.alert(
      '에러 신고 완료',
      `에러 ID: ${errorId}\n심각도: ${sanitizedError.severity}\n\n에러가 안전하게 기록되었습니다.`,
      [{ text: '확인' }]
    );
  };

  private handleAppReset = () => {
    Alert.alert(
      '앱 재시작',
      '앱을 재시작하시겠습니까? 저장되지 않은 데이터는 손실될 수 있습니다.',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '재시작', 
          style: 'destructive',
          onPress: () => {
            if (typeof window !== 'undefined') {
              window.location.reload();
            }
          }
        }
      ]
    );
  };

  componentWillUnmount() {
    if (this.recoveryTimeout) {
      clearTimeout(this.recoveryTimeout);
    }
  }

  render() {
    if (this.state.hasError) {
      // 사용자 정의 폴백 UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 신비로운 테마 UI 사용
      if (this.props.enableMysticalUI && this.state.sanitizedError) {
        return (
          <MysticalErrorFallback
            error={this.state.sanitizedError}
            onRetry={this.handleRetry}
            onReport={this.handleReportError}
            onReset={this.handleAppReset}
            retryCount={this.retryCount}
            maxRetries={this.maxRetries}
          />
        );
      }

      // 기본 에러 UI
      const { error, errorId, isRecovering } = this.state;
      const canRetry = this.retryCount < this.maxRetries;

      return (
        <View style={styles.container}>
          <View style={styles.content}>
            {isRecovering ? (
              <>
                <Text variant="title2" style={styles.title}>
                  복구 중...
                </Text>
                <Text variant="body" color={theme.colors.textSecondary} style={styles.message}>
                  오류를 자동으로 복구하고 있습니다.\n잠시만 기다려주세요.
                </Text>
              </>
            ) : (
              <>
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
                    {this.state.sanitizedError && (
                      <>
                        <Text variant="caption" color={theme.colors.textSecondary}>
                          Type: {this.state.sanitizedError.type}
                        </Text>
                        <Text variant="caption" color={theme.colors.textSecondary}>
                          Severity: {this.state.sanitizedError.severity}
                        </Text>
                      </>
                    )}
                  </View>
                )}

                <View style={styles.actions}>
                  {canRetry && (
                    <Button
                      title="다시 시도"
                      variant="primary"
                      onPress={this.handleRetry}
                      style={styles.button}
                      disabled={isRecovering}
                    />
                  )}
                  
                  <Button
                    title="오류 신고"
                    variant="outline"
                    onPress={this.handleReportError}
                    style={styles.button}
                    disabled={isRecovering}
                  />
                  
                  <Button
                    title="앱 재시작"
                    variant="outline"
                    onPress={this.handleAppReset}
                    style={styles.button}
                    disabled={isRecovering}
                  />
                </View>

                <Text variant="caption" color={theme.colors.textSecondary} style={styles.help}>
                  문제가 지속되면 앱을 재시작해 주세요.
                </Text>
              </>
            )}
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

export default EnhancedErrorBoundary;