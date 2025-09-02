/**
 * SecureErrorHandler 테스트 수트
 * 보안 에러 처리, 정보 정제, 분류 시스템 검증
 */

import SecureErrorHandler, { SanitizedError, ErrorContext } from '../SecureErrorHandler';

describe('SecureErrorHandler', () => {
  let handler: SecureErrorHandler;
  const mockContext: Partial<ErrorContext> = {
    sessionId: 'test-session-123',
    timestamp: Date.now(),
    customData: {
      component: 'TestComponent',
      userId: 'user-456',
      action: 'submit-form',
    },
  };

  beforeEach(() => {
    handler = SecureErrorHandler.getInstance({
      sanitizeStackTraces: true,
      sanitizeUserData: true,
      preventInfoLeakage: true,
      enableDevDetails: false,
      maxErrorReports: 10,
      rateLimitWindow: 60000,
    });
  });

  describe('Singleton 패턴', () => {
    it('동일한 인스턴스를 반환해야 함', () => {
      const instance1 = SecureErrorHandler.getInstance();
      const instance2 = SecureErrorHandler.getInstance();
      
      expect(instance1).toBe(instance2);
    });
  });

  describe('에러 분류 시스템', () => {
    it('네트워크 에러를 올바르게 분류해야 함', () => {
      const networkErrors = [
        new Error('Network request failed'),
        new Error('fetch is not defined'),
        new Error('Connection timeout'),
        new Error('CORS error'),
      ];

      networkErrors.forEach(error => {
        const result = handler.handleError(error, mockContext, 'test');
        expect(result.type).toBe('network');
      });
    });

    it('보안 관련 에러를 올바르게 분류해야 함', () => {
      const securityErrors = [
        new Error('Authentication failed'),
        new Error('Unauthorized access'),
        new Error('Invalid token provided'),
        new Error('Permission denied'),
      ];

      securityErrors.forEach(error => {
        const result = handler.handleError(error, mockContext, 'security');
        expect(result.type).toBe('security');
      });
    });

    it('검증 에러를 올바르게 분류해야 함', () => {
      const validationErrors = [
        new Error('Invalid input provided'),
        new Error('Email format is incorrect'),
        new Error('Required field missing'),
        new Error('Value out of range'),
      ];

      validationErrors.forEach(error => {
        const result = handler.handleError(error, mockContext, 'validation');
        expect(result.type).toBe('validation');
      });
    });

    it('런타임 에러를 올바르게 분류해야 함', () => {
      const runtimeErrors = [
        new Error('Cannot read property of undefined'),
        new Error('TypeError: x is not a function'),
        new Error('ReferenceError: variable is not defined'),
      ];

      runtimeErrors.forEach(error => {
        const result = handler.handleError(error, mockContext, 'runtime');
        expect(result.type).toBe('runtime');
      });
    });
  });

  describe('심각도 평가', () => {
    it('보안 에러는 높은 심각도로 분류되어야 함', () => {
      const securityError = new Error('Authentication bypass detected');
      const result = handler.handleError(securityError, mockContext, 'security');
      
      expect(result.severity).toBe('high');
    });

    it('네트워크 에러는 중간 심각도로 분류되어야 함', () => {
      const networkError = new Error('API request timeout');
      const result = handler.handleError(networkError, mockContext, 'network');
      
      expect(result.severity).toBe('medium');
    });

    it('검증 에러는 낮은 심각도로 분류되어야 함', () => {
      const validationError = new Error('Invalid email format');
      const result = handler.handleError(validationError, mockContext, 'validation');
      
      expect(result.severity).toBe('low');
    });
  });

  describe('민감한 정보 정제', () => {
    it('이메일 주소가 정제되어야 함', () => {
      const error = new Error('Database error: user email john.doe@example.com not found');
      const result = handler.handleError(error, mockContext, 'database');
      
      expect(result.message).not.toContain('john.doe@example.com');
      expect(result.message).toContain('[EMAIL_REDACTED]');
    });

    it('전화번호가 정제되어야 함', () => {
      const error = new Error('SMS failed to +1-555-123-4567');
      const result = handler.handleError(error, mockContext, 'sms');
      
      expect(result.message).not.toContain('+1-555-123-4567');
      expect(result.message).toContain('[PHONE_REDACTED]');
    });

    it('IP 주소가 정제되어야 함', () => {
      const error = new Error('Connection failed from 192.168.1.100');
      const result = handler.handleError(error, mockContext, 'network');
      
      expect(result.message).not.toContain('192.168.1.100');
      expect(result.message).toContain('[IP_REDACTED]');
    });

    it('사용자 ID가 정제되어야 함', () => {
      const error = new Error('User user123 does not have permission');
      const result = handler.handleError(error, mockContext, 'authorization');
      
      expect(result.message).not.toContain('user123');
      expect(result.message).toContain('[USER_REDACTED]');
    });

    it('토큰이 정제되어야 함', () => {
      const error = new Error('Invalid JWT token: eyJhbGciOiJIUzI1NiJ9.payload.signature');
      const result = handler.handleError(error, mockContext, 'auth');
      
      expect(result.message).not.toContain('eyJhbGciOiJIUzI1NiJ9.payload.signature');
      expect(result.message).toContain('[TOKEN_REDACTED]');
    });

    it('파일 경로가 정제되어야 함', () => {
      const error = new Error('File not found: /Users/john/Documents/secret.txt');
      const result = handler.handleError(error, mockContext, 'filesystem');
      
      expect(result.message).not.toContain('/Users/john/Documents/secret.txt');
      expect(result.message).toContain('[PATH_REDACTED]');
    });
  });

  describe('스택 트레이스 정제', () => {
    it('개발 모드가 비활성화되면 스택 트레이스가 정제되어야 함', () => {
      const error = new Error('Test error');
      error.stack = `Error: Test error
        at /Users/developer/project/src/components/UserProfile.tsx:45:12
        at /Users/developer/project/node_modules/react/index.js:123:45`;
      
      const result = handler.handleError(error, mockContext, 'test');
      
      expect(result.sanitizedStack).not.toContain('/Users/developer/project');
      expect(result.sanitizedStack).toContain('[PATH_REDACTED]');
    });

    it('개발 모드가 활성화되면 원본 스택 트레이스를 유지해야 함', () => {
      const devHandler = SecureErrorHandler.getInstance({
        sanitizeStackTraces: false,
        enableDevDetails: true,
      });
      
      const error = new Error('Test error');
      const originalStack = `Error: Test error
        at /Users/developer/project/src/components/UserProfile.tsx:45:12`;
      error.stack = originalStack;
      
      const result = devHandler.handleError(error, mockContext, 'test');
      
      expect(result.sanitizedStack).toBe(originalStack);
    });
  });

  describe('Rate Limiting', () => {
    it('동일한 에러가 짧은 시간 내에 여러 번 발생하면 제한되어야 함', () => {
      const error = new Error('Repeated error');
      
      // 첫 번째 에러는 처리됨
      const result1 = handler.handleError(error, mockContext, 'test');
      expect(result1.reportable).toBe(true);
      
      // 동일한 에러가 즉시 다시 발생하면 제한됨
      const result2 = handler.handleError(error, mockContext, 'test');
      expect(result2.reportable).toBe(false);
    });

    it('Rate limit window가 지나면 다시 리포팅 가능해야 함', () => {
      const error = new Error('Time-based error');
      
      // 첫 번째 에러
      const result1 = handler.handleError(error, mockContext, 'test');
      expect(result1.reportable).toBe(true);
      
      // 시간을 앞으로 이동 (모의)
      jest.spyOn(Date, 'now').mockReturnValue(Date.now() + 70000); // 70초 후
      
      // 시간이 지난 후에는 다시 리포팅 가능
      const result2 = handler.handleError(error, mockContext, 'test');
      expect(result2.reportable).toBe(true);
      
      jest.restoreAllMocks();
    });
  });

  describe('복구 가능성 평가', () => {
    it('네트워크 에러는 복구 가능한 것으로 평가되어야 함', () => {
      const networkError = new Error('Network timeout');
      const result = handler.handleError(networkError, mockContext, 'network');
      
      expect(result.recovered).toBe(true);
    });

    it('보안 에러는 복구 불가능한 것으로 평가되어야 함', () => {
      const securityError = new Error('Authentication failed');
      const result = handler.handleError(securityError, mockContext, 'security');
      
      expect(result.recovered).toBe(false);
    });

    it('검증 에러는 복구 가능한 것으로 평가되어야 함', () => {
      const validationError = new Error('Invalid input');
      const result = handler.handleError(validationError, mockContext, 'validation');
      
      expect(result.recovered).toBe(true);
    });
  });

  describe('Context 처리', () => {
    it('사용자 데이터가 정제되어야 함', () => {
      const sensitiveContext: Partial<ErrorContext> = {
        sessionId: 'session-123',
        customData: {
          email: 'user@example.com',
          password: 'secret123',
          creditCard: '4111-1111-1111-1111',
          ssn: '123-45-6789',
        },
      };
      
      const error = new Error('Context test error');
      const result = handler.handleError(error, sensitiveContext, 'test');
      
      // 민감한 정보가 context에서 제거되어야 함
      expect(result.context).not.toContain('user@example.com');
      expect(result.context).not.toContain('secret123');
      expect(result.context).not.toContain('4111-1111-1111-1111');
      expect(result.context).not.toContain('123-45-6789');
    });

    it('안전한 context 데이터는 유지되어야 함', () => {
      const safeContext: Partial<ErrorContext> = {
        sessionId: 'session-123',
        customData: {
          component: 'UserProfile',
          action: 'save',
          timestamp: Date.now(),
        },
      };
      
      const error = new Error('Safe context test');
      const result = handler.handleError(error, safeContext, 'test');
      
      expect(result.context).toContain('UserProfile');
      expect(result.context).toContain('save');
    });
  });

  describe('에러 ID 생성', () => {
    it('고유한 에러 ID가 생성되어야 함', () => {
      const error = new Error('ID test error');
      const result1 = handler.handleError(error, mockContext, 'test');
      const result2 = handler.handleError(error, mockContext, 'test');
      
      expect(result1.id).toBeDefined();
      expect(result2.id).toBeDefined();
      expect(result1.id).not.toBe(result2.id);
    });

    it('에러 ID 형식이 올바라야 함', () => {
      const error = new Error('Format test error');
      const result = handler.handleError(error, mockContext, 'test');
      
      expect(result.id).toMatch(/^err_[a-z0-9]+_[a-z0-9]+$/);
    });
  });

  describe('카테고리 처리', () => {
    it('제공된 카테고리가 유지되어야 함', () => {
      const error = new Error('Category test');
      const result = handler.handleError(error, mockContext, 'custom_category');
      
      expect(result.category).toBe('custom_category');
    });

    it('기본 카테고리가 설정되어야 함', () => {
      const error = new Error('Default category test');
      const result = handler.handleError(error, mockContext);
      
      expect(result.category).toBe('general');
    });
  });

  describe('타임스탬프 처리', () => {
    it('현재 타임스탬프가 설정되어야 함', () => {
      const beforeTime = Date.now();
      
      const error = new Error('Timestamp test');
      const result = handler.handleError(error, mockContext, 'test');
      
      const afterTime = Date.now();
      
      expect(result.timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(result.timestamp).toBeLessThanOrEqual(afterTime);
    });

    it('context에서 제공된 타임스탬프가 우선되어야 함', () => {
      const customTimestamp = Date.now() - 10000; // 10초 전
      const contextWithTimestamp = {
        ...mockContext,
        timestamp: customTimestamp,
      };
      
      const error = new Error('Custom timestamp test');
      const result = handler.handleError(error, contextWithTimestamp, 'test');
      
      expect(result.timestamp).toBe(customTimestamp);
    });
  });
});