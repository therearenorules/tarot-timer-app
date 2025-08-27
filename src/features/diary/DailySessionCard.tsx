import React, { memo } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Text } from '@/components';
import { theme } from '@/constants';
import { formatDate } from '@/lib';
import { DailySession, DailyCard } from '@/lib/database/types';

interface Props {
  session: DailySession;
  cards: DailyCard[];
  onPress: () => void;
}

export const DailySessionCard = memo<Props>(({ session, cards, onPress }) => {
  const cardCount = cards.length;
  const memoCount = cards.filter(card => card.memo && card.memo.trim()).length;
  
  // Get a preview of the first memo if available
  const firstMemo = cards.find(card => card.memo && card.memo.trim())?.memo;
  const memoPreview = firstMemo ? 
    (firstMemo.length > 30 ? firstMemo.substring(0, 30) + '...' : firstMemo) : 
    null;

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.dateContainer}>
        <Text variant="caption" color={theme.colors.primary} style={styles.dateLabel}>
          {formatDate(new Date(session.date))}
        </Text>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>✨</Text>
        </View>
      </View>
      
      <Text variant="title3" style={styles.title}>
        Daily Reading
      </Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text variant="caption" color={theme.colors.textSecondary}>
            Cards
          </Text>
          <Text variant="body" color={theme.colors.text} style={styles.statValue}>
            {cardCount}/24
          </Text>
        </View>
        <View style={styles.stat}>
          <Text variant="caption" color={theme.colors.textSecondary}>
            Memos
          </Text>
          <Text variant="body" color={theme.colors.text} style={styles.statValue}>
            {memoCount}
          </Text>
        </View>
      </View>

      {memoPreview && (
        <View style={styles.memoPreview}>
          <Text variant="caption" color={theme.colors.textSecondary} numberOfLines={2}>
            {memoPreview}
          </Text>
        </View>
      )}

      {cardCount > 0 && (
        <View style={styles.progressBar}>
          <View style={styles.progressTrack}>
            <View 
              style={[
                styles.progressFill,
                { width: `${(cardCount / 24) * 100}%` }
              ]} 
            />
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
});

DailySessionCard.displayName = 'DailySessionCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minWidth: 200,
    maxWidth: 220,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  iconContainer: {
    width: 24,
    height: 24,
    backgroundColor: theme.colors.primary + '20',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 14,
  },
  title: {
    marginBottom: theme.spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 2,
  },
  memoPreview: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  progressBar: {
    marginTop: theme.spacing.sm,
  },
  progressTrack: {
    height: 4,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
});