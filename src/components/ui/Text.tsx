import React from 'react';
import { Text as RNText, TextStyle, StyleSheet } from 'react-native';
import { theme } from '@/constants';

type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'title1' | 'title2' | 'title3' | 'body' | 'caption' | 'tiny';

interface TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: string;
  style?: TextStyle;
  numberOfLines?: number;
}

export function Text({ 
  children, 
  variant = 'body', 
  color = theme.colors.text,
  style,
  numberOfLines
}: TextProps) {
  return (
    <RNText 
      style={[
        styles[variant],
        { color },
        style
      ]}
      numberOfLines={numberOfLines}
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