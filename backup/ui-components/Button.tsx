import React from 'react';
import { Pressable, ViewStyle, TextStyle, PressableProps, ActivityIndicator, View } from 'react-native';
import { Text } from './Text';
import { theme } from '@/constants';

type ButtonVariant = 'primary' | 'secondary' | 'premium' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  // Figma UI enhancements
  icon?: React.ReactNode;
  iconPosition?: 'leading' | 'trailing';
  glowEffect?: boolean;
}

export function Button({
  title,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
  icon,
  iconPosition = 'leading',
  glowEffect = false,
  onPress,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: iconPosition === 'trailing' ? 'row-reverse' : 'row',
      position: 'relative',
    };

    // Figma UI Size styles (enhanced from design tokens)
    const sizeStyles: Record<ButtonSize, ViewStyle> = {
      small: {
        paddingVertical: theme.spacing.sm, // 8px
        paddingHorizontal: theme.spacing.md, // 16px  
        minHeight: 36,
        gap: theme.spacing.xs, // 4px gap between icon and text
      },
      medium: {
        paddingVertical: theme.spacing.md, // 16px
        paddingHorizontal: theme.spacing.lg, // 24px
        minHeight: 44,
        gap: theme.spacing.sm, // 8px gap between icon and text
      },
      large: {
        paddingVertical: theme.spacing.md, // 16px
        paddingHorizontal: theme.spacing.xl, // 32px
        minHeight: 52,
        gap: theme.spacing.sm, // 8px gap between icon and text
      },
    };

    // Figma UI Enhanced Variant styles
    const variantStyles: Record<ButtonVariant, ViewStyle> = {
      primary: {
        backgroundColor: isDisabled ? theme.colors.border : theme.colors.primary,
        shadowColor: theme.colors.deepPurple,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3, // Enhanced shadow from Figma UI
        shadowRadius: 8, // Larger shadow radius
        elevation: 3,
        borderWidth: 0,
      },
      secondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: isDisabled ? theme.colors.border : theme.colors.primary,
        shadowColor: 'transparent', // No shadow for secondary
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
      },
      premium: {
        backgroundColor: isDisabled ? theme.colors.border : theme.colors.premiumGold,
        shadowColor: theme.colors.premiumGold,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4, // Enhanced shadow from Figma UI
        shadowRadius: 16, // Large shadow for premium feel
        elevation: 5,
        borderWidth: 0,
      },
      ghost: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        shadowColor: 'transparent',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const getTextColor = (): string => {
    if (isDisabled) {
      return theme.colors.textTertiary;
    }

    switch (variant) {
      case 'primary':
        return '#FFFFFF'; // White text on primary
      case 'secondary':
        return theme.colors.primary; // Primary color text on transparent
      case 'premium':
        return theme.colors.deepPurple; // Deep purple text on gold
      case 'ghost':
        return theme.colors.text; // Default text color
      default:
        return theme.colors.text;
    }
  };

  const getTextVariant = () => {
    switch (size) {
      case 'small':
        return 'caption';
      case 'large':
        return 'title3';
      default:
        return 'body';
    }
  };

  // Figma UI Glow effect styles
  const getGlowStyle = (): ViewStyle => {
    if (!glowEffect || isDisabled) return {};
    
    return {
      shadowColor: variant === 'premium' ? theme.colors.premiumGold : theme.colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.6,
      shadowRadius: 12,
      elevation: 8,
    };
  };

  // Icon rendering
  const renderIcon = () => {
    if (!icon || loading) return null;
    
    return (
      <View style={{ opacity: isDisabled ? 0.5 : 1 }}>
        {icon}
      </View>
    );
  };

  // Loading indicator
  const renderLoading = () => {
    if (!loading) return null;
    
    return (
      <ActivityIndicator 
        size="small" 
        color={getTextColor()}
      />
    );
  };

  // Content rendering based on icon position
  const renderContent = () => {
    const textComponent = (
      <Text
        variant={getTextVariant() as any}
        color={getTextColor()}
        style={{
          fontWeight: variant === 'premium' ? '700' : '600', // Premium buttons are bolder
          letterSpacing: variant === 'premium' ? 0.5 : 0, // Premium buttons have letter spacing
          ...textStyle,
        }}
      >
        {title}
      </Text>
    );

    if (loading) {
      return (
        <>
          {renderLoading()}
          {!icon && textComponent}
        </>
      );
    }

    if (!icon) {
      return textComponent;
    }

    return (
      <>
        {iconPosition === 'leading' && renderIcon()}
        {textComponent}
        {iconPosition === 'trailing' && renderIcon()}
      </>
    );
  };

  return (
    <Pressable
      style={({ pressed }) => [
        getButtonStyle(),
        glowEffect && getGlowStyle(),
        {
          opacity: pressed ? 0.8 : isDisabled ? 0.5 : 1,
          transform: pressed ? [{ scale: 0.98 }] : [{ scale: 1 }], // Figma UI press animation
        },
        style,
      ]}
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      {...props}
    >
      {renderContent()}
    </Pressable>
  );
}