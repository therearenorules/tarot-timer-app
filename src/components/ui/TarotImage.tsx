/**
 * TarotImage - Simplified React Native image component
 * Temporarily simplified to resolve rendering issues
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, Text } from 'react-native';
import { theme } from '@/constants';

export const IMAGE_NAMES = [
  'tarot-card-back',
  'card-placeholder', 
  'app-logo-main',
  'app-logo-icon',
  'sacred-geometry-pattern',
  'mystical-texture-light',
  'mystical-texture-dark',
  'sparkle-effect'
] as const;

export type ImageName = typeof IMAGE_NAMES[number];

interface TarotImageProps {
  name?: ImageName;
  width?: number;
  height?: number;
  style?: ViewStyle;
  color?: string;
}

// Simplified placeholder component
export const TarotImage: React.FC<TarotImageProps> = ({
  name = 'card-placeholder',
  width = 100,
  height = 100,
  style,
  color = theme.colors.premiumGold
}) => {
  return (
    <View style={[
      styles.container, 
      { width, height, borderColor: color },
      style
    ]}>
      <Text style={[styles.placeholder, { color }]}>
        {name === 'app-logo-main' ? '🔮' : 
         name === 'tarot-card-back' ? '🃏' :
         name === 'sparkle-effect' ? '✨' : '🎴'}
      </Text>
    </View>
  );
};

// Specific image components for backward compatibility
export const TarotCardBackImage: React.FC<Omit<TarotImageProps, 'name'>> = (props) => (
  <TarotImage name="tarot-card-back" {...props} />
);

export const AppLogo: React.FC<Omit<TarotImageProps, 'name'>> = (props) => (
  <TarotImage name="app-logo-main" {...props} />
);

export const SparkleEffectImage: React.FC<Omit<TarotImageProps, 'name'>> = (props) => (
  <TarotImage name="sparkle-effect" {...props} />
);

export const MysticalBackground: React.FC<Omit<TarotImageProps, 'name'>> = (props) => (
  <TarotImage name="sacred-geometry-pattern" {...props} />
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 8,
    backgroundColor: theme.colors.surface + '40', // 40% opacity
    borderStyle: 'dashed',
  },
  placeholder: {
    fontSize: 24,
    textAlign: 'center',
  },
});