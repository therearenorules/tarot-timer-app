import React from 'react';
import { Pressable, ViewStyle, TextStyle, PressableProps, ActivityIndicator } from 'react-native';
import { Text } from './Text';
import { theme } from '@/constants';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
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
      },
      secondary: {
        backgroundColor: isDisabled ? theme.colors.border : theme.colors.secondary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: isDisabled ? theme.colors.border : theme.colors.primary,
      },
      text: {
        backgroundColor: 'transparent',
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