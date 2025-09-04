/**
 * 사용자 서비스 인터페이스
 * 사용자 관리, 프로필, 프리미엄 멤버십 등을 담당
 */

import {
  User,
  UserProfile,
  PremiumStatus,
  UserStatistics,
  ApiResponse,
  SupportedLanguage,
} from '../../types';

// ===== 요청 타입들 =====
export interface UpdateProfileRequest {
  readonly displayName?: string;
  readonly avatarUrl?: string;
  readonly timezone?: string;
  readonly language?: SupportedLanguage;
  readonly dateOfBirth?: string;
  readonly interests?: readonly string[];
}

export interface CreateUserRequest {
  readonly email: string;
  readonly password: string;
  readonly profile: {
    readonly displayName: string;
    readonly language: SupportedLanguage;
    readonly timezone: string;
  };
}

export interface UpdatePasswordRequest {
  readonly currentPassword: string;
  readonly newPassword: string;
}

export interface SubscribeToPremiumRequest {
  readonly planId: string;
  readonly paymentMethodId: string;
  readonly billingCycle: 'monthly' | 'yearly';
}

export interface UserPreferencesRequest {
  readonly theme?: 'light' | 'dark' | 'system';
  readonly notifications?: {
    readonly dailyReminder?: boolean;
    readonly spreadCompletion?: boolean;
    readonly weeklyInsights?: boolean;
    readonly promotions?: boolean;
  };
  readonly privacy?: {
    readonly shareStatistics?: boolean;
    readonly allowAnalytics?: boolean;
  };
}

// ===== 응답 타입들 =====
export interface AuthResponse {
  readonly user: User;
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
}

export interface SubscriptionResult {
  readonly success: boolean;
  readonly subscriptionId: string;
  readonly status: 'active' | 'pending' | 'failed';
  readonly nextBillingDate?: string;
  readonly amount: number;
  readonly currency: string;
}

export interface UserDataExport {
  readonly user: User;
  readonly readings: {
    readonly dailyReadings: any[];
    readonly spreadReadings: any[];
  };
  readonly journal: {
    readonly entries: any[];
  };
  readonly exportDate: string;
  readonly format: 'json' | 'csv';
}

export interface ImportResult {
  readonly success: boolean;
  readonly importedItems: {
    readonly dailyReadings: number;
    readonly spreadReadings: number;
    readonly journalEntries: number;
  };
  readonly errors: readonly string[];
  readonly warnings: readonly string[];
}

// ===== 메인 서비스 인터페이스 =====
export interface UserService {
  // ===== 인증 관리 =====
  
  /**
   * 이메일/비밀번호로 로그인
   * @param email 이메일 주소
   * @param password 비밀번호
   */
  login(
    email: string,
    password: string
  ): Promise<ApiResponse<AuthResponse>>;
  
  /**
   * 새 사용자 계정 생성
   * @param request 사용자 생성 요청
   */
  register(
    request: CreateUserRequest
  ): Promise<ApiResponse<AuthResponse>>;
  
  /**
   * 로그아웃
   */
  logout(): Promise<ApiResponse<void>>;
  
  /**
   * 액세스 토큰 갱신
   * @param refreshToken 리프레시 토큰
   */
  refreshToken(
    refreshToken: string
  ): Promise<ApiResponse<AuthResponse>>;
  
  /**
   * 비밀번호 재설정 요청
   * @param email 이메일 주소
   */
  requestPasswordReset(
    email: string
  ): Promise<ApiResponse<void>>;
  
  /**
   * 비밀번호 재설정 확인
   * @param token 재설정 토큰
   * @param newPassword 새 비밀번호
   */
  confirmPasswordReset(
    token: string,
    newPassword: string
  ): Promise<ApiResponse<void>>;

  // ===== 사용자 프로필 =====
  
  /**
   * 현재 사용자 정보 조회
   */
  getCurrentUser(): Promise<ApiResponse<User | null>>;
  
  /**
   * 사용자 프로필 업데이트
   * @param request 프로필 업데이트 요청
   */
  updateProfile(
    request: UpdateProfileRequest
  ): Promise<ApiResponse<UserProfile>>;
  
  /**
   * 비밀번호 변경
   * @param request 비밀번호 변경 요청
   */
  updatePassword(
    request: UpdatePasswordRequest
  ): Promise<ApiResponse<void>>;
  
  /**
   * 계정 삭제
   * @param password 확인용 비밀번호
   */
  deleteAccount(
    password: string
  ): Promise<ApiResponse<void>>;
  
  /**
   * 이메일 인증 요청
   */
  requestEmailVerification(): Promise<ApiResponse<void>>;
  
  /**
   * 이메일 인증 확인
   * @param token 인증 토큰
   */
  verifyEmail(
    token: string
  ): Promise<ApiResponse<void>>;

  // ===== 프리미엄 멤버십 =====
  
  /**
   * 현재 프리미엄 상태 조회
   */
  getPremiumStatus(): Promise<ApiResponse<PremiumStatus>>;
  
  /**
   * 프리미엄 멤버십 구독
   * @param request 구독 요청
   */
  subscribeToPremium(
    request: SubscribeToPremiumRequest
  ): Promise<ApiResponse<SubscriptionResult>>;
  
  /**
   * 프리미엄 멤버십 취소
   */
  cancelPremium(): Promise<ApiResponse<void>>;
  
  /**
   * 결제 내역 조회
   * @param page 페이지 번호
   * @param limit 페이지당 항목 수
   */
  getPaymentHistory(
    page?: number,
    limit?: number
  ): Promise<ApiResponse<{
    readonly payments: readonly {
      readonly id: string;
      readonly amount: number;
      readonly currency: string;
      readonly status: string;
      readonly createdAt: Date;
      readonly description: string;
    }[];
    readonly totalCount: number;
  }>>;
  
  /**
   * 사용 가능한 프리미엄 플랜 조회
   */
  getPremiumPlans(): Promise<ApiResponse<{
    readonly plans: readonly {
      readonly id: string;
      readonly name: string;
      readonly nameKr: string;
      readonly description: string;
      readonly descriptionKr: string;
      readonly price: {
        readonly monthly: number;
        readonly yearly: number;
      };
      readonly currency: string;
      readonly features: readonly string[];
      readonly featuresKr: readonly string[];
    }[];
  }>>;

  // ===== 사용자 통계 =====
  
  /**
   * 사용자 활동 통계 조회
   */
  getUserStatistics(): Promise<ApiResponse<UserStatistics>>;
  
  /**
   * 연속 리딩 기록 업데이트
   */
  updateReadingStreak(): Promise<ApiResponse<number>>;
  
  /**
   * 사용자 활동 기록 조회
   * @param days 조회할 일수 (기본: 30일)
   */
  getActivityHistory(
    days?: number
  ): Promise<ApiResponse<{
    readonly activities: readonly {
      readonly date: string;
      readonly dailyReading: boolean;
      readonly spreadsCompleted: number;
      readonly journalEntries: number;
      readonly timeSpent: number; // 분 단위
    }[];
    readonly summary: {
      readonly totalDays: number;
      readonly activeDays: number;
      readonly averageTimeSpent: number;
      readonly mostActiveDay: string;
    };
  }>>;

  // ===== 사용자 설정 =====
  
  /**
   * 사용자 환경 설정 조회
   */
  getUserPreferences(): Promise<ApiResponse<UserPreferencesRequest>>;
  
  /**
   * 사용자 환경 설정 업데이트
   * @param request 설정 업데이트 요청
   */
  updateUserPreferences(
    request: UserPreferencesRequest
  ): Promise<ApiResponse<UserPreferencesRequest>>;

  // ===== 데이터 관리 =====
  
  /**
   * 사용자 데이터 전체 내보내기
   * @param format 내보낼 형식
   */
  exportUserData(
    format?: 'json' | 'csv'
  ): Promise<ApiResponse<UserDataExport>>;
  
  /**
   * 사용자 데이터 가져오기
   * @param data 가져올 데이터
   */
  importUserData(
    data: any
  ): Promise<ApiResponse<ImportResult>>;
  
  /**
   * 사용자 데이터 전체 삭제 (계정 유지)
   */
  clearAllUserData(): Promise<ApiResponse<void>>;

  // ===== 소셜 기능 (향후 확장) =====
  
  /**
   * 친구 목록 조회
   */
  getFriends(): Promise<ApiResponse<User[]>>;
  
  /**
   * 친구 요청 보내기
   * @param userId 사용자 ID
   */
  sendFriendRequest(
    userId: string
  ): Promise<ApiResponse<void>>;
  
  /**
   * 리딩 결과 공유하기
   * @param readingId 리딩 ID
   * @param platform 공유 플랫폼
   */
  shareReading(
    readingId: string,
    platform: 'twitter' | 'facebook' | 'instagram' | 'link'
  ): Promise<ApiResponse<{
    readonly shareUrl: string;
    readonly previewImage?: string;
  }>>;
}

// ===== 편의를 위한 타입 재export =====
export type {
  User,
  UserProfile,
  PremiumStatus,
  UserStatistics,
} from '../../types';