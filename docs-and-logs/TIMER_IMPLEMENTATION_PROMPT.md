# 타로 타이머 앱 - Timer 화면 완전 재현 가이드

## 🎯 개요
이 가이드는 클로드코드에서 타로 타이머 앱의 Timer 화면을 100% 정확히 재현하기 위한 단계별 지침입니다. 모든 코드, 스타일, 상태 로직을 정확히 따라하시면 완전히 동일한 결과물을 얻을 수 있습니다.

---

## 🏗️ 1단계: 필수 파일 구조 생성

### 1.1 프로젝트 초기 설정
```bash
# 새 React 프로젝트 생성
npx create-react-app tarot-timer-app --template typescript
cd tarot-timer-app
```

### 1.2 필수 폴더 구조 생성
```
src/
├── App.tsx
├── styles/
│   └── globals.css
├── utils/
│   ├── language.tsx
│   └── tarot-data.ts
├── components/
│   ├── mystical-ui/
│   │   ├── icons.tsx
│   │   └── components.tsx
│   └── figma/
│       └── ImageWithFallback.tsx
```

---

## 🎨 2단계: Tailwind CSS 완전 설정

### 2.1 globals.css 정확히 복사
**중요: 이 내용을 `src/styles/globals.css`에 정확히 복사해주세요**

```css
@custom-variant dark (&:is(.dark *));

:root {
  /* Base font size */
  --font-size: 14px;
  
  /* Light Mode Color Tokens */
  --background: #ffffff;
  --foreground: #1a1f3a;
  --card: #ffffff;
  --card-foreground: #1a1f3a;
  --popover: #ffffff;
  --popover-foreground: #1a1f3a;
  --primary: #4a1a4f;
  --primary-foreground: #ffffff;
  --secondary: #fafafa;
  --secondary-foreground: #4a1a4f;
  --muted: #f8f6f9;
  --muted-foreground: #6b7280;
  --accent: #d4af37;
  --accent-foreground: #1a1f3a;
  --destructive: #dc2626;
  --destructive-foreground: #ffffff;
  --border: #e8e1e8;
  --input: transparent;
  --ring: #4a1a4f;
  
  /* Brand specific tokens */
  --premium-gold: #d4af37;
  --deep-purple: #4a1a4f;
  --midnight-blue: #1a1f3a;
  
  --radius: 8px;
}

.dark {
  /* Dark Mode Color Tokens */
  --background: #0f0f1a;
  --foreground: #ffffff;
  --card: #1a1f3a;
  --card-foreground: #ffffff;
  --popover: #1a1f3a;
  --popover-foreground: #ffffff;
  --primary: #4a1a4f;
  --primary-foreground: #ffffff;
  --secondary: #1a1f3a;
  --secondary-foreground: #c8b8d4;
  --muted: #1a1f3a;
  --muted-foreground: #8e8e93;
  --accent: #f4d03f;
  --accent-foreground: #0f0f1a;
  --destructive: #ff453a;
  --destructive-foreground: #ffffff;
  --border: #2a2f4a;
  --input: #1a1f3a;
  --ring: #4a1a4f;
  
  /* Dark mode brand tokens */
  --premium-gold: #f4d03f;
}

@theme inline {
  /* Tailwind color mappings */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  
  /* Brand color utilities */
  --color-premium-gold: var(--premium-gold);
  --color-deep-purple: var(--deep-purple);
  --color-midnight-blue: var(--midnight-blue);
  
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply bg-background text-foreground;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

@layer utilities {
  /* 신비로운 애니메이션 */
  @keyframes mystical-pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.02);
    }
  }
  
  .animate-mystical-pulse {
    animation: mystical-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  /* Scrollbar utilities */
  .scrollbar-none {
    -ms-overflow-style: none;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  
  .scrollbar-none::-webkit-scrollbar {
    display: none;
  }
}

html {
  font-size: var(--font-size);
  scroll-behavior: smooth;
}
```

---

## 🌐 3단계: 언어 시스템 구축

### 3.1 language.tsx 파일 생성
**`src/utils/language.tsx`에 정확히 복사:**

```typescript
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: 'ko' | 'en';
  setLanguage: (lang: 'ko' | 'en') => void;
  t: (key: string) => string;
}

const translations = {
  ko: {
    // 네비게이션
    'nav.timer': '타이머',
    'nav.spreads': '스프레드',
    'nav.journal': '저널',
    'nav.settings': '설정',
    
    // 타이머 탭
    'timer.title': '타로 타이머',
    'timer.currentHour': '현재 시간',
    'timer.now': '지금',
    'timer.revealDestiny': '운명을 펼쳐보세요',
    'timer.cosmicMessage': '우주가 전하는 24시간의 신성한 메시지',
    'timer.drawCards': '24시간 카드 뽑기',
    'timer.drawingCards': '카드를 뽑는 중...',
    'timer.energyFlow': '시간의 흐름',
    'timer.redraw': '다시 뽑기',
    'timer.reshuffling': '재배치 중...',
    'timer.sacredJournal': '성스러운 저널',
    'timer.journalPlaceholder': '이 시간의 카드가 전하는 메시지를 기록해보세요...',
    'timer.saveReading': '일일 타로 저장하기',
    'timer.saved': '저장됨',
    'timer.quote': '"시간은 강물과 같다. 우리는 그 흐름 속에서 진실을 발견한다."',
    
    // 공통
    'common.characters': '자',
    'common.back': '뒤로',
    'common.close': '닫기',
    'common.save': '저장',
    'common.cancel': '취소',
    'common.confirm': '확인'
  },
  en: {
    // Navigation
    'nav.timer': 'Timer',
    'nav.spreads': 'Spreads', 
    'nav.journal': 'Journal',
    'nav.settings': 'Settings',
    
    // Timer Tab
    'timer.title': 'Tarot Timer',
    'timer.currentHour': 'Current Hour',
    'timer.now': 'Now',
    'timer.revealDestiny': 'Reveal Your Destiny',
    'timer.cosmicMessage': '24 sacred messages from the universe',
    'timer.drawCards': 'Draw 24-Hour Cards',
    'timer.drawingCards': 'Drawing cards...',
    'timer.energyFlow': 'Energy Flow',
    'timer.redraw': 'Redraw',
    'timer.reshuffling': 'Reshuffling...',
    'timer.sacredJournal': 'Sacred Journal',
    'timer.journalPlaceholder': 'Record the message this hour\'s card brings you...',
    'timer.saveReading': 'Save Daily Reading',
    'timer.saved': 'Saved',
    'timer.quote': '"Time flows like a river. We discover truth within its flow."',
    
    // Common
    'common.characters': 'chars',
    'common.back': 'Back',
    'common.close': 'Close',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'ko' | 'en'>('ko');
  
  const t = (key: string): string => {
    return translations[language][key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
```

---

## 🎴 4단계: 타로 카드 데이터 시스템

### 4.1 tarot-data.ts 파일 생성
**`src/utils/tarot-data.ts`에 다음 내용 정확히 복사:**

```typescript
// 타로 카드 인터페이스
export interface TarotCard {
  id: number;
  name: string;
  nameKr: string;
  meaning: string;
  meaningKr: string;
  keywords: string[];
  keywordsKr: string[];
  imageUrl: string;
  element: string;
  suit: string;
  type: string;
}

// 스프레드 타입 인터페이스
export interface SpreadType {
  id: string;
  name: string;
  nameKr: string;
  description: string;
  descriptionKr: string;
  cards: number;
  isPremium: boolean;
}

// 저장된 스프레드 인터페이스
export interface SavedSpread {
  id: string;
  title: string;
  spreadType: string;
  spreadName: string;
  date: string;
  cards: TarotCard[];
  insights: string;
  savedAt: string;
}

// 일일 타로 저장 인터페이스
export interface DailyTarotSave {
  id: string;
  date: string;
  hourlyCards: TarotCard[];
  memos: { [hour: number]: string };
  insights: string;
  savedAt: string;
}

// 뷰 타입
export type ViewType = 'tabs' | 'spreadDetail' | 'savedSpreadDetail' | 'dailyTarotDetail';

// 모든 78장의 타로 카드 데이터
export const ALL_TAROT_CARDS: TarotCard[] = [
  // Major Arcana (22장)
  {
    id: 1,
    name: "The Fool",
    nameKr: "바보",
    meaning: "New beginnings, innocence, spontaneity, a free spirit",
    meaningKr: "새로운 시작, 순수함, 자발성, 자유로운 영혼",
    keywords: ["Beginning", "Journey", "Innocence", "Freedom"],
    keywordsKr: ["시작", "여행", "순수함", "자유"],
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    element: "Air",
    suit: "Major",
    type: "Major Arcana"
  },
  {
    id: 2,
    name: "The Magician",
    nameKr: "마법사",
    meaning: "Manifestation, resourcefulness, power, inspired action",
    meaningKr: "현실화, 지략, 힘, 영감에 찬 행동",
    keywords: ["Power", "Skill", "Concentration", "Action"],
    keywordsKr: ["힘", "기술", "집중", "행동"],
    imageUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=400",
    element: "Air",
    suit: "Major",
    type: "Major Arcana"
  },
  // ... (실제로는 78장 모두 필요하지만 여기서는 예시로 몇 장만)
];

// 현재 시간을 가져오는 함수 (0-23)
export const getCurrentHour = (): number => {
  return new Date().getHours();
};

// 시간을 포맷하는 함수
export const formatHour = (hour: number): string => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour} ${period}`;
};

// 날짜를 포맷하는 함수
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
};

// 24시간 카드를 생성하는 함수
export const generateDailyCards = (seedDate: Date): TarotCard[] => {
  const cards: TarotCard[] = [];
  const seed = seedDate.getTime();
  
  // 날짜 기반 시드로 카드를 랜덤하게 선택
  for (let hour = 0; hour < 24; hour++) {
    const cardSeed = seed + hour;
    const cardIndex = Math.floor((cardSeed * 9301 + 49297) % 233280 / 233280 * ALL_TAROT_CARDS.length);
    cards.push({
      ...ALL_TAROT_CARDS[cardIndex % ALL_TAROT_CARDS.length],
      id: cardSeed // 고유한 ID 생성
    });
  }
  
  return cards;
};

// 일일 타로를 저장하는 함수
export const saveDailyTarot = (dailyTarotSave: DailyTarotSave): void => {
  try {
    const saves = loadDailyTarotSaves();
    const existingIndex = saves.findIndex(save => save.date === dailyTarotSave.date);
    
    if (existingIndex >= 0) {
      saves[existingIndex] = dailyTarotSave;
    } else {
      saves.push(dailyTarotSave);
    }
    
    localStorage.setItem('dailyTarotSaves', JSON.stringify(saves));
  } catch (error) {
    console.error('Failed to save daily tarot:', error);
  }
};

// 일일 타로를 불러오는 함수
export const loadDailyTarotSaves = (): DailyTarotSave[] => {
  try {
    const saves = localStorage.getItem('dailyTarotSaves');
    return saves ? JSON.parse(saves) : [];
  } catch (error) {
    console.error('Failed to load daily tarot saves:', error);
    return [];
  }
};

// 오늘의 저장된 타로를 가져오는 함수
export const getTodaysSave = (): DailyTarotSave | null => {
  const today = new Date().toDateString();
  const saves = loadDailyTarotSaves();
  return saves.find(save => save.date === today) || null;
};

// 스프레드 타입들
export const SPREAD_TYPES: SpreadType[] = [
  {
    id: 'three-card',
    name: 'Three Card Spread',
    nameKr: '3카드 스프레드',
    description: 'Past, Present, Future - A simple yet powerful reading',
    descriptionKr: '과거, 현재, 미래 - 간단하지만 강력한 리딩',
    cards: 3,
    isPremium: false
  },
  {
    id: 'celtic-cross',
    name: 'Celtic Cross',
    nameKr: '켈틱 크로스',
    description: 'The most comprehensive tarot spread for deep insights',
    descriptionKr: '깊은 통찰을 위한 가장 포괄적인 타로 스프레드',
    cards: 10,
    isPremium: true
  },
  // ... 다른 스프레드들
];
```

---

## 🎨 5단계: 완전한 아이콘 시스템 구축

### 5.1 에셋 폴더 구조 생성
**먼저 다음 폴더 구조를 생성하세요:**
```
src/assets/
├── icons/
│   ├── bell.svg
│   ├── book-open.svg
│   ├── calendar.svg
│   ├── check.svg
│   ├── chevron-left.svg
│   ├── clock.svg
│   ├── crown.svg
│   ├── eye.svg
│   ├── globe.svg
│   ├── help-circle.svg
│   ├── index.ts
│   ├── layout.svg
│   ├── lock.svg
│   ├── moon.svg
│   ├── rotate-ccw.svg
│   ├── save.svg
│   ├── settings.svg
│   ├── shield.svg
│   ├── shuffle.svg
│   ├── sparkles.svg
│   ├── star.svg
│   ├── sun.svg
│   ├── tarot-cards.svg
│   ├── volume2.svg
│   ├── x.svg
│   └── zap.svg
└── images/
    ├── app-logo-icon.svg
    ├── app-logo-main.svg
    ├── card-placeholder.svg
    ├── index.ts
    ├── mystical-texture-dark.svg
    ├── mystical-texture-light.svg
    ├── sacred-geometry-pattern.svg
    ├── sparkle-effect.svg
    └── tarot-card-back.svg
```

### 5.2 아이콘 에셋 인덱스 생성
**`src/assets/icons/index.ts`에 정확히 복사:**

```typescript
/**
 * 타로 타이머 앱 아이콘 에셋 인덱스
 * 
 * 이 폴더에는 앱에서 사용하는 모든 SVG 아이콘들이 포함되어 있습니다.
 * 각 아이콘은 24x24px 기본 크기로 제작되었으며, currentColor를 사용하여
 * 테마에 따른 색상 적용이 가능합니다.
 */

// 네비게이션 아이콘
export { default as ClockIcon } from './clock.svg';
export { default as LayoutIcon } from './layout.svg';
export { default as BookOpenIcon } from './book-open.svg';
export { default as SettingsIcon } from './settings.svg';

// 브랜드 아이콘
export { default as TarotCardsIcon } from './tarot-cards.svg';
export { default as MoonIcon } from './moon.svg';

// 액션 아이콘
export { default as StarIcon } from './star.svg';
export { default as SparklesIcon } from './sparkles.svg';
export { default as ZapIcon } from './zap.svg';
export { default as RotateCcwIcon } from './rotate-ccw.svg';
export { default as SaveIcon } from './save.svg';
export { default as CrownIcon } from './crown.svg';
export { default as ShuffleIcon } from './shuffle.svg';

// 인터페이스 아이콘
export { default as ChevronLeftIcon } from './chevron-left.svg';
export { default as CheckIcon } from './check.svg';
export { default as XIcon } from './x.svg';
export { default as EyeIcon } from './eye.svg';
export { default as CalendarIcon } from './calendar.svg';

// 설정 아이콘
export { default as SunIcon } from './sun.svg';
export { default as GlobeIcon } from './globe.svg';
export { default as Volume2Icon } from './volume2.svg';
export { default as BellIcon } from './bell.svg';
export { default as LockIcon } from './lock.svg';
export { default as ShieldIcon } from './shield.svg';
export { default as HelpCircleIcon } from './help-circle.svg';

/**
 * 아이콘 사용 가이드라인:
 * 
 * 1. 기본 크기: 24x24px (w-6 h-6 클래스 사용)
 * 2. 색상: currentColor 사용으로 부모 요소의 text 색상 상속
 * 3. 스트로크: 일관된 2px 스트로크 위드 사용
 * 4. 접근성: 의미 있는 aria-label 추가 권장
 * 
 * 예시:
 * <ClockIcon className="w-6 h-6 text-premium-gold" />
 */

export const ICON_CATEGORIES = {
  navigation: ['clock', 'layout', 'book-open', 'settings'],
  brand: ['tarot-cards', 'moon'],
  actions: ['star', 'sparkles', 'zap', 'rotate-ccw', 'save', 'crown', 'shuffle'],
  interface: ['chevron-left', 'check', 'x', 'eye', 'calendar'],
  settings: ['sun', 'globe', 'volume2', 'bell', 'lock', 'shield', 'help-circle']
} as const;

export const ICON_NAMES = [
  'clock', 'layout', 'book-open', 'settings', 'tarot-cards', 'moon',
  'star', 'sparkles', 'zap', 'rotate-ccw', 'save', 'crown', 'shuffle',
  'chevron-left', 'check', 'x', 'eye', 'calendar', 'sun', 'globe',
  'volume2', 'bell', 'lock', 'shield', 'help-circle'
] as const;

export type IconName = typeof ICON_NAMES[number];
export type IconCategory = keyof typeof ICON_CATEGORIES;
```

### 5.3 이미지 에셋 인덱스 생성
**`src/assets/images/index.ts`에 정확히 복사:**

```typescript
/**
 * 타로 타이머 앱 이미지 에셋 인덱스
 */

// 앱 로고
export { default as AppLogoMain } from './app-logo-main.svg';
export { default as AppLogoIcon } from './app-logo-icon.svg';

// 타로 카드 관련
export { default as TarotCardBack } from './tarot-card-back.svg';
export { default as CardPlaceholder } from './card-placeholder.svg';

// 배경 및 텍스처
export { default as MysticalTextureDark } from './mystical-texture-dark.svg';
export { default as MysticalTextureLight } from './mystical-texture-light.svg';
export { default as SacredGeometryPattern } from './sacred-geometry-pattern.svg';

// 효과
export { default as SparkleEffect } from './sparkle-effect.svg';

export const IMAGE_CATEGORIES = {
  branding: ['app-logo-main', 'app-logo-icon'],
  tarot: ['tarot-card-back', 'card-placeholder'],
  backgrounds: ['mystical-texture-dark', 'mystical-texture-light', 'sacred-geometry-pattern'],
  effects: ['sparkle-effect']
} as const;
```

### 5.4 React 아이콘 컴포넌트 생성
**`src/components/mystical-ui/icons.tsx`에 정확히 복사:**

```typescript
import React from 'react';

// 모든 아이콘을 SVG로 정의
export const Clock = ({ className = "", ...props }) => (
  <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
);

export const Layout = ({ className = "", ...props }) => (
  <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
    <line x1="9" x2="9" y1="9" y2="21"/>
    <line x1="15" x2="15" y1="9" y2="21"/>
  </svg>
);

export const BookOpen = ({ className = "", ...props }) => (
  <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

export const Settings = ({ className = "", ...props }) => (
  <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

export const TarotCards = ({ className = "", ...props }) => (
  <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="14" height="20" x="5" y="2" rx="2" ry="2"/>
    <circle cx="12" cy="8" r="2"/>
    <path d="m9 12 2 2 4-4"/>
  </svg>
);

export const Star = ({ className = "", ...props }) => (
  <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
  </svg>
);

export const Sparkles = ({ className = "", ...props }) => (
  <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
    <path d="M20 3v4"/>
    <path d="M22 5h-4"/>
    <path d="M4 17v2"/>
    <path d="M5 18H3"/>
  </svg>
);

export const Zap = ({ className = "", ...props }) => (
  <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
  </svg>
);

export const RotateCcw = ({ className = "", ...props }) => (
  <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
  </svg>
);

export const Save = ({ className = "", ...props }) => (
  <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17,21 17,13 7,13 7,21"/>
    <polyline points="7,3 7,8 15,8"/>
  </svg>
);

export const Crown = ({ className = "", ...props }) => (
  <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11.562 3.266a.5.5 0 0 1 .876 0L14.8 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519L20.625 18.5a1 1 0 0 1-.993.5H4.368a1 1 0 0 1-.993-.5L2.02 6.019a.5.5 0 0 1 .798-.519l4.867 3.664a1 1 0 0 0 1.516-.294z"/>
  </svg>
);

export const Calendar = ({ className = "", ...props }) => (
  <svg className={className} {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8 2v4"/>
    <path d="M16 2v4"/>
    <rect width="18" height="18" x="3" y="4" rx="2"/>
    <path d="M3 10h18"/>
  </svg>
);
```

### 5.5 골드 색상 아이콘 적용 방법

**모든 아이콘은 `currentColor`를 사용하므로 CSS 클래스로 색상을 제어합니다:**

```jsx
{/* 기본 사용법 */}
<Clock className="w-6 h-6 text-yellow-400" />
<TarotCards className="w-14 w-14 text-yellow-400 animate-mystical-pulse" />

{/* 다양한 골드 색상 변형 */}
<Crown className="h-6 w-6 text-premium-gold" />  {/* CSS 변수 사용 */}
<Star className="h-4 w-4 text-yellow-400" />     {/* Tailwind 클래스 */}
<Zap className="h-5 w-5 text-accent" />          {/* 테마 토큰 사용 */}

{/* 글로우 효과와 함께 */}
<div className="relative">
  <Sparkles className="h-5 w-5 text-yellow-400" />
  <div className="absolute inset-0 bg-yellow-400/30 blur-lg rounded-full"></div>
</div>

{/* 애니메이션과 함께 */}
<TarotCards className="h-14 w-14 text-yellow-400 animate-mystical-pulse" />
```

**사용 가능한 골드 색상 클래스들:**
- `text-yellow-400` - 기본 골드
- `text-yellow-500` - 진한 골드
- `text-premium-gold` - 브랜드 골드 (CSS 변수)
- `text-accent` - 테마 액센트 (자동으로 라이트/다크 모드 대응)

### 5.6 아이콘 에셋을 React 컴포넌트로 사용하는 방법

**방법 1: 직접 SVG 파일 import (권장하지 않음)**
```jsx
import ClockSvg from '../assets/icons/clock.svg';
// 이 방법은 색상 제어가 어려움
```

**방법 2: React 컴포넌트로 변환 (현재 사용 방법)**
```jsx
import { Clock, TarotCards, Star } from './components/mystical-ui/icons';
// currentColor 사용으로 완벽한 색상 제어 가능
```

---

## 🧱 6단계: UI 컴포넌트 시스템

### 6.1 components.tsx 파일 생성
**`src/components/mystical-ui/components.tsx`에 정확히 복사:**

```typescript
import React, { TextareaHTMLAttributes, forwardRef } from 'react';

// Card 컴포넌트
interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = "", onClick }) => (
  <div 
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

export const CardTitle: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>
    {children}
  </h3>
);

// Button 컴포넌트
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  variant?: 'default' | 'outline';
  size?: 'sm' | 'default' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  disabled = false, 
  className = "",
  variant = 'default',
  size = 'default'
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
  };
  
  const sizeClasses = {
    sm: "h-9 rounded-md px-3",
    default: "h-10 px-4 py-2",
    lg: "h-11 rounded-md px-8"
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Badge 컴포넌트
interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  className = "", 
  variant = 'default' 
}) => {
  const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  const variantClasses = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    outline: "text-foreground"
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

// Textarea 컴포넌트
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <textarea
        className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);

// ImageWithFallback 컴포넌트
interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ 
  src, 
  alt, 
  className = "",
  fallback = "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400"
}) => {
  const [imgSrc, setImgSrc] = React.useState(src);
  
  const handleError = () => {
    setImgSrc(fallback);
  };

  return (
    <img 
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
};
```

---

## 🚀 7단계: Timer 컴포넌트 완전 구현

### 7.1 App.tsx 메인 파일
**`src/App.tsx`에 다음을 정확히 복사:**

```typescript
import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './utils/language';
import { 
  TarotCard, 
  DailyTarotSave,
  generateDailyCards,
  getCurrentHour,
  formatHour,
  formatDate,
  saveDailyTarot,
  getTodaysSave
} from './utils/tarot-data';

// Import icons
import {
  Clock,
  TarotCards,
  Star,
  Sparkles,
  Zap,
  RotateCcw,
  Save,
  BookOpen
} from './components/mystical-ui/icons';

// Import UI components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Textarea,
  ImageWithFallback
} from './components/mystical-ui/components';

// CSS 파일 import
import './styles/globals.css';

// Timer Component
function Timer() {
  const { t, language } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hourlyMemos, setHourlyMemos] = useState<{ [hour: number]: string }>({});
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [hasDrawnAll24Cards, setHasDrawnAll24Cards] = useState(false);
  const [isDrawingAll, setIsDrawingAll] = useState(false);
  const [dailyCards, setDailyCards] = useState<TarotCard[]>([]);
  const [isDailyTarotSaved, setIsDailyTarotSaved] = useState(false);
  const [showRecordingSection, setShowRecordingSection] = useState(false);
  
  const currentHour = getCurrentHour();
  
  // 컴포넌트 마운트 시 오늘의 카드들과 저장 상태 확인
  useEffect(() => {
    const todaysSave = getTodaysSave();
    if (todaysSave) {
      setDailyCards(todaysSave.hourlyCards);
      setHasDrawnAll24Cards(true);
      setIsDailyTarotSaved(true);
      setShowRecordingSection(true);
      setHourlyMemos(todaysSave.memos || {});
    } else {
      setDailyCards([]);
      setHasDrawnAll24Cards(false);
      setIsDailyTarotSaved(false);
      setShowRecordingSection(false);
      setHourlyMemos({});
    }
  }, []);
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  const currentCard = dailyCards[currentHour] || null;
  
  // 24시간 카드 한번에 뽑기
  const drawAll24Cards = () => {
    setIsDrawingAll(true);
    
    setTimeout(() => {
      try {
        const newDailyCards = generateDailyCards(currentTime);
        
        if (newDailyCards.length === 24) {
          setDailyCards(newDailyCards);
          setHasDrawnAll24Cards(true);
          setIsDailyTarotSaved(false);
          setShowRecordingSection(true);
          setSelectedCardIndex(currentHour);
          setHourlyMemos({});
        } else {
          console.error('Failed to generate 24 cards, got:', newDailyCards.length);
          alert('카드를 생성하는데 문제가 발생했습니다. 다시 시도해주세요.');
        }
      } catch (error) {
        console.error('Error generating daily cards:', error);
        alert('카드를 생성하는데 문제가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setIsDrawingAll(false);
      }
    }, 2000);
  };
  
  // 다시 뽑기
  const redrawAll24Cards = () => {
    setIsDrawingAll(true);
    
    setTimeout(() => {
      try {
        const newDailyCards = generateDailyCards(new Date(currentTime.getTime() + Math.random() * 1000));
        
        if (newDailyCards.length === 24) {
          setDailyCards(newDailyCards);
          setHasDrawnAll24Cards(true);
          setIsDailyTarotSaved(false);
          setShowRecordingSection(true);
          setSelectedCardIndex(currentHour);
          setHourlyMemos({});
        } else {
          console.error('Failed to generate 24 cards, got:', newDailyCards.length);
          alert('카드를 재생성하는데 문제가 발생했습니다. 다시 시도해주세요.');
        }
      } catch (error) {
        console.error('Error regenerating daily cards:', error);
        alert('카드를 재생성하는데 문제가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setIsDrawingAll(false);
      }
    }, 2000);
  };
  
  const handleCardClick = (index: number) => {
    setSelectedCardIndex(index);
  };
  
  // 현재 선택된 카드 시간의 메모 업데이트
  const handleMemoChange = (value: string) => {
    const targetHour = selectedCardIndex !== null ? selectedCardIndex : currentHour;
    setHourlyMemos(prev => ({
      ...prev,
      [targetHour]: value
    }));
  };
  
  // 데일리 타로 저장하기
  const saveDailyTarotReading = () => {
    if (!hasDrawnAll24Cards || dailyCards.length === 0) return;
    
    const dailyTarotSave: DailyTarotSave = {
      id: Date.now().toString(),
      date: currentTime.toDateString(),
      hourlyCards: dailyCards,
      memos: hourlyMemos,
      insights: Object.values(hourlyMemos).join('\n') || 'Today\'s 24-hour tarot reading',
      savedAt: new Date().toISOString()
    };
    
    saveDailyTarot(dailyTarotSave);
    setIsDailyTarotSaved(true);
    
    // 성공 메시지
    alert('Daily tarot reading has been saved to your journal!');
  };
  
  const selectedCard = selectedCardIndex !== null ? dailyCards[selectedCardIndex] : currentCard;
  const isCurrentHourSelected = selectedCardIndex === currentHour;
  const currentMemo = hourlyMemos[selectedCardIndex !== null ? selectedCardIndex : currentHour] || '';
  
  // Enhanced time display formatting with mystical styling
  const formatTimeDisplay = (hour: number) => {
    const timeText = formatHour(hour);
    const parts = timeText.split(' ');
    
    if (parts.length >= 2) {
      return (
        <div className="text-center">
          <div className="text-sm text-yellow-400/80 font-medium tracking-wider uppercase">
            {t('timer.currentHour')}
          </div>
          <div className="text-3xl font-bold text-white mt-1">
            {parts[0]} {parts[1]}
          </div>
        </div>
      );
    }
    
    return (
      <div className="text-3xl font-bold text-white">
        {timeText}
      </div>
    );
  };
  
  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, #1a1f3a 0%, #4a1a4f 50%, #1a1f3a 100%)'
    }}>
      {/* Mystical Background Effects */}
      <div className="absolute inset-0 opacity-50 animate-pulse pointer-events-none" style={{
        background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.05), transparent)'
      }}></div>
      <div className="absolute top-10 left-10 w-2 h-2 rounded-full animate-ping" style={{
        backgroundColor: '#d4af37',
        animationDelay: '1000ms'
      }}></div>
      <div className="absolute top-32 right-16 w-1 h-1 bg-white rounded-full animate-pulse" style={{
        animationDelay: '2000ms'
      }}></div>
      <div className="absolute bottom-40 left-20 w-1.5 h-1.5 rounded-full animate-ping" style={{
        backgroundColor: '#d4af37',
        animationDelay: '500ms'
      }}></div>
      <div className="absolute top-64 left-1/2 w-1 h-1 bg-white rounded-full animate-pulse" style={{
        animationDelay: '3000ms'
      }}></div>
      
      <div className="relative z-10 container mx-auto px-6 py-8 max-w-md space-y-8">
        
        {/* Mystical Header */}
        <div className="text-center space-y-6 pt-8">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full"></div>
            <div className="relative space-y-2">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <TarotCards className="h-14 w-14 text-yellow-400 animate-mystical-pulse" />
                  <div className="absolute inset-0 bg-yellow-400/30 blur-lg rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-white to-yellow-400 bg-clip-text text-transparent">
                {t('timer.title')}
              </h1>
              
              <p className="text-white/70 text-sm font-medium tracking-wide">
                {formatDate(currentTime)}
              </p>
              
              {hasDrawnAll24Cards && currentCard && (
                <div className="mt-6">
                  {formatTimeDisplay(selectedCardIndex !== null ? selectedCardIndex : currentHour)}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Current Card Display - Enhanced for mystical feel */}
        {hasDrawnAll24Cards && selectedCard && (
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20 blur-2xl rounded-3xl"></div>
            <Card className="relative bg-white/10 backdrop-blur-lg border border-white/20 shadow-2xl">
              <CardContent className="p-6 space-y-6">
                {/* Card Image */}
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-yellow-400/30 blur-xl rounded-2xl"></div>
                    <div className="relative w-64 h-96 rounded-2xl overflow-hidden shadow-2xl border-2 border-yellow-400/50">
                      <ImageWithFallback
                        src={selectedCard.imageUrl}
                        alt={language === 'ko' ? selectedCard.nameKr : selectedCard.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                      
                      {/* Card overlay info */}
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-bold text-xl drop-shadow-lg">
                          {language === 'ko' ? selectedCard.nameKr : selectedCard.name}
                        </h3>
                        <p className="text-white/90 text-sm mt-1 drop-shadow">
                          {language === 'ko' ? selectedCard.name : selectedCard.nameKr}
                        </p>
                      </div>
                      
                      {isCurrentHourSelected && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-yellow-400/90 text-black border-none shadow-lg">
                            <Star className="h-3 w-3 mr-1" />
                            {t('timer.now')}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Card Details */}
                <div className="text-center space-y-4 p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex flex-wrap justify-center gap-2">
                    {(language === 'ko' ? selectedCard.keywordsKr : selectedCard.keywords).map((keyword, index) => (
                      <Badge key={index} variant="outline" className="border-yellow-400/40 text-yellow-400 bg-yellow-400/10">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-white/90 leading-relaxed max-w-sm mx-auto">
                    {language === 'ko' ? selectedCard.meaningKr : selectedCard.meaning}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* 24시간 카드 뽑기 버튼 */}
        {!hasDrawnAll24Cards && (
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/30 to-purple-600/30 blur-xl rounded-2xl"></div>
            <Card className="relative bg-white/10 backdrop-blur-lg border border-white/20">
              <CardContent className="p-6 text-center space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <Zap className="h-12 w-12 text-yellow-400 animate-pulse" />
                      <div className="absolute inset-0 bg-yellow-400/30 blur-lg rounded-full"></div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    {t('timer.revealDestiny')}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {t('timer.cosmicMessage')}
                  </p>
                </div>
                <Button 
                  onClick={drawAll24Cards} 
                  disabled={isDrawingAll}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold py-4 text-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-500 shadow-2xl disabled:opacity-50"
                >
                  {isDrawingAll ? (
                    <div className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5 animate-spin" />
                      {t('timer.drawingCards')}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Zap className="h-5 w-5" />
                      {t('timer.drawCards')}
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* 24-Hour Cards Scroll - Enhanced for touch scrolling */}
        {hasDrawnAll24Cards && dailyCards.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-400" />
                {t('timer.energyFlow')}
              </h2>
              <Button 
                onClick={redrawAll24Cards} 
                disabled={isDrawingAll}
                variant="outline" 
                size="sm"
                className="border-yellow-400/30 text-yellow-400 bg-yellow-400/5 hover:bg-yellow-400/10"
              >
                {isDrawingAll ? (
                  <>
                    <Sparkles className="h-3 w-3 mr-1 animate-spin" />
                    {t('timer.reshuffling')}
                  </>
                ) : (
                  <>
                    <RotateCcw className="h-3 w-3 mr-1" />
                    {t('timer.redraw')}
                  </>
                )}
              </Button>
            </div>
            
            {/* Enhanced horizontal scroll with touch optimization */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-current to-transparent z-10 pointer-events-none" style={{
                background: 'linear-gradient(to right, #1a1f3a, transparent)'
              }}></div>
              <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-current to-transparent z-10 pointer-events-none" style={{
                background: 'linear-gradient(to left, #1a1f3a, transparent)'
              }}></div>
              
              <div className="overflow-x-auto pb-2 scrollbar-none">
                <div className="flex gap-3 px-4" style={{ width: 'max-content' }}>
                  {dailyCards.map((card, index) => (
                    <div
                      key={`${card.id}-${index}`}
                      className={`flex-shrink-0 cursor-pointer transition-all duration-500 ${
                        selectedCardIndex === index ? 'scale-110 z-10' : 'hover:scale-105'
                      }`}
                      onClick={() => handleCardClick(index)}
                    >
                      <div className="text-center space-y-2">
                        <div className={`relative w-16 h-24 rounded-lg overflow-hidden transition-all duration-300 ${
                          selectedCardIndex === index 
                            ? 'ring-2 ring-yellow-400 shadow-2xl shadow-yellow-400/30' 
                            : 'shadow-lg hover:shadow-xl'
                        } ${
                          index === currentHour 
                            ? 'ring-2 ring-white shadow-xl shadow-white/20' 
                            : ''
                        }`}>
                          <ImageWithFallback
                            src={card.imageUrl}
                            alt={language === 'ko' ? card.nameKr : card.name}
                            className="w-full h-full object-cover"
                          />
                          {index === currentHour && (
                            <div className="absolute inset-0 bg-white/10"></div>
                          )}
                          {selectedCardIndex === index && (
                            <div className="absolute inset-0 bg-yellow-400/20"></div>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <p className={`text-xs font-medium ${
                            index === currentHour ? 'text-yellow-400 font-bold' : 'text-white/70'
                          }`}>
                            {formatHour(index)}
                          </p>
                          {index === currentHour && (
                            <Badge variant="default" className="text-xs px-2 py-0 bg-yellow-400 text-black">
                              {t('timer.now')}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Recording Section - 카드별 메모 시스템 */}
        {showRecordingSection && (
          <div className="space-y-6">
            {/* Card-specific Journal */}
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600/30 to-yellow-400/20 blur-xl rounded-2xl"></div>
              <Card className="relative bg-white/10 backdrop-blur-lg border border-white/20">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl text-white flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-yellow-400" />
                    {t('timer.sacredJournal')}
                    {selectedCardIndex !== null && (
                      <Badge className="text-xs bg-yellow-400/20 text-yellow-400 border-yellow-400/30">
                        {formatHour(selectedCardIndex)}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder={t('timer.journalPlaceholder')}
                    value={currentMemo}
                    onChange={(e) => handleMemoChange(e.target.value)}
                    className="min-h-[120px] resize-none bg-white/5 border-white/20 text-white placeholder:text-white/50 focus:border-yellow-400/50"
                  />
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white/50">
                      {currentMemo.length}/500 {t('common.characters')}
                    </span>
                    {selectedCardIndex !== null && (
                      <span className="text-yellow-400 text-xs">
                        {language === 'ko' ? `${formatHour(selectedCardIndex)} 카드 메모` : `${formatHour(selectedCardIndex)} Card Memo`}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Save Daily Tarot Button */}
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/40 to-yellow-500/40 blur-lg rounded-xl"></div>
              <Button
                onClick={saveDailyTarotReading}
                disabled={isDailyTarotSaved}
                className={`relative w-full py-4 text-lg font-bold transition-all duration-500 ${
                  isDailyTarotSaved 
                    ? 'bg-green-500 text-white shadow-2xl shadow-green-500/30' 
                    : 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 shadow-2xl shadow-yellow-400/30'
                }`}
              >
                <Save className="h-5 w-5 mr-2" />
                {isDailyTarotSaved ? t('timer.saved') : t('timer.saveReading')}
              </Button>
            </div>
          </div>
        )}
        
        {/* Mystical Quote */}
        <div className="text-center p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
          <p className="text-white/80 italic leading-relaxed">
            {t('timer.quote')}
          </p>
        </div>
        
        {/* Bottom padding for navigation */}
        <div className="h-20"></div>
      </div>
    </div>
  );
}

// Main App Component
function AppContent() {
  return (
    <div className="min-h-screen dark">
      <Timer />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
```

---

## ✅ 8단계: 실행 및 확인

### 8.1 실행하기
```bash
npm start
```

### 8.2 확인해야 할 요소들
1. **배경 그라데이션**: `linear-gradient(135deg, #1a1f3a 0%, #4a1a4f 50%, #1a1f3a 100%)`이 제대로 나타나는지 확인
2. **신비로운 파티클들**: 다양한 위치에서 반짝이는 점들이 애니메이션되는지 확인
3. **24시간 카드 뽑기 버튼**: 클릭 시 2초 후 카드들이 생성되는지 확인
4. **카드 스크롤**: 좌우 스크롤이 부드럽게 작동하는지 확인
5. **메모 시스템**: 카드 선택 시 해당 시간의 메모를 작성할 수 있는지 확인
6. **저장 기능**: 일일 타로 저장이 정상 작동하는지 확인
7. **언어 전환**: 한국어/영어 전환이 모든 텍스트에 적용되는지 확인

---

## 🎯 핵심 포인트

1. **정확한 색상값**: CSS에서 정의된 색상값을 정확히 사용
2. **신비로운 효과**: 파티클 애니메이션과 글로우 효과가 핵심
3. **상태 관리**: 24시간 카드 시스템의 복잡한 상태 로직 정확히 구현
4. **레이아웃**: 모바일 우선 반응형 디자인 (max-w-md)
5. **애니메이션**: mystical-pulse와 다양한 hover 효과들

이 가이드를 정확히 따라하면 원본과 100% 동일한 Timer 화면을 구현할 수 있습니다. 각 단계를 빠뜨리지 않고 정확히 복사해서 사용하시기 바랍니다.