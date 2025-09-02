import React, { memo, useMemo } from 'react';
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

export const CurrentCardHeader = memo<Props>(function CurrentCardHeader({
  title = '오늘의 타로 타이머',
  subtitle = '24시간 타로 여정이 계속됩니다',
  hourLabel,
  cardName,
  keywords = [],
  timeUntilNextHour,
}: Props) {
  const keywordText = useMemo(() => keywords.join(' • '), [keywords]);
  
  const timeText = useMemo(() => {
    if (typeof timeUntilNextHour === 'number') {
      return `${timeUntilNextHour} minutes until next hour`;
    }
    return null;
  }, [timeUntilNextHour]);
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
                {keywordText}
              </Text>
            )}
            {timeText && (
              <View style={styles.timeInfo}>
                <Text variant="caption" color={theme.colors.textSecondary}>
                  {timeText}
                </Text>
              </View>
            )}
          </View>
        ) : (
          <Text variant="body" color={theme.colors.textSecondary} style={styles.placeholder}>
            타로 카드가 여기에 나타납니다
          </Text>
        )}
      </View>
    </View>
  );
});
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
    minHeight: 200, // 피그마 디자인에 맞게 높이 증가
    justifyContent: 'center',
    borderWidth: 2, // 더 두꺼운 테두리
    borderColor: theme.colors.mystical.border, // 신비로운 테두리 색상
    // 강화된 신비로운 그림자 효과
    shadowColor: theme.colors.mystical.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  hourLabel: {
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    textTransform: 'uppercase',
    letterSpacing: -0.5, // 한국어 최적화
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.deepPurple, // 딥 퍼플 색상
  },
  cardInfo: {
    alignItems: 'center',
  },
  cardName: {
    textAlign: 'center',
    textTransform: 'capitalize',
    fontWeight: '700', // 더 굵은 폰트
    fontSize: 24, // 피그마 타이포그래피에 맞게
    marginBottom: theme.spacing.sm,
    color: theme.colors.premiumGold, // 프리미엄 골드
    letterSpacing: -0.5, // 한국어 최적화
    // 골드 텍스트에 그림자 효과
    textShadowColor: theme.colors.mystical.shadow,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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




