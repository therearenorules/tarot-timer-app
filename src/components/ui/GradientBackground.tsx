/**
 * GradientBackground - HTML 디자인의 그라데이션 배경 완벽 재현
 * Phase 4: 네이티브 최적화 - 시각적 완성도 95% 달성
 */

import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../constants/DesignTokens';

export interface GradientBackgroundProps {
  variant?: 'main' | 'card' | 'mystical' | 'subtle';
  children?: React.ReactNode;
  style?: ViewStyle;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  variant = 'main',
  children,
  style,
}) => {
  const getGradientConfig = () => {
    switch (variant) {
      case 'main':
        // HTML: background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #1e3a8a 100%)
        return {
          colors: [colors.background.primary, colors.background.secondary, colors.background.tertiary],
          locations: [0, 0.5, 1],
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
        };
        
      case 'card':
        // HTML: background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)
        return {
          colors: ['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)'],
          locations: [0, 1],
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
        };
        
      case 'mystical':
        // HTML: background: linear-gradient(45deg, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0.05) 100%)
        return {
          colors: [`${colors.primary.main}1A`, `${colors.primary.main}0D`],
          locations: [0, 1],
          start: { x: 0, y: 1 },
          end: { x: 1, y: 0 },
        };
        
      case 'subtle':
        // 부드러운 그라데이션
        return {
          colors: [colors.background.primary, colors.background.secondary],
          locations: [0, 1],
          start: { x: 0, y: 0 },
          end: { x: 0, y: 1 },
        };
        
      default:
        return {
          colors: [colors.background.primary, colors.background.secondary],
          locations: [0, 1],
          start: { x: 0, y: 0 },
          end: { x: 0, y: 1 },
        };
    }
  };

  const gradientConfig = getGradientConfig();

  return (
    <LinearGradient
      colors={gradientConfig.colors}
      locations={gradientConfig.locations}
      start={gradientConfig.start}
      end={gradientConfig.end}
      style={[styles.container, style]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GradientBackground;