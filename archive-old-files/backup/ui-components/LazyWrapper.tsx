// src/components/ui/LazyWrapper.tsx - Suspense와 에러 경계를 포함한 lazy 래퍼
import React, { Suspense } from 'react';
import { View, StyleSheet } from 'react-native';
import { LoadingSpinner } from './LoadingSpinner';
import { Text } from './Text';
import { theme } from '@/constants';

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<any>;
  loadingMessage?: string;
  errorMessage?: string;
  mystical?: boolean;
}

// 에러 경계 컴포넌트
class LazyErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
    fallback?: React.ComponentType<any>;
    errorMessage?: string;
    mystical?: boolean;
  },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('LazyWrapper Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} />;
      }

      return (
        <View style={[
          styles.errorContainer,
          this.props.mystical && styles.mysticalErrorContainer
        ]}>
          <Text 
            variant="h4" 
            color={this.props.mystical ? theme.colors.premiumGold : theme.colors.error}
            style={styles.errorTitle}
          >
            ⚠️ 컴포넌트 로딩 실패
          </Text>
          <Text 
            variant="body" 
            color={theme.colors.textSecondary}
            style={styles.errorMessage}
          >
            {this.props.errorMessage || '페이지를 새로고침하거나 잠시 후 다시 시도해보세요.'}
          </Text>
          {__DEV__ && this.state.error && (
            <Text variant="caption" color={theme.colors.textTertiary} style={styles.errorDetails}>
              {this.state.error.message}
            </Text>
          )}
        </View>
      );
    }

    return <>{this.props.children}</>;
  }
}

// 메인 LazyWrapper 컴포넌트
export function LazyWrapper({
  children,
  fallback,
  loadingMessage = '로딩 중...',
  errorMessage,
  mystical = true,
}: LazyWrapperProps) {
  const LoadingFallback = fallback || (() => (
    <View style={styles.loadingContainer}>
      <LoadingSpinner 
        message={loadingMessage}
        size="medium"
        mystical={mystical}
      />
    </View>
  ));

  return (
    <LazyErrorBoundary
      fallback={fallback}
      errorMessage={errorMessage}
      mystical={mystical}
    >
      <Suspense fallback={<LoadingFallback />}>
        {children}
      </Suspense>
    </LazyErrorBoundary>
  );
}

// 특정 용도별 래퍼들
export function TarotLazyWrapper({ children, loadingMessage }: { 
  children: React.ReactNode; 
  loadingMessage?: string; 
}) {
  return (
    <LazyWrapper
      loadingMessage={loadingMessage || '타로 카드를 준비하고 있어요...'}
      errorMessage="타로 카드를 불러올 수 없습니다."
      mystical={true}
    >
      {children}
    </LazyWrapper>
  );
}

export function SpreadLazyWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LazyWrapper
      loadingMessage="스프레드를 펼치고 있어요..."
      errorMessage="스프레드를 로딩할 수 없습니다."
      mystical={true}
    >
      {children}
    </LazyWrapper>
  );
}

export function ShopLazyWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LazyWrapper
      loadingMessage="상점을 준비하고 있어요..."
      errorMessage="상점을 로딩할 수 없습니다."
      mystical={true}
    >
      {children}
    </LazyWrapper>
  );
}

export function SettingsLazyWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LazyWrapper
      loadingMessage="설정을 불러오고 있어요..."
      errorMessage="설정을 로딩할 수 없습니다."
      mystical={false}
    >
      {children}
    </LazyWrapper>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  mysticalErrorContainer: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.mystical.border,
    borderRadius: theme.borderRadius.lg,
    margin: theme.spacing.md,
  },
  errorTitle: {
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    lineHeight: 24,
  },
  errorDetails: {
    textAlign: 'center',
    fontFamily: 'monospace',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginTop: theme.spacing.md,
  },
});