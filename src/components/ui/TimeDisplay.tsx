import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  interpolate,
} from 'react-native-reanimated';
import { colors, typography, spacing, radius, shadows } from '../../constants/DesignTokens';
import { TarotAnimations } from '../../constants/animations';

export interface TimeDisplayProps {
  minutes: number;
  seconds: number;
  isActive?: boolean;
  isPaused?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'default' | 'mystical' | 'minimal';
  showLabel?: boolean;
  label?: string;
  onTimeEnd?: () => void;
  style?: ViewStyle;
  testID?: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);
const AnimatedText = Animated.createAnimatedComponent(Text);

export const TimeDisplay: React.FC<TimeDisplayProps> = ({
  minutes,
  seconds,
  isActive = false,
  isPaused = false,
  size = 'medium',
  variant = 'default',
  showLabel = true,
  label = 'Timer',
  onTimeEnd,
  style,
  testID,
}) => {
  const pulseValue = useSharedValue(0);
  const glowValue = useSharedValue(0);
  const warningValue = useSharedValue(0);

  const totalSeconds = minutes * 60 + seconds;
  const isWarning = totalSeconds <= 60 && totalSeconds > 0;
  const isExpired = totalSeconds <= 0;

  useEffect(() => {
    if (isActive && !isPaused && variant === 'mystical') {
      pulseValue.value = withRepeat(
        withTiming(1, {
          duration: TarotAnimations.presets.mysticalPulse.duration,
          easing: TarotAnimations.easing.mystical,
        }),
        -1,
        true
      );

      glowValue.value = withRepeat(
        withTiming(1, {
          duration: TarotAnimations.presets.mysticalGlow.duration,
          easing: TarotAnimations.easing.mystical,
        }),
        -1,
        true
      );
    } else {
      pulseValue.value = withTiming(0);
      glowValue.value = withTiming(0);
    }
  }, [isActive, isPaused, variant, pulseValue, glowValue]);

  useEffect(() => {
    if (isWarning && isActive) {
      warningValue.value = withRepeat(
        withTiming(1, {
          duration: 500,
          easing: TarotAnimations.easing.easeInOut,
        }),
        -1,
        true
      );
    } else {
      warningValue.value = withTiming(0);
    }
  }, [isWarning, isActive, warningValue]);

  useEffect(() => {
    if (isExpired && onTimeEnd) {
      onTimeEnd();
    }
  }, [isExpired, onTimeEnd]);

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const scale = variant === 'mystical' && isActive
      ? interpolate(pulseValue.value, [0, 1], [1, 1.02])
      : 1;

    const shadowOpacity = variant === 'mystical' && isActive
      ? interpolate(glowValue.value, [0, 1], [0.3, 0.8])
      : shadows.medium.shadowOpacity;

    const shadowRadius = variant === 'mystical' && isActive
      ? interpolate(glowValue.value, [0, 1], [8, 16])
      : shadows.medium.shadowRadius;

    return {
      transform: [{ scale }],
      shadowOpacity,
      shadowRadius,
    };
  });

  const timeAnimatedStyle = useAnimatedStyle(() => {
    const opacity = isWarning 
      ? interpolate(warningValue.value, [0, 1], [1, 0.6])
      : 1;

    return { opacity };
  });

  const formatTime = (mins: number, secs: number): string => {
    const formattedMins = mins.toString().padStart(2, '0');
    const formattedSecs = secs.toString().padStart(2, '0');
    return `${formattedMins}:${formattedSecs}`;
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          container: { padding: spacing.md, minWidth: 100, minHeight: 60 },
          timeText: { fontSize: typography.size.titleMedium },
          labelText: { fontSize: typography.size.bodySmall },
        };
      case 'large':
        return {
          container: { padding: spacing['3xl'], minWidth: 200, minHeight: 120 },
          timeText: { fontSize: typography.size.displayLarge },
          labelText: { fontSize: typography.size.titleMedium },
        };
      default: // medium
        return {
          container: { padding: spacing['2xl'], minWidth: 150, minHeight: 90 },
          timeText: { fontSize: typography.size.titleLarge },
          labelText: { fontSize: typography.size.bodyMedium },
        };
    }
  };

  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case 'mystical':
        return {
          backgroundColor: colors.card.background,
          borderWidth: 1,
          borderColor: colors.primary.main,
          borderRadius: radius['2xl'],
          shadowColor: colors.primary.main,
          ...shadows.mystical,
        };
      case 'minimal':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: colors.card.background,
          borderWidth: 1,
          borderColor: colors.card.border,
          borderRadius: radius.xl,
          ...shadows.medium,
        };
    }
  };

  const getTimeColor = (): string => {
    if (isExpired) return colors.status.error;
    if (isWarning) return colors.status.warning;
    if (variant === 'mystical') return colors.primary.main;
    return colors.text.primary;
  };

  const sizeStyles = getSizeStyles();
  const variantStyles = getVariantStyles();

  return (
    <AnimatedView
      style={[
        styles.container,
        sizeStyles.container,
        variantStyles,
        containerAnimatedStyle,
        style,
      ]}
      testID={testID}
    >
      {showLabel && label && (
        <Text style={[styles.label, { fontSize: sizeStyles.labelText.fontSize }]}>
          {label}
        </Text>
      )}
      
      <AnimatedText
        style={[
          styles.timeText,
          {
            fontSize: sizeStyles.timeText.fontSize,
            color: getTimeColor(),
          },
          timeAnimatedStyle,
        ]}
      >
        {formatTime(minutes, seconds)}
      </AnimatedText>

      {isActive && !isPaused && (
        <View style={styles.activeIndicator}>
          <View style={[styles.activeDot, { backgroundColor: colors.primary.main }]} />
        </View>
      )}

      {isPaused && (
        <View style={styles.pausedIndicator}>
          <Text style={styles.pausedText}>⏸</Text>
        </View>
      )}

      {isExpired && (
        <View style={styles.expiredOverlay}>
          <Text style={styles.expiredText}>TIME UP</Text>
        </View>
      )}
    </AnimatedView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  } as ViewStyle,

  label: {
    fontWeight: typography.weight.medium,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  } as TextStyle,

  timeText: {
    fontWeight: typography.weight.bold,
    textAlign: 'center',
    fontFamily: 'monospace',
    lineHeight: undefined, // Let React Native calculate line height
  } as TextStyle,

  activeIndicator: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
  } as ViewStyle,

  activeDot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
  } as ViewStyle,

  pausedIndicator: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
  } as ViewStyle,

  pausedText: {
    fontSize: typography.size.bodySmall,
    color: colors.text.tertiary,
  } as TextStyle,

  expiredOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(239, 68, 68, 0.9)', // colors.status.error with opacity
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.xl,
  } as ViewStyle,

  expiredText: {
    fontSize: typography.size.titleMedium,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    textAlign: 'center',
    letterSpacing: 2,
  } as TextStyle,
});

export default TimeDisplay;