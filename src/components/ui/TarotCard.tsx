import React, { useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  interpolate,
  Easing,
} from 'react-native-reanimated';
import { colors, layout, radius, shadows, typography, spacing } from '../../constants/DesignTokens';
import { TarotAnimations } from '../../constants/Animations';

export interface TarotCardProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  variant?: 'placeholder' | 'revealed' | 'flipped';
  cardImage?: string;
  cardName?: string;
  position?: string;
  description?: string;
  isAnimated?: boolean;
  mysticalEffect?: boolean;
  onPress?: () => void;
  onLongPress?: () => void;
  style?: ViewStyle;
  testID?: string;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const TarotCard: React.FC<TarotCardProps> = ({
  size = 'medium',
  variant = 'placeholder',
  cardImage,
  cardName,
  position,
  description,
  isAnimated = true,
  mysticalEffect = false,
  onPress,
  onLongPress,
  style,
  testID,
}) => {
  const scaleValue = useSharedValue(1);
  const pulseValue = useSharedValue(0);
  const glowValue = useSharedValue(0);
  const floatValue = useSharedValue(0);

  useEffect(() => {
    if (isAnimated && variant === 'revealed') {
      scaleValue.value = withTiming(1, {
        duration: TarotAnimations.presets.cardEntrance.duration,
        easing: TarotAnimations.easing.cardFlip,
      });
    }

    if (mysticalEffect && variant !== 'placeholder') {
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

      floatValue.value = withRepeat(
        withTiming(1, {
          duration: TarotAnimations.timing.mystical * 3,
          easing: TarotAnimations.easing.mystical,
        }),
        -1,
        true
      );
    }
  }, [variant, isAnimated, mysticalEffect, scaleValue, pulseValue, glowValue, floatValue]);

  const animatedStyle = useAnimatedStyle(() => {
    const scale = mysticalEffect 
      ? interpolate(pulseValue.value, [0, 1], [1, 1.02])
      : scaleValue.value;

    const translateY = mysticalEffect 
      ? interpolate(floatValue.value, [0, 0.5, 1], [0, -2, 0])
      : 0;

    const shadowOpacity = mysticalEffect 
      ? interpolate(glowValue.value, [0, 1], [0.3, 0.8])
      : shadows.mystical.shadowOpacity;

    const shadowRadius = mysticalEffect 
      ? interpolate(glowValue.value, [0, 1], [10, 20])
      : shadows.mystical.shadowRadius;

    return {
      transform: [
        { scale },
        { translateY },
      ],
      shadowOpacity,
      shadowRadius,
    };
  });

  const handlePress = () => {
    if (onPress) {
      scaleValue.value = withTiming(0.95, {
        duration: TarotAnimations.presets.buttonPress.duration,
        easing: TarotAnimations.easing.easeInOut,
      }, () => {
        scaleValue.value = withTiming(1, {
          duration: TarotAnimations.presets.buttonRelease.duration,
          easing: TarotAnimations.easing.cardSlide,
        });
      });
      onPress();
    }
  };

  const cardDimensions = layout.card[size];
  const isPlaceholder = variant === 'placeholder';
  const isRevealed = variant === 'revealed';
  const isFlipped = variant === 'flipped';

  return (
    <AnimatedTouchableOpacity
      style={[
        styles.container,
        {
          width: cardDimensions.width,
          height: cardDimensions.height,
        },
        isPlaceholder && styles.placeholder,
        isRevealed && styles.revealed,
        isFlipped && styles.flipped,
        mysticalEffect && styles.mystical,
        animatedStyle,
        style,
      ]}
      onPress={handlePress}
      onLongPress={onLongPress}
      activeOpacity={0.8}
      testID={testID}
    >
      {isPlaceholder && (
        <View style={styles.placeholderContent}>
          <View style={styles.placeholderPattern} />
          <Text style={styles.placeholderText}>?</Text>
        </View>
      )}

      {isRevealed && cardImage && (
        <Image 
          source={{ uri: cardImage }} 
          style={[
            styles.cardImage,
            {
              width: cardDimensions.width - 4,
              height: cardDimensions.height - 4,
            }
          ]}
          resizeMode="cover"
        />
      )}

      {isFlipped && (
        <View style={styles.cardBack}>
          <View style={styles.cardBackPattern} />
          <View style={styles.cardBackCenter}>
            <Text style={styles.cardBackText}>TAROT</Text>
          </View>
        </View>
      )}

      {position && (
        <View style={styles.positionBadge}>
          <Text style={styles.positionText}>{position}</Text>
        </View>
      )}

      {cardName && isRevealed && (
        <View style={styles.cardInfo}>
          <Text style={styles.cardName} numberOfLines={1}>
            {cardName}
          </Text>
          {description && (
            <Text style={styles.cardDescription} numberOfLines={2}>
              {description}
            </Text>
          )}
        </View>
      )}
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.xl,
    borderWidth: 1,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.medium,
  } as ViewStyle,

  placeholder: {
    backgroundColor: colors.card.background,
    borderColor: colors.card.border,
  } as ViewStyle,

  revealed: {
    backgroundColor: colors.background.secondary,
    borderColor: colors.primary.main,
    ...shadows.mystical,
  } as ViewStyle,

  flipped: {
    backgroundColor: colors.primary.main,
    borderColor: colors.primary.dark,
  } as ViewStyle,

  mystical: {
    shadowColor: colors.primary.main,
    ...shadows.mysticalGlow,
  } as ViewStyle,

  placeholderContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  } as ViewStyle,

  placeholderPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.card.background,
    opacity: 0.5,
  } as ViewStyle,

  placeholderText: {
    fontSize: typography.size.displayLarge,
    fontWeight: typography.weight.bold,
    color: colors.text.tertiary,
    textAlign: 'center',
  } as TextStyle,

  cardImage: {
    borderRadius: radius.lg,
  } as ImageStyle,

  cardBack: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    backgroundColor: colors.primary.main,
  } as ViewStyle,

  cardBackPattern: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    bottom: spacing.sm,
    borderWidth: 2,
    borderColor: colors.primary.dark,
    borderRadius: radius.md,
  } as ViewStyle,

  cardBackCenter: {
    width: '60%',
    height: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary.dark,
    borderRadius: radius.sm,
  } as ViewStyle,

  cardBackText: {
    fontSize: typography.size.bodySmall,
    fontWeight: typography.weight.bold,
    color: colors.background.primary,
    letterSpacing: 2,
  } as TextStyle,

  positionBadge: {
    position: 'absolute',
    top: -spacing.sm,
    right: -spacing.sm,
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.small,
  } as ViewStyle,

  positionText: {
    fontSize: typography.size.caption,
    fontWeight: typography.weight.bold,
    color: colors.background.primary,
  } as TextStyle,

  cardInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: spacing.sm,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  } as ViewStyle,

  cardName: {
    fontSize: typography.size.bodySmall,
    fontWeight: typography.weight.medium,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: 2,
  } as TextStyle,

  cardDescription: {
    fontSize: typography.size.caption,
    fontWeight: typography.weight.regular,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.size.caption * typography.lineHeight.normal,
  } as TextStyle,
});

export default TarotCard;