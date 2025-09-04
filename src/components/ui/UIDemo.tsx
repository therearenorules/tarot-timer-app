import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { 
  Layout, 
  Card, 
  CardHeader, 
  CardContent, 
  Button, 
  Text, 
  TabBar,
  ContentSection,
} from '@/components/ui';
import { theme } from '@/constants';

/**
 * Demo component to test the new UI layer
 * Showcases all new components with design reference styling
 */
export function UIDemo() {
  const [activeTab, setActiveTab] = useState('timer');

  const tabItems = [
    {
      id: 'timer',
      title: 'Timer',
      titleKo: '타이머',
      icon: <Text style={styles.tabIcon}>⏰</Text>,
      activeIcon: <Text style={[styles.tabIcon, styles.tabIconActive]}>⏰</Text>,
    },
    {
      id: 'spread',
      title: 'Spread',
      titleKo: '스프레드',
      icon: <Text style={styles.tabIcon}>📋</Text>,
      activeIcon: <Text style={[styles.tabIcon, styles.tabIconActive]}>📋</Text>,
    },
    {
      id: 'diary',
      title: 'Diary',
      titleKo: '일기',
      icon: <Text style={styles.tabIcon}>📖</Text>,
      activeIcon: <Text style={[styles.tabIcon, styles.tabIconActive]}>📖</Text>,
    },
    {
      id: 'settings',
      title: 'Settings',
      titleKo: '설정',
      icon: <Text style={styles.tabIcon}>⚙️</Text>,
      activeIcon: <Text style={[styles.tabIcon, styles.tabIconActive]}>⚙️</Text>,
    },
  ];

  return (
    <Layout
      title="Tarot Timer"
      subtitle="2025년 9월 3일 수요일"
      gradient={true}
    >
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <ContentSection spacing="large">
          <Card variant="default" size="medium">
            <CardHeader 
              title="운명을 밝혀보세요"
              subtitle="오늘 하루 각 시간이 주는 우주의 메시지를 발견해보세요"
            />
            <CardContent>
              <Button
                title="24시간 타로 뽑기"
                variant="primary"
                size="large"
                icon={<Text style={styles.buttonIcon}>⚡</Text>}
                style={styles.primaryButton}
                onPress={() => console.log('24시간 타로 뽑기')}
              />
            </CardContent>
          </Card>
        </ContentSection>

        <ContentSection spacing="medium">
          <Text variant="body" color={theme.colors.textSecondary} style={styles.quote}>
            "매 순간마다 우주의 메시지가 있습니다. 마음을 열고 지혜를 받아들이세요."
          </Text>
        </ContentSection>

        <ContentSection spacing="medium">
          <Card variant="elevated" size="medium">
            <CardHeader title="현재 시간" subtitle="오후 3시" />
            <CardContent>
              <View style={styles.cardImagePlaceholder}>
                <Text style={styles.cardName}>지팡이 6</Text>
                <Text style={styles.cardSubtitle}>6 of Wands</Text>
                <Text variant="caption" color={theme.colors.textSecondary} style={styles.cardDescription}>
                  지팡이 6은 지혜이 영역에서의 진전과 발전을 나타냅니다.
                </Text>
              </View>
              
              <View style={styles.cardActions}>
                <Button
                  title="해석"
                  variant="secondary"
                  size="small"
                  style={styles.actionButton}
                  onPress={() => console.log('해석')}
                />
                <Button
                  title="음료마"
                  variant="secondary"
                  size="small"
                  style={styles.actionButton}
                  onPress={() => console.log('음료마')}
                />
                <Button
                  title="진성"
                  variant="secondary"
                  size="small"
                  style={styles.actionButton}
                  onPress={() => console.log('진성')}
                />
              </View>
            </CardContent>
          </Card>
        </ContentSection>

        <ContentSection spacing="medium">
          <Card variant="premium" size="medium" glowEffect>
            <CardHeader title="3카드" subtitle="Three Card Spread" />
            <CardContent>
              <View style={styles.spreadRow}>
                <Text variant="body" color={theme.colors.textSecondary}>
                  과거, 현재, 미래
                </Text>
              </View>
              <Button
                title="리딩 시작하기"
                variant="premium"
                size="medium"
                icon={<Text style={styles.buttonIcon}>⚡</Text>}
                glowEffect
                onPress={() => console.log('리딩 시작하기')}
              />
            </CardContent>
          </Card>
        </ContentSection>

        <ContentSection spacing="large">
          <Card variant="mystical" size="medium">
            <CardHeader title="설정" subtitle="당신의 선비류를 참멸을 맞출하셔야요" />
            <CardContent>
              <View style={styles.settingRow}>
                <Text variant="body" color={theme.colors.text}>
                  프리미엄 멤버십
                </Text>
                <Button
                  title="현재의"
                  variant="ghost"
                  size="small"
                  onPress={() => console.log('현재의')}
                />
              </View>
            </CardContent>
          </Card>
        </ContentSection>

        {/* Add some bottom padding for tab bar */}
        <View style={styles.bottomPadding} />
      </ScrollView>

      <TabBar
        items={tabItems}
        activeTab={activeTab}
        onTabPress={setActiveTab}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  quote: {
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: theme.spacing.lg,
  },
  primaryButton: {
    marginTop: theme.spacing.md,
  },
  cardImagePlaceholder: {
    backgroundColor: theme.colors.backgroundTertiary,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    minHeight: 120,
    justifyContent: 'center',
  },
  cardName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  cardSubtitle: {
    fontSize: 14,
    color: theme.colors.premiumGold,
    marginBottom: theme.spacing.sm,
  },
  cardDescription: {
    textAlign: 'center',
    lineHeight: 18,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  spreadRow: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonIcon: {
    fontSize: 16,
    color: theme.colors.deepPurple,
  },
  tabIcon: {
    fontSize: 20,
    color: theme.colors.textSecondary,
  },
  tabIconActive: {
    color: theme.colors.premiumGold,
  },
  bottomPadding: {
    height: theme.spacing.xxl,
  },
});