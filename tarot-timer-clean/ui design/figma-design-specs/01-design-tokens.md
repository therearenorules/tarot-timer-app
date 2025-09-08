# 타로 타이머 앱 - 완전한 디자인 토큰 스펙

## 🎨 브랜드 컬러 팔레트

### 기본 컬러 (Primary Colors)
```
Deep Purple (주색상)    : #4A1A4F
Midnight Blue (보조색상) : #1A1F3A  
Premium Gold (강조색상)  : #D4AF37
White Base              : #FFFFFF
Black Base              : #000000
```

### 라이트 모드 토큰
```css
/* 배경 색상 */
--background-primary    : #FFFFFF
--background-secondary  : #FAFAFA
--background-tertiary   : #F8F6F9

/* 텍스트 색상 */
--text-primary         : #1A1F3A    /* Midnight Blue */
--text-secondary       : #4A1A4F    /* Deep Purple */
--text-tertiary        : #6B7280    /* Gray */
--text-quaternary      : #8E8E93    /* Light Gray */

/* 액센트 색상 */
--accent-primary       : #D4AF37    /* Premium Gold */
--accent-secondary     : #4A1A4F    /* Deep Purple */

/* 시스템 색상 */
--border-default       : #E8E1E8
--border-focus         : #4A1A4F
--divider             : #E8E1E8
--surface-elevated    : #FFFFFF
--overlay             : rgba(26, 31, 58, 0.4)
```

### 다크 모드 토큰
```css
/* 배경 색상 */
--background-primary    : #0F0F1A
--background-secondary  : #1A1F3A    /* Midnight Blue */
--background-tertiary   : #2A2F4A

/* 텍스트 색상 */
--text-primary         : #FFFFFF
--text-secondary       : #C8B8D4    /* Light Purple */
--text-tertiary        : #8A8A9A    /* Gray */
--text-quaternary      : #6B6B7B    /* Dark Gray */

/* 액센트 색상 */
--accent-primary       : #F4D03F    /* Lighter Gold */
--accent-secondary     : #7A5A7F    /* Lighter Purple */

/* 시스템 색상 */
--border-default       : #2A2F4A
--border-focus         : #7A5A7F
--divider             : #2A2F4A
--surface-elevated    : #1A1F3A
--overlay             : rgba(15, 15, 26, 0.8)
```

### 의미적 색상 (Semantic Colors)
```css
/* 성공 */
--success-light        : #28A745
--success-dark         : #34CE57

/* 경고 */
--warning-light        : #FFC107
--warning-dark         : #FFD60A

/* 오류 */
--error-light          : #DC3545
--error-dark           : #FF453A

/* 정보 */
--info-light           : #17A2B8
--info-dark            : #64D2FF
```

## 📏 스페이싱 시스템

### 기본 그리드: 8pt
```css
--space-xxs           : 2px     /* 0.25x */
--space-xs            : 4px     /* 0.5x */
--space-s             : 8px     /* 1x */
--space-m             : 16px    /* 2x */
--space-l             : 24px    /* 3x */
--space-xl            : 32px    /* 4x */
--space-xxl           : 40px    /* 5x */
--space-xxxl          : 48px    /* 6x */
```

### 컴포넌트별 스페이싱
```css
/* 카드 컴포넌트 */
--card-padding        : 16px    /* M */
--card-margin         : 24px    /* L */
--card-gap            : 16px    /* M */

/* 버튼 컴포넌트 */
--button-padding-h    : 24px    /* L */
--button-padding-v    : 12px    /* 1.5x */
--button-gap          : 8px     /* S */

/* 네비게이션 */
--nav-height          : 80px    /* 10x */
--nav-padding         : 16px    /* M */
--nav-tab-gap         : 4px     /* XS */

/* 리스트 아이템 */
--list-item-height    : 56px    /* 7x */
--list-item-padding   : 16px    /* M */
--list-gap            : 8px     /* S */
```

## ✍️ 타이포그래피 시스템

### 폰트 패밀리
```css
--font-primary        : -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif
--font-korean-optimized: "SF Pro Display", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif
```

### 타입 스케일
```css
/* Display */
--text-display-large  : 32px    /* 2.286rem */
--text-display-medium : 28px    /* 2rem */

/* Title */
--text-title-large    : 24px    /* 1.714rem */
--text-title-medium   : 20px    /* 1.429rem */
--text-title-small    : 18px    /* 1.286rem */

/* Body */
--text-body-large     : 16px    /* 1.143rem */
--text-body-medium    : 14px    /* 1rem - base */
--text-body-small     : 12px    /* 0.857rem */

/* Caption */
--text-caption        : 11px    /* 0.786rem */
--text-overline       : 10px    /* 0.714rem */
```

### 폰트 웨이트
```css
--font-weight-regular : 400
--font-weight-medium  : 500
--font-weight-semibold: 600
--font-weight-bold    : 700
```

### 라인 하이트
```css
--line-height-tight   : 1.2
--line-height-normal  : 1.4
--line-height-relaxed : 1.6
--line-height-loose   : 1.8
```

### 한국어 최적화
```css
/* 한국어 텍스트 라인 하이트 */
--line-height-korean-tight   : 1.4
--line-height-korean-normal  : 1.6
--line-height-korean-relaxed : 1.8

/* 문자 간격 */
--letter-spacing-tight  : -0.5px
--letter-spacing-normal : 0px
--letter-spacing-wide   : 0.5px
```

## 🔄 모션 & 애니메이션

### 이징 함수
```css
--easing-standard     : cubic-bezier(0.4, 0.0, 0.2, 1)
--easing-decelerate   : cubic-bezier(0.0, 0.0, 0.2, 1)
--easing-accelerate   : cubic-bezier(0.4, 0.0, 1, 1)
--easing-sharp        : cubic-bezier(0.4, 0.0, 0.6, 1)
```

### 지속 시간
```css
--duration-fast       : 150ms    /* 마이크로 인터랙션 */
--duration-normal     : 300ms    /* 표준 전환 */
--duration-slow       : 500ms    /* 페이지 전환 */
--duration-very-slow  : 800ms    /* 특별한 효과 */
```

### 신비로운 애니메이션
```css
/* 맥박 효과 */
--mystical-pulse      : mystical-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite

/* 글로우 효과 */
--glow-small          : 0 0 12px rgba(212, 175, 55, 0.3)
--glow-medium         : 0 0 24px rgba(212, 175, 55, 0.4)
--glow-large          : 0 0 36px rgba(212, 175, 55, 0.5)

/* 깜빡임 효과 */
--twinkle-delay-1     : 1000ms
--twinkle-delay-2     : 2000ms
--twinkle-delay-3     : 500ms
--twinkle-delay-4     : 3000ms
```

## 📱 반응형 브레이크포인트

### 디바이스 기준
```css
--breakpoint-xs       : 320px    /* iPhone SE */
--breakpoint-sm       : 375px    /* iPhone */
--breakpoint-md       : 414px    /* iPhone Plus */
--breakpoint-lg       : 768px    /* iPad */
--breakpoint-xl       : 1024px   /* iPad Pro */
```

### 컨테이너 최대 너비
```css
--container-max-width : 375px    /* 모바일 최적화 */
--content-max-width   : 343px    /* 16px 마진 제외 */
```

## 🎯 터치 타겟

### 최소 크기
```css
--touch-target-min    : 44px     /* iOS 가이드라인 */
--touch-target-recommended: 48px /* 권장 크기 */
--touch-target-spacing: 8px      /* 최소 간격 */
```

## 🌗 그림자 시스템

### 엘리베이션 레벨
```css
/* 레벨 1: 카드 */
--shadow-level-1      : 0 2px 8px rgba(74, 26, 79, 0.12)

/* 레벨 2: 떠있는 버튼 */
--shadow-level-2      : 0 4px 16px rgba(74, 26, 79, 0.16)

/* 레벨 3: 모달 */
--shadow-level-3      : 0 8px 32px rgba(74, 26, 79, 0.2)

/* 레벨 4: 드롭다운 */
--shadow-level-4      : 0 16px 48px rgba(74, 26, 79, 0.24)

/* 신비로운 그림자 */
--shadow-mystical     : 0 8px 32px rgba(212, 175, 55, 0.3)
--shadow-premium      : 0 12px 48px rgba(212, 175, 55, 0.4)
```

## 🔗 보더 & 라디우스

### 보더 두께
```css
--border-thin         : 1px
--border-medium       : 2px
--border-thick        : 3px
```

### 라디우스 값
```css
--radius-none         : 0px
--radius-sm           : 4px
--radius-md           : 6px
--radius-lg           : 8px      /* 기본값 */
--radius-xl           : 12px
--radius-2xl          : 16px
--radius-full         : 9999px   /* 원형 */
```

## 🔍 접근성 기준

### 색상 대비
```css
--contrast-ratio-min  : 4.5      /* 일반 텍스트 */
--contrast-ratio-large: 3.0      /* 큰 텍스트 */
--contrast-ratio-ui   : 3.0      /* UI 요소 */
```

### 포커스 표시
```css
--focus-ring-width    : 2px
--focus-ring-color    : var(--accent-primary)
--focus-ring-offset   : 2px
--focus-ring-style    : solid
```

## 🎴 타로 카드 특화 토큰

### 카드 크기
```css
/* 기본 카드 비율: 2:3 */
--card-ratio          : 0.667    /* width/height */

/* 사이즈별 카드 크기 */
--card-thumb-width    : 50px     /* 썸네일 */
--card-thumb-height   : 75px

--card-small-width    : 70px     /* 작은 카드 */
--card-small-height   : 105px

--card-medium-width   : 90px     /* 중간 카드 */
--card-medium-height  : 135px

--card-large-width    : 120px    /* 큰 카드 */
--card-large-height   : 180px

--card-display-width  : 200px    /* 디스플레이 카드 */
--card-display-height : 300px
```

### 스프레드별 간격
```css
/* 켈틱 크로스 */
--celtic-card-gap     : 16px
--celtic-cross-size   : 350px

/* 3카드 스프레드 */
--three-card-gap      : 20px
--three-card-width    : 300px

/* AB 선택 스프레드 */
--ab-choice-gap       : 24px
--ab-choice-width     : 320px

/* 릴레이션십 스프레드 */
--relationship-gap    : 12px
--relationship-width  : 280px
```

### 신비로운 효과
```css
/* 백그라운드 그라데이션 */
--gradient-mystical   : linear-gradient(135deg, #1a1f3a 0%, #4a1a4f 50%, #1a1f3a 100%)
--gradient-premium    : linear-gradient(45deg, #d4af37 0%, #f4d03f 100%)
--gradient-surface    : linear-gradient(180deg, rgba(212, 175, 55, 0.05) 0%, transparent 100%)

/* 백드롭 블러 */
--backdrop-blur-sm    : 4px
--backdrop-blur-md    : 8px
--backdrop-blur-lg    : 12px
--backdrop-blur-xl    : 16px
```