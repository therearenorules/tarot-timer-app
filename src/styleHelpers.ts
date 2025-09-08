// React Native 스타일 변환 헬퍼 함수들
// Tailwind CSS 클래스를 React Native 스타일로 자동 변환

import { tokens } from './reactNativeStyles';

// Tailwind 클래스명을 React Native 스타일 객체로 변환
export function parseTailwindClass(className: string): any {
  const classes = className.split(' ').filter(Boolean);
  let styles: any = {};

  classes.forEach(cls => {
    const style = tailwindToRNStyle(cls);
    if (style) {
      styles = { ...styles, ...style };
    }
  });

  return styles;
}

// 개별 Tailwind 클래스를 React Native 스타일로 변환
function tailwindToRNStyle(className: string): any {
  // Flexbox
  if (className === 'flex') return { display: 'flex' };
  if (className === 'flex-1') return { flex: 1 };
  if (className === 'flex-row') return { flexDirection: 'row' };
  if (className === 'flex-col') return { flexDirection: 'column' };
  if (className === 'items-center') return { alignItems: 'center' };
  if (className === 'items-start') return { alignItems: 'flex-start' };
  if (className === 'items-end') return { alignItems: 'flex-end' };
  if (className === 'justify-center') return { justifyContent: 'center' };
  if (className === 'justify-between') return { justifyContent: 'space-between' };
  if (className === 'justify-around') return { justifyContent: 'space-around' };
  if (className === 'justify-evenly') return { justifyContent: 'space-evenly' };

  // Width & Height
  if (className === 'w-full') return { width: '100%' };
  if (className === 'h-full') return { height: '100%' };
  if (className === 'w-screen') return { width: '100vw' };
  if (className === 'h-screen') return { height: '100vh' };
  if (className === 'min-h-screen') return { minHeight: '100vh' };

  // Position (React Native 호환)
  if (className === 'relative') return { position: 'relative' };
  if (className === 'absolute') return { position: 'absolute' };
  // fixed는 React Native에서 미지원 - absolute로 변환
  if (className === 'fixed') return { position: 'absolute' };
  if (className.startsWith('inset-')) {
    const value = className.replace('inset-', '');
    if (value === '0') return { top: 0, right: 0, bottom: 0, left: 0 };
  }

  // Z-index
  if (className.startsWith('z-')) {
    const value = parseInt(className.replace('z-', ''));
    return { zIndex: value };
  }

  // Spacing - Padding
  if (className.startsWith('p-')) {
    const value = getSpacingValue(className.replace('p-', ''));
    return { padding: value };
  }
  if (className.startsWith('px-')) {
    const value = getSpacingValue(className.replace('px-', ''));
    return { paddingHorizontal: value };
  }
  if (className.startsWith('py-')) {
    const value = getSpacingValue(className.replace('py-', ''));
    return { paddingVertical: value };
  }
  if (className.startsWith('pt-')) {
    const value = getSpacingValue(className.replace('pt-', ''));
    return { paddingTop: value };
  }
  if (className.startsWith('pr-')) {
    const value = getSpacingValue(className.replace('pr-', ''));
    return { paddingRight: value };
  }
  if (className.startsWith('pb-')) {
    const value = getSpacingValue(className.replace('pb-', ''));
    return { paddingBottom: value };
  }
  if (className.startsWith('pl-')) {
    const value = getSpacingValue(className.replace('pl-', ''));
    return { paddingLeft: value };
  }

  // Spacing - Margin
  if (className.startsWith('m-')) {
    const value = getSpacingValue(className.replace('m-', ''));
    return { margin: value };
  }
  if (className.startsWith('mx-')) {
    const value = getSpacingValue(className.replace('mx-', ''));
    return { marginHorizontal: value };
  }
  if (className.startsWith('my-')) {
    const value = getSpacingValue(className.replace('my-', ''));
    return { marginVertical: value };
  }
  if (className.startsWith('mt-')) {
    const value = getSpacingValue(className.replace('mt-', ''));
    return { marginTop: value };
  }
  if (className.startsWith('mr-')) {
    const value = getSpacingValue(className.replace('mr-', ''));
    return { marginRight: value };
  }
  if (className.startsWith('mb-')) {
    const value = getSpacingValue(className.replace('mb-', ''));
    return { marginBottom: value };
  }
  if (className.startsWith('ml-')) {
    const value = getSpacingValue(className.replace('ml-', ''));
    return { marginLeft: value };
  }

  // Gap
  if (className.startsWith('gap-')) {
    const value = getSpacingValue(className.replace('gap-', ''));
    return { gap: value };
  }

  // Colors - Background
  if (className === 'bg-background') return { backgroundColor: tokens.colors.background };
  if (className === 'bg-foreground') return { backgroundColor: tokens.colors.foreground };
  if (className === 'bg-card') return { backgroundColor: tokens.colors.card };
  if (className === 'bg-primary') return { backgroundColor: tokens.colors.primary };
  if (className === 'bg-secondary') return { backgroundColor: tokens.colors.secondary };
  if (className === 'bg-accent') return { backgroundColor: tokens.colors.accent };
  if (className === 'bg-muted') return { backgroundColor: tokens.colors.muted };
  if (className === 'bg-premium-gold') return { backgroundColor: tokens.colors.premiumGold };
  if (className === 'bg-deep-purple') return { backgroundColor: tokens.colors.deepPurple };
  if (className === 'bg-midnight-blue') return { backgroundColor: tokens.colors.midnightBlue };
  if (className === 'bg-white') return { backgroundColor: '#ffffff' };
  if (className === 'bg-black') return { backgroundColor: '#000000' };
  if (className === 'bg-transparent') return { backgroundColor: 'transparent' };

  // Colors - Text
  if (className === 'text-background') return { color: tokens.colors.background };
  if (className === 'text-foreground') return { color: tokens.colors.foreground };
  if (className === 'text-primary') return { color: tokens.colors.primary };
  if (className === 'text-secondary') return { color: tokens.colors.secondary };
  if (className === 'text-accent') return { color: tokens.colors.accent };
  if (className === 'text-muted-foreground') return { color: tokens.colors.mutedForeground };
  if (className === 'text-premium-gold') return { color: tokens.colors.premiumGold };
  if (className === 'text-deep-purple') return { color: tokens.colors.deepPurple };
  if (className === 'text-midnight-blue') return { color: tokens.colors.midnightBlue };
  if (className === 'text-white') return { color: '#ffffff' };
  if (className === 'text-black') return { color: '#000000' };

  // Typography
  if (className === 'text-xs') return { fontSize: tokens.fontSize.xs, lineHeight: tokens.lineHeight.xs };
  if (className === 'text-sm') return { fontSize: tokens.fontSize.sm, lineHeight: tokens.lineHeight.sm };
  if (className === 'text-base') return { fontSize: tokens.fontSize.base, lineHeight: tokens.lineHeight.base };
  if (className === 'text-lg') return { fontSize: tokens.fontSize.lg, lineHeight: tokens.lineHeight.lg };
  if (className === 'text-xl') return { fontSize: tokens.fontSize.xl, lineHeight: tokens.lineHeight.xl };
  if (className === 'text-2xl') return { fontSize: tokens.fontSize['2xl'], lineHeight: tokens.lineHeight['2xl'] };
  if (className === 'text-3xl') return { fontSize: tokens.fontSize['3xl'], lineHeight: tokens.lineHeight['3xl'] };

  if (className === 'font-normal') return { fontWeight: tokens.fontWeight.normal };
  if (className === 'font-medium') return { fontWeight: tokens.fontWeight.medium };
  if (className === 'font-semibold') return { fontWeight: tokens.fontWeight.semibold };
  if (className === 'font-bold') return { fontWeight: tokens.fontWeight.bold };

  if (className === 'text-left') return { textAlign: 'left' };
  if (className === 'text-center') return { textAlign: 'center' };
  if (className === 'text-right') return { textAlign: 'right' };

  // Border
  if (className === 'border') return { borderWidth: 1 };
  if (className.startsWith('border-')) {
    const borderValue = className.replace('border-', '');
    if (borderValue === 't') return { borderTopWidth: 1 };
    if (borderValue === 'r') return { borderRightWidth: 1 };
    if (borderValue === 'b') return { borderBottomWidth: 1 };
    if (borderValue === 'l') return { borderLeftWidth: 1 };
    
    // Border colors
    if (borderValue === 'border') return { borderColor: tokens.colors.border };
    if (borderValue === 'primary') return { borderColor: tokens.colors.primary };
    if (borderValue === 'accent') return { borderColor: tokens.colors.accent };
    if (borderValue === 'premium-gold') return { borderColor: tokens.colors.premiumGold };
  }

  // Border Radius
  if (className === 'rounded') return { borderRadius: tokens.borderRadius.lg };
  if (className === 'rounded-sm') return { borderRadius: tokens.borderRadius.sm };
  if (className === 'rounded-md') return { borderRadius: tokens.borderRadius.md };
  if (className === 'rounded-lg') return { borderRadius: tokens.borderRadius.lg };
  if (className === 'rounded-xl') return { borderRadius: tokens.borderRadius.xl };
  if (className === 'rounded-full') return { borderRadius: 999 };

  // Opacity
  if (className.startsWith('opacity-')) {
    const value = parseInt(className.replace('opacity-', '')) / 100;
    return { opacity: value };
  }

  // Overflow
  if (className === 'overflow-hidden') return { overflow: 'hidden' };
  if (className === 'overflow-scroll') return { overflow: 'scroll' };
  if (className === 'overflow-auto') return { overflow: 'auto' };

  // Shadow (React Native 호환)
  if (className === 'shadow-sm') return tokens.shadows.sm;
  if (className === 'shadow') return tokens.shadows.md;
  if (className === 'shadow-md') return tokens.shadows.md;
  if (className === 'shadow-lg') return tokens.shadows.lg;
  if (className === 'shadow-xl') return tokens.shadows.xl;

  // Transform은 복잡하므로 별도 처리 필요
  if (className.startsWith('scale-')) {
    const value = parseInt(className.replace('scale-', '')) / 100;
    return { transform: [{ scale: value }] };
  }

  // 알려지지 않은 클래스는 null 반환
  return null;
}

// 스페이싱 값 변환
function getSpacingValue(value: string): number {
  const spacingMap: { [key: string]: number } = {
    '0': 0,
    '0.5': 2,
    '1': 4,
    '1.5': 6,
    '2': 8,
    '2.5': 10,
    '3': 12,
    '3.5': 14,
    '4': 16,
    '5': 20,
    '6': 24,
    '7': 28,
    '8': 32,
    '9': 36,
    '10': 40,
    '11': 44,
    '12': 48,
    '14': 56,
    '16': 64,
    '20': 80,
    '24': 96,
    '28': 112,
    '32': 128,
    '36': 144,
    '40': 160,
    '44': 176,
    '48': 192,
    '52': 208,
    '56': 224,
    '60': 240,
    '64': 256,
    '72': 288,
    '80': 320,
    '96': 384,
  };

  return spacingMap[value] || parseInt(value) || 0;
}

// 클래스명과 인라인 스타일을 결합
export function combineClassAndStyle(className?: string, style?: any): any {
  if (!className) return style || {};
  
  const classStyles = parseTailwindClass(className);
  return { ...classStyles, ...style };
}

// 조건부 클래스명 적용
export function conditionalClass(condition: boolean, trueClass: string, falseClass: string = ''): string {
  return condition ? trueClass : falseClass;
}

// 그라데이션 배경 생성 (React Native 호환)
export function createGradient(colors: string[], direction: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl' = 'to-br'): string {
  const directionMap = {
    'to-r': 'to right',
    'to-l': 'to left', 
    'to-t': 'to top',
    'to-b': 'to bottom',
    'to-br': '135deg',
    'to-bl': '225deg',
    'to-tr': '45deg',
    'to-tl': '315deg',
  };

  return `linear-gradient(${directionMap[direction]}, ${colors.join(', ')})`;
}

// 색상 투명도 조절
export function withOpacity(color: string, opacity: number): string {
  // hex 색상을 rgba로 변환
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  // 이미 rgba인 경우 투명도만 변경
  if (color.startsWith('rgba')) {
    return color.replace(/[\d\.]+\)$/g, `${opacity})`);
  }
  
  // rgb인 경우 rgba로 변환
  if (color.startsWith('rgb')) {
    return color.replace('rgb', 'rgba').replace(')', `, ${opacity})`);
  }
  
  return color;
}

// React Native 안전한 스타일 생성
export function createSafeStyle(style: any): any {
  const safeStyle: any = {};
  
  Object.keys(style).forEach(key => {
    const value = style[key];
    
    // React Native에서 지원하지 않는 속성들 필터링
    const unsupportedProps = [
      'backdropFilter',
      'filter',
      'clipPath',
      'maskImage',
      'webkitMaskImage',
      'webkitClipPath'
    ];
    
    if (!unsupportedProps.includes(key)) {
      safeStyle[key] = value;
    }
  });
  
  return safeStyle;
}

// 반응형 스타일 헬퍼
export function responsiveStyle(baseStyle: any, breakpoints: { [key: string]: any } = {}): any {
  // 웹에서는 미디어 쿼리, React Native에서는 Dimensions 기반
  return {
    ...baseStyle,
    ...breakpoints.base,
  };
}

// 다크모드 스타일 헬퍼
export function themeSafeStyle(lightStyle: any, darkStyle: any = {}): any {
  // 현재는 라이트 모드만 반환, 나중에 다크모드 지원 시 확장
  return lightStyle;
}