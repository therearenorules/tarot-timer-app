/**
 * ErrorReportingService 테스트 수트
 * 에러 리포팅, 분석, 저장 시스템 검증
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorReportingService from '../ErrorReportingService';
import type { SanitizedError } from '../SecureErrorHandler';

// AsyncStorage 모킹
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('ErrorReportingService', () => {
  let service: ErrorReportingService;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  const mockSanitizedError: SanitizedError = {
    id: 'err_test_123',
    type: 'runtime',
    severity: 'medium',
    category: 'component',
    message: 'Test error message',
    timestamp: Date.now(),
    reportable: true,
    recovered: true,
    context: 'test context',
    sanitizedStack: 'sanitized stack trace',
  };

  const mockDeviceInfo = {
    platform: 'ios',
    osVersion: '17.0',
    appVersion: '1.0.0',
    deviceModel: 'iPhone 15',
    screenSize: { width: 393, height: 852 },
    locale: 'ko-KR',
    timezone: 'Asia/Seoul',
    networkType: 'wifi',
    batteryLevel: 85,
    memoryUsage: 256,
    storageSpace: 128000,
  };

  const mockAppInfo = {
    version: '1.0.0',
    buildNumber: '1',
    environment: 'development' as const,
    features: ['tarot-timer', 'error-boundary'],
    lastUpdateTime: Date.now() - 86400000,
    installTime: Date.now() - 604800000,
    launchCount: 42,
  };

  const mockUserContext = {
    sessionId: 'session_123',
    hashedUserId: 'hashed_user_456',
    userTier: 'free' as const,
    sessionDuration: 1800000,
    screenPath: '/dashboard',
    previousScreen: '/login',
    userAction: 'button_click',
    customDimensions: {
      theme: 'dark',
      language: 'ko',
      feature_flags: 'mystical_ui:true',
    },
  };

  beforeEach(() => {
    service = ErrorReportingService.getInstance();
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    
    // AsyncStorage 모킹 초기화
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(null);
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    jest.clearAllMocks();
  });

  describe('Singleton 패턴', () => {
    it('동일한 인스턴스를 반환해야 함', () => {
      const instance1 = ErrorReportingService.getInstance();
      const instance2 = ErrorReportingService.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });

  describe('에러 리포트 생성', () => {
    it('에러 리포트가 성공적으로 생성되어야 함', async () => {
      const reportId = await service.reportError(
        mockSanitizedError,
        mockDeviceInfo,
        mockAppInfo,
        mockUserContext
      );

      expect(reportId).toBeDefined();
      expect(reportId).toMatch(/^rpt_[a-z0-9]+_[a-z0-9]+$/);
    });

    it('Critical 에러는 즉시 전송되어야 함', async () => {
      const criticalError: SanitizedError = {
        ...mockSanitizedError,
        severity: 'critical',
      };

      const reportId = await service.reportError(
        criticalError,
        mockDeviceInfo,
        mockAppInfo,
        mockUserContext
      );

      expect(consoleLogSpy).toHaveBeenCalledWith(
        '📤 에러 리포트 전송:',
        expect.objectContaining({
          id: reportId,
          type: 'runtime',
          severity: 'critical',
        })
      );
    });

    it('보안 관련 에러는 로컬에만 저장되어야 함', async () => {
      const securityError: SanitizedError = {
        ...mockSanitizedError,
        type: 'security',
        category: 'authentication',
      };

      await service.reportError(
        securityError,
        mockDeviceInfo,
        mockAppInfo,
        mockUserContext
      );

      // 보안 에러는 전송되지 않아야 함
      expect(consoleLogSpy).not.toHaveBeenCalledWith(
        '📤 에러 리포트 전송:',
        expect.any(Object)
      );
    });

    it('디바이스 정보가 정제되어야 함', async () => {
      const sensitiveDeviceInfo = {
        ...mockDeviceInfo,
        deviceModel: 'iPhone 15 Pro Max 512GB Serial:ABC123456',
      };

      await service.reportError(
        mockSanitizedError,
        sensitiveDeviceInfo,
        mockAppInfo,
        mockUserContext
      );

      // 시리얼 번호가 정제되어야 함
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@tarot_timer_error_reports',
        expect.stringContaining('iPhone 15 Pro Max XXXgGB Serial:XXX')
      );
    });

    it('사용자 컨텍스트에서 민감한 정보가 제거되어야 함', async () => {
      const sensitiveUserContext = {
        ...mockUserContext,
        customDimensions: {
          ...mockUserContext.customDimensions,
          email: 'user@example.com',
          phone: '+1-555-123-4567',
        },
      };

      await service.reportError(
        mockSanitizedError,
        mockDeviceInfo,
        mockAppInfo,
        sensitiveUserContext
      );

      // 민감한 정보가 제거되어야 함
      const savedData = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
      expect(savedData).not.toContain('user@example.com');
      expect(savedData).not.toContain('+1-555-123-4567');
    });
  });

  describe('복구 정보 업데이트', () => {
    it('복구 정보가 올바르게 업데이트되어야 함', async () => {
      const reportId = await service.reportError(
        mockSanitizedError,
        mockDeviceInfo,
        mockAppInfo,
        mockUserContext
      );

      const recoveryInfo = {
        attempted: true,
        successful: true,
        strategy: 'manual_retry' as const,
        retryCount: 1,
        timestamp: Date.now(),
      };

      await service.updateRecovery(reportId, recoveryInfo);

      const report = service.getReport(reportId);
      expect(report?.recovery).toEqual(expect.objectContaining(recoveryInfo));
    });

    it('존재하지 않는 리포트 ID에 대해서는 조용히 실패해야 함', async () => {
      const recoveryInfo = {
        attempted: true,
        successful: false,
        strategy: 'auto_retry' as const,
        retryCount: 3,
        timestamp: Date.now(),
      };

      await expect(
        service.updateRecovery('non-existent-id', recoveryInfo)
      ).resolves.not.toThrow();
    });
  });

  describe('에러 분석 생성', () => {
    beforeEach(async () => {
      // 테스트 데이터 준비
      const errors = [
        { ...mockSanitizedError, type: 'runtime', severity: 'high' },
        { ...mockSanitizedError, type: 'network', severity: 'medium' },
        { ...mockSanitizedError, type: 'runtime', severity: 'low' },
        { ...mockSanitizedError, type: 'security', severity: 'critical' },
      ];

      for (const error of errors) {
        await service.reportError(error, mockDeviceInfo, mockAppInfo, mockUserContext);
      }
    });

    it('전체 에러 수가 올바르게 계산되어야 함', () => {
      const analytics = service.generateAnalytics();
      expect(analytics.totalErrors).toBe(4);
    });

    it('타입별 분류가 올바르게 계산되어야 함', () => {
      const analytics = service.generateAnalytics();
      
      expect(analytics.errorsByType).toEqual({
        runtime: 2,
        network: 1,
        security: 1,
      });
    });

    it('심각도별 분류가 올바르게 계산되어야 함', () => {
      const analytics = service.generateAnalytics();
      
      expect(analytics.errorsBySeverity).toEqual({
        high: 1,
        medium: 1,
        low: 1,
        critical: 1,
      });
    });

    it('복구율이 올바르게 계산되어야 함', async () => {
      const reports = service.getAllReports();
      
      // 일부 리포트에 복구 정보 추가
      await service.updateRecovery(reports[0].id, {
        attempted: true,
        successful: true,
        strategy: 'manual_retry',
        retryCount: 1,
        timestamp: Date.now(),
      });

      await service.updateRecovery(reports[1].id, {
        attempted: true,
        successful: false,
        strategy: 'auto_retry',
        retryCount: 3,
        timestamp: Date.now(),
      });

      const analytics = service.generateAnalytics();
      expect(analytics.recoveryRate).toBe(50); // 2개 중 1개 성공
    });

    it('상위 에러들이 올바르게 정렬되어야 함', async () => {
      // 동일한 에러를 여러 번 추가
      for (let i = 0; i < 3; i++) {
        await service.reportError(
          { ...mockSanitizedError, message: 'Frequent error' },
          mockDeviceInfo,
          mockAppInfo,
          mockUserContext
        );
      }

      const analytics = service.generateAnalytics();
      expect(analytics.topErrors[0].count).toBeGreaterThan(1);
    });

    it('영향받은 사용자 수가 올바르게 계산되어야 함', () => {
      const analytics = service.generateAnalytics();
      expect(analytics.affectedUsers).toBe(1); // 하나의 해시된 사용자 ID
    });

    it('최근 24시간 내 Critical 에러 수가 올바르게 계산되어야 함', () => {
      const analytics = service.generateAnalytics();
      expect(analytics.criticalErrorsLast24h).toBe(1);
    });
  });

  describe('스토리지 관리', () => {
    it('리포트가 AsyncStorage에 저장되어야 함', async () => {
      await service.reportError(
        mockSanitizedError,
        mockDeviceInfo,
        mockAppInfo,
        mockUserContext
      );

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@tarot_timer_error_reports',
        expect.any(String)
      );
    });

    it('오래된 리포트가 정리되어야 함', async () => {
      // 30일 전 에러 생성
      const oldError: SanitizedError = {
        ...mockSanitizedError,
        timestamp: Date.now() - (31 * 24 * 60 * 60 * 1000), // 31일 전
      };

      await service.reportError(
        oldError,
        mockDeviceInfo,
        mockAppInfo,
        mockUserContext
      );

      // 스토리지에서 오래된 데이터가 제거되는지 확인
      const savedData = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
      const reports = JSON.parse(savedData);
      
      expect(reports.some((r: any) => r.error.timestamp === oldError.timestamp)).toBe(false);
    });

    it('최대 리포트 수 제한이 작동해야 함', async () => {
      // 101개의 리포트 생성 (maxLocalReports = 100)
      for (let i = 0; i < 101; i++) {
        await service.reportError(
          { ...mockSanitizedError, message: `Error ${i}` },
          mockDeviceInfo,
          mockAppInfo,
          mockUserContext
        );
      }

      const savedData = (AsyncStorage.setItem as jest.Mock).mock.calls[0][1];
      const reports = JSON.parse(savedData);
      
      expect(reports.length).toBeLessThanOrEqual(100);
    });
  });

  describe('분석 데이터 저장', () => {
    it('분석 데이터가 AsyncStorage에 저장되어야 함', async () => {
      await service.reportError(
        mockSanitizedError,
        mockDeviceInfo,
        mockAppInfo,
        mockUserContext
      );

      await service.saveAnalytics();

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@tarot_timer_error_analytics',
        expect.stringContaining('generatedAt')
      );
    });
  });

  describe('리포트 관리', () => {
    it('모든 리포트를 조회할 수 있어야 함', async () => {
      await service.reportError(
        mockSanitizedError,
        mockDeviceInfo,
        mockAppInfo,
        mockUserContext
      );

      const reports = service.getAllReports();
      expect(reports).toHaveLength(1);
      expect(reports[0].error.message).toBe(mockSanitizedError.message);
    });

    it('특정 리포트를 ID로 조회할 수 있어야 함', async () => {
      const reportId = await service.reportError(
        mockSanitizedError,
        mockDeviceInfo,
        mockAppInfo,
        mockUserContext
      );

      const report = service.getReport(reportId);
      expect(report).toBeDefined();
      expect(report?.id).toBe(reportId);
    });

    it('리포트를 삭제할 수 있어야 함', async () => {
      const reportId = await service.reportError(
        mockSanitizedError,
        mockDeviceInfo,
        mockAppInfo,
        mockUserContext
      );

      await service.deleteReport(reportId);

      const report = service.getReport(reportId);
      expect(report).toBeUndefined();
    });

    it('모든 로컬 데이터를 정리할 수 있어야 함', async () => {
      await service.reportError(
        mockSanitizedError,
        mockDeviceInfo,
        mockAppInfo,
        mockUserContext
      );

      await service.clearAllData();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@tarot_timer_error_reports');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@tarot_timer_error_analytics');
      
      const reports = service.getAllReports();
      expect(reports).toHaveLength(0);
    });
  });

  describe('리포팅 설정', () => {
    it('리포팅을 비활성화할 수 있어야 함', async () => {
      service.setReportingEnabled(false);

      const criticalError: SanitizedError = {
        ...mockSanitizedError,
        severity: 'critical',
      };

      await service.reportError(
        criticalError,
        mockDeviceInfo,
        mockAppInfo,
        mockUserContext
      );

      // 리포팅이 비활성화되어 전송되지 않아야 함
      expect(consoleLogSpy).not.toHaveBeenCalledWith(
        '📤 에러 리포트 전송:',
        expect.any(Object)
      );
    });

    it('리포팅을 다시 활성화할 수 있어야 함', () => {
      service.setReportingEnabled(false);
      service.setReportingEnabled(true);

      // 활성화 상태 확인은 실제 리포팅을 통해 간접적으로 검증
      expect(() => service.setReportingEnabled(true)).not.toThrow();
    });
  });

  describe('에러 처리', () => {
    it('AsyncStorage 에러 시 조용히 실패해야 함', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Storage error'));

      await expect(
        service.reportError(
          mockSanitizedError,
          mockDeviceInfo,
          mockAppInfo,
          mockUserContext
        )
      ).resolves.not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '에러 리포트 저장 실패:',
        expect.any(Error)
      );
    });

    it('분석 데이터 저장 에러 시 조용히 실패해야 함', async () => {
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(new Error('Analytics storage error'));

      await expect(service.saveAnalytics()).resolves.not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '분석 데이터 저장 실패:',
        expect.any(Error)
      );
    });
  });
});