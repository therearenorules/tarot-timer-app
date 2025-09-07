/**
 * Home Screen - 24시간 타로 타이머 메인 화면
 * HTML 데모 home-preview.html 완벽 재현
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { Layout } from '@/components/ui/Layout';
import { colors, typography, spacing, radius } from '@/constants/DesignTokens';

export default function HomeScreen() {
  const [currentHour, setCurrentHour] = useState(14);
  const [selectedHour, setSelectedHour] = useState(14);
  const [memo, setMemo] = useState('오후의 햇살이 따뜻하게 느껴집니다. 카드가 말하는 새로운 관점이 무엇인지 궁금해집니다.');
  const [timeUntilNext, setTimeUntilNext] = useState('23:47');

  // 시간별 메시지 배열
  const messages = [
    '새로운 시작과 가능성이 열리는 시간입니다.',
    '직관을 믿고 내면의 목소리에 귀 기울여보세요.',
    '균형과 조화를 찾는 것이 중요한 시간입니다.',
    '창조적인 에너지가 흐르는 시간입니다.',
    '안정과 실용성을 추구하는 시간입니다.',
    '소통과 관계에 집중하는 시간입니다.',
    '선택의 기로에서 지혜로운 결정을 내려야 하는 시간입니다.',
    '의지력과 결단력이 필요한 시간입니다.',
    '내면의 힘을 발견하는 시간입니다.',
    '성찰과 내적 탐구의 시간입니다.',
    '변화와 전환점을 맞이하는 시간입니다.',
    '공정함과 균형을 추구하는 시간입니다.',
    '새로운 관점으로 상황을 바라보는 시간입니다.',
    '변화에 적응하고 유연성을 발휘하는 시간입니다.',
    '절제와 인내가 필요한 시간입니다.',
    '해방과 자유를 추구하는 시간입니다.',
    '영감과 통찰이 찾아오는 시간입니다.',
    '환상을 걷어내고 진실을 마주하는 시간입니다.',
    '희망과 치유의 에너지가 흐르는 시간입니다.',
    '각성과 새로운 깨달음의 시간입니다.',
    '완성과 성취를 향해 나아가는 시간입니다.',
    '모든 경험이 통합되는 시간입니다.',
    '하루의 마무리와 반성의 시간입니다.',
    '내일을 위한 준비와 휴식의 시간입니다.'
  ];

  // 메모 통계
  const memoWords = memo.trim() ? memo.trim().split(/\s+/).length : 0;
  const memoChars = memo.length;

  const selectHour = (hour: number) => {
    if (hour <= currentHour) {
      setSelectedHour(hour);
    }
  };

  const renderHourCard = (hour: number) => {
    const isRevealed = hour <= currentHour;
    const isCurrent = hour === currentHour;
    const isSelected = hour === selectedHour;
    const isFuture = hour > currentHour;

    return (
      <TouchableOpacity
        key={hour}
        style={styles.cardContainer}
        onPress={() => selectHour(hour)}
        disabled={isFuture}
      >
        <View style={[
          styles.hourCard,
          isRevealed && styles.hourCardRevealed,
          isSelected && styles.hourCardSelected,
          isFuture && styles.hourCardFuture
        ]}>
          {isCurrent && <Text style={styles.currentIndicator}>NOW</Text>}
          {isRevealed ? (
            <View style={styles.cardContent}>
              <Text style={styles.cardEmoji}>{isCurrent ? '✨' : '🌟'}</Text>
              <Text style={styles.cardLabel}>{isCurrent ? 'Current' : `Card ${hour}`}</Text>
            </View>
          ) : (
            <Text style={styles.cardPlaceholder}>?</Text>
          )}
        </View>
        <Text style={[
          styles.hourLabel,
          isCurrent && styles.hourLabelCurrent,
          isSelected && styles.hourLabelSelected
        ]}>
          {hour.toString().padStart(2, '0')}:00
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 진행률 표시 */}
      <View style={styles.progressBar}>
        <Text style={styles.progressTitle}>🚀 Phase 2 진행중</Text>
        <Text style={styles.progressText}>홈 화면 구현 - HTML 디자인 완벽 재현</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>🔮 오늘의 타로</Text>
          <View style={styles.timerWidget}>
            <Text style={styles.timerLabel}>다음 카드까지</Text>
            <Text style={styles.timerTime}>{timeUntilNext}</Text>
          </View>
        </View>

        {/* 선택된 카드 정보 */}
        <View style={styles.selectedCardInfo}>
          <Text style={styles.selectedCardTitle}>
            {selectedHour.toString().padStart(2, '0')}:00 시간
          </Text>
          <Text style={styles.selectedCardDescription}>
            {messages[selectedHour]}
          </Text>
        </View>

        {/* 24시간 카드 스크롤 */}
        <View style={styles.cardsSection}>
          <Text style={styles.sectionTitle}>24시간 타로 타이머</Text>
          <ScrollView
            horizontal
            style={styles.cardsContainer}
            contentContainerStyle={styles.cardsContent}
            showsHorizontalScrollIndicator={false}
          >
            {Array.from({ length: 24 }, (_, i) => renderHourCard(i))}
          </ScrollView>
        </View>

        {/* 메모 영역 */}
        <View style={styles.memoSection}>
          <Text style={styles.sectionTitle}>
            {selectedHour.toString().padStart(2, '0')}:00 메모
          </Text>
          <View style={styles.memoContainer}>
            <TextInput
              style={styles.memoTextarea}
              placeholder={`${selectedHour}시의 느낌과 생각을 기록해보세요...`}
              placeholderTextColor={colors.text.tertiary}
              value={memo}
              onChangeText={setMemo}
              multiline
              maxLength={500}
            />
            <View style={styles.memoFooter}>
              <Text style={styles.memoCount}>
                {memoWords} words • {memoChars}/500 chars
              </Text>
              <TouchableOpacity style={styles.memoSave}>
                <Text style={styles.memoSaveText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 오늘의 통계 */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>15</Text>
            <Text style={styles.statLabel}>공개된 카드</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>9</Text>
            <Text style={styles.statLabel}>남은 카드</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>작성한 메모</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  progressBar: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 55, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#d4af37',
    marginBottom: 4,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#d4af37',
  },
  timerWidget: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: '#d4af37',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    minWidth: 100,
  },
  timerLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 5,
  },
  timerTime: {
    fontFamily: 'monospace',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#d4af37',
  },
  selectedCardInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 30,
  },
  selectedCardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#d4af37',
    marginBottom: 8,
  },
  selectedCardDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 24,
  },
  cardsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
    marginBottom: 16,
  },
  cardsContainer: {
    marginHorizontal: -20,
  },
  cardsContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  cardContainer: {
    alignItems: 'center',
    minWidth: 80,
  },
  hourCard: {
    width: 80,
    height: 120,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  hourCardRevealed: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderColor: '#d4af37',
  },
  hourCardSelected: {
    borderColor: '#d4af37',
    shadowColor: '#d4af37',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  hourCardFuture: {
    opacity: 0.5,
  },
  currentIndicator: {
    position: 'absolute',
    top: 4,
    fontSize: 10,
    fontWeight: 'bold',
    color: '#d4af37',
  },
  cardContent: {
    alignItems: 'center',
  },
  cardEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  cardPlaceholder: {
    fontSize: 32,
    color: 'rgba(255, 255, 255, 0.3)',
    fontWeight: 'bold',
  },
  hourLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  hourLabelCurrent: {
    color: '#d4af37',
    fontWeight: 'bold',
  },
  hourLabelSelected: {
    color: '#d4af37',
  },
  memoSection: {
    marginBottom: 30,
  },
  memoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
  },
  memoTextarea: {
    minHeight: 100,
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: 'top',
  },
  memoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  memoCount: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  memoSave: {
    backgroundColor: '#d4af37',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  memoSaveText: {
    color: 'black',
    fontWeight: '600',
    fontSize: 14,
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#d4af37',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 16,
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