/**
 * Design Tokens - HTML CSS에서 추출한 완전한 디자인 시스템
 * React Native StyleSheet에서 사용할 수 있는 형태로 변환
 */

// ===== TYPOGRAPHY SCALE =====
export const typography = {
  size: {
    displayLarge: 32,
    displayMedium: 28,
    titleLarge: 24,
    titleMedium: 20,
    titleSmall: 18,
    bodyLarge: 16,
    bodyMedium: 14,
    bodySmall: 12,
    caption: 11,
    overline: 10,
  },
  
  weight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.3,
    relaxed: 1.4,
    loose: 1.5,
    extraLoose: 1.6,
  },
  
  fontFamily: {
    default: 'NotoSansKR-Regular',
    medium: 'NotoSansKR-Medium',
    semibold: 'NotoSansKR-SemiBold',
    bold: 'NotoSansKR-Bold',
  }
} as const;

// ===== COLOR PALETTE =====
export const colors = {
  // 메인 컬러 (타로 테마)
  primary: {
    main: '#d4af37',        // yellow-400 (금색)
    light: '#fbbf24',       // yellow-400 lighter
    dark: '#b8860b',        // yellow-600 darker
  },
  
  // 배경 컬러 (그라디언트)
  background: {
    primary: '#0f172a',     // slate-900
    secondary: '#1e293b',   // slate-800  
    tertiary: '#1e3a8a',    // blue-900
    gradient: {
      from: '#0f172a',      // slate-900
      via: '#0f172a',       // slate-900
      to: '#1e3a8a',        // blue-900
    },
  },
  
  // 카드 및 UI 배경
  card: {
    background: 'rgba(255, 255, 255, 0.05)',  // bg-white/5
    border: 'rgba(255, 255, 255, 0.1)',       // border-white/10
    backdropBlur: 'rgba(255, 255, 255, 0.1)', // backdrop-blur
  },
  
  // 텍스트 컬러
  text: {
    primary: '#ffffff',              // text-white
    secondary: 'rgba(255, 255, 255, 0.7)',  // text-white/70
    tertiary: 'rgba(255, 255, 255, 0.6)',   // text-white/60
    quaternary: 'rgba(255, 255, 255, 0.5)', // text-white/50
    accent: '#d4af37',               // text-yellow-400
  },
  
  // 신비로운 효과 컬러
  mystical: {
    glow: 'rgba(212, 175, 55, 0.3)',     // mystical-glow base
    glowIntense: 'rgba(212, 175, 55, 0.5)', // mystical-glow intense
    shimmer: 'rgba(212, 175, 55, 0.8)',  // shimmer effect
  },
  
  // 상태 컬러
  status: {
    success: '#10b981',     // green-500
    warning: '#f59e0b',     // amber-500
    error: '#ef4444',       // red-500
    info: '#3b82f6',        // blue-500
  },
} as const;

// ===== SPACING SCALE =====
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
  '8xl': 128,
} as const;

// ===== LAYOUT DIMENSIONS =====
export const layout = {
  // 카드 크기
  card: {
    small: { width: 48, height: 84 },      // w-12 h-21 (타로 비율)
    medium: { width: 60, height: 105 },    // w-15 h-26
    large: { width: 96, height: 168 },     // w-24 h-42
    xlarge: { width: 128, height: 224 },   // w-32 h-56
  },
  
  // 탭 네비게이션
  tabBar: {
    height: 96, // pb-24 (24 * 4)
    iconSize: 24,
    labelSize: typography.size.caption,
  },
  
  // 헤더
  header: {
    height: 64,
    paddingHorizontal: spacing['2xl'],
  },
  
  // 콘텐츠 영역
  content: {
    paddingHorizontal: spacing['2xl'], // px-6
    paddingBottom: spacing['2xl'] * 4, // pb-24
  },
} as const;

// ===== BORDER RADIUS =====
export const radius = {
  xs: 4,    // rounded
  sm: 6,    // rounded-sm
  md: 8,    // rounded-md
  lg: 12,   // rounded-lg
  xl: 16,   // rounded-xl
  '2xl': 20, // rounded-2xl
  '3xl': 24, // rounded-3xl
  full: 9999, // rounded-full
} as const;

// ===== SHADOWS =====
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 5,
  },
  
  // 신비로운 그림자 (타로 테마)
  mystical: {
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  
  mysticalGlow: {
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 8,
  },
  
  // HTML 디자인의 고급 mystical glow 재현
  mysticalGlowIntense: {
    shadowColor: colors.primary.main,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    elevation: 12,
  },
} as const;

// ===== ANIMATION DURATIONS =====
export const animation = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
    mysticalPulse: 2000,
    mysticalGlow: 3000,
    mysticalFloat: 6000,
  },
  
  easing: {
    default: 'ease-in-out',
    mystical: [0.4, 0, 0.6, 1], // cubic-bezier for mystical-pulse
  },
} as const;

// ===== HTML DESIGN EFFECTS =====
export const htmlEffects = {
  // 배경 그라데이션
  backgroundGradients: {
    main: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e3a8a 100%)',
    card: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
    mystical: 'linear-gradient(45deg, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0.05) 100%)',
  },
  
  // Mystical Glow 효과
  mysticalGlow: {
    boxShadow: '0 0 20px rgba(212, 175, 55, 0.3), 0 0 40px rgba(212, 175, 55, 0.2), 0 0 80px rgba(212, 175, 55, 0.1)',
    borderGlow: '1px solid rgba(212, 175, 55, 0.3)',
    textGlow: '0 0 10px rgba(212, 175, 55, 0.5)',
  },
  
  // 블러 효과
  blur: {
    backdrop: 'blur(16px)',
    light: 'blur(8px)',
    heavy: 'blur(24px)',
  },
  
  // 카드 호버 효과
  cardEffects: {
    hover: {
      transform: 'translateY(-8px) scale(1.02)',
      boxShadow: '0 20px 40px rgba(212, 175, 55, 0.3)',
      borderGlow: '2px solid rgba(212, 175, 55, 0.5)',
    },
    revealed: {
      animation: 'cardReveal 0.8s ease-out forwards',
    },
  },
} as const;

// ===== COMPONENT-SPECIFIC TOKENS =====
export const components = {
  // 타로 카드 컴포넌트
  tarotCard: {
    borderWidth: 1,
    borderRadius: radius.xl,
    aspectRatio: 0.571, // 타로 카드 전통 비율 (1:1.75)
    
    variants: {
      placeholder: {
        backgroundColor: colors.card.background,
        borderColor: colors.card.border,
      },
      revealed: {
        backgroundColor: colors.background.secondary,
        borderColor: colors.primary.main,
      },
      flipped: {
        backgroundColor: colors.primary.main,
        borderColor: colors.primary.dark,
      },
    },
  },
  
  // 버튼 컴포넌트
  button: {
    borderRadius: radius.xl,
    paddingHorizontal: spacing['2xl'],
    paddingVertical: spacing.lg,
    
    variants: {
      primary: {
        backgroundColor: colors.primary.main,
        color: colors.background.primary,
      },
      secondary: {
        backgroundColor: colors.card.background,
        borderColor: colors.card.border,
        borderWidth: 1,
        color: colors.text.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
        color: colors.text.secondary,
      },
    },
  },
  
  // 탭 네비게이션
  tabNavigation: {
    backgroundColor: 'rgba(15, 23, 42, 0.95)', // slate-900/95
    backdropBlur: true,
    borderTopWidth: 1,
    borderTopColor: colors.card.border,
    
    tab: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      
      active: {
        color: colors.primary.main,
      },
      inactive: {
        color: colors.text.tertiary,
      },
    },
  },
} as const;

// ===== PRESET STYLES =====
export const presets = {
  // 텍스트 프리셋
  text: {
    displayLarge: {
      fontSize: typography.size.displayLarge,
      fontWeight: typography.weight.semibold,
      lineHeight: typography.size.displayLarge * typography.lineHeight.tight,
      color: colors.text.primary,
    },
    
    titleMedium: {
      fontSize: typography.size.titleMedium,
      fontWeight: typography.weight.medium,
      lineHeight: typography.size.titleMedium * typography.lineHeight.normal,
      color: colors.text.primary,
    },
    
    bodyMedium: {
      fontSize: typography.size.bodyMedium,
      fontWeight: typography.weight.regular,
      lineHeight: typography.size.bodyMedium * typography.lineHeight.relaxed,
      color: colors.text.secondary,
    },
    
    caption: {
      fontSize: typography.size.caption,
      fontWeight: typography.weight.regular,
      lineHeight: typography.size.caption * typography.lineHeight.normal,
      color: colors.text.tertiary,
    },
  },
  
  // 컨테이너 프리셋
  container: {
    screen: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    
    card: {
      backgroundColor: colors.card.background,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: colors.card.border,
      padding: spacing['2xl'],
      ...shadows.medium,
    },
    
    cardPremium: {
      backgroundColor: colors.card.background,
      borderRadius: radius['2xl'],
      borderWidth: 1,
      borderColor: colors.primary.main,
      padding: spacing['2xl'],
      ...shadows.mystical,
    },
  },
} as const;

// ===== UTILITY FUNCTIONS =====
export const utils = {
  // 투명도 적용 함수
  withOpacity: (color: string, opacity: number): string => {
    return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
  },
  
  // 그라디언트 생성 함수 (LinearGradient 용)
  createGradient: (from: string, to: string, angle: number = 0) => ({
    colors: [from, to],
    start: { x: 0, y: 0 },
    end: { x: Math.cos(angle * Math.PI / 180), y: Math.sin(angle * Math.PI / 180) },
  }),
  
  // 반응형 크기 계산 (화면 비율 기준)
  responsive: {
    width: (percentage: number) => `${percentage}%` as const,
    height: (percentage: number) => `${percentage}%` as const,
  },
};

// ===== 기본 내보내기 =====
export default {
  typography,
  colors,
  spacing,
  layout,
  radius,
  shadows,
  animation,
  components,
  presets,
  utils,
};