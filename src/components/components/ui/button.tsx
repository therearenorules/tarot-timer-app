import React from 'react';
import { Pressable, ViewStyle, TextStyle, PressableProps, ActivityIndicator } from 'react-native';
import { Text } from '@/components';
import { theme } from '@/constants';

type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  variant = 'default',
  size = 'default',
  loading = false,
  disabled = false,
  style,
  textStyle,
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
      default: {
        height: 36,
        paddingHorizontal: 16,
        paddingVertical: 8,
      },
      sm: {
        height: 32,
        paddingHorizontal: 12,
        paddingVertical: 6,
      },
      lg: {
        height: 44,
        paddingHorizontal: 24,
        paddingVertical: 12,
      },
      icon: {
        height: 36,
        width: 36,
        paddingHorizontal: 0,
        paddingVertical: 0,
      },
    };

    // Variant styles
    const variantStyles: Record<ButtonVariant, ViewStyle> = {
      default: {
        backgroundColor: isDisabled ? theme.colors.border : theme.colors.primary,
      },
      destructive: {
        backgroundColor: isDisabled ? theme.colors.border : '#d4183d',
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: isDisabled ? theme.colors.border : theme.colors.primary,
      },
      secondary: {
        backgroundColor: isDisabled ? theme.colors.border : theme.colors.secondary,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
      link: {
        backgroundColor: 'transparent',
        borderRadius: 0,
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
      case 'default':
      case 'destructive':
      case 'secondary':
        return '#FFFFFF';
      case 'outline':
      case 'ghost':
        return theme.colors.primary;
      case 'link':
        return theme.colors.primary;
      default:
        return theme.colors.text;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'caption';
      case 'lg':
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
          opacity: pressed && !isDisabled ? 0.8 : 1,
        },
        style,
      ]}
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
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
        variant={getTextSize() as any}
        color={getTextColor()}
        style={{
          fontWeight: variant === 'link' ? 'normal' : '600',
          textDecorationLine: variant === 'link' ? 'underline' : 'none',
          ...textStyle,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}

// shadcn/ui 호환성을 위한 buttonVariants 함수
export const buttonVariants = ({ variant = 'default', size = 'default' }: { variant?: string; size?: string } = {}) => {
  // 이 함수는 스타일링 라이브러리와의 호환성을 위해 존재
  // 실제로는 getButtonStyle 함수에서 처리됨
  return {};
};