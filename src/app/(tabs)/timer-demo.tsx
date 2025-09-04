/**
 * Timer Demo Screen - Showcasing New UI Layer
 * Enhanced version using the new UI components
 */

import React, { useCallback, useMemo } from 'react';
import { View, ScrollView, StyleSheet, Alert, Dimensions } from 'react-native';
import { 
  Layout, 
  ScreenHeader, 
  ContentSection,
  Card, 
  CardHeader, 
  CardContent,
  Button, 
  Text 
} from '@/components/ui';
import { TimerDisplay, TarotCard } from '@/components/ui';
import { SparklesIcon, ClockIcon } from '@/components/ui/Icon';
import { theme } from '@/constants';
import { 
  useTarotSession, 
  useCurrentCard 
} from '@/contexts';

const { width: screenWidth } = Dimensions.get('window');

export default function TimerDemoScreen() {
  const { state } = useTarotSession();
  const { currentCard, currentHour } = useCurrentCard();

  // Handlers
  const handleRevealCard = useCallback(async () => {
    if (currentCard && !currentCard.isRevealed) {
      Alert.alert('카드 공개', `${currentHour}시의 카드가 공개되었습니다!`);
    }
  }, [currentCard, currentHour]);

  const handleStart24HourReading = useCallback(() => {
    Alert.alert('24시간 타로 뽑기', '24시간 타로 리딩을 시작합니다!');
  }, []);

  const handleStartSpreadReading = useCallback(() => {
    Alert.alert('스프레드 리딩', '타로 스프레드 리딩을 시작합니다!');
  }, []);

  // Card data
  const currentCardData = useMemo(() => {
    if (!currentCard || !currentCard.isRevealed) return null;
    return {
      id: currentCard.cardKey || `card-${currentCard.hour}`,
      name: currentCard.cardName || 'Unknown Card',
      nameKr: currentCard.cardName || '알 수 없는 카드',
      description: currentCard.memo || 'This card represents your journey.',
      descriptionKr: currentCard.memo || '이 카드에 대한 당신의 해석을 기록해보세요.',
      keywords: currentCard.keywords || [],
      keywordsKr: currentCard.keywords || [],
      imageUrl: `cards/${currentCard.cardKey || 'back'}.jpg`
    };
  }, [currentCard]);

  // Format current time for display
  const currentTime = useMemo(() => {
    const hour = currentHour;
    const ampm = hour < 12 ? '오전' : '오후';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${ampm} ${displayHour}시`;
  }, [currentHour]);

  return (
    <Layout
      title="Tarot Timer"
      subtitle="2025년 9월 3일 수요일"
      gradient={true}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        
        {/* Welcome Section */}
        <ContentSection spacing="large">
          <Card variant="default" size="medium">
            <CardHeader>
              <View style={styles.welcomeHeader}>
                <Text variant="title2" color={theme.colors.text}>
                  🔮 운명을 밝혀보세요
                </Text>
                <Text variant="body" color={theme.colors.textSecondary} style={styles.welcomeSubtitle}>
                  오늘 하루 각 시간이 주는 우주의 메시지를 발견해보세요
                </Text>
              </View>
            </CardHeader>
            <CardContent>
              <Button
                title="⚡ 24시간 타로 뽑기"
                variant="primary"
                size="large"
                onPress={handleStart24HourReading}
                style={styles.primaryButton}
                glowEffect={true}
              />
            </CardContent>
          </Card>
        </ContentSection>

        {/* Mystical Quote */}
        <ContentSection spacing="medium">
          <Card variant="mystical" size="small" noPadding>
            <View style={styles.quoteContainer}>
              <Text variant="body" color={theme.colors.textSecondary} style={styles.quote}>
                "매 순간마다 우주의 메시지가 있습니다. 마음을 열고 지혜를 받아들이세요."
              </Text>
            </View>
          </Card>
        </ContentSection>

        {/* Current Time Card */}
        <ContentSection spacing="medium">
          <Card variant="elevated" size="medium">
            <CardHeader 
              title="현재 시간"
              subtitle={currentTime}
            />
            <CardContent>
              <View style={styles.timerContainer}>
                <View style={styles.timerChip}>
                  <ClockIcon size={16} color={theme.colors.premiumGold} />
                  <TimerDisplay
                    variant="mystical"
                    size="large"
                    timeBasedColors={true}
                    showSeconds={false}
                  />
                </View>
                
                <Text variant="caption" color={theme.colors.textSecondary} style={styles.progressText}>
                  진행률: {state?.completionRate || 0}% ({state?.totalRevealed || 0}/24 카드)
                </Text>
              </View>

              {/* Current Card Display */}
              {currentCard ? (
                <View style={styles.cardDisplayContainer}>
                  <TarotCard
                    card={currentCardData!}
                    size="medium"
                    state={currentCard.isRevealed ? 'face-up' : 'face-down'}
                    interactive={!currentCard.isRevealed}
                    {...(!currentCard.isRevealed && { onFlip: handleRevealCard })}
                    glowIntensity="normal"
                  />
                  
                  {currentCard.isRevealed && currentCard.cardName && (
                    <View style={styles.cardInfo}>
                      <Text variant="title3" color={theme.colors.text}>
                        {currentCard.cardName}
                      </Text>
                      {currentCard.memo && (
                        <Text variant="caption" color={theme.colors.textSecondary} style={styles.cardMemo}>
                          {currentCard.memo.length > 60 ? `${currentCard.memo.substring(0, 60)}...` : currentCard.memo}
                        </Text>
                      )}
                    </View>
                  )}
                  
                  {!currentCard.isRevealed && (
                    <View style={styles.cardActions}>
                      <Button
                        title="해석"
                        variant="secondary"
                        size="small"
                        style={styles.actionButton}
                      />
                      <Button
                        title="음료수"
                        variant="secondary"
                        size="small"
                        style={styles.actionButton}
                      />
                      <Button
                        title="진성"
                        variant="secondary"
                        size="small"
                        style={styles.actionButton}
                      />
                    </View>
                  )}
                </View>
              ) : (
                <View style={styles.noCardContainer}>
                  <Text variant="body" color={theme.colors.textSecondary}>
                    현재 시간의 카드를 준비하는 중...
                  </Text>
                </View>
              )}
            </CardContent>
          </Card>
        </ContentSection>

        {/* Spread Reading Section */}
        <ContentSection spacing="medium">
          <Card variant="premium" size="medium" glowEffect>
            <CardHeader>
              <View style={styles.spreadHeader}>
                <Text variant="title2" color={theme.colors.text}>
                  📋 3카드
                </Text>
                <Text variant="body" color={theme.colors.textSecondary}>
                  Three Card Spread
                </Text>
              </View>
            </CardHeader>
            <CardContent>
              <View style={styles.spreadInfo}>
                <Text variant="body" color={theme.colors.textSecondary} style={styles.spreadDescription}>
                  과거, 현재, 미래
                </Text>
              </View>
              <Button
                title="⚡ 리딩 시작하기"
                variant="premium"
                size="medium"
                onPress={handleStartSpreadReading}
                glowEffect={true}
                icon={<SparklesIcon size={20} color={theme.colors.deepPurple} />}
              />
            </CardContent>
          </Card>
        </ContentSection>

        {/* Settings Preview */}
        <ContentSection spacing="large">
          <Card variant="default" size="medium">
            <CardHeader 
              title="설정"
              subtitle="당신의 선비를 참멸을 맞춤하세요"
            />
            <CardContent>
              <View style={styles.settingRow}>
                <View>
                  <Text variant="body" color={theme.colors.text}>
                    프리미엄 멤버십
                  </Text>
                  <Text variant="caption" color={theme.colors.textSecondary}>
                    월상화, 집게손, 무역한 저장소
                  </Text>
                </View>
                <Button
                  title="활성화"
                  variant="secondary"
                  size="small"
                  style={styles.settingButton}
                />
              </View>

              <View style={[styles.settingRow, styles.settingRowBorder]}>
                <View>
                  <Text variant="body" color={theme.colors.text}>
                    🌙 화면 및 테마
                  </Text>
                  <Text variant="caption" color={theme.colors.textSecondary}>
                    다크 모드 - Always on for mystical experience
                  </Text>
                </View>
              </View>

              <View style={styles.settingRow}>
                <View>
                  <Text variant="body" color={theme.colors.text}>
                    🔔 알림
                  </Text>
                  <Text variant="caption" color={theme.colors.textSecondary}>
                    스프레드 완료 - 카드 리딩이 완료되면 알림
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </ContentSection>

        {/* Session Info */}
        {state?.isSessionActive && (
          <ContentSection spacing="large">
            <Card variant="default" size="small">
              <CardContent>
                <View style={styles.sessionInfo}>
                  <Text variant="caption" color={theme.colors.textTertiary}>
                    세션 날짜: {state.sessionDate}
                  </Text>
                  <Text variant="caption" color={theme.colors.textTertiary}>
                    세션 ID: {state.sessionId}
                  </Text>
                </View>
              </CardContent>
            </Card>
          </ContentSection>
        )}

      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  welcomeHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  welcomeSubtitle: {
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    lineHeight: 22,
  },
  primaryButton: {
    marginTop: theme.spacing.md,
  },
  quoteContainer: {
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  quote: {
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  timerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: `rgba(255, 215, 0, 0.1)`,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: `rgba(255, 215, 0, 0.3)`,
    marginBottom: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  progressText: {
    textAlign: 'center',
  },
  cardDisplayContainer: {
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  cardInfo: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  cardMemo: {
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    lineHeight: 16,
  },
  cardActions: {
    flexDirection: 'row',
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  noCardContainer: {
    alignItems: 'center',
    padding: theme.spacing.lg,
    marginTop: theme.spacing.md,
  },
  spreadHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  spreadInfo: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  spreadDescription: {
    textAlign: 'center',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  settingRowBorder: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.divider,
    marginVertical: theme.spacing.sm,
  },
  settingButton: {
    minWidth: 80,
  },
  sessionInfo: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
});