/**
 * MysticalParticles - HTML 데모의 신비로운 파티클 효과 재현
 * 가이드 기준: figma UI/CLAUDE_CODE_PROMPT.md
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { colors } from '../../constants/DesignTokens';

export interface MysticalParticlesProps {
  intensity?: 'low' | 'medium' | 'high';
}

export const MysticalParticles: React.FC<MysticalParticlesProps> = ({
  intensity = 'medium',
}) => {
  const particles = Array.from({ length: getParticleCount(intensity) }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3000,
    duration: Math.random() * 2000 + 2000,
  }));

  return (
    <View style={styles.container} pointerEvents="none">
      {/* 기본 그라데이션 오버레이 */}
      <Animated.View style={styles.gradientOverlay} />
      
      {/* 파티클들 */}
      {particles.map((particle) => (
        <MysticalParticle
          key={particle.id}
          size={particle.size}
          x={particle.x}
          y={particle.y}
          delay={particle.delay}
          duration={particle.duration}
        />
      ))}
    </View>
  );
};

interface MysticalParticleProps {
  size: number;
  x: number;
  y: number;
  delay: number;
  duration: number;
}

const MysticalParticle: React.FC<MysticalParticleProps> = ({
  size,
  x,
  y,
  delay,
  duration,
}) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  React.useEffect(() => {
    // 지연 후 애니메이션 시작
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: duration / 2 }),
          withTiming(0, { duration: duration / 2 })
        ),
        -1,
        false
      )
    );

    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.2, { duration: duration / 2 }),
          withTiming(0.8, { duration: duration / 2 })
        ),
        -1,
        true
      )
    );
  }, [delay, duration, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          width: size,
          height: size,
          left: `${x}%`,
          top: `${y}%`,
        },
        animatedStyle,
      ]}
    />
  );
};

function getParticleCount(intensity: 'low' | 'medium' | 'high'): number {
  switch (intensity) {
    case 'low':
      return 8;
    case 'medium':
      return 15;
    case 'high':
      return 25;
    default:
      return 15;
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    opacity: 0.3,
  },
  particle: {
    position: 'absolute',
    backgroundColor: colors.primary.main,
    borderRadius: 100,
    shadowColor: colors.primary.main,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4, // Android shadow
  },
});

export default MysticalParticles;