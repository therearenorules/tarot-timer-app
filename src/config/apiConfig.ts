/**
 * API 설정 관리
 * Mock/Real API 전환을 위한 중앙 설정
 */

// ===== 환경 변수 타입 안전성 =====
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly EXPO_PUBLIC_API_MODE?: 'mock' | 'real' | 'hybrid';
      readonly EXPO_PUBLIC_API_URL?: string;
      readonly EXPO_PUBLIC_API_TIMEOUT?: string;
      readonly EXPO_PUBLIC_API_RETRIES?: string;
      readonly EXPO_PUBLIC_CACHE_TTL?: string;
      readonly EXPO_PUBLIC_ENABLE_LOGGING?: string;
      readonly EXPO_PUBLIC_OFFLINE_SUPPORT?: string;
    }
  }
}

// ===== 기본 설정 =====
const DEFAULT_CONFIG = {
  // API 모드 (개발: mock, 프로덕션: real)
  mode: 'mock' as const,
  
  // API 베이스 URL
  baseUrl: 'https://api.tarottimer.app',
  
  // 타임아웃 설정 (밀리초)
  timeout: 10000,
  
  // 재시도 횟수
  retries: 3,
  
  // 캐시 TTL (밀리초) - 5분
  cacheTTL: 5 * 60 * 1000,
  
  // 로깅 활성화
  enableLogging: __DEV__,
  
  // 오프라인 지원
  offlineSupport: true,
} as const;

// ===== 환경별 설정 =====
const ENVIRONMENT_CONFIG = {
  development: {
    mode: 'mock' as const,
    baseUrl: 'http://localhost:3001',
    enableLogging: true,
    timeout: 5000,
  },
  
  staging: {
    mode: 'real' as const,
    baseUrl: 'https://staging-api.tarrottimer.app',
    enableLogging: true,
    timeout: 8000,
  },
  
  production: {
    mode: 'real' as const,
    baseUrl: 'https://api.tarrottimer.app',
    enableLogging: false,
    timeout: 10000,
  },
} as const;

// ===== 현재 환경 감지 =====
function getCurrentEnvironment(): 'development' | 'staging' | 'production' {
  const env = process.env.EXPO_PUBLIC_APP_ENV;
  
  if (env === 'staging') return 'staging';
  if (env === 'production') return 'production';
  
  return 'development';
}

// ===== 설정 병합 =====
function mergeConfig() {
  const environment = getCurrentEnvironment();
  const envConfig = ENVIRONMENT_CONFIG[environment];
  
  return {
    // 기본 설정
    ...DEFAULT_CONFIG,
    
    // 환경별 설정
    ...envConfig,
    
    // 환경 변수 오버라이드
    mode: (process.env.EXPO_PUBLIC_API_MODE || envConfig.mode) as 'mock' | 'real' | 'hybrid',
    baseUrl: process.env.EXPO_PUBLIC_API_URL || envConfig.baseUrl,
    timeout: parseInt(process.env.EXPO_PUBLIC_API_TIMEOUT || '') || envConfig.timeout,
    retries: parseInt(process.env.EXPO_PUBLIC_API_RETRIES || '') || DEFAULT_CONFIG.retries,
    cacheTTL: parseInt(process.env.EXPO_PUBLIC_CACHE_TTL || '') || DEFAULT_CONFIG.cacheTTL,
    enableLogging: process.env.EXPO_PUBLIC_ENABLE_LOGGING === 'true' || envConfig.enableLogging,
    offlineSupport: process.env.EXPO_PUBLIC_OFFLINE_SUPPORT !== 'false',
    
    // 메타 정보
    environment,
    buildTime: new Date().toISOString(),
  };
}

// ===== 메인 API 설정 =====
export const API_CONFIG = mergeConfig();

// ===== 헬퍼 함수들 =====

/**
 * Mock 모드인지 확인
 */
export const isMockMode = (): boolean => {
  return API_CONFIG.mode === 'mock';
};

/**
 * Real API 모드인지 확인
 */
export const isRealMode = (): boolean => {
  return API_CONFIG.mode === 'real';
};

/**
 * Hybrid 모드인지 확인
 */
export const isHybridMode = (): boolean => {
  return API_CONFIG.mode === 'hybrid';
};

/**
 * 개발 환경인지 확인
 */
export const isDevelopment = (): boolean => {
  return API_CONFIG.environment === 'development';
};

/**
 * 프로덕션 환경인지 확인
 */
export const isProduction = (): boolean => {
  return API_CONFIG.environment === 'production';
};

/**
 * 로깅이 활성화되어 있는지 확인
 */
export const isLoggingEnabled = (): boolean => {
  return API_CONFIG.enableLogging;
};

// ===== 엔드포인트 설정 =====
export const ENDPOINTS = {
  // 타로 관련
  tarot: {
    dailyCards: '/tarot/daily-cards',
    spreads: '/tarot/spreads',
    cards: '/tarot/cards',
    readings: '/tarot/readings',
    statistics: '/tarot/statistics',
  },
  
  // 사용자 관련
  user: {
    profile: '/user/profile',
    auth: '/user/auth',
    premium: '/user/premium',
    statistics: '/user/statistics',
    preferences: '/user/preferences',
  },
  
  // 저널 관련
  journal: {
    entries: '/journal/entries',
    spreads: '/journal/spreads',
    search: '/journal/search',
    analytics: '/journal/analytics',
  },
  
  // 설정 관련
  settings: {
    app: '/settings/app',
    notifications: '/settings/notifications',
    export: '/settings/export',
    import: '/settings/import',
  },
  
  // 메타 정보
  meta: {
    health: '/health',
    version: '/version',
    status: '/status',
  },
} as const;

// ===== HTTP 헤더 설정 =====
export const HTTP_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'X-App-Version': '1.0.0',
  'X-Platform': 'react-native',
} as const;

// ===== 인증 관련 설정 =====
export const AUTH_CONFIG = {
  tokenKey: 'tarot_timer_access_token',
  refreshTokenKey: 'tarot_timer_refresh_token',
  tokenPrefix: 'Bearer',
  refreshThreshold: 5 * 60 * 1000, // 5분 전에 토큰 갱신
} as const;

// ===== 캐시 설정 =====
export const CACHE_CONFIG = {
  // 캐시 키 접두사
  keyPrefix: 'tt_cache_',
  
  // 기본 TTL (밀리초)
  defaultTTL: API_CONFIG.cacheTTL,
  
  // 서비스별 TTL 설정
  ttlByService: {
    tarot: {
      dailyCards: 24 * 60 * 60 * 1000, // 24시간
      spreads: 60 * 60 * 1000,         // 1시간
      cards: 7 * 24 * 60 * 60 * 1000,  // 7일
    },
    user: {
      profile: 30 * 60 * 1000,         // 30분
      statistics: 10 * 60 * 1000,      // 10분
    },
    journal: {
      entries: 5 * 60 * 1000,          // 5분
      analytics: 15 * 60 * 1000,       // 15분
    },
    settings: {
      app: 60 * 60 * 1000,             // 1시간
    },
  },
  
  // 최대 캐시 크기
  maxSize: 100,
  
  // 캐시 정리 간격 (밀리초)
  cleanupInterval: 30 * 60 * 1000, // 30분
} as const;

// ===== 재시도 설정 =====
export const RETRY_CONFIG = {
  // 최대 재시도 횟수
  maxRetries: API_CONFIG.retries,
  
  // 기본 지연 시간 (밀리초)
  baseDelay: 1000,
  
  // 최대 지연 시간 (밀리초)
  maxDelay: 10000,
  
  // 지연 시간 배수
  backoffMultiplier: 2,
  
  // 재시도 가능한 HTTP 상태 코드
  retryableStatusCodes: [408, 429, 500, 502, 503, 504],
  
  // 재시도 가능한 에러 코드
  retryableErrorCodes: [
    'NETWORK_ERROR',
    'TIMEOUT_ERROR',
    'SERVER_ERROR',
    'RATE_LIMIT_ERROR',
  ],
} as const;

// ===== 오프라인 지원 설정 =====
export const OFFLINE_CONFIG = {
  // 오프라인 지원 활성화
  enabled: API_CONFIG.offlineSupport,
  
  // 요청 큐잉 활성화
  queueRequests: true,
  
  // 최대 큐 크기
  maxQueueSize: 100,
  
  // 동기화 전략
  syncStrategy: 'batch' as 'immediate' | 'batch' | 'manual',
  
  // 자동 동기화 간격 (밀리초)
  syncInterval: 30000, // 30초
  
  // 큐잉 가능한 메서드
  queueableMethods: ['POST', 'PUT', 'PATCH', 'DELETE'],
  
  // 오프라인에서 사용 가능한 기능
  offlineCapabilities: {
    readTarotCards: true,
    viewJournal: true,
    createJournalEntry: true,
    viewSettings: true,
    updateSettings: true,
  },
} as const;

// ===== Mock 설정 =====
export const MOCK_CONFIG = {
  // 네트워크 지연 시뮬레이션
  simulateNetworkDelay: true,
  
  // 지연 시간 범위 (밀리초)
  delayRange: {
    min: 100,
    max: 500,
  },
  
  // 에러 시뮬레이션 확률 (0-1)
  errorRate: __DEV__ ? 0.05 : 0,
  
  // 시뮬레이션할 에러 타입
  errorTypes: [
    'NETWORK_ERROR',
    'TIMEOUT_ERROR',
    'SERVER_ERROR',
  ],
  
  // 데이터 영속화
  persistData: true,
  
  // 시드 기반 데이터 생성
  seedBasedGeneration: true,
  
  // 샘플 데이터 생성
  generateSampleData: __DEV__,
  
  // Mock 데이터 캐시 TTL
  mockCacheTTL: 60 * 60 * 1000, // 1시간
} as const;

// ===== 개발 도구 설정 =====
export const DEV_CONFIG = {
  // API 호출 로깅
  logApiCalls: __DEV__ && API_CONFIG.enableLogging,
  
  // 성능 모니터링
  enablePerformanceMonitoring: __DEV__,
  
  // 에러 리포팅
  enableErrorReporting: !__DEV__,
  
  // 디버그 정보 포함
  includeDebugInfo: __DEV__,
  
  // Mock/Real 전환 UI 표시
  showApiModeToggle: __DEV__,
} as const;

// ===== 설정 검증 =====
function validateConfig() {
  // 필수 환경 변수 검증
  if (isRealMode() && !API_CONFIG.baseUrl) {
    throw new Error('API_URL is required when using real API mode');
  }
  
  // 타임아웃 범위 검증
  if (API_CONFIG.timeout < 1000 || API_CONFIG.timeout > 60000) {
    console.warn('⚠️ API timeout should be between 1s and 60s');
  }
  
  // 재시도 횟수 검증
  if (API_CONFIG.retries < 0 || API_CONFIG.retries > 10) {
    console.warn('⚠️ Retry attempts should be between 0 and 10');
  }
}

// 앱 시작 시 설정 검증
validateConfig();

// ===== 설정 정보 로깅 (개발 환경) =====
if (__DEV__ && API_CONFIG.enableLogging) {
  console.log('🔮 API Configuration:', {
    mode: API_CONFIG.mode,
    environment: API_CONFIG.environment,
    baseUrl: API_CONFIG.baseUrl,
    timeout: API_CONFIG.timeout,
    retries: API_CONFIG.retries,
    cacheEnabled: true,
    offlineSupport: API_CONFIG.offlineSupport,
  });
}