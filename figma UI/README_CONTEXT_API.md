# Context API 상태 관리 아키텍처 구현 완료

React Context API 기반의 포괄적인 상태 관리 시스템이 구현되었습니다.

## 🏗️ 아키텍처 개요

### 계층 구조
```
AppProviders (루트)
├── DevToolsProvider (개발 도구)
├── ErrorProvider (에러 관리) 
├── AppErrorBoundary (에러 경계)
└── LoadingProvider (로딩 관리)
    └── LoadingOverlay (로딩 UI)
```

## 📁 구현된 컴포넌트

### 1. **ErrorBoundary.tsx** - 전역 에러 처리
- **React Error Boundary** + **Context API** 통합
- **에러 타입별 분류**: runtime, async, network, validation, system
- **심각도 레벨**: low, medium, high, critical
- **자동 복구**: 낮은 심각도 에러 자동 복구
- **재시도 메커니즘**: 3회까지 자동 재시도
- **개발/프로덕션 모드** 대응

```tsx
// 사용 예시
const { reportAsyncError } = useErrorReporter();
reportAsyncError(new Error('API 호출 실패'), { endpoint: '/api/tarot' });
```

### 2. **LoadingContext.tsx** - 로딩 상태 관리
- **다중 로딩 상태** 동시 관리
- **진행률 추적** (0-100%)
- **우선순위 기반** 표시 (low, medium, high, critical)
- **취소 가능한** 작업 지원
- **타임아웃** 설정 가능
- **블로킹/논블로킹** 모드

```tsx
// 사용 예시
const { executeWithLoading } = useAsyncLoading();

await executeWithLoading(
  'save-data',
  async (updateProgress) => {
    updateProgress?.(25);
    // 작업 수행
    updateProgress?.(100);
  },
  {
    title: '데이터 저장 중...',
    priority: 'high',
    timeout: 10000,
  }
);
```

### 3. **DevTools.tsx** - 개발 도구
- **실시간 로깅** 시스템 (debug, info, warn, error)
- **성능 모니터링** (시작/종료 추적)
- **상태 스냅샷** 추적
- **키보드 단축키** (Ctrl+Shift+D)
- **필터링 & 검색** 기능
- **콘솔 통합** 출력

```tsx
// 사용 예시  
const { log, startPerformance, endPerformance } = useDevTools();

log('info', 'user', '사용자 카드 선택', { cardId: 'card-1' });

const perfId = startPerformance('card-animation');
// 애니메이션 실행
endPerformance(perfId);
```

## 🚀 통합된 앱 - MysticalAppWithContext.tsx

기존 **MysticalApp.tsx**를 Context API로 완전히 통합한 버전입니다.

### 주요 개선사항
- **에러 처리**: 모든 비동기 작업에 에러 처리 적용
- **로딩 상태**: 카드 뽑기, 저널 저장 등 모든 작업에 로딩 표시
- **성능 추적**: 개발 모드에서 성능 모니터링
- **사용자 경험**: 직관적인 로딩 인디케이터와 에러 메시지

### 핵심 기능
1. **타로 카드 뽑기**: 로딩 애니메이션과 에러 처리
2. **저널 저장**: 진행률 표시와 성공/실패 피드백  
3. **스프레드 생성**: 백엔드 연동 준비된 구조
4. **개발자 도구**: 실시간 디버깅과 성능 분석

## 📊 백엔드 연동 준비

### SyncService (../services/syncService.ts)
- **오프라인 지원**: 네트워크 연결 상태 추적
- **동기화 큐**: 실패한 작업 자동 재시도
- **충돌 해결**: 클라이언트/서버 데이터 충돌 관리
- **배치 처리**: 효율적인 데이터 전송

```tsx
// 백엔드 연동 예시
const syncService = createSyncService({
  apiBaseUrl: 'https://api.tarot-timer.com',
  retryAttempts: 3,
  batchSize: 10,
  storage: mmkvStorage,
});

// 엔티티 등록
syncService.registerEntity('tarot', {
  endpoint: '/api/tarot',
  primaryKey: 'id',
  transformOut: (data) => ({ ...data, userId: getCurrentUserId() }),
});
```

## 🛠️ 개발자 가이드

### 1. Context 사용법
```tsx
import { AppProviders, useError, useLoading } from './contexts';

// 앱 최상위에 적용
function App() {
  return (
    <AppProviders>
      <YourAppContent />
    </AppProviders>
  );
}

// 컴포넌트에서 사용
function MyComponent() {
  const { reportError } = useError();
  const { isLoading, startLoading } = useLoading();
  
  // 로딩과 에러 처리가 통합된 비동기 작업
  const handleAsyncAction = async () => {
    try {
      const loadingId = startLoading('my-action', {
        title: '작업 처리 중...',
        priority: 'medium'
      });
      
      // 비동기 작업 수행
      await myAsyncFunction();
      
      finishLoading(loadingId);
    } catch (error) {
      reportError({
        type: 'async',
        severity: 'medium',
        message: error.message,
        metadata: { action: 'my-action' }
      });
    }
  };
}
```

### 2. 성능 최적화
```tsx
// 성능 추적 Hook 사용
function ExpensiveComponent() {
  usePerformanceTracking('ExpensiveComponent', [props.data]);
  
  return <div>...</div>;
}

// 상태 추적 Hook 사용  
function StatefulComponent() {
  const [state, setState] = useState(initialState);
  useStateTracking(state, 'StatefulComponent');
  
  return <div>...</div>;
}
```

### 3. 개발 도구 활용
- **Ctrl+Shift+D**: DevTools 패널 토글
- **Logs 탭**: 실시간 로그 확인
- **State 탭**: 상태 변화 추적
- **Performance 탭**: 성능 메트릭 분석
- **Errors 탭**: 에러 발생 현황
- **Loading 탭**: 현재 로딩 작업 상태

## 🔧 설정 및 커스터마이징

### 에러 처리 설정
```tsx
// 에러 심각도별 처리 로직 커스터마이징
const customErrorHandler = {
  low: (error) => console.warn(error),
  medium: (error) => logToService(error), 
  high: (error) => alertUser(error),
  critical: (error) => forceReload()
};
```

### 로딩 UI 커스터마이징
```tsx
// 커스텀 로딩 오버레이
<LoadingProvider>
  <YourApp />
  <CustomLoadingOverlay />
</LoadingProvider>
```

### 개발 도구 설정
```tsx
const devToolsConfig = {
  maxLogs: 500,
  logLevel: 'debug',
  enableStateTracking: true,
  enablePerformanceTracking: true,
  enableNetworkTracking: true,
};
```

## 🚀 다음 단계

1. **실제 백엔드 API 연동**
2. **사용자 인증 Context 추가**
3. **오프라인 모드 완성**
4. **푸시 알림 Context**
5. **다국어 Context API 통합**

---

**Context API 기반 상태 관리 시스템이 완성되었습니다!** 🎉

이제 확장 가능하고 유지보수가 쉬운 상태 관리 아키텍처로 타로 타이머 앱을 발전시킬 수 있습니다.