// src/lib/lazyComponents.ts - 향상된 lazy 로딩 시스템
import React, { lazy, ComponentType } from 'react';

// 에러 처리가 포함된 lazy 래퍼 함수
const createLazyComponent = <T extends ComponentType<any>>(
  importFunction: () => Promise<{ default: T }>,
  fallbackName: string = 'Component'
) => {
  return lazy(async () => {
    try {
      const module = await importFunction();
      return module;
    } catch (error) {
      console.warn(`Failed to load ${fallbackName}:`, error);
      // 폴백 컴포넌트 반환
      return {
        default: (() => (
          <div style={{ 
            padding: '20px', 
            textAlign: 'center',
            color: '#d4af37',
            backgroundColor: '#1a1f3a',
            borderRadius: '8px',
            border: '1px solid #4a1a4f'
          }}>
            <p>⚠️ {fallbackName} 로딩에 실패했습니다</p>
            <p>페이지를 새로고침해 보세요.</p>
          </div>
        )) as T
      };
    }
  });
};

// 타로 앱 전용 lazy 컴포넌트들
export const SpreadBoard = createLazyComponent(
  () => import('@/features/spreads/SpreadBoard'),
  'SpreadBoard'
);

export const DeckShop = createLazyComponent(
  () => import('@/features/shop/DeckShop'), 
  'DeckShop'
);

// 추가 lazy 컴포넌트들
export const TarotCardDetail = createLazyComponent(
  () => import('@/components/cards/TarotCardDetail'),
  'TarotCardDetail'
);

export const ReadingHistory = createLazyComponent(
  () => import('@/features/history/ReadingHistory'),
  'ReadingHistory'
);

export const SettingsPanel = createLazyComponent(
  () => import('@/features/settings/SettingsPanel'),
  'SettingsPanel'
);

export const CardDatabase = createLazyComponent(
  () => import('@/features/database/CardDatabase'),
  'CardDatabase'
);

export const ThemeCustomizer = createLazyComponent(
  () => import('@/features/themes/ThemeCustomizer'),
  'ThemeCustomizer'
);

export const NotificationCenter = createLazyComponent(
  () => import('@/features/notifications/NotificationCenter'),
  'NotificationCenter'
);

// 성능 모니터링을 위한 lazy 로딩 유틸리티
export const preloadComponent = (component: any) => {
  if (typeof component === 'function') {
    // preload 메서드가 있으면 호출
    component.preload?.();
  }
};

// 여러 컴포넌트를 미리 로드하는 함수
export const preloadComponents = (...components: any[]) => {
  components.forEach(preloadComponent);
};

// 라우트별 프리로드 설정
export const preloadForRoute = (routeName: string) => {
  switch (routeName) {
    case 'spreads':
      preloadComponents(SpreadBoard, TarotCardDetail);
      break;
    case 'shop':
      preloadComponents(DeckShop);
      break;
    case 'history':
      preloadComponents(ReadingHistory, TarotCardDetail);
      break;
    case 'settings':
      preloadComponents(SettingsPanel, ThemeCustomizer, NotificationCenter);
      break;
    default:
      break;
  }
};

/**
 * 번들 크기 최적화 유틸리티
 */
export class BundleOptimizer {
  private static loadedChunks = new Set<string>();
  private static preloadQueue = new Map<string, () => Promise<any>>();

  /**
   * 네트워크 상태에 따른 조건부 로딩
   */
  static async loadByNetworkSpeed<T>(
    chunkName: string,
    highQualityLoader: () => Promise<T>,
    lowQualityLoader: () => Promise<T>
  ): Promise<T> {
    const connection = (navigator as any).connection || (navigator as any).mozConnection;
    const isSlowConnection = connection && (
      connection.effectiveType === 'slow-2g' ||
      connection.effectiveType === '2g' ||
      connection.saveData === true
    );

    const loader = isSlowConnection ? lowQualityLoader : highQualityLoader;
    const result = await loader();
    
    this.loadedChunks.add(chunkName);
    console.log(`📦 ${chunkName} 로딩 완료 (${isSlowConnection ? '저품질' : '고품질'} 모드)`);
    
    return result;
  }

  /**
   * 사용자 인터랙션 기반 프리로딩
   */
  static schedulePreload(chunkName: string, loader: () => Promise<any>): void {
    if (this.loadedChunks.has(chunkName) || this.preloadQueue.has(chunkName)) {
      return;
    }

    this.preloadQueue.set(chunkName, loader);
    
    // 브라우저가 여유로울 때 프리로드
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => this.executePreload(chunkName));
    } else {
      setTimeout(() => this.executePreload(chunkName), 100);
    }
  }

  private static async executePreload(chunkName: string): Promise<void> {
    const loader = this.preloadQueue.get(chunkName);
    if (!loader || this.loadedChunks.has(chunkName)) {
      return;
    }

    try {
      await loader();
      this.loadedChunks.add(chunkName);
      this.preloadQueue.delete(chunkName);
      console.log(`✅ ${chunkName} 프리로드 완료`);
    } catch (error) {
      console.warn(`⚠️ ${chunkName} 프리로드 실패:`, error);
      this.preloadQueue.delete(chunkName);
    }
  }

  /**
   * 메모리 압박 상황에서 청크 해제
   */
  static releaseChunks(priority: 'low' | 'medium' | 'high' = 'low'): void {
    const releaseCandidates = Array.from(this.loadedChunks);
    
    // 우선순위에 따라 해제할 청크 선택
    const chunksToRelease = priority === 'high' 
      ? releaseCandidates.slice(0, Math.floor(releaseCandidates.length * 0.8))
      : priority === 'medium'
      ? releaseCandidates.slice(0, Math.floor(releaseCandidates.length * 0.5))
      : releaseCandidates.slice(0, Math.floor(releaseCandidates.length * 0.2));

    chunksToRelease.forEach(chunk => {
      this.loadedChunks.delete(chunk);
    });

    console.log(`🧹 ${chunksToRelease.length}개 청크 해제 완료 (${priority} 우선순위)`);
  }

  /**
   * 번들 사용량 리포트
   */
  static generateUsageReport(): {
    loadedChunks: string[];
    pendingPreloads: string[];
    totalLoaded: number;
    memoryEstimate: string;
  } {
    return {
      loadedChunks: Array.from(this.loadedChunks),
      pendingPreloads: Array.from(this.preloadQueue.keys()),
      totalLoaded: this.loadedChunks.size,
      memoryEstimate: `~${this.loadedChunks.size * 150}KB`, // 대략적인 추정
    };
  }
}

/**
 * 트리 셰이킹 최적화를 위한 조건부 임포트
 */
export const conditionalImports = {
  // 개발 전용 도구들
  devTools: {
    async loadDevPanel() {
      if (__DEV__) {
        return import('@/components/dev/DevPanel');
      }
      return null;
    },
    
    async loadPerformanceMonitor() {
      if (__DEV__) {
        return import('@/components/dev/PerformanceMonitor');
      }
      return null;
    },
  },
  
  // 플랫폼별 컴포넌트
  platform: {
    async loadWebComponents() {
      if (typeof window !== 'undefined') {
        return import('@/components/web/WebSpecific');
      }
      return null;
    },
    
    async loadNativeComponents() {
      if (typeof window === 'undefined') {
        return import('@/components/native/NativeSpecific');
      }
      return null;
    },
  },
  
  // 기능별 컴포넌트 (사용자 설정에 따라)
  features: {
    async loadAdvancedSpreads(userTier: string) {
      if (userTier === 'premium') {
        return import('@/features/spreads/AdvancedSpreads');
      }
      return null;
    },
    
    async loadAnalytics(analyticsEnabled: boolean) {
      if (analyticsEnabled) {
        return import('@/lib/analytics');
      }
      return null;
    },
  },
};