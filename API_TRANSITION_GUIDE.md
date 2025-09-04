# API Transition Guide: Mock to Real Implementation

> **목적**: Mock 데이터에서 실제 API로의 원활한 전환을 위한 전략 가이드

## 📋 Overview

This guide outlines the complete strategy for transitioning from mock data implementation to real API integration while maintaining zero client-side code changes.

## 🏗️ Architecture Foundation

### Service Factory Pattern
```typescript
// 런타임에 Mock/Real 구현체 결정
const factory = ServiceFactory.getInstance({
  mode: 'mock' | 'real' | 'hybrid',
  apiBaseUrl: 'https://api.tarrottimer.app',
  timeout: 10000
});

const tarotService = factory.getTarotService();
// 클라이언트 코드는 변경 없음
const dailyCards = await tarotService.getDailyCards('2024-01-15');
```

### Configuration-Based Switching
```typescript
// src/config/apiConfig.ts
export const API_CONFIG = {
  mode: process.env.EXPO_PUBLIC_API_MODE || (__DEV__ ? 'mock' : 'real'),
  baseUrl: process.env.EXPO_PUBLIC_API_URL || 'https://api.tarottimer.app',
  // 환경 변수로 런타임 전환 가능
};
```

## 🔄 Transition Phases

### Phase 1: Mock Development (Current)
**Status**: ✅ Complete
- Mock data generators with seeded randomization
- Complete service interfaces
- Factory pattern implementation
- Consistent data structures

**Benefits**:
- UI 우선 개발 가능
- 백엔드 의존성 없이 빠른 프로토타이핑
- 예측 가능한 테스트 데이터
- 오프라인 개발 환경

### Phase 2: API Specification & Documentation
**Next Steps**:
```yaml
api_design:
  - OpenAPI/Swagger 스펙 작성
  - 엔드포인트 URL 매핑 정의
  - 인증/인가 전략 수립
  - 에러 응답 표준화
  
backend_requirements:
  - 실제 타로 카드 데이터베이스 구축
  - 사용자 관리 시스템
  - 저널 엔트리 CRUD
  - 설정 관리 API
```

### Phase 3: Hybrid Mode Implementation
**Strategy**: 점진적 전환으로 리스크 최소화
```typescript
// Hybrid 모드: 일부는 Real, 일부는 Mock
const hybridConfig = {
  mode: 'hybrid',
  services: {
    tarot: 'real',    // 실제 API 사용
    user: 'mock',     // 아직 Mock 사용
    journal: 'real',  // 실제 API 사용
    settings: 'mock'  // 아직 Mock 사용
  }
};
```

### Phase 4: Full Real API Migration
**Final State**: 모든 서비스를 실제 API로 전환
```typescript
const productionConfig = {
  mode: 'real',
  apiBaseUrl: 'https://api.tarrottimer.app',
  enableCaching: true,
  offlineSupport: true
};
```

## 🛠️ Implementation Guidelines

### 1. Real Service Implementation Template
```typescript
// src/services/real/RealTarotService.ts
export class RealTarotService implements TarotService {
  constructor(private config: ServiceConfig) {}

  async getDailyCards(date: string): Promise<ApiResponse<DailyTarotReading | null>> {
    try {
      const response = await fetch(`${this.config.apiBaseUrl}/tarot/daily-cards?date=${date}`, {
        method: 'GET',
        headers: HTTP_HEADERS,
        timeout: this.config.timeout
      });
      
      return await this.handleResponse(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      throw new ServiceError({
        type: 'network',
        code: `HTTP_${response.status}`,
        statusCode: response.status,
        message: response.statusText
      });
    }
    
    const data = await response.json();
    return { success: true, data };
  }

  private handleError(error: any): ApiResponse<any> {
    return {
      success: false,
      error: {
        type: 'network',
        code: 'REQUEST_FAILED',
        message: error.message
      }
    };
  }
}
```

### 2. Service Factory Configuration Update
```typescript
// src/services/factory/ServiceFactory.ts
private async createTarotService(): Promise<TarotService> {
  switch (this.config.mode) {
    case 'mock':
      return new MockTarotService({
        generateNetworkDelay: true,
        persistData: true,
        seedBasedGeneration: true,
      });
      
    case 'real':
      return new RealTarotService(this.config); // ← 새로 구현
      
    case 'hybrid':
      // 설정에 따라 Mock 또는 Real 선택
      return this.config.services?.tarot === 'real' 
        ? new RealTarotService(this.config)
        : new MockTarotService({ generateNetworkDelay: true });
        
    default:
      throw new Error(`Unknown service mode: ${this.config.mode}`);
  }
}
```

### 3. Environment Configuration
```bash
# .env.development
EXPO_PUBLIC_API_MODE=mock
EXPO_PUBLIC_API_URL=http://localhost:3001
EXPO_PUBLIC_ENABLE_LOGGING=true

# .env.staging  
EXPO_PUBLIC_API_MODE=hybrid
EXPO_PUBLIC_API_URL=https://staging-api.tarrottimer.app
EXPO_PUBLIC_ENABLE_LOGGING=true

# .env.production
EXPO_PUBLIC_API_MODE=real
EXPO_PUBLIC_API_URL=https://api.tarrottimer.app
EXPO_PUBLIC_ENABLE_LOGGING=false
```

## 📊 Data Consistency Strategy

### 1. Schema Validation
```typescript
// Mock 데이터와 Real API 응답 동일성 보장
const validateTarotCard = (card: any): card is TarotCard => {
  return (
    typeof card.id === 'string' &&
    typeof card.name === 'string' &&
    typeof card.nameKr === 'string' &&
    Array.isArray(card.keywords) &&
    // ... 추가 검증 로직
  );
};

// Real Service에서 사용
const data = await response.json();
if (!validateTarotCard(data)) {
  throw new ServiceError('INVALID_DATA_FORMAT');
}
```

### 2. Mock Data Seeding for Backend
```typescript
// Mock 데이터를 백엔드 시딩에 활용
export const SEED_DATA = {
  tarotDeck: MockDataGenerator.getInstance().getTarotDeck(),
  sampleUsers: MockDataGenerator.getInstance().generateUsers(100),
  sampleReadings: MockDataGenerator.getInstance().generateSampleReadings(1000)
};
```

## 🧪 Testing Strategy

### 1. Service Interface Compliance
```typescript
// 모든 서비스 구현체가 동일한 인터페이스를 준수하는지 테스트
describe('Service Interface Compliance', () => {
  const testConfigs = [
    { mode: 'mock', service: MockTarotService },
    { mode: 'real', service: RealTarotService }
  ];

  testConfigs.forEach(({ mode, service }) => {
    test(`${mode} service implements TarotService correctly`, async () => {
      const serviceInstance = new service(testConfig);
      
      // 인터페이스 메서드 존재 확인
      expect(serviceInstance.getDailyCards).toBeDefined();
      expect(serviceInstance.createSpreadReading).toBeDefined();
      // ... 모든 메서드 검증
    });
  });
});
```

### 2. Data Format Consistency
```typescript
// Mock과 Real API 응답 형식 일치 확인
test('Mock and Real services return consistent data formats', async () => {
  const mockService = new MockTarotService();
  const realService = new RealTarotService();
  
  const mockResponse = await mockService.getDailyCards('2024-01-15');
  const realResponse = await realService.getDailyCards('2024-01-15');
  
  // 응답 구조 동일성 검증
  expect(mockResponse.success).toBe(realResponse.success);
  if (mockResponse.success && realResponse.success) {
    expect(mockResponse.data).toMatchSchema(dailyReadingSchema);
    expect(realResponse.data).toMatchSchema(dailyReadingSchema);
  }
});
```

## 🚀 Migration Checklist

### Pre-Migration
- [ ] API 스펙 문서화 완료
- [ ] Real Service 구현체 작성
- [ ] 환경별 설정 파일 준비
- [ ] 백엔드 API 엔드포인트 준비
- [ ] 데이터 마이그레이션 스크립트 작성

### Migration Process
- [ ] Hybrid 모드로 점진적 전환
- [ ] 서비스별 개별 검증
- [ ] 성능 및 안정성 테스트
- [ ] 에러 핸들링 검증
- [ ] 캐싱 및 오프라인 지원 확인

### Post-Migration
- [ ] 모니터링 및 로깅 설정
- [ ] 성능 메트릭 수집
- [ ] 사용자 피드백 수집
- [ ] 최적화 및 개선 사항 적용

## 📈 Performance Considerations

### 1. Caching Strategy
```typescript
// Real API에서 캐싱 적용
export class RealTarotService implements TarotService {
  private cache = new Map<string, { data: any; timestamp: number }>();
  
  async getDailyCards(date: string): Promise<ApiResponse<DailyTarotReading | null>> {
    const cacheKey = `daily-cards-${date}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_CONFIG.ttlByService.tarot.dailyCards) {
      return { success: true, data: cached.data };
    }
    
    // API 호출 및 캐시 저장
    const response = await this.fetchFromAPI(`/tarot/daily-cards?date=${date}`);
    this.cache.set(cacheKey, { data: response.data, timestamp: Date.now() });
    
    return response;
  }
}
```

### 2. Offline Support
```typescript
// 오프라인 지원을 위한 데이터 로컬 저장
export class RealTarotService implements TarotService {
  private storage = new MMKVStorage();
  
  async getDailyCards(date: string): Promise<ApiResponse<DailyTarotReading | null>> {
    try {
      const response = await this.fetchFromAPI(`/tarot/daily-cards?date=${date}`);
      // 성공 시 로컬 저장
      await this.storage.setObject(`daily-cards-${date}`, response.data);
      return response;
    } catch (error) {
      // 실패 시 로컬 데이터 사용
      const cachedData = await this.storage.getObject(`daily-cards-${date}`);
      if (cachedData) {
        return { success: true, data: cachedData };
      }
      return this.handleError(error);
    }
  }
}
```

## 🔒 Security Considerations

### 1. Authentication Integration
```typescript
// JWT 토큰 기반 인증
export class RealUserService implements UserService {
  private authToken?: string;
  
  async login(email: string, password: string): Promise<ApiResponse<AuthResponse>> {
    const response = await fetch(`${this.config.apiBaseUrl}/auth/login`, {
      method: 'POST',
      headers: HTTP_HEADERS,
      body: JSON.stringify({ email, password })
    });
    
    if (response.ok) {
      const { accessToken, refreshToken } = await response.json();
      this.authToken = accessToken;
      // 토큰 저장
      await SecureStore.setItemAsync(AUTH_CONFIG.tokenKey, accessToken);
      await SecureStore.setItemAsync(AUTH_CONFIG.refreshTokenKey, refreshToken);
    }
    
    return this.handleResponse(response);
  }
  
  private getAuthHeaders(): Record<string, string> {
    return this.authToken 
      ? { ...HTTP_HEADERS, Authorization: `${AUTH_CONFIG.tokenPrefix} ${this.authToken}` }
      : HTTP_HEADERS;
  }
}
```

### 2. Data Encryption
```typescript
// 민감한 데이터 암호화
const encryptSensitiveData = (data: any): string => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
};

const decryptSensitiveData = (encryptedData: string): any => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};
```

## ✅ Success Metrics

### Technical Metrics
- **Zero Breaking Changes**: 클라이언트 코드 수정 없이 전환 완료
- **Performance**: API 응답 시간 < 200ms (95th percentile)
- **Reliability**: 99.9% 가용성, < 0.1% 에러율
- **Data Consistency**: Mock과 Real API 데이터 형식 100% 일치

### Business Metrics  
- **User Experience**: 전환 과정에서 사용자 불편 최소화
- **Development Speed**: 기능 개발 속도 유지
- **Maintenance Cost**: 코드 중복 최소화, 유지보수 효율성

---

**결론**: 이 전환 가이드를 따르면 Mock 데이터에서 실제 API로 원활하고 안전한 마이그레이션이 가능합니다. 서비스 팩토리 패턴과 인터페이스 추상화를 통해 클라이언트 코드 변경 없이 백엔드 전환을 완료할 수 있습니다.