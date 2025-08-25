/**
 * CardPosition Component - Simple card position placeholder
 */

import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from '@/components';
import { theme } from '@/constants';
import { SpreadCard } from '@/assets/spreads';

interface CardPositionProps {
  positionIndex: number;
  card?: SpreadCard;
  position: {
    x: number;
    y: number;
    width?: number;
    height?: number;
    label?: string;
  };
  onPress?: (positionIndex: number) => void;
  onLongPress?: (positionIndex: number) => void;
  isHighlighted?: boolean;
  showLabel?: boolean;
}

export function CardPosition({
  positionIndex,
  card,
  position,
  onPress,
  onLongPress,
  isHighlighted = false,
  showLabel = true,
}: CardPositionProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isHighlighted && styles.highlighted,
      ]}
      onPress={() => onPress?.(positionIndex)}
      onLongPress={() => onLongPress?.(positionIndex)}
      activeOpacity={0.7}
    >
      {card ? (
        <View style={styles.cardContent}>
          <Text variant="tiny" style={styles.cardName} numberOfLines={2}>
            {card.cardName}
          </Text>
          {card.isReversed && (
            <Text variant="tiny" style={styles.reversedText}>
              R
            </Text>
          )}
        </View>
      ) : (
        <View style={styles.emptySlot}>
          <Text variant="tiny" style={styles.emptyText}>
            {positionIndex + 1}
          </Text>
        </View>
      )}
      
      {showLabel && position.label && (
        <Text variant="tiny" style={styles.positionLabel}>
          {position.label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 60,
    height: 90,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  highlighted: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: theme.colors.primary + '10',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardName: {
    textAlign: 'center',
    fontWeight: '500',
    color: theme.colors.text,
  },
  reversedText: {
    textAlign: 'center',
    color: theme.colors.accent,
    fontWeight: '700',
    marginTop: 2,
  },
  emptySlot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  positionLabel: {
    position: 'absolute',
    bottom: -14,
    fontSize: 9,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});