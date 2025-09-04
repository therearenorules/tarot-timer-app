// React Native 애니메이션 및 트랜지션 시스템
import { Easing } from 'react-native-reanimated';

export const TarotAnimations = {
  // 기본 애니메이션 설정
  timing: {
    fast: 200,
    medium: 400,
    slow: 800,
    mystical: 2000, // 신비로운 펄스 애니메이션
  },

  // Easing 함수들
  easing: {
    // 기본 easing
    easeInOut: Easing.inOut(Easing.ease),
    easeOut: Easing.out(Easing.ease),
    easeIn: Easing.in(Easing.ease),
    
    // 신비로운 애니메이션용 커스텀 easing
    mystical: Easing.bezier(0.4, 0, 0.6, 1), // CSS cubic-bezier와 동일
    
    // 카드 애니메이션용
    cardFlip: Easing.bezier(0.25, 0.8, 0.25, 1),
    cardSlide: Easing.bezier(0.4, 0.0, 0.2, 1),
    
    // 스프링 애니메이션
    bounce: Easing.bounce,
    elastic: Easing.elastic(1.5),
  },

  // 애니메이션 프리셋
  presets: {
    // 신비로운 펄스 (CSS mystical-pulse 애니메이션)
    mysticalPulse: {
      duration: 2000,
      easing: Easing.bezier(0.4, 0, 0.6, 1),
      repeat: -1, // 무한 반복
      values: {
        opacity: [1, 0.8, 1],
        scale: [1, 1.02, 1],
      },
    },

    // 카드 등장 애니메이션
    cardEntrance: {
      duration: 600,
      easing: Easing.bezier(0.25, 0.8, 0.25, 1),
      values: {
        opacity: [0, 1],
        scale: [0.8, 1],
        translateY: [50, 0],
      },
    },

    // 카드 뒤집기 애니메이션
    cardFlip: {
      duration: 800,
      easing: Easing.bezier(0.25, 0.8, 0.25, 1),
      values: {
        rotateY: [0, 180],
      },
    },

    // 타이머 시작 애니메이션
    timerStart: {
      duration: 400,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      values: {
        scale: [1, 1.1, 1],
        opacity: [1, 0.8, 1],
      },
    },

    // 페이드 인/아웃
    fadeIn: {
      duration: 400,
      easing: Easing.out(Easing.ease),
      values: {
        opacity: [0, 1],
      },
    },

    fadeOut: {
      duration: 400,
      easing: Easing.in(Easing.ease),
      values: {
        opacity: [1, 0],
      },
    },

    // 슬라이드 애니메이션
    slideInRight: {
      duration: 400,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      values: {
        translateX: [300, 0],
        opacity: [0, 1],
      },
    },

    slideInLeft: {
      duration: 400,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      values: {
        translateX: [-300, 0],
        opacity: [0, 1],
      },
    },

    slideInUp: {
      duration: 400,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      values: {
        translateY: [100, 0],
        opacity: [0, 1],
      },
    },

    slideInDown: {
      duration: 400,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      values: {
        translateY: [-100, 0],
        opacity: [0, 1],
      },
    },

    // 스케일 애니메이션
    scaleIn: {
      duration: 400,
      easing: Easing.bezier(0.25, 0.8, 0.25, 1),
      values: {
        scale: [0.8, 1],
        opacity: [0, 1],
      },
    },

    scaleOut: {
      duration: 300,
      easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      values: {
        scale: [1, 0.8],
        opacity: [1, 0],
      },
    },

    // 버튼 누름 효과
    buttonPress: {
      duration: 100,
      easing: Easing.inOut(Easing.ease),
      values: {
        scale: [1, 0.95],
      },
    },

    buttonRelease: {
      duration: 200,
      easing: Easing.bezier(0.25, 0.8, 0.25, 1),
      values: {
        scale: [0.95, 1],
      },
    },

    // 글로우 효과 (신비로운 효과)
    mysticalGlow: {
      duration: 1500,
      easing: Easing.bezier(0.4, 0, 0.6, 1),
      repeat: -1,
      values: {
        shadowOpacity: [0.3, 0.8, 0.3],
        shadowRadius: [10, 20, 10],
      },
    },

    // 진동 효과
    shake: {
      duration: 600,
      easing: Easing.inOut(Easing.ease),
      values: {
        translateX: [0, -10, 10, -10, 10, -5, 5, 0],
      },
    },
  },

  // 페이지 전환 애니메이션
  transitions: {
    // 기본 스택 네비게이션 전환
    stack: {
      gestureDirection: 'horizontal' as const,
      transitionSpec: {
        open: {
          animation: 'timing' as const,
          config: {
            duration: 400,
            easing: Easing.bezier(0.25, 0.8, 0.25, 1),
          },
        },
        close: {
          animation: 'timing' as const,
          config: {
            duration: 300,
            easing: Easing.bezier(0.4, 0.0, 0.2, 1),
          },
        },
      },
    },

    // 탭 네비게이션 전환 (부드러운 크로스페이드)
    tab: {
      animation: 'timing' as const,
      config: {
        duration: 300,
        easing: Easing.out(Easing.ease),
      },
    },

    // 모달 전환
    modal: {
      gestureDirection: 'vertical' as const,
      transitionSpec: {
        open: {
          animation: 'spring' as const,
          config: {
            stiffness: 1000,
            damping: 500,
            mass: 3,
            overshootClamping: true,
            restDisplacementThreshold: 0.01,
            restSpeedThreshold: 0.01,
          },
        },
        close: {
          animation: 'timing' as const,
          config: {
            duration: 200,
            easing: Easing.in(Easing.ease),
          },
        },
      },
    },
  },

  // 스프링 애니메이션 설정
  springs: {
    // 부드러운 스프링
    gentle: {
      damping: 500,
      stiffness: 1000,
      mass: 3,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },

    // 활발한 스프링
    bouncy: {
      damping: 300,
      stiffness: 800,
      mass: 2,
      overshootClamping: false,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },

    // 빠른 스프링
    fast: {
      damping: 800,
      stiffness: 1200,
      mass: 1,
      overshootClamping: true,
      restDisplacementThreshold: 0.01,
      restSpeedThreshold: 0.01,
    },
  },

  // 지연 설정
  delays: {
    none: 0,
    short: 100,
    medium: 200,
    long: 300,
    stagger: 50, // 연속 애니메이션 간격
  },
} as const;

// 애니메이션 유틸리티 함수들
export const AnimationUtils = {
  // Stagger 애니메이션을 위한 지연 계산
  calculateStaggerDelay: (index: number, baseDelay: number = 50): number => {
    return index * baseDelay;
  },

  // 진동 패턴 (햅틱 피드백과 함께 사용)
  getVibrationPattern: (type: 'light' | 'medium' | 'heavy'): number[] => {
    switch (type) {
      case 'light':
        return [0, 50];
      case 'medium':
        return [0, 100, 50, 100];
      case 'heavy':
        return [0, 150, 100, 150];
      default:
        return [0, 50];
    }
  },

  // 애니메이션 진행률을 기반으로 값 보간
  interpolate: (
    progress: number,
    inputRange: number[],
    outputRange: number[]
  ): number => {
    'worklet';
    
    if (inputRange.length !== outputRange.length) {
      throw new Error('Input and output ranges must have the same length');
    }

    // 클램핑
    const clampedProgress = Math.max(0, Math.min(1, progress));
    
    // 구간 찾기
    let i = 0;
    while (i < inputRange.length - 1 && clampedProgress > inputRange[i + 1]) {
      i++;
    }
    
    if (i === inputRange.length - 1) {
      return outputRange[i];
    }
    
    // 선형 보간
    const inputStart = inputRange[i];
    const inputEnd = inputRange[i + 1];
    const outputStart = outputRange[i];
    const outputEnd = outputRange[i + 1];
    
    const ratio = (clampedProgress - inputStart) / (inputEnd - inputStart);
    return outputStart + ratio * (outputEnd - outputStart);
  },
};

export type AnimationPreset = keyof typeof TarotAnimations.presets;
export type TransitionPreset = keyof typeof TarotAnimations.transitions;
export type SpringPreset = keyof typeof TarotAnimations.springs;