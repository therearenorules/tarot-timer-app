/**
 * 서비스 팩토리 구현
 * Mock/Real API 구현체를 런타임에 결정하고 의존성 주입을 관리
 */

import {
  TarotService,
  UserService,
  JournalService,
  SettingsService,
  ServiceConfig,
  ServiceInitResult,
  ServiceHealthCheck,
  ServiceError,
} from '../interfaces';

// Mock 구현체들
import { MockTarotService } from '../mock/MockTarotService';
import { MockUserService } from '../mock/MockUserService';
import { MockJournalService } from '../mock/MockJournalService';
import { MockSettingsService } from '../mock/MockSettingsService';

// Real 구현체들 (향후 구현)
// import { RealTarotService } from '../real/RealTarotService';
// import { RealUserService } from '../real/RealUserService';
// import { RealJournalService } from '../real/RealJournalService';
// import { RealSettingsService } from '../real/RealSettingsService';

// 설정
import { API_CONFIG } from '../../config/apiConfig';

/**
 * 서비스 팩토리 - 싱글톤 패턴
 * 앱 전체에서 일관된 서비스 인스턴스를 제공
 */
export class ServiceFactory {
  private static instance: ServiceFactory;
  private services: Map<string, any> = new Map();
  private config: ServiceConfig;
  private isInitialized = false;

  private constructor(config: ServiceConfig) {
    this.config = config;
  }

  /**
   * 팩토리 인스턴스 가져오기
   */
  static getInstance(config?: ServiceConfig): ServiceFactory {
    if (!ServiceFactory.instance) {
      if (!config) {
        throw new Error('ServiceFactory requires config on first initialization');
      }
      ServiceFactory.instance = new ServiceFactory(config);
    }
    return ServiceFactory.instance;
  }

  /**
   * 서비스 팩토리 초기화
   * 설정에 따라 Mock 또는 Real 구현체를 등록
   */
  async initialize(): Promise<ServiceInitResult> {
    if (this.isInitialized) {
      return {
        success: true,
        initializedServices: Array.from(this.services.keys()),
        failedServices: [],
        errors: [],
      };
    }

    const results: ServiceInitResult = {
      success: true,
      initializedServices: [],
      failedServices: [],
      errors: [],
    };

    try {
      // 설정에 따른 서비스 구현체 결정
      await this.initializeServices(results);
      
      // 서비스 간 의존성 설정
      await this.setupServiceDependencies();
      
      // 초기화 완료
      this.isInitialized = true;
      
      console.log(`🔮 ServiceFactory initialized in ${this.config.mode} mode`);
      console.log(`📋 Services: ${results.initializedServices.join(', ')}`);
      
    } catch (error) {
      results.success = false;
      results.errors.push(error instanceof Error ? error.message : 'Unknown error');
      console.error('❌ ServiceFactory initialization failed:', error);
    }

    return results;
  }

  /**
   * 설정에 따른 서비스 구현체 초기화
   */
  private async initializeServices(results: ServiceInitResult): Promise<void> {
    const serviceConfigs = [
      { name: 'tarot', factory: () => this.createTarotService() },
      { name: 'user', factory: () => this.createUserService() },
      { name: 'journal', factory: () => this.createJournalService() },
      { name: 'settings', factory: () => this.createSettingsService() },
    ];

    for (const { name, factory } of serviceConfigs) {
      try {
        const service = await factory();
        this.services.set(name, service);
        results.initializedServices.push(name);
        
        // Mock 모드에서는 초기 데이터 로드
        if (this.config.mode === 'mock' && 'initializeData' in service) {
          await (service as any).initializeData();
        }
        
      } catch (error) {
        results.failedServices.push(name);
        results.errors.push(`Failed to initialize ${name}: ${error}`);
        console.error(`❌ Failed to initialize ${name} service:`, error);
      }
    }
  }

  /**
   * 서비스 간 의존성 설정
   */
  private async setupServiceDependencies(): Promise<void> {
    // 예: Journal 서비스가 Tarot 서비스에 의존하는 경우
    const journalService = this.services.get('journal');
    const tarotService = this.services.get('tarot');
    
    if (journalService && tarotService && 'setTarotService' in journalService) {
      (journalService as any).setTarotService(tarotService);
    }
  }

  /**
   * 타로 서비스 생성
   */
  private async createTarotService(): Promise<TarotService> {
    switch (this.config.mode) {
      case 'mock':
        return new MockTarotService({
          generateNetworkDelay: true,
          persistData: true,
          seedBasedGeneration: true,
        });
        
      case 'real':
        // return new RealTarotService(this.config);
        throw new Error('RealTarotService not yet implemented');
        
      case 'hybrid':
        // 특정 조건에 따라 Mock/Real 결정
        return __DEV__ 
          ? new MockTarotService({ generateNetworkDelay: true })
          : new MockTarotService({ generateNetworkDelay: false }); // TODO: RealTarotService
        
      default:
        throw new Error(`Unknown service mode: ${this.config.mode}`);
    }
  }

  /**
   * 사용자 서비스 생성
   */
  private async createUserService(): Promise<UserService> {
    switch (this.config.mode) {
      case 'mock':
        return new MockUserService({
          enableAuthentication: true,
          enablePremiumFeatures: true,
        });
        
      case 'real':
        // return new RealUserService(this.config);
        throw new Error('RealUserService not yet implemented');
        
      case 'hybrid':
        return new MockUserService({ enableAuthentication: false });
        
      default:
        throw new Error(`Unknown service mode: ${this.config.mode}`);
    }
  }

  /**
   * 저널 서비스 생성
   */
  private async createJournalService(): Promise<JournalService> {
    switch (this.config.mode) {
      case 'mock':
        return new MockJournalService({
          generateSampleEntries: __DEV__,
          enableSearch: true,
        });
        
      case 'real':
        // return new RealJournalService(this.config);
        throw new Error('RealJournalService not yet implemented');
        
      case 'hybrid':
        return new MockJournalService({ generateSampleEntries: false });
        
      default:
        throw new Error(`Unknown service mode: ${this.config.mode}`);
    }
  }

  /**
   * 설정 서비스 생성
   */
  private async createSettingsService(): Promise<SettingsService> {
    switch (this.config.mode) {
      case 'mock':
        return new MockSettingsService({
          persistSettings: true,
        });
        
      case 'real':
        // return new RealSettingsService(this.config);
        throw new Error('RealSettingsService not yet implemented');
        
      case 'hybrid':
        return new MockSettingsService({ persistSettings: true });
        
      default:
        throw new Error(`Unknown service mode: ${this.config.mode}`);
    }
  }

  // ===== Public Service Getters =====

  /**
   * 타로 서비스 가져오기
   */
  getTarotService(): TarotService {
    const service = this.services.get('tarot');
    if (!service) {
      throw new Error('TarotService not initialized. Call initialize() first.');
    }
    return service as TarotService;
  }

  /**
   * 사용자 서비스 가져오기
   */
  getUserService(): UserService {
    const service = this.services.get('user');
    if (!service) {
      throw new Error('UserService not initialized. Call initialize() first.');
    }
    return service as UserService;
  }

  /**
   * 저널 서비스 가져오기
   */
  getJournalService(): JournalService {
    const service = this.services.get('journal');
    if (!service) {
      throw new Error('JournalService not initialized. Call initialize() first.');
    }
    return service as JournalService;
  }

  /**
   * 설정 서비스 가져오기
   */
  getSettingsService(): SettingsService {
    const service = this.services.get('settings');
    if (!service) {
      throw new Error('SettingsService not initialized. Call initialize() first.');
    }
    return service as SettingsService;
  }

  // ===== Service Registration (의존성 주입) =====

  /**
   * 타로 서비스 등록 (테스트용)
   */
  registerTarotService(service: TarotService): void {
    this.services.set('tarot', service);
  }

  /**
   * 사용자 서비스 등록 (테스트용)
   */
  registerUserService(service: UserService): void {
    this.services.set('user', service);
  }

  /**
   * 저널 서비스 등록 (테스트용)
   */
  registerJournalService(service: JournalService): void {
    this.services.set('journal', service);
  }

  /**
   * 설정 서비스 등록 (테스트용)
   */
  registerSettingsService(service: SettingsService): void {
    this.services.set('settings', service);
  }

  // ===== Health Check & Monitoring =====

  /**
   * 모든 서비스의 건강 상태 체크
   */
  async checkAllServicesHealth(): Promise<ServiceHealthCheck[]> {
    const healthChecks: ServiceHealthCheck[] = [];
    
    for (const [serviceName, service] of this.services.entries()) {
      try {
        const startTime = Date.now();
        
        // 각 서비스의 health check 메서드 호출 (있다면)
        let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
        
        if ('healthCheck' in service) {
          const result = await (service as any).healthCheck();
          status = result.status || 'healthy';
        }
        
        const responseTime = Date.now() - startTime;
        
        healthChecks.push({
          serviceName,
          status,
          responseTime,
          lastChecked: new Date(),
          details: {
            mode: this.config.mode,
            initialized: true,
          },
        });
        
      } catch (error) {
        healthChecks.push({
          serviceName,
          status: 'unhealthy',
          responseTime: 0,
          lastChecked: new Date(),
          details: {
            error: error instanceof Error ? error.message : 'Unknown error',
            mode: this.config.mode,
          },
        });
      }
    }
    
    return healthChecks;
  }

  /**
   * 특정 서비스의 건강 상태 체크
   */
  async checkServiceHealth(serviceName: string): Promise<ServiceHealthCheck> {
    const service = this.services.get(serviceName);
    
    if (!service) {
      return {
        serviceName,
        status: 'unhealthy',
        responseTime: 0,
        lastChecked: new Date(),
        details: { error: 'Service not found' },
      };
    }
    
    try {
      const startTime = Date.now();
      
      let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
      
      if ('healthCheck' in service) {
        const result = await (service as any).healthCheck();
        status = result.status || 'healthy';
      }
      
      const responseTime = Date.now() - startTime;
      
      return {
        serviceName,
        status,
        responseTime,
        lastChecked: new Date(),
        details: {
          mode: this.config.mode,
          initialized: true,
        },
      };
      
    } catch (error) {
      return {
        serviceName,
        status: 'unhealthy',
        responseTime: 0,
        lastChecked: new Date(),
        details: {
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }

  // ===== Utility Methods =====

  /**
   * 현재 설정 조회
   */
  getConfig(): ServiceConfig {
    return { ...this.config };
  }

  /**
   * 초기화 상태 조회
   */
  isServiceFactoryInitialized(): boolean {
    return this.isInitialized;
  }

  /**
   * 등록된 서비스 목록 조회
   */
  getRegisteredServices(): string[] {
    return Array.from(this.services.keys());
  }

  /**
   * 서비스 팩토리 재시작 (테스트용)
   */
  async restart(newConfig?: ServiceConfig): Promise<ServiceInitResult> {
    this.services.clear();
    this.isInitialized = false;
    
    if (newConfig) {
      this.config = newConfig;
    }
    
    return await this.initialize();
  }

  /**
   * 서비스 팩토리 종료
   */
  async shutdown(): Promise<void> {
    for (const [serviceName, service] of this.services.entries()) {
      try {
        if ('shutdown' in service) {
          await (service as any).shutdown();
        }
      } catch (error) {
        console.error(`❌ Error shutting down ${serviceName}:`, error);
      }
    }
    
    this.services.clear();
    this.isInitialized = false;
    
    console.log('🔮 ServiceFactory shut down successfully');
  }
}

// ===== 편의 함수들 =====

/**
 * 기본 설정으로 서비스 팩토리 초기화
 */
export async function initializeServices(config?: Partial<ServiceConfig>): Promise<ServiceInitResult> {
  const defaultConfig: ServiceConfig = {
    mode: API_CONFIG.mode as 'mock' | 'real' | 'hybrid',
    apiBaseUrl: API_CONFIG.baseUrl,
    timeout: API_CONFIG.timeout,
    retryAttempts: API_CONFIG.retries,
    cacheEnabled: true,
    offlineSupport: true,
  };
  
  const finalConfig = { ...defaultConfig, ...config };
  const factory = ServiceFactory.getInstance(finalConfig);
  
  return await factory.initialize();
}

/**
 * 서비스 팩토리 인스턴스 가져오기 (편의 함수)
 */
export function getServices() {
  const factory = ServiceFactory.getInstance();
  
  return {
    tarot: factory.getTarotService(),
    user: factory.getUserService(),
    journal: factory.getJournalService(),
    settings: factory.getSettingsService(),
  };
}

/**
 * 전체 서비스 건강 상태 체크 (편의 함수)
 */
export async function checkServicesHealth(): Promise<ServiceHealthCheck[]> {
  const factory = ServiceFactory.getInstance();
  return await factory.checkAllServicesHealth();
}