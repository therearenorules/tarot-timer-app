import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '@/components';
import { theme } from '@/constants';
import { type DailyCard } from '@/lib/database/types';

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
  const getAccessibilityLabel = () => {
    let label = `Hour ${hour}`;
    if (hourCard) {
      label += `, Card: ${hourCard.cardName}`;
    }
    if (hasMemo) {
      label += ', Has memo';
    }
    if (isCurrentHour) {
      label += ', Current hour';
    }
    if (isSelected) {
      label += ', Selected';
    }
    return label;
  };

  const getAccessibilityHint = () => {
    if (hourCard) {
      return `View details for ${hourCard.cardName} card at hour ${hour}`;
    }
    return `Select hour ${hour} to view or add card information`;
  };

  return (
    <Pressable
      style={[
        styles.hourCard,
        isCurrentHour && styles.currentHourCard,
        isSelected && styles.selectedHourCard,
        hasMemo && styles.hasMemoStyle
      ]}
      onPress={() => onPress(hour)}
      accessibilityLabel={getAccessibilityLabel()}
      accessibilityHint={getAccessibilityHint()}
      accessibilityRole="button"
      accessibilityState={{
        selected: isSelected,
        checked: isCurrentHour
      }}
    >
      <Text 
        variant="caption" 
        color={isCurrentHour ? theme.colors.primary : theme.colors.textSecondary}
        style={styles.hourNumber}
      >
        {hour.toString().padStart(2, '0')}
      </Text>
      {hourCard && hourCard.cardName && (
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
    width: 48, // 피그마 8pt 그리드에 맞게 조정
    height: 48, // 피그마 8pt 그리드에 맞게 조정
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md, // 피그마 디자인에 맞게 조정
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    position: 'relative',
    // 신비로운 그림자 효과 추가
    shadowColor: theme.colors.mystical.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  currentHourCard: {
    backgroundColor: theme.colors.primary + '15', // 더 부드러운 투명도
    borderColor: theme.colors.premiumGold, // 프리미엄 골드 테두리
    borderWidth: 2,
    // 현재 시간 카드에 특별한 글로우 효과
    shadowColor: theme.colors.mystical.glow,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  selectedHourCard: {
    backgroundColor: theme.colors.midnightBlue + '20', // 미드나잇 블루 배경
    borderColor: theme.colors.deepPurple, // 딥 퍼플 테두리
    borderWidth: 2,
  },
  hasMemoStyle: {
    backgroundColor: theme.colors.premiumGold + '10', // 골드 배경
    borderColor: theme.colors.premiumGold, // 골드 테두리
  },
  hourNumber: {
    fontSize: 14, // 피그마 타이포그래피에 맞게 조정
    fontWeight: '600',
    color: theme.colors.text,
    letterSpacing: -0.5, // 한국어 최적화
  },
  cardInitial: {
    fontSize: 10, // 피그마 디자인에 맞게 조정
    position: 'absolute',
    bottom: 4,
    left: 4,
    textTransform: 'uppercase',
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  memoIndicator: {
    width: 8, // 더 큰 크기로 가시성 향상
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.premiumGold, // 프리미엄 골드
    position: 'absolute',
    top: 4,
    right: 4,
    // 메모 인디케이터에 작은 그림자
    shadowColor: theme.colors.mystical.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 1,
  },
});