// src/components/providers/AppProvider.tsx - 타로 앱 전용 글로벌 프로바이더
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import * as Font from 'expo-font';
import { theme } from '@/constants';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { devLog, performanceUtils, tarotLog } from '@/lib/devMode';

interface AppProviderProps {
  children: React.ReactNode;
}

// 타로 앱에 필요한 폰트들 (실제 폰트 파일이 있을 때만 사용)
const customFonts = {
  // 예시: 신비로운 느낌의 폰트들 (현재는 비활성화)
  // 'Mystical-Regular': require('../../assets/fonts/mystical-regular.ttf'),
  // 'Mystical-Bold': require('../../assets/fonts/mystical-bold.ttf'),
};

export function AppProvider({ children }: AppProviderProps) {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    loadAppResources();
  }, []);

  const loadAppResources = async () => {
    try {
      if (__DEV__) {
        performanceUtils.startTimer('앱 리소스 로딩');
        devLog('🔮 앱 리소스 로딩 시작');
      }

      // 폰트 로딩 (현재는 기본 폰트만 사용)
      try {
        if (Platform.OS !== 'web' && Object.keys(customFonts).length > 0) {
          // 실제 커스텀 폰트가 있을 때만 로딩
          await Font.loadAsync(customFonts);
          if (__DEV__) {
            devLog('✨ 커스텀 폰트 로딩 완료');
          }
        }
        setFontsLoaded(true);
      } catch (fontError) {
        if (__DEV__) {
          devLog('⚠️ 커스텀 폰트 로딩 실패 (기본 폰트 사용):', fontError);
        }
        setFontsLoaded(true); // 기본 폰트로 계속 진행
      }

      // 추가 초기화 작업들
      await initializeAppServices();

      setAppReady(true);

      if (__DEV__) {
        performanceUtils.endTimer('앱 리소스 로딩');
        tarotLog.sessionStarted('app-provider-init');
      }

    } catch (error) {
      if (__DEV__) {
        console.error('❌ 앱 리소스 로딩 실패:', error);
      }
      // 에러가 있어도 앱은 계속 실행
      setFontsLoaded(true);
      setAppReady(true);
    }
  };

  const initializeAppServices = async () => {
    // 타로 관련 서비스 초기화
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (__DEV__) {
          devLog('🔮 타로 서비스 초기화 완료');
          tarotLog.mysticalEffect('초기화 완료', 100);
        }
        resolve();
      }, 100);
    });
  };

  // 앱이 준비되지 않았으면 로딩 화면 표시
  if (!fontsLoaded || !appReady) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner
          message="타로의 신비한 힘을 불러오는 중..."
          size="large"
          mystical={true}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});