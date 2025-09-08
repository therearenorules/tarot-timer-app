// React Native 호환 기본 컴포넌트들
// HTML Elements를 React Native Components로 매핑

import React, { ReactNode, useState } from 'react';
import { commonStyles, tokens, combineStyles, conditionalStyle } from '../utils/webStyles';
import { touchStates, createPressableProps, brandTouchEffects } from '../utils/touchStates';
import { shadows, applyShadow } from '../utils/shadowsAndGradients';

// 기본 컨테이너 컴포넌트
interface ContainerProps {
  children: ReactNode;
  style?: any;
  safe?: boolean;
  scroll?: boolean;
}

export function Container({ children, style, safe = false, scroll = false }: ContainerProps) {
  const containerStyle = combineStyles(
    commonStyles.container,
    safe && commonStyles.safeArea,
    style
  );

  if (scroll) {
    return (
      <div style={containerStyle}>
        <div style={commonStyles.scrollContainer}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      {children}
    </div>
  );
}

// Flex 컨테이너
interface FlexProps {
  children: ReactNode;
  direction?: 'row' | 'column';
  align?: 'center' | 'flex-start' | 'flex-end' | 'stretch';
  justify?: 'center' | 'flex-start' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  flex?: number;
  wrap?: boolean;
  style?: any;
}

export function Flex({ 
  children, 
  direction = 'column', 
  align = 'stretch', 
  justify = 'flex-start',
  flex,
  wrap = false,
  style 
}: FlexProps) {
  const flexStyle = combineStyles(
    {
      display: 'flex',
      flexDirection: direction,
      alignItems: align,
      justifyContent: justify,
      flexWrap: wrap ? 'wrap' : 'nowrap',
    },
    flex !== undefined && { flex },
    style
  );

  return <div style={flexStyle}>{children}</div>;
}

// Text 컴포넌트
interface TextProps {
  children: ReactNode;
  variant?: 'heading-large' | 'heading-medium' | 'body-large' | 'body-medium' | 'caption';
  color?: keyof typeof tokens.colors;
  align?: 'left' | 'center' | 'right';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  style?: any;
}

export function Text({ 
  children, 
  variant = 'body-medium', 
  color = 'foreground',
  align = 'left',
  weight,
  style 
}: TextProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'heading-large':
        return commonStyles.headingLarge;
      case 'heading-medium':
        return commonStyles.headingMedium;
      case 'body-large':
        return commonStyles.bodyLarge;
      case 'body-medium':
        return commonStyles.bodyMedium;
      case 'caption':
        return commonStyles.caption;
      default:
        return commonStyles.bodyMedium;
    }
  };

  const textStyle = combineStyles(
    getVariantStyle(),
    { 
      color: tokens.colors[color],
      textAlign: align,
    },
    weight && { fontWeight: tokens.fontWeight[weight] },
    style
  );

  return <span style={textStyle}>{children}</span>;
}

// Button 컴포넌트
interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'premium';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onPress?: () => void;
  style?: any;
}

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  disabled = false,
  onPress,
  style 
}: ButtonProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'primary':
        return commonStyles.primaryButton;
      case 'secondary':
        return commonStyles.secondaryButton;
      case 'premium':
        return commonStyles.premiumButton;
      default:
        return commonStyles.primaryButton;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: tokens.spacing.md,
          paddingVertical: tokens.spacing.xs,
        };
      case 'lg':
        return {
          paddingHorizontal: tokens.spacing.xl,
          paddingVertical: tokens.spacing.md,
        };
      default:
        return {};
    }
  };

  const buttonStyle = combineStyles(
    getVariantStyle(),
    getSizeStyle(),
    conditionalStyle(disabled, { opacity: 0.5 }),
    style
  );

  const getTextColor = (): keyof typeof tokens.colors => {
    if (variant === 'secondary') return 'primary';
    if (variant === 'premium') return 'deepPurple';
    return 'primaryForeground';
  };

  return (
    <button 
      style={buttonStyle} 
      onClick={onPress}
      disabled={disabled}
    >
      <Text 
        color={getTextColor()}
        weight="medium"
        align="center"
        style={{ fontSize: tokens.fontSize.base }}
      >
        {children}
      </Text>
    </button>
  );
}

// Card 컴포넌트
interface CardProps {
  children: ReactNode;
  elevated?: boolean;
  padding?: keyof typeof tokens.spacing;
  style?: any;
}

export function Card({ children, elevated = false, padding = 'md', style }: CardProps) {
  const cardStyle = combineStyles(
    commonStyles.card,
    { padding: tokens.spacing[padding] },
    elevated && tokens.shadows.lg,
    style
  );

  return <div style={cardStyle}>{children}</div>;
}

// Input 컴포넌트
interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  style?: any;
}

export function Input({ 
  value, 
  onChangeText, 
  placeholder, 
  multiline = false,
  numberOfLines = 1,
  style 
}: InputProps) {
  const inputStyle = combineStyles(
    commonStyles.input,
    multiline && { height: numberOfLines * 20 + tokens.spacing.md * 2 },
    style
  );

  if (multiline) {
    return (
      <textarea
        style={inputStyle}
        value={value}
        onChange={(e) => onChangeText(e.target.value)}
        placeholder={placeholder}
        rows={numberOfLines}
      />
    );
  }

  return (
    <input
      style={inputStyle}
      value={value}
      onChange={(e) => onChangeText(e.target.value)}
      placeholder={placeholder}
    />
  );
}

// Badge 컴포넌트
interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'premium' | 'outline';
  size?: 'sm' | 'md';
  style?: any;
}

export function Badge({ children, variant = 'default', size = 'md', style }: BadgeProps) {
  const getVariantStyle = () => {
    switch (variant) {
      case 'premium':
        return {
          backgroundColor: tokens.colors.premiumGold,
          color: tokens.colors.deepPurple,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: tokens.colors.border,
          color: tokens.colors.foreground,
        };
      default:
        return {
          backgroundColor: tokens.colors.primary,
          color: tokens.colors.primaryForeground,
        };
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: tokens.spacing.xs,
          paddingVertical: 2,
          fontSize: tokens.fontSize.xs,
        };
      default:
        return {
          paddingHorizontal: tokens.spacing.sm,
          paddingVertical: tokens.spacing.xs,
          fontSize: tokens.fontSize.sm,
        };
    }
  };

  const badgeStyle = combineStyles(
    {
      borderRadius: tokens.borderRadius.sm,
      fontWeight: tokens.fontWeight.medium,
      textAlign: 'center',
      alignSelf: 'flex-start',
      display: 'inline-block',
    },
    getVariantStyle(),
    getSizeStyle(),
    style
  );

  return <div style={badgeStyle}>{children}</div>;
}

// Icon 컴포넌트
interface IconProps {
  name: string;
  size?: number;
  color?: keyof typeof tokens.colors;
  style?: any;
}

export function Icon({ name, size = 24, color = 'foreground', style }: IconProps) {
  const iconStyle = combineStyles(
    {
      width: size,
      height: size,
      color: tokens.colors[color],
    },
    style
  );

  // 실제 구현에서는 아이콘 라이브러리 사용
  return <div style={iconStyle} data-icon={name} />;
}

// TabBar 컴포넌트 (fixed positioning 대신 React Native 호환)
interface TabBarProps {
  children: ReactNode;
  style?: any;
}

export function TabBar({ children, style }: TabBarProps) {
  const tabBarStyle = combineStyles(
    commonStyles.tabBar,
    style
  );

  return (
    <div style={tabBarStyle}>
      <div style={commonStyles.tabBarContainer}>
        {children}
      </div>
    </div>
  );
}

// TabButton 컴포넌트
interface TabButtonProps {
  children: ReactNode;
  active?: boolean;
  onPress?: () => void;
  style?: any;
}

export function TabButton({ children, active = false, onPress, style }: TabButtonProps) {
  const buttonStyle = combineStyles(
    commonStyles.tabButton,
    conditionalStyle(active, { backgroundColor: tokens.colors.accent + '0D' }), // 5% opacity
    style
  );

  return (
    <button style={buttonStyle} onClick={onPress}>
      {children}
    </button>
  );
}

// GradientBackground 컴포넌트 (fixed positioning 대신)
interface GradientBackgroundProps {
  colors: string[];
  style?: any;
}

export function GradientBackground({ colors, style }: GradientBackgroundProps) {
  const gradientStyle = combineStyles(
    commonStyles.gradientBackground,
    {
      background: `linear-gradient(135deg, ${colors.join(', ')})`,
      pointerEvents: 'none',
    },
    style
  );

  return <div style={gradientStyle} />;
}

// SafeAreaView 컴포넌트
interface SafeAreaViewProps {
  children: ReactNode;
  style?: any;
}

export function SafeAreaView({ children, style }: SafeAreaViewProps) {
  const safeAreaStyle = combineStyles(
    commonStyles.safeArea,
    style
  );

  return <div style={safeAreaStyle}>{children}</div>;
}

// Pressable 컴포넌트 (호버 효과 포함)
interface PressableProps {
  children: ReactNode;
  onPress?: () => void;
  hoverScale?: number;
  style?: any;
  activeOpacity?: number;
}

export function Pressable({ 
  children, 
  onPress, 
  hoverScale = 1.02,
  style,
  activeOpacity = 0.8
}: PressableProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const pressableStyle = combineStyles(
    {
      cursor: 'pointer',
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      transform: isHovered ? `scale(${hoverScale})` : 'scale(1)',
      opacity: isPressed ? activeOpacity : 1,
    },
    style
  );

  return (
    <div
      style={pressableStyle}
      onClick={onPress}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      {children}
    </div>
  );
}

// 스크롤 뷰 컴포넌트
interface ScrollViewProps {
  children: ReactNode;
  horizontal?: boolean;
  showsScrollIndicator?: boolean;
  contentContainerStyle?: any;
  style?: any;
}

export function ScrollView({ 
  children, 
  horizontal = false,
  showsScrollIndicator = false,
  contentContainerStyle,
  style 
}: ScrollViewProps) {
  const scrollStyle = combineStyles(
    {
      overflow: horizontal ? 'auto' : 'scroll',
      scrollbarWidth: showsScrollIndicator ? 'auto' : 'none',
      msOverflowStyle: showsScrollIndicator ? 'auto' : 'none',
      WebkitOverflowScrolling: 'touch',
    },
    horizontal && {
      display: 'flex',
      flexDirection: 'row',
      overflowX: 'auto',
      overflowY: 'hidden',
    },
    style
  );

  const contentStyle = combineStyles(
    horizontal && { display: 'flex', flexDirection: 'row' },
    contentContainerStyle
  );

  return (
    <div style={scrollStyle}>
      <div style={contentStyle}>
        {children}
      </div>
    </div>
  );
}

// ========================================
// HTML Elements → React Native Components
// ========================================

// View 컴포넌트 (div 대체)
interface ViewProps {
  children?: ReactNode;
  style?: any;
  onPress?: () => void;
  accessible?: boolean;
  accessibilityRole?: string;
  accessibilityLabel?: string;
}

export function View({ 
  children, 
  style, 
  onPress, 
  accessible, 
  accessibilityRole,
  accessibilityLabel 
}: ViewProps) {
  const viewStyle = combineStyles(style);

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={viewStyle}>
        {children}
      </Pressable>
    );
  }

  return (
    <div 
      style={viewStyle}
      role={accessibilityRole}
      aria-label={accessibilityLabel}
      tabIndex={accessible ? 0 : undefined}
    >
      {children}
    </div>
  );
}

// TouchableOpacity 컴포넌트 (button 대체 - React Native 스타일)
interface TouchableOpacityProps {
  children: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  activeOpacity?: number;
  style?: any;
  hapticFeedback?: boolean;
  touchType?: keyof typeof touchStates;
}

export function TouchableOpacity({ 
  children, 
  onPress, 
  disabled = false,
  activeOpacity = 0.7,
  style,
  hapticFeedback = false,
  touchType = 'button'
}: TouchableOpacityProps) {
  const [isPressed, setIsPressed] = useState(false);

  const touchStyle = combineStyles(
    touchStates[touchType].default,
    {
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : (isPressed ? activeOpacity : 1),
      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
      userSelect: 'none',
    },
    style
  );

  const handlePress = () => {
    if (disabled) return;
    
    // 햅틱 피드백 (웹에서는 진동 API 사용)
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    onPress?.();
  };

  return (
    <button
      style={touchStyle}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={handlePress}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

// Image 컴포넌트 (img 대체)
interface ImageProps {
  source: { uri: string } | string;
  style?: any;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
  alt?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function Image({ 
  source, 
  style, 
  resizeMode = 'cover',
  alt,
  onLoad,
  onError 
}: ImageProps) {
  const imageUri = typeof source === 'string' ? source : source.uri;
  
  const imageStyle = combineStyles(
    {
      objectFit: resizeMode === 'cover' ? 'cover' : 
                resizeMode === 'contain' ? 'contain' :
                resizeMode === 'stretch' ? 'fill' : 'none',
    },
    style
  );

  return (
    <img
      src={imageUri}
      style={imageStyle}
      alt={alt}
      onLoad={onLoad}
      onError={onError}
    />
  );
}

// TextInput 컴포넌트 (input/textarea 대체)
interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  editable?: boolean;
  autoFocus?: boolean;
  style?: any;
  placeholderTextColor?: string;
}

export function TextInput({ 
  value, 
  onChangeText, 
  placeholder,
  multiline = false,
  numberOfLines = 1,
  secureTextEntry = false,
  editable = true,
  autoFocus = false,
  style,
  placeholderTextColor = tokens.colors.mutedForeground
}: TextInputProps) {
  const inputStyle = combineStyles(
    commonStyles.input,
    {
      resize: multiline ? 'vertical' : 'none',
      minHeight: multiline ? numberOfLines * 20 + tokens.spacing.md * 2 : 'auto',
    },
    style
  );

  const cssVars = {
    '--placeholder-color': placeholderTextColor,
  } as React.CSSProperties;

  if (multiline) {
    return (
      <textarea
        style={{...inputStyle, ...cssVars}}
        value={value}
        onChange={(e) => onChangeText(e.target.value)}
        placeholder={placeholder}
        rows={numberOfLines}
        disabled={!editable}
        autoFocus={autoFocus}
      />
    );
  }

  return (
    <input
      style={{...inputStyle, ...cssVars}}
      type={secureTextEntry ? 'password' : 'text'}
      value={value}
      onChange={(e) => onChangeText(e.target.value)}
      placeholder={placeholder}
      disabled={!editable}
      autoFocus={autoFocus}
    />
  );
}

// Switch 컴포넌트 (toggle input 대체)
interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  trackColor?: { false?: string; true?: string };
  thumbColor?: string;
  style?: any;
}

export function Switch({ 
  value, 
  onValueChange, 
  disabled = false,
  trackColor,
  thumbColor,
  style 
}: SwitchProps) {
  const switchStyle = combineStyles(
    {
      width: 48,
      height: 24,
      borderRadius: 12,
      position: 'relative',
      cursor: disabled ? 'not-allowed' : 'pointer',
      backgroundColor: value ? 
        (trackColor?.true || tokens.colors.accent) : 
        (trackColor?.false || tokens.colors.border),
      transition: 'all 200ms ease',
      opacity: disabled ? 0.5 : 1,
    },
    style
  );

  const thumbStyle = {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: thumbColor || '#ffffff',
    position: 'absolute' as const,
    top: 2,
    left: value ? 26 : 2,
    transition: 'all 200ms ease',
    ...applyShadow('sm', true),
  };

  return (
    <div 
      style={switchStyle}
      onClick={() => !disabled && onValueChange(!value)}
    >
      <div style={thumbStyle} />
    </div>
  );
}

// ActivityIndicator 컴포넌트 (로딩 스피너)
interface ActivityIndicatorProps {
  size?: 'small' | 'large' | number;
  color?: string;
  animating?: boolean;
  style?: any;
}

export function ActivityIndicator({ 
  size = 'small', 
  color = tokens.colors.accent,
  animating = true,
  style 
}: ActivityIndicatorProps) {
  const spinnerSize = typeof size === 'number' ? size : size === 'large' ? 32 : 20;
  
  const spinnerStyle = combineStyles(
    {
      width: spinnerSize,
      height: spinnerSize,
      border: `2px solid ${color}33`, // 20% opacity
      borderTop: `2px solid ${color}`,
      borderRadius: '50%',
      animation: animating ? 'spin 1s linear infinite' : 'none',
    },
    style
  );

  return <div style={spinnerStyle} />;
}

// Modal 컴포넌트 (모달 대화상자)
interface ModalProps {
  visible: boolean;
  onRequestClose: () => void;
  children: ReactNode;
  animationType?: 'none' | 'slide' | 'fade';
  transparent?: boolean;
  style?: any;
}

export function Modal({ 
  visible, 
  onRequestClose, 
  children,
  animationType = 'fade',
  transparent = false,
  style 
}: ModalProps) {
  if (!visible) return null;

  const overlayStyle = {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: transparent ? 'transparent' : 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    animation: animationType === 'fade' ? 'fadeIn 200ms ease' : 
              animationType === 'slide' ? 'slideUp 300ms ease' : 'none',
  };

  const modalStyle = combineStyles(
    {
      backgroundColor: tokens.colors.background,
      borderRadius: tokens.borderRadius.lg,
      ...applyShadow('xl', true),
      maxWidth: '90vw',
      maxHeight: '90vh',
      overflow: 'auto',
    },
    style
  );

  return (
    <div style={overlayStyle} onClick={onRequestClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// Alert 컴포넌트 (브라우저 alert 대체)
export const Alert = {
  alert: (title: string, message?: string, buttons?: Array<{text: string, onPress?: () => void}>) => {
    // 웹에서는 기본 alert 사용, React Native에서는 커스텀 모달
    const fullMessage = message ? `${title}\n\n${message}` : title;
    
    if (buttons && buttons.length > 0) {
      const confirmed = window.confirm(fullMessage);
      if (confirmed && buttons[0].onPress) {
        buttons[0].onPress();
      }
    } else {
      window.alert(fullMessage);
    }
  }
};

// StatusBar 컴포넌트 (상태 바 제어)
interface StatusBarProps {
  barStyle?: 'default' | 'light-content' | 'dark-content';
  backgroundColor?: string;
  hidden?: boolean;
}

export function StatusBar({ barStyle, backgroundColor, hidden }: StatusBarProps) {
  // 웹에서는 meta theme-color 태그 업데이트
  React.useEffect(() => {
    if (backgroundColor) {
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', backgroundColor);
      }
    }
  }, [backgroundColor]);

  // 웹에서는 실제 렌더링하지 않음
  return null;
}

// FlatList 컴포넌트 (리스트 렌더링)
interface FlatListProps<T> {
  data: T[];
  renderItem: ({ item, index }: { item: T; index: number }) => ReactNode;
  keyExtractor?: (item: T, index: number) => string;
  horizontal?: boolean;
  numColumns?: number;
  style?: any;
  contentContainerStyle?: any;
  showsVerticalScrollIndicator?: boolean;
  showsHorizontalScrollIndicator?: boolean;
}

export function FlatList<T>({ 
  data, 
  renderItem, 
  keyExtractor,
  horizontal = false,
  numColumns = 1,
  style,
  contentContainerStyle,
  showsVerticalScrollIndicator = true,
  showsHorizontalScrollIndicator = true
}: FlatListProps<T>) {
  const containerStyle = combineStyles(
    {
      display: 'flex',
      flexDirection: horizontal ? 'row' : 'column',
      flexWrap: numColumns > 1 ? 'wrap' : 'nowrap',
      overflow: 'auto',
      scrollbarWidth: (showsVerticalScrollIndicator || showsHorizontalScrollIndicator) ? 'auto' : 'none',
    },
    style
  );

  const contentStyle = combineStyles(
    {
      display: 'flex',
      flexDirection: horizontal ? 'row' : 'column',
      gap: tokens.spacing.xs,
    },
    contentContainerStyle
  );

  return (
    <div style={containerStyle}>
      <div style={contentStyle}>
        {data.map((item, index) => {
          const key = keyExtractor ? keyExtractor(item, index) : index.toString();
          return (
            <div key={key}>
              {renderItem({ item, index })}
            </div>
          );
        })}
      </div>
    </div>
  );
}