import React, { useEffect, useRef, ReactNode, useState } from 'react';
import { touchStates } from '../utils/touchStates';
import { tokens } from '../utils/webStyles';

// React Native 호환 애니메이션 컴포넌트들
// CSS keyframes와 transitions를 React Native Animated API 호환으로 구현

interface AnimatedComponentProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

// Mystical Pulse 애니메이션 (CSS keyframes 대체)
export function MysticalPulse({ children, className = '', style = {} }: AnimatedComponentProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Web에서는 CSS 애니메이션 사용, React Native에서는 Animated API 사용 예정
    const animationDuration = 2000; // 2초
    let animationId: number;

    const animate = (startTime: number) => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % animationDuration) / animationDuration;
      
      // 0 -> 0.5 -> 1의 사이클을 만들어 opacity와 scale을 조절
      let phase;
      if (progress <= 0.5) {
        phase = progress * 2; // 0 -> 1
      } else {
        phase = (1 - progress) * 2; // 1 -> 0
      }
      
      const opacity = 1 - (phase * 0.2); // 1 -> 0.8 -> 1
      const scale = 1 + (phase * 0.02); // 1 -> 1.02 -> 1
      
      element.style.opacity = opacity.toString();
      element.style.transform = `scale(${scale})`;
      
      animationId = requestAnimationFrame(() => animate(startTime));
    };

    const startTime = Date.now();
    animate(startTime);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={`transition-opacity transition-transform duration-75 ${className}`}
      style={{
        willChange: 'opacity, transform',
        ...style
      }}
    >
      {children}
    </div>
  );
}

// Gentle Float 애니메이션 (부드러운 상하 움직임)
export function GentleFloat({ children, className = '', style = {} }: AnimatedComponentProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const animationDuration = 3000; // 3초
    let animationId: number;

    const animate = (startTime: number) => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % animationDuration) / animationDuration;
      
      // 부드러운 사인파 움직임
      const translateY = Math.sin(progress * Math.PI * 2) * 4; // ±4px 움직임
      
      element.style.transform = `translateY(${translateY}px)`;
      
      animationId = requestAnimationFrame(() => animate(startTime));
    };

    const startTime = Date.now();
    animate(startTime);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={`transition-transform duration-75 ${className}`}
      style={{
        willChange: 'transform',
        ...style
      }}
    >
      {children}
    </div>
  );
}

// Sparkle Effect 애니메이션 (반짝임 효과)
export function SparkleEffect({ children, className = '', style = {} }: AnimatedComponentProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const animationDuration = 1500; // 1.5초
    let animationId: number;

    const animate = (startTime: number) => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % animationDuration) / animationDuration;
      
      // 빠른 반짝임 효과 (0 -> 1 -> 0)
      let phase;
      if (progress <= 0.5) {
        phase = progress * 2; // 0 -> 1
      } else {
        phase = (1 - progress) * 2; // 1 -> 0
      }
      
      const opacity = 0.4 + (phase * 0.6); // 0.4 -> 1 -> 0.4
      const scale = 1 + (Math.sin(progress * Math.PI * 4) * 0.1); // 작은 진동
      
      element.style.opacity = opacity.toString();
      element.style.transform = `scale(${scale})`;
      
      animationId = requestAnimationFrame(() => animate(startTime));
    };

    const startTime = Date.now();
    animate(startTime);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-75 ${className}`}
      style={{
        willChange: 'opacity, transform',
        ...style
      }}
    >
      {children}
    </div>
  );
}

// Gentle Glow 애니메이션 (부드러운 빛남 효과)
export function GentleGlow({ children, className = '', style = {} }: AnimatedComponentProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const animationDuration = 4000; // 4초
    let animationId: number;

    const animate = (startTime: number) => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % animationDuration) / animationDuration;
      
      // 부드러운 빛남 효과
      const glowIntensity = (Math.sin(progress * Math.PI * 2) + 1) / 2; // 0 -> 1 -> 0
      const opacity = 0.6 + (glowIntensity * 0.4); // 0.6 -> 1 -> 0.6
      
      element.style.opacity = opacity.toString();
      
      animationId = requestAnimationFrame(() => animate(startTime));
    };

    const startTime = Date.now();
    animate(startTime);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={`transition-opacity duration-150 ${className}`}
      style={{
        willChange: 'opacity',
        ...style
      }}
    >
      {children}
    </div>
  );
}

// Scale Hover 애니메이션 (호버 시 확대)
interface ScaleHoverProps extends AnimatedComponentProps {
  hoverScale?: number;
  duration?: number;
}

export function ScaleHover({ 
  children, 
  className = '', 
  style = {}, 
  hoverScale = 1.05, 
  duration = 200 
}: ScaleHoverProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <div
      className={`transition-transform cursor-pointer ${className}`}
      style={{
        transform: isHovered ? `scale(${hoverScale})` : 'scale(1)',
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        willChange: 'transform',
        ...style
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
}

// Fade In 애니메이션
interface FadeInProps extends AnimatedComponentProps {
  delay?: number;
  duration?: number;
}

export function FadeIn({ 
  children, 
  className = '', 
  style = {}, 
  delay = 0, 
  duration = 500 
}: FadeInProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={`transition-opacity ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        ...style
      }}
    >
      {children}
    </div>
  );
}

// Slide In 애니메이션
interface SlideInProps extends AnimatedComponentProps {
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  distance?: number;
}

export function SlideIn({ 
  children, 
  className = '', 
  style = {}, 
  direction = 'up',
  delay = 0, 
  duration = 300,
  distance = 20
}: SlideInProps) {
  const [isVisible, setIsVisible] = React.useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const getTransform = () => {
    if (isVisible) return 'translateX(0) translateY(0)';
    
    switch (direction) {
      case 'up':
        return `translateY(${distance}px)`;
      case 'down':
        return `translateY(-${distance}px)`;
      case 'left':
        return `translateX(${distance}px)`;
      case 'right':
        return `translateX(-${distance}px)`;
      default:
        return `translateY(${distance}px)`;
    }
  };

  return (
    <div
      className={`transition-all ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        ...style
      }}
    >
      {children}
    </div>
  );
}

// React Native 호환 스피너 (loading)
export function LoadingSpinner({ className = '', style = {} }: Omit<AnimatedComponentProps, 'children'>) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    let animationId: number;
    let rotation = 0;

    const animate = () => {
      rotation += 2; // 2도씩 회전
      if (rotation >= 360) rotation = 0;
      
      element.style.transform = `rotate(${rotation}deg)`;
      
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={`inline-block w-4 h-4 border-2 border-premium-gold/30 border-t-premium-gold rounded-full ${className}`}
      style={{
        willChange: 'transform',
        ...style
      }}
    />
  );
}

// 애니메이션 컨테이너 (여러 애니메이션 조합용)
interface AnimationContainerProps {
  children: ReactNode;
  animations?: ('pulse' | 'float' | 'glow' | 'sparkle')[];
  className?: string;
  style?: React.CSSProperties;
}

export function AnimationContainer({ 
  children, 
  animations = [], 
  className = '', 
  style = {} 
}: AnimationContainerProps) {
  let AnimatedComponent = React.Fragment;
  let props: any = {};

  // 애니메이션 중첩 적용
  animations.forEach((animation) => {
    const PrevComponent = AnimatedComponent;
    const prevProps = props;

    switch (animation) {
      case 'pulse':
        AnimatedComponent = ({ children }: { children: ReactNode }) => (
          <PrevComponent {...prevProps}>
            <MysticalPulse className={className} style={style}>
              {children}
            </MysticalPulse>
          </PrevComponent>
        );
        break;
      case 'float':
        AnimatedComponent = ({ children }: { children: ReactNode }) => (
          <PrevComponent {...prevProps}>
            <GentleFloat className={className} style={style}>
              {children}
            </GentleFloat>
          </PrevComponent>
        );
        break;
      case 'glow':
        AnimatedComponent = ({ children }: { children: ReactNode }) => (
          <PrevComponent {...prevProps}>
            <GentleGlow className={className} style={style}>
              {children}
            </GentleGlow>
          </PrevComponent>
        );
        break;
      case 'sparkle':
        AnimatedComponent = ({ children }: { children: ReactNode }) => (
          <PrevComponent {...prevProps}>
            <SparkleEffect className={className} style={style}>
              {children}
            </SparkleEffect>
          </PrevComponent>
        );
        break;
    }
    props = {};
  });

  if (animations.length === 0) {
    return <div className={className} style={style}>{children}</div>;
  }

  return <AnimatedComponent>{children}</AnimatedComponent>;
}

// TouchFeedback 컴포넌트 - React Native 터치 효과 시뮬레이션
interface TouchFeedbackProps {
  children: ReactNode;
  onPress?: () => void;
  touchType?: keyof typeof touchStates;
  hapticFeedback?: boolean;
  style?: any;
}

export function TouchFeedback({ 
  children, 
  onPress, 
  touchType = 'button',
  hapticFeedback = false,
  style 
}: TouchFeedbackProps) {
  const [isPressed, setIsPressed] = useState(false);
  const states = touchStates[touchType];

  const handlePress = () => {
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
    onPress?.();
  };

  const touchStyle = {
    transform: `scale(${isPressed ? states.pressed.scale : states.default.scale})`,
    opacity: isPressed ? states.pressed.opacity : states.default.opacity,
    transition: `all 150ms cubic-bezier(0.4, 0, 0.2, 1)`,
    cursor: 'pointer',
    userSelect: 'none',
    ...style,
  };

  return (
    <div
      style={touchStyle}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onClick={handlePress}
    >
      {children}
    </div>
  );
}