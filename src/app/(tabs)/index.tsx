import React, { useEffect, useMemo, useCallback, useRef } from 'react';
import { View, StyleSheet, ScrollView, Alert, InteractionManager } from 'react-native';
import { Screen, Text, HourCard } from '@/components';
import { theme } from '@/constants';
import { getCurrentHour, getTimeBasedGreeting, getHourRangeDescription } from '@/lib/timeManager';
import { useDailyTarotStore } from '@/stores/dailyTarotStore';
import { type DailyCard } from '@/lib/cardGeneration';

export default function HomeScreen() {
  const dailyTarotStore = useDailyTarotStore();
  
  const {
    currentSession,
    selectedHour,
    currentHour,
    timeUntilNextHour,
    isLoading,
    error,
    selectHour,
    updateCurrentTime,
    refreshIfNewDay,
    getSessionStats,
    getMemoForHour
  } = dailyTarotStore;

  // Memoize expensive calculations
  const sessionStats = useMemo(() => getSessionStats(), [currentSession]);
  const greeting = useMemo(() => getTimeBasedGreeting(currentHour), [currentHour]);
  const currentHourCard = useMemo(() => 
    currentSession?.cards.find((card: DailyCard) => card.hour === currentHour),
    [currentSession?.cards, currentHour]
  );

  // Update time every minute with stable reference and performance optimization
  const timeUpdateRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleTimeUpdate = useCallback(() => {
    // Use InteractionManager to defer non-critical updates
    InteractionManager.runAfterInteractions(() => {
      updateCurrentTime();
      refreshIfNewDay();
    });
  }, [updateCurrentTime, refreshIfNewDay]);

  useEffect(() => {
    // Improved timer management with better cleanup
    timeUpdateRef.current = setInterval(handleTimeUpdate, 60000); // Update every minute
    
    return () => {
      if (timeUpdateRef.current) {
        clearInterval(timeUpdateRef.current);
        timeUpdateRef.current = null;
      }
    };
  }, [handleTimeUpdate]);

  const handleHourPress = useCallback((hour: number) => {
    selectHour(hour);
    const hourCard = currentSession?.cards.find((card: DailyCard) => card.hour === hour);
    const memo = getMemoForHour(hour);
    
    Alert.alert(
      `${hourCard?.cardName || 'Unknown Card'} - Hour ${hour}`,
      `Keywords: ${hourCard?.keywords.join(', ') || 'None'}\n\nMemo: ${memo || 'No memo yet'}`,
      [{ text: 'OK' }]
    );
  }, [selectHour, currentSession?.cards, getMemoForHour]);

  if (error) {
    return (
      <Screen>
        <View style={styles.centerContainer}>
          <Text variant="title2" color={theme.colors.accent}>
            Error Loading Tarot Cards
          </Text>
          <Text variant="body" color={theme.colors.textSecondary} style={styles.errorMessage}>
            {error}
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="title1" style={styles.title}>
            {greeting}! ✨
          </Text>
          <Text variant="body" color={theme.colors.textSecondary}>
            Your 24-hour tarot journey continues
          </Text>
        </View>

        <View style={styles.currentCard}>
          <View style={styles.cardPlaceholder}>
            <Text variant="caption" color={theme.colors.primary} style={styles.hourLabel}>
              Current Hour: {currentHour} ({getHourRangeDescription(currentHour)})
            </Text>
            
            {currentHourCard ? (
              <View style={styles.cardInfo}>
                <Text variant="title3" style={styles.cardName}>
                  {currentHourCard.cardName}
                </Text>
                <Text variant="body" color={theme.colors.textSecondary} style={styles.keywords}>
                  {currentHourCard.keywords.join(' • ')}
                </Text>
                <View style={styles.timeInfo}>
                  <Text variant="caption" color={theme.colors.textSecondary}>
                    {timeUntilNextHour} minutes until next hour
                  </Text>
                </View>
              </View>
            ) : (
              <Text variant="body" color={theme.colors.textSecondary} style={styles.cardText}>
                {isLoading ? 'Loading your card for this hour...' : 'Your tarot card will appear here'}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.hourGrid}>
          <View style={styles.gridHeader}>
            <Text variant="title3" style={styles.sectionTitle}>
              Today's Cards
            </Text>
            <Text variant="caption" color={theme.colors.textSecondary}>
              {sessionStats.totalCards} cards • {sessionStats.cardsWithMemos} memos • {sessionStats.completionPercentage}% complete
            </Text>
          </View>

          <View style={styles.grid}>
            {useMemo(() =>
              Array.from({ length: 24 }, (_, i) => {
                const hourCard = currentSession?.cards.find((card: DailyCard) => card.hour === i);
                const hasMemo = getMemoForHour(i).length > 0;
                const isCurrentHourCard = i === currentHour;
                const isSelectedHour = i === selectedHour;
                
                return (
                  <HourCard
                    key={i}
                    hour={i}
                    hourCard={hourCard}
                    hasMemo={hasMemo}
                    isCurrentHour={isCurrentHourCard}
                    isSelected={isSelectedHour}
                    onPress={handleHourPress}
                  />
                );
              }),
              [currentSession?.cards, getMemoForHour, currentHour, selectedHour, handleHourPress]
            )}
          </View>
        </View>

        {currentSession && (
          <View style={styles.sessionInfo}>
            <Text variant="caption" color={theme.colors.textSecondary}>
              Session: {currentSession.date} • Deck: {currentSession.deckId}
            </Text>
            <Text variant="caption" color={theme.colors.textSecondary}>
              Generated: {new Date(currentSession.generatedAt).toLocaleTimeString()}
            </Text>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: theme.spacing.md,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    marginBottom: theme.spacing.sm,
  },
  currentCard: {
    marginBottom: theme.spacing.xl,
  },
  cardPlaceholder: {
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
  cardText: {
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
  errorMessage: {
    textAlign: 'center',
    marginTop: theme.spacing.md,
    lineHeight: 20,
  },
  hourGrid: {
    flex: 1,
    marginBottom: theme.spacing.xl,
  },
  gridHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  sessionInfo: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
});