/**
 * GradientText - HTML 가이드의 골드 그라데이션 텍스트 재현
 * 가이드 기준: text-4xl font-bold bg-gradient-to-r from-yellow-400 via-white to-yellow-400 bg-clip-text text-transparent
 */

import React from 'react';
import { Text, View, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { colors, typography } from '../../constants/DesignTokens';

export interface GradientTextProps {
  children: React.ReactNode;
  variant?: 'gold' | 'mystical' | 'premium';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  style?: TextStyle;
}

export const GradientText: React.FC<GradientTextProps> = ({
  children,
  variant = 'gold',
  size = 'medium',
  style,
}) => {
  const gradientColors = getGradientColors(variant);
  const textStyle = getTextStyle(size);

  return (
    <MaskedView
      maskElement={
        <Text style={[textStyle, style]}>
          {children}
        </Text>
      }
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[textStyle, styles.transparent, style]}>
          {children}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
};

function getGradientColors(variant: 'gold' | 'mystical' | 'premium'): string[] {
  switch (variant) {
    case 'gold':
      // HTML: from-yellow-400 via-white to-yellow-400
      return ['#fbbf24', '#ffffff', '#fbbf24'];
    
    case 'mystical':
      // 신비로운 보라-금색 그라데이션
      return [colors.primary.main, '#ffffff', colors.primary.light];
    
    case 'premium':
      // 프리미엄 골드 그라데이션
      return [colors.primary.main, colors.primary.light, colors.primary.main];
    
    default:
      return ['#fbbf24', '#ffffff', '#fbbf24'];
  }
}

function getTextStyle(size: 'small' | 'medium' | 'large' | 'xlarge'): TextStyle {
  switch (size) {
    case 'small':
      return {
        ...typography.styles.titleSmall,
      };
    
    case 'medium':
      return {
        ...typography.styles.titleMedium,
      };
    
    case 'large':
      return {
        ...typography.styles.titleLarge,
      };
    
    case 'xlarge':
      // HTML: text-4xl font-bold (32px)
      return {
        ...typography.styles.displayLarge,
        fontWeight: '700',
      };
    
    default:
      return {
        ...typography.styles.titleMedium,
      };
  }
}

const styles = StyleSheet.create({
  transparent: {
    opacity: 0, // 이 텍스트는 마스크 역할만 함
  },
});

export default GradientText;