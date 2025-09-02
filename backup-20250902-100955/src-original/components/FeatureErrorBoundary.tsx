/**
 * FeatureErrorBoundary - Feature-specific error handling
 */

import React, { Component, ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from '@/components';
import { theme } from '@/constants';

interface Props {
  children: ReactNode;
  featureName: string;
  fallbackMessage?: string;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  showRetry?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId: string;
}

export class FeatureErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      errorId: '',
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `feature_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const errorData = {
      feature: this.props.featureName,
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      errorId: this.state.errorId,
      componentStack: errorInfo.componentStack,
    };

    console.error(`🚨 Feature Error (${this.props.featureName}):`, errorData);
    
    // Call custom error handler
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    console.log(`🔄 Retrying ${this.props.featureName} feature`);
    this.setState({
      hasError: false,
      error: undefined,
    });
  };

  render() {
    if (this.state.hasError) {
      const { featureName, fallbackMessage, showRetry = true } = this.props;
      
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <Text variant="title3" style={styles.title}>
              {featureName} 오류
            </Text>
            
            <Text variant="body" color={theme.colors.textSecondary} style={styles.message}>
              {fallbackMessage || `${featureName} 기능에서 오류가 발생했습니다. 다른 기능은 정상적으로 사용하실 수 있습니다.`}
            </Text>

            {__DEV__ && (
              <View style={styles.debugInfo}>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  Error ID: {this.state.errorId}
                </Text>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  Feature: {featureName}
                </Text>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  Message: {this.state.error?.message || 'Unknown error'}
                </Text>
              </View>
            )}

            {showRetry && (
              <Button
                title="다시 시도"
                variant="outline"
                onPress={this.handleRetry}
                style={styles.retryButton}
              />
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
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    margin: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.accent + '40',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    color: theme.colors.accent,
  },
  message: {
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing.lg,
  },
  debugInfo: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.md,
    width: '100%',
  },
  retryButton: {
    paddingHorizontal: theme.spacing.xl,
  },
});