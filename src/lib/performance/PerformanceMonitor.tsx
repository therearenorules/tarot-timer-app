/**
 * 종합 성능 모니터링 시스템
 * React Native 앱의 성능 지표를 실시간으로 측정하고 분석합니다.
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '@/constants';
import MemoryOptimizer from './MemoryOptimizer';

interface PerformanceMetrics {
  // 렌더링 성능
  fps: number;
  averageFps: number;
  renderTime: number;
  
  // 메모리 사용량
  memoryUsage: number;
  memoryPeak: number;
  memoryAverage: number;
  
  // 네트워크 성능
  apiResponseTimes: number[];
  averageApiTime: number;
  
  // 배터리 및 CPU
  cpuUsage?: number;
  batteryLevel?: number;
  thermalState?: string;
  
  // 번들 및 로딩
  bundleLoadTime: number;
  componentLoadTimes: Map<string, number>;
  
  // 사용자 인터랙션
  touchResponseTime: number;
  navigationTime: number;
  
  // 타임스탬프
  timestamp: number;
}

interface PerformanceAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  metric: keyof PerformanceMetrics;
  message: string;
  threshold: number;
  currentValue: number;
  timestamp: number;
}

interface PerformanceMonitorProps {
  enabled?: boolean;
  showOverlay?: boolean;
  alertThresholds?: Partial<Record<keyof PerformanceMetrics, number>>;
  onAlert?: (alert: PerformanceAlert) => void;
  children: React.ReactNode;
}

class PerformanceTracker {
  private static instance: PerformanceTracker;
  private metrics: PerformanceMetrics[] = [];
  private currentMetrics: Partial<PerformanceMetrics> = {};
  private alerts: PerformanceAlert[] = [];
  private frameId: number | null = null;
  private lastFrameTime = performance.now();
  private frameCount = 0;
  private fpsSamples: number[] = [];
  private memoryOptimizer = MemoryOptimizer.getInstance();
  
  private alertCallbacks: Array<(alert: PerformanceAlert) => void> = [];
  
  private readonly defaultThresholds = {
    fps: 30, // 30 FPS 이하 시 경고
    memoryUsage: 80, // 80% 이상 시 경고
    renderTime: 16.67, // 16.67ms 이상 시 경고 (60fps 기준)
    averageApiTime: 2000, // 2초 이상 시 경고
    touchResponseTime: 100, // 100ms 이상 시 경고
  };

  private constructor() {
    this.initializeTracking();
  }

  static getInstance(): PerformanceTracker {
    if (!PerformanceTracker.instance) {
      PerformanceTracker.instance = new PerformanceTracker();
    }
    return PerformanceTracker.instance;
  }

  private initializeTracking(): void {
    this.startFpsTracking();
    this.startMemoryTracking();
    this.startBatteryTracking();
    this.setupPerformanceObserver();
  }

  /**
   * FPS 추적 시작
   */
  private startFpsTracking(): void {
    const trackFrame = (currentTime: number) => {
      const delta = currentTime - this.lastFrameTime;
      this.frameCount++;
      
      if (delta >= 1000) { // 1초마다 FPS 계산
        const fps = Math.round((this.frameCount * 1000) / delta);
        this.fpsSamples.push(fps);
        
        // 최근 10개 샘플 평균
        if (this.fpsSamples.length > 10) {
          this.fpsSamples = this.fpsSamples.slice(-10);
        }
        
        const averageFps = this.fpsSamples.reduce((a, b) => a + b, 0) / this.fpsSamples.length;
        
        this.updateMetric('fps', fps);
        this.updateMetric('averageFps', Math.round(averageFps));
        
        this.frameCount = 0;\n        this.lastFrameTime = currentTime;
        
        // FPS 경고 체크
        if (fps < this.defaultThresholds.fps) {
          this.createAlert('warning', 'fps', `낮은 FPS 감지: ${fps}`, this.defaultThresholds.fps, fps);
        }
      }
      
      this.frameId = requestAnimationFrame(trackFrame);
    };
    
    this.frameId = requestAnimationFrame(trackFrame);
  }

  /**
   * 메모리 사용량 추적
   */
  private startMemoryTracking(): void {
    setInterval(() => {
      const memoryStats = this.memoryOptimizer.getCurrentMemoryStats();
      if (memoryStats) {
        this.updateMetric('memoryUsage', Math.round(memoryStats.usage));
        
        // 메모리 경고 체크
        if (memoryStats.usage > this.defaultThresholds.memoryUsage) {
          this.createAlert('warning', 'memoryUsage', `높은 메모리 사용량: ${Math.round(memoryStats.usage)}%`, this.defaultThresholds.memoryUsage, memoryStats.usage);
        }
      }
    }, 2000);
  }

  /**
   * 배터리 상태 추적
   */
  private async startBatteryTracking(): Promise<void> {
    try {
      if ('getBattery' in navigator) {
        const battery = await (navigator as any).getBattery();
        
        const updateBatteryInfo = () => {
          this.updateMetric('batteryLevel', Math.round(battery.level * 100));
        };
        
        battery.addEventListener('levelchange', updateBatteryInfo);
        updateBatteryInfo();
      }
    } catch (error) {
      console.warn('배터리 API를 사용할 수 없습니다:', error);
    }
  }

  /**
   * Performance Observer 설정
   */
  private setupPerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      try {
        // 네비게이션 시간 측정
        const navObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.entryType === 'navigation') {
              this.updateMetric('bundleLoadTime', entry.duration);
            }
          });
        });
        navObserver.observe({ entryTypes: ['navigation'] });

        // 리소스 로딩 시간 측정
        const resourceObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry) => {
            if (entry.name.includes('component') || entry.name.includes('chunk')) {
              this.currentMetrics.componentLoadTimes = this.currentMetrics.componentLoadTimes || new Map();
              this.currentMetrics.componentLoadTimes.set(entry.name, entry.duration);
            }
          });
        });
        resourceObserver.observe({ entryTypes: ['resource'] });
        
      } catch (error) {
        console.warn('Performance Observer를 설정할 수 없습니다:', error);
      }
    }
  }

  /**
   * 메트릭 업데이트
   */
  private updateMetric<K extends keyof PerformanceMetrics>(key: K, value: PerformanceMetrics[K]): void {
    this.currentMetrics[key] = value;
    this.currentMetrics.timestamp = Date.now();
  }

  /**
   * API 응답 시간 추적
   */
  trackApiCall(name: string, startTime: number, endTime: number): void {
    const responseTime = endTime - startTime;
    
    if (!this.currentMetrics.apiResponseTimes) {
      this.currentMetrics.apiResponseTimes = [];
    }
    
    this.currentMetrics.apiResponseTimes.push(responseTime);
    
    // 최근 10개 호출의 평균
    if (this.currentMetrics.apiResponseTimes.length > 10) {
      this.currentMetrics.apiResponseTimes = this.currentMetrics.apiResponseTimes.slice(-10);
    }
    
    const averageTime = this.currentMetrics.apiResponseTimes.reduce((a, b) => a + b, 0) / this.currentMetrics.apiResponseTimes.length;
    this.updateMetric('averageApiTime', averageTime);
    
    // API 응답 시간 경고
    if (responseTime > this.defaultThresholds.averageApiTime) {
      this.createAlert('warning', 'averageApiTime', `느린 API 응답: ${name} (${responseTime.toFixed(2)}ms)`, this.defaultThresholds.averageApiTime, responseTime);
    }
  }

  /**
   * 터치 응답 시간 추적
   */
  trackTouchResponse(startTime: number, endTime: number): void {
    const responseTime = endTime - startTime;
    this.updateMetric('touchResponseTime', responseTime);
    
    if (responseTime > this.defaultThresholds.touchResponseTime) {
      this.createAlert('warning', 'touchResponseTime', `느린 터치 응답: ${responseTime.toFixed(2)}ms`, this.defaultThresholds.touchResponseTime, responseTime);
    }
  }

  /**
   * 렌더링 시간 추적
   */
  trackRenderTime(componentName: string, renderTime: number): void {
    this.updateMetric('renderTime', renderTime);
    
    if (renderTime > this.defaultThresholds.renderTime) {
      this.createAlert('warning', 'renderTime', `느린 렌더링: ${componentName} (${renderTime.toFixed(2)}ms)`, this.defaultThresholds.renderTime, renderTime);
    }
  }

  /**
   * 경고 생성
   */
  private createAlert(
    type: PerformanceAlert['type'],
    metric: keyof PerformanceMetrics,
    message: string,
    threshold: number,
    currentValue: number
  ): void {
    const alert: PerformanceAlert = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      metric,
      message,
      threshold,
      currentValue,
      timestamp: Date.now(),
    };
    
    this.alerts.push(alert);
    
    // 최근 100개 경고만 유지
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }
    
    // 콜백 실행
    this.alertCallbacks.forEach(callback => callback(alert));
  }

  /**
   * 경고 콜백 등록
   */
  onAlert(callback: (alert: PerformanceAlert) => void): () => void {
    this.alertCallbacks.push(callback);
    
    return () => {
      const index = this.alertCallbacks.indexOf(callback);
      if (index > -1) {
        this.alertCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * 현재 메트릭 조회
   */
  getCurrentMetrics(): Partial<PerformanceMetrics> {
    return { ...this.currentMetrics };
  }

  /**
   * 성능 보고서 생성
   */
  generateReport(): {
    metrics: Partial<PerformanceMetrics>;
    alerts: PerformanceAlert[];
    recommendations: string[];
    score: number; // 0-100
  } {
    const recommendations: string[] = [];
    let score = 100;

    const metrics = this.getCurrentMetrics();
    
    // FPS 평가
    if (metrics.averageFps && metrics.averageFps < 45) {
      recommendations.push('렌더링 성능 최적화가 필요합니다. React.memo와 useMemo 사용을 고려해보세요.');
      score -= 15;
    }
    
    // 메모리 평가
    if (metrics.memoryUsage && metrics.memoryUsage > 70) {
      recommendations.push('메모리 사용량이 높습니다. 메모리 누수를 점검하고 불필요한 데이터를 정리해보세요.');
      score -= 20;
    }
    
    // API 성능 평가
    if (metrics.averageApiTime && metrics.averageApiTime > 1500) {
      recommendations.push('API 응답 시간이 느립니다. 캐싱이나 요청 최적화를 고려해보세요.');
      score -= 10;
    }
    
    // 렌더링 시간 평가
    if (metrics.renderTime && metrics.renderTime > 12) {
      recommendations.push('컴포넌트 렌더링 시간이 깁니다. 복잡한 계산을 useMemo로 최적화해보세요.');
      score -= 10;
    }

    return {
      metrics,
      alerts: this.alerts.slice(-20), // 최근 20개 경고
      recommendations,
      score: Math.max(0, score),
    };
  }

  /**
   * 추적 정지
   */
  stopTracking(): void {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }
}

/**
 * 성능 모니터 컴포넌트
 */
export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  enabled = __DEV__,
  showOverlay = false,
  alertThresholds,
  onAlert,
  children,
}) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(showOverlay);
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});
  const [alerts, setAlerts] = useState<PerformanceAlert[]>([]);
  const tracker = useRef(PerformanceTracker.getInstance());

  useEffect(() => {
    if (!enabled) return;

    const updateMetrics = () => {
      setMetrics(tracker.current.getCurrentMetrics());
    };

    const alertUnsubscribe = tracker.current.onAlert((alert) => {
      setAlerts(prev => [...prev.slice(-19), alert]); // 최근 20개 유지
      onAlert?.(alert);
    });

    // 메트릭 업데이트 주기
    const interval = setInterval(updateMetrics, 1000);

    return () => {
      clearInterval(interval);
      alertUnsubscribe();
    };
  }, [enabled, onAlert]);

  const toggleOverlay = useCallback(() => {
    setIsOverlayVisible(!isOverlayVisible);
  }, [isOverlayVisible]);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      
      {/* 성능 모니터 오버레이 토글 버튼 */}
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={toggleOverlay}
        accessibilityLabel="성능 모니터 토글"
      >
        <Text style={styles.toggleButtonText}>📊</Text>
      </TouchableOpacity>

      {/* 성능 모니터 오버레이 */}
      <Modal
        visible={isOverlayVisible}
        transparent
        animationType="slide"
        onRequestClose={toggleOverlay}
      >
        <View style={styles.overlay}>
          <View style={styles.panel}>
            <View style={styles.header}>
              <Text style={styles.title}>성능 모니터</Text>
              <TouchableOpacity onPress={toggleOverlay} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.content}>
              {/* 메트릭 표시 */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>실시간 메트릭</Text>
                <View style={styles.metricsGrid}>
                  <MetricItem label="FPS" value={`${metrics.fps || 0}`} />
                  <MetricItem label="평균 FPS" value={`${metrics.averageFps || 0}`} />
                  <MetricItem label="메모리" value={`${metrics.memoryUsage || 0}%`} />
                  <MetricItem label="렌더링" value={`${(metrics.renderTime || 0).toFixed(1)}ms`} />
                  <MetricItem label="API 응답" value={`${(metrics.averageApiTime || 0).toFixed(0)}ms`} />
                  <MetricItem label="터치 응답" value={`${(metrics.touchResponseTime || 0).toFixed(0)}ms`} />
                </View>
              </View>

              {/* 경고 표시 */}
              {alerts.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>최근 경고 ({alerts.length})</Text>
                  {alerts.slice(-5).map((alert) => (
                    <View key={alert.id} style={[styles.alert, styles[`alert${alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}`]]}>
                      <Text style={styles.alertText}>{alert.message}</Text>
                      <Text style={styles.alertTime}>
                        {new Date(alert.timestamp).toLocaleTimeString()}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const MetricItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.metricItem}>
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={styles.metricValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  toggleButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.premiumGold + '90',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  toggleButtonText: {
    fontSize: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  panel: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    width: '100%',
    maxHeight: '80%',
    borderWidth: 2,
    borderColor: theme.colors.mystical.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.premiumGold,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  content: {
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  metricItem: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    minWidth: 80,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.premiumGold,
  },
  alert: {
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 4,
  },
  alertWarning: {
    backgroundColor: '#FFF3CD',
    borderLeftColor: '#FFB020',
  },
  alertError: {
    backgroundColor: '#F8D7DA',
    borderLeftColor: '#DC3545',
  },
  alertInfo: {
    backgroundColor: '#D1ECF1',
    borderLeftColor: '#17A2B8',
  },
  alertText: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 4,
  },
  alertTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
});

export default PerformanceTracker;