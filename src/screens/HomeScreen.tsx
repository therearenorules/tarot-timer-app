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
  Image,
  TextInput,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from 'react-native-reanimated';
import {
  TarotCard,
  TimeDisplay,
  MemoPad,
  GradientBackground,
  colors,
  spacing,
  typography,
  radius,
  shadows,
} from '../components/ui';
import { getTarotCardById } from '../assets/tarot-cards';
import { useDailyTarotStore } from '../stores/dailyTarotStore';

const { width: screenWidth } = Dimensions.get('window');
const MAIN_CARD_WIDTH = 192;
const MAIN_CARD_HEIGHT = 320;
const SMALL_CARD_WIDTH = 56;
const SMALL_CARD_HEIGHT = 88;

export const HomeScreen: React.FC = () => {
  // Zustand store 사용
  const {
    sessionCards,
    selectedHour,
    selectedCard,
    currentHour,
    timeUntilNextHour,
    isLoading,
    error,
    initializeToday,
    selectHour,
    saveMemo,
    getMemoForHour,
    updateCurrentTime,
    getSessionStats,
  } = useDailyTarotStore();
  
  // 카드 뽑기 상태 관리
  const [hasDrawnCards, setHasDrawnCards] = useState(false);
  const [currentTimeMemo, setCurrentTimeMemo] = useState('');
  const [timeRemaining, setTimeRemaining] = useState({ minutes: timeUntilNextHour || 0, seconds: 0 });
  
  const scrollViewRef = React.useRef<ScrollView>(null);
  const fadeAnimation = useSharedValue(1);

  // 24시간 배열 생성
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Store 초기화
  useEffect(() => {
    initializeToday().then(() => {
      // 이미 카드가 뽑혔는지 확인
      if (sessionCards && sessionCards.length > 0) {
        setHasDrawnCards(true);
      }
    }).catch(console.error);
  }, [initializeToday, sessionCards]);

  // 현재 시간의 메모 동기화
  useEffect(() => {
    if (hasDrawnCards && currentHour !== null) {
      const existingMemo = getMemoForHour(currentHour);
      setCurrentTimeMemo(existingMemo);
    }
  }, [currentHour, getMemoForHour, hasDrawnCards]);

  // 시간 업데이트
  useEffect(() => {
    const updateTime = () => {
      updateCurrentTime();
      const now = new Date();
      const nextHour = new Date(now);
      nextHour.setHours(now.getHours() + 1, 0, 0, 0);
      
      const diff = nextHour.getTime() - now.getTime();
      const minutes = Math.floor(diff / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeRemaining({ minutes, seconds });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [updateCurrentTime]);

  // 현재 시간 표시 포맷
  const getCurrentTimeString = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? '오후' : '오전';
    const displayHours = hours % 12 || 12;
    return `${ampm} ${displayHours}:${minutes.toString().padStart(2, '0')}`;
  };

  // 24시간 카드 뽑기
  const drawDailyCards = async () => {
    try {
      await initializeToday();
      setHasDrawnCards(true);
      fadeAnimation.value = withTiming(0, { duration: 300 }, () => {
        fadeAnimation.value = withTiming(1, { duration: 300 });
      });
    } catch (error) {
      console.error('카드 뽑기 실패:', error);
    }
  };

  // 다시 뽑기
  const redrawCards = async () => {
    try {
      // Store에서 새로운 카드들을 뽑도록 하기
      await initializeToday(); 
      fadeAnimation.value = withTiming(0.7, { duration: 200 }, () => {
        fadeAnimation.value = withTiming(1, { duration: 200 });
      });
    } catch (error) {
      console.error('카드 다시 뽑기 실패:', error);
    }
  };

  // 카드 선택
  const selectCard = (hour: number) => {
    selectHour(hour);
    
    // 현재 시간의 메모로 변경
    if (hour === currentHour) {
      const existingMemo = getMemoForHour(hour);
      setCurrentTimeMemo(existingMemo);
    }
  };

  // 현재 시간 메모 저장
  const saveCurrentTimeMemo = async () => {
    if (currentHour !== null) {
      await saveMemo(currentHour, currentTimeMemo);
      console.log(`현재 시간 메모 저장: ${currentHour}시 - ${currentTimeMemo}`);
    }
  };

  // 현재 카드 데이터 가져오기
  const getCurrentCard = () => {
    const currentCardData = sessionCards.find(card => card.hour === currentHour);
    if (currentCardData?.cardKey) {
      return getTarotCardById(currentCardData.cardKey);
    }
    return null;
  };

  const currentCard = getCurrentCard();

  // 시간별 라벨 생성
  const getTimeLabel = (hour: number) => {
    if (hour === 0) return '자정';
    if (hour >= 1 && hour <= 5) return `새벽 ${hour}시`;
    if (hour >= 6 && hour <= 11) return `오전 ${hour}시`;
    if (hour === 12) return '정오';
    if (hour >= 13 && hour <= 17) return `오후 ${hour - 12}시`;
    if (hour >= 18 && hour <= 23) return `오후 ${hour - 12}시`;
    return `${hour}시`;
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnimation.value,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.content, animatedStyle]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              {/* 타로 타이머 아이콘 (HTML과 동일) */}
              <View style={styles.tarotIcon}>
                <View style={[styles.cardRect, styles.cardBack]} />
                <View style={[styles.cardRect, styles.cardFront]} />
                <View style={styles.clockCircle} />
                <View style={styles.clockHand} />
                <View style={styles.clockHand2} />
                <View style={styles.tarotDots}>
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                  <View style={styles.dot} />
                </View>
              </View>
            </View>
            <Text style={styles.title}>Tarot Timer</Text>
            <Text style={styles.subtitle}>24시간 타로 여정을 시작하세요</Text>
          </View>

          {!hasDrawnCards ? (
            /* Initial State: Before Drawing Cards */
            <View style={styles.initialState}>
              <GradientBackground variant="card" style={styles.initialCard}>
                <View style={styles.initialCardContent}>
                  <View style={styles.initialIcon}>
                    {/* 3카드 아이콘 */}
                    <View style={styles.threeCardsIcon}>
                      <View style={styles.iconCard} />
                      <View style={styles.iconCard} />
                      <View style={styles.iconCard} />
                      <View style={[styles.iconDot, { left: 12 }]} />
                      <View style={[styles.iconDot, { left: 24 }]} />
                      <View style={[styles.iconDot, { right: 12 }]} />
                    </View>
                  </View>
                  <Text style={styles.initialTitle}>24시간의 신비로운 여정</Text>
                  <Text style={styles.initialDescription}>
                    하루 24시간, 각 시간마다의 특별한 메시지를 담은 타로카드를 뽑아보세요.
                  </Text>
                  
                  <TouchableOpacity 
                    style={styles.drawButton}
                    onPress={drawDailyCards}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.drawButtonText}>24시간 타로 뽑기</Text>
                  </TouchableOpacity>
                </View>
              </GradientBackground>
            </View>
          ) : (
            /* Cards Drawn State: After Drawing Cards */
            <View style={styles.cardsDrawnState}>
              {/* Current Time Header - HTML 데모와 동일한 디자인 */}
              <View style={styles.currentTimeHeader}>
                <View style={styles.currentTimeRow}>
                  {/* Clock Icon - HTML과 동일한 SVG 스타일 */}
                  <View style={styles.clockIcon}>
                    <View style={styles.clockCircleIcon} />
                    <View style={styles.clockHandShort} />
                    <View style={styles.clockHandLong} />
                  </View>
                  <Text style={styles.currentTimeText}>{getCurrentTimeString()}</Text>
                  <View style={styles.liveIndicator} />
                </View>
                <Text style={styles.currentTimeSubtitle}>현재 시간의 타로카드</Text>
              </View>

              {/* Current Card Display */}
              {currentCard && (
                <View style={styles.currentCardContainer}>
                  <GradientBackground variant="card" style={styles.currentCard}>
                    {/* Card Image */}
                    <View style={styles.cardImageContainer}>
                      <View style={styles.cardImageGlow} />
                      <View style={styles.cardImageWrapper}>
                        <Image 
                          source={currentCard.image}
                          style={styles.mainCardImage}
                          resizeMode="cover"
                        />
                        <View style={styles.cardImageOverlay} />
                      </View>
                    </View>
                    
                    {/* Card Name */}
                    <Text style={styles.currentCardName}>{currentCard.name}</Text>
                    
                    {/* Card Details */}
                    <View style={styles.cardDetails}>
                      {/* Tags */}
                      <View style={styles.cardTags}>
                        {currentCard.upright?.slice(0, 3).map((keyword, index) => (
                          <View key={index} style={styles.tag}>
                            <Text style={styles.tagText}>{keyword}</Text>
                          </View>
                        ))}
                      </View>
                      
                      {/* Description */}
                      <Text style={styles.cardDescription}>
                        {currentCard.description}
                      </Text>
                    </View>
                    
                    {/* Current Time Memo Area */}
                    <View style={styles.memoArea}>
                      <View style={styles.memoHeader}>
                        <View style={styles.memoTitleRow}>
                          <View style={styles.memoIcon} />
                          <Text style={styles.memoTitle}>메모</Text>
                        </View>
                        <TouchableOpacity 
                          style={styles.saveButton}
                          onPress={saveCurrentTimeMemo}
                        >
                          <View style={styles.saveIcon} />
                          <Text style={styles.saveButtonText}>저장</Text>
                        </TouchableOpacity>
                      </View>
                      
                      <TextInput
                        style={styles.memoInput}
                        value={currentTimeMemo}
                        onChangeText={setCurrentTimeMemo}
                        placeholder="이 시간에 대한 생각이나 느낌을 적어보세요..."
                        placeholderTextColor="rgba(255, 255, 255, 0.5)"
                        multiline
                        numberOfLines={3}
                      />
                    </View>
                  </GradientBackground>
                </View>
              )}

              {/* 24-Hour Cards Section */}
              <View style={styles.hourCardsSection}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionTitleRow}>
                    <View style={styles.sectionIcon} />
                    <Text style={styles.sectionTitle}>24시간 에너지 흐름</Text>
                  </View>
                  
                  <TouchableOpacity 
                    style={styles.redrawButton}
                    onPress={redrawCards}
                  >
                    <View style={styles.redrawIcon} />
                    <Text style={styles.redrawButtonText}>다시 뽑기</Text>
                  </TouchableOpacity>
                </View>
                
                {/* Horizontal scroll of 24 cards */}
                <View style={styles.cardsScrollContainer}>
                  {/* Left gradient */}
                  <View style={[styles.scrollGradient, styles.leftGradient]} />
                  {/* Right gradient */}
                  <View style={[styles.scrollGradient, styles.rightGradient]} />
                  
                  <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.cardsScroll}
                    contentContainerStyle={styles.cardsScrollContent}
                  >
                    {hours.map((hour, index) => {
                      const cardData = sessionCards.find(card => card.hour === hour);
                      const tarotCard = cardData?.cardKey ? getTarotCardById(cardData.cardKey) : null;
                      const isCurrentHour = hour === currentHour;
                      
                      return (
                        <TouchableOpacity
                          key={hour}
                          style={styles.smallCardContainer}
                          onPress={() => selectCard(hour)}
                          activeOpacity={0.7}
                        >
                          <View style={[styles.smallCardWrapper, isCurrentHour && styles.currentHourCard]}>
                            {tarotCard ? (
                              <Image 
                                source={tarotCard.image}
                                style={styles.smallCardImage}
                                resizeMode="cover"
                              />
                            ) : (
                              <View style={styles.placeholderCard}>
                                <Text style={styles.placeholderText}>?</Text>
                              </View>
                            )}
                          </View>
                          <Text style={[styles.smallCardLabel, isCurrentHour && styles.currentHourLabel]}>
                            {getTimeLabel(hour)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                </View>
              </View>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  scrollView: {
    flex: 1,
  },

  content: {
    padding: spacing['2xl'],
    paddingBottom: spacing['4xl'],
  },

  // Header Styles
  header: {
    alignItems: 'center',
    marginBottom: spacing['4xl'],
    paddingTop: spacing.lg,
  },

  headerIcon: {
    marginBottom: spacing.lg,
  },

  tarotIcon: {
    width: 48,
    height: 48,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardRect: {
    position: 'absolute',
    width: 16,
    height: 22,
    borderRadius: 2,
  },

  cardBack: {
    backgroundColor: colors.primary.main,
    opacity: 0.9,
    left: -2,
  },

  cardFront: {
    backgroundColor: 'rgba(26, 31, 58, 0.7)',
    width: 14,
    height: 20,
    borderRadius: 1,
    left: -1,
    top: 1,
  },

  clockCircle: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.8,
    borderColor: colors.primary.main,
    top: 6,
  },

  clockHand: {
    position: 'absolute',
    width: 0,
    height: 6,
    borderLeftWidth: 0.9,
    borderLeftColor: colors.primary.main,
    top: 9,
    left: 24,
  },

  clockHand2: {
    position: 'absolute',
    width: 3,
    height: 0,
    borderTopWidth: 0.9,
    borderTopColor: colors.primary.main,
    top: 11,
    left: 24,
  },

  tarotDots: {
    position: 'absolute',
    bottom: 4,
    flexDirection: 'row',
    gap: 4,
  },

  dot: {
    width: 2.4,
    height: 2.4,
    borderRadius: 1.2,
    backgroundColor: colors.primary.main,
    opacity: 0.7,
  },

  title: {
    ...typography.styles.displayLarge,
    color: '#F4D03F',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },

  subtitle: {
    ...typography.styles.bodySmall,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },

  // Initial State Styles
  initialState: {
    alignItems: 'center',
  },

  initialCard: {
    borderRadius: radius['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: spacing['3xl'],
    ...shadows.mystical,
  },

  initialCardContent: {
    alignItems: 'center',
    gap: spacing['2xl'],
  },

  initialIcon: {
    marginBottom: spacing.lg,
  },

  threeCardsIcon: {
    width: 64,
    height: 64,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconCard: {
    position: 'absolute',
    width: 16,
    height: 22,
    backgroundColor: colors.primary.main,
    borderRadius: 2,
  },

  iconDot: {
    position: 'absolute',
    top: 8,
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: 'rgba(26, 31, 58, 1)',
  },

  initialTitle: {
    ...typography.styles.titleLarge,
    color: colors.text.primary,
    textAlign: 'center',
  },

  initialDescription: {
    ...typography.styles.bodyMedium,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },

  drawButton: {
    backgroundColor: colors.primary.main,
    borderRadius: radius.xl,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing['2xl'],
    ...shadows.mystical,
    width: '100%',
  },

  drawButtonText: {
    ...typography.styles.titleMedium,
    color: colors.background.primary,
    textAlign: 'center',
    fontFamily: typography.fontFamily.bold,
  },

  // Cards Drawn State Styles
  cardsDrawnState: {
    gap: spacing['3xl'],
  },

  // Current Time Header
  currentTimeHeader: {
    alignItems: 'center',
    gap: spacing.sm,
  },

  currentTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  clockIcon: {
    width: 20,
    height: 20,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  clockCircleIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#F4D03F',
    position: 'absolute',
  },

  clockHandShort: {
    position: 'absolute',
    width: 0,
    height: 6,
    borderLeftWidth: 1,
    borderLeftColor: '#F4D03F',
    top: 4,
  },

  clockHandLong: {
    position: 'absolute',
    width: 0,
    height: 8,
    borderLeftWidth: 1,
    borderLeftColor: '#F4D03F',
    top: 2,
    transform: [{ rotate: '90deg' }],
  },

  currentTimeText: {
    fontSize: 20,
    fontWeight: '500',
    color: '#FFFFFF',
  },

  liveIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },

  currentTimeSubtitle: {
    ...typography.styles.bodySmall,
    color: 'rgba(255, 255, 255, 0.7)',
  },

  // Current Card Display
  currentCardContainer: {
    position: 'relative',
  },

  currentCard: {
    borderRadius: radius['2xl'],
    padding: spacing['2xl'],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...shadows.mysticalGlow,
    gap: spacing['2xl'],
  },

  // Card Image
  cardImageContainer: {
    alignItems: 'center',
    position: 'relative',
  },

  cardImageGlow: {
    position: 'absolute',
    width: MAIN_CARD_WIDTH + 16,
    height: MAIN_CARD_HEIGHT + 16,
    borderRadius: radius['2xl'],
    backgroundColor: 'rgba(212, 175, 55, 0.3)',
    // blur equivalent would need a library like react-native-blur
  },

  cardImageWrapper: {
    width: MAIN_CARD_WIDTH,
    height: MAIN_CARD_HEIGHT,
    borderRadius: radius['2xl'],
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.5)',
    ...shadows.mystical,
    position: 'relative',
  },

  mainCardImage: {
    width: '100%',
    height: '100%',
  },

  cardImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
  },

  currentCardName: {
    ...typography.styles.titleMedium,
    color: colors.text.primary,
    textAlign: 'center',
  },

  // Card Details
  cardDetails: {
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },

  cardTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },

  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },

  tagText: {
    ...typography.styles.caption,
    color: colors.primary.main,
    fontSize: 10,
  },

  cardDescription: {
    ...typography.styles.bodyMedium,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },

  // Memo Area
  memoArea: {
    gap: spacing.sm,
  },

  memoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  memoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  memoIcon: {
    width: 16,
    height: 16,
    borderRadius: 2,
    borderWidth: 2,
    borderColor: colors.primary.main,
  },

  memoTitle: {
    ...typography.styles.titleSmall,
    color: colors.text.primary,
  },

  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },

  saveIcon: {
    width: 12,
    height: 12,
    // Checkmark icon would need a custom implementation
  },

  saveButtonText: {
    ...typography.styles.caption,
    color: colors.primary.main,
    fontSize: 10,
  },

  memoInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: radius.xl,
    padding: spacing.lg,
    color: colors.text.primary,
    ...typography.styles.bodySmall,
    minHeight: 96,
    textAlignVertical: 'top',
  },

  // 24-Hour Cards Section
  hourCardsSection: {
    gap: spacing.lg,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  sectionIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary.main,
  },

  sectionTitle: {
    ...typography.styles.titleMedium,
    color: colors.text.primary,
  },

  redrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
  },

  redrawIcon: {
    width: 12,
    height: 12,
    // Refresh icon would need custom implementation
  },

  redrawButtonText: {
    ...typography.styles.caption,
    color: colors.primary.main,
    fontSize: 11,
  },

  // Cards Scroll
  cardsScrollContainer: {
    position: 'relative',
  },

  scrollGradient: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 32,
    zIndex: 10,
    pointerEvents: 'none',
  },

  leftGradient: {
    left: 0,
    backgroundColor: 'linear-gradient(to right, #1a1f3a, transparent)',
  },

  rightGradient: {
    right: 0,
    backgroundColor: 'linear-gradient(to left, #1a1f3a, transparent)',
  },

  cardsScroll: {
    paddingBottom: spacing.sm,
  },

  cardsScrollContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },

  smallCardContainer: {
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    marginRight: spacing.sm,
  },

  smallCardWrapper: {
    width: SMALL_CARD_WIDTH,
    height: SMALL_CARD_HEIGHT,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.card,
  },

  currentHourCard: {
    ...shadows.mystical,
    borderWidth: 2,
    borderColor: colors.primary.main,
  },

  smallCardImage: {
    width: '100%',
    height: '100%',
  },

  placeholderCard: {
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  placeholderText: {
    ...typography.styles.titleLarge,
    color: 'rgba(255, 255, 255, 0.3)',
  },

  smallCardLabel: {
    ...typography.styles.caption,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontSize: 10,
  },

  currentHourLabel: {
    color: colors.primary.main,
    fontFamily: typography.fontFamily.bold,
  },
});

export default HomeScreen;