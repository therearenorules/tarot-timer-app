// React Native 애니메이션 훅
import { useEffect, useRef } from 'react';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withRepeat,
  withDelay,
  runOnJS,
  Easing,
  SharedValue,
} from 'react-native-reanimated';
import { TarotAnimations, AnimationPreset, SpringPreset } from '../constants/animations';

// 기본 애니메이션 훅
export const useAnimation = (initialValue: number = 0) => {
  const animatedValue = useSharedValue(initialValue);

  const animateTo = (
    toValue: number,
    config?: {
      duration?: number;
      easing?: any;
      delay?: number;
      onComplete?: () => void;
    }
  ) => {
    const {
      duration = TarotAnimations.timing.medium,
      easing = TarotAnimations.easing.easeInOut,
      delay = 0,
      onComplete,
    } = config || {};

    const animation = withTiming(toValue, { duration, easing }, (finished) => {
      'worklet';
      if (finished && onComplete) {
        runOnJS(onComplete)();
      }
    });

    if (delay > 0) {
      animatedValue.value = withDelay(delay, animation);
    } else {
      animatedValue.value = animation;
    }
  };

  const animateWithSpring = (
    toValue: number,
    config?: {
      springPreset?: SpringPreset;
      delay?: number;
      onComplete?: () => void;
    }
  ) => {
    const {
      springPreset = 'gentle',
      delay = 0,
      onComplete,
    } = config || {};

    const springConfig = TarotAnimations.springs[springPreset];
    
    const animation = withSpring(toValue, springConfig, (finished) => {
      'worklet';
      if (finished && onComplete) {
        runOnJS(onComplete)();
      }
    });

    if (delay > 0) {
      animatedValue.value = withDelay(delay, animation);
    } else {
      animatedValue.value = animation;
    }
  };

  return {
    animatedValue,
    animateTo,
    animateWithSpring,
  };
};

// 신비로운 펄스 애니메이션 훅
export const useMysticalPulse = (autoStart: boolean = true) => {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  
  const start = () => {
    const { duration, easing } = TarotAnimations.presets.mysticalPulse;
    
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: duration / 2, easing }),
        withTiming(1, { duration: duration / 2, easing })
      ),
      -1,
      false
    );
    
    scale.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: duration / 2, easing }),
        withTiming(1, { duration: duration / 2, easing })
      ),
      -1,
      false
    );
  };

  const stop = () => {
    opacity.value = withTiming(1, { duration: 300 });
    scale.value = withTiming(1, { duration: 300 });
  };

  useEffect(() => {
    if (autoStart) {
      start();
    }
    return () => stop();
  }, [autoStart]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return {
    animatedStyle,
    start,
    stop,
  };
};

// 카드 뒤집기 애니메이션 훅
export const useCardFlip = () => {
  const rotateY = useSharedValue(0);
  const isFlipped = useRef(false);

  const flip = (onFlipComplete?: (isFlipped: boolean) => void) => {
    const newRotation = isFlipped.current ? 0 : 180;
    isFlipped.current = !isFlipped.current;

    const { duration, easing } = TarotAnimations.presets.cardFlip;
    
    rotateY.value = withTiming(newRotation, { duration, easing }, (finished) => {
      'worklet';
      if (finished && onFlipComplete) {
        runOnJS(onFlipComplete)(isFlipped.current);
      }
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotateY.value}deg` }],
  }));

  return {
    animatedStyle,
    flip,
    isFlipped: isFlipped.current,
  };
};

// 페이드 애니메이션 훅
export const useFadeAnimation = (initialOpacity: number = 0) => {
  const opacity = useSharedValue(initialOpacity);

  const fadeIn = (config?: { duration?: number; delay?: number; onComplete?: () => void }) => {
    const {
      duration = TarotAnimations.presets.fadeIn.duration,
      delay = 0,
      onComplete,
    } = config || {};

    const animation = withTiming(1, { 
      duration, 
      easing: TarotAnimations.easing.easeOut 
    }, (finished) => {
      'worklet';
      if (finished && onComplete) {
        runOnJS(onComplete)();
      }
    });

    opacity.value = delay > 0 ? withDelay(delay, animation) : animation;
  };

  const fadeOut = (config?: { duration?: number; delay?: number; onComplete?: () => void }) => {
    const {
      duration = TarotAnimations.presets.fadeOut.duration,
      delay = 0,
      onComplete,
    } = config || {};

    const animation = withTiming(0, { 
      duration, 
      easing: TarotAnimations.easing.easeIn 
    }, (finished) => {
      'worklet';
      if (finished && onComplete) {
        runOnJS(onComplete)();
      }
    });

    opacity.value = delay > 0 ? withDelay(delay, animation) : animation;
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return {
    animatedStyle,
    fadeIn,
    fadeOut,
    opacity,
  };
};

// 스케일 애니메이션 훅
export const useScaleAnimation = (initialScale: number = 1) => {
  const scale = useSharedValue(initialScale);

  const scaleIn = (config?: { duration?: number; delay?: number; onComplete?: () => void }) => {
    const {
      duration = TarotAnimations.presets.scaleIn.duration,
      delay = 0,
      onComplete,
    } = config || {};

    const animation = withTiming(1, { 
      duration, 
      easing: TarotAnimations.easing.mystical 
    }, (finished) => {
      'worklet';
      if (finished && onComplete) {
        runOnJS(onComplete)();
      }
    });

    scale.value = delay > 0 ? withDelay(delay, animation) : animation;
  };

  const scaleOut = (config?: { duration?: number; delay?: number; onComplete?: () => void }) => {
    const {
      duration = TarotAnimations.presets.scaleOut.duration,
      delay = 0,
      onComplete,
    } = config || {};

    const animation = withTiming(0.8, { 
      duration, 
      easing: TarotAnimations.easing.easeIn 
    }, (finished) => {
      'worklet';
      if (finished && onComplete) {
        runOnJS(onComplete)();
      }
    });

    scale.value = delay > 0 ? withDelay(delay, animation) : animation;
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return {
    animatedStyle,
    scaleIn,
    scaleOut,
    scale,
  };
};

// 슬라이드 애니메이션 훅
export const useSlideAnimation = (direction: 'left' | 'right' | 'up' | 'down' = 'right') => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  const getInitialPosition = () => {
    switch (direction) {
      case 'right':
        return { x: 300, y: 0 };
      case 'left':
        return { x: -300, y: 0 };
      case 'up':
        return { x: 0, y: -100 };
      case 'down':
        return { x: 0, y: 100 };
      default:
        return { x: 300, y: 0 };
    }
  };

  const slideIn = (config?: { duration?: number; delay?: number; onComplete?: () => void }) => {
    const {
      duration = TarotAnimations.timing.medium,
      delay = 0,
      onComplete,
    } = config || {};

    const initialPos = getInitialPosition();
    translateX.value = initialPos.x;
    translateY.value = initialPos.y;
    opacity.value = 0;

    const animation = () => {
      translateX.value = withTiming(0, { 
        duration, 
        easing: TarotAnimations.easing.cardSlide 
      });
      translateY.value = withTiming(0, { 
        duration, 
        easing: TarotAnimations.easing.cardSlide 
      });
      opacity.value = withTiming(1, { 
        duration, 
        easing: TarotAnimations.easing.easeOut 
      }, (finished) => {
        'worklet';
        if (finished && onComplete) {
          runOnJS(onComplete)();
        }
      });
    };

    if (delay > 0) {
      setTimeout(animation, delay);
    } else {
      animation();
    }
  };

  const slideOut = (config?: { duration?: number; delay?: number; onComplete?: () => void }) => {
    const {
      duration = TarotAnimations.timing.fast,
      delay = 0,
      onComplete,
    } = config || {};

    const finalPos = getInitialPosition();
    
    const animation = () => {
      translateX.value = withTiming(finalPos.x, { 
        duration, 
        easing: TarotAnimations.easing.easeIn 
      });
      translateY.value = withTiming(finalPos.y, { 
        duration, 
        easing: TarotAnimations.easing.easeIn 
      });
      opacity.value = withTiming(0, { 
        duration, 
        easing: TarotAnimations.easing.easeIn 
      }, (finished) => {
        'worklet';
        if (finished && onComplete) {
          runOnJS(onComplete)();
        }
      });
    };

    if (delay > 0) {
      setTimeout(animation, delay);
    } else {
      animation();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
    opacity: opacity.value,
  }));

  return {
    animatedStyle,
    slideIn,
    slideOut,
  };
};

// 버튼 누름 효과 훅
export const useButtonPress = () => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const onPressIn = () => {
    scale.value = withTiming(0.95, { 
      duration: TarotAnimations.presets.buttonPress.duration,
      easing: TarotAnimations.easing.easeInOut 
    });
    opacity.value = withTiming(0.8, { 
      duration: TarotAnimations.presets.buttonPress.duration,
      easing: TarotAnimations.easing.easeInOut 
    });
  };

  const onPressOut = () => {
    scale.value = withTiming(1, { 
      duration: TarotAnimations.presets.buttonRelease.duration,
      easing: TarotAnimations.easing.mystical 
    });
    opacity.value = withTiming(1, { 
      duration: TarotAnimations.presets.buttonRelease.duration,
      easing: TarotAnimations.easing.mystical 
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return {
    animatedStyle,
    onPressIn,
    onPressOut,
  };
};

// 글로우 효과 훅
export const useGlowEffect = (autoStart: boolean = true) => {
  const shadowOpacity = useSharedValue(0.3);
  const shadowRadius = useSharedValue(10);

  const start = () => {
    const { duration, easing } = TarotAnimations.presets.mysticalGlow;
    
    shadowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.8, { duration: duration / 2, easing }),
        withTiming(0.3, { duration: duration / 2, easing })
      ),
      -1,
      false
    );
    
    shadowRadius.value = withRepeat(
      withSequence(
        withTiming(20, { duration: duration / 2, easing }),
        withTiming(10, { duration: duration / 2, easing })
      ),
      -1,
      false
    );
  };

  const stop = () => {
    shadowOpacity.value = withTiming(0.3, { duration: 300 });
    shadowRadius.value = withTiming(10, { duration: 300 });
  };

  useEffect(() => {
    if (autoStart) {
      start();
    }
    return () => stop();
  }, [autoStart]);

  const animatedStyle = useAnimatedStyle(() => ({
    shadowOpacity: shadowOpacity.value,
    shadowRadius: shadowRadius.value,
  }));

  return {
    animatedStyle,
    start,
    stop,
  };
};

// 진동 애니메이션 훅
export const useShakeAnimation = () => {
  const translateX = useSharedValue(0);

  const shake = (onComplete?: () => void) => {
    const { duration } = TarotAnimations.presets.shake;
    
    translateX.value = withSequence(
      withTiming(-10, { duration: duration / 8 }),
      withTiming(10, { duration: duration / 8 }),
      withTiming(-10, { duration: duration / 8 }),
      withTiming(10, { duration: duration / 8 }),
      withTiming(-5, { duration: duration / 8 }),
      withTiming(5, { duration: duration / 8 }),
      withTiming(0, { duration: duration / 4 }, (finished) => {
        'worklet';
        if (finished && onComplete) {
          runOnJS(onComplete)();
        }
      })
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return {
    animatedStyle,
    shake,
  };
};

// 스태거 애니메이션 훅 (여러 요소 순차 애니메이션)
export const useStaggerAnimation = (itemCount: number, staggerDelay: number = 50) => {
  const animations = useRef<SharedValue<number>[]>([]);
  
  // 필요한 만큼 애니메이션 값 생성
  if (animations.current.length !== itemCount) {
    animations.current = Array.from({ length: itemCount }, () => useSharedValue(0));
  }

  const startStagger = (preset: AnimationPreset = 'fadeIn') => {
    const animationConfig = TarotAnimations.presets[preset];
    
    animations.current.forEach((animValue, index) => {
      const delay = index * staggerDelay;
      animValue.value = withDelay(
        delay,
        withTiming(1, {
          duration: animationConfig.duration,
          easing: TarotAnimations.easing.easeOut,
        })
      );
    });
  };

  const resetStagger = () => {
    animations.current.forEach((animValue) => {
      animValue.value = 0;
    });
  };

  const getAnimatedStyle = (index: number) => {
    return useAnimatedStyle(() => ({
      opacity: animations.current[index]?.value || 0,
      transform: [{ scale: animations.current[index]?.value || 0 }],
    }));
  };

  return {
    startStagger,
    resetStagger,
    getAnimatedStyle,
  };
};