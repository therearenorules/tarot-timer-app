import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Dimensions,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { TarotCardsIcon, ClockIcon, SparklesIcon, ZapIcon, SaveIcon, StarIcon } from '../components/icons';

import { useLanguage } from '../contexts/LanguageContext';
import { generateDailyCards, getCurrentHour, formatHour, formatDate } from '../utils/tarot-data';
import { saveDailyTarot, getTodaysSave } from '../utils/storage';
import { colors } from '../utils/colors';
import { typography, spacing, globalStyles } from '../utils/styles';
import { cardSelectFeedback, cardFlipFeedback } from '../utils/haptics';

const { width } = Dimensions.get('window');

export default function TimerScreen() {
  const { t, language } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dailyCards, setDailyCards] = useState([]);
  const [hasDrawnAll24Cards, setHasDrawnAll24Cards] = useState(false);
  const [isDrawingAll, setIsDrawingAll] = useState(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [hourlyMemos, setHourlyMemos] = useState({});
  const [isDailyTarotSaved, setIsDailyTarotSaved] = useState(false);
  const [showRecordingSection, setShowRecordingSection] = useState(false);

  // 애니메이션 값
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(1);

  const currentHour = getCurrentHour();

  useEffect(() => {
    // 펄스 애니메이션
    pulseScale.value = withRepeat(
      withTiming(1.02, { duration: 2000 }),
      -1,
      true
    );
    pulseOpacity.value = withRepeat(
      withTiming(0.8, { duration: 2000 }),
      -1,
      true
    );

    // 시간 업데이트
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // 오늘의 저장된 데이터 확인
    checkTodaysSave();

    return () => clearInterval(timer);
  }, []);

  const checkTodaysSave = async () => {
    const todaysSave = await getTodaysSave();
    if (todaysSave) {
      setDailyCards(todaysSave.hourlyCards);
      setHasDrawnAll24Cards(true);
      setIsDailyTarotSaved(true);
      setShowRecordingSection(true);
      setHourlyMemos(todaysSave.memos || {});
      setSelectedCardIndex(currentHour);
    }
  };

  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const currentCard = dailyCards[currentHour] || null;

  const drawAll24Cards = async () => {
    cardFlipFeedback();
    setIsDrawingAll(true);
    
    setTimeout(() => {
      try {
        const newDailyCards = generateDailyCards(currentTime);
        
        if (newDailyCards.length === 24) {
          setDailyCards(newDailyCards);
          setHasDrawnAll24Cards(true);
          setIsDailyTarotSaved(false);
          setShowRecordingSection(true);
          setSelectedCardIndex(currentHour);
          setHourlyMemos({});
        } else {
          Alert.alert('오류', '카드를 생성하는데 문제가 발생했습니다. 다시 시도해주세요.');
        }
      } catch (error) {
        Alert.alert('오류', '카드를 생성하는데 문제가 발생했습니다. 다시 시도해주세요.');
      } finally {
        setIsDrawingAll(false);
      }
    }, 2000);
  };

  const handleCardClick = (index) => {
    cardSelectFeedback();
    setSelectedCardIndex(index);
  };

  const handleMemoChange = (value) => {
    const targetHour = selectedCardIndex !== null ? selectedCardIndex : currentHour;
    setHourlyMemos(prev => ({
      ...prev,
      [targetHour]: value
    }));
  };

  const saveDailyTarotReading = async () => {
    if (!hasDrawnAll24Cards || dailyCards.length === 0) return;
    
    const dailyTarotSave = {
      id: Date.now().toString(),
      date: currentTime.toDateString(),
      hourlyCards: dailyCards,
      memos: hourlyMemos,
      insights: Object.values(hourlyMemos).join('\n') || 'Today\'s 24-hour tarot reading',
      savedAt: new Date().toISOString()
    };
    
    const success = await saveDailyTarot(dailyTarotSave);
    if (success) {
      setIsDailyTarotSaved(true);
      Alert.alert('저장 완료', 'Daily tarot reading has been saved to your journal!');
    }
  };

  const selectedCard = selectedCardIndex !== null ? dailyCards[selectedCardIndex] : currentCard;
  const currentMemo = hourlyMemos[selectedCardIndex !== null ? selectedCardIndex : currentHour] || '';

  const formatTimeDisplay = (hour) => {
    const timeText = formatHour(hour);
    return timeText;
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1f3a', '#4a1a4f', '#1a1f3a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* 헤더 */}
          <View style={styles.header}>
            <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
              <TarotCardsIcon color={colors.dark.premiumGold} size={56} />
            </Animated.View>
            <Text style={styles.title}>24시간 타로 타이머</Text>
            <Text style={styles.subtitle}>
              {formatDate(currentTime)}
            </Text>
            
            {hasDrawnAll24Cards && currentCard && (
              <View style={styles.timeDisplay}>
                <Text style={styles.timeLabel}>현재 시간</Text>
                <Text style={styles.timeValue}>
                  {formatTimeDisplay(selectedCardIndex !== null ? selectedCardIndex : currentHour)}
                </Text>
              </View>
            )}
          </View>

          {/* 현재 카드 표시 */}
          {hasDrawnAll24Cards && selectedCard && (
            <Card style={styles.cardSection} variant="mystical">
              <View style={styles.cardContainer}>
                <Image
                  source={{ uri: selectedCard.imageUrl }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={styles.cardOverlay}>
                  <Text style={styles.cardName}>
                    {language === 'ko' ? selectedCard.nameKr : selectedCard.name}
                  </Text>
                  <Text style={styles.cardSubName}>
                    {language === 'ko' ? selectedCard.name : selectedCard.nameKr}
                  </Text>
                </View>
                
                {selectedCardIndex === currentHour && (
                  <View style={styles.nowBadge}>
                    <Badge variant="default" style={styles.nowBadgeContent}>
                      <StarIcon color="#000" size={12} style={styles.nowIcon} />
                      <Text style={styles.nowText}>{t('timer.now')}</Text>
                    </Badge>
                  </View>
                )}
              </View>
              
              <View style={styles.cardDetails}>
                <View style={styles.keywordsContainer}>
                  {(language === 'ko' ? selectedCard.keywordsKr : selectedCard.keywords).map((keyword, index) => (
                    <Badge key={index} variant="outline" style={styles.keywordBadge}>
                      <Text style={styles.keywordText}>{keyword}</Text>
                    </Badge>
                  ))}
                </View>
                <Text style={styles.cardMeaning}>
                  {language === 'ko' ? selectedCard.meaningKr : selectedCard.meaning}
                </Text>
              </View>
            </Card>
          )}

          {/* 24시간 카드 뽑기 버튼 */}
          {!hasDrawnAll24Cards && (
            <Card style={styles.drawSection} variant="mystical">
              <View style={styles.drawContent}>
                <ZapIcon color={colors.dark.premiumGold} size={48} />
                <Text style={styles.drawTitle}>운명을 밝혀라</Text>
                <Text style={styles.drawDescription}>
                  우주의 메시지가 당신을 기다립니다
                </Text>
                <Button
                  onPress={drawAll24Cards}
                  disabled={isDrawingAll}
                  loading={isDrawingAll}
                  size="lg"
                  style={styles.drawButton}
                >
                  {isDrawingAll ? '카드를 뽑고 있습니다...' : '운명의 24장 뽑기'}
                </Button>
              </View>
            </Card>
          )}

          {/* 24시간 카드 스크롤 */}
          {hasDrawnAll24Cards && dailyCards.length > 0 && (
            <View style={styles.cardsSection}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <ClockIcon color={colors.dark.premiumGold} size={20} />
                  <Text style={styles.sectionTitle}>24시간 에너지 흐름</Text>
                </View>
              </View>
              
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.horizontalScroll}
                contentContainerStyle={styles.horizontalScrollContent}
              >
                {dailyCards.map((card, index) => (
                  <TouchableOpacity
                    key={`${card.id}-${index}`}
                    style={[
                      styles.hourCard,
                      selectedCardIndex === index && styles.selectedCard
                    ]}
                    onPress={() => handleCardClick(index)}
                  >
                    <Image
                      source={{ uri: card.imageUrl }}
                      style={styles.hourCardImage}
                      resizeMode="cover"
                    />
                    <Text style={[
                      styles.hourText,
                      index === currentHour && styles.currentHourText
                    ]}>
                      {formatHour(index)}
                    </Text>
                    {index === currentHour && (
                      <View style={styles.hourNowBadge}>
                        <Text style={styles.hourNowText}>현재</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* 메모 섹션 */}
          {showRecordingSection && (
            <Card style={styles.memoSection} variant="mystical">
              <View style={styles.memoHeader}>
                <Text style={styles.memoTitle}>신성한 저널</Text>
                {selectedCardIndex !== null && (
                  <Badge style={styles.timeBadge}>
                    <Text style={styles.timeBadgeText}>
                      {formatHour(selectedCardIndex)}
                    </Text>
                  </Badge>
                )}
              </View>
              
              <TextInput
                style={styles.memoInput}
                placeholder="이 시간의 느낌과 생각을 기록해보세요..."
                placeholderTextColor="rgba(255,255,255,0.5)"
                value={currentMemo}
                onChangeText={handleMemoChange}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              
              <View style={styles.memoFooter}>
                <Text style={styles.characterCount}>
                  {currentMemo.length}/500 자
                </Text>
              </View>
              
              <Button
                onPress={saveDailyTarotReading}
                disabled={isDailyTarotSaved}
                variant={isDailyTarotSaved ? 'secondary' : 'primary'}
                style={styles.saveButton}
              >
                {isDailyTarotSaved ? '저장됨' : '리딩 저장하기'}
              </Button>
            </Card>
          )}

          {/* Mystical Quote */}
          <Card style={styles.quoteSection}>
            <Text style={styles.quoteText}>
              "시간은 흐르지만, 각 순간은 영원한 지혜를 담고 있다."
            </Text>
          </Card>

          {/* 하단 여백 */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    paddingBottom: 120, // 탭바 공간
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  iconContainer: {
    marginBottom: spacing.md,
  },
  title: {
    ...typography.displayLarge,
    color: colors.dark.foreground,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.bodyMedium,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  timeDisplay: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  timeLabel: {
    ...typography.caption,
    color: colors.dark.premiumGold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  timeValue: {
    ...typography.displayMedium,
    color: colors.dark.foreground,
    marginTop: spacing.xs,
  },
  cardSection: {
    marginBottom: spacing.xl,
    padding: spacing.lg,
  },
  cardContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    position: 'relative',
  },
  cardImage: {
    width: 200,
    height: 300,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.dark.premiumGold,
  },
  cardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: spacing.md,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  cardName: {
    ...typography.titleMedium,
    color: colors.dark.foreground,
    textAlign: 'center',
  },
  cardSubName: {
    ...typography.bodyMedium,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 4,
  },
  nowBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  nowBadgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dark.premiumGold,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  nowIcon: {
    marginRight: 4,
  },
  nowText: {
    color: '#000',
    fontSize: 12,
    fontWeight: 'bold',
  },
  cardDetails: {
    alignItems: 'center',
  },
  keywordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  keywordBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  keywordText: {
    ...typography.caption,
    color: colors.dark.premiumGold,
  },
  cardMeaning: {
    ...typography.bodyLarge,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  drawSection: {
    marginBottom: spacing.xl,
    padding: spacing.xl,
  },
  drawContent: {
    alignItems: 'center',
  },
  drawTitle: {
    ...typography.titleLarge,
    color: colors.dark.foreground,
    textAlign: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  drawDescription: {
    ...typography.bodyLarge,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  drawButton: {
    minWidth: 200,
  },
  cardsSection: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    ...typography.titleMedium,
    color: colors.dark.foreground,
    marginLeft: spacing.sm,
  },
  horizontalScroll: {
    marginHorizontal: -spacing.lg,
  },
  horizontalScrollContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  hourCard: {
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  selectedCard: {
    transform: [{ scale: 1.1 }],
  },
  hourCardImage: {
    width: 64,
    height: 96,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  hourText: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.7)',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  currentHourText: {
    color: colors.dark.premiumGold,
    fontWeight: 'bold',
  },
  hourNowBadge: {
    backgroundColor: colors.dark.premiumGold,
    borderRadius: 8,
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    marginTop: spacing.xs,
  },
  hourNowText: {
    ...typography.caption,
    color: '#000',
    fontSize: 10,
  },
  memoSection: {
    marginBottom: spacing.xl,
    padding: spacing.lg,
  },
  memoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  memoTitle: {
    ...typography.titleMedium,
    color: colors.dark.foreground,
  },
  timeBadge: {
    backgroundColor: 'rgba(212, 175, 55, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  timeBadgeText: {
    ...typography.caption,
    color: colors.dark.premiumGold,
  },
  memoInput: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    padding: spacing.md,
    color: colors.dark.foreground,
    ...typography.bodyLarge,
    minHeight: 120,
    marginBottom: spacing.sm,
  },
  memoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  characterCount: {
    ...typography.caption,
    color: 'rgba(255,255,255,0.5)',
  },
  saveButton: {
    width: '100%',
  },
  quoteSection: {
    marginBottom: spacing.xl,
    padding: spacing.lg,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  quoteText: {
    ...typography.bodyLarge,
    color: 'rgba(255,255,255,0.8)',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomPadding: {
    height: spacing.xl,
  },
});