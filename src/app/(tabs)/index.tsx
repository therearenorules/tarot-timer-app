/**
 * Timer Screen - Simplified for troubleshooting
 * Matches design reference timer01.png
 */

import React from 'react';
import { View, StyleSheet, ScrollView, Text, SafeAreaView } from 'react-native';
import { Button } from '@/components/ui';
import { Layout } from '@/components/ui/Layout';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { theme } from '@/constants';
import { colors, typography, spacing, radius, htmlEffects } from '@/constants/DesignTokens';

export default function TimerScreen() {
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit', 
    day: '2-digit',
    weekday: 'short'
  });

  return (
    <Layout
      title="Tarot Timer"
      subtitle={today}
      gradient={true}
    >
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        
        {/* 헤더 - HTML 디자인과 일치 */}
        <View style={styles.header}>
          {/* 타로카드 아이콘 SVG 대신 이모지 */}
          <Text style={styles.appIcon}>🔮</Text>
          <Text style={styles.title}>Tarot Timer</Text>
          <Text style={styles.subtitle}>24시간 타로 여정을 시작하세요</Text>
        </View>

        {/* Initial State - HTML 디자인 그대로 */}
        <View style={styles.initialState}>
          <View style={styles.mainCard}>
            <View style={styles.cardContent}>
              {/* 3장 카드 아이콘 */}
              <Text style={styles.cardsIcon}>🃏</Text>
              <Text style={styles.mainTitle}>24시간의 신비로운 여정</Text>
              <Text style={styles.mainDescription}>
                하루 24시간, 각 시간마다의 특별한 메시지를 담은 타로카드를 뽑아보세요.
              </Text>
            </View>
            
            {/* 메인 액션 버튼 - HTML의 gradient button */}
            <Button
              title="24시간 타로 뽑기"
              variant="primary"
              size="large"
              onPress={() => console.log('24시간 타로 뽑기 clicked')}
              style={styles.drawCardsButton}
            />
          </View>
        </View>

      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  
  // HTML 헤더 스타일 - text-center space-y-4
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  appIcon: {
    fontSize: 48,
    marginBottom: spacing.sm,
  },
  // display-large text-gradient-mystical
  title: {
    ...typography.styles.displayLarge,
    color: colors.primary.light, // HTML 그라디언트 효과 단색으로 대체
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  // body-small text-white/70
  subtitle: {
    ...typography.styles.bodySmall,
    color: colors.text.secondary,
    textAlign: 'center',
  },

  // Initial State 컨테이너 - space-y-8
  initialState: {
    width: '100%',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  
  // HTML: bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6
  mainCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: colors.card.background,
    borderWidth: 1,
    borderColor: colors.card.border,
    borderRadius: radius['2xl'],
    padding: spacing.xl,
    alignItems: 'center',
  },
  
  cardContent: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  
  // 3장 카드 아이콘 - h-16 w-16 mx-auto text-yellow-400
  cardsIcon: {
    fontSize: 64,
    color: colors.primary.mystical,
    marginBottom: spacing.md,
  },
  
  // title-large text-white
  mainTitle: {
    ...typography.styles.titleLarge,
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  
  // body-medium text-white/70 max-w-sm mx-auto
  mainDescription: {
    ...typography.styles.bodyMedium,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: typography.styles.bodyMedium.lineHeight * 1.2,
    maxWidth: 280, // max-w-sm 근사치
  },
  
  // HTML: bg-gradient-to-r from-yellow-400 to-yellow-500 ... animate-mystical-pulse
  drawCardsButton: {
    width: '100%',
    backgroundColor: colors.primary.mystical,
  },
});