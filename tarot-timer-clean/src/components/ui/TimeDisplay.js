import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients } from '../../utils/colors';
import { typography, spacing, borderRadius, shadows } from '../../utils/styles';

export const TimeDisplay = ({ 
  showSeconds = true,
  style = {},
  format = '24h' 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    if (format === '12h') {
      const displayHours = hours % 12 || 12;
      const ampm = hours >= 12 ? 'PM' : 'AM';
      return {
        time: `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}${showSeconds ? ':' + seconds.toString().padStart(2, '0') : ''}`,
        period: ampm
      };
    } else {
      return {
        time: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}${showSeconds ? ':' + seconds.toString().padStart(2, '0') : ''}`,
        period: null
      };
    }
  };

  const { time, period } = formatTime(currentTime);
  const currentHour = currentTime.getHours();

  // Get tarot card for current hour (0-23)
  const getTarotCardForHour = (hour) => {
    const tarotCards = [
      { name: '바보', symbol: '🌟' }, // 0시
      { name: '마법사', symbol: '🎭' }, // 1시
      { name: '여사제', symbol: '🌙' }, // 2시
      { name: '여황제', symbol: '👑' }, // 3시
      { name: '황제', symbol: '⚡' }, // 4시
      { name: '교황', symbol: '🔮' }, // 5시
      { name: '연인', symbol: '💖' }, // 6시
      { name: '전차', symbol: '🏛️' }, // 7시
      { name: '힘', symbol: '🦁' }, // 8시
      { name: '은자', symbol: '🕯️' }, // 9시
      { name: '운명의 수레바퀴', symbol: '☸️' }, // 10시
      { name: '정의', symbol: '⚖️' }, // 11시
      { name: '매달린 사람', symbol: '🕸️' }, // 12시
      { name: '죽음', symbol: '💀' }, // 13시
      { name: '절제', symbol: '🏺' }, // 14시
      { name: '악마', symbol: '😈' }, // 15시
      { name: '탑', symbol: '🗼' }, // 16시
      { name: '별', symbol: '⭐' }, // 17시
      { name: '달', symbol: '🌙' }, // 18시
      { name: '태양', symbol: '☀️' }, // 19시
      { name: '심판', symbol: '🎺' }, // 20시
      { name: '세계', symbol: '🌍' }, // 21시
      { name: '물의 에이스', symbol: '💧' }, // 22시
      { name: '검의 에이스', symbol: '⚔️' }, // 23시
    ];

    return tarotCards[hour] || tarotCards[0];
  };

  const currentCard = getTarotCardForHour(currentHour);

  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={gradients.mystical}
        style={styles.timeContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Current Time */}
        <View style={styles.timeWrapper}>
          <Text style={styles.timeText}>{time}</Text>
          {period && <Text style={styles.periodText}>{period}</Text>}
        </View>

        {/* Tarot Card for Current Hour */}
        <View style={styles.cardInfo}>
          <Text style={styles.cardSymbol}>{currentCard.symbol}</Text>
          <Text style={styles.cardName}>{currentCard.name}</Text>
          <Text style={styles.hourText}>{currentHour}시의 카드</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.large,
    overflow: 'hidden',
    ...shadows.mysticalGlow,
  },
  timeContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  timeWrapper: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: spacing.lg,
  },
  timeText: {
    ...typography.displayLarge,
    color: colors.dark.accent,
    fontWeight: 'bold',
    fontSize: 48,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  periodText: {
    ...typography.titleMedium,
    color: colors.dark.secondaryForeground,
    marginLeft: spacing.sm,
    fontSize: 18,
  },
  cardInfo: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
    paddingTop: spacing.md,
    marginTop: spacing.md,
  },
  cardSymbol: {
    fontSize: 36,
    marginBottom: spacing.sm,
  },
  cardName: {
    ...typography.titleMedium,
    color: colors.dark.foreground,
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  hourText: {
    ...typography.bodyMedium,
    color: colors.dark.secondaryForeground,
    opacity: 0.8,
  },
});