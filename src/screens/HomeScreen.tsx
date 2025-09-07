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
  TarotAnimations,
} from '../components/ui';
import { useDailyTarotStore } from '../stores/dailyTarotStore';

const { width: screenWidth } = Dimensions.get('window');
const CARD_WIDTH = 80;
const CARD_HEIGHT = 120;

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
  
  const [memo, setMemo] = useState('');
  const [timeRemaining, setTimeRemaining] = useState({ minutes: timeUntilNextHour || 0, seconds: 0 });
  
  const scrollViewRef = React.useRef<ScrollView>(null);
  const fadeAnimation = useSharedValue(1);

  // 24시간 배열 생성
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Store 초기화
  useEffect(() => {
    initializeToday().catch(console.error);
  }, [initializeToday]);

  // 선택된 시간의 메모 동기화
  useEffect(() => {
    if (selectedHour !== null) {
      const existingMemo = getMemoForHour(selectedHour);
      setMemo(existingMemo);
    }
  }, [selectedHour, getMemoForHour]);

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

  // 선택된 시간 변경 시 스크롤
  useEffect(() => {
    if (scrollViewRef.current) {
      const scrollX = selectedHour * (CARD_WIDTH + spacing.lg) - screenWidth / 2 + CARD_WIDTH / 2;
      scrollViewRef.current.scrollTo({ x: Math.max(0, scrollX), animated: true });
    }
  }, [selectedHour]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: fadeAnimation.value,
  }));

  const handleCardPress = (hour: number) => {
    if (hour <= currentHour) {
      selectHour(hour);
      fadeAnimation.value = withTiming(0.7, { duration: 200 }, () => {
        fadeAnimation.value = withTiming(1, { duration: 200 });
      });
    }
  };

  const handleMemoSave = async (text: string) => {
    setMemo(text);
    if (selectedHour !== null) {
      await saveMemo(selectedHour, text);
      console.log(`메모 저장: ${selectedHour}시 - ${text}`);
    }
  };

  const renderHourCard = (hour: number, index: number) => {
    const cardData = sessionCards.find(card => card.hour === hour);
    const isPast = hour < currentHour;
    const isCurrent = hour === currentHour;
    const isFuture = hour > currentHour;
    const isSelected = hour === selectedHour;

    let variant: 'placeholder' | 'revealed' | 'flipped' = 'placeholder';
    if (isPast || isCurrent) {
      variant = 'revealed';
    } else {
      variant = 'placeholder';
    }

    return (
      <View key={hour} style={styles.cardContainer}>
        <TarotCard
          size="medium"
          variant={variant}
          cardImage={cardData?.cardImage}
          cardName={cardData?.cardName}
          description={cardData?.description}
          position={hour.toString()}
          mysticalEffect={isSelected && (isPast || isCurrent)}
          onPress={() => handleCardPress(hour)}
          style={[
            styles.hourCard,
            isSelected && styles.selectedCard,
            isFuture && styles.futureCard,
          ]}
          testID={`hour-card-${hour}`}
        />
        
        <Text style={[
          styles.hourLabel,
          isCurrent && styles.currentHourLabel,
          isSelected && styles.selectedHourLabel,
        ]}>
          {hour.toString().padStart(2, '0')}:00
        </Text>
        
        {isCurrent && (
          <View style={styles.currentIndicator}>
            <Text style={styles.currentText}>NOW</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <Animated.View style={[styles.content, animatedStyle]}>
        {/* 헤더 */}
        <View style={styles.header}>
          <Text style={styles.title}>🔮 오늘의 타로</Text>
          <TimeDisplay
            minutes={timeRemaining.minutes}
            seconds={timeRemaining.seconds}
            variant="mystical"
            size="compact"
            label="다음 카드까지"
            showLabel={true}
          />
        </View>

        {/* 현재 선택된 카드 정보 */}
        <GradientBackground variant="card" style={styles.selectedCardInfo}>
          <Text style={styles.selectedCardTitle}>
            {selectedHour.toString().padStart(2, '0')}:00 시간
          </Text>
          <Text style={styles.selectedCardDescription}>
            {selectedCard?.description || '아직 공개되지 않은 시간입니다'}
          </Text>
        </GradientBackground>

        {/* 24시간 카드 스크롤 */}
        <View style={styles.cardsSection}>
          <Text style={styles.sectionTitle}>24시간 타로 타이머</Text>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsContainer}
            decelerationRate="fast"
          >
            {hours.map(renderHourCard)}
          </ScrollView>
        </View>

        {/* 메모 영역 */}
        <View style={styles.memoSection}>
          <Text style={styles.sectionTitle}>
            {selectedHour.toString().padStart(2, '0')}:00 메모
          </Text>
          <MemoPad
            value={memo}
            onChangeText={setMemo}
            variant="mystical"
            size="compact"
            placeholder={`${selectedHour}시의 느낌과 생각을 기록해보세요...`}
            showWordCount={true}
            onSave={handleMemoSave}
            maxLength={500}
            style={styles.memoPad}
          />
        </View>

        {/* 오늘의 통계 */}
        <GradientBackground variant="card" style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{currentHour + 1}</Text>
            <Text style={styles.statLabel}>공개된 카드</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{24 - currentHour - 1}</Text>
            <Text style={styles.statLabel}>남은 카드</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{getSessionStats().cardsWithMemos}</Text>
            <Text style={styles.statLabel}>작성한 멤모</Text>
          </View>
        </GradientBackground>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  content: {
    flex: 1,
    padding: spacing['2xl'],
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['3xl'],
  },

  title: {
    fontSize: typography.size.displayMedium,
    fontWeight: typography.weight.bold,
    color: colors.primary.main,
  },

  selectedCardInfo: {
    borderRadius: radius['2xl'],
    padding: spacing['2xl'],
    marginBottom: spacing['3xl'],
    borderWidth: 1,
    borderColor: colors.card.border,
    ...shadows.mysticalGlow,
  },

  selectedCardTitle: {
    fontSize: typography.size.titleMedium,
    fontWeight: typography.weight.semibold,
    color: colors.primary.main,
    marginBottom: spacing.sm,
  },

  selectedCardDescription: {
    fontSize: typography.size.bodyMedium,
    color: colors.text.secondary,
    lineHeight: typography.size.bodyMedium * typography.lineHeight.relaxed,
  },

  cardsSection: {
    marginBottom: spacing['3xl'],
  },

  sectionTitle: {
    fontSize: typography.size.titleSmall,
    fontWeight: typography.weight.medium,
    color: colors.text.primary,
    marginBottom: spacing.lg,
  },

  cardsContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },

  cardContainer: {
    alignItems: 'center',
    marginRight: spacing.lg,
  },

  hourCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },

  selectedCard: {
    ...shadows.mystical,
  },

  futureCard: {
    opacity: 0.6,
  },

  hourLabel: {
    fontSize: typography.size.caption,
    color: colors.text.tertiary,
    marginTop: spacing.sm,
    fontWeight: typography.weight.medium,
  },

  currentHourLabel: {
    color: colors.primary.main,
    fontWeight: typography.weight.bold,
  },

  selectedHourLabel: {
    color: colors.primary.main,
  },

  currentIndicator: {
    position: 'absolute',
    top: -spacing.sm,
    backgroundColor: colors.primary.main,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.xs,
  },

  currentText: {
    fontSize: typography.size.overline,
    fontWeight: typography.weight.bold,
    color: colors.background.primary,
  },

  memoSection: {
    marginBottom: spacing['3xl'],
  },

  memoPad: {
    minHeight: 100,
  },

  statsSection: {
    flexDirection: 'row',
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.card.border,
    ...shadows.mystical,
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: typography.size.titleLarge,
    fontWeight: typography.weight.bold,
    color: colors.primary.main,
    marginBottom: spacing.xs,
  },

  statLabel: {
    fontSize: typography.size.caption,
    color: colors.text.secondary,
    textAlign: 'center',
  },

  statDivider: {
    width: 1,
    backgroundColor: colors.card.border,
    marginHorizontal: spacing.lg,
  },
});

export default HomeScreen;