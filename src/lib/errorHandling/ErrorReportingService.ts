/**
 * 보안 강화된 에러 리포팅 서비스
 * 에러 로깅, 분석, 리포팅을 담당하는 종합적인 서비스
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { SanitizedError } from './SecureErrorHandler';

interface ErrorReport {
  id: string;
  error: SanitizedError;
  deviceInfo: DeviceInfo;
  appInfo: AppInfo;
  userContext: UserContext;
  recovery?: RecoveryAttempt;
  reported: boolean;
  reportedAt?: number;
  localOnly: boolean; // 보안상 이유로 로컬에만 저장할 에러
}

interface DeviceInfo {
  platform: string;
  osVersion?: string;
  appVersion: string;
  deviceModel?: string;
  screenSize: { width: number; height: number };
  locale: string;
  timezone: string;
  networkType?: string;
  batteryLevel?: number;
  memoryUsage?: number;
  storageSpace?: number;
}

interface AppInfo {
  version: string;
  buildNumber?: string;
  environment: 'development' | 'staging' | 'production';
  features: string[];
  lastUpdateTime?: number;
  installTime?: number;
  launchCount?: number;
}

interface UserContext {
  sessionId: string;
  hashedUserId?: string;
  userTier: 'free' | 'premium';
  sessionDuration: number;
  screenPath: string;
  previousScreen?: string;
  userAction?: string;
  customDimensions: Record<string, string>;
}

interface RecoveryAttempt {
  attempted: boolean;
  successful: boolean;
  strategy: 'manual_retry' | 'auto_retry' | 'context_reset' | 'app_restart';
  retryCount: number;
  timestamp: number;
}

interface ErrorAnalytics {
  totalErrors: number;
  errorsByType: Record<string, number>;
  errorsBySeverity: Record<string, number>;
  errorsByCategory: Record<string, number>;
  recoveryRate: number;
  topErrors: Array<{ error: SanitizedError; count: number; lastSeen: number }>;
  errorTrends: Array<{ date: string; count: number }>;
  affectedUsers: number;
  criticalErrorsLast24h: number;
}

class ErrorReportingService {
  private static instance: ErrorReportingService;
  private reports: Map<string, ErrorReport> = new Map();
  private maxLocalReports = 100;
  private reportingEnabled = true;
  private analyticsBuffer: ErrorReport[] = [];
  private readonly STORAGE_KEY = '@tarot_timer_error_reports';
  private readonly ANALYTICS_KEY = '@tarot_timer_error_analytics';

  private constructor() {
    this.loadReportsFromStorage();
    this.setupPeriodicCleanup();
  }

  static getInstance(): ErrorReportingService {
    if (!ErrorReportingService.instance) {
      ErrorReportingService.instance = new ErrorReportingService();
    }
    return ErrorReportingService.instance;
  }

  /**
   * 에러 리포트 생성 및 저장
   */
  async reportError(
    error: SanitizedError,
    deviceInfo: DeviceInfo,
    appInfo: AppInfo,
    userContext: UserContext
  ): Promise<string> {
    const reportId = this.generateReportId();
    
    // 보안 검사: 민감한 에러는 로컬에만 저장
    const localOnly = this.shouldKeepLocal(error);
    
    const report: ErrorReport = {
      id: reportId,
      error,
      deviceInfo: this.sanitizeDeviceInfo(deviceInfo),
      appInfo,
      userContext: this.sanitizeUserContext(userContext),
      reported: false,
      localOnly,
    };

    // 메모리와 스토리지에 저장
    this.reports.set(reportId, report);
    await this.saveReportsToStorage();

    // 분석 버퍼에 추가
    this.analyticsBuffer.push(report);

    // 즉시 리포팅이 필요한 경우 (Critical 에러)
    if (error.severity === 'critical' && !localOnly) {
      await this.sendReport(report);
    }

    // 개발 환경에서 로깅
    if (__DEV__) {
      this.logErrorReport(report);
    }

    return reportId;
  }

  /**
   * 복구 시도 업데이트
   */
  async updateRecovery(reportId: string, recovery: RecoveryAttempt): Promise<void> {
    const report = this.reports.get(reportId);
    if (report) {
      report.recovery = { ...recovery, timestamp: Date.now() };
      this.reports.set(reportId, report);
      await this.saveReportsToStorage();
    }
  }

  /**
   * 에러 분석 데이터 생성
   */
  generateAnalytics(): ErrorAnalytics {
    const reports = Array.from(this.reports.values());
    const totalErrors = reports.length;

    // 타입별 분류
    const errorsByType: Record<string, number> = {};
    const errorsBySeverity: Record<string, number> = {};
    const errorsByCategory: Record<string, number> = {};
    
    reports.forEach(report => {
      const { error } = report;
      errorsByType[error.type] = (errorsByType[error.type] || 0) + 1;
      errorsBySeverity[error.severity] = (errorsBySeverity[error.severity] || 0) + 1;
      errorsByCategory[error.category] = (errorsByCategory[error.category] || 0) + 1;
    });

    // 복구율 계산
    const recoveryAttempts = reports.filter(r => r.recovery?.attempted).length;
    const successfulRecoveries = reports.filter(r => r.recovery?.successful).length;
    const recoveryRate = recoveryAttempts > 0 ? (successfulRecoveries / recoveryAttempts) * 100 : 0;

    // 상위 에러들
    const errorGroups = new Map<string, { error: SanitizedError; count: number; lastSeen: number }>();
    reports.forEach(report => {
      const key = `${report.error.type}_${report.error.message}`;
      const existing = errorGroups.get(key);
      if (existing) {
        existing.count++;
        existing.lastSeen = Math.max(existing.lastSeen, report.error.timestamp);
      } else {
        errorGroups.set(key, {
          error: report.error,
          count: 1,
          lastSeen: report.error.timestamp,
        });
      }
    });

    const topErrors = Array.from(errorGroups.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // 시간별 트렌드 (최근 7일)
    const now = Date.now();
    const oneDayMs = 24 * 60 * 60 * 1000;
    const errorTrends = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(now - i * oneDayMs);
      const dateStr = date.toISOString().split('T')[0];
      const dayStart = date.setHours(0, 0, 0, 0);
      const dayEnd = dayStart + oneDayMs;
      
      const count = reports.filter(r => 
        r.error.timestamp >= dayStart && r.error.timestamp < dayEnd
      ).length;

      return { date: dateStr, count };
    }).reverse();

    // 영향받은 사용자 수 (해시된 ID 기준)
    const uniqueUsers = new Set(
      reports
        .map(r => r.userContext.hashedUserId)
        .filter(Boolean)
    ).size;

    // 최근 24시간 내 Critical 에러
    const last24h = now - oneDayMs;
    const criticalErrorsLast24h = reports.filter(r => 
      r.error.severity === 'critical' && r.error.timestamp >= last24h
    ).length;

    return {
      totalErrors,
      errorsByType,
      errorsBySeverity,
      errorsByCategory,
      recoveryRate,
      topErrors,
      errorTrends,
      affectedUsers: uniqueUsers,
      criticalErrorsLast24h,
    };
  }

  /**
   * 에러 리포트 전송 (실제 환경에서는 서버로 전송)
   */
  private async sendReport(report: ErrorReport): Promise<boolean> {
    if (!this.reportingEnabled || report.localOnly) {
      return false;
    }

    try {
      // 실제 환경에서는 API 엔드포인트로 전송
      console.log('📤 에러 리포트 전송:', {
        id: report.id,
        type: report.error.type,
        severity: report.error.severity,
        timestamp: report.error.timestamp,
      });

      // 전송 성공 시 플래그 업데이트
      report.reported = true;
      report.reportedAt = Date.now();
      
      await this.saveReportsToStorage();
      return true;
      
    } catch (error) {
      console.error('에러 리포트 전송 실패:', error);
      return false;
    }
  }

  /**
   * 민감한 에러인지 판단
   */
  private shouldKeepLocal(error: SanitizedError): boolean {
    // 보안 관련 에러는 로컬에만 저장
    if (error.type === 'security') {
      return true;
    }

    // 사용자 정보가 포함될 수 있는 에러
    const sensitiveCategories = ['authentication', 'user_data', 'payment'];
    if (sensitiveCategories.includes(error.category)) {
      return true;
    }

    return false;
  }

  /**
   * 디바이스 정보 정제
   */
  private sanitizeDeviceInfo(deviceInfo: DeviceInfo): DeviceInfo {
    return {
      ...deviceInfo,
      deviceModel: deviceInfo.deviceModel ? 
        deviceInfo.deviceModel.replace(/[0-9]+/g, 'XXX') : undefined,
    };
  }

  /**
   * 사용자 컨텍스트 정제
   */
  private sanitizeUserContext(userContext: UserContext): UserContext {
    const sanitized = { ...userContext };
    
    // 사용자 정의 속성에서 민감한 정보 제거
    const sanitizedCustomDimensions: Record<string, string> = {};
    for (const [key, value] of Object.entries(userContext.customDimensions)) {
      const lowerKey = key.toLowerCase();
      if (!['email', 'phone', 'name', 'address'].some(sensitive => lowerKey.includes(sensitive))) {
        sanitizedCustomDimensions[key] = value;
      }
    }
    
    sanitized.customDimensions = sanitizedCustomDimensions;
    return sanitized;
  }

  /**
   * 스토리지에서 리포트 로드
   */
  private async loadReportsFromStorage(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const reports: ErrorReport[] = JSON.parse(stored);
        reports.forEach(report => {
          this.reports.set(report.id, report);
        });
        console.log(`✅ ${reports.length}개의 에러 리포트를 로드했습니다.`);
      }
    } catch (error) {
      console.error('에러 리포트 로드 실패:', error);
    }
  }

  /**
   * 스토리지에 리포트 저장
   */
  private async saveReportsToStorage(): Promise<void> {
    try {
      const reports = Array.from(this.reports.values());
      
      // 오래된 리포트 정리 (30일 이상)
      const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
      const filteredReports = reports.filter(report => 
        report.error.timestamp > thirtyDaysAgo
      );

      // 최대 개수 제한
      const limitedReports = filteredReports
        .sort((a, b) => b.error.timestamp - a.error.timestamp)
        .slice(0, this.maxLocalReports);

      await AsyncStorage.setItem(this.STORAGE_KEY, JSON.stringify(limitedReports));
      
      // 메모리에서도 정리
      this.reports.clear();
      limitedReports.forEach(report => {
        this.reports.set(report.id, report);
      });

    } catch (error) {
      console.error('에러 리포트 저장 실패:', error);
    }
  }

  /**
   * 분석 데이터 저장
   */
  async saveAnalytics(): Promise<void> {
    try {
      const analytics = this.generateAnalytics();
      await AsyncStorage.setItem(this.ANALYTICS_KEY, JSON.stringify({
        ...analytics,
        generatedAt: Date.now(),
      }));
    } catch (error) {
      console.error('분석 데이터 저장 실패:', error);
    }
  }

  /**
   * 주기적 정리 설정
   */
  private setupPeriodicCleanup(): void {
    // 1시간마다 정리
    setInterval(() => {
      this.saveReportsToStorage();
      this.saveAnalytics();
    }, 60 * 60 * 1000);

    // 일일 배치 리포팅 (오프라인에서 온라인으로 복구 시)
    setInterval(async () => {
      await this.sendPendingReports();
    }, 24 * 60 * 60 * 1000);
  }

  /**
   * 대기 중인 리포트 전송
   */
  private async sendPendingReports(): Promise<void> {
    const pendingReports = Array.from(this.reports.values())
      .filter(report => !report.reported && !report.localOnly && report.error.reportable);

    for (const report of pendingReports.slice(0, 10)) { // 한 번에 최대 10개
      await this.sendReport(report);
      
      // API 부하 방지를 위한 지연
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  /**
   * 에러 리포트 로깅 (개발 환경)
   */
  private logErrorReport(report: ErrorReport): void {
    console.group(`🐛 에러 리포트 생성 [${report.id}]`);
    console.log('에러:', {
      type: report.error.type,
      severity: report.error.severity,
      category: report.error.category,
      message: report.error.message,
    });
    console.log('사용자 컨텍스트:', {
      screenPath: report.userContext.screenPath,
      userTier: report.userContext.userTier,
      sessionDuration: report.userContext.sessionDuration,
    });
    console.log('디바이스 정보:', {
      platform: report.deviceInfo.platform,
      appVersion: report.deviceInfo.appVersion,
      locale: report.deviceInfo.locale,
    });
    console.log('로컬 전용:', report.localOnly);
    console.log('리포트 가능:', report.error.reportable);
    console.groupEnd();
  }

  /**
   * 리포트 ID 생성
   */
  private generateReportId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 15);
    return `rpt_${timestamp}_${random}`;
  }

  /**
   * 에러 리포팅 설정
   */
  setReportingEnabled(enabled: boolean): void {
    this.reportingEnabled = enabled;
  }

  /**
   * 모든 리포트 조회 (관리용)
   */
  getAllReports(): ErrorReport[] {
    return Array.from(this.reports.values());
  }

  /**
   * 특정 리포트 조회
   */
  getReport(id: string): ErrorReport | undefined {
    return this.reports.get(id);
  }

  /**
   * 리포트 삭제
   */
  async deleteReport(id: string): Promise<void> {
    this.reports.delete(id);
    await this.saveReportsToStorage();
  }

  /**
   * 모든 로컬 데이터 정리
   */
  async clearAllData(): Promise<void> {
    this.reports.clear();
    this.analyticsBuffer = [];
    await AsyncStorage.removeItem(this.STORAGE_KEY);
    await AsyncStorage.removeItem(this.ANALYTICS_KEY);
  }
}

export default ErrorReportingService;