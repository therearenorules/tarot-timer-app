import React from 'react';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { theme } from '@/constants';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

function Badge({
  children,
  variant = 'default',
  style,
  textStyle,
}: BadgeProps) {
  const getBadgeStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.borderRadius.sm,
      paddingHorizontal: theme.spacing.sm,
      paddingVertical: theme.spacing.xs,
      alignSelf: 'flex-start',
    };

    const variantStyles: Record<BadgeVariant, ViewStyle> = {
      default: {
        backgroundColor: theme.colors.primary,
        borderWidth: 0,
      },
      secondary: {
        backgroundColor: theme.colors.secondary,
        borderWidth: 0,
      },
      destructive: {
        backgroundColor: '#d4183d',
        borderWidth: 0,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.primary,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
    };
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'default':
      case 'destructive':
        return '#FFFFFF';
      case 'secondary':
        return theme.colors.text;
      case 'outline':
        return theme.colors.primary;
      default:
        return theme.colors.text;
    }
  };

  const badgeTextStyle: TextStyle = {
    color: getTextColor(),
    fontSize: 12,
    fontWeight: '600',
    ...textStyle,
  };

  return (
    <View style={[getBadgeStyle(), style]}>
      <Text style={badgeTextStyle}>
        {children}
      </Text>
    </View>
  );
}

export { Badge };
