/**
 * CardDrawingAnimation Component - Simple card drawing animation
 */

import React, { useEffect, useCallback, memo, useRef } from 'react';
import { View, StyleSheet, Animated, InteractionManager } from 'react-native';
import { Text } from '@/components';
import { theme } from '@/constants';

interface CardDrawingAnimationProps {
  isVisible: boolean;
  cardName?: string;
  onAnimationComplete?: () => void;
}

export const CardDrawingAnimation = memo<CardDrawingAnimationProps>(({
  isVisible,
  cardName,
  onAnimationComplete,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const handleComplete = useCallback(() => {
    // Defer callback to avoid blocking UI
    InteractionManager.runAfterInteractions(() => {
      onAnimationComplete?.();
    });
  }, [onAnimationComplete]);

  useEffect(() => {
    if (isVisible) {
      // Start entrance animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          })
        ),
      ]).start();

      const timer = setTimeout(() => {
        // Exit animation
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start(handleComplete);
      }, 1300);

      return () => clearTimeout(timer);
    } else {
      // Reset animations
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
      rotateAnim.setValue(0);
    }
  }, [isVisible, fadeAnim, scaleAnim, rotateAnim, handleComplete]);

  if (!isVisible) {
    return null;
  }

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
      <View style={styles.cardContainer}>
        <Animated.View 
          style={[
            styles.card,
            {
              transform: [
                { scale: scaleAnim },
                { rotate: rotateInterpolate },
              ],
            },
          ]}
        >
          <Text variant="h3" style={styles.drawingText}>
            Drawing Card...
          </Text>
          {cardName && (
            <Text variant="body" style={styles.cardNameText}>
              {cardName}
            </Text>
          )}
        </Animated.View>
      </View>
    </Animated.View>
  );
});

CardDrawingAnimation.displayName = 'CardDrawingAnimation';

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  cardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 200,
    height: 280,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 3,
    borderColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  drawingText: {
    textAlign: 'center',
    color: theme.colors.primary,
    marginBottom: theme.spacing.md,
  },
  cardNameText: {
    textAlign: 'center',
    color: theme.colors.text,
    fontWeight: '600',
  },
});