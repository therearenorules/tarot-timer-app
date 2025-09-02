import React, { useState, useEffect, memo } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity,
  Alert 
} from 'react-native';
import { Text, Button } from '@/components';
import { theme } from '@/constants';
import { formatDate } from '@/lib';
import { DailySession, DailyCard } from '@/lib/database/types';
import { databaseService } from '@/lib/database';

interface Props {
  session: DailySession;
  cards: DailyCard[];
  onClose: () => void;
}

export const DailyDetailModal = memo<Props>(({ session, cards: initialCards, onClose }) => {
  const [cards, setCards] = useState<DailyCard[]>(initialCards);
  const [isLoading, setIsLoading] = useState(false);

  // Load session cards if not provided
  useEffect(() => {
    const loadSessionCards = async () => {
      if (cards.length === 0) {
        setIsLoading(true);
        try {
          if (databaseService.isReady()) {
            const sessionCards = await databaseService.dailyTarot.getCardsBySession(session.id);
            setCards(sessionCards);
          }
        } catch (error) {
          console.error('Failed to load session cards:', error);
          Alert.alert('Error', 'Failed to load session cards');
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadSessionCards();
  }, [session.id, cards.length]);

  const cardsWithMemos = cards.filter(card => card.memo && card.memo.trim());
  const completionPercentage = cards.length > 0 ? Math.round((cardsWithMemos.length / cards.length) * 100) : 0;

  const renderCard = (card: DailyCard) => (
    <View key={card.id} style={styles.cardItem}>
      <View style={styles.cardHeader}>
        <View style={styles.hourBadge}>
          <Text variant="caption" color={theme.colors.background} style={styles.hourBadgeText}>
            {card.hour.toString().padStart(2, '0')}:00
          </Text>
        </View>
        <Text variant="body" style={styles.cardName}>
          {card.cardKey.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
        </Text>
      </View>
      
      {card.memo ? (
        <View style={styles.memoContainer}>
          <Text variant="body" style={styles.memoText}>
            {card.memo}
          </Text>
        </View>
      ) : (
        <View style={styles.noMemoContainer}>
          <Text variant="caption" color={theme.colors.textSecondary}>
            No memo recorded
          </Text>
        </View>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🌟</Text>
      <Text variant="title3" style={styles.emptyTitle}>
        No Cards Generated Yet
      </Text>
      <Text variant="body" color={theme.colors.textSecondary} style={styles.emptyDescription}>
        This daily session doesn't have any cards yet. Cards are generated when you use the daily timer.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text variant="body" color={theme.colors.primary} style={styles.closeButtonText}>
              ← Done
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerCenter}>
          <Text variant="title3">Daily Reading</Text>
          <Text variant="caption" color={theme.colors.textSecondary}>
            {formatDate(new Date(session.date))}
          </Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text variant="body" color={theme.colors.text} style={styles.statValue}>
            {cards.length}
          </Text>
          <Text variant="caption" color={theme.colors.textSecondary}>
            Total Cards
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text variant="body" color={theme.colors.text} style={styles.statValue}>
            {cardsWithMemos.length}
          </Text>
          <Text variant="caption" color={theme.colors.textSecondary}>
            With Memos
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text variant="body" color={theme.colors.primary} style={styles.statValue}>
            {completionPercentage}%
          </Text>
          <Text variant="caption" color={theme.colors.textSecondary}>
            Complete
          </Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View style={styles.loadingState}>
            <Text variant="body" color={theme.colors.textSecondary}>
              Loading cards...
            </Text>
          </View>
        ) : cards.length === 0 ? (
          renderEmptyState()
        ) : (
          <View style={styles.cardsList}>
            {cards
              .sort((a, b) => a.hour - b.hour)
              .map(renderCard)
            }
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
});

DailyDetailModal.displayName = 'DailyDetailModal';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerLeft: {
    flex: 1,
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
  },
  closeButton: {
    alignSelf: 'flex-start',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 2,
  },
  content: {
    flex: 1,
  },
  loadingState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  emptyDescription: {
    textAlign: 'center',
    lineHeight: 20,
  },
  cardsList: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.md,
  },
  cardItem: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  hourBadge: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    marginRight: theme.spacing.md,
  },
  hourBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardName: {
    fontWeight: '500',
    flex: 1,
  },
  memoContainer: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  memoText: {
    lineHeight: 20,
  },
  noMemoContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
});