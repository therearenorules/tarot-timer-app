// src/examples/DevToolsUsage.tsx - 개발 도구 사용 예시
import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { 
  PerformanceMonitor, 
  withPerformanceMonitor, 
  usePerformanceTracker 
} from '@/components/dev/PerformanceMonitor';
import { DevPanel } from '@/components/dev/DevPanel';
import { 
  devLog, 
  devWarn, 
  devError, 
  tarotLog, 
  performanceUtils,
  initDevMode 
} from '@/lib/devMode';
import { theme } from '@/constants';

// 1. 기본 PerformanceMonitor 래핑 예시
function ExampleCardComponent() {
  useEffect(() => {
    // 카드 생성 시뮬레이션
    devLog('카드 컴포넌트 마운트됨');
    tarotLog.cardGenerated('The Fool', new Date().getHours());
  }, []);

  return (
    <PerformanceMonitor 
      componentName="ExampleCard" 
      trackMemory={true}
      logToConsole={true}
    >
      <View style={{ padding: 20, backgroundColor: theme.colors.surface }}>
        <Text style={{ color: theme.colors.text }}>타로 카드 예시</Text>
      </View>
    </PerformanceMonitor>
  );
}

// 2. HOC 사용 예시
const SlowComponent = () => {
  // 의도적으로 느린 연산 추가
  const heavyCalculation = () => {
    let result = 0;
    for (let i = 0; i < 100000; i++) {
      result += Math.random();
    }
    return result;
  };

  const result = heavyCalculation();

  return (
    <View style={{ padding: 20, backgroundColor: theme.colors.surface }}>
      <Text style={{ color: theme.colors.text }}>
        무거운 연산 결과: {result.toFixed(2)}
      </Text>
    </View>
  );
};

const MonitoredSlowComponent = withPerformanceMonitor(
  SlowComponent,
  'SlowComponent',
  { trackMemory: true, logToConsole: true }
);

// 3. 훅 사용 예시
function HookBasedComponent() {
  const { renderCount, averageRenderTime } = usePerformanceTracker('HookComponent');
  
  useEffect(() => {
    devLog(`HookComponent 렌더링 ${renderCount}회, 평균 ${averageRenderTime.toFixed(2)}ms`);
  });

  return (
    <View style={{ padding: 20, backgroundColor: theme.colors.surface }}>
      <Text style={{ color: theme.colors.text }}>
        렌더 횟수: {renderCount}
      </Text>
      <Text style={{ color: theme.colors.textSecondary }}>
        평균 시간: {averageRenderTime.toFixed(2)}ms
      </Text>
    </View>
  );
}

// 4. 타로 시스템 시뮬레이션 예시
function TarotSystemSimulator() {
  useEffect(() => {
    // 개발 모드 초기화
    initDevMode();
    
    // 타로 시스템 이벤트 시뮬레이션
    const simulateEvents = () => {
      // 세션 시작
      tarotLog.sessionStarted('dev-session-001');
      
      // 카드 생성
      setTimeout(() => {
        tarotLog.cardGenerated('The Magician', 14);
        performanceUtils.startTimer('카드 애니메이션');
      }, 1000);
      
      // 애니메이션 완료
      setTimeout(() => {
        performanceUtils.endTimer('카드 애니메이션');
        tarotLog.mysticalEffect('✨ 카드 등장', 1200);
      }, 2200);
      
      // 시간 변경
      setTimeout(() => {
        tarotLog.hourChanged(14, 15);
      }, 5000);
      
      // 경고 및 에러 테스트
      setTimeout(() => {
        devWarn('테스트 경고 메시지');
        devError('테스트 에러 메시지 (무시해도 됨)');
      }, 3000);
    };
    
    simulateEvents();
  }, []);

  return (
    <View style={{ padding: 20, backgroundColor: theme.colors.background }}>
      <Text style={{ 
        color: theme.colors.premiumGold, 
        fontSize: 18, 
        fontWeight: '600',
        marginBottom: 10
      }}>
        🔮 타로 시스템 시뮬레이터
      </Text>
      <Text style={{ color: theme.colors.textSecondary, marginBottom: 20 }}>
        개발 콘솔을 확인하여 로그와 성능 측정을 확인하세요.
      </Text>
      
      <ExampleCardComponent />
      <MonitoredSlowComponent />
      <HookBasedComponent />
    </View>
  );
}

// 5. 메인 개발 도구 데모 컴포넌트
export function DevToolsDemo() {
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <TarotSystemSimulator />
      
      {/* 개발 패널 (우하단에 플로팅 버튼으로 표시) */}
      <DevPanel />
    </View>
  );
}

// 6. App.tsx에서 사용할 개발 래퍼
export function DevWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 앱 시작시 개발 모드 초기화
    initDevMode();
    
    // 앱 로딩 성능 측정 완료
    performanceUtils.endTimer('앱 초기화');
    
    devLog('🔮 타로 타이머 앱 로딩 완료');
  }, []);

  return (
    <PerformanceMonitor 
      componentName="App" 
      trackMemory={true}
      logToConsole={false} // 앱 전체는 로깅 끄기
    >
      {children}
      <DevPanel />
    </PerformanceMonitor>
  );
}

// 7. 개발 환경에서만 렌더링되는 컴포넌트
export function DevOnlyComponent({ children }: { children: React.ReactNode }) {
  if (!__DEV__) return null;
  return <>{children}</>;
}