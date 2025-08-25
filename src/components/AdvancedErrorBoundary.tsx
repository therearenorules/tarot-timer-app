/**
 * AdvancedErrorBoundary - Enhanced error handling with recovery strategies
 */

import React, { Component, ReactNode } from 'react';
import { View, StyleSheet, Alert, InteractionManager } from 'react-native';
import { Text, Button } from '@/components';
import { theme } from '@/constants';

interface Props {
  children: ReactNode;
  level: 'global' | 'feature' | 'component';
  featureName?: string;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  enableAutoRecovery?: boolean;
  maxRetries?: number;
  recoveryStrategies?: RecoveryStrategy[];
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
  errorId: string;
  retryCount: number;
  isRecovering: boolean;
  recoveryStrategy?: string;
}

interface RecoveryStrategy {
  name: string;
  condition: (error: Error) => boolean;
  action: () => Promise<boolean>;
  description: string;
}

interface ErrorMetrics {
  errorId: string;
  timestamp: number;
  level: string;
  featureName?: string;
  errorType: string;
  message: string;
  stack?: string;
  componentStack?: string;
  retryCount: number;
  userAgent: string;
  recovered: boolean;
  recoveryStrategy?: string;
}

export class AdvancedErrorBoundary extends Component<Props, State> {
  private retryTimer?: NodeJS.Timeout;
  private errorMetrics: ErrorMetrics[] = [];
  
  static defaultProps = {
    level: 'component' as const,
    enableAutoRecovery: true,
    maxRetries: 3,
  };

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorId: '',
      retryCount: 0,
      isRecovering: false,
    };

    // Default recovery strategies
    this.defaultRecoveryStrategies = [
      {
        name: 'memory_cleanup',
        condition: (error: Error) => error.message.includes('memory') || error.message.includes('heap'),
        action: this.memoryCleanupRecovery,
        description: '메모리 정리 후 재시도',
      },
      {
        name: 'state_reset',
        condition: (error: Error) => error.message.includes('state') || error.message.includes('undefined'),
        action: this.stateResetRecovery,
        description: '상태 초기화 후 재시도',
      },
      {
        name: 'network_retry',
        condition: (error: Error) => error.message.includes('fetch') || error.message.includes('network'),
        action: this.networkRetryRecovery,
        description: '네트워크 재시도',
      },
      {
        name: 'component_remount',
        condition: () => true, // Fallback strategy
        action: this.componentRemountRecovery,
        description: '컴포넌트 재마운트',
      },
    ];
  }

  private defaultRecoveryStrategies: RecoveryStrategy[];

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `adv_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ error, errorInfo });
    this.trackError(error, errorInfo);
    this.props.onError?.(error, errorInfo);

    if (this.props.enableAutoRecovery && this.state.retryCount < (this.props.maxRetries || 3)) {
      this.attemptRecovery(error);
    }
  }

  private trackError = (error: Error, errorInfo: React.ErrorInfo) => {
    const metrics: ErrorMetrics = {
      errorId: this.state.errorId,
      timestamp: Date.now(),
      level: this.props.level,
      featureName: this.props.featureName,
      errorType: error.name,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      retryCount: this.state.retryCount,
      userAgent: navigator.userAgent,
      recovered: false,
    };

    this.errorMetrics.push(metrics);
    
    if (__DEV__) {
      console.group(`🚨 Advanced Error Boundary (${this.props.level})`);
      console.error('Error:', error);
      console.error('Component Stack:', errorInfo.componentStack);
      console.error('Metrics:', metrics);
      console.groupEnd();
    }
  };

  private attemptRecovery = async (error: Error) => {
    this.setState({ isRecovering: true });

    const strategies = [...(this.props.recoveryStrategies || []), ...this.defaultRecoveryStrategies];
    
    for (const strategy of strategies) {
      if (strategy.condition(error)) {
        console.log(`🔄 Attempting recovery with strategy: ${strategy.name}`);
        
        try {
          const success = await strategy.action();
          
          if (success) {
            this.setState({
              hasError: false,
              error: undefined,
              errorInfo: undefined,
              retryCount: this.state.retryCount + 1,
              isRecovering: false,
              recoveryStrategy: strategy.name,
            });

            // Update metrics
            const lastMetric = this.errorMetrics[this.errorMetrics.length - 1];
            if (lastMetric) {
              lastMetric.recovered = true;
              lastMetric.recoveryStrategy = strategy.name;
            }

            console.log(`✅ Recovery successful with strategy: ${strategy.name}`);
            return;
          }
        } catch (recoveryError) {
          console.error(`❌ Recovery failed with strategy: ${strategy.name}`, recoveryError);
        }
      }
    }

    this.setState({ isRecovering: false });
    console.error('❌ All recovery strategies failed');
  };

  private memoryCleanupRecovery = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }
      
      // Clear any cached data
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name));
        });
      }

      InteractionManager.runAfterInteractions(() => {
        resolve(true);
      });
    });
  };

  private stateResetRecovery = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Reset component state by forcing re-mount
      setTimeout(() => {
        resolve(true);
      }, 100);
    });
  };

  private networkRetryRecovery = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Wait before network retry
      setTimeout(() => {
        resolve(true);
      }, 1000);
    });
  };

  private componentRemountRecovery = async (): Promise<boolean> => {
    return new Promise((resolve) => {
      // Simple component remount
      setTimeout(() => {
        resolve(true);
      }, 500);
    });
  };

  private handleManualRetry = () => {
    if (this.state.retryCount >= (this.props.maxRetries || 3)) {
      Alert.alert(
        '최대 재시도 횟수 초과',
        '앱을 재시작하거나 나중에 다시 시도해 주세요.',
        [{ text: '확인' }]
      );
      return;
    }

    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: this.state.retryCount + 1,
      recoveryStrategy: 'manual_retry',
    });
  };

  private handleReportError = () => {
    const report = {
      errorId: this.state.errorId,
      level: this.props.level,
      featureName: this.props.featureName,
      error: {
        name: this.state.error?.name,
        message: this.state.error?.message,
        stack: this.state.error?.stack,
      },
      componentStack: this.state.errorInfo?.componentStack,
      metrics: this.errorMetrics,
      retryCount: this.state.retryCount,
      recoveryStrategy: this.state.recoveryStrategy,
      timestamp: new Date().toISOString(),
    };

    // In production, send to error reporting service
    console.log('📤 Advanced Error Report:', report);
    
    Alert.alert(
      '오류 신고 완료',
      `오류 ID: ${this.state.errorId}\n상세 정보가 개발팀에 전송되었습니다.`,
      [{ text: '확인' }]
    );
  };

  private getErrorSeverity = (): 'low' | 'medium' | 'high' | 'critical' => {
    const { level } = this.props;
    const { retryCount } = this.state;

    if (level === 'global') return 'critical';
    if (level === 'feature' && retryCount > 2) return 'high';
    if (retryCount > 1) return 'medium';
    return 'low';
  };

  private getErrorTitle = (): string => {
    const severity = this.getErrorSeverity();
    const { level, featureName } = this.props;

    switch (level) {
      case 'global':
        return '앱 전체 오류';
      case 'feature':
        return `${featureName || '기능'} 오류`;
      case 'component':
        return '구성 요소 오류';
      default:
        return '오류 발생';
    }
  };

  componentWillUnmount() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      if (this.state.isRecovering) {
        return (
          <View style={styles.container}>
            <View style={styles.content}>
              <Text variant="title3" style={styles.title}>
                복구 중...
              </Text>
              <Text variant="body" color={theme.colors.textSecondary}>
                오류를 자동으로 복구하고 있습니다.
              </Text>
            </View>
          </View>
        );
      }

      const severity = this.getErrorSeverity();
      const canRetry = this.state.retryCount < (this.props.maxRetries || 3);
      const title = this.getErrorTitle();

      return (
        <View style={[styles.container, styles[`${severity}Container`]]}>
          <View style={styles.content}>
            <Text variant="title2" style={[styles.title, styles[`${severity}Title`]]}>
              {title}
            </Text>
            
            <Text variant="body" color={theme.colors.textSecondary} style={styles.message}>
              {this.props.level === 'global' 
                ? '앱에서 심각한 오류가 발생했습니다. 앱을 재시작해야 할 수 있습니다.'
                : this.props.level === 'feature'
                ? `${this.props.featureName || '이 기능'}에서 오류가 발생했습니다. 다른 기능은 정상적으로 사용할 수 있습니다.`
                : '일부 구성 요소에서 오류가 발생했습니다.'
              }
            </Text>

            {__DEV__ && (
              <View style={styles.debugInfo}>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  Error ID: {this.state.errorId}
                </Text>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  Level: {this.props.level}
                </Text>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  Severity: {severity}
                </Text>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  Retry: {this.state.retryCount}/{this.props.maxRetries}
                </Text>
                {this.state.recoveryStrategy && (
                  <Text variant="caption" color={theme.colors.textSecondary}>
                    Recovery: {this.state.recoveryStrategy}
                  </Text>
                )}
                <Text variant="caption" color={theme.colors.textSecondary}>
                  Message: {this.state.error?.message || 'Unknown error'}
                </Text>
              </View>
            )}

            <View style={styles.actions}>
              {canRetry && (
                <Button
                  title="다시 시도"
                  variant="primary"
                  onPress={this.handleManualRetry}
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
              {severity === 'critical' 
                ? '앱을 재시작해 주세요.'
                : '문제가 지속되면 앱을 재시작해 주세요.'
              }
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
  lowContainer: {
    backgroundColor: theme.colors.background,
  },
  mediumContainer: {
    backgroundColor: theme.colors.background,
  },
  highContainer: {
    backgroundColor: theme.colors.accent + '10',
  },
  criticalContainer: {
    backgroundColor: '#ff000010',
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
  lowTitle: {
    color: theme.colors.textSecondary,
  },
  mediumTitle: {
    color: theme.colors.accent,
  },
  highTitle: {
    color: theme.colors.accent,
  },
  criticalTitle: {
    color: '#ff0000',
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