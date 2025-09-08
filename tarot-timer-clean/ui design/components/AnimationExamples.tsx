import React from 'react';
import { 
  MysticalPulse, 
  GentleFloat, 
  SparkleEffect, 
  GentleGlow, 
  ScaleHover, 
  FadeIn, 
  SlideIn, 
  LoadingSpinner,
  AnimationContainer
} from './AnimationComponents';
import { 
  useMysticalPulse, 
  useGentleFloat, 
  useSparkleEffect, 
  useScaleHover, 
  useFadeIn, 
  useSlideIn,
  useLoadingSpinner
} from '../utils/animations';

// React Native 호환 애니메이션 사용 예시들

// 기존 CSS 애니메이션을 React Native 호환 컴포넌트로 변경하는 방법

// 1. CSS animate-mystical-pulse 대체
export function MysticalCard({ children }: { children: React.ReactNode }) {
  return (
    <MysticalPulse className="p-4 bg-card rounded-lg border border-premium-gold/20">
      {children}
    </MysticalPulse>
  );
}

// 2. 호버 효과가 있는 카드
export function InteractiveCard({ children }: { children: React.ReactNode }) {
  return (
    <ScaleHover hoverScale={1.02} duration={200}>
      <div className="p-4 bg-card rounded-lg border border-border cursor-pointer">
        {children}
      </div>
    </ScaleHover>
  );
}

// 3. 로딩 상태가 있는 버튼
export function AnimatedButton({ 
  isLoading, 
  children, 
  onClick 
}: { 
  isLoading: boolean; 
  children: React.ReactNode; 
  onClick: () => void; 
}) {
  const { style, handlers } = useScaleHover({ scale: 1.05, duration: 150 });

  return (
    <button
      style={style}
      {...handlers}
      onClick={onClick}
      disabled={isLoading}
      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50"
    >
      {isLoading ? (
        <div className="flex items-center gap-2">
          <LoadingSpinner />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

// 4. 순차적 등장 애니메이션이 있는 리스트
export function AnimatedList({ items }: { items: string[] }) {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <SlideIn key={item} delay={index * 100} direction="left">
          <div className="p-3 bg-card rounded border">
            {item}
          </div>
        </SlideIn>
      ))}
    </div>
  );
}

// 5. 타로 카드 플레이스홀더 (빈 카드 상태)
export function TarotCardPlaceholder({ position }: { position: number }) {
  const pulseStyle = useMysticalPulse({ duration: 2000 });

  return (
    <div
      className="w-20 h-32 border-2 border-dashed border-premium-gold/50 rounded-lg bg-premium-gold/5 flex items-center justify-center"
      style={pulseStyle}
    >
      <div className="text-premium-gold font-bold text-sm">{position}</div>
    </div>
  );
}

// 6. 신비로운 배경 효과
export function MysticalBackground() {
  const floatStyle = useGentleFloat({ duration: 4000 });
  const sparkleStyle = useSparkleEffect({ duration: 2500 });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* 떠다니는 요소들 */}
      <div
        className="absolute top-12 left-8 w-1 h-1 bg-premium-gold rounded-full"
        style={floatStyle}
      />
      <div
        className="absolute top-24 right-12 w-0.5 h-0.5 bg-white rounded-full"
        style={sparkleStyle}
      />
      <div
        className="absolute bottom-48 left-16 w-1.5 h-1.5 bg-premium-gold rounded-full"
        style={{
          ...floatStyle,
          animationDelay: '1s' // 다른 타이밍으로 움직임
        }}
      />
    </div>
  );
}

// 7. 프리미엄 뱃지 (빛나는 효과)
export function PremiumBadge() {
  return (
    <GentleGlow>
      <div className="px-2 py-1 bg-premium-gold text-primary rounded text-xs font-medium">
        프리미엄
      </div>
    </GentleGlow>
  );
}

// 8. 타로 카드 뒤집기 시뮬레이션
export function FlippableCard({ 
  isFlipped, 
  frontContent, 
  backContent 
}: { 
  isFlipped: boolean; 
  frontContent: React.ReactNode; 
  backContent: React.ReactNode; 
}) {
  return (
    <div className="relative w-24 h-36 perspective-1000">
      <div
        className={`
          absolute inset-0 w-full h-full transition-transform duration-300 transform-style-preserve-3d cursor-pointer
          ${isFlipped ? 'rotate-y-180' : ''}
        `}
        style={{
          transformStyle: 'preserve-3d',
          transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        {/* 앞면 */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          {frontContent}
        </div>
        {/* 뒷면 */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden rotate-y-180"
          style={{ transform: 'rotateY(180deg)' }}
        >
          {backContent}
        </div>
      </div>
    </div>
  );
}

// 9. 복합 애니메이션 예시
export function ComplexAnimationExample() {
  return (
    <div className="p-8 space-y-6">
      <FadeIn delay={0} duration={500}>
        <h2 className="text-xl font-semibold text-premium-gold">
          React Native 호환 애니메이션 예시
        </h2>
      </FadeIn>

      <SlideIn direction="up" delay={200} duration={400}>
        <div className="grid grid-cols-2 gap-4">
          <MysticalCard>
            <div className="text-center">
              <div className="text-lg font-medium">신비로운 카드</div>
              <div className="text-sm text-muted-foreground">맥동하는 효과</div>
            </div>
          </MysticalCard>

          <InteractiveCard>
            <div className="text-center">
              <div className="text-lg font-medium">인터랙티브 카드</div>
              <div className="text-sm text-muted-foreground">호버 효과</div>
            </div>
          </InteractiveCard>
        </div>
      </SlideIn>

      <SlideIn direction="up" delay={400} duration={400}>
        <AnimationContainer animations={['pulse', 'float']}>
          <div className="p-4 bg-gradient-to-r from-premium-gold/10 to-deep-purple/10 rounded-lg border border-premium-gold/20">
            <div className="text-center">
              <SparkleEffect>
                <div className="text-lg font-medium text-premium-gold">
                  복합 애니메이션
                </div>
              </SparkleEffect>
              <div className="text-sm text-muted-foreground mt-2">
                펄스 + 플로트 + 스파클 효과
              </div>
            </div>
          </div>
        </AnimationContainer>
      </SlideIn>

      <SlideIn direction="up" delay={600} duration={400}>
        <div className="flex items-center gap-4">
          <AnimatedButton isLoading={false} onClick={() => console.log('클릭!')}>
            일반 버튼
          </AnimatedButton>
          <AnimatedButton isLoading={true} onClick={() => {}}>
            로딩 버튼
          </AnimatedButton>
          <PremiumBadge />
        </div>
      </SlideIn>
    </div>
  );
}

// React Native 변환 시 CSS를 컴포넌트로 변경하는 매핑 가이드
export const animationMappingGuide = {
  // CSS 클래스 -> React Native 호환 컴포넌트
  'animate-mystical-pulse': '<MysticalPulse>',
  'animate-gentle-float': '<GentleFloat>',
  'animate-sparkle-effect': '<SparkleEffect>',
  'animate-gentle-glow': '<GentleGlow>',
  'hover:scale-105': '<ScaleHover hoverScale={1.05}>',
  'animate-spin': '<LoadingSpinner />',
  
  // CSS 애니메이션 -> 훅 사용
  'CSS keyframes': 'useMysticalPulse(), useGentleFloat(), etc.',
  'transition + hover': 'useScaleHover()',
  'opacity transition': 'useFadeIn()',
  'transform transition': 'useSlideIn()'
};