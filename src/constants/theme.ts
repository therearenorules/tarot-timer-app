// React Native 통합 테마 시스템
import { Dimensions, Platform } from 'react-native';
import { TarotColors } from './colors';
import { TarotTypography } from './typography';
import { TarotIcons } from './icons';
import { TarotAnimations } from './animations';
import { ComponentStyles } from './componentStyles';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 디바이스 크기 분류
export const DeviceSizes = {
  isSmallDevice: SCREEN_WIDTH < 375,
  isMediumDevice: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
  isLargeDevice: SCREEN_WIDTH >= 414,
  isTablet: SCREEN_WIDTH >= 768,
  
  // 화면 비율
  aspectRatio: SCREEN_WIDTH / SCREEN_HEIGHT,
  isWideScreen: (SCREEN_WIDTH / SCREEN_HEIGHT) > 1.8,
} as const;

// 간격 및 여백 시스템
export const Spacing = {
  // 기본 간격 (8px 기준)
  xs: 4,   // 0.5 * 8
  sm: 8,   // 1 * 8  
  md: 16,  // 2 * 8
  lg: 24,  // 3 * 8
  xl: 32,  // 4 * 8
  xxl: 48, // 6 * 8
  
  // 컴포넌트별 간격
  component: {
    padding: 16,
    margin: 8,
    cardPadding: 20,
    buttonPadding: 16,
    iconMargin: 8,
  },
  
  // 화면별 여백
  screen: {
    horizontal: 20,
    vertical: 16,
    top: Platform.select({ ios: 44, android: 24 }), // 상태바 고려
    bottom: Platform.select({ ios: 34, android: 0 }), // Safe Area 고려
  },
} as const;

// 테두리 반지름 시스템
export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,   // 기본값 (CSS --radius와 일치)
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 50, // 원형
  
  // 컴포넌트별 반지름
  component: {
    button: 8,
    card: 12,
    input: 8,
    modal: 16,
    image: 8,
    tarotCard: 12,
  },
} as const;

// 그림자 시스템 (신비로운 효과)
export const Shadows = {
  none: {
    shadowOpacity: 0,
  },
  
  // 일반 그림자
  sm: {
    shadowColor: '#4a1a4f', // deepPurple
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  
  md: {
    shadowColor: '#4a1a4f', // deepPurple
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  
  lg: {
    shadowColor: '#4a1a4f', // deepPurple
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  
  // 신비로운 글로우 효과
  mystical: {
    shadowColor: '#d4af37', // premiumGold
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  
  mysticalStrong: {
    shadowColor: '#d4af37', // premiumGold
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 16,
  },
  
  // 카드 그림자
  card: {
    shadowColor: '#1a1f3a', // midnightBlue
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

// 투명도 시스템
export const Opacity = {
  transparent: 0,
  low: 0.1,
  medium: 0.3,
  high: 0.6,
  strong: 0.8,
  opaque: 1,
  
  // 컴포넌트별 투명도
  overlay: 0.6,
  disabled: 0.5,
  placeholder: 0.7,
  divider: 0.12,
  backdrop: 0.4,
} as const;

// 레이아웃 시스템
export const Layout = {
  // 컨테이너
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a', // background
  },
  
  // 중앙 정렬
  center: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  
  // 행 레이아웃
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  
  // 열 레이아웃  
  column: {
    flexDirection: 'column' as const,
  },
  
  // 공간 분배
  spaceBetween: {
    justifyContent: 'space-between' as const,
  },
  
  spaceAround: {
    justifyContent: 'space-around' as const,
  },
  
  spaceEvenly: {
    justifyContent: 'space-evenly' as const,
  },
  
  // 절대 위치 (오버레이용)
  overlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  
  // 화면 크기
  screenDimensions: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
} as const;

// 통합 테마 객체
export const TarotTheme = {
  // 색상
  colors: TarotColors,
  
  // 타이포그래피
  typography: TarotTypography,
  
  // 아이콘
  icons: TarotIcons,
  
  // 애니메이션
  animations: TarotAnimations,
  
  // 컴포넌트 스타일
  components: ComponentStyles,
  
  // 레이아웃
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
  opacity: Opacity,
  layout: Layout,
  
  // 디바이스 정보
  device: DeviceSizes,
  
  // 플랫폼별 스타일
  platform: {
    isIOS: Platform.OS === 'ios',
    isAndroid: Platform.OS === 'android',
    
    // iOS 전용 스타일
    ios: {
      statusBarStyle: 'light-content' as const,
      navigationBarStyle: 'black-translucent' as const,
    },
    
    // Android 전용 스타일
    android: {
      statusBarStyle: 'light-content' as const,
      navigationBarColor: '#0f0f1a', // background
    },
  },
  
  // 접근성
  accessibility: {
    // 최소 터치 영역
    minTouchArea: 44,
    
    // 색상 대비 (WCAG AA 준수)
    contrastRatio: {
      normal: 4.5,
      large: 3.0,
    },
    
    // 텍스트 크기 조절 지원
    scaleFontSize: (size: number, scale: number = 1) => size * scale,
  },
  
  // 성능 최적화
  performance: {
    // 이미지 최적화
    imageFormat: 'webp' as const,
    
    // 애니메이션 최적화
    useNativeDriver: true,
    
    // 리스트 최적화
    listOptimization: {
      initialNumToRender: 10,
      maxToRenderPerBatch: 10,
      windowSize: 10,
      removeClippedSubviews: true,
    },
  },
} as const;

// 테마 타입 정의
export type TarotThemeType = typeof TarotTheme;
export type SpacingType = typeof Spacing;
export type BorderRadiusType = typeof BorderRadius;
export type ShadowsType = typeof Shadows;
export type OpacityType = typeof Opacity;
export type LayoutType = typeof Layout;

// 기본 익스포트
export default TarotTheme;

// 유틸리티 함수들
export const ThemeUtils = {
  // 반응형 값 계산
  getResponsiveValue: <T>(
    small: T,
    medium?: T,
    large?: T,
    tablet?: T
  ): T => {
    if (DeviceSizes.isTablet && tablet) return tablet;
    if (DeviceSizes.isLargeDevice && large) return large;
    if (DeviceSizes.isMediumDevice && medium) return medium;
    return small;
  },
  
  // 색상 투명도 조절
  withOpacity: (color: string, opacity: number): string => {
    // hex 색상에 투명도 추가
    if (color.startsWith('#')) {
      const alpha = Math.round(opacity * 255).toString(16).padStart(2, '0');
      return color + alpha;
    }
    return color;
  },
  
  // 간격 계산
  getSpacing: (multiplier: number): number => {
    return Spacing.sm * multiplier;
  },
  
  // 플랫폼별 값 반환
  platformSelect: <T>(ios: T, android: T): T => {
    return Platform.select({ ios, android }) as T;
  },
  
  // 디바이스별 스타일
  deviceStyle: <T extends Record<string, any>>(styles: {
    small?: T;
    medium?: T;
    large?: T;
    tablet?: T;
  }): T => {
    if (DeviceSizes.isTablet && styles.tablet) return styles.tablet;
    if (DeviceSizes.isLargeDevice && styles.large) return styles.large;
    if (DeviceSizes.isMediumDevice && styles.medium) return styles.medium;
    return styles.small || {} as T;
  },
  
  // 다크모드 색상 (항상 다크모드이므로 다크모드 색상 반환)
  getDarkColor: (lightColor: string, darkColor: string): string => {
    return darkColor; // 항상 다크모드
  },
  
  // 접근성 텍스트 크기 조절
  getAccessibleFontSize: (baseFontSize: number, textScale: number = 1): number => {
    return Math.max(baseFontSize * textScale, 12); // 최소 12px
  },
  
  // 신비로운 글로우 색상 생성
  getMysticalGlow: (baseColor: string, intensity: 'low' | 'medium' | 'high' = 'medium'): string => {
    const intensityMap = {
      low: '20',
      medium: '40',
      high: '60',
    };
    return baseColor + intensityMap[intensity];
  },
};