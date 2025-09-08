import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { GradientBackground, MysticalButton, TimeDisplay, TarotCard } from '../components/ui';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, typography } from '../utils/styles';
import { getCurrentHourCard } from '../data/tarotSystem';
import { getCurrentHourCardImage } from '../utils/cardImages';

export const TimerScreen: React.FC = () => {
  const { colors, isDark } = useTheme();
  const [cardsDrawn, setCardsDrawn] = useState(false);
  const [currentCard, setCurrentCard] = useState<any>(null);


  const handleDrawCards = () => {
    const card = getCurrentHourCard();
    const cardImage = getCurrentHourCardImage();
    setCurrentCard({ ...card, image: cardImage });
    setCardsDrawn(true);
  };

  const renderInitialState = () => (
    <View style={styles.initialStateContainer}>
      <View style={styles.welcomeCard}>
        <View style={styles.iconContainer}>
          <Ionicons name="albums" size={64} color={colors.accent} />
        </View>
        <Text style={styles.welcomeTitle}>24시간의 신비로운 여정</Text>
        <Text style={styles.welcomeDescription}>
          하루 24시간, 각 시간마다의 특별한 메시지를 담은 타로카드를 뽑아보세요.
        </Text>
        
        <MysticalButton
          onPress={handleDrawCards}
          style={styles.drawButton}
        >
          24시간 타로 뽑기
        </MysticalButton>
      </View>
    </View>
  );

  const renderCardsDrawnState = () => (
    <View style={styles.cardsDrawnContainer}>
      {/* Time Display */}
      <TimeDisplay style={styles.timeDisplay} />

      {/* Current Card Display */}
      <View style={styles.currentCardContainer}>
        <TarotCard 
          cardName={currentCard?.name || '타로 카드'}
          cardMeaning={currentCard?.description || '카드 설명'}
          cardImage={currentCard?.image}
          isFlipped={true}
          showImage={true}
          size="large"
          onPress={() => {}}
          style={{ marginBottom: spacing.lg }}
        />
        
        {/* Card Details */}
        {currentCard && (
          <View style={styles.cardDetails}>
            <View style={styles.cardKeywords}>
              {currentCard.keywords.map((keyword: string, index: number) => (
                <View key={index} style={styles.keywordTag}>
                  <Text style={styles.keywordText}>{keyword}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.cardAdvice}>
              <Text style={styles.adviceLabel}>오늘의 조언</Text>
              <Text style={styles.adviceText}>{currentCard.advice}</Text>
            </View>
          </View>
        )}
        
        <View style={styles.cardActions}>
          <MysticalButton 
            variant="secondary"
            onPress={() => setCardsDrawn(false)}
          >
            다시 뽑기
          </MysticalButton>
        </View>
      </View>
    </View>
  );

  const styles = createStyles(colors);

  return (
    <GradientBackground>
      <StatusBar style={isDark ? "light" : "dark"} />
      <SafeAreaView style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="timer" size={48} color={colors.accent} />
            </View>
            <Text style={styles.title}>Tarot Timer</Text>
            <Text style={styles.subtitle}>24시간 타로 여정을 시작하세요</Text>
          </View>

          {/* Content */}
          {!cardsDrawn ? renderInitialState() : renderCardsDrawnState()}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  headerIcon: {
    marginBottom: 16,
  },
  title: {
    ...(typography.displayLarge as any),
    color: colors.foreground,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    ...(typography.bodySmall as any),
    color: colors.secondaryForeground,
    textAlign: 'center',
  },
  
  // Initial State Styles
  initialStateContainer: {
    alignItems: 'center',
  },
  welcomeCard: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    marginBottom: spacing.lg,
  },
  welcomeTitle: {
    ...(typography.titleLarge as any),
    color: colors.foreground,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  welcomeDescription: {
    ...(typography.bodyMedium as any),
    color: colors.secondaryForeground,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: spacing.xl,
  },
  drawButton: {
    width: '100%',
  },
  
  // Cards Drawn State Styles
  cardsDrawnContainer: {
    gap: spacing.xl,
  },
  timeDisplay: {
    marginBottom: spacing.lg,
  },
  currentCardContainer: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    padding: spacing.xl,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
  },
  
  // Card Details Styles
  cardDetails: {
    width: '100%',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  cardKeywords: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  keywordTag: {
    backgroundColor: `${colors.accent}20`,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  keywordText: {
    ...(typography.bodyMedium as any),
    color: colors.accent,
    fontWeight: '600' as const,
  },
  cardAdvice: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.lg,
  },
  adviceLabel: {
    ...(typography.titleMedium as any),
    color: colors.accent,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  adviceText: {
    ...(typography.bodyLarge as any),
    color: colors.foreground,
    textAlign: 'center',
    lineHeight: 22,
  },
});