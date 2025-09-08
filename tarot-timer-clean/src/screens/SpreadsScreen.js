import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { GradientBackground, TarotCard, MysticalButton } from '../components/ui';
import { colors, gradients } from '../utils/colors';
import { spacing, typography, borderRadius, shadows } from '../utils/styles';
import { getMultipleCards } from '../data/tarotSystem';

const TAROT_SPREADS = {
  daily: {
    name: '데일리 카드',
    description: '오늘의 메시지를 담은 한 장의 카드',
    cardCount: 1,
    positions: ['오늘의 메시지']
  },
  threePath: {
    name: '3장 스프레드',
    description: '과거, 현재, 미래를 보여주는 스프레드',
    cardCount: 3,
    positions: ['과거', '현재', '미래']
  },
  situation: {
    name: '상황 분석',
    description: '현재 상황과 해결책을 제시하는 스프레드',
    cardCount: 3,
    positions: ['현재 상황', '�숨겨진 요소', '해결책']
  },
  love: {
    name: '연애 운세',
    description: '연애와 관련된 다양한 측면을 보여주는 스프레드',
    cardCount: 4,
    positions: ['나의 마음', '상대의 마음', '관계의 현재', '앞으로의 전망']
  }
};

const TAROT_CARDS = [
  { name: '바보', meaning: '새로운 시작과 순수한 마음' },
  { name: '마법사', meaning: '의지력과 창조적 능력' },
  { name: '여사제', meaning: '직관과 내면의 지혜' },
  { name: '여황제', meaning: '풍요로움과 어머니의 사랑' },
  { name: '황제', meaning: '권위와 안정적인 구조' },
  { name: '교황', meaning: '전통과 영적 지도' },
  { name: '연인', meaning: '사랑과 선택의 갈래' },
  { name: '전차', meaning: '의지력과 승리' },
  { name: '힘', meaning: '내면의 힘과 용기' },
  { name: '은자', meaning: '내적 성찰과 고독' },
  { name: '운명의 수레바퀴', meaning: '변화와 운명의 순환' },
  { name: '정의', meaning: '균형과 공정함' },
  { name: '매달린 사람', meaning: '희생과 새로운 관점' },
  { name: '죽음', meaning: '변화와 재생' },
  { name: '절제', meaning: '조화와 균형' },
  { name: '악마', meaning: '유혹과 속박' },
  { name: '탑', meaning: '충격과 깨달음' },
  { name: '별', meaning: '희망과 영감' },
  { name: '달', meaning: '환상과 무의식' },
  { name: '태양', meaning: '성공과 기쁨' },
  { name: '심판', meaning: '재생과 각성' },
  { name: '세계', meaning: '완성과 성취' }
];

export const SpreadsScreen = () => {
  const [selectedSpread, setSelectedSpread] = useState(null);
  const [drawnCards, setDrawnCards] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleSelectSpread = (spreadKey) => {
    setSelectedSpread(spreadKey);
    setDrawnCards([]);
  };

  const handleDrawCards = () => {
    if (!selectedSpread) return;

    setIsDrawing(true);
    const spread = TAROT_SPREADS[selectedSpread];
    const selectedCards = getMultipleCards(spread.cardCount);

    // Simulate drawing animation delay
    setTimeout(() => {
      setDrawnCards(selectedCards);
      setIsDrawing(false);
    }, 1500);
  };

  const handleReset = () => {
    setSelectedSpread(null);
    setDrawnCards([]);
    setIsDrawing(false);
  };

  const renderSpreadSelection = () => (
    <View style={styles.spreadSelection}>
      <Text style={styles.sectionTitle}>스프레드를 선택하세요</Text>
      <Text style={styles.sectionDescription}>
        원하는 타로 스프레드를 선택해서 카드를 뽑아보세요
      </Text>

      <View style={styles.spreadGrid}>
        {Object.entries(TAROT_SPREADS).map(([key, spread]) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.spreadCard,
              selectedSpread === key && styles.spreadCardSelected
            ]}
            onPress={() => handleSelectSpread(key)}
            activeOpacity={0.8}
          >
            <View style={styles.spreadHeader}>
              <Text style={styles.spreadName}>{spread.name}</Text>
              <Text style={styles.spreadCount}>{spread.cardCount}장</Text>
            </View>
            <Text style={styles.spreadDescription}>{spread.description}</Text>
            
            <View style={styles.positionsList}>
              {spread.positions.map((position, index) => (
                <View key={index} style={styles.positionItem}>
                  <Text style={styles.positionText}>• {position}</Text>
                </View>
              ))}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {selectedSpread && (
        <View style={styles.actionSection}>
          <MysticalButton
            onPress={handleDrawCards}
            style={styles.drawButton}
            variant="primary"
            size="large"
            disabled={isDrawing}
          >
            {isDrawing ? '카드를 뽑고 있습니다...' : '카드 뽑기'}
          </MysticalButton>
        </View>
      )}
    </View>
  );

  const renderDrawnCards = () => {
    const spread = TAROT_SPREADS[selectedSpread];

    return (
      <View style={styles.drawnCardsContainer}>
        <View style={styles.spreadHeader}>
          <Text style={styles.spreadTitle}>{spread.name}</Text>
          <Text style={styles.spreadSubtitle}>{spread.description}</Text>
        </View>

        <ScrollView 
          style={styles.cardsScrollView}
          contentContainerStyle={styles.cardsContainer}
          showsVerticalScrollIndicator={false}
        >
          {drawnCards.map((card, index) => (
            <View key={index} style={styles.cardPosition}>
              <Text style={styles.positionLabel}>
                {spread.positions[index]}
              </Text>
              
              <TarotCard
                cardName={card.name}
                cardMeaning={card.description}
                isFlipped={true}
                size="medium"
                style={styles.positionCard}
              />
              
              <View style={styles.cardExtraInfo}>
                <Text style={styles.cardAdvice}>{card.advice}</Text>
                <View style={styles.cardKeywords}>
                  {card.keywords?.slice(0, 2).map((keyword, kidx) => (
                    <Text key={kidx} style={styles.keywordText}>#{keyword}</Text>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </ScrollView>

        <View style={styles.resultsActions}>
          <MysticalButton
            variant="secondary"
            size="medium"
            onPress={handleReset}
            style={styles.resetButton}
          >
            다시 뽑기
          </MysticalButton>
        </View>
      </View>
    );
  };

  return (
    <GradientBackground>
      <StatusBar style="light" />
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <Ionicons name="albums" size={48} color={colors.dark.accent} />
          </View>
          <Text style={styles.title}>타로 스프레드</Text>
          <Text style={styles.subtitle}>다양한 스프레드로 운세를 확인하세요</Text>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {drawnCards.length > 0 ? renderDrawnCards() : renderSpreadSelection()}
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerIcon: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.displayLarge,
    color: colors.dark.accent,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.bodyMedium,
    color: colors.dark.secondaryForeground,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },

  // Spread Selection Styles
  spreadSelection: {
    flex: 1,
  },
  sectionTitle: {
    ...typography.titleLarge,
    color: colors.dark.foreground,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  sectionDescription: {
    ...typography.bodyMedium,
    color: colors.dark.secondaryForeground,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  spreadGrid: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  spreadCard: {
    backgroundColor: colors.dark.card,
    borderWidth: 1,
    borderColor: colors.dark.border,
    borderRadius: borderRadius.large,
    padding: spacing.lg,
    ...shadows.medium,
  },
  spreadCardSelected: {
    borderColor: colors.dark.accent,
    backgroundColor: `${colors.dark.accent}15`,
    ...shadows.mysticalGlow,
  },
  spreadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  spreadName: {
    ...typography.titleMedium,
    color: colors.dark.foreground,
    flex: 1,
  },
  spreadCount: {
    ...typography.bodyMedium,
    color: colors.dark.accent,
    fontWeight: 'bold',
    backgroundColor: `${colors.dark.accent}20`,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.small,
  },
  spreadDescription: {
    ...typography.bodyMedium,
    color: colors.dark.secondaryForeground,
    marginBottom: spacing.md,
  },
  positionsList: {
    gap: spacing.xs,
  },
  positionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  positionText: {
    ...typography.bodyMedium,
    color: colors.dark.secondaryForeground,
  },
  actionSection: {
    paddingVertical: spacing.lg,
  },
  drawButton: {
    width: '100%',
  },

  // Drawn Cards Styles
  drawnCardsContainer: {
    flex: 1,
  },
  spreadTitle: {
    ...typography.titleLarge,
    color: colors.dark.accent,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  spreadSubtitle: {
    ...typography.bodyMedium,
    color: colors.dark.secondaryForeground,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  cardsScrollView: {
    flex: 1,
  },
  cardsContainer: {
    gap: spacing.xl,
    paddingBottom: spacing.xl,
  },
  cardPosition: {
    alignItems: 'center',
  },
  positionLabel: {
    ...typography.titleMedium,
    color: colors.dark.accent,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  positionCard: {
    marginBottom: spacing.sm,
  },
  resultsActions: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },
  resetButton: {
    minWidth: 120,
  },
  cardExtraInfo: {
    alignItems: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
  cardAdvice: {
    ...typography.bodyMedium,
    color: colors.dark.secondaryForeground,
    textAlign: 'center',
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  cardKeywords: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  keywordText: {
    ...typography.caption,
    color: colors.dark.accent,
    fontWeight: 'bold',
  },
});