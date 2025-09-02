import React from 'react';
import { Pressable, ViewStyle, TextStyle, PressableProps, ActivityIndicator } from 'react-native';
import { Text } from './Text';
import { theme } from '@/constants';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'premium';
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
  onPress,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    // Size styles
    const sizeStyles: Record<ButtonSize, ViewStyle> = {
      small: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        minHeight: 32,
      },
      medium: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        minHeight: 44,
      },
      large: {
        paddingVertical: 16,
        paddingHorizontal: 24,
        minHeight: 52,
      },
    };

    // Variant styles
    const variantStyles: Record<ButtonVariant, ViewStyle> = {
      primary: {
        backgroundColor: isDisabled ? theme.colors.border : theme.colors.primary,
        shadowColor: theme.colors.deepPurple,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      secondary: {
        backgroundColor: isDisabled ? theme.colors.border : theme.colors.secondary,
        shadowColor: theme.colors.midnightBlue,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: isDisabled ? theme.colors.border : theme.colors.primary,
      },
      text: {
        backgroundColor: 'transparent',
      },
      premium: {
        backgroundColor: isDisabled ? theme.colors.border : theme.colors.premiumGold,
        shadowColor: theme.colors.premiumGold,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
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
      return theme.colors.textSecondary;
    }

    switch (variant) {
      case 'primary':
      case 'secondary':
        return '#FFFFFF';
      case 'outline':
      case 'text':
        return theme.colors.primary;
      case 'premium':
        return theme.colors.deepPurple; // Premium button text is deep purple
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

  return (
    <Pressable
      style={({ pressed }) => [
        getButtonStyle(),
        {
          opacity: pressed ? 0.8 : 1,
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
      {loading && (
        <ActivityIndicator 
          size="small" 
          color={getTextColor()} 
          style={{ marginRight: 8 }} 
        />
      )}
      <Text
        variant={getTextVariant() as any}
        color={getTextColor()}
        style={{
          fontWeight: '600',
          ...textStyle,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}