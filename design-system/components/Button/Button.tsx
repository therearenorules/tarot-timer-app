import React from 'react';
import { Text, Pressable, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colorTokens, spacingTokens, typographyTokens } from '../../tokens';

// Types
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
  className?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  haptic?: boolean;
}

/**
 * 프리미엄 버튼 컴포넌트
 * 레퍼런스의 황금색 그라데이션 CTA 버튼을 구현
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  onPress,
  className,
  style,
  textStyle,
  haptic = true,
}) => {
  // 사이즈별 스타일 정의
  const sizeStyles = {
    sm: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      fontSize: 14,
      minHeight: 32,
    },
    md: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 12,
      fontSize: 16,
      minHeight: 48,
    },
    lg: {
      paddingVertical: 16,
      paddingHorizontal: 32,
      borderRadius: 16,
      fontSize: 18,
      minHeight: 56,
    },
  };

  // 버튼 프레스 핸들러
  const handlePress = () => {
    if (disabled || loading) return;
    
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    onPress?.();
  };

  // 기본 버튼 스타일
  const baseStyle: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: fullWidth ? '100%' : undefined,
    ...sizeStyles[size],
    ...style,
  };

  // 텍스트 스타일
  const getTextStyle = (): TextStyle => ({
    fontSize: sizeStyles[size].fontSize,
    fontWeight: '600',
    fontFamily: typographyTokens.fontFamily.primary,
    textAlign: 'center' as const,
    ...textStyle,
  });

  // Primary 버튼 (프리미엄 골드 그라데이션)
  const renderPrimaryButton = () => (
    <LinearGradient
      colors={[colorTokens.brand.secondary, colorTokens.brand.accent]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[
        baseStyle,
        {
          shadowColor: colorTokens.brand.secondary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        },
      ]}
    >
      {renderButtonContent('#1A1F3A')} {/* 어두운 텍스트 */}
    </LinearGradient>
  );

  // Secondary 버튼 (글래스 효과)
  const renderSecondaryButton = () => (
    <Pressable
      style={[
        baseStyle,
        {
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          borderColor: 'rgba(212, 175, 55, 0.5)',
          shadowColor: colorTokens.brand.secondary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 4,
        },
      ]}
    >
      {renderButtonContent(colorTokens.text.primary)}
    </Pressable>
  );

  // Ghost 버튼
  const renderGhostButton = () => (
    <Pressable
      style={[
        baseStyle,
        {
          backgroundColor: 'transparent',
        },
      ]}
    >
      {renderButtonContent(colorTokens.brand.secondary)}
    </Pressable>
  );

  // Outline 버튼  
  const renderOutlineButton = () => (
    <Pressable
      style={[
        baseStyle,
        {
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colorTokens.brand.secondary,
        },
      ]}
    >
      {renderButtonContent(colorTokens.brand.secondary)}
    </Pressable>
  );

  // 버튼 내용 렌더링
  const renderButtonContent = (textColor: string) => (
    <>
      {loading && (
        <ActivityIndicator 
          size="small" 
          color={textColor}
          style={{ marginRight: 8 }}
        />
      )}
      
      {!loading && leftIcon && (
        <>{leftIcon}</>
      )}
      
      <Text 
        style={[
          getTextStyle(),
          { 
            color: textColor,
            marginLeft: leftIcon && !loading ? 8 : 0,
            marginRight: rightIcon ? 8 : 0,
          }
        ]}
      >
        {children}
      </Text>
      
      {!loading && rightIcon && (
        <>{rightIcon}</>
      )}
    </>
  );

  // 버튼 래퍼
  const renderButton = () => {
    switch (variant) {
      case 'primary':
        return renderPrimaryButton();
      case 'secondary':  
        return renderSecondaryButton();
      case 'ghost':
        return renderGhostButton();
      case 'outline':
        return renderOutlineButton();
      default:
        return renderPrimaryButton();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      style={({ pressed }) => ({
        opacity: disabled ? 0.6 : pressed ? 0.8 : 1,
        transform: [{ scale: pressed && !disabled ? 0.98 : 1 }],
      })}
      className={className}
    >
      {renderButton()}
    </Pressable>
  );
};

// 버튼 그룹 컴포넌트
export const ButtonGroup: React.FC<{
  children: React.ReactNode;
  direction?: 'row' | 'column';
  spacing?: number;
  className?: string;
}> = ({ 
  children, 
  direction = 'row', 
  spacing = 12,
  className 
}) => {
  const { View } = require('react-native');
  
  return (
    <View 
      style={{
        flexDirection: direction,
        gap: spacing,
      }}
      className={className}
    >
      {children}
    </View>
  );
};

// Export types
export type { ButtonProps };