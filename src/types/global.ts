/**
 * 전역 타입 선언
 * 앱 전체에서 사용되는 공통 타입 정의
 */

// ===== React Native 모듈 확장 =====
declare module '*.png' {
  const value: any;
  export = value;
}

declare module '*.jpg' {
  const value: any;
  export = value;
}

declare module '*.jpeg' {
  const value: any;
  export = value;
}

declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

// ===== 환경 변수 타입 =====
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      readonly EXPO_PUBLIC_API_URL: string;
      readonly EXPO_PUBLIC_APP_ENV: 'development' | 'staging' | 'production';
      readonly EXPO_PUBLIC_SENTRY_DSN?: string;
      readonly EXPO_PUBLIC_ANALYTICS_KEY?: string;
    }
  }
}

// ===== 기본 유틸리티 타입들 =====
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type NullableOptional<T> = T | null | undefined;

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// ===== ID 타입들 =====
export type UUID = string;
export type Timestamp = number;
export type ISODateString = string;

// ===== 공통 응답 타입 =====
export interface ApiResponse<T = any> {
  readonly success: boolean;
  readonly data?: T;
  readonly message?: string;
  readonly error?: string;
  readonly timestamp: Timestamp;
}

export interface PaginatedResponse<T> {
  readonly items: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly hasNext: boolean;
  readonly hasPrev: boolean;
}

// ===== 에러 타입 =====
export interface AppError {
  readonly code: string;
  readonly message: string;
  readonly details?: any;
  readonly timestamp: Timestamp;
}

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

// ===== 로딩 상태 =====
export type LoadingState = 'idle' | 'pending' | 'success' | 'error';

export interface AsyncState<T> {
  readonly data: T | null;
  readonly loading: LoadingState;
  readonly error: AppError | null;
  readonly lastUpdated: Timestamp | null;
}

// ===== 언어 타입 =====
export type SupportedLanguage = 'ko' | 'en';
export type LanguageDirection = 'ltr' | 'rtl';

// ===== 테마 타입 =====
export type ThemeMode = 'light' | 'dark' | 'system';
export type ColorScheme = 'light' | 'dark';

// ===== 플랫폼 타입 =====
export type Platform = 'ios' | 'android' | 'web';
export type DeviceType = 'phone' | 'tablet' | 'desktop';

// ===== 내비게이션 타입 기본 =====
export type ScreenName = string;
export type RouteParams = Record<string, any>;

// ===== 스토리지 키 타입 =====
export type StorageKey = 
  | 'user_settings'
  | 'tarot_readings' 
  | 'daily_cards'
  | 'app_state'
  | 'cache_data'
  | 'user_preferences';

// ===== 이벤트 타입 =====
export interface AppEvent<T = any> {
  readonly type: string;
  readonly payload?: T;
  readonly timestamp: Timestamp;
}

// ===== 성능 메트릭 =====
export interface PerformanceMetric {
  readonly name: string;
  readonly value: number;
  readonly unit: 'ms' | 'bytes' | 'count' | 'percentage';
  readonly timestamp: Timestamp;
}

// ===== 좌표 및 크기 =====
export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface Size {
  readonly width: number;
  readonly height: number;
}

export interface Rect extends Point, Size {}

// ===== 애니메이션 관련 =====
export type AnimationEasing = 
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'spring';

export interface AnimationConfig {
  readonly duration: number;
  readonly easing: AnimationEasing;
  readonly delay?: number;
  readonly loop?: boolean;
}

// ===== 접근성 =====
export type AccessibilityRole = 
  | 'button'
  | 'link'
  | 'text'
  | 'image'
  | 'heading'
  | 'list'
  | 'listitem';

export interface AccessibilityInfo {
  readonly label: string;
  readonly hint?: string;
  readonly role: AccessibilityRole;
  readonly state?: Record<string, boolean>;
}

// ===== 햅틱 피드백 =====
export type HapticFeedbackType = 
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error';

// ===== 알림 관련 =====
export type NotificationType = 
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export interface NotificationConfig {
  readonly title: string;
  readonly message: string;
  readonly type: NotificationType;
  readonly duration?: number;
  readonly action?: {
    readonly label: string;
    readonly onPress: () => void;
  };
}