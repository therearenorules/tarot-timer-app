import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import {
  TarotCard,
  colors,
  spacing,
  typography,
  radius,
  shadows,
} from '../components/ui';

const { width: screenWidth } = Dimensions.get('window');

interface SpreadDefinition {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  level: 'beginner' | 'intermediate' | 'premium';
  positions: string[];
  layout: 'single' | 'horizontal' | 'cross' | 'v-shape' | 'ab-choice';
}

export const SpreadScreen: React.FC = () => {
  const [selectedSpread, setSelectedSpread] = useState<SpreadDefinition | null>(null);
  const [currentSpreadCards, setCurrentSpreadCards] = useState<Array<{ position: string; card: any; revealed: boolean }>>([]);
  const [isReading, setIsReading] = useState(false);
  const [selectedCardModal, setSelectedCardModal] = useState<any>(null);

  const fadeAnimation = useSharedValue(1);

  // 스프레드 정의들
  const spreads: SpreadDefinition[] = [
    {
      id: 'one-card',
      name: '1카드 스프레드 - 빠른 뽑기',
      description: '1장의 카드를 사용하는 beginner 레벨 스프레드입니다.',
      cardCount: 1,
      level: 'beginner',
      positions: ['현재 상황'],
      layout: 'single',
    },
    {
      id: 'three-card',
      name: '3카드 스프레드',
      description: '3장의 카드를 사용하는 beginner 레벨 스프레드입니다.',
      cardCount: 3,
      level: 'beginner',
      positions: ['과거', '현재', '미래'],
      layout: 'horizontal',
    },
    {
      id: 'five-card',
      name: '5카드 스프레드',
      description: '종합적인 안내를 위한 V자 형태의 5장 스프레드입니다.',
      cardCount: 5,
      level: 'beginner',
      positions: ['현재 상황', '도전과 장애', '과거의 영향', '가능한 결과', '조언'],
      layout: 'v-shape',
    },
    {
      id: 'celtic-cross',
      name: '켈틱 크로스',
      description: '복잡한 상황에 대한 깊이 있는 통찰을 제공하는 10카드 스프레드입니다.',
      cardCount: 10,
      level: 'intermediate',
      positions: [
        '현재 상황', '도전과 장애', '먼 과거', '최근 과거', 
        '가능한 미래', '가까운 미래', '당신의 접근법', '외부 영향', 
        '희망과 두려움', '최종 결과'
      ],
      layout: 'cross',
    },
    {
      id: 'ab-choice',
      name: 'AB선택 스프레드',
      description: '두 가지 중요한 선택지를 비교 분석하는 7카드 스프레드입니다.',
      cardCount: 7,
      level: 'premium',
      positions: [
        '현재 상황', '선택지 A', 'A의 결과', '선택지 B', 
        'B의 결과', '숨겨진 영향', '조언'
      ],
      layout: 'ab-choice',
    },
  ];

  // 모크 카드 데이터
  const mockCardImages = [
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=500&fit=crop&seed=1',
    'https://images.unsplash.com/photo-1551431009-a802eeec77b1?w=300&h=500&fit=crop&seed=2',
    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=500&fit=crop&seed=3',
    'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=300&h=500&fit=crop&seed=4',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=500&fit=crop&seed=5',
  ];

  const startSpreadReading = async (spread: SpreadDefinition) => {
    try {
      setSelectedSpread(spread);
      setIsReading(true);
      
      // Zustand store를 통한 스프레드 시작
      await startNewSpread(spread.id);
      console.log(`스프레드 시작: ${spread.name}`);
    } catch (error) {
      console.error('스프레드 시작 오류:', error);
    }
  };

  const drawCard = async (index: number) => {
    try {
      // Zustand store를 통해 실제 카드 드로우
      await drawCardAtPosition(index);
      console.log(`카드 ${index + 1} 공개`);
    } catch (error) {
      console.error('카드 드로우 오류:', error);
    }
  };

  const backToSpreadSelection = () => {
    clearCurrentSpread();
    setIsReading(false);
    setSelectedSpread(null);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return colors.status.info;
      case 'intermediate':
        return colors.status.warning;
      case 'premium':
        return colors.primary.main;
      default:
        return colors.text.secondary;
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner':
        return '기본';
      case 'intermediate':
        return '중급';
      case 'premium':
        return '프리미엄';
      default:
        return level;
    }
  };

  const renderSpreadCard = (spread: SpreadDefinition) => (
    <TouchableOpacity
      key={spread.id}
      style={[
        styles.spreadCard,
        spread.level === 'premium' && styles.premiumCard,
      ]}
      onPress={() => startSpreadReading(spread).catch(console.error)}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardIcon}>
          <Text style={styles.cardIconText}>🎴</Text>
        </View>
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitle}>{spread.name}</Text>
          <View style={[
            styles.levelBadge,
            { backgroundColor: `${getLevelColor(spread.level)}20` },
            { borderColor: `${getLevelColor(spread.level)}50` },
          ]}>
            <Text style={[
              styles.levelText,
              { color: getLevelColor(spread.level) }
            ]}>
              {getLevelText(spread.level)}
            </Text>
            {spread.level === 'premium' && (
              <Text style={styles.premiumIcon}>⭐</Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.cardDescription}>
        <Text style={styles.descriptionText}>{spread.description}</Text>
      </View>

      <TouchableOpacity style={styles.startButton}>
        <Text style={styles.startButtonText}>시작하기</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderSpreadLayout = () => {
    if (!selectedSpread) return null;

    const layoutStyle = getLayoutStyle(selectedSpread.layout);

    return (
      <View style={styles.spreadLayout}>
        <Text style={styles.spreadTitle}>{selectedSpread.name}</Text>
        
        <View style={[styles.cardsLayout, layoutStyle]}>
          {selectedSpread.positions.map((position, index) => {
            const isDrawn = drawnCards.some(card => card.positionIndex === index);
            const drawnCard = drawnCards.find(card => card.positionIndex === index);
            
            return (
              <View key={index} style={styles.cardPosition}>
                <TarotCard
                  size="medium"
                  variant={isDrawn ? 'revealed' : 'placeholder'}
                  cardImage={isDrawn ? mockCardImages[index % mockCardImages.length] : undefined}
                  cardName={drawnCard?.cardName}
                  description={isDrawn ? `${position} - ${drawnCard?.keywords?.join(', ') || ''}` : undefined}
                  position={(index + 1).toString()}
                  mysticalEffect={isDrawn}
                  onPress={() => {
                    if (!isDrawn) {
                      drawCard(index);
                    } else {
                      setSelectedCardModal({
                        card: {
                          name: drawnCard?.cardName || '',
                          image: mockCardImages[index % mockCardImages.length],
                          description: `${position} - ${drawnCard?.keywords?.join(', ') || ''}`
                        },
                        position
                      });
                    }
                  }}
                  style={styles.spreadCard}
                />
                <Text style={styles.positionLabel}>{position}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.spreadActions}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={backToSpreadSelection}
          >
            <Text style={styles.backButtonText}>← 스프레드 선택</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.saveButton}
            onPress={() => console.log('스프레드 저장')}
          >
            <Text style={styles.saveButtonText}>저장</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const getLayoutStyle = (layout: string) => {
    switch (layout) {
      case 'single':
        return { alignItems: 'center' };
      case 'horizontal':
        return { flexDirection: 'row', justifyContent: 'space-around' };
      case 'cross':
        return { flexWrap: 'wrap', justifyContent: 'center' };
      case 'v-shape':
        return { flexWrap: 'wrap', justifyContent: 'center' };
      case 'ab-choice':
        return { flexWrap: 'wrap', justifyContent: 'space-between' };
      default:
        return { flexWrap: 'wrap', justifyContent: 'center' };
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnimation.value,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background.primary} />
      
      <Animated.View style={[styles.content, animatedStyle]}>
        {!isReading ? (
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* 헤더 */}
            <View style={styles.header}>
              <Text style={styles.title}>🎴 Spreads</Text>
              <Text style={styles.subtitle}>
                다양한 상황에 맞는 타로 스프레드를 선택하세요
              </Text>
            </View>

            {/* 스프레드 목록 */}
            <View style={styles.spreadsList}>
              {spreads.map(renderSpreadCard)}
            </View>

            {/* 프리미엄 안내 */}
            <View style={styles.premiumInfo}>
              <View style={styles.premiumIcon}>
                <Text style={styles.premiumIconText}>⭐</Text>
              </View>
              <Text style={styles.premiumTitle}>프리미엄 스프레드</Text>
              <Text style={styles.premiumDescription}>
                더 깊고 정확한 타로 리딩을 경험해보세요
              </Text>
            </View>
          </ScrollView>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderSpreadLayout()}
          </ScrollView>
        )}
      </Animated.View>

      {/* 카드 상세 모달 */}
      <Modal
        visible={selectedCardModal !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedCardModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedCardModal && (
              <>
                <TarotCard
                  size="large"
                  variant="revealed"
                  cardImage={selectedCardModal.card.image}
                  cardName={selectedCardModal.card.name}
                  description={selectedCardModal.card.description}
                  mysticalEffect={true}
                  style={styles.modalCard}
                />
                <Text style={styles.modalPosition}>{selectedCardModal.position}</Text>
                <Text style={styles.modalDescription}>
                  {selectedCardModal.card.description}
                </Text>
                <TouchableOpacity
                  style={styles.modalCloseButton}
                  onPress={() => setSelectedCardModal(null)}
                >
                  <Text style={styles.modalCloseText}>닫기</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },

  content: {
    flex: 1,
    padding: spacing['2xl'],
  },

  header: {
    alignItems: 'center',
    marginBottom: spacing['4xl'],
  },

  title: {
    fontSize: typography.size.displayLarge,
    fontWeight: typography.weight.bold,
    color: colors.primary.main,
    marginBottom: spacing.sm,
  },

  subtitle: {
    fontSize: typography.size.bodyMedium,
    color: colors.text.secondary,
    textAlign: 'center',
  },

  spreadsList: {
    gap: spacing['2xl'],
    marginBottom: spacing['4xl'],
  },

  spreadCard: {
    backgroundColor: colors.card.background,
    borderRadius: radius['2xl'],
    borderWidth: 1,
    borderColor: colors.card.border,
    padding: spacing['2xl'],
    ...shadows.medium,
  },

  premiumCard: {
    borderColor: colors.primary.main,
    ...shadows.mystical,
  },

  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
  },

  cardIconText: {
    fontSize: typography.size.titleMedium,
  },

  cardTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardTitle: {
    fontSize: typography.size.titleSmall,
    fontWeight: typography.weight.semibold,
    color: colors.text.primary,
    flex: 1,
  },

  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
  },

  levelText: {
    fontSize: typography.size.caption,
    fontWeight: typography.weight.medium,
  },

  premiumIcon: {
    fontSize: typography.size.caption,
    marginLeft: 4,
  },

  cardDescription: {
    backgroundColor: colors.background.secondary,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.card.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },

  descriptionText: {
    fontSize: typography.size.bodySmall,
    color: colors.text.secondary,
    lineHeight: typography.size.bodySmall * typography.lineHeight.relaxed,
  },

  startButton: {
    backgroundColor: colors.primary.main,
    borderRadius: radius.xl,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    ...shadows.medium,
  },

  startButtonText: {
    fontSize: typography.size.bodyMedium,
    fontWeight: typography.weight.bold,
    color: colors.background.primary,
  },

  premiumInfo: {
    backgroundColor: colors.card.background,
    borderRadius: radius['2xl'],
    borderWidth: 1,
    borderColor: colors.primary.main,
    padding: spacing['3xl'],
    alignItems: 'center',
    ...shadows.mystical,
  },

  premiumTitle: {
    fontSize: typography.size.titleMedium,
    fontWeight: typography.weight.bold,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  },

  premiumDescription: {
    fontSize: typography.size.bodyMedium,
    color: colors.text.secondary,
    textAlign: 'center',
  },

  spreadLayout: {
    alignItems: 'center',
  },

  spreadTitle: {
    fontSize: typography.size.titleLarge,
    fontWeight: typography.weight.bold,
    color: colors.primary.main,
    marginBottom: spacing['3xl'],
    textAlign: 'center',
  },

  cardsLayout: {
    width: '100%',
    gap: spacing.lg,
    marginBottom: spacing['4xl'],
  },

  cardPosition: {
    alignItems: 'center',
    gap: spacing.sm,
  },

  positionLabel: {
    fontSize: typography.size.caption,
    color: colors.text.tertiary,
    textAlign: 'center',
  },

  spreadActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: spacing.lg,
  },

  backButton: {
    flex: 1,
    backgroundColor: colors.card.background,
    borderRadius: radius.xl,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.card.border,
  },

  backButtonText: {
    fontSize: typography.size.bodyMedium,
    color: colors.text.secondary,
  },

  saveButton: {
    flex: 1,
    backgroundColor: colors.primary.main,
    borderRadius: radius.xl,
    paddingVertical: spacing.lg,
    alignItems: 'center',
  },

  saveButtonText: {
    fontSize: typography.size.bodyMedium,
    fontWeight: typography.weight.bold,
    color: colors.background.primary,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['2xl'],
  },

  modalContent: {
    backgroundColor: colors.card.background,
    borderRadius: radius['2xl'],
    padding: spacing['3xl'],
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.primary.main,
    ...shadows.mystical,
  },

  modalCard: {
    marginBottom: spacing.lg,
  },

  modalPosition: {
    fontSize: typography.size.titleMedium,
    fontWeight: typography.weight.semibold,
    color: colors.primary.main,
    marginBottom: spacing.sm,
  },

  modalDescription: {
    fontSize: typography.size.bodyMedium,
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing['2xl'],
    lineHeight: typography.size.bodyMedium * typography.lineHeight.relaxed,
  },

  modalCloseButton: {
    backgroundColor: colors.primary.main,
    borderRadius: radius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing['2xl'],
  },

  modalCloseText: {
    fontSize: typography.size.bodyMedium,
    fontWeight: typography.weight.bold,
    color: colors.background.primary,
  },
});

export default SpreadScreen;