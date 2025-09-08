# 🎯 타로 타이머 앱 - Timer 화면 완전 구현 가이드

## 개요
클로드코드에서 타로 타이머 앱의 Timer 화면을 100% 정확히 재현하기 위한 완전한 단계별 가이드입니다. 에셋 폴더에 저장된 25개 아이콘과 8개 이미지를 활용하여 완벽한 골드색 아이콘 시스템을 구현합니다.

---

## 📁 1단계: 에셋 폴더 활용 및 구조 설정

### 1.1 현재 에셋 구조 확인
```
/assets/
├── icons/ (25개 SVG 아이콘)
│   ├── bell.svg, book-open.svg, calendar.svg, check.svg, chevron-left.svg
│   ├── clock.svg, crown.svg, eye.svg, globe.svg, help-circle.svg
│   ├── layout.svg, lock.svg, moon.svg, rotate-ccw.svg, save.svg
│   ├── settings.svg, shield.svg, shuffle.svg, sparkles.svg, star.svg
│   ├── sun.svg, tarot-cards.svg, volume2.svg, x.svg, zap.svg
│   └── index.ts
└── images/ (8개 이미지 에셋)
    ├── app-logo-main.svg, app-logo-icon.svg, card-placeholder.svg
    ├── mystical-texture-dark.svg, mystical-texture-light.svg
    ├── sacred-geometry-pattern.svg, sparkle-effect.svg, tarot-card-back.svg
    └── index.ts
```

### 1.2 React 컴포넌트로 아이콘 변환
**핵심: 에셋 폴더의 SVG들을 React 컴포넌트로 변환하여 골드색 적용 가능하게 만들기**

**`src/components/mystical-ui/icons.tsx` 완전 구현:**

```typescript
import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// 네비게이션 아이콘들
export function Clock({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <polyline points="12,6 12,12 16,14" strokeWidth="2" />
    </svg>
  );
}

export function Layout({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
      <line x1="9" y1="9" x2="15" y2="9" strokeWidth="2" />
      <line x1="9" y1="15" x2="15" y2="15" strokeWidth="2" />
    </svg>
  );
}

export function BookOpen({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" strokeWidth="2" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" strokeWidth="2" />
    </svg>
  );
}

export function Settings({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <circle cx="12" cy="12" r="3" strokeWidth="2" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" strokeWidth="2" />
    </svg>
  );
}

// 브랜드 아이콘들
export function TarotCards({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      {/* 왼쪽 카드 (15도 회전) */}
      <g transform="rotate(-15 8 12)">
        <rect x="5" y="7" width="6" height="10" rx="1" ry="1" strokeWidth="1.5" fill="none" />
        <line x1="6" y1="9" x2="10" y2="9" strokeWidth="1" />
        <line x1="6" y1="11" x2="10" y2="11" strokeWidth="1" />
        <circle cx="8" cy="13.5" r="1" strokeWidth="1" fill="currentColor" />
      </g>
      
      {/* 중앙 카드 (똑바로) */}
      <g>
        <rect x="9" y="5" width="6" height="10" rx="1" ry="1" strokeWidth="1.5" fill="none" />
        <line x1="10" y1="7" x2="14" y2="7" strokeWidth="1" />
        <line x1="10" y1="9" x2="14" y2="9" strokeWidth="1" />
        <circle cx="12" cy="11.5" r="1" strokeWidth="1" fill="currentColor" />
      </g>
      
      {/* 오른쪽 카드 (-15도 회전) */}
      <g transform="rotate(15 16 12)">
        <rect x="13" y="7" width="6" height="10" rx="1" ry="1" strokeWidth="1.5" fill="none" />
        <line x1="14" y1="9" x2="18" y2="9" strokeWidth="1" />
        <line x1="14" y1="11" x2="18" y2="11" strokeWidth="1" />
        <circle cx="16" cy="13.5" r="1" strokeWidth="1" fill="currentColor" />
      </g>
      
      {/* 신비로운 반짝임 효과 */}
      <g opacity="0.6">
        <circle cx="6" cy="5" r="0.5" fill="currentColor" />
        <circle cx="18" cy="6" r="0.5" fill="currentColor" />
        <circle cx="12" cy="19" r="0.5" fill="currentColor" />
      </g>
    </svg>
  );
}

export function Moon({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" strokeWidth="2" />
    </svg>
  );
}

// 액션 아이콘들
export function Star({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" strokeWidth="2" />
    </svg>
  );
}

export function Sparkles({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" strokeWidth="2" />
      <path d="M20 3v4" strokeWidth="2" />
      <path d="M22 5h-4" strokeWidth="2" />
      <path d="M4 17v2" strokeWidth="2" />
      <path d="M5 18H3" strokeWidth="2" />
    </svg>
  );
}

export function Zap({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10" strokeWidth="2" />
    </svg>
  );
}

export function RotateCcw({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <polyline points="1,4 1,10 7,10" strokeWidth="2" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" strokeWidth="2" />
    </svg>
  );
}

export function Save({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" strokeWidth="2" />
      <polyline points="17,21 17,13 7,13 7,21" strokeWidth="2" />
      <polyline points="7,3 7,8 15,8" strokeWidth="2" />
    </svg>
  );
}

export function Crown({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path d="M2 19h20l-2-8-6 2-2-8-2 8-6-2z" strokeWidth="2" />
    </svg>
  );
}

// 인터페이스 아이콘들
export function Calendar({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
      <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2" />
      <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2" />
      <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2" />
    </svg>
  );
}

export function ChevronLeft({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <polyline points="15,18 9,12 15,6" strokeWidth="2" />
    </svg>
  );
}

export function Check({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <polyline points="20,6 9,17 4,12" strokeWidth="2" />
    </svg>
  );
}

export function X({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" />
      <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" />
    </svg>
  );
}

export function Eye({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2" />
      <circle cx="12" cy="12" r="3" strokeWidth="2" />
    </svg>
  );
}

// 설정 아이콘들
export function Sun({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <circle cx="12" cy="12" r="5" strokeWidth="2" />
      <line x1="12" y1="1" x2="12" y2="3" strokeWidth="2" />
      <line x1="12" y1="21" x2="12" y2="23" strokeWidth="2" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" strokeWidth="2" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" strokeWidth="2" />
      <line x1="1" y1="12" x2="3" y2="12" strokeWidth="2" />
      <line x1="21" y1="12" x2="23" y2="12" strokeWidth="2" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" strokeWidth="2" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" strokeWidth="2" />
    </svg>
  );
}

export function Globe({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <line x1="2" y1="12" x2="22" y2="12" strokeWidth="2" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeWidth="2" />
    </svg>
  );
}

export function Volume2({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <polygon points="11,5 6,9 2,9 2,15 6,15 11,19" strokeWidth="2" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" strokeWidth="2" />
    </svg>
  );
}

export function Bell({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" strokeWidth="2" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeWidth="2" />
    </svg>
  );
}

export function Lock({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" strokeWidth="2" />
      <circle cx="12" cy="16" r="1" strokeWidth="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeWidth="2" />
    </svg>
  );
}

export function Shield({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2" />
    </svg>
  );
}

export function HelpCircle({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <circle cx="12" cy="12" r="10" strokeWidth="2" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" strokeWidth="2" />
      <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2" />
    </svg>
  );
}

export function Shuffle({ className = "w-4 h-4", size }: IconProps) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <polyline points="16,3 21,3 21,8" strokeWidth="2" />
      <line x1="4" y1="20" x2="21" y2="3" strokeWidth="2" />
      <polyline points="21,16 21,21 16,21" strokeWidth="2" />
      <line x1="15" y1="15" x2="21" y2="21" strokeWidth="2" />
      <line x1="4" y1="4" x2="9" y2="9" strokeWidth="2" />
    </svg>
  );
}
```

---

## 🎨 2단계: 골드색 아이콘 적용 시스템

### 2.1 골드 색상 클래스 정의
**`src/styles/globals.css`에 추가:**

```css
/* 브랜드 색상 유틸리티 */
.text-premium-gold { 
  color: var(--premium-gold); 
}
.text-midnight-blue { 
  color: var(--midnight-blue); 
}
.text-deep-purple { 
  color: var(--deep-purple); 
}
```

### 2.2 아이콘 색상 적용 방법
```jsx
{/* Timer 화면의 골드 아이콘 예시 */}
<TarotCards className="h-14 w-14 text-yellow-400 animate-mystical-pulse" />
<Clock className="h-5 w-5 text-yellow-400" />
<BookOpen className="h-5 w-5 text-yellow-400" />
<Save className="h-5 w-5 mr-2" /> {/* 버튼 내부에서는 부모 색상 상속 */}

{/* 글로우 효과와 함께 */}
<div className="relative">
  <TarotCards className="h-14 w-14 text-yellow-400 animate-mystical-pulse" />
  <div className="absolute inset-0 bg-yellow-400/30 blur-lg rounded-full animate-pulse"></div>
</div>

{/* 네비게이션에서 활성 상태 */}
<Clock className={`h-6 w-6 transition-all duration-300 ${
  activeTab === 'timer' ? 'scale-110 drop-shadow-lg' : ''
}`} />
```

---

## 🏗️ 3단계: ImageWithFallback 컴포넌트

### 3.1 ImageWithFallback 구현
**`src/components/figma/ImageWithFallback.tsx` 생성:**

```typescript
import React, { useState } from 'react';

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
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  
  const handleError = () => {
    setImgSrc(fallback);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="relative">
      <img 
        src={imgSrc}
        alt={alt}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm animate-pulse rounded-lg flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin"></div>
        </div>
      )}
    </div>
  );
};
```

---

## 💎 4단계: 완전한 Timer 컴포넌트 구현

### 4.1 App.tsx에서 아이콘 import
```typescript
// 25개 모든 아이콘 import
import {
  Clock,
  Layout,
  BookOpen,
  Settings as SettingsIcon,
  Moon,
  TarotCards,
  Star,
  Sparkles,
  Zap,
  RotateCcw,
  Save,
  Crown,
  Calendar,
  Sun,
  Globe,
  Volume2,
  Bell,
  Lock,
  Shield,
  HelpCircle,
  ChevronLeft,
  Check,
  X,
  Eye,
  Shuffle
} from './components/mystical-ui/icons';
```

### 4.2 Timer 컴포넌트의 아이콘 사용 예시
```jsx
{/* 헤더 아이콘 - 메인 브랜드 아이콘 */}
<div className="relative">
  <TarotCards className="h-14 w-14 text-yellow-400 animate-mystical-pulse" />
  <div className="absolute inset-0 bg-yellow-400/30 blur-lg rounded-full animate-pulse"></div>
</div>

{/* 시간의 흐름 섹션 헤더 */}
<h2 className="text-xl font-bold text-white flex items-center gap-2">
  <Clock className="h-5 w-5 text-yellow-400" />
  {t('timer.energyFlow')}
</h2>

{/* 다시 뽑기 버튼 */}
<Button className="border-yellow-400/30 text-yellow-400 bg-yellow-400/5">
  <RotateCcw className="h-3 w-3 mr-1" />
  {t('timer.redraw')}
</Button>

{/* 성스러운 저널 헤더 */}
<CardTitle className="text-xl text-white flex items-center gap-2">
  <BookOpen className="h-5 w-5 text-yellow-400" />
  {t('timer.sacredJournal')}
</CardTitle>

{/* 저장 버튼 */}
<Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black">
  <Save className="h-5 w-5 mr-2" />
  {t('timer.saveReading')}
</Button>

{/* "지금" 배지 */}
<Badge className="bg-yellow-400/90 text-black border-none shadow-lg">
  <Star className="h-3 w-3 mr-1" />
  {t('timer.now')}
</Badge>
```

---

## 🎯 5단계: 완전한 네비게이션 시스템

### 5.1 하단 탭바의 아이콘 적용
```jsx
{/* 타이머 탭 */}
<button className={`flex flex-col items-center gap-2 p-4 transition-all duration-300 ${
  activeTab === 'timer' ? 'text-yellow-400 bg-yellow-400/10' : 'text-white/60'
}`}>
  <div className="relative">
    <Clock className={`h-6 w-6 transition-all duration-300 ${
      activeTab === 'timer' ? 'scale-110 drop-shadow-lg' : ''
    }`} />
    {/* 활성 상태 글로우 효과 */}
    <div className={`absolute -inset-2 rounded-full transition-opacity blur-sm -z-10 ${
      activeTab === 'timer' ? 'opacity-100' : 'opacity-0'
    }`} style={{
      backgroundColor: 'rgba(212, 175, 55, 0.2)'
    }} />
  </div>
  <span className="text-xs font-medium">{t('nav.timer')}</span>
  {/* 활성 인디케이터 */}
  <div className={`h-0.5 w-8 rounded-full transition-opacity shadow-lg ${
    activeTab === 'timer' ? 'opacity-100' : 'opacity-0'
  }`} style={{
    backgroundColor: '#d4af37',
    boxShadow: '0 0 12px rgba(212, 175, 55, 0.5)'
  }} />
</button>

{/* 스프레드 탭 */}
<button className={`flex flex-col items-center gap-2 p-4 transition-all duration-300 ${
  activeTab === 'spreads' ? 'text-yellow-400 bg-yellow-400/10' : 'text-white/60'
}`}>
  <div className="relative">
    <Layout className={`h-6 w-6 transition-all duration-300 ${
      activeTab === 'spreads' ? 'scale-110 drop-shadow-lg' : ''
    }`} />
    <div className={`absolute -inset-2 rounded-full transition-opacity blur-sm -z-10 ${
      activeTab === 'spreads' ? 'opacity-100' : 'opacity-0'
    }`} style={{
      backgroundColor: 'rgba(212, 175, 55, 0.2)'
    }} />
  </div>
  <span className="text-xs font-medium">{t('nav.spreads')}</span>
</button>

{/* 저널 탭 */}
<button className={`flex flex-col items-center gap-2 p-4 transition-all duration-300 ${
  activeTab === 'journal' ? 'text-yellow-400 bg-yellow-400/10' : 'text-white/60'
}`}>
  <div className="relative">
    <BookOpen className={`h-6 w-6 transition-all duration-300 ${
      activeTab === 'journal' ? 'scale-110 drop-shadow-lg' : ''
    }`} />
    <div className={`absolute -inset-2 rounded-full transition-opacity blur-sm -z-10 ${
      activeTab === 'journal' ? 'opacity-100' : 'opacity-0'
    }`} style={{
      backgroundColor: 'rgba(212, 175, 55, 0.2)'
    }} />
  </div>
  <span className="text-xs font-medium">{t('nav.journal')}</span>
</button>

{/* 설정 탭 */}
<button className={`flex flex-col items-center gap-2 p-4 transition-all duration-300 ${
  activeTab === 'settings' ? 'text-yellow-400 bg-yellow-400/10' : 'text-white/60'
}`}>
  <div className="relative">
    <SettingsIcon className={`h-6 w-6 transition-all duration-300 ${
      activeTab === 'settings' ? 'scale-110 drop-shadow-lg' : ''
    }`} />
    <div className={`absolute -inset-2 rounded-full transition-opacity blur-sm -z-10 ${
      activeTab === 'settings' ? 'opacity-100' : 'opacity-0'
    }`} style={{
      backgroundColor: 'rgba(212, 175, 55, 0.2)'
    }} />
  </div>
  <span className="text-xs font-medium">{t('nav.settings')}</span>
</button>
```

---

## ✅ 6단계: 완전한 확인 체크리스트

### 🎨 시각적 확인 사항
- [ ] **메인 TarotCards 아이콘**: 헤더에서 `h-14 w-14 text-yellow-400 animate-mystical-pulse` 적용
- [ ] **시계 아이콘**: "시간의 흐름" 섹션에서 `h-5 w-5 text-yellow-400` 적용
- [ ] **저널 아이콘**: "성스러운 저널" 헤더에서 `h-5 w-5 text-yellow-400` 적용
- [ ] **별 아이콘**: "지금" 배지에서 `h-3 w-3 mr-1` 적용 (흰색으로 표시)
- [ ] **번개 아이콘**: 메인 버튼에서 `h-5 w-5` 또는 `h-12 w-12 text-yellow-400` 적용
- [ ] **저장 아이콘**: 저장 버튼에서 `h-5 w-5 mr-2` 적용
- [ ] **새로고침 아이콘**: 다시뽑기 버튼에서 `h-3 w-3 mr-1` 적용
- [ ] **반짝임 아이콘**: 로딩 상태에서 `animate-spin` 적용

### 🔧 기능적 확인 사항
- [ ] **애니메이션**: `animate-mystical-pulse`가 TarotCards에서 작동
- [ ] **글로우 효과**: 아이콘 주변의 blur 효과가 정상 작동
- [ ] **호버 효과**: 네비게이션 아이콘 호버 시 `scale-110` 적용
- [ ] **색상 상속**: 버튼 내부 아이콘이 부모 색상 정상 상속
- [ ] **크기 반응**: 다양한 크기 (`h-3 w-3`, `h-5 w-5`, `h-14 w-14`) 정상 적용

### 🌟 특별한 효과 확인
- [ ] **mystical-pulse 애니메이션**: TarotCards 아이콘에서 2초 주기로 크기 변화
- [ ] **네비게이션 글로우**: 활성 탭에서 아이콘 주변 골드 글로우 효과
- [ ] **로딩 상태**: Sparkles 아이콘이 `animate-spin`으로 회전
- [ ] **배지 내 아이콘**: Star 아이콘이 배지 내에서 올바른 크기와 간격

---

## 🚀 최종 구현 단계

### 1단계: 에셋 구조 생성
```bash
mkdir -p src/assets/icons
mkdir -p src/assets/images
mkdir -p src/components/mystical-ui
mkdir -p src/components/figma
```

### 2단계: 아이콘 컴포넌트 생성
- 위에 제공된 `icons.tsx` 파일 생성
- 25개 모든 아이콘을 React 컴포넌트로 정의

### 3단계: UI 컴포넌트 시스템 생성
- `components.tsx` 파일에 Card, Button, Badge 등 컴포넌트 정의
- `ImageWithFallback` 컴포넌트 생성

### 4단계: 메인 App.tsx 적용
- 현재 App.tsx 내용을 그대로 사용
- 아이콘 import 구문 정확히 적용

### 5단계: 스타일 확인
- globals.css의 mystical-pulse 애니메이션 작동 확인
- 모든 골드 색상이 정확히 표시되는지 확인

---

## 💡 클로드코드 적용 시 주의사항

### 🎯 정확한 프롬프트 작성법
```
"25개의 아이콘이 모두 포함된 mystical-ui/icons.tsx 파일을 생성해주세요. 
모든 아이콘은 currentColor를 사용하여 골드 색상(text-yellow-400)이 적용되어야 합니다.
TarotCards 아이콘은 특별히 복잡한 디자인으로 3개 겹친 카드와 반짝임 효과를 포함해야 합니다.

아이콘 목록:
- 네비게이션: Clock, Layout, BookOpen, Settings
- 액션: Star, Sparkles, Zap, RotateCcw, Save, Crown, Shuffle  
- 인터페이스: ChevronLeft, Check, X, Eye, Calendar
- 설정: Sun, Globe, Volume2, Bell, Lock, Shield, HelpCircle
- 브랜드: TarotCards, Moon"
```

### 🎨 스타일링 프롬프트
```
"모든 아이콘에 다음 골드 색상 시스템을 적용해주세요:
- 기본: text-yellow-400 (#d4af37)
- 진한 골드: text-yellow-500
- 테마 골드: text-accent (다크모드에서 #f4d03f)
- 애니메이션: animate-mystical-pulse (TarotCards 전용)
- 글로우 효과: 주변에 bg-yellow-400/30 blur-lg rounded-full"
```

### 🔧 기능 프롬프트
```
"아이콘들이 다음 상황에서 올바르게 작동하도록 해주세요:
- 네비게이션: 활성 탭에서 scale-110과 골드 글로우 효과
- 로딩: Sparkles 아이콘이 animate-spin으로 회전
- 호버: 모든 아이콘이 호버 시 약간의 크기 변화 또는 글로우
- 배지: Star 아이콘이 배지 내부에서 적절한 크기와 간격"
```

---

**🎯 이 가이드를 정확히 따라하면 현재 에셋 폴더에 저장된 모든 아이콘들을 완벽한 골드색으로 구현할 수 있습니다.**

**💫 Mystical Icons, Perfect Golden Implementation ✨**