import React, { useEffect, useMemo, useCallback, useRef, useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, InteractionManager } from 'react-native';
import { Screen, Text, VirtualizedHourGrid, CurrentCardHeader, MemoSheet } from '../../components';
import { theme } from '../../constants';
import { getCurrentHour, getTimeBasedGreeting, getHourRangeDescription } from '../../lib/timeManager';
import { useDailyTarotStore } from '../../stores/dailyTarotStore';
import { type DailyCard } from '../../lib/database/types';

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
    currentSession?.cards?.find((card: DailyCard) => card.hour === currentHour),
    [currentSession?.cards, currentHour]
  );

  const [memoVisible, setMemoVisible] = useState(false);
  const [draftMemo, setDraftMemo] = useState('');

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
    setDraftMemo(getMemoForHour(hour));
    setMemoVisible(true);
  }, [selectHour, getMemoForHour]);

  const handleSaveMemo = useCallback(() => {
    if (typeof selectedHour === 'number') {
      dailyTarotStore.saveMemo(selectedHour, draftMemo);
    }
    setMemoVisible(false);
  }, [dailyTarotStore, selectedHour, draftMemo]);

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
        <CurrentCardHeader
          title={`${greeting}!`}
          subtitle="Your 24-hour tarot journey continues"
          hourLabel={`Current Hour: ${currentHour} (${getHourRangeDescription(currentHour)})`}
          cardName={currentHourCard?.cardName}
          keywords={currentHourCard?.keywords}
          timeUntilNextHour={timeUntilNextHour}
        />

        <View style={styles.hourGrid}>
          <View style={styles.gridHeader}>
            <Text variant="title3" style={styles.sectionTitle}>
              Today's Cards
            </Text>
            <Text variant="caption" color={theme.colors.textSecondary}>
              {sessionStats.totalCards} cards • {sessionStats.cardsWithMemos} memos • {sessionStats.completionPercentage}% complete
            </Text>
          </View>
          <VirtualizedHourGrid
            currentSession={currentSession}
            getMemoForHour={getMemoForHour}
            currentHour={currentHour}
            selectedHour={selectedHour}
            onHourPress={handleHourPress}
          />
        </View>

        {currentSession && (
          <View style={styles.sessionInfo}>
            <Text variant="caption" color={theme.colors.textSecondary}>
              Session: {currentSession.date} • Deck: {currentSession.deckId}
            </Text>
            <Text variant="caption" color={theme.colors.textSecondary}>
              Generated: {currentSession.generatedAt ? new Date(currentSession.generatedAt).toLocaleTimeString() : 'Unknown'}
            </Text>
          </View>
        )}
      </ScrollView>
      <MemoSheet
        visible={memoVisible}
        hour={selectedHour}
        value={draftMemo}
        onChangeText={setDraftMemo}
        onSave={handleSaveMemo}
        onClose={() => setMemoVisible(false)}
      />
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
    color: theme.colors.midnightBlue, // Mystical midnight blue from Figma
    fontWeight: '600',
  },
  sessionInfo: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    // Mystical shadow effect
    shadowColor: theme.colors.deepPurple,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});