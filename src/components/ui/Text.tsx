import React from 'react';
import { Text as RNText, TextStyle, StyleSheet, AccessibilityRole } from 'react-native';
import { theme } from '@/constants';

type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'title1' | 'title2' | 'title3' | 'body' | 'caption' | 'tiny';

interface TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: string;
  style?: TextStyle;
  numberOfLines?: number;
  accessibilityRole?: AccessibilityRole;
  accessibilityLabel?: string;
}

export function Text({
  children,
  variant = 'body',
  color = theme.colors.text,
  style,
  numberOfLines,
  accessibilityRole,
  accessibilityLabel
}: TextProps) {
  const getAccessibilityRole = (): AccessibilityRole | undefined => {
    if (accessibilityRole) return accessibilityRole;

    // Auto-assign roles based on variant
    if (variant.startsWith('h') || variant === 'title1' || variant === 'title2' || variant === 'title3') {
      return 'header';
    }
    return undefined;
  };

  return (
    <RNText
      style={[
        styles[variant],
        { color },
        style
      ]}
      numberOfLines={numberOfLines}
      accessibilityRole={getAccessibilityRole()}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  h1: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 30,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 26,
  },
  h4: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  title1: theme.typography.title1,
  title2: theme.typography.title2,
  title3: theme.typography.title3,
  body: theme.typography.body,
  caption: theme.typography.caption,
  tiny: {
    fontSize: 11,
    fontWeight: '400',
    lineHeight: 14,
  },
});