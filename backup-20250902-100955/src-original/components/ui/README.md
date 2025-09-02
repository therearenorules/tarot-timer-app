# 🎴 타로 타이머 UI 컴포넌트 라이브러리

프리미엄 애니메이션과 신비로운 효과가 포함된 타로 테마 React 컴포넌트 라이브러리입니다.

## ✨ 주요 특징

- **프리미엄 애니메이션**: 플립, 글로우, 파티클 효과
- **반응형 디자인**: 모바일 우선 설계
- **접근성 최적화**: WCAG 2.1 AA 준수
- **성능 최적화**: React.memo, 가상화, 지연 로딩
- **TypeScript 지원**: 완전한 타입 안전성
- **다크모드 지원**: CSS 디자인 토큰 기반

## 📦 컴포넌트 목록

### 🎴 TarotCard
플립 애니메이션과 신비로운 효과가 있는 타로 카드 컴포넌트

```tsx
import { TarotCard } from './ui';

<TarotCard
  card={tarotCardData}
  size="medium"
  state="face-down"
  interactive={true}
  onFlip={(faceUp) => console.log('카드 뒤집기:', faceUp)}
  glowIntensity="normal"
/>
```

**주요 기능:**
- 5가지 크기 (thumbnail, small, medium, large, display)
- 4가지 상태 (face-down, face-up, empty, loading, error)
- 플립 애니메이션 (600ms 커스터마이징 가능)
- 글로우 효과 (subtle, normal, intense)
- 터치/키보드 인터랙션

### ⏰ TimerDisplay
시간대별 색상 변화와 신비로운 효과가 있는 타이머

```tsx
import { TimerDisplay } from './ui';

<TimerDisplay
  variant="mystical"
  size="normal"
  timeBasedColors={true}
  onMidnight={() => console.log('자정!')}
  showSeconds={true}
/>
```

**주요 기능:**
- 실시간 시간 업데이트
- 시간대별 색상 변화 (7가지 팔레트)
- 3가지 변형 (mystical, elegant, minimal)
- 신비로운 애니메이션 효과
- 자정/15분 단위 이벤트

### 🎨 SpreadCanvas
드래그 앤 드롭 지원 인터랙티브 타로 스프레드 캔버스

```tsx
import { SpreadCanvas } from './ui';

<SpreadCanvas
  spreadConfig={celticCrossConfig}
  cards={tarotCards}
  allowDragAndDrop={true}
  showGuideLines={true}
  backgroundPattern="sacred"
  onSpreadComplete={(positions) => saveSpread(positions)}
/>
```

**주요 기능:**
- 7가지 타로 스프레드 지원
- 드래그 앤 드롭 인터랙션
- 터치 제스처 지원
- 자동 스냅 기능
- 가이드라인 및 그리드

### ✨ MysticalBackground
다양한 신비로운 배경 효과 컴포넌트

```tsx
import { MysticalBackground } from './ui';

<MysticalBackground
  variant="aurora"
  animationIntensity="normal"
  timeBasedColors={true}
  currentHour={new Date().getHours()}
  enableParticles={true}
  particleCount={50}
/>
```

**주요 기능:**
- 6가지 배경 변형 (gradient, particles, sacred, cosmic, aurora, minimal)
- 동적 파티클 시스템
- 시간 기반 색상 변화
- 성능 최적화 (배터리 절약 모드)
- 접근성 고려 (동작 감소 설정)

### ⏰ HourStrip
24시간 수평 스크롤 네비게이션 스트립

```tsx
import { HourStrip } from './ui';

<HourStrip
  hours={hourDataArray}
  currentHour={currentHour}
  onHourSelect={(hour) => navigateToHour(hour)}
  showCardPreviews={true}
  snapToHour={true}
  showMinimap={true}
/>
```

**주요 기능:**
- 부드러운 수평 스크롤
- 자동 중앙 정렬
- 터치/마우스 드래그
- 스냅 애니메이션
- 미니맵 지원

## 🚀 성능 최적화

### React.memo 사용
모든 컴포넌트는 `React.memo`로 래핑되어 불필요한 리렌더링을 방지합니다.

### 가상화 지원
대량의 데이터를 다룰 때 가상화를 통해 성능을 최적화합니다.

```tsx
<HourStrip
  hours={hours}
  virtualized={true}
  visibleHours={7}
/>
```

### 지연 로딩
무거운 컴포넌트는 지연 로딩을 지원합니다.

```tsx
import { PerformanceUtils } from './ui';

const LazySpreadCanvas = PerformanceUtils.lazyLoad(
  () => import('./ui/SpreadCanvas'),
  LoadingSpinner
);
```

### 배터리 절약 모드
모바일 디바이스의 배터리를 고려한 최적화 옵션을 제공합니다.

```tsx
<MysticalBackground
  enablePowerSaver={true}
  reducedMotion={true}
/>
```

## ♿ 접근성 지원

### WCAG 2.1 AA 준수
- 색상 대비 4.5:1 이상
- 키보드 네비게이션 완전 지원
- 스크린 리더 호환성
- 44px 이상 터치 타겟

### 키보드 네비게이션
```tsx
import { AccessibilityUtils } from './ui';

<div onKeyDown={(e) => AccessibilityUtils.handleKeyboardNavigation(e, {
  onEnter: () => selectCard(),
  onSpace: () => flipCard(),
  onEscape: () => closeModal(),
  onArrowRight: () => nextCard(),
})}>
```

### ARIA 라벨 자동 생성
```tsx
const ariaLabel = AccessibilityUtils.generateAriaLabel('card', {
  name: card.name,
  description: card.description
});
```

## 🎨 디자인 토큰 시스템

모든 컴포넌트는 CSS 디자인 토큰을 사용합니다:

```css
/* 브랜드 색상 */
--brand-primary: #4A1A4F;
--brand-accent: #D4AF37;

/* 시맨틱 색상 */
--foreground: #1A1F3A;
--background: #FFFFFF;
--card: #FFFFFF;

/* 간격 (8pt 그리드) */
--space-s: 8px;
--space-m: 16px;
--space-l: 24px;
```

## 📱 반응형 디자인

```tsx
// 브레이크포인트 상수
export const UI_CONSTANTS = {
  BREAKPOINTS: {
    mobile: 320,
    tablet: 768,
    desktop: 1024,
  },
};
```

## 🔧 커스터마이징

### 테마 설정
```tsx
// 다크모드 지원
<div className="dark">
  <TarotCard {...props} />
</div>
```

### 애니메이션 커스터마이징
```tsx
<TarotCard
  flipDuration={800}
  glowIntensity="intense"
/>
```

### 색상 커스터마이징
```tsx
<MysticalBackground
  primaryColor="#FF6B6B"
  secondaryColor="#4ECDC4"
  accentColor="#45B7D1"
/>
```

## 📋 사용 예제

### 기본 타로 카드 그리드
```tsx
import { TarotCard, MysticalBackground } from './ui';

function TarotGrid({ cards }) {
  return (
    <div style={{ position: 'relative' }}>
      <MysticalBackground variant="cosmic" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {cards.map((card, index) => (
          <TarotCard
            key={index}
            card={card}
            state="face-down"
            size="medium"
            interactive={true}
            onFlip={(faceUp) => handleCardFlip(index, faceUp)}
          />
        ))}
      </div>
    </div>
  );
}
```

### 프리미엄 타이머 화면
```tsx
import { TimerDisplay, HourStrip, MysticalBackground } from './ui';

function TimerScreen({ hours, currentHour }) {
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <MysticalBackground
        variant="aurora"
        timeBasedColors={true}
        currentHour={currentHour}
      />
      
      <div style={{ padding: 20, position: 'relative', zIndex: 1 }}>
        <TimerDisplay
          variant="mystical"
          size="large"
          timeBasedColors={true}
          onMidnight={() => generateNewCards()}
        />
        
        <HourStrip
          hours={hours}
          currentHour={currentHour}
          onHourSelect={navigateToHour}
          showCardPreviews={true}
          variant="premium"
        />
      </div>
    </div>
  );
}
```

### 인터랙티브 스프레드 생성기
```tsx
import { SpreadCanvas } from './ui';

function SpreadBuilder({ spreadConfig, availableCards }) {
  const [placedCards, setPlacedCards] = useState([]);
  
  return (
    <SpreadCanvas
      spreadConfig={spreadConfig}
      cards={availableCards}
      allowDragAndDrop={true}
      showPositionLabels={true}
      backgroundPattern="sacred"
      onSpreadComplete={(positions) => {
        setPlacedCards(positions);
        saveSpread(positions);
      }}
    />
  );
}
```

## 🐛 문제 해결

### 일반적인 문제들

**애니메이션이 작동하지 않을 때:**
```tsx
// 애니메이션 감소 설정 확인
const reducedMotion = PerformanceUtils.useReducedMotion();

<TarotCard
  flipDuration={reducedMotion ? 0 : 600}
/>
```

**성능 문제 해결:**
```tsx
// 가상화 사용
<HourStrip virtualized={true} visibleHours={5} />

// 파티클 수 감소
<MysticalBackground particleCount={20} enablePowerSaver={true} />
```

**접근성 문제:**
```tsx
// 키보드 네비게이션 추가
<TarotCard
  tabIndex={0}
  onKeyDown={(e) => AccessibilityUtils.handleKeyboardNavigation(e, handlers)}
/>
```

## 📄 라이선스

이 컴포넌트 라이브러리는 MIT 라이선스 하에 배포됩니다.