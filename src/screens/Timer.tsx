import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  Alert,
  Platform,
  TextInput,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { generateDailyCards, getCurrentHour, formatHour, formatDate, saveDailyTarot, getTodaysSave, type TarotCard, type DailyTarotSave } from '../utils/tarot';
import { useLanguage } from '../providers/LanguageProvider';
import { 
  Sparkles, 
  Clock, 
  BookOpen, 
  RotateCcw, 
  Star, 
  Save, 
  Zap,
  Moon,
  Sun
} from '../components/mystical-ui/icons';
import { TouchFeedback } from '../components/TouchFeedback';
import { MysticalPulse, GentleGlow, LoadingSpinner, ScaleHover, GentleFloat } from '../components/AnimationComponents';
import { tokens } from '../constants/DesignTokens';

// 🔮 Enhanced Mystical Design System Imports
import { 
  CosmicBackgroundGradient, 
  MysticalPurpleGradient,
  AurumGlowGradient,
  CardOverlayGradient,
  HourCardOverlayGradient,
  RadialGlowGradient,
  GlassMorphismGradient,
  TimeBasedGradient
} from '../design-system/components/gradients/MysticalGradients';
import { MysticalTheme } from '../design-system/themes/mystical-theme';

interface TimerProps {}

export const Timer: React.FC<TimerProps> = () => {
  const { t, language } = useLanguage();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hourlyMemos, setHourlyMemos] = useState<{ [hour: number]: string }>({});
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [hasDrawnAll24Cards, setHasDrawnAll24Cards] = useState(false);
  const [isDrawingAll, setIsDrawingAll] = useState(false);
  const [dailyCards, setDailyCards] = useState<TarotCard[]>([]);
  const [isDailyTarotSaved, setIsDailyTarotSaved] = useState(false);
  const [showRecordingSection, setShowRecordingSection] = useState(false);
  
  const currentHour = getCurrentHour();

  // 컴포넌트 마운트 시 오늘의 카드들과 저장 상태 확인
  useEffect(() => {
    const checkTodaysSave = async () => {
      const todaysSave = await getTodaysSave();
      if (todaysSave) {
        setDailyCards(todaysSave.hourlyCards);
        setHasDrawnAll24Cards(true);
        setIsDailyTarotSaved(true);
        setShowRecordingSection(true);
        setHourlyMemos(todaysSave.memos || {});
      } else {
        setDailyCards([]);
        setHasDrawnAll24Cards(false);
        setIsDailyTarotSaved(false);
        setShowRecordingSection(false);
        setHourlyMemos({});
      }
    };
    
    checkTodaysSave();
  }, []);
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  const currentCard = dailyCards[currentHour] || null;

  // 24시간 카드 한번에 뽑기
  const drawAll24Cards = () => {
    setIsDrawingAll(true);
    
    setTimeout(() => {
      const newDailyCards = generateDailyCards(currentTime);
      setDailyCards(newDailyCards);
      setHasDrawnAll24Cards(true);
      setIsDrawingAll(false);
      setIsDailyTarotSaved(false);
      setShowRecordingSection(true);
      setSelectedCardIndex(currentHour);
      setHourlyMemos({});
    }, 2000);
  };
  
  // 다시 뽑기
  const redrawAll24Cards = () => {
    setIsDrawingAll(true);
    
    setTimeout(() => {
      const newDailyCards = generateDailyCards(new Date(currentTime.getTime() + Math.random() * 1000));
      setDailyCards(newDailyCards);
      setHasDrawnAll24Cards(true);
      setIsDrawingAll(false);
      setIsDailyTarotSaved(false);
      setShowRecordingSection(true);
      setSelectedCardIndex(currentHour);
      setHourlyMemos({});
    }, 2000);
  };
  
  const handleCardClick = (index: number) => {
    setSelectedCardIndex(index);
  };
  
  // 현재 선택된 카드 시간의 메모 업데이트
  const handleMemoChange = (value: string) => {
    const targetHour = selectedCardIndex !== null ? selectedCardIndex : currentHour;
    setHourlyMemos(prev => ({
      ...prev,
      [targetHour]: value
    }));
  };
  
  // 데일리 타로 저장하기
  const saveDailyTarotReading = async () => {
    if (!hasDrawnAll24Cards || dailyCards.length === 0) return;
    
    const dailyTarotSave: DailyTarotSave = {
      id: Date.now().toString(),
      date: currentTime.toDateString(),
      hourlyCards: dailyCards,
      memos: hourlyMemos,
      savedAt: new Date().toISOString()
    };
    
    await saveDailyTarot(dailyTarotSave);
    setIsDailyTarotSaved(true);
    
    Alert.alert(
      'Success',
      'Daily tarot reading has been saved to your journal!',
      [{ text: 'OK' }]
    );
  };
  
  const selectedCard = selectedCardIndex !== null ? dailyCards[selectedCardIndex] : currentCard;
  const isCurrentHourSelected = selectedCardIndex === currentHour;
  const currentMemo = hourlyMemos[selectedCardIndex !== null ? selectedCardIndex : currentHour] || '';
  
  // Enhanced time display formatting with mystical styling
  const formatTimeDisplay = (hour: number) => {
    const timeText = formatHour(hour);
    return (
      <View style={styles.timeDisplay}>
        <Text style={styles.timeLabel}>{t('timer.currentHour')}</Text>
        <Text style={styles.timeValue}>{timeText}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* 🌌 Enhanced Cosmic Background with Time-Based Gradients */}
      <CosmicBackgroundGradient style={styles.backgroundGradient} />
      
      {/* 🔮 Secondary Mystical Purple Layer */}
      <TimeBasedGradient 
        hour={currentHour} 
        style={[styles.backgroundGradient, { opacity: 0.7 }]} 
      />
      
      {/* ✨ Radial Glow Effects */}
      <RadialGlowGradient 
        color={tokens.colors.aurumGlow}
        style={[styles.backgroundGradient, { opacity: 0.3 }]} 
      />
      
      {/* Floating mystical elements */}
      <View style={styles.mysticalElements}>
        <MysticalPulse style={[styles.floatingElement, { top: 40, left: 40 }]}>
          <View style={[styles.dot, { backgroundColor: tokens.colors.premiumGold }]} />
        </MysticalPulse>
        <GentleFloat style={[styles.floatingElement, { top: 128, right: 64 }]}>
          <View style={[styles.smallDot, { backgroundColor: tokens.colors.card }]} />
        </GentleFloat>
        <MysticalPulse style={[styles.floatingElement, { bottom: 160, left: 80 }]}>
          <View style={[styles.mediumDot, { backgroundColor: tokens.colors.premiumGold }]} />
        </MysticalPulse>
      </View>
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Mystical Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <GentleGlow style={styles.iconGlowEffect}>
              <View style={styles.iconContainer}>
                <MysticalPulse>
                  <Sparkles size={64} color="#D4AF37" />
                </MysticalPulse>
                <View style={styles.iconGlow} />
              </View>
            </GentleGlow>
          </View>
          
          <Text style={styles.title}>🔮 SACRED COSMIC TAROT DIVINATION 🔮</Text>
          <Text style={styles.subtitle}>✨ {formatDate(currentTime)} - 신비로운 우주의 시간 ✨</Text>
          
          {hasDrawnAll24Cards && currentCard && (
            <View style={styles.timeContainer}>
              {formatTimeDisplay(selectedCardIndex !== null ? selectedCardIndex : currentHour)}
            </View>
          )}
        </View>

        {/* Current Card Display - Enhanced for mystical feel */}
        {hasDrawnAll24Cards && selectedCard && (
          <View style={styles.cardDisplayContainer}>
            <View style={styles.cardGlowBackground} />
            <GlassMorphismGradient style={styles.cardDisplay}>
              <View style={styles.cardImageContainer}>
                <ScaleHover>
                  <Image
                    source={{ uri: selectedCard.imageUrl }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                </ScaleHover>
                <CardOverlayGradient style={styles.cardImageOverlay} />
              </View>
              
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>
                  {language === 'ko' ? selectedCard.nameKr : selectedCard.name}
                </Text>
                <Text style={styles.cardDescription}>
                  {language === 'ko' ? selectedCard.descriptionKr : selectedCard.description}
                </Text>
                
                <View style={styles.keywordContainer}>
                  {(language === 'ko' ? selectedCard.keywordsKr : selectedCard.keywords).map((keyword, index) => (
                    <View key={index} style={styles.keyword}>
                      <Text style={styles.keywordText}>{keyword}</Text>
                      <Sparkles size={12} color={tokens.colors.premiumGold} />
                    </View>
                  ))}
                </View>
              </View>
            </GlassMorphismGradient>
          </View>
        )}

        {/* Drawing Controls */}
        {!hasDrawnAll24Cards ? (
          <View style={styles.drawingSection}>
            {isDrawingAll ? (
              <View style={styles.drawingProgress}>
                <View style={styles.loadingContainer}>
                  <LoadingSpinner size={32} color={tokens.colors.premiumGold} />
                  <MysticalPulse>
                    <View style={styles.cosmicOrb} />
                  </MysticalPulse>
                </View>
                <Text style={styles.drawingText}>Drawing your 24-hour tarot...</Text>
                <Text style={styles.drawingSubtext}>Connecting with cosmic energy...</Text>
              </View>
            ) : (
              <View style={styles.drawButtonContainer}>
                <TouchFeedback
                  style={styles.drawButton}
                  onPress={drawAll24Cards}
                  touchType="premiumButton"
                  hapticFeedback={true}
                >
                  <AurumGlowGradient style={styles.drawButtonGradient}>
                    <TarotCards size={32} color={tokens.colors.deepPurple} />
                    <Text style={styles.drawButtonText}>🔮 신성한 24시간 타로 카드 뽑기 🔮</Text>
                  </AurumGlowGradient>
                </TouchFeedback>
                <Text style={styles.drawDescription}>
                  Reveal your guidance for each hour of the day
                </Text>
              </View>
            )}
          </View>
        ) : (
          <>
          {/* 24-Hour Cards Grid */}
          <View style={styles.cardsGridSection}>
            <View style={styles.sectionHeader}>
              <Clock size={28} color="#D4AF37" />
              <Text style={styles.sectionTitle}>⏰ 24-Hour Reading</Text>
              <TouchFeedback
                style={styles.redrawButton}
                onPress={redrawAll24Cards}
                touchType="secondaryButton"
                hapticFeedback={true}
              >
                <RotateCcw size={16} color={tokens.colors.premiumGold} />
                <Text style={styles.redrawText}>Redraw</Text>
              </TouchFeedback>
            </View>

            <ScrollView 
              horizontal 
              style={styles.cardsGrid}
              contentContainerStyle={styles.cardsGridContent}
              showsHorizontalScrollIndicator={false}
            >
              {dailyCards.map((card, index) => {
                const isSelected = selectedCardIndex === index;
                const isCurrent = index === currentHour;
                
                return (
                  <TouchFeedback
                    key={index}
                    style={[
                      styles.hourCard,
                      isSelected && styles.selectedCard,
                      isCurrent && styles.currentHourCard
                    ]}
                    onPress={() => handleCardClick(index)}
                    touchType="tarotCard"
                    hapticFeedback={true}
                  >
                    <Image
                      source={{ uri: card.imageUrl }}
                      style={styles.hourCardImage}
                      resizeMode="cover"
                    />
                    <HourCardOverlayGradient style={styles.hourCardOverlay}>
                      <Text style={styles.hourText}>{formatHour(index)}</Text>
                      {isCurrent && (
                        <MysticalPulse style={styles.currentIndicator}>
                          <Star size={12} color={tokens.colors.premiumGold} />
                        </MysticalPulse>
                      )}
                      {isSelected && (
                        <View style={styles.selectedGlow} />
                      )}
                    </HourCardOverlayGradient>
                  </TouchFeedback>
                );
              })}
            </ScrollView>
          </View>

          {/* Memo Section - Enhanced */}
          {showRecordingSection && (
            <View style={styles.memoSection}>
              <View style={styles.memoHeader}>
                <BookOpen size={28} color="#D4AF37" />
                <Text style={styles.memoTitle}>
                  📝 {selectedCardIndex !== null 
                    ? `${formatHour(selectedCardIndex)} Insights` 
                    : `${formatHour(currentHour)} Insights`
                  }
                </Text>
              </View>
              
              <BlurView intensity={Platform.OS === 'ios' ? 15 : 80} style={styles.memoInputContainer}>
                <TextInput
                  style={styles.memoInput}
                  multiline
                  numberOfLines={4}
                  placeholder="Record your insights and reflections..."
                  placeholderTextColor={tokens.colors.mutedForeground}
                  value={currentMemo}
                  onChangeText={handleMemoChange}
                />
              </BlurView>
            </View>
          )}

          {/* Save Button - Premium Style */}
          {showRecordingSection && (
            <View style={styles.saveSection}>
              <TouchFeedback
                style={[
                  styles.saveButton,
                  isDailyTarotSaved && styles.savedButton
                ]}
                onPress={saveDailyTarotReading}
                touchType={isDailyTarotSaved ? "card" : "premiumButton"}
                hapticFeedback={true}
              >
                <LinearGradient
                  colors={isDailyTarotSaved 
                    ? ['#2a1f3d', '#4a1a4f']
                    : ['#D4AF37', '#F4D03F', '#E6C547']
                  }
                  style={styles.saveButtonGradient}
                >
                  <Save size={24} color={isDailyTarotSaved ? '#D4AF37' : '#0f0a1a'} />
                  <Text style={[
                    styles.saveButtonText,
                    isDailyTarotSaved && styles.savedButtonText
                  ]}>
                    {isDailyTarotSaved ? '✅ Saved to Journal' : '💾 Save to Journal'}
                  </Text>
                </LinearGradient>
              </TouchFeedback>
            </View>
          )}
          </>
        )}
        
        {/* Bottom padding for safe scrolling */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...MysticalTheme.components.screenContainer,
  },
  backgroundGradient: {
    ...MysticalTheme.components.cosmicBackground,
  },
  mysticalElements: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  floatingElement: {
    position: 'absolute',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  smallDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  mediumDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  scrollView: {
    flex: 1,
    zIndex: 2,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    ...MysticalTheme.components.mysticalHeader,
  },
  headerIconContainer: {
    marginBottom: tokens.spacing.lg,
  },
  iconGlowEffect: {
    padding: tokens.spacing.md,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlow: {
    position: 'absolute',
    top: -12,
    left: -12,
    right: -12,
    bottom: -12,
    backgroundColor: tokens.colors.premiumGold,
    opacity: 0.3,
    borderRadius: 30,
  },
  title: {
    ...MysticalTheme.components.cosmicTitle,
  },
  subtitle: {
    ...MysticalTheme.components.mysticalSubtitle,
  },
  timeContainer: {
    alignItems: 'center',
    marginTop: tokens.spacing.lg,
  },
  timeDisplay: {
    alignItems: 'center',
  },
  timeLabel: {
    fontSize: tokens.fontSize.sm,
    color: tokens.colors.premiumGold + '80',
    fontWeight: tokens.fontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: tokens.spacing.xs,
  },
  timeValue: {
    fontSize: 28,
    fontWeight: tokens.fontWeight.bold,
    color: tokens.colors.card,
    textShadowColor: tokens.colors.premiumGold + '60',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardDisplayContainer: {
    marginBottom: tokens.spacing.xl,
    paddingHorizontal: tokens.spacing.lg,
    position: 'relative',
  },
  cardGlowBackground: {
    position: 'absolute',
    top: -16,
    left: 0,
    right: 0,
    bottom: -16,
    backgroundColor: tokens.colors.premiumGold + '20',
    borderRadius: 24,
    transform: [{ scale: 1.02 }],
  },
  cardDisplay: {
    borderRadius: tokens.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: tokens.colors.border + '20',
    backgroundColor: tokens.colors.card + '10',
  },
  cardImageContainer: {
    height: 300,
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardImageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  cardInfo: {
    padding: tokens.spacing.lg,
  },
  cardName: {
    fontSize: tokens.fontSize.xl,
    fontWeight: tokens.fontWeight.bold,
    color: tokens.colors.card,
    textAlign: 'center',
    marginBottom: tokens.spacing.md,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardDescription: {
    fontSize: tokens.fontSize.base,
    color: tokens.colors.card + '90',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: tokens.spacing.lg,
  },
  keywordContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: tokens.spacing.sm,
  },
  keyword: {
    backgroundColor: tokens.colors.premiumGold + '20',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs,
    borderRadius: tokens.borderRadius.xl,
    borderWidth: 1,
    borderColor: tokens.colors.premiumGold + '40',
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
  },
  keywordText: {
    fontSize: tokens.fontSize.sm,
    color: tokens.colors.premiumGold,
    fontWeight: tokens.fontWeight.medium,
  },
  drawingSection: {
    paddingHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.xl,
  },
  drawingProgress: {
    alignItems: 'center',
    paddingVertical: tokens.spacing.xl,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.lg,
    position: 'relative',
  },
  cosmicOrb: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: tokens.colors.premiumGold + '30',
  },
  drawingText: {
    fontSize: tokens.fontSize.lg,
    fontWeight: tokens.fontWeight.semibold,
    color: tokens.colors.card,
    textAlign: 'center',
    marginBottom: tokens.spacing.sm,
  },
  drawingSubtext: {
    fontSize: tokens.fontSize.base,
    color: tokens.colors.card + '70',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  drawButtonContainer: {
    alignItems: 'center',
  },
  drawButton: {
    borderRadius: tokens.borderRadius.xl,
    marginBottom: tokens.spacing.lg,
    shadowColor: tokens.colors.premiumGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  drawButtonGradient: {
    paddingHorizontal: tokens.spacing.xxl,
    paddingVertical: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },
  drawButtonText: {
    fontSize: tokens.fontSize.lg,
    fontWeight: tokens.fontWeight.bold,
    color: tokens.colors.midnightBlue,
  },
  drawDescription: {
    fontSize: tokens.fontSize.base,
    color: tokens.colors.card + '80',
    textAlign: 'center',
    paddingHorizontal: tokens.spacing.lg,
    fontStyle: 'italic',
  },
  cardsGridSection: {
    marginBottom: tokens.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
  },
  sectionTitle: {
    fontSize: tokens.fontSize.lg,
    fontWeight: tokens.fontWeight.semibold,
    color: tokens.colors.card,
    marginLeft: tokens.spacing.sm,
    flex: 1,
  },
  redrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.xs,
    backgroundColor: tokens.colors.premiumGold + '20',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.borderRadius.lg,
    borderWidth: 1,
    borderColor: tokens.colors.premiumGold + '40',
  },
  redrawText: {
    fontSize: tokens.fontSize.sm,
    color: tokens.colors.premiumGold,
    fontWeight: tokens.fontWeight.medium,
  },
  cardsGrid: {
    maxHeight: 140,
  },
  cardsGridContent: {
    paddingHorizontal: tokens.spacing.lg,
    gap: tokens.spacing.md,
  },
  hourCard: {
    width: 90,
    height: 120,
    borderRadius: tokens.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedCard: {
    borderColor: tokens.colors.premiumGold,
    shadowColor: tokens.colors.premiumGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 10,
  },
  currentHourCard: {
    borderColor: tokens.colors.accent,
    shadowColor: tokens.colors.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },
  selectedGlow: {
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    backgroundColor: tokens.colors.premiumGold + '30',
    borderRadius: tokens.borderRadius.lg,
  },
  hourCardImage: {
    width: '100%',
    height: '70%',
  },
  hourCardOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hourText: {
    fontSize: tokens.fontSize.sm,
    fontWeight: tokens.fontWeight.bold,
    color: tokens.colors.card,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  currentIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: tokens.colors.accent + '90',
    borderRadius: 10,
    padding: 4,
  },
  memoSection: {
    paddingHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.xl,
  },
  memoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
  },
  memoTitle: {
    fontSize: tokens.fontSize.lg,
    fontWeight: tokens.fontWeight.semibold,
    color: tokens.colors.card,
    marginLeft: tokens.spacing.sm,
  },
  memoInputContainer: {
    borderRadius: tokens.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: tokens.colors.border + '40',
  },
  memoInput: {
    padding: tokens.spacing.lg,
    fontSize: tokens.fontSize.base,
    color: tokens.colors.card,
    minHeight: 120,
    textAlignVertical: 'top',
    backgroundColor: 'transparent',
  },
  saveSection: {
    paddingHorizontal: tokens.spacing.lg,
    marginBottom: tokens.spacing.lg,
  },
  saveButton: {
    borderRadius: tokens.borderRadius.xl,
    shadowColor: tokens.colors.premiumGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonGradient: {
    paddingHorizontal: tokens.spacing.xxl,
    paddingVertical: tokens.spacing.lg,
    borderRadius: tokens.borderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.spacing.md,
  },
  savedButton: {
    shadowOpacity: 0.1,
  },
  saveButtonText: {
    fontSize: tokens.fontSize.lg,
    fontWeight: tokens.fontWeight.bold,
    color: tokens.colors.midnightBlue,
  },
  savedButtonText: {
    color: tokens.colors.mutedForeground,
  },
});