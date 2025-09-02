/**
 * 보안 강화된 에러 처리 시스템
 * 민감한 정보 노출 방지와 사용자 안전을 위한 에러 처리
 */

interface SecurityConfig {
  sanitizeStackTraces: boolean;
  sanitizeUserData: boolean;
  preventInfoLeakage: boolean;
  enableDevDetails: boolean;
  maxErrorReports: number;
  rateLimitWindow: number; // milliseconds
}

interface ErrorContext {
  userId?: string;
  sessionId?: string;
  timestamp: number;
  userAgent?: string;
  url?: string;
  customData?: Record<string, any>;
}

export interface SanitizedError {
  id: string;
  type: 'runtime' | 'network' | 'validation' | 'security' | 'unknown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  message: string;
  sanitizedStack?: string;
  timestamp: number;
  context: Partial<ErrorContext>;
  recovered: boolean;
  reportable: boolean;
}

class SecureErrorHandler {
  private static instance: SecureErrorHandler;
  private config: SecurityConfig;
  private errorReports: Map<string, number> = new Map();
  private sensitivePatterns: RegExp[];
  private errorCounts: Map<string, { count: number; firstSeen: number }> = new Map();

  private constructor(config?: Partial<SecurityConfig>) {
    this.config = {
      sanitizeStackTraces: !__DEV__,
      sanitizeUserData: true,
      preventInfoLeakage: true,
      enableDevDetails: __DEV__,
      maxErrorReports: 10,
      rateLimitWindow: 60000, // 1분
      ...config,
    };

    this.sensitivePatterns = [
      /password/gi,
      /token/gi,
      /secret/gi,
      /api[_-]?key/gi,
      /auth/gi,
      /session/gi,
      /cookie/gi,
      /email/gi,
      /phone/gi,
      /credit[_-]?card/gi,
      /ssn/gi,
      /social[_-]?security/gi,
      /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, // 카드번호 패턴
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, // 이메일 패턴
      /\b\d{3}-\d{3}-\d{4}\b/g, // 전화번호 패턴
    ];
  }

  static getInstance(config?: Partial<SecurityConfig>): SecureErrorHandler {
    if (!SecureErrorHandler.instance) {
      SecureErrorHandler.instance = new SecureErrorHandler(config);
    }
    return SecureErrorHandler.instance;
  }

  /**
   * 에러를 안전하게 처리하고 정제합니다
   */
  handleError(
    error: Error,
    context: Partial<ErrorContext> = {},
    category: string = 'general'
  ): SanitizedError {
    const errorId = this.generateSecureErrorId();
    const timestamp = Date.now();

    // 에러 분류 및 심각도 판정
    const errorType = this.classifyError(error);
    const severity = this.assessSeverity(error, errorType);

    // 보안 검사
    if (this.isSecurityRelated(error)) {
      this.handleSecurityError(error, context, errorId);
    }

    // 컨텍스트 정제
    const sanitizedContext = this.sanitizeContext(context);

    // 스택 트레이스 정제
    const sanitizedStack = this.sanitizeStackTrace(error.stack || '');

    // 에러 메시지 정제
    const sanitizedMessage = this.sanitizeMessage(error.message);

    // 복구 가능성 판단
    const recovered = this.canRecover(error, errorType);

    // 리포트 가능성 판단
    const reportable = this.shouldReport(errorId, severity);

    const sanitizedError: SanitizedError = {
      id: errorId,
      type: errorType,
      severity,
      category,
      message: sanitizedMessage,
      sanitizedStack: this.config.sanitizeStackTraces ? sanitizedStack : error.stack,
      timestamp,
      context: sanitizedContext,
      recovered,
      reportable,
    };

    // 에러 카운팅 (DDoS 방지)
    this.trackErrorFrequency(errorId, errorType);

    // 개발 환경에서 상세 로그
    if (this.config.enableDevDetails) {
      this.logDetailedError(error, sanitizedError);
    }

    return sanitizedError;
  }

  /**
   * 에러 유형 분류
   */
  private classifyError(error: Error): SanitizedError['type'] {
    const message = error.message.toLowerCase();
    const stack = (error.stack || '').toLowerCase();

    if (message.includes('network') || message.includes('fetch') || message.includes('xhr')) {
      return 'network';
    }

    if (message.includes('validation') || message.includes('invalid')) {
      return 'validation';
    }

    if (message.includes('unauthorized') || message.includes('forbidden') || 
        message.includes('authentication') || message.includes('permission')) {
      return 'security';
    }

    if (stack.includes('react') || stack.includes('render')) {
      return 'runtime';
    }

    return 'unknown';
  }

  /**
   * 에러 심각도 평가
   */
  private assessSeverity(error: Error, type: SanitizedError['type']): SanitizedError['severity'] {
    const message = error.message.toLowerCase();

    // Critical: 보안 관련, 시스템 크래시
    if (type === 'security' || 
        message.includes('crash') || 
        message.includes('fatal') ||
        message.includes('security')) {
      return 'critical';
    }

    // High: 주요 기능 중단
    if (message.includes('cannot') || 
        message.includes('failed to') ||
        message.includes('timeout') ||
        type === 'network') {
      return 'high';
    }

    // Medium: 일반적인 런타임 에러
    if (type === 'runtime' || type === 'validation') {
      return 'medium';
    }

    // Low: 경미한 에러
    return 'low';
  }

  /**
   * 보안 관련 에러인지 확인
   */
  private isSecurityRelated(error: Error): boolean {
    const message = error.message.toLowerCase();
    const stack = (error.stack || '').toLowerCase();

    const securityKeywords = [
      'unauthorized', 'forbidden', 'authentication', 'permission',
      'csrf', 'xss', 'injection', 'exploit', 'security', 'breach'
    ];

    return securityKeywords.some(keyword => 
      message.includes(keyword) || stack.includes(keyword)
    );
  }

  /**
   * 보안 에러 특별 처리
   */
  private handleSecurityError(error: Error, context: Partial<ErrorContext>, errorId: string): void {
    // 보안 에러는 즉시 로그에 기록하지만 사용자에게는 일반적인 메시지만 표시
    console.warn(`🔒 Security Error Detected [${errorId}]:`, {
      timestamp: new Date().toISOString(),
      context: this.sanitizeContext(context),
      sanitizedMessage: 'Security error occurred'
    });

    // 보안 팀 알림 (실제 환경에서는 보안 모니터링 시스템에 전송)
    if (!__DEV__) {
      this.notifySecurityTeam(errorId, context);
    }
  }

  /**
   * 민감한 정보 제거
   */
  private sanitizeMessage(message: string): string {
    if (!this.config.preventInfoLeakage) {
      return message;
    }

    let sanitized = message;

    // 민감한 패턴 제거
    this.sensitivePatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    });

    // 파일 경로 제거 (보안상)
    sanitized = sanitized.replace(/[C-Z]:\\[^\s]+/g, '[PATH_REDACTED]');
    sanitized = sanitized.replace(/\/[^\s]+\//g, '[PATH_REDACTED]');

    // URL 파라미터 제거
    sanitized = sanitized.replace(/\?[^\s]+/g, '[PARAMS_REDACTED]');

    return sanitized;
  }

  /**
   * 스택 트레이스 정제
   */
  private sanitizeStackTrace(stack: string): string {
    if (!this.config.sanitizeStackTraces) {
      return stack;
    }

    let sanitized = stack;

    // 파일 절대 경로 제거
    sanitized = sanitized.replace(/[C-Z]:\\[^\s\)]+/g, '[FILE]');
    sanitized = sanitized.replace(/\/[^\s\)]+\//g, '[DIR]/');

    // 사용자 정보 제거
    sanitized = sanitized.replace(/Users\/[^\/\s]+/g, 'Users/[USER]');

    // 민감한 패턴 제거
    this.sensitivePatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    });

    // 스택의 깊이 제한 (정보 노출 최소화)
    const lines = sanitized.split('\n');
    if (lines.length > 10) {
      sanitized = lines.slice(0, 10).join('\n') + '\n    ... [STACK_TRUNCATED]';
    }

    return sanitized;
  }

  /**
   * 컨텍스트 정보 정제
   */
  private sanitizeContext(context: Partial<ErrorContext>): Partial<ErrorContext> {
    if (!this.config.sanitizeUserData) {
      return context;
    }

    const sanitized: Partial<ErrorContext> = {
      timestamp: context.timestamp || Date.now(),
    };

    // 사용자 ID는 해시화
    if (context.userId) {
      sanitized.userId = this.hashUserId(context.userId);
    }

    // 세션 ID는 마지막 4자리만
    if (context.sessionId) {
      sanitized.sessionId = '****' + context.sessionId.slice(-4);
    }

    // URL에서 민감한 파라미터 제거
    if (context.url) {
      sanitized.url = context.url.split('?')[0];
    }

    // User Agent는 브라우저 종류만
    if (context.userAgent) {
      sanitized.userAgent = this.sanitizeUserAgent(context.userAgent);
    }

    // 사용자 정의 데이터 정제
    if (context.customData) {
      sanitized.customData = this.sanitizeCustomData(context.customData);
    }

    return sanitized;
  }

  /**
   * 사용자 ID 해시화
   */
  private hashUserId(userId: string): string {
    // 간단한 해시 (실제 환경에서는 적절한 해시 함수 사용)
    return 'user_' + userId.length.toString() + '_' + 
           userId.charCodeAt(0).toString(36) + 
           userId.charCodeAt(userId.length - 1).toString(36);
  }

  /**
   * User Agent 정제
   */
  private sanitizeUserAgent(userAgent: string): string {
    // 브라우저 종류와 주요 버전만 추출
    const simplified = userAgent.match(/(Chrome|Firefox|Safari|Edge)\/[\d.]+/);
    return simplified ? simplified[0] : 'Unknown Browser';
  }

  /**
   * 사용자 정의 데이터 정제
   */
  private sanitizeCustomData(data: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      
      // 민감한 키는 제외
      if (this.sensitivePatterns.some(pattern => pattern.test(lowerKey))) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof value === 'string') {
        sanitized[key] = this.sanitizeMessage(value);
      } else if (typeof value === 'object' && value !== null) {
        // 재귀적으로 중첩 객체 정제
        sanitized[key] = this.sanitizeCustomData(value as Record<string, any>);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * 복구 가능성 판단
   */
  private canRecover(error: Error, type: SanitizedError['type']): boolean {
    const message = error.message.toLowerCase();

    // 복구 불가능한 에러들
    if (message.includes('out of memory') || 
        message.includes('stack overflow') ||
        message.includes('fatal') ||
        type === 'security') {
      return false;
    }

    // 네트워크 에러는 대부분 복구 가능
    if (type === 'network') {
      return true;
    }

    // 검증 에러는 복구 가능
    if (type === 'validation') {
      return true;
    }

    // 일반적인 런타임 에러는 재시도로 복구 가능할 수 있음
    return type === 'runtime';
  }

  /**
   * 리포트 여부 결정 (Rate Limiting 포함)
   */
  private shouldReport(errorId: string, severity: SanitizedError['severity']): boolean {
    const now = Date.now();
    const windowStart = now - this.config.rateLimitWindow;

    // 윈도우 내 에러 수 계산
    let recentErrorCount = 0;
    for (const [id, timestamp] of this.errorReports.entries()) {
      if (timestamp < windowStart) {
        this.errorReports.delete(id);
      } else {
        recentErrorCount++;
      }
    }

    // Critical 에러는 항상 리포트
    if (severity === 'critical') {
      this.errorReports.set(errorId, now);
      return true;
    }

    // Rate limit 확인
    if (recentErrorCount >= this.config.maxErrorReports) {
      return false;
    }

    // High/Medium 에러만 리포트
    if (severity === 'high' || severity === 'medium') {
      this.errorReports.set(errorId, now);
      return true;
    }

    return false;
  }

  /**
   * 에러 빈도 추적
   */
  private trackErrorFrequency(errorId: string, type: SanitizedError['type']): void {
    const key = `${type}_${errorId}`;
    const existing = this.errorCounts.get(key);

    if (existing) {
      existing.count++;
    } else {
      this.errorCounts.set(key, { count: 1, firstSeen: Date.now() });
    }

    // DDoS 방지: 같은 에러가 너무 자주 발생하면 경고
    const errorData = this.errorCounts.get(key)!;
    if (errorData.count > 20) {
      console.warn(`🚨 Potential error flood detected: ${key} (${errorData.count} times)`);
    }
  }

  /**
   * 보안 팀 알림
   */
  private notifySecurityTeam(errorId: string, context: Partial<ErrorContext>): void {
    // 실제 환경에서는 보안 모니터링 시스템이나 슬랙/이메일 등으로 알림
    console.warn(`🔔 Security Alert [${errorId}]: Security-related error detected`, {
      timestamp: new Date().toISOString(),
      sanitizedContext: this.sanitizeContext(context)
    });
  }

  /**
   * 상세 에러 로그 (개발 환경 전용)
   */
  private logDetailedError(original: Error, sanitized: SanitizedError): void {
    console.group(`🐛 Detailed Error Report [${sanitized.id}]`);
    console.log('Type:', sanitized.type);
    console.log('Severity:', sanitized.severity);
    console.log('Category:', sanitized.category);
    console.log('Recovered:', sanitized.recovered);
    console.log('Reportable:', sanitized.reportable);
    console.log('Original Message:', original.message);
    console.log('Sanitized Message:', sanitized.message);
    console.log('Context:', sanitized.context);
    if (original.stack) {
      console.log('Original Stack:', original.stack);
    }
    if (sanitized.sanitizedStack) {
      console.log('Sanitized Stack:', sanitized.sanitizedStack);
    }
    console.groupEnd();
  }

  /**
   * 보안 에러 ID 생성
   */
  private generateSecureErrorId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 15);
    return `err_${timestamp}_${random}`;
  }

  /**
   * 에러 통계 조회
   */
  getErrorStats(): {
    totalErrors: number;
    errorsByType: Record<string, number>;
    recentErrorsCount: number;
    topErrors: Array<{ key: string; count: number; firstSeen: number }>;
  } {
    const errorsByType: Record<string, number> = {};
    let totalErrors = 0;

    for (const [key, data] of this.errorCounts.entries()) {
      const type = key.split('_')[0];
      errorsByType[type] = (errorsByType[type] || 0) + data.count;
      totalErrors += data.count;
    }

    const recentErrorsCount = this.errorReports.size;
    
    const topErrors = Array.from(this.errorCounts.entries())
      .map(([key, data]) => ({ key, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalErrors,
      errorsByType,
      recentErrorsCount,
      topErrors,
    };
  }

  /**
   * 설정 업데이트
   */
  updateConfig(newConfig: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
}

export default SecureErrorHandler;