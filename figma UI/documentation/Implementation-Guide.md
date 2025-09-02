# 🛠️ Implementation Guide - Tarot Timer App

**Version:** 1.0.0  
**Framework:** React + TypeScript + Tailwind v4  
**Architecture:** Modular Component System  
**Status:** Production Ready  

## 🚀 Quick Start

### 설치 및 실행

```bash
# 프로젝트 클론
git clone https://github.com/company/tarot-timer-app
cd tarot-timer-app

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:3000 접속
```

### 환경 설정

```env
# .env.local 파일 생성
REACT_APP_API_URL=https://api.tarot-timer.com
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_key
REACT_APP_ENVIRONMENT=development
```

## 🏗️ 시스템 아키텍처 이해

### 계층적 구조

```
App.tsx                    ← 최상위 컨테이너 + 네비게이션
├── Providers              ← 전역 상태 관리
│   ├── LanguageProvider   ← 다국어 지원
│   ├── ResponsiveProvider ← 반응형 관리
│   ├── AccessibilityProvider ← 접근성 관리
│   └── PerformanceProvider ← 성능 최적화
├── Screen Modules         ← 독립적 화면 모듈
│   ├── TimerScreen       ← 24시간 타로 타이머
│   ├── SpreadScreen      ← 타로 스프레드
│   ├── JournalScreen     ← 타로 일기
│   └── SettingsScreen    ← 앱 설정
├── Composite Components   ← 화면 구성 요소
│   ├── NavigationFlow    ← 화면 컨테이너
│   ├── TabBar           ← 하단 네비게이션
│   ├── Header           ← 상단 헤더
│   ├── CardGrid         ← 카드 그리드
│   ├── ListItem         ← 리스트 아이템
│   └── Modal            ← 모달 시스템
└── Base Components       ← 기본 구성 요소
    ├── Card             ← 카드 컴포넌트
    ├── Button           ← 버튼 컴포넌트
    ├── Text             ← 텍스트 컴포넌트
    ├── Icon             ← 아이콘 컴포넌트
    └── Badge            ← 배지 컴포넌트
```

### 의존성 규칙

```
✅ 허용되는 의존성:
Screen Modules → Composite Components
Composite Components → Base Components
Base Components → Design Tokens

❌ 금지되는 의존성:
Screen Modules ↔ Screen Modules
Composite Components ↔ Composite Components
Base Components → Composite/Screen Components
```

## 🎨 디자인 토큰 시스템

### 토큰 구조

```css
/* globals.css - 단일 진실 소스 */
:root {
  /* 🌟 Brand Colors */
  --brand-primary: #4A1A4F;    /* Deep Purple */
  --brand-secondary: #1A1F3A;  /* Midnight Blue */
  --brand-accent: #D4AF37;     /* Gold */
  
  /* 📏 Spacing (8pt Grid) */
  --space-xxs: 2px;
  --space-xs: 4px;
  --space-s: 8px;
  --space-m: 16px;
  --space-l: 24px;
  --space-xl: 32px;
  
  /* 📝 Typography */
  --text-display-large: 32px;
  --text-title-large: 24px;
  --text-body-medium: 14px;
  --text-caption: 11px;
}
```

### 토큰 사용법

```typescript
// ✅ 올바른 사용법
const styles: React.CSSProperties = {
  color: 'var(--brand-primary)',
  fontSize: 'var(--text-body-medium)',
  padding: 'var(--space-m)',
};

// ❌ 잘못된 사용법
const styles: React.CSSProperties = {
  color: '#4A1A4F',          // 하드코딩 금지
  fontSize: '14px',          // 하드코딩 금지
  padding: '16px',           // 하드코딩 금지
};
```

## 🧩 컴포넌트 사용 가이드

### Base Components

```typescript
// Card 컴포넌트
import { Card } from './components/base/Card';

<Card
  size="medium"                    // small | medium | large
  content="filled"                 // text-only | filled | loading
  title="카드 제목"
  description="카드 설명"
  imageUrl="https://..."
  onClick={() => console.log('클릭')}
/>

// Button 컴포넌트
import { Button } from './components/base/Button';

<Button
  variant="primary"                // primary | secondary | ghost | premium
  iconVariant="leading-icon"       // icon-only | leading-icon | trailing-icon
  icon={<Icon name="star" />}
  size="medium"                    // small | medium | large
  onClick={() => console.log('클릭')}
>
  버튼 텍스트
</Button>

// Text 컴포넌트
import { Text } from './components/base/Text';

<Text
  variant="body-medium"            // display-large | title-large | body-medium | caption
  semantic="primary"               // primary | secondary | tertiary | accent | premium
  as="p"                          // h1 | h2 | h3 | p | span | div
>
  텍스트 내용
</Text>
```

### Composite Components

```typescript
// Header 컴포넌트
import { Header } from './components/composite/Header';

<Header
  title="화면 제목"
  subtitle="부제목"
  onBack={() => console.log('뒤로가기')}
  progress={75}                    // 선택적 진행률
  actions={[
    { 
      icon: 'share', 
      onClick: () => console.log('공유'),
      variant: 'ghost'
    }
  ]}
/>

// Modal 컴포넌트
import { Modal } from './components/composite/Modal';

<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="모달 제목"
  subtitle="모달 부제목"
  size="medium"                    // small | medium | large
  actions={[
    {
      label: '취소',
      variant: 'ghost',
      onClick: () => setIsModalOpen(false)
    },
    {
      label: '확인',
      variant: 'primary',
      onClick: handleConfirm
    }
  ]}
>
  모달 내용
</Modal>
```

## 📱 Screen Module 개발

### 새 Screen Module 생성

```typescript
// /components/screen-modules/ExampleScreen.tsx
import React, { useState } from 'react';
import { NavigationFlow } from '../composite/NavigationFlow';
import { Header } from '../composite/Header';
import { Card } from '../base/Card';
import { Button } from '../base/Button';

interface ExampleScreenProps {
  onBack?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function ExampleScreen({ 
  onBack, 
  className = '', 
  style = {} 
}: ExampleScreenProps) {
  
  // 화면별 독립적 상태 관리
  const [localState, setLocalState] = useState('initial');

  // 헤더 설정
  const headerProps = {
    title: '새 화면',
    subtitle: '화면 설명',
    onBack,
  };

  return (
    <NavigationFlow
      showMysticalBackground={true}
      showHeader={true}
      showTabBar={false}
      headerProps={headerProps}
      className={className}
      style={style}
    >
      <div style={{
        height: '100%',
        overflow: 'auto',
        padding: 'var(--space-m)',
      }} className="scrollbar-none">
        
        {/* 화면 콘텐츠 */}
        <Card
          title="예시 카드"
          description="새 화면의 내용"
          onClick={() => setLocalState('clicked')}
        />
        
        <Button
          variant="primary"
          onClick={() => console.log('버튼 클릭')}
          style={{ marginTop: 'var(--space-m)' }}
        >
          액션 버튼
        </Button>
        
      </div>
    </NavigationFlow>
  );
}
```

### Screen Module 통합

```typescript
// App.tsx에 추가
import { ExampleScreen } from './components/screen-modules/ExampleScreen';

// 렌더링 함수에 추가
case 'example':
  return <ExampleScreen onBack={handleBack} />;

// TabBar에 탭 추가 (필요시)
// components/composite/TabBar.tsx 수정
```

## 🌐 반응형 시스템 활용

### useResponsive Hook 사용

```typescript
import { useResponsive } from '../utils/responsive';

function ResponsiveComponent() {
  const { 
    breakpoint, 
    deviceType, 
    getCardColumns, 
    isMinBreakpoint 
  } = useResponsive();

  const columns = getCardColumns();
  const isTablet = deviceType === 'tablet';
  const showSidebar = isMinBreakpoint('large');

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${columns}, 1fr)`,
      gap: isTablet ? 'var(--space-l)' : 'var(--space-m)',
    }}>
      {/* 반응형 콘텐츠 */}
    </div>
  );
}
```

### 반응형 값 사용

```typescript
import { useResponsiveValue } from '../utils/responsive';

function AdaptiveComponent() {
  const padding = useResponsiveValue(
    {
      small: 'var(--space-s)',
      medium: 'var(--space-m)',
      large: 'var(--space-l)',
      xlarge: 'var(--space-xl)',
    },
    'var(--space-m)' // 기본값
  );

  return (
    <div style={{ padding }}>
      반응형 패딩 적용
    </div>
  );
}
```

## ♿ 접근성 구현

### useAccessibility Hook 사용

```typescript
import { useAccessibility, A11yUtils } from '../utils/accessibility';

function AccessibleComponent() {
  const { announce, getFocusStyles } = useAccessibility();

  const handleAction = () => {
    // 스크린 리더에 알림
    announce('작업이 완료되었습니다', 'polite');
  };

  return (
    <button
      {...A11yUtils.getAriaProps('button', {
        label: '중요한 작업 실행',
        describedBy: 'help-text'
      })}
      style={getFocusStyles()}
      onClick={handleAction}
    >
      작업 실행
      <span id="help-text" style={{ display: 'none' }}>
        이 버튼을 클릭하면 중요한 작업이 실행됩니다
      </span>
    </button>
  );
}
```

### 카드 접근성

```typescript
function AccessibleCard({ cardName, position, isRevealed }) {
  return (
    <div
      {...A11yUtils.getCardAriaProps(cardName, position, isRevealed)}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleCardClick();
        }
      }}
    >
      <Card
        title={isRevealed ? cardName : '뒤집힌 카드'}
        imageUrl={isRevealed ? imageUrl : undefined}
      />
    </div>
  );
}
```

## ⚡ 성능 최적화

### usePerformance Hook 사용

```typescript
import { usePerformance, useOptimizedImage } from '../utils/performance';

function OptimizedComponent() {
  const { scheduleWork } = usePerformance();
  const optimizedImageSrc = useOptimizedImage('/images/card.jpg', 300);

  const handleExpensiveOperation = () => {
    // 비용이 큰 작업을 스케줄링
    scheduleWork(() => {
      // 무거운 계산 작업
      console.log('무거운 작업 완료');
    }, 'low'); // 낮은 우선순위
  };

  return (
    <div>
      <img 
        src={optimizedImageSrc} 
        alt="최적화된 이미지"
        loading="lazy"
      />
      <button onClick={handleExpensiveOperation}>
        무거운 작업 실행
      </button>
    </div>
  );
}
```

### 성능 모니터링

```typescript
import { usePerformanceMeasurement } from '../utils/performance';

function MonitoredComponent() {
  // 컴포넌트 렌더링 시간 자동 측정
  usePerformanceMeasurement('MonitoredComponent');

  return (
    <div>
      성능이 모니터링되는 컴포넌트
    </div>
  );
}
```

## 🔧 개발 도구 및 명령어

### 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 타입 체크
npm run type-check

# 린트 검사
npm run lint

# 린트 자동 수정
npm run lint:fix

# 테스트 실행
npm run test

# 테스트 커버리지
npm run test:coverage
```

### 디버깅 도구

```typescript
// 개발 모드에서만 활성화되는 디버그 유틸리티
if (process.env.NODE_ENV === 'development') {
  // 성능 메트릭 표시
  console.log('Performance Metrics:', usePerformance().metrics);
  
  // 반응형 정보 표시
  console.log('Responsive Info:', useResponsive());
  
  // 접근성 설정 표시
  console.log('Accessibility Settings:', useAccessibility().settings);
}
```

## 📦 배포 준비

### 환경별 설정

```javascript
// package.json 스크립트
{
  "scripts": {
    "build": "react-scripts build",
    "build:staging": "REACT_APP_ENVIRONMENT=staging npm run build",
    "build:production": "REACT_APP_ENVIRONMENT=production npm run build"
  }
}
```

### 환경 변수 검증

```typescript
// utils/config.ts
export const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  supabaseUrl: process.env.REACT_APP_SUPABASE_URL,
  supabaseKey: process.env.REACT_APP_SUPABASE_ANON_KEY,
  environment: process.env.REACT_APP_ENVIRONMENT || 'development',
};

// 필수 환경 변수 검증
if (!config.supabaseUrl || !config.supabaseKey) {
  throw new Error('Missing required environment variables');
}
```

## 🧪 테스트 가이드

### 컴포넌트 테스트

```typescript
// __tests__/components/Card.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Card } from '../components/base/Card';

describe('Card Component', () => {
  test('renders with title and description', () => {
    render(
      <Card 
        title="테스트 카드" 
        description="테스트 설명" 
      />
    );
    
    expect(screen.getByText('테스트 카드')).toBeInTheDocument();
    expect(screen.getByText('테스트 설명')).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(
      <Card 
        title="클릭 가능한 카드" 
        onClick={handleClick}
      />
    );
    
    fireEvent.click(screen.getByText('클릭 가능한 카드'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

### Screen Module 테스트

```typescript
// __tests__/screen-modules/TimerScreen.test.tsx
import { render, screen } from '@testing-library/react';
import { TimerScreen } from '../components/screen-modules/TimerScreen';

// Provider로 감싸기
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <LanguageProvider>
      <ResponsiveProvider>
        <AccessibilityProvider>
          <PerformanceProvider>
            {ui}
          </PerformanceProvider>
        </AccessibilityProvider>
      </ResponsiveProvider>
    </LanguageProvider>
  );
};

describe('TimerScreen', () => {
  test('renders timer interface', () => {
    renderWithProviders(<TimerScreen />);
    expect(screen.getByText('24시간 타로 뽑기')).toBeInTheDocument();
  });
});
```

## 🔄 유지보수 가이드

### 토큰 업데이트

```css
/* globals.css에서 단일 값 변경 */
--brand-primary: #NEW_COLOR; /* 전체 시스템 자동 업데이트 */
```

### 새 기능 추가

1. **Base Component 추가**
   ```typescript
   // components/base/NewComponent.tsx
   // 토큰만 사용하여 구현
   ```

2. **Composite Component 추가**
   ```typescript
   // components/composite/NewComposite.tsx
   // Base 컴포넌트 조합으로 구현
   ```

3. **Screen Module 확장**
   ```typescript
   // 기존 Screen Module에 새 기능 추가
   // 또는 새 Screen Module 생성
   ```

### 버그 수정 프로세스

1. **문제 식별**: 어느 레벨의 컴포넌트 문제인지 파악
2. **격리 테스트**: 해당 컴포넌트만 독립적으로 테스트
3. **수정 적용**: 토큰/Base/Composite/Screen 레벨에서 수정
4. **영향 범위 확인**: 다른 컴포넌트에 영향 없는지 검증
5. **회귀 테스트**: 전체 시스템 테스트

## 📞 지원 및 문의

### 개발 지원

- **시스템 아키텍처 질문**: architecture@company.com
- **컴포넌트 사용법**: components@company.com
- **성능 최적화**: performance@company.com
- **접근성 구현**: accessibility@company.com

### 문서 및 리소스

- **컴포넌트 스토리북**: https://storybook.tarot-timer.com
- **디자인 토큰**: https://tokens.tarot-timer.com
- **API 문서**: https://api.tarot-timer.com/docs
- **GitHub**: https://github.com/company/tarot-timer

### 버그 리포팅

```markdown
## 버그 리포트 템플릿

**환경 정보:**
- OS: 
- 브라우저: 
- 버전: 

**재현 단계:**
1. 
2. 
3. 

**예상 결과:**

**실제 결과:**

**추가 정보:**
```

---

## 🎉 성공적인 구현을 위한 팁

### ✅ Do's

- **토큰 활용**: 항상 디자인 토큰 사용
- **컴포넌트 재사용**: 기존 컴포넌트 최대한 활용
- **독립성 유지**: 모듈 간 의존성 제거
- **접근성 고려**: 처음부터 접근성 구현
- **성능 측정**: 정기적인 성능 모니터링

### ❌ Don'ts

- **하드코딩 금지**: 색상, 크기, 간격 하드코딩 금지
- **의존성 추가 금지**: 불필요한 컴포넌트 간 의존성 금지
- **일관성 파괴 금지**: 디자인 시스템 규칙 위반 금지
- **접근성 무시 금지**: 접근성 요구사항 무시 금지
- **성능 간과 금지**: 성능 최적화 건너뛰기 금지

**시스템이 완전히 준비되었습니다. 성공적인 구현을 위해 이 가이드를 참고하세요! 🚀**