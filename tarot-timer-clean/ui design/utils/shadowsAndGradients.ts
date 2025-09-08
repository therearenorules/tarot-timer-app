// React Native 호환 Shadow와 Gradient 시스템
// 복잡한 box-shadow와 gradient를 단순화하여 React Native에서 사용 가능

import { tokens } from './webStyles';

// React Native 호환 Shadow 레벨
export const shadows = {
  // 기본 그림자 (React Native elevation 기반)
  none: {
    web: { boxShadow: 'none' },
    native: { elevation: 0, shadowOpacity: 0 }
  },
  
  xs: {
    web: { boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' },
    native: { 
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 1,
    }
  },
  
  sm: {
    web: { boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)' },
    native: { 
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    }
  },
  
  md: {
    web: { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' },
    native: { 
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
    }
  },
  
  lg: {
    web: { boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' },
    native: { 
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    }
  },
  
  xl: {
    web: { boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' },
    native: { 
      elevation: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    }
  },
  
  // Mystical 브랜드 그림자들 (Guidelines.md 기반)
  mystical: {
    web: { boxShadow: '0 8px 32px rgba(74, 26, 79, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)' },
    native: { 
      elevation: 6,
      shadowColor: '#4A1A4F',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    }
  },
  
  premium: {
    web: { boxShadow: '0 8px 32px rgba(212, 175, 55, 0.2), 0 4px 16px rgba(74, 26, 79, 0.1)' },
    native: { 
      elevation: 8,
      shadowColor: '#D4AF37',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
    }
  },
  
  glowing: {
    web: { boxShadow: '0 0 20px rgba(212, 175, 55, 0.3), 0 4px 16px rgba(74, 26, 79, 0.1)' },
    native: { 
      elevation: 6,
      shadowColor: '#D4AF37',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
    }
  },
};

// React Native 호환 Gradient 시스템 (LinearGradient 사용)
export const gradients = {
  // 기본 그라데이션들
  primary: {
    colors: [tokens.colors.primary, tokens.colors.deepPurple],
    start: [0, 0],
    end: [1, 1], // 45도 대각선
  },
  
  secondary: {
    colors: [tokens.colors.secondary, tokens.colors.muted],
    start: [0, 0],
    end: [1, 0], // 수평
  },
  
  accent: {
    colors: [tokens.colors.accent, tokens.colors.premiumGold],
    start: [0, 0],
    end: [1, 1],
  },
  
  // Mystical 브랜드 그라데이션들 (Guidelines.md 기반)
  mysticalBackground: {
    colors: [
      tokens.colors.background, 
      tokens.colors.muted + '33', // 20% opacity
      tokens.colors.background
    ],
    start: [0, 0],
    end: [1, 1],
  },
  
  mysticalCard: {
    colors: [
      'rgba(255, 255, 255, 0.18)',
      'rgba(248, 246, 249, 0.12)'
    ],
    start: [0, 0],
    end: [1, 1],
  },
  
  premiumGlow: {
    colors: [
      'rgba(212, 175, 55, 0.15)',
      'rgba(74, 26, 79, 0.05)',
      'rgba(212, 175, 55, 0.1)'
    ],
    start: [0, 0],
    end: [1, 1],
  },
  
  deepMystic: {
    colors: [
      tokens.colors.midnightBlue,
      tokens.colors.deepPurple,
      tokens.colors.midnightBlue
    ],
    start: [0, 0],
    end: [1, 1],
  },
  
  // 카드 스프레드용 그라데이션
  cardGlow: {
    colors: [
      'rgba(212, 175, 55, 0.1)',
      'rgba(74, 26, 79, 0.05)'
    ],
    start: [0, 0],
    end: [1, 0],
  },
  
  // 탭 바용 그라데이션
  tabBarGlow: {
    colors: [
      'rgba(255, 255, 255, 0.98)',
      'rgba(248, 246, 249, 0.95)'
    ],
    start: [0, 0],
    end: [0, 1],
  },
};

// 웹에서 CSS, React Native에서 LinearGradient 사용하는 헬퍼
export const createGradientStyle = (gradientKey: keyof typeof gradients, isWeb: boolean = true) => {
  const gradient = gradients[gradientKey];
  
  if (isWeb) {
    // 웹용 CSS linear-gradient
    const angle = gradient.start[0] === 0 && gradient.end[1] === 1 ? '135deg' : 
                 gradient.start[0] === 0 && gradient.end[0] === 1 ? '90deg' : '45deg';
    
    return {
      background: `linear-gradient(${angle}, ${gradient.colors.join(', ')})`
    };
  } else {
    // React Native용 props
    return {
      colors: gradient.colors,
      start: gradient.start,
      end: gradient.end,
    };
  }
};

// Shadow 적용 헬퍼
export const applyShadow = (shadowKey: keyof typeof shadows, isWeb: boolean = true) => {
  const shadow = shadows[shadowKey];
  return isWeb ? shadow.web : shadow.native;
};

// 복잡한 박스 섀도우를 React Native 호환으로 변환
export const convertComplexShadow = (cssBoxShadow: string) => {
  // 복잡한 CSS box-shadow를 분석하여 React Native 호환 형태로 변환
  
  // 일반적인 패턴들 매칭
  const premiumShadowPattern = /0 8px 32px rgba\(212, 175, 55, ([\d.]+)\)/;
  const mysticalShadowPattern = /0 4px 20px rgba\(74, 26, 79, ([\d.]+)\)/;
  const basicShadowPattern = /0 (\d+)px (\d+)px.*rgba\(0, 0, 0, ([\d.]+)\)/;
  
  if (premiumShadowPattern.test(cssBoxShadow)) {
    return shadows.premium.native;
  } else if (mysticalShadowPattern.test(cssBoxShadow)) {
    return shadows.mystical.native;
  } else if (basicShadowPattern.test(cssBoxShadow)) {
    const match = cssBoxShadow.match(basicShadowPattern);
    if (match) {
      const [, offsetY, blur, opacity] = match;
      return {
        elevation: Math.min(parseInt(blur) / 2, 24), // Android elevation 제한
        shadowColor: '#000',
        shadowOffset: { width: 0, height: parseInt(offsetY) },
        shadowOpacity: parseFloat(opacity),
        shadowRadius: parseInt(blur) / 2,
      };
    }
  }
  
  // 기본값
  return shadows.md.native;
};

// 복잡한 그라데이션을 React Native 호환으로 변환
export const convertComplexGradient = (cssGradient: string) => {
  // 복잡한 CSS gradient를 분석하여 React Native 호환 형태로 변환
  
  // linear-gradient 패턴 추출
  const linearGradientPattern = /linear-gradient\(([^)]+)\)/;
  const match = cssGradient.match(linearGradientPattern);
  
  if (match) {
    const gradientContent = match[1];
    const parts = gradientContent.split(',').map(part => part.trim());
    
    // 각도나 방향 추출
    const direction = parts[0];
    const colors = parts.slice(1);
    
    // 방향에 따른 start/end 좌표 결정
    let start = [0, 0];
    let end = [1, 1];
    
    if (direction.includes('to right')) {
      start = [0, 0]; end = [1, 0];
    } else if (direction.includes('to left')) {
      start = [1, 0]; end = [0, 0];
    } else if (direction.includes('to top')) {
      start = [0, 1]; end = [0, 0];
    } else if (direction.includes('to bottom')) {
      start = [0, 0]; end = [0, 1];
    } else if (direction.includes('135deg')) {
      start = [0, 0]; end = [1, 1];
    }
    
    return {
      colors: colors.map(color => color.replace(/\s*\d+%/, '')), // 퍼센트 제거
      start,
      end,
    };
  }
  
  // 기본값
  return gradients.mysticalBackground;
};

// React Native LinearGradient 컴포넌트 Props 생성
export interface LinearGradientProps {
  colors: string[];
  start?: [number, number];
  end?: [number, number];
  style?: any;
  children?: React.ReactNode;
}

// 웹용 그라데이션 배경 생성
export const createWebGradientBackground = (
  colors: string[], 
  direction: string = '135deg'
): string => {
  return `linear-gradient(${direction}, ${colors.join(', ')})`;
};

// Guidelines.md 기반 브랜드 그라데이션 프리셋
export const brandGradients = {
  // 메인 배경
  mainBackground: createWebGradientBackground([
    tokens.colors.background,
    tokens.colors.muted + '20',
    tokens.colors.background
  ]),
  
  // 카드 배경 (glassmorphism 대체)
  cardBackground: createWebGradientBackground([
    'rgba(255, 255, 255, 0.18)',
    'rgba(248, 246, 249, 0.12)'
  ]),
  
  // 프리미엄 요소
  premiumBackground: createWebGradientBackground([
    'rgba(212, 175, 55, 0.15)',
    'rgba(74, 26, 79, 0.05)',
    'rgba(212, 175, 55, 0.1)'
  ]),
  
  // 버튼 그라데이션
  primaryButton: createWebGradientBackground([
    tokens.colors.primary,
    tokens.colors.deepPurple
  ]),
  
  premiumButton: createWebGradientBackground([
    tokens.colors.premiumGold,
    '#E6C547'
  ]),
  
  // 미스틱 테마
  mysticDeep: createWebGradientBackground([
    tokens.colors.midnightBlue,
    tokens.colors.deepPurple,
    tokens.colors.midnightBlue
  ], '45deg'),
};

// 다크모드 그라데이션
export const darkGradients = {
  mainBackground: createWebGradientBackground([
    '#0F0F1A',
    'rgba(26, 31, 58, 0.4)',
    '#0F0F1A'
  ]),
  
  cardBackground: createWebGradientBackground([
    'rgba(26, 31, 58, 0.25)',
    'rgba(255, 255, 255, 0.05)'
  ]),
  
  premiumBackground: createWebGradientBackground([
    'rgba(244, 208, 63, 0.15)',
    'rgba(122, 90, 127, 0.05)',
    'rgba(244, 208, 63, 0.1)'
  ]),
};