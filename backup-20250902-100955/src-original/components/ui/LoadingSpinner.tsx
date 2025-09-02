// src/components/ui/LoadingSpinner.tsx - 신비로운 타로 로딩 컴포넌트
import React from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Text } from './Text';
import { theme } from '@/constants';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  mystical?: boolean;
}

export function LoadingSpinner({ 
  message = '카드를 펼치고 있어요...', 
  size = 'medium',
  mystical = true 
}: LoadingSpinnerProps) {
  const spinValue = React.useRef(new Animated.Value(0)).current;
  const pulseValue = React.useRef(new Animated.Value(1)).current;
  const sparkleValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    // 회전 애니메이션
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // 펄스 애니메이션
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    // 반짝임 애니메이션
    const sparkleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleValue, {
          toValue: 1,
          duration: 1500,
          easing: Easing.out(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(sparkleValue, {
          toValue: 0,
          duration: 1500,
          easing: Easing.in(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    );

    spinAnimation.start();
    pulseAnimation.start();
    sparkleAnimation.start();

    return () => {
      spinAnimation.stop();
      pulseAnimation.stop();
      sparkleAnimation.stop();
    };
  }, [spinValue, pulseValue, sparkleValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const sparkleOpacity = sparkleValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

  const sizeStyles = {
    small: { width: 32, height: 32 },
    medium: { width: 48, height: 48 },
    large: { width: 64, height: 64 },
  };

  return (
    <View style={[styles.container, mystical && styles.mysticalContainer]}>
      <View style={[styles.spinnerContainer, sizeStyles[size]]}>
        {/* 메인 스피너 */}
        <Animated.View
          style={[
            styles.spinner,
            sizeStyles[size],
            {
              transform: [{ rotate: spin }, { scale: pulseValue }],
            },
          ]}
        >
          <View style={[styles.innerCircle, mystical && styles.mysticalInner]} />
          <View style={[styles.outerRing, mystical && styles.mysticalOuter]} />
        </Animated.View>

        {/* 반짝이는 효과 */}
        {mystical && (
          <Animated.View
            style={[
              styles.sparkle,
              { opacity: sparkleOpacity },
              sizeStyles[size],
            ]}
          >
            <View style={[styles.sparkleElement, styles.sparkle1]} />
            <View style={[styles.sparkleElement, styles.sparkle2]} />
            <View style={[styles.sparkleElement, styles.sparkle3]} />
            <View style={[styles.sparkleElement, styles.sparkle4]} />
          </Animated.View>
        )}
      </View>

      {message && (
        <Text 
          variant="body" 
          color={mystical ? theme.colors.premiumGold : theme.colors.textSecondary}
          style={[styles.message, mystical && styles.mysticalMessage]}
        >
          {message}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  mysticalContainer: {
    backgroundColor: theme.colors.background,
  },
  spinnerContainer: {
    position: 'relative',
    marginBottom: theme.spacing.lg,
  },
  spinner: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  innerCircle: {
    width: '60%',
    height: '60%',
    borderRadius: 50,
    backgroundColor: theme.colors.primary,
    position: 'absolute',
  },
  mysticalInner: {
    backgroundColor: theme.colors.premiumGold,
    shadowColor: theme.colors.mystical.glow,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  outerRing: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderStyle: 'solid',
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
  },
  mysticalOuter: {
    borderColor: theme.colors.deepPurple,
    borderWidth: 3,
    shadowColor: theme.colors.mystical.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  sparkle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sparkleElement: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.colors.premiumGold,
  },
  sparkle1: {
    top: '10%',
    right: '20%',
    transform: [{ rotate: '45deg' }],
  },
  sparkle2: {
    bottom: '15%',
    left: '25%',
    transform: [{ rotate: '-45deg' }],
  },
  sparkle3: {
    top: '25%',
    left: '10%',
    transform: [{ rotate: '90deg' }],
  },
  sparkle4: {
    bottom: '30%',
    right: '15%',
    transform: [{ rotate: '135deg' }],
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24,
  },
  mysticalMessage: {
    fontWeight: '500',
    letterSpacing: 0.5,
    textShadowColor: theme.colors.mystical.shadow,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});