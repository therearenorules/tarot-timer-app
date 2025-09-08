// React Native 호환 Touch/Press States 시스템
// Hover 효과를 TouchableOpacity, Pressable의 activeOpacity와 scale 애니메이션으로 대체

import { tokens } from './webStyles';

// Touch State 설정값들
export const touchConfig = {
  // 기본 activeOpacity 값들
  opacity: {
    light: 0.9,    // 가벼운 터치 효과
    normal: 0.7,   // 일반적인 터치 효과  
    strong: 0.5,   // 강한 터치 효과
    disabled: 0.3, // 비활성화 상태
  },
  
  // Scale 애니메이션 값들
  scale: {
    subtle: 0.98,  // 살짝 줄어드는 효과
    normal: 0.95,  // 일반적인 눌림 효과
    strong: 0.92,  // 강한 눌림 효과
  },
  
  // 애니메이션 지속시간
  duration: {
    fast: 150,     // 빠른 애니메이션
    normal: 200,   // 일반 애니메이션
    slow: 300,     // 느린 애니메이션
  },
  
  // 애니메이션 곡선
  easing: {
    standard: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    decelerate: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0.0, 1, 1)',
  },
};

// 컴포넌트별 터치 상태 설정
export const touchStates = {
  // 기본 버튼
  button: {
    default: {
      scale: 1,
      opacity: 1,
      backgroundColor: tokens.colors.primary,
    },
    pressed: {
      scale: touchConfig.scale.normal,
      opacity: touchConfig.opacity.normal,
      backgroundColor: tokens.colors.primary,
    },
    hover: { // 웹용 호버 효과
      scale: 1.02,
      opacity: 1,
      backgroundColor: tokens.colors.primary,
    },
  },
  
  // 프리미엄 버튼
  premiumButton: {
    default: {
      scale: 1,
      opacity: 1,
      backgroundColor: tokens.colors.premiumGold,
    },
    pressed: {
      scale: touchConfig.scale.normal,
      opacity: touchConfig.opacity.light,
      backgroundColor: '#E6C547', // 약간 더 진한 골드
    },
    hover: {
      scale: 1.05,
      opacity: 1,
      backgroundColor: '#E6C547',
    },
  },
  
  // 세컨더리 버튼
  secondaryButton: {
    default: {
      scale: 1,
      opacity: 1,
      backgroundColor: 'transparent',
      borderColor: tokens.colors.primary,
    },
    pressed: {
      scale: touchConfig.scale.subtle,
      opacity: touchConfig.opacity.normal,
      backgroundColor: tokens.colors.primary + '0D', // 5% opacity
      borderColor: tokens.colors.primary,
    },
    hover: {
      scale: 1.02,
      opacity: 1,
      backgroundColor: tokens.colors.primary + '0D',
      borderColor: tokens.colors.primary,
    },
  },
  
  // 카드 컴포넌트
  card: {
    default: {
      scale: 1,
      opacity: 1,
      elevation: 2,
    },
    pressed: {
      scale: touchConfig.scale.subtle,
      opacity: touchConfig.opacity.light,
      elevation: 1,
    },
    hover: {
      scale: 1.02,
      opacity: 1,
      elevation: 4,
    },
  },
  
  // 타로 카드
  tarotCard: {
    default: {
      scale: 1,
      opacity: 1,
      shadowOpacity: 0.15,
    },
    pressed: {
      scale: touchConfig.scale.normal,
      opacity: touchConfig.opacity.light,
      shadowOpacity: 0.1,
    },
    hover: {
      scale: 1.05,
      opacity: 1,
      shadowOpacity: 0.25,
    },
  },
  
  // 탭 버튼
  tabButton: {
    default: {
      scale: 1,
      opacity: 1,
      backgroundColor: 'transparent',
    },
    pressed: {
      scale: touchConfig.scale.subtle,
      opacity: touchConfig.opacity.normal,
      backgroundColor: tokens.colors.accent + '0D',
    },
    hover: {
      scale: 1.02,
      opacity: 1,
      backgroundColor: tokens.colors.accent + '0D',
    },
    active: {
      scale: 1,
      opacity: 1,
      backgroundColor: tokens.colors.accent + '1A', // 10% opacity
    },
  },
  
  // 아이콘 버튼
  iconButton: {
    default: {
      scale: 1,
      opacity: 1,
    },
    pressed: {
      scale: touchConfig.scale.strong,
      opacity: touchConfig.opacity.normal,
    },
    hover: {
      scale: 1.1,
      opacity: 1,
    },
  },
  
  // 리스트 아이템
  listItem: {
    default: {
      scale: 1,
      opacity: 1,
      backgroundColor: 'transparent',
    },
    pressed: {
      scale: touchConfig.scale.subtle,
      opacity: touchConfig.opacity.light,
      backgroundColor: tokens.colors.muted + '40', // 25% opacity
    },
    hover: {
      scale: 1.01,
      opacity: 1,
      backgroundColor: tokens.colors.muted + '1A', // 10% opacity
    },
  },
};

// 웹용 Hover 효과를 CSS로 생성
export const createHoverStyle = (componentType: keyof typeof touchStates) => {
  const states = touchStates[componentType];
  
  return {
    transition: `all ${touchConfig.duration.normal}ms ${touchConfig.easing.standard}`,
    cursor: 'pointer',
    
    '&:hover': {
      transform: `scale(${states.hover.scale})`,
      opacity: states.hover.opacity,
      ...states.hover,
    },
    
    '&:active': {
      transform: `scale(${states.pressed.scale})`,
      opacity: states.pressed.opacity,
      ...states.pressed,
    },
  };
};

// React Native용 Pressable Props 생성
export const createPressableProps = (
  componentType: keyof typeof touchStates,
  onPress?: () => void
) => {
  const states = touchStates[componentType];
  
  return {
    onPress,
    style: ({ pressed }: { pressed: boolean }) => [
      states.default,
      pressed && states.pressed,
      {
        transition: `all ${touchConfig.duration.normal}ms ${touchConfig.easing.standard}`,
      },
    ],
  };
};

// TouchableOpacity Props 생성
export const createTouchableOpacityProps = (
  componentType: keyof typeof touchStates,
  onPress?: () => void
) => {
  const states = touchStates[componentType];
  
  return {
    onPress,
    activeOpacity: states.pressed.opacity,
    style: states.default,
  };
};

// Guidelines.md 기반 브랜드 터치 효과
export const brandTouchEffects = {
  // 미스틱 글로우 효과 (터치 시 골드 빛 효과)
  mysticalGlow: {
    default: {
      shadowColor: tokens.colors.premiumGold,
      shadowOpacity: 0,
      shadowRadius: 0,
    },
    pressed: {
      shadowColor: tokens.colors.premiumGold,
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    hover: {
      shadowColor: tokens.colors.premiumGold,
      shadowOpacity: 0.2,
      shadowRadius: 12,
    },
  },
  
  // 깊은 보라 효과
  deepPurplePress: {
    default: {
      backgroundColor: 'transparent',
      borderColor: tokens.colors.deepPurple + '40',
    },
    pressed: {
      backgroundColor: tokens.colors.deepPurple + '1A',
      borderColor: tokens.colors.deepPurple,
    },
    hover: {
      backgroundColor: tokens.colors.deepPurple + '0D',
      borderColor: tokens.colors.deepPurple + '80',
    },
  },
  
  // 프리미엄 골드 리플 효과
  goldRipple: {
    default: {
      backgroundColor: 'transparent',
      transform: [{ scale: 1 }],
    },
    pressed: {
      backgroundColor: tokens.colors.premiumGold + '1A',
      transform: [{ scale: 0.98 }],
    },
    hover: {
      backgroundColor: tokens.colors.premiumGold + '0D',
      transform: [{ scale: 1.02 }],
    },
  },
};

// 애니메이션을 위한 Reanimated 스타일 (React Native 전용)
export const createAnimatedStyle = (
  componentType: keyof typeof touchStates,
  animatedValue: any // Reanimated Shared Value
) => {
  const states = touchStates[componentType];
  
  return {
    transform: [
      {
        scale: animatedValue.value 
          ? states.pressed.scale 
          : states.default.scale
      }
    ],
    opacity: animatedValue.value 
      ? states.pressed.opacity 
      : states.default.opacity,
  };
};

// 햅틱 피드백 설정 (React Native 전용)
export const hapticConfig = {
  light: 'impactLight',      // 가벼운 터치
  medium: 'impactMedium',    // 일반 터치
  heavy: 'impactHeavy',      // 강한 터치
  selection: 'selection',    // 선택 피드백
  notification: 'notificationSuccess', // 성공 알림
  warning: 'notificationWarning',      // 경고 알림
  error: 'notificationError',          // 오류 알림
};

// 컴포넌트별 햅틱 피드백 매핑
export const componentHaptics = {
  button: hapticConfig.medium,
  premiumButton: hapticConfig.heavy,
  secondaryButton: hapticConfig.light,
  tarotCard: hapticConfig.medium,
  tabButton: hapticConfig.selection,
  iconButton: hapticConfig.light,
  listItem: hapticConfig.light,
};

// 웹용 CSS 클래스 생성 (globals.css에 추가할 스타일)
export const generateWebTouchStyles = () => {
  const styles: string[] = [];
  
  Object.entries(touchStates).forEach(([key, states]) => {
    const className = `touch-${key}`;
    
    styles.push(`
      .${className} {
        transition: all ${touchConfig.duration.normal}ms ${touchConfig.easing.standard};
        cursor: pointer;
        user-select: none;
      }
      
      .${className}:hover {
        transform: scale(${states.hover.scale});
        opacity: ${states.hover.opacity};
      }
      
      .${className}:active {
        transform: scale(${states.pressed.scale});
        opacity: ${states.pressed.opacity};
      }
      
      .${className}:disabled {
        opacity: ${touchConfig.opacity.disabled};
        cursor: not-allowed;
      }
    `);
  });
  
  return styles.join('\n');
};