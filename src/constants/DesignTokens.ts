/**
 * 🔮 Mystical Design Tokens - Complete Sacred Design System
 * Enhanced mystical design system for the tarot timer application
 * Unified system combining all mystical design elements
 */

import { MysticalTheme } from '../design-system/themes/mystical-theme';

// Re-export all theme elements for backward compatibility
export const { colors: mysticalColors, typography: mysticalTypography, spacing: mysticalSpacing } = MysticalTheme;

// ===== ENHANCED TYPOGRAPHY SCALE =====
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
  },
  
  // 완전한 스타일 객체 (React Native용)
  styles: {
    displayLarge: {
      fontSize: 32,
      fontWeight: '700' as const,
      fontFamily: 'NotoSansKR-Bold',
      lineHeight: 32 * 1.2,
    },
    displayMedium: {
      fontSize: 28,
      fontWeight: '700' as const,
      fontFamily: 'NotoSansKR-Bold', 
      lineHeight: 28 * 1.2,
    },
    titleLarge: {
      fontSize: 24,
      fontWeight: '600' as const,
      fontFamily: 'NotoSansKR-SemiBold',
      lineHeight: 24 * 1.3,
    },
    titleMedium: {
      fontSize: 20,
      fontWeight: '600' as const,
      fontFamily: 'NotoSansKR-SemiBold',
      lineHeight: 20 * 1.3,
    },
    titleSmall: {
      fontSize: 18,
      fontWeight: '500' as const,
      fontFamily: 'NotoSansKR-Medium',
      lineHeight: 18 * 1.3,
    },
    bodyLarge: {
      fontSize: 16,
      fontWeight: '400' as const,
      fontFamily: 'NotoSansKR-Regular',
      lineHeight: 16 * 1.4,
    },
    bodyMedium: {
      fontSize: 14,
      fontWeight: '400' as const,
      fontFamily: 'NotoSansKR-Regular',
      lineHeight: 14 * 1.4,
    },
    bodySmall: {
      fontSize: 12,
      fontWeight: '400' as const,
      fontFamily: 'NotoSansKR-Regular',
      lineHeight: 12 * 1.4,
    },
    caption: {
      fontSize: 11,
      fontWeight: '400' as const,
      fontFamily: 'NotoSansKR-Regular',
      lineHeight: 11 * 1.4,
    },
    overline: {
      fontSize: 10,
      fontWeight: '500' as const,
      fontFamily: 'NotoSansKR-Medium',
      lineHeight: 10 * 1.5,
    },
  }
} as const;

// ===== ENHANCED MYSTICAL COLOR PALETTE =====
export const colors = {
  // 🌌 Primary Cosmic Colors (Enhanced)
  primary: {
    main: mysticalColors.sacred.premiumGold,        // '#D4AF37' - Premium mystical gold
    light: mysticalColors.sacred.shimmerGold,       // '#F4D03F' - Shimmering gold light
    dark: mysticalColors.sacred.cosmicGold,         // '#FFD700' - Deep cosmic gold
    mystical: mysticalColors.sacred.aurum,          // '#FF6B35' - Sacred aurum glow
  },
  
  // 🌌 Enhanced Background Colors (Cosmic Depths)
  background: {
    primary: mysticalColors.cosmic.deepSpace,       // '#0a051a' - Deepest cosmic space
    secondary: mysticalColors.cosmic.voidPurple,    // '#1a0933' - Void purple depths
    tertiary: mysticalColors.cosmic.mysticalDepth,  // '#2a1f3d' - Mystical depth layer
    quaternary: mysticalColors.cosmic.etherealMid,  // '#4a148c' - Ethereal middle
    gradient: {
      cosmic: mysticalColors.gradients.cosmicBackground,    // Full cosmic gradient
      mystical: mysticalColors.gradients.mysticalPurple,   // Mystical purple gradient
      sacred: mysticalColors.gradients.sacredGold,         // Sacred gold gradient
      aurum: mysticalColors.gradients.auramGlow,           // Aurum glow gradient
    },
  },
  
  // 🔮 Enhanced Card & UI Components
  card: {
    background: mysticalColors.components.card.background,  // 'rgba(26, 9, 51, 0.95)'
    border: mysticalColors.components.card.border,          // 'rgba(212, 175, 55, 0.3)'
    shadow: mysticalColors.components.card.shadow,          // 'rgba(212, 175, 55, 0.2)'
    backdropBlur: mysticalColors.components.glass.background, // Glass morphism
  },
  
  // ✨ Enhanced Text Colors (Sacred Typography)
  text: {
    primary: mysticalColors.text.primary,              // '#FFFFFF' - Pure white
    secondary: mysticalColors.text.secondary,          // '#E0E0E0' - Light gray
    muted: mysticalColors.text.muted,                  // '#B0B0B0' - Muted gray
    accent: mysticalColors.text.accent,                // '#FF6B35' - Aurum accent
    gold: mysticalColors.text.gold,                    // '#D4AF37' - Sacred gold
    mystical: mysticalColors.text.mystical,            // '#9c27b0' - Mystical purple
  },
  
  // 🌟 Enhanced Mystical Effects
  mystical: {
    glow: mysticalColors.glow.gold,                    // Gold glow effect
    glowIntense: mysticalColors.glow.orange,           // Intense orange glow
    shimmer: mysticalColors.sacred.starlight,          // Starlight shimmer
    cosmicGlow: mysticalColors.glow.cosmic,            // Cosmic blue glow
    purpleGlow: mysticalColors.glow.purple,            // Purple mystical glow
  },
  
  // 🎯 Status Colors (Enhanced)
  status: {
    success: '#10b981',     // green-500
    warning: '#f59e0b',     // amber-500  
    error: '#ef4444',       // red-500
    info: '#3b82f6',        // blue-500
    mysticalSuccess: mysticalColors.sacred.lightGold,    // Mystical success
    mysticalWarning: mysticalColors.sacred.aurum,        // Mystical warning
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
  
  timing: {
    mystical: 2000,
  },
  
  easing: {
    default: 'ease-in-out',
    mystical: [0.4, 0, 0.6, 1], // cubic-bezier for mystical-pulse
    cardFlip: [0.25, 0.1, 0.25, 1], // cubic-bezier for card flip
    easeInOut: [0.4, 0, 0.2, 1], // cubic-bezier for general ease
    cardSlide: [0.23, 1, 0.32, 1], // cubic-bezier for card slide
  },
  
  presets: {
    cardEntrance: {
      duration: 600,
    },
    mysticalPulse: {
      duration: 2000,
    },
    mysticalGlow: {
      duration: 3000,
    },
    buttonPress: {
      duration: 100,
    },
    buttonRelease: {
      duration: 150,
    },
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
  
  // 텍스트 그라디언트 (HTML에서 추출)
  textGradients: {
    gold: 'linear-gradient(135deg, #f4d03f 0%, #d4af37 100%)',
    mystical: 'linear-gradient(135deg, #f4d03f 0%, #ffffff 50%, #f4d03f 100%)',
  },
  
  // Mystical Glow 효과 (HTML에서 추출)
  mysticalGlow: {
    // 기본 글로우: box-shadow: 0 0 20px rgba(212, 175, 55, 0.3)
    base: '0 0 20px rgba(212, 175, 55, 0.3), 0 0 40px rgba(212, 175, 55, 0.1)',
    // 강화된 글로우: box-shadow: 0 0 30px rgba(212, 175, 55, 0.5)
    intense: '0 0 30px rgba(212, 175, 55, 0.5), 0 0 60px rgba(212, 175, 55, 0.2)',
    // 풀 글로우 박스
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

// ===== ENHANCED TOKENS 통합 객체 (App.tsx에서 사용) =====
export const tokens = {
  colors: {
    // 🎨 App.tsx에서 필요한 색상 속성들 (Enhanced)
    background: colors.background.primary,              // Deep space background
    foreground: colors.text.primary,                   // Pure white text
    card: colors.card.background,                       // Mystical card background
    cardForeground: colors.text.primary,               // Card text color
    primary: colors.primary.main,                       // Premium gold primary
    primaryForeground: colors.background.primary,      // Primary text on gold
    secondary: colors.card.background,                  // Secondary background
    secondaryForeground: colors.text.primary,          // Secondary text
    muted: colors.card.background,                      // Muted background
    mutedForeground: colors.text.muted,                // Muted text
    accent: colors.primary.mystical,                    // Aurum accent color
    accentForeground: colors.text.primary,             // Text on accent
    border: colors.card.border,                         // Golden borders
    input: colors.card.backdropBlur,                    // Glass input background
    ring: colors.primary.main,                          // Focus ring color
    
    // 🌟 Enhanced mystical color palette
    ...colors,
    
    // 🔮 Premium mystical colors (backward compatibility + new)
    premiumGold: mysticalColors.sacred.premiumGold,        // '#D4AF37'
    mysticalPurple: mysticalColors.cosmic.luminousPurple,  // '#8e24aa'
    midnightBlue: mysticalColors.cosmic.deepSpace,         // '#0a051a'
    deepPurple: mysticalColors.cosmic.voidPurple,          // '#1a0933'
    cosmicGlow: mysticalColors.glow.cosmic,                // '#6366F1'
    aurumGlow: mysticalColors.sacred.aurum,                // '#FF6B35'
    starlight: mysticalColors.sacred.starlight,            // '#FFF8DC'
    ethereal: mysticalColors.cosmic.etherealMid,           // '#4a148c'
    celestial: mysticalColors.cosmic.celestialBright,      // '#6a1b99'
    transcendent: mysticalColors.cosmic.transcendent,      // '#3f006a'
  },
  
  // 🏗️ Enhanced system tokens
  spacing: mysticalSpacing.spacing,                    // Sacred geometry spacing
  borderRadius: mysticalSpacing.borderRadius,         // Sacred border radius
  fontSize: mysticalTypography.fontSize,              // Mystical typography
  fontWeight: mysticalTypography.fontWeight,          // Font weights
  lineHeight: mysticalTypography.lineHeight,          // Line heights
  letterSpacing: mysticalTypography.letterSpacing,    // Letter spacing
  
  // 🌟 Enhanced shadow system
  shadows: MysticalTheme.shadows,                      // Mystical shadows
  
  // 📐 Layout system
  layout,
  animation,
  
  // 📱 Screen dimensions
  screen: {
    width: 375,  // Default width (updated by Dimensions)
    height: 667, // Default height (updated by Dimensions)
  },
  
  // 🎭 Component presets from mystical theme
  components: MysticalTheme.components,
  
  // ⚡ Animation configurations
  animations: MysticalTheme.animations,
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
  tokens,
};