import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform, View } from 'react-native';
import { theme } from '../constants';
import { DatabaseProvider } from '../lib/database/DatabaseProvider';
import { StoreProvider } from '../components/providers/StoreProvider';
import { ErrorBoundary } from '../components';
import { handleError, ErrorType, ErrorSeverity, createAppError } from '../lib/errorHandling';
// 개발 도구 및 성능 모니터링 임포트
import { DevWrapper, DevOnlyComponent } from '../examples/DevToolsUsage';
import { initDevMode, performanceUtils, devLog } from '../lib/devMode';
import { PerformanceMonitor } from '../components/dev/PerformanceMonitor';
// 앱 전용 프로바이더
import { AppProvider } from '../components/providers/AppProvider';
import { ContextProviders } from '../contexts';

export default function RootLayout() {
  // 앱 초기화 및 개발 모드 설정
  useEffect(() => {
    // 개발 모드 초기화
    if (__DEV__) {
      initDevMode();
      devLog('🔮 타로 타이머 앱 루트 레이아웃 초기화');
      
      // 앱 로딩 성능 측정 시작
      performanceUtils.startTimer('앱 전체 로딩');
      
      // Platform별 최적화 설정
      if (Platform.OS === 'web') {
        devLog('🌐 웹 플랫폼 최적화 활성화');
      } else {
        devLog('📱 네이티브 플랫폼 최적화 활성화');
      }
    }
    
    // 앱이 완전히 로드된 후 성능 측정 완료
    const timer = setTimeout(() => {
      if (__DEV__) {
        performanceUtils.endTimer('앱 전체 로딩');
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleGlobalError = (error: Error, errorInfo: React.ErrorInfo) => {
    // 개발 모드에서 성능 로깅
    if (__DEV__) {
      performanceUtils.logRender('RootLayout', { error: error.message, stack: error.stack });
    }
    
    // Create and handle the global error
    const appError = createAppError(
      ErrorType.SYSTEM,
      ErrorSeverity.CRITICAL,
      'Global application error occurred',
      error,
      {
        componentStack: errorInfo.componentStack,
        location: 'RootLayout',
        platform: Platform.OS,
        timestamp: new Date().toISOString(),
      }
    );
    
    handleError(appError);
  };

  // 개발 환경에서는 DevWrapper로 감싸서 개발 도구 포함
  if (__DEV__) {
    return (
      <PerformanceMonitor 
        componentName="RootLayout" 
        trackMemory={Platform.OS === 'web'}
        logToConsole={false} // 루트에서는 너무 많은 로그 방지
      >
        <ErrorBoundary onError={handleGlobalError}>
          <AppProvider>
            <DatabaseProvider enableSampleData={__DEV__}>
              <StoreProvider>
                <ContextProviders>
              <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
                <StatusBar 
                  style="dark" 
                  backgroundColor={theme.colors.background}
                  translucent={Platform.OS === 'android'}
                />
                
                <Stack 
                  screenOptions={{ 
                    headerShown: false,
                    // 신비로운 전환 애니메이션 설정
                    animation: Platform.OS === 'ios' ? 'slide_from_right' : 'fade',
                    animationDuration: 300,
                  }}
                >
                  <Stack.Screen 
                    name="(tabs)" 
                    options={{
                      title: '타로 타이머',
                    }}
                  />
                </Stack>
                
                {/* 개발 전용 컴포넌트들 */}
                <DevOnlyComponent>
                  <DevWrapper>
                    <></>
                  </DevWrapper>
                </DevOnlyComponent>
              </View>
                </ContextProviders>
              </StoreProvider>
            </DatabaseProvider>
          </AppProvider>
        </ErrorBoundary>
      </PerformanceMonitor>
    );
  }

  // 프로덕션 환경에서는 기본 레이아웃
  return (
    <ErrorBoundary onError={handleGlobalError}>
      <AppProvider>
        <DatabaseProvider enableSampleData={false}>
          <StoreProvider>
          <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <StatusBar 
              style="dark" 
              backgroundColor={theme.colors.background}
              translucent={Platform.OS === 'android'}
            />
            
            <Stack 
              screenOptions={{ 
                headerShown: false,
                // 부드러운 전환 애니메이션
                animation: Platform.OS === 'ios' ? 'slide_from_right' : 'fade',
                animationDuration: 300,
              }}
            >
              <Stack.Screen 
                name="(tabs)" 
                options={{
                  title: '타로 타이머',
                }}
              />
            </Stack>
          </View>
          </StoreProvider>
        </DatabaseProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}