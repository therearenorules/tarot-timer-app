// CSS Transitions를 React Native Animated API 호환으로 완전 대체
// transition-all, duration, hover states 등을 React Native에서 사용 가능한 형태로 변환

import React, { useState, useEffect } from 'react';
import { tokens } from '../utils/webStyles';
import { touchStates } from '../utils/touchStates';

// 기본 애니메이션 설정값들
export const transitionConfig = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    mystical: 'cubic-bezier(0.4, 0, 0.6, 1)',
    gentle: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  },
};

// ========================================
// transition-all 대체 컴포넌트들
// ========================================

// TransitionWrapper: 모든 속성에 transition 적용
interface TransitionWrapperProps {
  children: React.ReactNode;
  duration?: number;
  easing?: string;
  properties?: string[];
  style?: any;
}

export function TransitionWrapper({
  children,
  duration = transitionConfig.duration.normal,
  easing = transitionConfig.easing.mystical,
  properties = ['all'],
  style,
}: TransitionWrapperProps) {
  const transitionStyle = {
    transition: properties.map(prop => `${prop} ${duration}ms ${easing}`).join(', '),
    ...style,
  };

  return <div style={transitionStyle}>{children}</div>;
}

// HoverTransition: hover 효과를 위한 트랜지션
interface HoverTransitionProps {
  children: React.ReactNode;
  hoverStyle?: any;
  pressedStyle?: any;
  duration?: number;
  onPress?: () => void;
  style?: any;
}

export function HoverTransition({
  children,
  hoverStyle = {},
  pressedStyle = {},
  duration = transitionConfig.duration.normal,
  onPress,
  style,
}: HoverTransitionProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const currentStyle = {
    ...style,
    ...(isHovered && hoverStyle),
    ...(isPressed && pressedStyle),
    transition: `all ${duration}ms ${transitionConfig.easing.mystical}`,
    cursor: onPress ? 'pointer' : 'default',
  };

  return (
    <div
      style={currentStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={onPress}
    >
      {children}
    </div>
  );
}

// ColorTransition: 색상 변화 애니메이션
interface ColorTransitionProps {
  children: React.ReactNode;
  fromColor: string;
  toColor: string;
  trigger: boolean;
  duration?: number;
  property?: 'color' | 'backgroundColor' | 'borderColor';
  style?: any;
}

export function ColorTransition({
  children,
  fromColor,
  toColor,
  trigger,
  duration = transitionConfig.duration.normal,
  property = 'backgroundColor',
  style,
}: ColorTransitionProps) {
  const colorStyle = {
    [property]: trigger ? toColor : fromColor,
    transition: `${property} ${duration}ms ${transitionConfig.easing.easeInOut}`,
    ...style,
  };

  return <div style={colorStyle}>{children}</div>;
}

// OpacityTransition: 투명도 변화 애니메이션
interface OpacityTransitionProps {
  children: React.ReactNode;
  visible: boolean;
  duration?: number;
  style?: any;
}

export function OpacityTransition({
  children,
  visible,
  duration = transitionConfig.duration.normal,
  style,
}: OpacityTransitionProps) {
  const opacityStyle = {
    opacity: visible ? 1 : 0,
    transition: `opacity ${duration}ms ${transitionConfig.easing.easeInOut}`,
    pointerEvents: visible ? 'auto' : 'none',
    ...style,
  };

  return <div style={opacityStyle}>{children}</div>;
}

// ScaleTransition: 크기 변화 애니메이션
interface ScaleTransitionProps {
  children: React.ReactNode;
  scale: number;
  duration?: number;
  style?: any;
}

export function ScaleTransition({
  children,
  scale,
  duration = transitionConfig.duration.normal,
  style,
}: ScaleTransitionProps) {
  const scaleStyle = {
    transform: `scale(${scale})`,
    transition: `transform ${duration}ms ${transitionConfig.easing.spring}`,
    transformOrigin: 'center',
    ...style,
  };

  return <div style={scaleStyle}>{children}</div>;
}

// ========================================
// hover:, active:, focus: 상태 대체
// ========================================

// InteractiveElement: 모든 상호작용 상태를 지원하는 범용 컴포넌트
interface InteractiveElementProps {
  children: React.ReactNode;
  defaultStyle?: any;
  hoverStyle?: any;
  activeStyle?: any;
  focusStyle?: any;
  disabledStyle?: any;
  disabled?: boolean;
  onPress?: () => void;
  duration?: number;
  hapticFeedback?: boolean;
}

export function InteractiveElement({
  children,
  defaultStyle = {},
  hoverStyle = {},
  activeStyle = {},
  focusStyle = {},
  disabledStyle = {},
  disabled = false,
  onPress,
  duration = transitionConfig.duration.normal,
  hapticFeedback = false,
}: InteractiveElementProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const currentStyle = {
    ...defaultStyle,
    ...(disabled && disabledStyle),
    ...(isHovered && !disabled && hoverStyle),
    ...(isActive && !disabled && activeStyle),
    ...(isFocused && !disabled && focusStyle),
    transition: `all ${duration}ms ${transitionConfig.easing.mystical}`,
    cursor: disabled ? 'not-allowed' : (onPress ? 'pointer' : 'default'),
    userSelect: 'none',
  };

  const handlePress = () => {
    if (disabled) return;
    
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    onPress?.();
  };

  return (
    <div
      style={currentStyle}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
      onMouseDown={() => !disabled && setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onFocus={() => !disabled && setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onClick={handlePress}
      tabIndex={onPress ? 0 : undefined}
    >
      {children}
    </div>
  );
}

// ========================================
// 브랜드별 미리 정의된 트랜지션들
// ========================================

// MysticalButton: Guidelines.md 브랜드 스타일의 버튼
interface MysticalButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'premium';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onPress?: () => void;
  style?: any;
}

export function MysticalButton({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onPress,
  style,
}: MysticalButtonProps) {
  const baseStyles = {
    sm: { paddingHorizontal: tokens.spacing.md, paddingVertical: tokens.spacing.xs },
    md: { paddingHorizontal: tokens.spacing.lg, paddingVertical: tokens.spacing.sm },
    lg: { paddingHorizontal: tokens.spacing.xl, paddingVertical: tokens.spacing.md },
  };

  const variantStyles = {
    primary: {
      default: {
        backgroundColor: tokens.colors.primary,
        color: tokens.colors.primaryForeground,
        borderRadius: tokens.borderRadius.lg,
        border: 'none',
        ...baseStyles[size],
      },
      hover: {
        backgroundColor: tokens.colors.deepPurple,
        boxShadow: `0 4px 16px ${tokens.colors.primary}40`,
        transform: 'translateY(-1px)',
      },
      active: {
        transform: 'translateY(0)',
        boxShadow: `0 2px 8px ${tokens.colors.primary}60`,
      },
    },
    secondary: {
      default: {
        backgroundColor: 'transparent',
        color: tokens.colors.primary,
        borderRadius: tokens.borderRadius.lg,
        border: `1px solid ${tokens.colors.primary}`,
        ...baseStyles[size],
      },
      hover: {
        backgroundColor: tokens.colors.primary + '0D',
        borderColor: tokens.colors.deepPurple,
        color: tokens.colors.deepPurple,
      },
      active: {
        backgroundColor: tokens.colors.primary + '1A',
      },
    },
    premium: {
      default: {
        backgroundColor: tokens.colors.premiumGold,
        color: tokens.colors.deepPurple,
        borderRadius: tokens.borderRadius.lg,
        border: 'none',
        fontWeight: tokens.fontWeight.semibold,
        ...baseStyles[size],
      },
      hover: {
        backgroundColor: '#E6C547',
        boxShadow: `0 8px 32px ${tokens.colors.premiumGold}40`,
        transform: 'translateY(-2px)',
      },
      active: {
        transform: 'translateY(-1px)',
        boxShadow: `0 4px 16px ${tokens.colors.premiumGold}60`,
      },
    },
  };

  const styles = variantStyles[variant];

  return (
    <InteractiveElement
      defaultStyle={styles.default}
      hoverStyle={styles.hover}
      activeStyle={styles.active}
      disabled={disabled}
      onPress={onPress}
      duration={transitionConfig.duration.normal}
      hapticFeedback={true}
    >
      {children}
    </InteractiveElement>
  );
}

// MysticalCard: 카드 컴포넌트 (hover 효과 포함)
interface MysticalCardProps {
  children: React.ReactNode;
  interactive?: boolean;
  glowing?: boolean;
  onPress?: () => void;
  style?: any;
}

export function MysticalCard({
  children,
  interactive = false,
  glowing = false,
  onPress,
  style,
}: MysticalCardProps) {
  const cardStyles = {
    default: {
      backgroundColor: tokens.colors.card,
      borderRadius: tokens.borderRadius.lg,
      padding: tokens.spacing.md,
      border: `1px solid ${tokens.colors.border}`,
      boxShadow: '0 2px 8px rgba(74, 26, 79, 0.12)',
      ...(glowing && {
        boxShadow: `0 0 20px ${tokens.colors.premiumGold}20, 0 4px 16px rgba(74, 26, 79, 0.15)`,
        borderColor: tokens.colors.premiumGold + '40',
      }),
      ...style,
    },
    hover: interactive ? {
      transform: 'translateY(-2px)',
      boxShadow: glowing 
        ? `0 0 30px ${tokens.colors.premiumGold}40, 0 8px 32px rgba(74, 26, 79, 0.2)`
        : '0 8px 32px rgba(74, 26, 79, 0.15)',
      borderColor: glowing ? tokens.colors.premiumGold + '80' : tokens.colors.border,
    } : {},
    active: interactive ? {
      transform: 'translateY(-1px)',
    } : {},
  };

  if (interactive) {
    return (
      <InteractiveElement
        defaultStyle={cardStyles.default}
        hoverStyle={cardStyles.hover}
        activeStyle={cardStyles.active}
        onPress={onPress}
        duration={transitionConfig.duration.normal}
      >
        {children}
      </InteractiveElement>
    );
  }

  return <div style={cardStyles.default}>{children}</div>;
}

// AnimatedIcon: 아이콘 애니메이션
interface AnimatedIconProps {
  children: React.ReactNode;
  active?: boolean;
  glowing?: boolean;
  rotating?: boolean;
  style?: any;
}

export function AnimatedIcon({
  children,
  active = false,
  glowing = false,
  rotating = false,
  style,
}: AnimatedIconProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!rotating) return;

    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 16); // ~60fps

    return () => clearInterval(interval);
  }, [rotating]);

  const iconStyle = {
    color: active ? tokens.colors.accent : tokens.colors.mutedForeground,
    filter: glowing ? `drop-shadow(0 0 8px ${tokens.colors.premiumGold}80)` : 'none',
    transform: `rotate(${rotation}deg)`,
    transition: 'all 300ms cubic-bezier(0.4, 0, 0.6, 1)',
    ...style,
  };

  return <div style={iconStyle}>{children}</div>;
}

// ========================================
// 고급 트랜지션 패턴들
// ========================================

// SequentialFade: 순차적 페이드 인
interface SequentialFadeProps {
  children: React.ReactNode[];
  delay?: number;
  duration?: number;
  direction?: 'forward' | 'reverse';
}

export function SequentialFade({
  children,
  delay = 100,
  duration = transitionConfig.duration.normal,
  direction = 'forward',
}: SequentialFadeProps) {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    new Array(children.length).fill(false)
  );

  useEffect(() => {
    children.forEach((_, index) => {
      const itemDelay = direction === 'forward' ? index * delay : (children.length - 1 - index) * delay;
      
      setTimeout(() => {
        setVisibleItems(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      }, itemDelay);
    });
  }, [children.length, delay, direction]);

  return (
    <>
      {children.map((child, index) => (
        <OpacityTransition
          key={index}
          visible={visibleItems[index]}
          duration={duration}
        >
          {child}
        </OpacityTransition>
      ))}
    </>
  );
}

// StaggeredScale: 연쇄적 스케일 애니메이션
interface StaggeredScaleProps {
  children: React.ReactNode[];
  trigger: boolean;
  delay?: number;
  duration?: number;
}

export function StaggeredScale({
  children,
  trigger,
  delay = 50,
  duration = transitionConfig.duration.normal,
}: StaggeredScaleProps) {
  const [activeItems, setActiveItems] = useState<boolean[]>(
    new Array(children.length).fill(false)
  );

  useEffect(() => {
    if (trigger) {
      children.forEach((_, index) => {
        setTimeout(() => {
          setActiveItems(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        }, index * delay);
      });
    } else {
      setActiveItems(new Array(children.length).fill(false));
    }
  }, [trigger, children.length, delay]);

  return (
    <>
      {children.map((child, index) => (
        <ScaleTransition
          key={index}
          scale={activeItems[index] ? 1 : 0.8}
          duration={duration}
        >
          <OpacityTransition
            visible={activeItems[index]}
            duration={duration}
          >
            {child}
          </OpacityTransition>
        </ScaleTransition>
      ))}
    </>
  );
}