# HTML 구조 상세 분석 및 컴포넌트 목록

## 📋 전체 HTML 구조 분석

### 🏗️ **기본 구조**
```html
<!DOCTYPE html>
<html lang="ko" class="dark">
<head>
  <!-- 메타데이터, 폰트, Tailwind CSS -->
</head>
<body>
  <!-- 전체 앱 컨테이너 -->
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900">
    
    <!-- 상단 헤더 -->
    <div class="flex justify-between items-center p-6">
      
    <!-- 탭 네비게이션 바 -->
    <div class="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-white/10">
      
    <!-- 메인 콘텐츠 영역 -->
    <div class="pb-24 px-6" id="content-container">
      <!-- 4개 탭 콘텐츠 -->
    </div>
    
    <!-- 팝업 모달들 -->
    
  </div>
</body>
</html>
```

---

## 🎨 **CSS 디자인 시스템 분석**

### **1. CSS 변수 (디자인 토큰)**
```css
:root {
  /* Typography Scale */
  --text-display-large: 32px;
  --text-display-medium: 28px;
  --text-title-large: 24px;
  --text-title-medium: 20px;
  --text-title-small: 18px;
  --text-body-large: 16px;
  --text-body-medium: 14px;
  --text-body-small: 12px;
  --text-caption: 11px;
  --text-overline: 10px;
  
  /* Font Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  /* Line Heights */
  --line-height-tight: 1.2;
  --line-height-normal: 1.3;
  --line-height-relaxed: 1.4;
  --line-height-loose: 1.5;
  --line-height-extra-loose: 1.6;
}
```

### **2. 커스텀 애니메이션**
```css
@keyframes mystical-pulse { /* 신비로운 맥동 */ }
@keyframes mystical-glow { /* 신비로운 발광 */ }
@keyframes mystical-shimmer { /* 신비로운 반짝임 */ }
@keyframes mystical-float { /* 신비로운 부유 */ }
```

### **3. 색상 팔레트 (Tailwind 기반)**
- **배경**: `bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900`
- **카드 배경**: `bg-white/5 border-white/10`
- **주요 색상**: `text-yellow-400` (금색 - 타로 테마)
- **텍스트**: `text-white`, `text-white/70`, `text-white/60`
- **그라디언트**: `from-yellow-400 to-yellow-500`

---

## 📱 **4개 주요 탭 구조**

### **1. Timer Tab (홈 화면)**
```html
<div id="timer-content" class="tab-content demo-section">
  <!-- 헤더 섹션 -->
  <div class="text-center space-y-4">
    <svg class="h-12 w-12 text-yellow-400 animate-mystical-pulse">...</svg>
    <h1 class="display-large text-gradient-mystical">Tarot Timer</h1>
    <p class="body-small text-white/70">24시간 타로 여정을 시작하세요</p>
  </div>
  
  <!-- 카드 뽑기 초기 상태 -->
  <div id="initial-state">
    <button onclick="drawDailyCards()">24시간 타로 뽑기</button>
  </div>
  
  <!-- 24시간 타로 표시 영역 -->
  <div id="daily-cards" class="hidden">
    <!-- 현재 시간 카드 -->
    <!-- 24시간 스크롤 뷰 -->
    <!-- 메모 패드 -->
  </div>
</div>
```

### **2. Spreads Tab (스프레드)**
```html
<div id="spreads-content" class="tab-content demo-section hidden">
  <!-- 스프레드 선택 그리드 -->
  <div class="grid grid-cols-1 gap-6">
    <!-- 각 스프레드 카드들 -->
    <div class="bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl touch-card rounded-2xl p-6">
      <!-- 스프레드 정보 및 시작 버튼 -->
    </div>
  </div>
</div>
```

### **3. Journal Tab (일기)**
```html
<div id="journal-content" class="tab-content demo-section hidden">
  <!-- 날짜 네비게이션 -->
  <!-- 일일 세션 목록 -->
  <!-- 상세 모달 -->
</div>
```

### **4. Settings Tab (설정)**
```html
<div id="settings-content" class="tab-content demo-section hidden">
  <!-- 설정 옵션들 -->
</div>
```

---

## 🧩 **추출할 React Native 컴포넌트 목록**

### **🎯 핵심 컴포넌트 (우선순위 1)**

#### **1. TarotCard**
```typescript
// 다양한 크기와 상태를 지원하는 타로 카드
interface TarotCardProps {
  size: 'small' | 'medium' | 'large' | 'xlarge';
  variant: 'placeholder' | 'revealed' | 'flipped';
  cardData?: {
    id: string;
    name: string;
    image: string;
    meaning: string;
  };
  onPress?: () => void;
  isAnimating?: boolean;
}
```

**사용 위치:**
- 24시간 타로 카드들
- 스프레드 카드들
- 일기 썸네일 카드들

#### **2. TimeDisplay**
```typescript
// 현재 시간 표시 및 시간별 네비게이션
interface TimeDisplayProps {
  currentHour: number;
  selectedHour: number;
  onHourSelect: (hour: number) => void;
  showCurrentTime: boolean;
}
```

**사용 위치:**
- 홈 화면 현재 시간
- 24시간 스크롤 뷰

#### **3. TabNavigation**
```typescript
// 하단 탭 네비게이션
interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
  }>;
}
```

**사용 위치:**
- 앱 하단 고정 네비게이션

#### **4. MemoPad**
```typescript
// 메모 작성 패드
interface MemoPadProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onSave: () => void;
  maxLength?: number;
}
```

**사용 위치:**
- 홈 화면 메모 작성
- 스프레드 결과 메모

### **🎨 UI 컴포넌트 (우선순위 2)**

#### **5. SpreadLayout**
```typescript
// 다양한 스프레드 레이아웃
interface SpreadLayoutProps {
  spreadType: 'celtic-cross' | 'choice' | 'timeline' | 'cup-shape';
  cards: TarotCard[];
  onCardPress: (cardIndex: number) => void;
}
```

#### **6. CardPopup**
```typescript
// 카드 상세 팝업
interface CardPopupProps {
  visible: boolean;
  card: TarotCard;
  position: string;
  onClose: () => void;
}
```

#### **7. GradientBackground**
```typescript
// 앱 전체 배경 그라디언트
interface GradientBackgroundProps {
  variant: 'default' | 'spread' | 'diary';
  children: React.ReactNode;
}
```

#### **8. MysticalButton**
```typescript
// 신비로운 애니메이션 버튼
interface MysticalButtonProps {
  title: string;
  variant: 'primary' | 'secondary' | 'ghost';
  size: 'small' | 'medium' | 'large';
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}
```

### **📝 특수 컴포넌트 (우선순위 3)**

#### **9. SpreadGrid**
```typescript
// 스프레드 선택 그리드
interface SpreadGridProps {
  spreads: SpreadInfo[];
  onSpreadSelect: (spreadId: string) => void;
}
```

#### **10. DailySessionCard**
```typescript
// 일기 화면 일일 세션 카드
interface DailySessionCardProps {
  date: string;
  sessions: Session[];
  onPress: () => void;
}
```

#### **11. TimelineScroll**
```typescript
// 24시간 수평 스크롤 뷰
interface TimelineScrollProps {
  cards: TarotCard[];
  currentHour: number;
  onHourSelect: (hour: number) => void;
}
```

---

## 🎭 **애니메이션 시스템**

### **CSS 애니메이션 → React Native Animated 매핑**

```typescript
// CSS → React Native 변환 계획
const animations = {
  mysticalPulse: {
    // CSS: animation: mystical-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    // RN: Animated.loop(Animated.timing(...))
    duration: 2000,
    easing: 'bezier',
    repeat: true
  },
  
  mysticalGlow: {
    // CSS: box-shadow 변화 애니메이션
    // RN: Animated.timing with shadowOpacity
    duration: 3000,
    type: 'shadow',
    repeat: true
  },
  
  mysticalFloat: {
    // CSS: transform: translateY + rotate
    // RN: Animated.timing with transform
    duration: 6000,
    type: 'transform',
    repeat: true
  }
};
```

---

## 🔧 **레이아웃 시스템**

### **CSS Grid/Flexbox → React Native 매핑**

```typescript
// HTML CSS 클래스 → RN StyleSheet 변환
const layoutMappings = {
  // Grid 시스템
  'grid-cols-1': { flexDirection: 'column' },
  'grid-cols-2': { flexDirection: 'row', flexWrap: 'wrap' },
  
  // Flexbox 시스템
  'flex items-center justify-center': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  
  // 간격 시스템
  'space-y-4': { gap: 16 },
  'space-y-6': { gap: 24 },
  'space-y-8': { gap: 32 },
  
  // 패딩/마진
  'p-6': { padding: 24 },
  'px-6': { paddingHorizontal: 24 },
  'py-4': { paddingVertical: 16 }
};
```

---

## 📊 **데이터 구조 분석**

### **주요 데이터 타입**

```typescript
interface TarotCard {
  id: string;
  name: string;
  image: string;
  meaning: string;
  reversed?: boolean;
}

interface SpreadInfo {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  layout: string;
  positions: string[];
}

interface DailyReading {
  date: string;
  cards: TarotCard[];
  memo: string;
  timestamp: number;
}
```

---

## 🎯 **React Native 변환 우선순위**

### **Phase 1-1: 핵심 컴포넌트 (1주)**
1. ✅ **TarotCard** - 모든 곳에서 사용되는 핵심
2. ✅ **GradientBackground** - 앱 전체 배경
3. ✅ **TabNavigation** - 기본 네비게이션

### **Phase 1-2: 홈 화면 (1주)**
4. ✅ **TimeDisplay** - 시간 표시
5. ✅ **TimelineScroll** - 24시간 스크롤
6. ✅ **MemoPad** - 메모 기능

### **Phase 1-3: 전체 완성 (1주)**
7. ✅ **SpreadLayout** - 스프레드 레이아웃들
8. ✅ **CardPopup** - 카드 상세 팝업
9. ✅ **나머지 UI 컴포넌트들**

---

## 🔍 **중요 발견사항**

### **✅ 디자인 시스템의 장점**
- **일관된 디자인 토큰** - CSS 변수로 잘 정의됨
- **체계적인 타이포그래피** - 9단계 크기 시스템
- **재사용 가능한 애니메이션** - 4가지 신비로운 효과
- **반응형 레이아웃** - Tailwind 기반 유연한 시스템

### **⚠️ 주의사항**
- **복잡한 CSS 애니메이션** - React Native에서 재구현 필요
- **Tailwind 의존성** - StyleSheet로 모든 스타일 변환 필요
- **SVG 아이콘** - react-native-svg로 변환 필요
- **복잡한 그라디언트** - 일부 단순화 필요

### **🎯 성공 전략**
1. **점진적 변환** - 컴포넌트 하나씩 완성도 높게
2. **디자인 토큰 우선** - CSS 변수를 React Native 상수로 먼저 변환
3. **애니메이션 단순화** - 핵심 효과만 우선 구현
4. **레이아웃 검증** - 각 컴포넌트마다 웹과 비교 확인

---

**📝 다음 단계: CSS 스타일 추출 및 디자인 토큰 생성**