import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '@/components';
import { theme } from '@/constants';

interface Props {
  title?: string;
  subtitle?: string;
  hourLabel: string;
  cardName?: string;
  keywords?: string[];
  timeUntilNextHour?: number;
}

export function CurrentCardHeader({
  title = 'Welcome',
  subtitle = 'Your 24-hour tarot journey continues',
  hourLabel,
  cardName,
  keywords = [],
  timeUntilNextHour,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}> 
        <Text variant="title1" style={styles.title}>{title} ✨</Text>
        <Text variant="body" color={theme.colors.textSecondary}>{subtitle}</Text>
      </View>

      <View style={styles.cardBox}>
        <Text
          variant="caption"
          color={theme.colors.primary}
          style={styles.hourLabel}
          accessibilityRole="text"
          accessibilityLabel={hourLabel}
        >
          {hourLabel}
        </Text>

        {cardName ? (
          <View style={styles.cardInfo}>
            <Text variant="title3" style={styles.cardName}>{cardName}</Text>
            {!!keywords.length && (
              <Text variant="body" color={theme.colors.textSecondary} style={styles.keywords}>
                {keywords.join(' • ')}
              </Text>
            )}
            {typeof timeUntilNextHour === 'number' && (
              <View style={styles.timeInfo}>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  {timeUntilNextHour} minutes until next hour
                </Text>
              </View>
            )}
          </View>
        ) : (
          <Text variant="body" color={theme.colors.textSecondary} style={styles.placeholder}>
            Your tarot card will appear here
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.xl,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    marginBottom: theme.spacing.sm,
  },
  cardBox: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    minHeight: 180,
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: 'dashed',
  },
  hourLabel: {
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardInfo: {
    alignItems: 'center',
  },
  cardName: {
    textAlign: 'center',
    textTransform: 'capitalize',
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
    color: theme.colors.text,
  },
  keywords: {
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  timeInfo: {
    marginTop: theme.spacing.xs,
  },
  placeholder: {
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
});




