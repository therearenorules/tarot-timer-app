# 타로 타이머 앱 에셋 사용 예시

이 문서는 앱의 아이콘과 이미지 에셋을 실제로 어떻게 사용하는지 보여주는 실용적인 예시들을 제공합니다.

## 🎯 실제 사용 시나리오

### 1. 타로 카드 표시 시스템

```tsx
// components/TarotCardDisplay.tsx
import React, { useState } from 'react';
import { TarotCardBack, CardPlaceholder } from '../assets/images';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface TarotCardDisplayProps {
  card?: TarotCard;
  isRevealed?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
}

export function TarotCardDisplay({ 
  card, 
  isRevealed = false, 
  isLoading = false,
  onClick 
}: TarotCardDisplayProps) {
  return (
    <div 
      className="relative w-32 h-48 cursor-pointer transition-all duration-500 hover:scale-105"
      onClick={onClick}
    >
      {isLoading ? (
        // 로딩 상태 - 애니메이션 플레이스홀더
        <img 
          src={CardPlaceholder} 
          alt="Loading card..." 
          className="w-full h-full object-cover rounded-lg"
        />
      ) : !isRevealed ? (
        // 카드 뒷면 표시
        <img 
          src={TarotCardBack} 
          alt="Hidden tarot card" 
          className="w-full h-full object-cover rounded-lg"
        />
      ) : card ? (
        // 실제 카드 이미지 (fallback 포함)
        <ImageWithFallback
          src={card.imageUrl}
          alt={card.name}
          fallbackSrc={CardPlaceholder}
          className="w-full h-full object-cover rounded-lg"
        />
      ) : (
        // 빈 슬롯
        <div className="w-full h-full bg-white/5 border-2 border-dashed border-yellow-400/30 rounded-lg flex items-center justify-center">
          <span className="text-yellow-400/60 text-sm">Empty</span>
        </div>
      )}
      
      {/* 카드 선택 효과 */}
      {isRevealed && (
        <div className="absolute -inset-2 bg-yellow-400/30 blur-xl rounded-xl animate-pulse" />
      )}
    </div>
  );
}
```

### 2. 앱 헤더 브랜딩

```tsx
// components/AppHeader.tsx
import React from 'react';
import { AppLogoMain, AppLogoIcon } from '../assets/images';
import { useResponsive } from '../utils/responsive';

export function AppHeader({ title }: { title: string }) {
  const { isMobile } = useResponsive();
  
  return (
    <header className="flex items-center justify-between p-4 bg-white/5 backdrop-blur-lg">
      <div className="flex items-center gap-3">
        {/* 모바일에서는 작은 아이콘, 데스크톱에서는 메인 로고 */}
        <img 
          src={isMobile ? AppLogoIcon : AppLogoMain}
          alt="타로 타이머"
          className={isMobile ? "w-8 h-8" : "w-12 h-12"}
        />
        
        <h1 className="text-xl font-bold text-white">
          {title}
        </h1>
      </div>
      
      {/* 우측 액션 버튼들 */}
      <div className="flex items-center gap-2">
        {/* 아이콘들 사용 예시는 다음 섹션 참고 */}
      </div>
    </header>
  );
}
```

### 3. 배경 텍스처 시스템

```tsx
// components/MysticalBackground.tsx
import React from 'react';
import { 
  SacredGeometryPattern, 
  MysticalTextureLight, 
  MysticalTextureDark 
} from '../assets/images';
import { useTheme } from '../utils/theme';

interface MysticalBackgroundProps {
  children: React.ReactNode;
  variant?: 'geometry' | 'texture' | 'gradient';
}

export function MysticalBackground({ 
  children, 
  variant = 'texture' 
}: MysticalBackgroundProps) {
  const { isDarkMode } = useTheme();
  
  const getBackgroundStyle = () => {
    switch (variant) {
      case 'geometry':
        return {
          backgroundImage: `url(${SacredGeometryPattern})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
          backgroundPosition: 'center'
        };
      
      case 'texture':
        const textureImage = isDarkMode ? MysticalTextureDark : MysticalTextureLight;
        return {
          backgroundImage: `url(${textureImage})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '100px 100px'
        };
      
      case 'gradient':
      default:
        return {
          background: 'linear-gradient(135deg, #1a1f3a 0%, #4a1a4f 50%, #1a1f3a 100%)'
        };
    }
  };
  
  return (
    <div 
      className="min-h-screen relative"
      style={getBackgroundStyle()}
    >
      {/* 오버레이 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/20 pointer-events-none" />
      
      {/* 컨텐츠 */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
```

### 4. 아이콘 사용 시스템

```tsx
// components/NavigationBar.tsx
import React from 'react';
import { 
  Clock, 
  Layout, 
  BookOpen, 
  Settings 
} from '../components/mystical-ui/icons';
import { SparkleEffect } from '../assets/images';

interface NavigationBarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function NavigationBar({ activeTab, onTabChange }: NavigationBarProps) {
  const tabs = [
    { id: 'timer', icon: Clock, label: '타이머' },
    { id: 'spreads', icon: Layout, label: '스프레드' },
    { id: 'journal', icon: BookOpen, label: '저널' },
    { id: 'settings', icon: Settings, label: '설정' }
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-midnight-blue/95 backdrop-blur-xl border-t border-yellow-400/20">
      <div className="flex justify-around items-center py-2">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`relative flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 ${
              activeTab === id 
                ? 'text-yellow-400 bg-yellow-400/10' 
                : 'text-white/60 hover:text-white/80'
            }`}
          >
            {/* 아이콘 */}
            <div className="relative">
              <Icon className="w-6 h-6" />
              
              {/* 활성 탭 반짝임 효과 */}
              {activeTab === id && (
                <div className="absolute -inset-3 opacity-60">
                  <img 
                    src={SparkleEffect} 
                    alt="" 
                    className="w-12 h-12 animate-spin"
                    style={{ animationDuration: '8s' }}
                  />
                </div>
              )}
            </div>
            
            {/* 라벨 */}
            <span className="text-xs font-medium">{label}</span>
            
            {/* 활성 인디케이터 */}
            {activeTab === id && (
              <div className="absolute -bottom-1 w-8 h-0.5 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50" />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}
```

### 5. 상호작용 효과

```tsx
// components/InteractiveCard.tsx
import React, { useState } from 'react';
import { SparkleEffect } from '../assets/images';
import { Star, Zap } from '../components/mystical-ui/icons';

interface InteractiveCardProps {
  children: React.ReactNode;
  onClick?: () => void;
  isPremium?: boolean;
}

export function InteractiveCard({ 
  children, 
  onClick, 
  isPremium = false 
}: InteractiveCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  
  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
    onClick?.();
  };
  
  return (
    <div 
      className="relative cursor-pointer transition-all duration-300 transform hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* 메인 카드 */}
      <div className={`relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-2xl transition-all duration-300 ${
        isHovered ? 'border-yellow-400/40 shadow-yellow-400/20' : ''
      } ${isClicked ? 'scale-95' : ''}`}>
        
        {/* 프리미엄 배지 */}
        {isPremium && (
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
            <Star className="w-3 h-3" />
            프리미엄
          </div>
        )}
        
        {/* 컨텐츠 */}
        {children}
        
        {/* 호버 글로우 효과 */}
        {isHovered && (
          <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20 blur-xl rounded-3xl -z-10" />
        )}
      </div>
      
      {/* 클릭 시 반짝임 효과 */}
      {isClicked && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <img 
            src={SparkleEffect} 
            alt="" 
            className="w-24 h-24 animate-ping opacity-75"
          />
        </div>
      )}
      
      {/* 호버 시 미묘한 파티클 */}
      {isHovered && (
        <>
          <div className="absolute top-4 left-4 w-1 h-1 bg-yellow-400 rounded-full animate-pulse" />
          <div className="absolute top-8 right-8 w-0.5 h-0.5 bg-white rounded-full animate-ping" />
          <div className="absolute bottom-6 left-8 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        </>
      )}
    </div>
  );
}
```

### 6. 테마별 이미지 전환

```tsx
// hooks/useThemeImages.ts
import { useMemo } from 'react';
import { 
  MysticalTextureLight, 
  MysticalTextureDark,
  AppLogoMain 
} from '../assets/images';

export function useThemeImages(isDarkMode: boolean) {
  return useMemo(() => ({
    backgroundTexture: isDarkMode ? MysticalTextureDark : MysticalTextureLight,
    appLogo: AppLogoMain, // 로고는 다크모드에서도 동일
    
    // CSS 변수로 설정할 수 있는 스타일
    backgroundStyle: {
      backgroundImage: `url(${isDarkMode ? MysticalTextureDark : MysticalTextureLight})`,
      backgroundRepeat: 'repeat',
      backgroundSize: '100px 100px'
    },
    
    // 글로우 효과 색상
    glowColor: isDarkMode ? '#f4d03f' : '#d4af37'
  }), [isDarkMode]);
}

// 사용 예시
function ThemeAwareComponent() {
  const { isDarkMode } = useTheme();
  const { backgroundStyle, glowColor } = useThemeImages(isDarkMode);
  
  return (
    <div 
      className="min-h-screen p-8"
      style={backgroundStyle}
    >
      <div 
        className="text-2xl font-bold"
        style={{ textShadow: `0 0 20px ${glowColor}` }}
      >
        테마에 따라 변하는 컨텐츠
      </div>
    </div>
  );
}
```

## 🚀 성능 최적화 팁

### 1. 이미지 프리로딩

```tsx
// utils/preloadAssets.ts
import { 
  TarotCardBack, 
  AppLogoMain, 
  SparkleEffect 
} from '../assets/images';

export function preloadCriticalAssets() {
  const criticalAssets = [
    TarotCardBack,
    AppLogoMain,
    SparkleEffect
  ];
  
  criticalAssets.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = src;
    link.as = 'image';
    link.type = 'image/svg+xml';
    document.head.appendChild(link);
  });
}

// App.tsx에서 초기화 시 호출
useEffect(() => {
  preloadCriticalAssets();
}, []);
```

### 2. 지연 로딩

```tsx
// components/LazyImage.tsx
import React, { lazy, Suspense } from 'react';
import { CardPlaceholder } from '../assets/images';

const LazySparkleEffect = lazy(() => 
  import('../assets/images/sparkle-effect.svg').then(module => ({
    default: module.default
  }))
);

export function LazySparkleEffect(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <Suspense fallback={<img src={CardPlaceholder} {...props} />}>
      <LazySparkleEffect {...props} />
    </Suspense>
  );
}
```

### 3. 메모이제이션

```tsx
// components/MemoizedLogo.tsx
import React, { memo } from 'react';
import { AppLogoMain } from '../assets/images';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MemoizedLogo = memo<LogoProps>(({ size = 'md', className }) => {
  const sizeClass = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-20 h-20'
  }[size];
  
  return (
    <img 
      src={AppLogoMain}
      alt="타로 타이머"
      className={`${sizeClass} ${className || ''}`}
    />
  );
});
```

이러한 방식으로 아이콘과 이미지 에셋들을 체계적으로 관리하고 사용하면, 앱의 브랜딩 일관성과 사용자 경험을 크게 향상시킬 수 있습니다.