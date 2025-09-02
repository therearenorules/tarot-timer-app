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
  // Updated typography to match Figma specs
  h1: {
    fontSize: 32, // Display Large from Figma
    fontWeight: '700',
    lineHeight: 38, // 1.2 ratio
    letterSpacing: -0.5, // Korean optimization
  },
  h2: {
    fontSize: 28, // Display Medium from Figma
    fontWeight: '700',
    lineHeight: 34,
    letterSpacing: -0.5,
  },
  h3: {
    fontSize: 24, // Title Large from Figma
    fontWeight: '600',
    lineHeight: 29,
    letterSpacing: -0.5,
  },
  h4: {
    fontSize: 20, // Title Medium from Figma
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: -0.5,
  },
  title1: {
    ...theme.typography.title1,
    letterSpacing: -0.5, // Korean optimization
  },
  title2: {
    ...theme.typography.title2,
    letterSpacing: -0.5,
  },
  title3: {
    ...theme.typography.title3,
    letterSpacing: -0.5,
  },
  body: {
    ...theme.typography.body,
    letterSpacing: 0, // Normal for body text
  },
  caption: {
    ...theme.typography.caption,
    letterSpacing: 0,
  },
  tiny: {
    fontSize: 11, // Caption from Figma
    fontWeight: '400',
    lineHeight: 13,
    letterSpacing: 0,
  },
});