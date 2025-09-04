/**
 * 서비스 인터페이스 통합 export
 * 모든 서비스 인터페이스와 관련 타입들의 중앙 집약점
 */

// ===== CORE INTERFACES =====
export type { TarotService } from './TarotService';
export type { UserService } from './UserService';
export type { JournalService } from './JournalService';
export type { SettingsService } from './SettingsService';

// ===== REQUEST TYPES =====
// Tarot Service Requests
export type {
  GenerateDailyCardsRequest,
  CreateSpreadReadingRequest,
  UpdateSpreadReadingRequest,
  SaveDailyMemoRequest,
  UpdateDailyInsightsRequest,
  SearchCardsRequest,
} from './TarotService';

// User Service Requests
export type {
  UpdateProfileRequest,
  CreateUserRequest,
  UpdatePasswordRequest,
  SubscribeToPremiumRequest,
  UserPreferencesRequest,
} from './UserService';

// Journal Service Requests
export type {
  CreateJournalEntryRequest,
  UpdateJournalEntryRequest,
  JournalQueryOptions,
  SavedSpreadQueryOptions,
} from './JournalService';

// Settings Service Requests
export type {
  UpdateSettingsRequest,
  NotificationSettingsRequest,
  ThemeSettings,
} from './SettingsService';

// ===== RESPONSE TYPES =====
// User Service Responses
export type {
  AuthResponse,
  SubscriptionResult,
  UserDataExport,
  ImportResult,
} from './UserService';

// Journal Service Responses
export type {
  JournalEntryWithReading,
  JournalAnalytics,
  TagSuggestion,
} from './JournalService';

// Settings Service Responses
export type {
  AppSettings,
  NotificationSettings,
  ExportSettings,
} from './SettingsService';

// ===== SERVICE FACTORY =====
/**
 * 서비스 팩토리 인터페이스
 * Mock/Real 구현체를 런타임에 결정하기 위한 추상화
 */
export interface ServiceFactory {
  getTarotService(): TarotService;
  getUserService(): UserService;
  getJournalService(): JournalService;
  getSettingsService(): SettingsService;
  
  // 서비스 등록 (의존성 주입)
  registerTarotService(service: TarotService): void;
  registerUserService(service: UserService): void;
  registerJournalService(service: JournalService): void;
  registerSettingsService(service: SettingsService): void;
}

// ===== SERVICE CONFIGURATION =====
/**
 * 서비스 설정
 */
export interface ServiceConfig {
  readonly mode: 'mock' | 'real' | 'hybrid';
  readonly apiBaseUrl?: string;
  readonly timeout?: number;
  readonly retryAttempts?: number;
  readonly cacheEnabled?: boolean;
  readonly offlineSupport?: boolean;
}

// ===== COMMON TYPES =====
/**
 * 서비스 초기화 결과
 */
export interface ServiceInitResult {
  readonly success: boolean;
  readonly initializedServices: string[];
  readonly failedServices: string[];
  readonly errors: string[];
}

/**
 * 서비스 건강 상태 체크
 */
export interface ServiceHealthCheck {
  readonly serviceName: string;
  readonly status: 'healthy' | 'degraded' | 'unhealthy';
  readonly responseTime: number;
  readonly lastChecked: Date;
  readonly details?: Record<string, any>;
}

/**
 * 배치 작업 결과
 */
export interface BatchOperationResult<T> {
  readonly successful: T[];
  readonly failed: Array<{
    readonly item: T;
    readonly error: string;
  }>;
  readonly totalProcessed: number;
  readonly successRate: number;
}

// ===== ERROR TYPES =====
/**
 * 서비스 에러 유형
 */
export type ServiceErrorType = 
  | 'network'
  | 'authentication'
  | 'authorization'
  | 'validation'
  | 'not_found'
  | 'rate_limit'
  | 'server_error'
  | 'unknown';

/**
 * 서비스 에러 인터페이스
 */
export interface ServiceError extends Error {
  readonly type: ServiceErrorType;
  readonly code: string;
  readonly statusCode?: number;
  readonly details?: Record<string, any>;
  readonly retryable: boolean;
  readonly timestamp: Date;
}

// ===== CACHE TYPES =====
/**
 * 캐시 설정
 */
export interface CacheConfig {
  readonly enabled: boolean;
  readonly ttl: number; // Time to live in milliseconds
  readonly maxSize: number;
  readonly strategy: 'lru' | 'lfu' | 'fifo';
}

/**
 * 캐시 키 생성기
 */
export interface CacheKeyGenerator {
  generateKey(service: string, method: string, params: any): string;
}

// ===== OFFLINE SUPPORT =====
/**
 * 오프라인 지원 설정
 */
export interface OfflineConfig {
  readonly enabled: boolean;
  readonly queueRequests: boolean;
  readonly maxQueueSize: number;
  readonly syncStrategy: 'immediate' | 'batch' | 'manual';
  readonly syncInterval: number; // 자동 동기화 간격 (밀리초)
}

/**
 * 오프라인 큐 항목
 */
export interface OfflineQueueItem {
  readonly id: string;
  readonly service: string;
  readonly method: string;
  readonly params: any;
  readonly timestamp: Date;
  readonly retryCount: number;
  readonly maxRetries: number;
}

// ===== ANALYTICS =====
/**
 * 서비스 사용 분석
 */
export interface ServiceAnalytics {
  readonly serviceName: string;
  readonly methodName: string;
  readonly callCount: number;
  readonly averageResponseTime: number;
  readonly errorRate: number;
  readonly lastCalled: Date;
  readonly mostCommonErrors: Array<{
    readonly error: string;
    readonly count: number;
  }>;
}

// ===== UTILITY FUNCTIONS =====
/**
 * 서비스 유틸리티 함수들
 */
export interface ServiceUtils {
  /**
   * 서비스 응답 검증
   */
  validateResponse<T>(response: any): response is T;
  
  /**
   * 에러 정규화
   */
  normalizeError(error: any): ServiceError;
  
  /**
   * 재시도 가능 여부 판단
   */
  isRetryable(error: ServiceError): boolean;
  
  /**
   * 캐시 키 생성
   */
  generateCacheKey(service: string, method: string, params: any): string;
  
  /**
   * 요청 로깅
   */
  logRequest(service: string, method: string, params: any, response: any): void;
}