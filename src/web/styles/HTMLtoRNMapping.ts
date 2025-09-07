/**
 * HTML to React Native 스타일 매핑
 * HTML CSS 클래스를 React Native StyleSheet로 변환하는 매핑 테이블
 */

import { ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { colors, spacing, typography, radius, shadows } from '../constants/DesignTokens';

// ===== TAILWIND CSS → REACT NATIVE 매핑 =====

export const tailwindToRN = {
  // === LAYOUT & FLEXBOX ===
  layout: {
    // Display
    'flex': { display: 'flex' },
    'hidden': { display: 'none' },
    
    // Flex Direction
    'flex-col': { flexDirection: 'column' },
    'flex-row': { flexDirection: 'row' },
    
    // Justify Content
    'justify-center': { justifyContent: 'center' },
    'justify-between': { justifyContent: 'space-between' },
    'justify-around': { justifyContent: 'space-around' },
    'justify-evenly': { justifyContent: 'space-evenly' },
    'justify-start': { justifyContent: 'flex-start' },
    'justify-end': { justifyContent: 'flex-end' },
    
    // Align Items
    'items-center': { alignItems: 'center' },
    'items-start': { alignItems: 'flex-start' },
    'items-end': { alignItems: 'flex-end' },
    'items-stretch': { alignItems: 'stretch' },
    
    // Flex Wrap
    'flex-wrap': { flexWrap: 'wrap' },
    'flex-nowrap': { flexWrap: 'nowrap' },
    
    // Flex
    'flex-1': { flex: 1 },
    'flex-shrink-0': { flexShrink: 0 },
  },
  
  // === SPACING ===
  spacing: {
    // Padding
    'p-1': { padding: spacing.xs },
    'p-2': { padding: spacing.sm },
    'p-3': { padding: spacing.md },
    'p-4': { padding: spacing.lg },
    'p-5': { padding: spacing.xl },
    'p-6': { padding: spacing['2xl'] },
    'p-8': { padding: spacing['3xl'] },
    
    // Padding Horizontal
    'px-1': { paddingHorizontal: spacing.xs },
    'px-2': { paddingHorizontal: spacing.sm },
    'px-3': { paddingHorizontal: spacing.md },
    'px-4': { paddingHorizontal: spacing.lg },
    'px-5': { paddingHorizontal: spacing.xl },
    'px-6': { paddingHorizontal: spacing['2xl'] },
    'px-8': { paddingHorizontal: spacing['3xl'] },
    
    // Padding Vertical
    'py-1': { paddingVertical: spacing.xs },
    'py-2': { paddingVertical: spacing.sm },
    'py-3': { paddingVertical: spacing.md },
    'py-4': { paddingVertical: spacing.lg },
    'py-5': { paddingVertical: spacing.xl },
    'py-6': { paddingVertical: spacing['2xl'] },
    'py-8': { paddingVertical: spacing['3xl'] },
    
    // Margin
    'm-1': { margin: spacing.xs },
    'm-2': { margin: spacing.sm },
    'm-3': { margin: spacing.md },
    'm-4': { margin: spacing.lg },
    'm-6': { margin: spacing['2xl'] },
    'm-8': { margin: spacing['3xl'] },
    
    // Margin Horizontal
    'mx-auto': { marginHorizontal: 'auto' },
    'mx-1': { marginHorizontal: spacing.xs },
    'mx-2': { marginHorizontal: spacing.sm },
    'mx-4': { marginHorizontal: spacing.lg },
    
    // Margin Vertical
    'my-1': { marginVertical: spacing.xs },
    'my-2': { marginVertical: spacing.sm },
    'my-4': { marginVertical: spacing.lg },
    'my-6': { marginVertical: spacing['2xl'] },
    
    // Gap (for flexbox children spacing)
    'gap-1': { gap: spacing.xs },
    'gap-2': { gap: spacing.sm },
    'gap-3': { gap: spacing.md },
    'gap-4': { gap: spacing.lg },
    'gap-6': { gap: spacing['2xl'] },
    'gap-8': { gap: spacing['3xl'] },
    'gap-12': { gap: spacing['5xl'] },
    
    // Space Between (converted to gap in RN)
    'space-y-1': { gap: spacing.xs },
    'space-y-2': { gap: spacing.sm },
    'space-y-3': { gap: spacing.md },
    'space-y-4': { gap: spacing.lg },
    'space-y-6': { gap: spacing['2xl'] },
    'space-y-8': { gap: spacing['3xl'] },
  },
  
  // === SIZE ===
  size: {
    // Width
    'w-full': { width: '100%' },
    'w-1/2': { width: '50%' },
    'w-1/3': { width: '33.333333%' },
    'w-2/3': { width: '66.666667%' },
    'w-1/4': { width: '25%' },
    'w-3/4': { width: '75%' },
    'w-screen': { width: '100%' }, // Dimensions.get('window').width
    
    // Fixed widths
    'w-4': { width: 16 },
    'w-6': { width: 24 },
    'w-8': { width: 32 },
    'w-10': { width: 40 },
    'w-12': { width: 48 },
    'w-16': { width: 64 },
    'w-20': { width: 80 },
    'w-24': { width: 96 },
    'w-32': { width: 128 },
    'w-64': { width: 256 },
    
    // Height
    'h-full': { height: '100%' },
    'h-screen': { height: '100%' }, // Dimensions.get('window').height
    'min-h-screen': { minHeight: '100%' },
    
    // Fixed heights
    'h-4': { height: 16 },
    'h-6': { height: 24 },
    'h-8': { height: 32 },
    'h-10': { height: 40 },
    'h-12': { height: 48 },
    'h-16': { height: 64 },
    'h-20': { height: 80 },
    'h-24': { height: 96 },
    'h-32': { height: 128 },
  },
  
  // === COLORS ===
  colors: {
    // Background Colors
    'bg-white/5': { backgroundColor: colors.card.background },
    'bg-white/10': { backgroundColor: colors.card.background },
    'bg-slate-900': { backgroundColor: colors.background.primary },
    'bg-slate-800': { backgroundColor: colors.background.secondary },
    'bg-blue-900': { backgroundColor: colors.background.tertiary },
    'bg-yellow-400': { backgroundColor: colors.primary.main },
    'bg-yellow-500': { backgroundColor: colors.primary.dark },
    'bg-green-500': { backgroundColor: colors.status.success },
    'bg-red-500': { backgroundColor: colors.status.error },
    
    // Text Colors
    'text-white': { color: colors.text.primary },
    'text-white/70': { color: colors.text.secondary },
    'text-white/60': { color: colors.text.tertiary },
    'text-white/50': { color: colors.text.quaternary },
    'text-yellow-400': { color: colors.primary.main },
    'text-black': { color: colors.background.primary },
    
    // Border Colors
    'border-white/10': { borderColor: colors.card.border },
    'border-white/20': { borderColor: colors.card.border },
    'border-yellow-400': { borderColor: colors.primary.main },
    'border-yellow-400/20': { borderColor: colors.mystical.glow },
    'border-yellow-400/30': { borderColor: colors.mystical.glow },
  },
  
  // === TYPOGRAPHY ===
  typography: {
    // Font Size (HTML CSS classes)
    'display-large': {
      fontSize: typography.size.displayLarge,
      fontWeight: typography.weight.semibold,
      lineHeight: typography.size.displayLarge * typography.lineHeight.tight,
    },
    'display-medium': {
      fontSize: typography.size.displayMedium,
      fontWeight: typography.weight.semibold,
      lineHeight: typography.size.displayMedium * typography.lineHeight.tight,
    },
    'title-large': {
      fontSize: typography.size.titleLarge,
      fontWeight: typography.weight.semibold,
      lineHeight: typography.size.titleLarge * typography.lineHeight.normal,
    },
    'title-medium': {
      fontSize: typography.size.titleMedium,
      fontWeight: typography.weight.medium,
      lineHeight: typography.size.titleMedium * typography.lineHeight.normal,
    },
    'title-small': {
      fontSize: typography.size.titleSmall,
      fontWeight: typography.weight.medium,
      lineHeight: typography.size.titleSmall * typography.lineHeight.normal,
    },
    'body-large': {
      fontSize: typography.size.bodyLarge,
      fontWeight: typography.weight.regular,
      lineHeight: typography.size.bodyLarge * typography.lineHeight.relaxed,
    },
    'body-medium': {
      fontSize: typography.size.bodyMedium,
      fontWeight: typography.weight.regular,
      lineHeight: typography.size.bodyMedium * typography.lineHeight.relaxed,
    },
    'body-small': {
      fontSize: typography.size.bodySmall,
      fontWeight: typography.weight.regular,
      lineHeight: typography.size.bodySmall * typography.lineHeight.normal,
    },
    
    // Font Weight
    'font-regular': { fontWeight: typography.weight.regular },
    'font-medium': { fontWeight: typography.weight.medium },
    'font-semibold': { fontWeight: typography.weight.semibold },
    'font-bold': { fontWeight: typography.weight.bold },
    
    // Text Align
    'text-center': { textAlign: 'center' },
    'text-left': { textAlign: 'left' },
    'text-right': { textAlign: 'right' },
  },
  
  // === BORDERS ===
  borders: {
    // Border Width
    'border': { borderWidth: 1 },
    'border-2': { borderWidth: 2 },
    'border-t': { borderTopWidth: 1 },
    'border-b': { borderBottomWidth: 1 },
    'border-l': { borderLeftWidth: 1 },
    'border-r': { borderRightWidth: 1 },
    
    // Border Radius
    'rounded': { borderRadius: radius.xs },
    'rounded-sm': { borderRadius: radius.sm },
    'rounded-md': { borderRadius: radius.md },
    'rounded-lg': { borderRadius: radius.lg },
    'rounded-xl': { borderRadius: radius.xl },
    'rounded-2xl': { borderRadius: radius['2xl'] },
    'rounded-3xl': { borderRadius: radius['3xl'] },
    'rounded-full': { borderRadius: radius.full },
  },
  
  // === SHADOWS ===
  shadows: {
    'shadow-sm': shadows.small,
    'shadow': shadows.medium,
    'shadow-md': shadows.medium,
    'shadow-lg': shadows.large,
    'shadow-xl': shadows.large,
    'shadow-2xl': shadows.mystical,
  },
  
  // === POSITION ===
  position: {
    'relative': { position: 'relative' },
    'absolute': { position: 'absolute' },
    'fixed': { position: 'absolute' }, // RN doesn't have fixed, use absolute
    
    // Top, Right, Bottom, Left
    'top-0': { top: 0 },
    'right-0': { right: 0 },
    'bottom-0': { bottom: 0 },
    'left-0': { left: 0 },
    
    'inset-0': { top: 0, right: 0, bottom: 0, left: 0 },
    'inset-1': { top: 4, right: 4, bottom: 4, left: 4 },
  },
  
  // === OVERFLOW ===
  overflow: {
    'overflow-hidden': { overflow: 'hidden' },
    'overflow-visible': { overflow: 'visible' },
    'overflow-scroll': { overflow: 'scroll' },
  },
  
  // === OPACITY ===
  opacity: {
    'opacity-0': { opacity: 0 },
    'opacity-25': { opacity: 0.25 },
    'opacity-50': { opacity: 0.5 },
    'opacity-75': { opacity: 0.75 },
    'opacity-100': { opacity: 1 },
  },
} as const;

// ===== GRID SYSTEM 매핑 =====
export const gridToRN = {
  // CSS Grid → React Native Flexbox
  'grid': { 
    display: 'flex', 
    flexDirection: 'column' 
  },
  'grid-cols-1': { 
    flexDirection: 'column' 
  },
  'grid-cols-2': { 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    // 각 자식은 width: '50%' 필요
  },
  'grid-cols-3': { 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    // 각 자식은 width: '33.333333%' 필요  
  },
} as const;

// ===== SPECIAL COMPONENT MAPPINGS =====
export const specialMappings = {
  // 탭 네비게이션
  tabBar: {
    container: {
      position: 'absolute' as const,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      borderTopWidth: 1,
      borderTopColor: colors.card.border,
      paddingBottom: 34, // Safe area for iPhone
    },
    
    tab: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.md,
    },
    
    activeTab: {
      color: colors.primary.main,
    },
    
    inactiveTab: {
      color: colors.text.tertiary,
    },
  },
  
  // 카드 컴포넌트
  tarotCard: {
    container: {
      backgroundColor: colors.card.background,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.card.border,
      ...shadows.medium,
      overflow: 'hidden' as const,
    },
    
    revealed: {
      borderColor: colors.primary.main,
      ...shadows.mystical,
    },
    
    placeholder: {
      backgroundColor: colors.card.background,
      borderColor: colors.card.border,
      borderStyle: 'dashed' as const,
    },
  },
  
  // 버튼 컴포넌트
  button: {
    primary: {
      backgroundColor: colors.primary.main,
      color: colors.background.primary,
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing['2xl'],
      borderRadius: radius.xl,
      ...shadows.medium,
    },
    
    secondary: {
      backgroundColor: colors.card.background,
      borderColor: colors.card.border,
      borderWidth: 1,
      color: colors.text.primary,
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing['2xl'],
      borderRadius: radius.xl,
    },
    
    ghost: {
      backgroundColor: 'transparent',
      color: colors.text.secondary,
      paddingVertical: spacing.lg,
      paddingHorizontal: spacing['2xl'],
    },
  },
  
  // 그라디언트 배경
  gradientBackground: {
    // LinearGradient에서 사용할 props
    colors: [
      colors.background.gradient.from,
      colors.background.gradient.via, 
      colors.background.gradient.to
    ],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 }, // 대각선 그라디언트 (135deg)
  },
} as const;

// ===== 유틸리티 함수 =====
export const styleUtils = {
  /**
   * Tailwind 클래스명을 React Native 스타일로 변환
   */
  convertTailwindClass(className: string): ViewStyle | TextStyle | ImageStyle {
    const styles = { ...tailwindToRN.layout, ...tailwindToRN.spacing, ...tailwindToRN.size, 
                     ...tailwindToRN.colors, ...tailwindToRN.borders, ...tailwindToRN.position,
                     ...tailwindToRN.overflow, ...tailwindToRN.opacity };
    
    return styles[className as keyof typeof styles] || {};
  },
  
  /**
   * 여러 Tailwind 클래스를 한 번에 변환
   */
  convertTailwindClasses(classNames: string[]): ViewStyle | TextStyle | ImageStyle {
    return classNames.reduce((acc, className) => {
      return { ...acc, ...this.convertTailwindClass(className) };
    }, {});
  },
  
  /**
   * HTML 클래스 문자열을 React Native 스타일로 변환
   */
  parseClassString(classString: string): ViewStyle | TextStyle | ImageStyle {
    const classNames = classString.split(' ').filter(Boolean);
    return this.convertTailwindClasses(classNames);
  },
  
  /**
   * 조건부 스타일 적용
   */
  conditionalStyle(condition: boolean, trueStyle: ViewStyle | TextStyle | ImageStyle, falseStyle?: ViewStyle | TextStyle | ImageStyle) {
    return condition ? trueStyle : (falseStyle || {});
  },
  
  /**
   * 플랫폼별 스타일 적용
   */
  platformStyle(iosStyle: ViewStyle | TextStyle | ImageStyle, androidStyle: ViewStyle | TextStyle | ImageStyle) {
    const Platform = require('react-native').Platform;
    return Platform.OS === 'ios' ? iosStyle : androidStyle;
  },
  
  /**
   * 애니메이션이 가능한 스타일만 필터링
   */
  getAnimatableStyles(style: ViewStyle | TextStyle | ImageStyle) {
    const animatableProps = [
      'opacity', 'transform', 'backgroundColor', 'borderColor', 'shadowOpacity',
      'shadowRadius', 'shadowOffset', 'width', 'height', 'top', 'left', 'right', 'bottom'
    ];
    
    return Object.keys(style).reduce((acc, key) => {
      if (animatableProps.includes(key)) {
        acc[key] = style[key as keyof typeof style];
      }
      return acc;
    }, {} as ViewStyle | TextStyle | ImageStyle);
  },
};

export default {
  tailwindToRN,
  gridToRN,
  specialMappings,
  styleUtils,
};