/**
 * 메모리 최적화 유틸리티
 * React Native 앱의 메모리 사용량을 모니터링하고 최적화합니다.
 */

interface MemoryStats {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  usage: number; // 백분율
  timestamp: number;
}

interface ComponentMemoryTracker {
  componentName: string;
  mountCount: number;
  unmountCount: number;
  averageMemoryImpact: number;
  lastMeasured: number;
}

class MemoryOptimizer {
  private static instance: MemoryOptimizer;
  private memoryHistory: MemoryStats[] = [];
  private componentTrackers = new Map<string, ComponentMemoryTracker>();
  private memoryWarningThreshold = 80; // 80% 사용 시 경고
  private memoryCleanupThreshold = 90; // 90% 사용 시 강제 정리
  private maxHistorySize = 100;
  
  private constructor() {
    this.startMemoryMonitoring();
  }

  static getInstance(): MemoryOptimizer {
    if (!MemoryOptimizer.instance) {
      MemoryOptimizer.instance = new MemoryOptimizer();
    }
    return MemoryOptimizer.instance;
  }

  /**
   * 현재 메모리 상태 측정
   */
  getCurrentMemoryStats(): MemoryStats | null {
    if (typeof performance === 'undefined' || !performance.memory) {
      return null;
    }

    const memory = performance.memory;
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100,
      timestamp: Date.now(),
    };
  }

  /**
   * 메모리 모니터링 시작
   */
  private startMemoryMonitoring(): void {
    setInterval(() => {
      const stats = this.getCurrentMemoryStats();
      if (stats) {
        this.recordMemoryStats(stats);
        this.checkMemoryThresholds(stats);
      }
    }, 5000); // 5초마다 체크
  }

  /**
   * 메모리 통계 기록
   */
  private recordMemoryStats(stats: MemoryStats): void {
    this.memoryHistory.push(stats);
    
    // 히스토리 크기 제한
    if (this.memoryHistory.length > this.maxHistorySize) {
      this.memoryHistory = this.memoryHistory.slice(-this.maxHistorySize);
    }
  }

  /**
   * 메모리 임계값 체크
   */
  private checkMemoryThresholds(stats: MemoryStats): void {
    if (stats.usage >= this.memoryCleanupThreshold) {
      console.warn('🚨 메모리 사용량이 임계치를 초과했습니다. 강제 정리를 실행합니다.');
      this.performEmergencyCleanup();
    } else if (stats.usage >= this.memoryWarningThreshold) {
      console.warn('⚠️ 메모리 사용량이 높습니다. 정리를 권장합니다.');
      this.performGentleCleanup();
    }
  }

  /**
   * 컴포넌트 메모리 추적 시작
   */
  trackComponent(componentName: string): void {
    if (!this.componentTrackers.has(componentName)) {
      this.componentTrackers.set(componentName, {
        componentName,
        mountCount: 0,
        unmountCount: 0,
        averageMemoryImpact: 0,
        lastMeasured: Date.now(),
      });
    }

    const tracker = this.componentTrackers.get(componentName)!;
    tracker.mountCount++;
    tracker.lastMeasured = Date.now();
  }

  /**
   * 컴포넌트 언마운트 추적
   */
  untrackComponent(componentName: string): void {
    const tracker = this.componentTrackers.get(componentName);
    if (tracker) {
      tracker.unmountCount++;
    }
  }

  /**
   * 부드러운 메모리 정리
   */
  private performGentleCleanup(): void {
    // 사용되지 않는 컴포넌트 트래커 정리
    const now = Date.now();
    const staleThreshold = 5 * 60 * 1000; // 5분

    for (const [name, tracker] of this.componentTrackers.entries()) {
      if (now - tracker.lastMeasured > staleThreshold && tracker.mountCount === tracker.unmountCount) {
        this.componentTrackers.delete(name);
      }
    }

    // 메모리 히스토리 정리
    if (this.memoryHistory.length > this.maxHistorySize / 2) {
      this.memoryHistory = this.memoryHistory.slice(-this.maxHistorySize / 2);
    }

    // 가비지 컬렉션 제안
    if (global.gc) {
      global.gc();
    }
  }

  /**
   * 응급 메모리 정리
   */
  private performEmergencyCleanup(): void {
    // 모든 추적 데이터 정리
    this.componentTrackers.clear();
    this.memoryHistory = this.memoryHistory.slice(-10); // 최근 10개만 유지

    // 강제 가비지 컬렉션
    if (global.gc) {
      global.gc();
    }

    console.log('💾 응급 메모리 정리가 완료되었습니다.');
  }

  /**
   * 메모리 보고서 생성
   */
  generateMemoryReport(): {
    current: MemoryStats | null;
    average: number;
    peak: number;
    componentsTracked: number;
    recommendations: string[];
  } {
    const current = this.getCurrentMemoryStats();
    const usageHistory = this.memoryHistory.map(stat => stat.usage);
    const average = usageHistory.length > 0 ? usageHistory.reduce((a, b) => a + b, 0) / usageHistory.length : 0;
    const peak = Math.max(...usageHistory, 0);

    const recommendations: string[] = [];
    
    if (average > 70) {
      recommendations.push('평균 메모리 사용량이 높습니다. 컴포넌트 최적화를 고려해보세요.');
    }
    
    if (peak > 85) {
      recommendations.push('피크 메모리 사용량이 높습니다. 큰 데이터 처리 시 청킹을 고려해보세요.');
    }

    const activeComponents = Array.from(this.componentTrackers.values())
      .filter(tracker => tracker.mountCount > tracker.unmountCount).length;

    if (activeComponents > 50) {
      recommendations.push('활성 컴포넌트가 많습니다. 불필요한 컴포넌트를 정리해보세요.');
    }

    return {
      current,
      average,
      peak,
      componentsTracked: this.componentTrackers.size,
      recommendations,
    };
  }

  /**
   * 이미지 캐시 최적화
   */
  optimizeImageCache(): void {
    // React Native Image 캐시 정리 (실제 구현 시 react-native-fast-image 등 사용)
    console.log('🖼️ 이미지 캐시 최적화를 실행했습니다.');
  }

  /**
   * 메모리 리크 감지
   */
  detectMemoryLeaks(): ComponentMemoryTracker[] {
    const potentialLeaks: ComponentMemoryTracker[] = [];
    const now = Date.now();
    const leakThreshold = 10 * 60 * 1000; // 10분

    for (const tracker of this.componentTrackers.values()) {
      // 언마운트되지 않은 오래된 컴포넌트
      if (
        tracker.mountCount > tracker.unmountCount &&
        now - tracker.lastMeasured > leakThreshold
      ) {
        potentialLeaks.push(tracker);
      }
    }

    return potentialLeaks;
  }
}

export default MemoryOptimizer;