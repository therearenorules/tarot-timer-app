// src/lib/devMode.ts - 타로 타이머 앱 전용 개발 모드 설정
import { Platform } from 'react-native';

// 기본 개발 모드 플래그들
export const isDev = __DEV__;
export const isProd = !__DEV__;
export const isWeb = Platform.OS === 'web';
export const isNative = Platform.OS !== 'web';

// 성능 최적화 관련 설정
export const skipHeavyAnimations = isDev && Platform.OS === 'web'; // 웹에서만 애니메이션 스킵
export const enablePerformanceLogging = isDev;
export const enableBundleAnalysis = isDev;

// 타로 앱 특화 개발 설정들
export const tarotDevConfig = {
  // 카드 생성 및 로딩 관련
  fastCardGeneration: isDev, // 개발시 빠른 카드 생성
  skipCardAnimations: isDev && Platform.OS === 'web', // 웹에서 카드 애니메이션 스킵
  enableCardPreview: isDev, // 카드 미리보기 활성화
  
  // 타로 시스템 디버깅
  logTarotSessions: isDev, // 타로 세션 로깅
  showHourDebugInfo: isDev, // 시간별 디버그 정보 표시
  enableMockData: isDev, // 목업 데이터 사용
  
  // UI/UX 디버깅
  showLayoutBounds: false, // 레이아웃 경계 표시 (필요시 true로 변경)
  enableAccessibilityDebug: isDev, // 접근성 디버깅
  showMysticalEffectsBounds: false, // 신비로운 효과 경계 표시
  
  // 성능 모니터링
  trackComponentRenders: isDev, // 컴포넌트 렌더링 추적
  measureLazyLoadTimes: isDev, // lazy 로딩 시간 측정
  enableMemoryProfiling: isDev && Platform.OS !== 'web', // 메모리 프로파일링
  
  // 네트워크 및 스토리지
  enableOfflineMode: false, // 오프라인 모드 테스트
  clearStorageOnReload: false, // 리로드시 스토리지 클리어
  logStorageOperations: isDev, // 스토리지 작업 로깅
  
  // 알림 및 백그라운드 작업
  disableNotifications: isDev, // 개발시 알림 비활성화
  mockBackgroundTasks: isDev, // 백그라운드 작업 모킹
  
  // 한국어 로컬라이제이션 디버깅
  showTranslationKeys: false, // 번역 키 표시
  highlightMissingTranslations: isDev, // 누락된 번역 강조
};

// 환경별 설정 오버라이드
const environmentConfig = {
  development: {
    apiUrl: 'http://localhost:3000',
    enableHotReload: true,
    logLevel: 'debug',
    enableReduxDevTools: true,
  },
  production: {
    apiUrl: 'https://api.tarot-timer.app',
    enableHotReload: false,
    logLevel: 'error',
    enableReduxDevTools: false,
  },
};

export const config = environmentConfig[isDev ? 'development' : 'production'];

// 성능 측정 유틸리티
export const performanceUtils = {
  startTimer: (name: string) => {
    if (!enablePerformanceLogging) return;
    console.time(`🔮 ${name}`);
  },
  
  endTimer: (name: string) => {
    if (!enablePerformanceLogging) return;
    console.timeEnd(`🔮 ${name}`);
  },
  
  logRender: (componentName: string, props?: any) => {
    if (!tarotDevConfig.trackComponentRenders) return;
    console.log(`🎨 [RENDER] ${componentName}`, props ? `with props:` : '', props || '');
  },
  
  logLazyLoad: (componentName: string, loadTime: number) => {
    if (!tarotDevConfig.measureLazyLoadTimes) return;
    console.log(`⚡ [LAZY] ${componentName} loaded in ${loadTime}ms`);
  },
  
  logTarotEvent: (eventName: string, data?: any) => {
    if (!tarotDevConfig.logTarotSessions) return;
    console.log(`🔮 [TAROT] ${eventName}`, data || '');
  },
};

// 개발자 도구 헬퍼
export const devTools = {
  // 글로벌 디버그 객체를 window에 추가 (웹만)
  exposeDebugHelpers: () => {
    if (!isDev || !isWeb) return;
    
    (global as any).__TAROT_DEBUG__ = {
      config: tarotDevConfig,
      performance: performanceUtils,
      clearAllData: () => {
        if (tarotDevConfig.clearStorageOnReload) {
          // 모든 로컬 스토리지 데이터 클리어
          console.log('🗑️ Clearing all local data...');
          // AsyncStorage.clear() 호출 등
        }
      },
      toggleAnimations: () => {
        (tarotDevConfig as any).skipCardAnimations = !tarotDevConfig.skipCardAnimations;
        console.log('🎬 Card animations:', tarotDevConfig.skipCardAnimations ? 'OFF' : 'ON');
      },
      showLayoutBounds: (show: boolean) => {
        (tarotDevConfig as any).showLayoutBounds = show;
        console.log('📐 Layout bounds:', show ? 'ON' : 'OFF');
      },
    };
    
    console.log('🔮 Tarot Debug Tools exposed to window.__TAROT_DEBUG__');
  },
  
  // React DevTools 설정
  setupReactDevTools: () => {
    if (!isDev) return;
    
    // React DevTools가 있으면 컴포넌트에 displayName 추가
    if (typeof window !== 'undefined' && (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      console.log('⚛️ React DevTools detected');
    }
  },
};

// 개발 모드 초기화
export const initDevMode = () => {
  if (!isDev) return;
  
  console.log('🔮 타로 타이머 개발 모드 활성화');
  console.log('📱 플랫폼:', Platform.OS);
  console.log('⚙️ 설정:', tarotDevConfig);
  
  devTools.exposeDebugHelpers();
  devTools.setupReactDevTools();
  
  // 성능 측정 시작
  performanceUtils.startTimer('앱 초기화');
};

// 조건부 로깅 함수들
export const devLog = (...args: any[]) => {
  if (isDev) console.log('🔮', ...args);
};

export const devWarn = (...args: any[]) => {
  if (isDev) console.warn('⚠️', ...args);
};

export const devError = (...args: any[]) => {
  if (isDev) console.error('❌', ...args);
};

// 타로 관련 전용 로깅
export const tarotLog = {
  cardGenerated: (cardName: string, hour: number) => {
    if (tarotDevConfig.logTarotSessions) {
      console.log(`🃏 카드 생성: ${cardName} (${hour}시)`);
    }
  },
  
  sessionStarted: (sessionId: string) => {
    if (tarotDevConfig.logTarotSessions) {
      console.log(`🔮 세션 시작: ${sessionId}`);
    }
  },
  
  hourChanged: (oldHour: number, newHour: number) => {
    if (tarotDevConfig.showHourDebugInfo) {
      console.log(`⏰ 시간 변경: ${oldHour}시 → ${newHour}시`);
    }
  },
  
  mysticalEffect: (effectName: string, duration: number) => {
    if (tarotDevConfig.showMysticalEffectsBounds) {
      console.log(`✨ 신비 효과: ${effectName} (${duration}ms)`);
    }
  },
};

// 초기화 실행
if (isDev) {
  initDevMode();
}