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
    title: "오늘의 24시간 리딩",
    completedHours: 8,
    totalHours: 24,
  },
  {
    id: '2',
    type: 'spread' as const,
    date: new Date(Date.now() - 86400000), // Yesterday
    title: '켈틱 크로스 - 진로 길잡이',
    spreadType: '켈틱 크로스',
  },
  {
    id: '3',
    type: 'daily' as const,
    date: new Date(Date.now() - 86400000),
    title: "어제의 24시간 리딩",
    completedHours: 24,
    totalHours: 24,
  },
  {
    id: '4',
    type: 'spread' as const,
    date: new Date(Date.now() - 172800000), // 2 days ago
    title: '3장 아침 가이드',
    spreadType: '3장 스프레드',
  },
];

export default function DiaryScreen() {
  return (
    <Screen>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text variant="title2" style={styles.title}>
            나의 리딩 기록
          </Text>
          <Text variant="body" color={theme.colors.textSecondary}>
            과거 타로 리딩과 통찰을 확인하세요
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
            일일 리딩과 스프레드를 완료하면 리딩 기록이 여기에 나타납니다.
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
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.mystical.border,
    // 신비로운 그림자 효과 적용
    shadowColor: theme.colors.mystical.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
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
    backgroundColor: theme.colors.premiumGold + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.premiumGold + '40',
  },
  spreadBadge: {
    backgroundColor: theme.colors.deepPurple + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.deepPurple + '40',
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
    backgroundColor: theme.colors.premiumGold,
    borderRadius: 2,
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