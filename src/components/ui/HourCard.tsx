import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components';
import { theme } from '@/constants';
import { type DailyCard } from '@/lib/cardGeneration';

interface HourCardProps {
  hour: number;
  hourCard?: DailyCard;
  hasMemo: boolean;
  isCurrentHour: boolean;
  isSelected: boolean;
  onPress: (hour: number) => void;
}

export const HourCard = memo<HourCardProps>(({
  hour,
  hourCard,
  hasMemo,
  isCurrentHour,
  isSelected,
  onPress,
}) => {
  return (
    <Pressable 
      style={[
        styles.hourCard,
        isCurrentHour && styles.currentHourCard,
        isSelected && styles.selectedHourCard,
        hasMemo && styles.hasMemoStyle
      ]}
      onPress={() => onPress(hour)}
    >
      <Text 
        variant="caption" 
        color={isCurrentHour ? theme.colors.primary : theme.colors.textSecondary}
        style={styles.hourNumber}
      >
        {hour.toString().padStart(2, '0')}
      </Text>
      {hourCard && (
        <Text 
          variant="caption"
          color={theme.colors.textSecondary}
          style={styles.cardInitial}
          numberOfLines={1}
        >
          {hourCard.cardName.charAt(0)}
        </Text>
      )}
      {hasMemo && (
        <View style={styles.memoIndicator} />
      )}
    </Pressable>
  );
});

HourCard.displayName = 'HourCard';

const styles = StyleSheet.create({
  hourCard: {
    width: 45,
    height: 45,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    position: 'relative',
  },
  currentHourCard: {
    backgroundColor: theme.colors.primary + '20',
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  selectedHourCard: {
    backgroundColor: theme.colors.secondary + '20',
    borderColor: theme.colors.secondary,
  },
  hasMemoStyle: {
    backgroundColor: theme.colors.accent + '10',
    borderColor: theme.colors.accent,
  },
  hourNumber: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardInitial: {
    fontSize: 8,
    position: 'absolute',
    bottom: 2,
    left: 2,
    textTransform: 'uppercase',
  },
  memoIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.colors.accent,
    position: 'absolute',
    top: 2,
    right: 2,
  },
});