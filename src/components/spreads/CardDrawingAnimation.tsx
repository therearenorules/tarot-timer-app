/**
 * CardDrawingAnimation Component - Simple card drawing animation
 */

import React, { useEffect, useCallback, memo } from 'react';
import { View, StyleSheet } from 'react-native';
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
  const handleComplete = useCallback(() => {
    onAnimationComplete?.();
  }, [onAnimationComplete]);

  useEffect(() => {
    if (isVisible && onAnimationComplete) {
      const timer = setTimeout(handleComplete, 1500);
      return () => clearTimeout(timer);
    }
  }, [isVisible, handleComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text variant="h3" style={styles.drawingText}>
            Drawing Card...
          </Text>
          {cardName && (
            <Text variant="body" style={styles.cardNameText}>
              {cardName}
            </Text>
          )}
        </View>
      </View>
    </View>
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