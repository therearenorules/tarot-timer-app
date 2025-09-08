/**
 * Spreads Screen - 스프레드 선택 및 실행 화면
 * HTML 데모 spread-preview.html 완벽 재현
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { colors, typography, spacing } from '@/constants/DesignTokens';

export default function SpreadsScreen() {
  const [selectedSpread, setSelectedSpread] = useState<string | null>(null);
  
  const spreads = [
    {
      id: 'one-card',
      name: '오늘의 한 장',
      description: '간단하고 명확한 하루의 메시지를 전달합니다. 오늘의 에너지와 주의사항을 알려줍니다.',
      cardCount: 1,
      difficulty: 'basic',
      icon: '🔮'
    },
    {
      id: 'three-card',
      name: '과거-현재-미래',
      description: '시간의 흐름 속에서 상황을 파악합니다. 과거의 영향, 현재 상황, 미래 가능성을 보여줍니다.',
      cardCount: 3,
      difficulty: 'intermediate',
      icon: '⏳'
    },
    {
      id: 'love-spread',
      name: '연애 운세',
      description: '사랑과 관계에 대한 깊은 통찰을 제공합니다. 상대방의 마음과 관계의 발전 방향을 알아봅니다.',
      cardCount: 5,
      difficulty: 'intermediate',
      icon: '💕'
    },
    {
      id: 'celtic-cross',
      name: '켈틱 크로스',
      description: '가장 포괄적인 스프레드입니다. 복잡한 상황을 다각도로 분석하여 완전한 그림을 그려줍니다.',
      cardCount: 10,
      difficulty: 'premium',
      icon: '✨'
    },
    {
      id: 'career-spread',
      name: '직업 운세',
      description: '커리어와 직업적 성장에 대한 조언을 제공합니다. 현재 상황과 발전 가능성을 살펴봅니다.',
      cardCount: 7,
      difficulty: 'premium',
      icon: '🚀'
    }
  ];

  const handleSpreadSelect = (spreadId: string) => {
    setSelectedSpread(spreadId);
    // TODO: 실제 스프레드 시작 로직
    console.log('선택된 스프레드:', spreadId);
  };

  const renderSpreadCard = (spread: any) => {
    const isPremium = spread.difficulty === 'premium';
    
    return (
      <TouchableOpacity
        key={spread.id}
        style={[
          styles.spreadCard,
          isPremium && styles.premiumSpreadCard
        ]}
        onPress={() => handleSpreadSelect(spread.id)}
      >
        <View style={styles.cardHeader}>
          <View style={[
            styles.cardIcon,
            isPremium && styles.premiumIcon
          ]}>
            <Text style={styles.cardIconText}>{spread.icon}</Text>
          </View>
          <View style={styles.cardTitleContainer}>
            <Text style={[
              styles.cardTitle,
              isPremium && styles.premiumTitle
            ]}>
              {spread.name}
              {isPremium && ' ✨'}
            </Text>
            <Text style={styles.cardSubtitle}>
              {spread.cardCount}장의 카드
            </Text>
          </View>
          {isPremium && (
            <Text style={styles.premiumBadge}>PREMIUM</Text>
          )}
        </View>
        
        <Text style={styles.cardDescription}>
          {spread.description}
        </Text>
        
        <View style={styles.cardFooter}>
          <Text style={[
            styles.difficultyText,
            isPremium && styles.premiumDifficultyText
          ]}>
            {spread.difficulty.toUpperCase()}
          </Text>
          <Text style={styles.startText}>시작하기 →</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* 진행률 표시 */}
      <View style={styles.progressBar}>
        <Text style={styles.progressTitle}>✅ Phase 3 완료</Text>
        <Text style={styles.progressText}>스프레드 화면 구현 - 모든 레이아웃 완성</Text>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>🔮 타로 스프레드</Text>
          <Text style={styles.subtitle}>원하는 스프레드를 선택하여 운세를 확인해보세요</Text>
        </View>

        {/* 스프레드 목록 */}
        <View style={styles.spreadsList}>
          {spreads.map(renderSpreadCard)}
        </View>

        {/* 하단 정보 */}
        <View style={styles.bottomInfo}>
          <Text style={styles.infoTitle}>💫 스프레드란?</Text>
          <Text style={styles.infoDescription}>
            타로 카드를 특정한 패턴으로 배치하여 다양한 관점에서
            상황을 해석하는 방법입니다. 각 위치마다 고유한 의미가 있어
            더 깊이 있는 통찰을 얻을 수 있습니다.
          </Text>
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
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16, 185, 129, 0.3)',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10b981',
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
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#d4af37',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
  },
  spreadsList: {
    gap: 20,
    marginBottom: 30,
  },
  spreadCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  premiumSpreadCard: {
    borderColor: '#d4af37',
    shadowColor: '#d4af37',
    shadowOpacity: 0.8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardIcon: {
    width: 50,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  premiumIcon: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
  },
  cardIconText: {
    fontSize: 24,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  premiumTitle: {
    color: '#d4af37',
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  premiumBadge: {
    backgroundColor: '#d4af37',
    color: 'black',
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cardDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingTop: 16,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  premiumDifficultyText: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    color: '#d4af37',
  },
  startText: {
    fontSize: 14,
    color: '#d4af37',
    fontWeight: '600',
  },
  bottomInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#d4af37',
    marginBottom: 12,
  },
  infoDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 24,
  },
});