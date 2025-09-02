// src/components/dev/PerformanceMonitor.tsx - 개발 전용 성능 모니터링 컴포넌트
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { isDev, tarotDevConfig, performanceUtils } from '@/lib/devMode';
import { theme } from '@/constants';

interface PerformanceData {
  renderCount: number;
  lastRenderTime: number;
  averageRenderTime: number;
  memoryUsage?: number;
}

interface PerformanceMonitorProps {
  componentName: string;
  children: React.ReactNode;
  trackMemory?: boolean;
  logToConsole?: boolean;
}

export function PerformanceMonitor({
  componentName,
  children,
  trackMemory = false,
  logToConsole = true,
}: PerformanceMonitorProps) {
  const [perfData, setPerfData] = useState<PerformanceData>({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
  });
  
  const [showStats, setShowStats] = useState(false);
  const renderTimes = useRef<number[]>([]);
  const lastRenderStart = useRef<number>(0);

  // 개발 모드가 아니면 성능 모니터링 없이 children만 반환
  if (!isDev || !tarotDevConfig.trackComponentRenders) {
    return <>{children}</>;
  }

  useEffect(() => {
    const renderStart = performance.now();
    lastRenderStart.current = renderStart;

    return () => {
      const renderEnd = performance.now();
      const renderTime = renderEnd - renderStart;
      
      // 렌더링 시간 기록
      renderTimes.current.push(renderTime);
      if (renderTimes.current.length > 50) {
        renderTimes.current = renderTimes.current.slice(-50); // 최근 50개만 유지
      }
      
      // 평균 계산
      const average = renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length;
      
      // 메모리 사용량 측정 (웹만)
      let memoryUsage = undefined;
      if (trackMemory && typeof window !== 'undefined' && (window.performance as any)?.memory) {
        const memory = (window.performance as any).memory;
        memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024); // MB
      }
      
      setPerfData({
        renderCount: renderTimes.current.length,
        lastRenderTime: renderTime,
        averageRenderTime: average,
        ...(memoryUsage !== undefined && { memoryUsage }),
      });
      
      // 콘솔 로깅
      if (logToConsole) {
        performanceUtils.logRender(componentName, {
          renderTime: `${renderTime.toFixed(2)}ms`,
          avgTime: `${average.toFixed(2)}ms`,
          renders: renderTimes.current.length,
          ...(memoryUsage && { memory: `${memoryUsage}MB` }),
        });
        
        // 느린 렌더링 경고
        if (renderTime > 50) {
          console.warn(`🐌 [SLOW RENDER] ${componentName}: ${renderTime.toFixed(2)}ms`);
        }
      }
    };
  });

  return (
    <View style={styles.container}>
      {children}
      
      {/* 개발 모드 성능 표시 */}
      <Pressable 
        style={styles.perfButton} 
        onPress={() => setShowStats(!showStats)}
      >
        <Text style={styles.perfButtonText}>⚡</Text>
      </Pressable>
      
      {showStats && (
        <View style={styles.perfOverlay}>
          <Text style={styles.perfTitle}>{componentName}</Text>
          <Text style={styles.perfText}>
            렌더: {perfData.renderCount}회
          </Text>
          <Text style={styles.perfText}>
            마지막: {perfData.lastRenderTime.toFixed(2)}ms
          </Text>
          <Text style={styles.perfText}>
            평균: {perfData.averageRenderTime.toFixed(2)}ms
          </Text>
          {perfData.memoryUsage && (
            <Text style={styles.perfText}>
              메모리: {perfData.memoryUsage}MB
            </Text>
          )}
          
          {/* 성능 상태 표시 */}
          <View style={[
            styles.perfStatus,
            perfData.averageRenderTime < 16 ? styles.perfGood :
            perfData.averageRenderTime < 33 ? styles.perfWarning :
            styles.perfBad
          ]}>
            <Text style={styles.perfStatusText}>
              {perfData.averageRenderTime < 16 ? '좋음' :
               perfData.averageRenderTime < 33 ? '보통' : '느림'}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

// HOC 버전도 제공
export function withPerformanceMonitor<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  componentName?: string,
  options: { trackMemory?: boolean; logToConsole?: boolean } = {}
) {
  const ComponentWithPerformanceMonitor = (props: T) => {
    const name = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Unknown';
    
    return (
      <PerformanceMonitor 
        componentName={name}
        {...(options.trackMemory !== undefined && { trackMemory: options.trackMemory })}
        {...(options.logToConsole !== undefined && { logToConsole: options.logToConsole })}
      >
        <WrappedComponent {...props} />
      </PerformanceMonitor>
    );
  };
  
  ComponentWithPerformanceMonitor.displayName = `withPerformanceMonitor(${name})`;
  return ComponentWithPerformanceMonitor;
}

// 훅 버전
export function usePerformanceTracker(componentName: string) {
  const renderCount = useRef(0);
  const renderTimes = useRef<number[]>([]);
  
  useEffect(() => {
    if (!isDev || !tarotDevConfig.trackComponentRenders) return;
    
    const renderStart = performance.now();
    renderCount.current += 1;
    
    return () => {
      const renderTime = performance.now() - renderStart;
      renderTimes.current.push(renderTime);
      
      performanceUtils.logRender(componentName, {
        renderTime: `${renderTime.toFixed(2)}ms`,
        totalRenders: renderCount.current,
      });
    };
  });
  
  return {
    renderCount: renderCount.current,
    averageRenderTime: renderTimes.current.length > 0 
      ? renderTimes.current.reduce((a, b) => a + b, 0) / renderTimes.current.length 
      : 0,
  };
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  perfButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: theme.colors.premiumGold + '80',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  perfButtonText: {
    fontSize: 12,
    color: theme.colors.deepPurple,
  },
  perfOverlay: {
    position: 'absolute',
    top: 40,
    right: 8,
    backgroundColor: theme.colors.surface,
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.mystical.border,
    minWidth: 120,
    zIndex: 999,
    shadowColor: theme.colors.mystical.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  perfTitle: {
    fontSize: 10,
    fontWeight: '600',
    color: theme.colors.premiumGold,
    marginBottom: 4,
    textAlign: 'center',
  },
  perfText: {
    fontSize: 9,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  perfStatus: {
    marginTop: 4,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
    alignSelf: 'center',
  },
  perfGood: {
    backgroundColor: theme.colors.success + '20',
  },
  perfWarning: {
    backgroundColor: theme.colors.warning + '20',
  },
  perfBad: {
    backgroundColor: theme.colors.error + '20',
  },
  perfStatusText: {
    fontSize: 8,
    fontWeight: '600',
    color: theme.colors.text,
  },
});