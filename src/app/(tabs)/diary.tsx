import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Screen, Text } from '@/components';
import { theme } from '@/constants';
import { formatDate } from '@/lib';

const mockDiaryEntries = [
  {
    id: '1',
    type: 'daily' as const,
    date: new Date(),
    title: "Today's 24-Hour Reading",
    completedHours: 8,
    totalHours: 24,
  },
  {
    id: '2',
    type: 'spread' as const,
    date: new Date(Date.now() - 86400000), // Yesterday
    title: 'Celtic Cross - Career Path',
    spreadType: 'Celtic Cross',
  },
  {
    id: '3',
    type: 'daily' as const,
    date: new Date(Date.now() - 86400000),
    title: "Yesterday's 24-Hour Reading",
    completedHours: 24,
    totalHours: 24,
  },
  {
    id: '4',
    type: 'spread' as const,
    date: new Date(Date.now() - 172800000), // 2 days ago
    title: '3-Card Morning Guidance',
    spreadType: '3-Card Spread',
  },
];

export default function DiaryScreen() {
  return (
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="title2" style={styles.title}>
            My Reading History
          </Text>
          <Text variant="body" color={theme.colors.textSecondary}>
            Review your past tarot readings and insights
          </Text>
        </View>

        <View style={styles.entriesList}>
          {mockDiaryEntries.map((entry) => (
            <TouchableOpacity
              key={entry.id}
              style={styles.entryCard}
              activeOpacity={0.7}
            >
              <View style={styles.entryHeader}>
                <View style={styles.entryIcon}>
                  <Text variant="body">
                    {entry.type === 'daily' ? '✨' : '🔮'}
                  </Text>
                </View>
                <View style={styles.entryInfo}>
                  <Text variant="title3" numberOfLines={1}>
                    {entry.title}
                  </Text>
                  <Text variant="caption" color={theme.colors.textSecondary}>
                    {formatDate(entry.date)}
                  </Text>
                </View>
                {entry.type === 'daily' && (
                  <View style={styles.progressBadge}>
                    <Text variant="caption" color={theme.colors.primary}>
                      {entry.completedHours}/{entry.totalHours}
                    </Text>
                  </View>
                )}
                {entry.type === 'spread' && (
                  <View style={styles.spreadBadge}>
                    <Text variant="caption" color={theme.colors.secondary}>
                      {entry.spreadType}
                    </Text>
                  </View>
                )}
              </View>

              {entry.type === 'daily' && (
                <View style={styles.progressBar}>
                  <View style={styles.progressTrack}>
                    <View 
                      style={[
                        styles.progressFill,
                        { 
                          width: `${(entry.completedHours / entry.totalHours) * 100}%` 
                        }
                      ]} 
                    />
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.emptyState}>
          <Text variant="body" color={theme.colors.textSecondary} style={styles.emptyText}>
            Your reading history will appear here as you complete daily readings and spreads.
          </Text>
        </View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: theme.spacing.md,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    marginBottom: theme.spacing.sm,
  },
  entriesList: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  entryCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  entryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  entryIcon: {
    width: 40,
    height: 40,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  entryInfo: {
    flex: 1,
  },
  progressBadge: {
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  spreadBadge: {
    backgroundColor: theme.colors.secondary + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyText: {
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomPadding: {
    height: theme.spacing.xl,
  },
});