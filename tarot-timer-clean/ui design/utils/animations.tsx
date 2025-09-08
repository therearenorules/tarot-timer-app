import { useEffect, useRef, useState } from 'react';

// React Native 호환 애니메이션 훅들
// CSS keyframes 대신 programmatic 애니메이션 사용

export interface AnimationConfig {
  duration?: number;
  delay?: number;
  iterations?: number | 'infinite';
  easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

// Mystical Pulse 애니메이션 훅
export function useMysticalPulse(config: AnimationConfig = {}) {
  const {
    duration = 2000,
    delay = 0,
    iterations = 'infinite',
    easing = 'ease-in-out'
  } = config;

  const [animationStyle, setAnimationStyle] = useState({
    opacity: 1,
    transform: 'scale(1)'
  });

  const animationIdRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const easingFunctions = {
    linear: (t: number) => t,
    ease: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
    'ease-in': (t: number) => t * t,
    'ease-out': (t: number) => t * (2 - t),
    'ease-in-out': (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  };

  const easingFunction = easingFunctions[easing];

  useEffect(() => {
    const startAnimation = () => {
      if (delay > 0) {
        setTimeout(() => {
          animate();
        }, delay);
      } else {
        animate();
      }
    };

    const animate = () => {
      startTimeRef.current = Date.now();
      
      const frame = () => {
        if (!startTimeRef.current) return;
        
        const elapsed = Date.now() - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easingFunction(progress);
        
        // 0 -> 0.5 -> 1의 사이클
        let phase;
        if (easedProgress <= 0.5) {
          phase = easedProgress * 2; // 0 -> 1
        } else {
          phase = (1 - easedProgress) * 2; // 1 -> 0
        }
        
        const opacity = 1 - (phase * 0.2); // 1 -> 0.8 -> 1
        const scale = 1 + (phase * 0.02); // 1 -> 1.02 -> 1
        
        setAnimationStyle({
          opacity,
          transform: `scale(${scale})`
        });
        
        if (progress < 1) {
          animationIdRef.current = requestAnimationFrame(frame);
        } else if (iterations === 'infinite') {
          // 무한 반복
          startTimeRef.current = Date.now();
          animationIdRef.current = requestAnimationFrame(frame);
        }
      };
      
      animationIdRef.current = requestAnimationFrame(frame);
    };

    startAnimation();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [duration, delay, iterations, easing]);

  return animationStyle;
}

// 부드러운 Float 애니메이션 훅
export function useGentleFloat(config: AnimationConfig = {}) {
  const { duration = 3000, delay = 0 } = config;
  const [translateY, setTranslateY] = useState(0);
  const animationIdRef = useRef<number>();

  useEffect(() => {
    const startAnimation = () => {
      if (delay > 0) {
        setTimeout(() => {
          animate();
        }, delay);
      } else {
        animate();
      }
    };

    const animate = () => {
      const startTime = Date.now();
      
      const frame = () => {
        const elapsed = Date.now() - startTime;
        const progress = (elapsed % duration) / duration;
        
        // 부드러운 사인파 움직임
        const newTranslateY = Math.sin(progress * Math.PI * 2) * 4; // ±4px
        setTranslateY(newTranslateY);
        
        animationIdRef.current = requestAnimationFrame(frame);
      };
      
      animationIdRef.current = requestAnimationFrame(frame);
    };

    startAnimation();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [duration, delay]);

  return {
    transform: `translateY(${translateY}px)`
  };
}

// 반짝임 효과 훅
export function useSparkleEffect(config: AnimationConfig = {}) {
  const { duration = 1500, delay = 0 } = config;
  const [animationStyle, setAnimationStyle] = useState({
    opacity: 0.4,
    transform: 'scale(1)'
  });
  const animationIdRef = useRef<number>();

  useEffect(() => {
    const startAnimation = () => {
      if (delay > 0) {
        setTimeout(() => {
          animate();
        }, delay);
      } else {
        animate();
      }
    };

    const animate = () => {
      const startTime = Date.now();
      
      const frame = () => {
        const elapsed = Date.now() - startTime;
        const progress = (elapsed % duration) / duration;
        
        // 빠른 반짝임 효과
        let phase;
        if (progress <= 0.5) {
          phase = progress * 2; // 0 -> 1
        } else {
          phase = (1 - progress) * 2; // 1 -> 0
        }
        
        const opacity = 0.4 + (phase * 0.6); // 0.4 -> 1 -> 0.4
        const scale = 1 + (Math.sin(progress * Math.PI * 4) * 0.05); // 작은 진동
        
        setAnimationStyle({
          opacity,
          transform: `scale(${scale})`
        });
        
        animationIdRef.current = requestAnimationFrame(frame);
      };
      
      animationIdRef.current = requestAnimationFrame(frame);
    };

    startAnimation();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [duration, delay]);

  return animationStyle;
}

// 호버 스케일 애니메이션 훅
export function useScaleHover(config: { scale?: number; duration?: number } = {}) {
  const { scale = 1.05, duration = 200 } = config;
  const [isHovered, setIsHovered] = useState(false);

  const handlers = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false)
  };

  const style = {
    transform: isHovered ? `scale(${scale})` : 'scale(1)',
    transition: `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    cursor: 'pointer'
  };

  return { style, handlers };
}

// 페이드 인 애니메이션 훅
export function useFadeIn(config: { delay?: number; duration?: number } = {}) {
  const { delay = 0, duration = 500 } = config;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return {
    opacity: isVisible ? 1 : 0,
    transition: `opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`
  };
}

// 슬라이드 인 애니메이션 훅
export function useSlideIn(config: {
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  distance?: number;
} = {}) {
  const { direction = 'up', delay = 0, duration = 300, distance = 20 } = config;
  const [isVisible, setIsVisible] = useState(false);

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

  return {
    opacity: isVisible ? 1 : 0,
    transform: getTransform(),
    transition: `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`
  };
}

// 로딩 스피너 애니메이션 훅
export function useLoadingSpinner() {
  const [rotation, setRotation] = useState(0);
  const animationIdRef = useRef<number>();

  useEffect(() => {
    const animate = () => {
      setRotation(prev => (prev + 2) % 360); // 2도씩 회전
      animationIdRef.current = requestAnimationFrame(animate);
    };

    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  return {
    transform: `rotate(${rotation}deg)`
  };
}

// 애니메이션 상태 관리 훅
export function useAnimationState() {
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const startAnimation = (duration: number = 1000) => {
    setIsAnimating(true);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsAnimating(false);
    }, duration);
  };

  const stopAnimation = () => {
    setIsAnimating(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { isAnimating, startAnimation, stopAnimation };
}

// 순차적 애니메이션 훅 (여러 요소를 순서대로 애니메이션)
export function useSequentialAnimation(itemCount: number, delay: number = 100) {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    for (let i = 0; i < itemCount; i++) {
      const timer = setTimeout(() => {
        setVisibleItems(prev => new Set([...prev, i]));
      }, i * delay);
      
      timers.push(timer);
    }

    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [itemCount, delay]);

  const getItemStyle = (index: number) => ({
    opacity: visibleItems.has(index) ? 1 : 0,
    transform: visibleItems.has(index) ? 'translateY(0)' : 'translateY(20px)',
    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)'
  });

  return { getItemStyle, visibleItems };
}

// React Native 호환 타이밍 함수들
export const easingFunctions = {
  // 표준 CSS easing을 React Native에서 사용 가능한 형태로 변환
  linear: 'linear',
  ease: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  easeIn: 'cubic-bezier(0.42, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.58, 1)',
  easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
  
  // 타로 앱에 특화된 easing
  mystical: 'cubic-bezier(0.4, 0, 0.6, 1)', // 신비로운 느낌
  gentle: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)', // 부드러운 움직임
  magical: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // 마법적인 튕김
} as const;

// 애니메이션 프리셋
export const animationPresets = {
  mysticalPulse: {
    duration: 2000,
    easing: 'ease-in-out' as const,
    iterations: 'infinite' as const
  },
  gentleFloat: {
    duration: 3000,
    easing: 'ease-in-out' as const,
    iterations: 'infinite' as const
  },
  sparkleEffect: {
    duration: 1500,
    easing: 'ease-in-out' as const,
    iterations: 'infinite' as const
  },
  cardFlip: {
    duration: 300,
    easing: 'ease-in-out' as const
  },
  modalSlide: {
    duration: 300,
    easing: 'ease-out' as const
  }
} as const;