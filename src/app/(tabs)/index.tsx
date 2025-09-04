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
        
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.appTitle}>🔮</Text>
          <Text style={styles.title}>Tarot Timer</Text>
          <Text style={styles.date}>{today}</Text>
        </View>

        {/* 메인 카드 */}
        <Card variant="premium" size="large" style={styles.mainCard}>
          <CardContent>
            <View style={styles.cardContent}>
              <Text style={styles.iconLarge}>⚡</Text>
              <Text style={styles.mainText}>운명을 받아보세요</Text>
              <Text style={styles.subText}>
                오늘 하루 각 시간에 조리는 우주의 에너지를 받아서 세요
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* 메인 액션 버튼 */}
        <Button
          title="⚡ 24시간 타로 뽑기"
          variant="primary"
          size="large"
          onPress={() => console.log('타로 뽑기 clicked')}
          style={styles.mainButton}
        />

        {/* 하단 메시지 */}
        <Card variant="elevated" size="medium" style={styles.bottomCard}>
          <CardContent>
            <Text style={styles.bottomText}>
              "매 순간마다 우주의 메시지가 와닿니다. 마음을 열고 저를를 받아들이세요."
            </Text>
          </CardContent>
        </Card>

      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  appTitle: {
    fontSize: 48,
    marginBottom: theme.spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  date: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },

  mainCard: {
    width: '100%',
    maxWidth: 320,
    marginBottom: theme.spacing.xl,
  },
  cardContent: {
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  iconLarge: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
    color: theme.colors.premiumGold,
  },
  mainText: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  subText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  mainButton: {
    width: '100%',
    maxWidth: 320,
    marginBottom: theme.spacing.xl,
  },

  bottomCard: {
    width: '100%',
    maxWidth: 320,
  },
  bottomText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
});