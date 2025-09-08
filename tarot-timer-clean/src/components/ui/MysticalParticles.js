import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Particle = ({ delay = 0, startX = 0, startY = 0, symbol = '✨' }) => {
  const translateY = useSharedValue(startY);
  const translateX = useSharedValue(startX);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const rotate = useSharedValue(0);

  useEffect(() => {
    // 파티클 떠다니는 애니메이션
    opacity.value = withDelay(
      delay,
      withRepeat(
        withTiming(0.8, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );

    scale.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );

    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(startY - 100, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );

    translateX.value = withDelay(
      delay,
      withRepeat(
        withTiming(startX + (Math.random() - 0.5) * 100, { 
          duration: 6000, 
          easing: Easing.inOut(Easing.ease) 
        }),
        -1,
        true
      )
    );

    rotate.value = withDelay(
      delay,
      withRepeat(
        withTiming(360, { duration: 10000, easing: Easing.linear }),
        -1,
        false
      )
    );
  }, [delay, startX, startY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.Text style={[styles.particle, animatedStyle]}>
      {symbol}
    </Animated.Text>
  );
};

export const MysticalParticles = ({ particleCount = 15 }) => {
  const particles = [];
  const symbols = ['✨', '🌟', '⭐', '🔮', '🌙', '✦', '✧', '✯'];

  for (let i = 0; i < particleCount; i++) {
    const startX = Math.random() * screenWidth;
    const startY = Math.random() * screenHeight;
    const delay = Math.random() * 5000;
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];

    particles.push(
      <Particle
        key={i}
        delay={delay}
        startX={startX}
        startY={startY}
        symbol={symbol}
      />
    );
  }

  return (
    <View style={styles.container} pointerEvents="none">
      {particles}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  particle: {
    position: 'absolute',
    fontSize: 16,
    color: 'rgba(212, 175, 55, 0.6)',
    textShadowColor: 'rgba(212, 175, 55, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
});