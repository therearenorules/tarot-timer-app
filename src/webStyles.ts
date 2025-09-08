// 웹 전용 스타일 시스템 (React Native import 없이)
// 기존 Tailwind CSS와 호환되는 React Native 스타일 구조

// 웹 환경 화면 크기
const getWebScreenDimensions = () => {
  if (typeof window !== 'undefined') {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
  return { width: 375, height: 667 }; // 기본값
};

// 디자인 토큰들 (Guidelines.md 기반)
export const tokens = {
  colors: {
    // Light Mode
    background: '#ffffff',
    foreground: '#1a1f3a',
    card: '#ffffff',
    cardForeground: '#1a1f3a',
    primary: '#4a1a4f',
    primaryForeground: '#ffffff',
    secondary: '#fafafa',
    secondaryForeground: '#4a1a4f',
    muted: '#f8f6f9',
    mutedForeground: '#6b7280',
    accent: '#d4af37',
    accentForeground: '#1a1f3a',
    border: '#e8e1e8',
    input: 'transparent',
    ring: '#4a1a4f',
    
    // Brand Colors
    premiumGold: '#d4af37',
    deepPurple: '#4a1a4f',
    midnightBlue: '#1a1f3a',
    
    // Semantic Colors
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
    xxxl: 48,
  },
  
  borderRadius: {
    sm: 4,
    md: 6,
    lg: 8,
    xl: 12,
    xxl: 16,
  },
  
  fontSize: {
    xs: 11,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 18,
    '2xl': 20,
    '3xl': 24,
    '4xl': 28,
    '5xl': 32,
  },
  
  lineHeight: {
    xs: 13,
    sm: 14,
    base: 21,
    lg: 24,
    xl: 27,
    '2xl': 30,
    '3xl': 36,
    '4xl': 42,
    '5xl': 48,
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  } as const,
  
  shadows: {
    none: {
      boxShadow: 'none',
    },
    xs: {
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    },
    sm: {
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    },
    md: {
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    lg: {
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    },
    xl: {
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
    // Mystical 브랜드 그림자들 (React Native 호환 단순화)
    mystical: {
      boxShadow: '0 8px 32px rgba(74, 26, 79, 0.15), 0 4px 16px rgba(0, 0, 0, 0.1)',
    },
    premium: {
      boxShadow: '0 8px 32px rgba(212, 175, 55, 0.2), 0 4px 16px rgba(74, 26, 79, 0.1)',
    },
    glowing: {
      boxShadow: '0 0 20px rgba(212, 175, 55, 0.3), 0 4px 16px rgba(74, 26, 79, 0.1)',
    },
  },
};

// 기본 스타일들
export const commonStyles = {
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  
  centerContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  
  card: {
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.borderRadius.lg,
    padding: tokens.spacing.md,
    ...tokens.shadows.md,
    border: `1px solid ${tokens.colors.border}`,
  },
  
  primaryButton: {
    backgroundColor: tokens.colors.primary,
    paddingLeft: tokens.spacing.lg,
    paddingRight: tokens.spacing.lg,
    paddingTop: tokens.spacing.sm,
    paddingBottom: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.lg,
    ...tokens.shadows.sm,
    border: 'none',
    cursor: 'pointer',
  },
  
  secondaryButton: {
    backgroundColor: 'transparent',
    border: `1px solid ${tokens.colors.primary}`,
    paddingLeft: tokens.spacing.lg,
    paddingRight: tokens.spacing.lg,
    paddingTop: tokens.spacing.sm,
    paddingBottom: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.lg,
    cursor: 'pointer',
  },
  
  premiumButton: {
    backgroundColor: tokens.colors.premiumGold,
    paddingLeft: tokens.spacing.lg,
    paddingRight: tokens.spacing.lg,
    paddingTop: tokens.spacing.sm,
    paddingBottom: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.lg,
    ...tokens.shadows.md,
    border: 'none',
    cursor: 'pointer',
  },
  
  headingLarge: {
    fontSize: tokens.fontSize['3xl'],
    lineHeight: `${tokens.lineHeight['3xl']}px`,
    fontWeight: tokens.fontWeight.semibold,
    color: tokens.colors.foreground,
  },
  
  headingMedium: {
    fontSize: tokens.fontSize['2xl'],
    lineHeight: `${tokens.lineHeight['2xl']}px`,
    fontWeight: tokens.fontWeight.semibold,
    color: tokens.colors.foreground,
  },
  
  bodyLarge: {
    fontSize: tokens.fontSize.lg,
    lineHeight: `${tokens.lineHeight.lg}px`,
    fontWeight: tokens.fontWeight.normal,
    color: tokens.colors.foreground,
  },
  
  bodyMedium: {
    fontSize: tokens.fontSize.base,
    lineHeight: `${tokens.lineHeight.base}px`,
    fontWeight: tokens.fontWeight.normal,
    color: tokens.colors.foreground,
  },
  
  caption: {
    fontSize: tokens.fontSize.xs,
    lineHeight: `${tokens.lineHeight.xs}px`,
    fontWeight: tokens.fontWeight.medium,
    color: tokens.colors.mutedForeground,
  },
  
  input: {
    border: `1px solid ${tokens.colors.border}`,
    borderRadius: tokens.borderRadius.lg,
    paddingLeft: tokens.spacing.md,
    paddingRight: tokens.spacing.md,
    paddingTop: tokens.spacing.sm,
    paddingBottom: tokens.spacing.sm,
    fontSize: tokens.fontSize.base,
    backgroundColor: tokens.colors.background,
  },
  
  tabBar: {
    height: 80,
    backgroundColor: tokens.colors.card,
    borderTop: `1px solid ${tokens.colors.border}`,
    ...tokens.shadows.lg,
  },
  
  tabBarContainer: {
    display: 'flex',
    flexDirection: 'row' as const,
    height: '100%',
    maxWidth: 375,
    margin: '0 auto',
    width: '100%',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  
  tabButton: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingTop: tokens.spacing.sm,
    paddingBottom: tokens.spacing.sm,
    paddingLeft: tokens.spacing.xs,
    paddingRight: tokens.spacing.xs,
    cursor: 'pointer',
  },
  
  iconContainer: {
    padding: tokens.spacing.xs,
    borderRadius: tokens.borderRadius.lg,
    marginBottom: tokens.spacing.xs,
  },
  
  gradientBackground: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  scrollContainer: {
    flex: 1,
    paddingLeft: tokens.spacing.md,
    paddingRight: tokens.spacing.md,
  },
  
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
};

// 스타일 조합 헬퍼
export const combineStyles = (...styles: any[]) => {
  return Object.assign({}, ...styles);
};

// 조건부 스타일 헬퍼
export const conditionalStyle = (condition: boolean, trueStyle: any, falseStyle: any = {}) => {
  return condition ? trueStyle : falseStyle;
};

// 반응형 유틸리티
export const responsive = {
  getScreenDimensions: getWebScreenDimensions,
  isSmallScreen: () => getWebScreenDimensions().width < 375,
  isMediumScreen: () => {
    const width = getWebScreenDimensions().width;
    return width >= 375 && width < 414;
  },
  isLargeScreen: () => getWebScreenDimensions().width >= 414,
};

// 웹 전용 추가 유틸리티
export const webUtils = {
  // CSS 변수 생성
  toCSSVar: (value: string) => `var(--${value})`,
  
  // 색상 투명도 조절
  withOpacity: (color: string, opacity: number) => {
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return color;
  },
  
  // 그라데이션 생성 (React Native 호환)
  createGradient: (colors: string[], direction: string = '135deg') => {
    return `linear-gradient(${direction}, ${colors.join(', ')})`;
  },
  
  // 복잡한 박스 섀도우를 단순화
  simplifyBoxShadow: (complexShadow: string) => {
    // 복잡한 멀티 섀도우를 React Native 호환 단일 섀도우로 변환
    if (complexShadow.includes('0 8px 32px rgba(212, 175, 55')) {
      return commonStyles.shadows.premium;
    } else if (complexShadow.includes('0 4px 20px rgba(74, 26, 79')) {
      return commonStyles.shadows.mystical;
    } else if (complexShadow.includes('0 0 20px')) {
      return commonStyles.shadows.glowing;
    }
    return commonStyles.shadows.md;
  },
  
  // CSS transition을 React Native 호환으로 변환
  convertTransition: (cssTransition: string) => {
    // 'all 300ms ease-in-out' -> { duration: 300, easing: 'ease-in-out' }
    const parts = cssTransition.split(' ');
    return {
      duration: parseInt(parts[1]) || 300,
      easing: parts[2] || 'ease-in-out',
      properties: parts[0] === 'all' ? ['transform', 'opacity'] : [parts[0]],
    };
  },
};