/**
 * Timer Screen - 24시간 타로 카드 타이머 메인 화면
 * Context API를 사용한 상태 관리 적용
 */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Screen, Text, Button } from '@/components';
import { TimerDisplay, HourStrip, MysticalBackground, TarotCard } from '@/components/ui';
import { theme } from '@/constants';
import { 
  useTarotSession, 
  useTarotSessionState, 
  useTarotSessionActions, 
  useCurrentCard 
} from '@/contexts';

export default function TimerScreen() {
  const { state } = useTarotSession();
  const { initializeSession, revealCard, refreshSession } = useTarotSessionActions();
  const { currentCard, currentHour } = useCurrentCard();
  const [isInitializing, setIsInitializing] = useState(false);
  
  // 카드 공개 핸들러 메모화
  const handleRevealCard = useCallback(async () => {
    if (currentCard && !currentCard.isRevealed) {
      try {
        await revealCard(currentHour);
        Alert.alert('카드 공개', `${currentHour}시의 카드가 공개되었습니다!`);
      } catch (error) {
        Alert.alert('오류', '카드를 공개할 수 없습니다.');
      }
    }
  }, [currentCard, currentHour, revealCard]);

  // 세션 새로고침 핸들러 메모화
  const handleRefresh = useCallback(async () => {
    try {
      await refreshSession();
      Alert.alert('새로고침 완료', '세션이 업데이트되었습니다.');
    } catch (error) {
      Alert.alert('오류', '세션을 새로고침할 수 없습니다.');
    }
  }, [refreshSession]);

  // 시간 네비게이션 핸들러 메모화
  const handleHourSelect = useCallback((hour: number) => {
    if (hour <= currentHour) {
      // 과거 시간의 카드는 볼 수 있음
    } else {
      Alert.alert('알림', '아직 그 시간이 되지 않았습니다.');
    }
  }, [currentHour]);

  // 카드 데이터 메모화
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

  // 시간 데이터 메모화
  const hourData = useMemo(() => 
    state.hourCards.map(card => ({
      hour: card.hour,
      isRevealed: card.isRevealed,
      cardName: card.isRevealed ? card.cardName : '미공개',
      keywords: card.isRevealed ? card.keywords : [],
      memo: card.memo,
      hasMemo: Boolean(card.memo),
      isCurrentHour: card.hour === currentHour
    })), [state.hourCards, currentHour]);

  // 초기화
  useEffect(() => {
    if (!state.isSessionActive && !isInitializing) {
      setIsInitializing(true);
      initializeSession()
        .then(() => {
          console.log('✅ Timer screen session initialized');
        })
        .catch((error) => {
          console.error('❌ Timer screen initialization failed:', error);
          Alert.alert('초기화 실패', '타로 세션을 시작할 수 없습니다.');
        })
        .finally(() => {
          setIsInitializing(false);
        });
    }
  }, [state.isSessionActive, initializeSession, isInitializing]);


  // 로딩 상태
  if (state.isLoading || isInitializing) {
    return (
      <Screen>
        <View style={styles.centerContent}>
          <Text variant="h3">타로 세션을 준비하는 중...</Text>
        </View>
      </Screen>
    );
  }

  // 에러 상태
  if (state.error) {
    return (
      <Screen>
        <View style={styles.centerContent}>
          <Text variant="h3" color={theme.colors.error}>
            오류가 발생했습니다
          </Text>
          <Text variant="body" color={theme.colors.textSecondary} style={styles.errorText}>
            {state.error}
          </Text>
          <Button
            title="다시 시도"
            onPress={handleRefresh}
            style={styles.retryButton}
            variant="primary"
          />
        </View>
      </Screen>
    );
  }

  return (
    <View style={styles.container}>
      {/* 신비로운 배경 */}
      <MysticalBackground
        variant="aurora"
        timeBasedColors={true}
        currentHour={currentHour}
        enableParticles={true}
        particleCount={30}
      />

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* 타이머 디스플레이 */}
        <View style={styles.timerSection}>
          <TimerDisplay
            variant="mystical"
            size="large"
            timeBasedColors={true}
            onMidnight={handleRefresh}
            showSeconds={true}
          />
          
          <View style={styles.progressInfo}>
            <Text variant="caption" color={theme.colors.textSecondary}>
              진행률: {state.completionRate}% ({state.totalRevealed}/24 카드)
            </Text>
          </View>
        </View>

        {/* 현재 시간 카드 */}
        <View style={styles.currentCardSection}>
          <Text variant="h3" style={styles.sectionTitle}>
            {currentHour}시의 카드
          </Text>
          
          {currentCard ? (
            <View style={styles.cardContainer}>
              <TarotCard
                card={currentCardData!}
                size="large"
                state={currentCard.isRevealed ? 'face-up' : 'face-down'}
                interactive={!currentCard.isRevealed}
                {...(!currentCard.isRevealed && { onFlip: () => { handleRevealCard(); } })}
                glowIntensity="normal"
              />
              
              {!currentCard.isRevealed && (
                <Button
                  title="카드 공개하기"
                  onPress={handleRevealCard}
                  style={styles.revealButton}
                  variant="primary"
                />
              )}
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Text variant="body" color={theme.colors.textSecondary}>
                현재 시간의 카드를 준비하는 중...
              </Text>
            </View>
          )}
        </View>

        {/* 24시간 스트립 */}
        <View style={styles.hourStripSection}>
          <Text variant="h3" style={styles.sectionTitle}>
            24시간 타로 여정
          </Text>
          
          <HourStrip
            hours={hourData}
            currentHour={currentHour}
            onHourSelect={handleHourSelect}
            showCardPreviews={true}
            snapToHour={true}
          />
        </View>

        {/* 세션 정보 */}
        {state.isSessionActive && (
          <View style={styles.sessionInfo}>
            <Text variant="caption" color={theme.colors.textSecondary}>
              세션 날짜: {state.sessionDate}
            </Text>
            <Text variant="caption" color={theme.colors.textSecondary}>
              세션 ID: {state.sessionId}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xl * 2,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  errorText: {
    textAlign: 'center',
    marginVertical: theme.spacing.md,
  },
  retryButton: {
    marginTop: theme.spacing.lg,
    minWidth: 120,
  },
  timerSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  progressInfo: {
    marginTop: theme.spacing.sm,
    alignItems: 'center',
  },
  currentCardSection: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    color: theme.colors.premiumGold,
  },
  cardContainer: {
    alignItems: 'center',
  },
  emptyCard: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.mystical.border,
    borderStyle: 'dashed',
  },
  revealButton: {
    marginTop: theme.spacing.lg,
    minWidth: 160,
  },
  hourStripSection: {
    marginBottom: theme.spacing.xl,
  },
  sessionInfo: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
});