import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { colors, gradients } from '../../utils/colors';
import { typography, spacing, borderRadius, shadows } from '../../utils/styles';
import { buttonPressFeedback } from '../../utils/haptics';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const MysticalButton = ({ 
  children, 
  onPress, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  style = {},
  textStyle = {} 
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));
  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: borderRadius.medium,
      overflow: 'hidden',
      opacity: disabled ? 0.5 : 1,
    };

    const sizeStyles = {
      small: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        minHeight: 36,
      },
      medium: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        minHeight: 48,
      },
      large: {
        paddingHorizontal: spacing.xl,
        paddingVertical: spacing.lg,
        minHeight: 56,
      },
    };

    return [baseStyle, sizeStyles[size], shadows.medium, style];
  };

  const getGradientColors = () => {
    switch (variant) {
      case 'secondary':
        return gradients.purple;
      case 'accent':
        return gradients.gold;
      default:
        return gradients.button;
    }
  };

  const getTextStyle = () => {
    const sizeTextStyles = {
      small: typography.bodyMedium,
      medium: typography.bodyLarge,
      large: typography.titleMedium,
    };

    return [
      sizeTextStyles[size],
      {
        color: colors.light.primaryForeground,
        fontWeight: '600',
        textAlign: 'center',
      },
      textStyle
    ];
  };

  const handlePress = () => {
    if (disabled) return;
    
    buttonPressFeedback();
    
    // Press animation
    scale.value = withSpring(0.95, { duration: 100 });
    opacity.value = withTiming(0.8, { duration: 100 });
    
    setTimeout(() => {
      scale.value = withSpring(1, { duration: 200 });
      opacity.value = withTiming(1, { duration: 200 });
    }, 100);
    
    if (onPress) onPress();
  };

  return (
    <AnimatedTouchableOpacity
      onPress={handlePress}
      activeOpacity={1}
      style={[getButtonStyle(), animatedStyle]}
    >
      <LinearGradient
        colors={getGradientColors()}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Text style={getTextStyle()}>{children}</Text>
      </LinearGradient>
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
});