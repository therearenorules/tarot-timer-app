// React Native 호환 스타일 시스템
// Tailwind CSS classes를 StyleSheet.create() 기반으로 변환

// 웹 환경에서 React Native Dimensions 대신 window 사용
const getScreenDimensions = () => {
  if (typeof window !== 'undefined') {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
  // 서버 사이드 렌더링 대응
  return {
    width: 375, // 기본값
    height: 667
  };
};

let { width: screenWidth, height: screenHeight } = getScreenDimensions();

// 윈도우 리사이즈 시 화면 크기 업데이트
if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    const newDimensions = getScreenDimensions();
    screenWidth = newDimensions.width;
    screenHeight = newDimensions.height;
  });
}

// 디자인 토큰들
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
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

// Tailwind utility functions를 React Native 스타일로 변환
export const createStyles = {
  // Flexbox utilities
  flex: (value: number = 1) => ({ flex: value }),
  flexRow: () => ({ flexDirection: 'row' as const }),
  flexCol: () => ({ flexDirection: 'column' as const }),
  itemsCenter: () => ({ alignItems: 'center' as const }),
  itemsStart: () => ({ alignItems: 'flex-start' as const }),
  itemsEnd: () => ({ alignItems: 'flex-end' as const }),
  justifyCenter: () => ({ justifyContent: 'center' as const }),
  justifyBetween: () => ({ justifyContent: 'space-between' as const }),
  justifyAround: () => ({ justifyContent: 'space-around' as const }),
  justifyEvenly: () => ({ justifyContent: 'space-evenly' as const }),
  
  // Width and Height
  w: (value: number | string) => ({ 
    width: typeof value === 'number' ? value : value 
  }),
  h: (value: number | string) => ({ 
    height: typeof value === 'number' ? value : value 
  }),
  wFull: () => ({ width: '100%' }),
  hFull: () => ({ height: '100%' }),
  minH: (value: number | string) => ({ 
    minHeight: typeof value === 'number' ? value : value 
  }),
  maxW: (value: number | string) => ({ 
    maxWidth: typeof value === 'number' ? value : value 
  }),
  
  // Padding and Margin
  p: (value: keyof typeof tokens.spacing) => ({ 
    padding: tokens.spacing[value] 
  }),
  px: (value: keyof typeof tokens.spacing) => ({ 
    paddingHorizontal: tokens.spacing[value] 
  }),
  py: (value: keyof typeof tokens.spacing) => ({ 
    paddingVertical: tokens.spacing[value] 
  }),
  pt: (value: keyof typeof tokens.spacing) => ({ 
    paddingTop: tokens.spacing[value] 
  }),
  pr: (value: keyof typeof tokens.spacing) => ({ 
    paddingRight: tokens.spacing[value] 
  }),
  pb: (value: keyof typeof tokens.spacing) => ({ 
    paddingBottom: tokens.spacing[value] 
  }),
  pl: (value: keyof typeof tokens.spacing) => ({ 
    paddingLeft: tokens.spacing[value] 
  }),
  
  m: (value: keyof typeof tokens.spacing) => ({ 
    margin: tokens.spacing[value] 
  }),
  mx: (value: keyof typeof tokens.spacing) => ({ 
    marginHorizontal: tokens.spacing[value] 
  }),
  my: (value: keyof typeof tokens.spacing) => ({ 
    marginVertical: tokens.spacing[value] 
  }),
  mt: (value: keyof typeof tokens.spacing) => ({ 
    marginTop: tokens.spacing[value] 
  }),
  mr: (value: keyof typeof tokens.spacing) => ({ 
    marginRight: tokens.spacing[value] 
  }),
  mb: (value: keyof typeof tokens.spacing) => ({ 
    marginBottom: tokens.spacing[value] 
  }),
  ml: (value: keyof typeof tokens.spacing) => ({ 
    marginLeft: tokens.spacing[value] 
  }),
  
  // Colors
  bg: (color: keyof typeof tokens.colors) => ({ 
    backgroundColor: tokens.colors[color] 
  }),
  text: (color: keyof typeof tokens.colors) => ({ 
    color: tokens.colors[color] 
  }),
  borderColor: (color: keyof typeof tokens.colors) => ({ 
    borderColor: tokens.colors[color] 
  }),
  
  // Typography
  textSize: (size: keyof typeof tokens.fontSize) => ({
    fontSize: tokens.fontSize[size],
    lineHeight: tokens.lineHeight[size],
  }),
  fontWeight: (weight: keyof typeof tokens.fontWeight) => ({ 
    fontWeight: tokens.fontWeight[weight] 
  }),
  textCenter: () => ({ textAlign: 'center' as const }),
  textLeft: () => ({ textAlign: 'left' as const }),
  textRight: () => ({ textAlign: 'right' as const }),
  
  // Border
  border: (width: number = 1) => ({ borderWidth: width }),
  borderRadius: (radius: keyof typeof tokens.borderRadius) => ({ 
    borderRadius: tokens.borderRadius[radius] 
  }),
  rounded: () => ({ borderRadius: tokens.borderRadius.lg }),
  roundedFull: () => ({ borderRadius: 999 }),
  
  // Position (React Native 호환)
  absolute: () => ({ position: 'absolute' as const }),
  relative: () => ({ position: 'relative' as const }),
  top: (value: number) => ({ top: value }),
  right: (value: number) => ({ right: value }),
  bottom: (value: number) => ({ bottom: value }),
  left: (value: number) => ({ left: value }),
  zIndex: (value: number) => ({ zIndex: value }),
  
  // Shadow
  shadow: (level: keyof typeof tokens.shadows) => tokens.shadows[level],
  
  // Opacity
  opacity: (value: number) => ({ opacity: value }),
  
  // Transform
  scale: (value: number) => ({ 
    transform: [{ scale: value }] 
  }),
  rotate: (value: string) => ({ 
    transform: [{ rotate: value }] 
  }),
  translateX: (value: number) => ({ 
    transform: [{ translateX: value }] 
  }),
  translateY: (value: number) => ({ 
    transform: [{ translateY: value }] 
  }),
};

// 복합 스타일 유틸리티들
export const commonStyles = {
  // 기본 컨테이너
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  
  // 중앙 정렬 컨테이너
  centerContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  
  // 카드 스타일
  card: {
    backgroundColor: tokens.colors.card,
    borderRadius: tokens.borderRadius.lg,
    padding: tokens.spacing.md,
    ...tokens.shadows.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  
  // 버튼 스타일들
  primaryButton: {
    backgroundColor: tokens.colors.primary,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.lg,
    ...tokens.shadows.sm,
  },
  
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: tokens.colors.primary,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.lg,
  },
  
  premiumButton: {
    backgroundColor: tokens.colors.premiumGold,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.lg,
    ...tokens.shadows.md,
  },
  
  // 텍스트 스타일들
  headingLarge: {
    fontSize: tokens.fontSize['3xl'],
    lineHeight: tokens.lineHeight['3xl'],
    fontWeight: tokens.fontWeight.semibold,
    color: tokens.colors.foreground,
  },
  
  headingMedium: {
    fontSize: tokens.fontSize['2xl'],
    lineHeight: tokens.lineHeight['2xl'],
    fontWeight: tokens.fontWeight.semibold,
    color: tokens.colors.foreground,
  },
  
  bodyLarge: {
    fontSize: tokens.fontSize.lg,
    lineHeight: tokens.lineHeight.lg,
    fontWeight: tokens.fontWeight.normal,
    color: tokens.colors.foreground,
  },
  
  bodyMedium: {
    fontSize: tokens.fontSize.base,
    lineHeight: tokens.lineHeight.base,
    fontWeight: tokens.fontWeight.normal,
    color: tokens.colors.foreground,
  },
  
  caption: {
    fontSize: tokens.fontSize.xs,
    lineHeight: tokens.lineHeight.xs,
    fontWeight: tokens.fontWeight.medium,
    color: tokens.colors.mutedForeground,
  },
  
  // 입력 필드
  input: {
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.borderRadius.lg,
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    fontSize: tokens.fontSize.base,
    backgroundColor: tokens.colors.background,
  },
  
  // 탭 바 (fixed positioning 대신 React Native 호환)
  tabBar: {
    height: 80,
    backgroundColor: tokens.colors.card,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
    ...tokens.shadows.lg,
  },
  
  tabBarContainer: {
    flexDirection: 'row' as const,
    height: '100%',
    maxWidth: 375, // md breakpoint
    alignSelf: 'center' as const,
    width: '100%',
  },
  
  tabButton: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingVertical: tokens.spacing.sm,
    paddingHorizontal: tokens.spacing.xs,
  },
  
  // 아이콘 컨테이너
  iconContainer: {
    padding: tokens.spacing.xs,
    borderRadius: tokens.borderRadius.lg,
    marginBottom: tokens.spacing.xs,
  },
  
  // 그라데이션 배경 (React Native 호환 - LinearGradient 사용)
  gradientBackground: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  // 스크롤 컨테이너
  scrollContainer: {
    flex: 1,
    paddingHorizontal: tokens.spacing.md,
  },
  
  // 안전 영역
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
};

// React Native 전용 유틸리티 (웹 호환)
export const rnUtils = {
  // 플랫폼별 스타일 (웹 환경에서는 기본값 반환)
  platformStyle: (ios: any, android: any) => {
    // 웹 환경에서는 iOS 스타일을 기본으로 사용
    if (typeof navigator !== 'undefined') {
      const userAgent = navigator.userAgent || navigator.vendor;
      if (/android/i.test(userAgent)) {
        return android;
      }
    }
    return ios;
  },
  
  // 화면 크기 기반 스타일
  responsiveSize: (size: number, basedOn: 'width' | 'height' = 'width') => {
    const baseSize = basedOn === 'width' ? 375 : 667; // iPhone base size
    const currentSize = basedOn === 'width' ? screenWidth : screenHeight;
    return (size * currentSize) / baseSize;
  },
  
  // 안전 영역 대응 (웹 환경)
  withSafeArea: (style: any) => ({
    ...style,
    paddingTop: 0, // 웹에서는 별도 status bar 없음
    paddingBottom: 0,
  }),
  
  // 그림자 최적화 (웹 환경에서는 CSS 그림자 사용)
  optimizedShadow: (elevation: number) => ({
    boxShadow: `0 ${elevation / 2}px ${elevation}px rgba(0, 0, 0, 0.1)`,
  }),
};

// Tailwind 클래스 매핑 헬퍼
export const tw = {
  // 자주 사용되는 조합들
  'flex-1': createStyles.flex(1),
  'flex-row': createStyles.flexRow(),
  'flex-col': createStyles.flexCol(),
  'items-center': createStyles.itemsCenter(),
  'justify-center': createStyles.justifyCenter(),
  'justify-between': createStyles.justifyBetween(),
  'w-full': createStyles.wFull(),
  'h-full': createStyles.hFull(),
  'text-center': createStyles.textCenter(),
  'rounded-lg': createStyles.borderRadius('lg'),
  'p-4': createStyles.p('md'),
  'px-4': createStyles.px('md'),
  'py-3': createStyles.py('sm'),
  'mb-2': createStyles.mb('xs'),
  'mt-4': createStyles.mt('md'),
  'bg-white': createStyles.bg('background'),
  'text-black': createStyles.text('foreground'),
  'shadow-md': createStyles.shadow('md'),
  'absolute': createStyles.absolute(),
  'relative': createStyles.relative(),
  'z-10': createStyles.zIndex(10),
  'opacity-50': createStyles.opacity(0.5),
};

// 스타일 조합 헬퍼
export const combineStyles = (...styles: any[]) => {
  return Object.assign({}, ...styles);
};

// 조건부 스타일 헬퍼
export const conditionalStyle = (condition: boolean, trueStyle: any, falseStyle: any = {}) => {
  return condition ? trueStyle : falseStyle;
};

// 반응형 스타일 헬퍼
export const responsiveStyle = {
  small: (style: any) => screenWidth < 375 ? style : {},
  medium: (style: any) => screenWidth >= 375 && screenWidth < 414 ? style : {},
  large: (style: any) => screenWidth >= 414 ? style : {},
};