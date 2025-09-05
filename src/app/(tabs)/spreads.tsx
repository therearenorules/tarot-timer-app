/**
 * Spreads Tab Screen - Enhanced Navigation Structure
 * 탭 네비게이션 구조를 유지하면서 인라인 스프레드 화면 표시
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Dimensions, 
  Alert,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, FeatureErrorBoundary } from '@/components';
import { theme } from '@/constants';
import { useSpreadStore, spreadActions } from '@/stores/spreadStore';
import { SPREAD_SELECTION_CARDS } from '@/assets/spreads';
import { SpreadBoard } from '@/components/spreads/SpreadBoard';
import { SpreadLayout } from '@/assets/spreads';
import { handleError, createAppError, ErrorType, ErrorSeverity } from '@/lib/errorHandling';
import { Icon } from '@/components/ui/Icon';

const { width: screenWidth } = Dimensions.get('window');

// SpreadCard interface
interface SpreadCard {
  positionIndex: number;
  cardKey: string;
  cardName: string;
  isReversed: boolean;
  drawnAt: string;
  keywords: string[];
}

export default function SpreadsScreen() {
  // const spreadStore = useSpreadStore();
  const [selectedSpreadId, setSelectedSpreadId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'list' | 'reading'>('list');
  const boardRef = useRef<View>(null);

  // Mock spread store for now
  const spreadStore: {
    currentLayout: SpreadLayout | null;
    drawnCards: SpreadCard[];
    timelineCards: SpreadCard[];
    isDrawingMode: boolean;
    selectedCardIndex: number | null;
    isTimelineMode: boolean;
    timelineEnabled: boolean;
    isLoading: boolean;
    error: string | null;
    isInitialized: boolean;
    getSpreadStats: () => { totalSpreads: number; completedSpreads: number; averageCardsDrawn: number; };
  } = {
    currentLayout: null,
    drawnCards: [],
    timelineCards: [],
    isDrawingMode: true,
    selectedCardIndex: null,
    isTimelineMode: false,
    timelineEnabled: false,
    isLoading: false,
    error: null,
    isInitialized: true,
    getSpreadStats: () => ({
      totalSpreads: 0,
      completedSpreads: 0,
      averageCardsDrawn: 0
    })
  };

  // Initialize spread system on mount
  useEffect(() => {
    // spreadActions.initializeSpreadSystem().catch(error => {
    //   // Error logged: Failed to initialize spread system
    //   Alert.alert('Error', 'Failed to initialize spread system');
    // });
  }, []);

  const handleStartSpread = async (spreadId: string, timelineEnabled?: boolean) => {
    try {
      // await spreadActions.startNewSpread(spreadId, { timelineEnabled });
      setSelectedSpreadId(spreadId);
      setCurrentView('reading');
    } catch (error) {
      // const appError = createAppError(
      //   ErrorType.USER_ACTION,
      //   ErrorSeverity.MEDIUM,
      //   'Failed to start spread',
      //   error as Error,
      //   { spreadId, timelineEnabled }
      // );
      // handleError(appError);
    }
  };

  const handleCardDraw = async (positionIndex: number) => {
    try {
      await spreadActions.drawCardAtPosition(positionIndex);
    } catch (error) {
      const appError = createAppError(
        ErrorType.USER_ACTION,
        ErrorSeverity.MEDIUM,
        'Failed to draw card',
        error as Error,
        { positionIndex }
      );
      handleError(appError);
    }
  };

  const handleCardFlip = (positionIndex: number) => {
    spreadActions.flipCard(positionIndex);
  };

  const handleCardPress = (positionIndex: number) => {
    spreadActions.selectCard(positionIndex);
  };

  const handleCaptureAndSave = async () => {
    try {
      if (!boardRef.current) {
        Alert.alert('Error', 'Board not ready for capture');
        return;
      }

      const imageUri = await spreadActions.captureSpread(boardRef);
      
      Alert.alert(
        'Spread Captured',
        'Would you like to save it to your gallery?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Save', 
            onPress: () => spreadActions.saveSpread(imageUri, { saveToGallery: true })
          },
          {
            text: 'Share',
            onPress: () => spreadActions.shareSpread(imageUri)
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to capture spread');
    }
  };

  const handleBackToSelection = () => {
    Alert.alert(
      'New Spread',
      'Are you sure you want to start a new spread? Current progress will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Yes', 
          style: 'destructive',
          onPress: () => {
            spreadActions.clearCurrentSpread();
            setCurrentView('list');
            setSelectedSpreadId(null);
          }
        }
      ]
    );
  };

  const renderSpreadSelection = () => (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.headerIcon}>
          <Icon name="layout" size={48} color={theme.colors.premiumGold} />
        </View>
        <Text variant="h1" style={styles.headerTitle}>
          Spreads
        </Text>
        <Text variant="body" style={styles.headerSubtitle}>
          다양한 상황에 맞는 타로 스프레드를 선택하세요
        </Text>
      </View>

      {/* Scrollable Spreads List */}
      <ScrollView 
        style={styles.spreadsScrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.spreadsContainer}
      >
        {SPREAD_SELECTION_CARDS.map((spread) => (
          <SpreadCard
            key={spread.id}
            spread={spread}
            onPress={() => handleStartSpread(spread.id)}
            onPressWithTimeline={() => {
              handleStartSpread(spread.id, true);
            }}
          />
        ))}

        {/* Statistics Section */}
        <View style={styles.statsSection}>
          <Text variant="h3" style={styles.statsTitle}>
            나의 통계
          </Text>
          <SpreadStats />
        </View>
      </ScrollView>
    </View>
  );

  const renderSpreadReading = () => {
    // Mock spread data for UI demonstration
    const selectedSpread = SPREAD_SELECTION_CARDS.find(s => s.id === selectedSpreadId);
    if (!selectedSpread) return null;

    return (
      <View style={styles.readingContainer}>
        {/* Fixed Top Header */}
        <View style={styles.fixedHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackToSelection}
          >
            <Icon name="arrow-left" size={20} color={theme.colors.premiumGold} />
          </TouchableOpacity>
          
          <View style={styles.headerInfo}>
            <Text variant="h3" style={styles.spreadName}>
              {selectedSpread.name}
            </Text>
            <Text variant="caption" style={styles.spreadProgress}>
              {spreadStore.drawnCards.length} / {selectedSpread.cardCount} cards
            </Text>
          </View>
        </View>

        {/* Scrollable Content Area */}
        <ScrollView 
          style={styles.scrollableContent}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Reading Title Input */}
          <View style={styles.titleInputSection}>
            <Text variant="body" style={styles.inputLabel}>
              리딩 제목
            </Text>
            <View style={styles.titleInputContainer}>
              <Text style={styles.titleInput}>
                오늘의 타로 리딩
              </Text>
            </View>
          </View>

          {/* Spread Board Area */}
          <View style={styles.spreadBoardArea} ref={boardRef}>
            <SpreadBoard
              layout={spreadStore.currentLayout}
              drawnCards={spreadStore.drawnCards}
              timelineCards={spreadStore.timelineCards}
              onCardDraw={handleCardDraw}
              onCardFlip={handleCardFlip}
              onCardPress={handleCardPress}
              isDrawingMode={spreadStore.isDrawingMode}
              showTimeline={spreadStore.isTimelineMode}
              isZoomEnabled={true}
              showLabels={true}
              highlightNextPosition={true}
            />
          </View>

          {/* Additional spacing for fixed buttons */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Fixed Bottom Buttons */}
        <View style={styles.fixedButtons}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.primaryButton]}
            onPress={() => handleCardDraw(0)}
          >
            <Text style={styles.primaryButtonText}>카드 뽑기</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={handleCaptureAndSave}
          >
            <Text style={styles.secondaryButtonText}>저장</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => {
              spreadActions.clearCurrentSpread();
            }}
          >
            <Text style={styles.secondaryButtonText}>다시뽑기</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (spreadStore.isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
        <View style={styles.centerContent}>
          <Text variant="h3">Initializing Spread System...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (spreadStore.error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
        <View style={styles.centerContent}>
          <Text variant="h3" color={theme.colors.error}>
            Error
          </Text>
          <Text variant="body" style={styles.errorText}>
            {spreadStore.error}
          </Text>
          <Button
            title="Retry"
            onPress={() => spreadActions.initializeSpreadSystem()}
            style={styles.retryButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      <FeatureErrorBoundary
        featureName="타로 스프레드"
        fallbackMessage="타로 스프레드 기능에서 문제가 발생했습니다. 다른 기능은 정상적으로 사용하실 수 있습니다."
        onError={(error, errorInfo) => {
          const appError = createAppError(
            ErrorType.SYSTEM,
            ErrorSeverity.HIGH,
            'Spread system error',
            error,
            { 
              location: 'SpreadsScreen',
              componentStack: errorInfo.componentStack,
              currentView,
              selectedSpreadId 
            }
          );
          handleError(appError);
        }}
      >
        {currentView === 'list' ? renderSpreadSelection() : renderSpreadReading()}
      </FeatureErrorBoundary>
    </SafeAreaView>
  );
}

// Spread Card Component
interface SpreadCardProps {
  spread: {
    id: string;
    name: string;
    description?: string;
    cardCount: number;
    additionalCards?: {
      timeline?: {
        enabled: boolean;
      };
    };
  };
  onPress: () => void;
  onPressWithTimeline?: () => void;
}

function SpreadCard({ spread, onPress, onPressWithTimeline }: SpreadCardProps) {
  const hasTimeline = spread.cardCount >= 3; // Simple rule: 3+ card spreads can have timeline
  const isPremium = spread.difficulty === 'advanced';

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <View style={styles.spreadCard}>
        {/* Glow Effect Background */}
        <View style={styles.spreadCardGlow} />
        
        <View style={styles.spreadCardContent}>
          {/* Header with icon and title */}
          <View style={styles.spreadCardHeader}>
            <View style={styles.spreadCardIconContainer}>
              <Icon 
                name="layout" 
                size={24} 
                color={theme.colors.premiumGold} 
              />
            </View>
            <View style={styles.spreadCardTitleContainer}>
              <Text variant="h4" style={styles.spreadCardTitle}>
                {spread.name}
              </Text>
              {isPremium && (
                <View style={styles.premiumBadge}>
                  <Icon name="star" size={12} color={theme.colors.background} />
                  <Text style={styles.premiumBadgeText}>프리미엄</Text>
                </View>
              )}
              {!isPremium && (
                <View style={styles.basicBadge}>
                  <Text style={styles.basicBadgeText}>기본</Text>
                </View>
              )}
            </View>
          </View>
          
          {/* Subtitle */}
          <Text variant="caption" style={styles.spreadCardSubtitle}>
            {spread.description}
          </Text>
          
          {/* Description Box */}
          <View style={styles.spreadCardDescription}>
            <Text style={styles.spreadCardDescriptionText}>
              {spread.cardCount}장의 카드를 사용하는 {spread.difficulty} 레벨 스프레드입니다.
            </Text>
          </View>
          
          {/* Start Button */}
          <TouchableOpacity 
            style={styles.startButton}
            onPress={onPress}
            activeOpacity={0.8}
          >
            <Icon name="zap" size={16} color={theme.colors.background} />
            <Text style={styles.startButtonText}>리딩 시작</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

// Statistics Component
function SpreadStats() {
  const stats = useSpreadStore(state => state.getSpreadStats());

  return (
    <View style={styles.stats}>
      <View style={styles.statItem}>
        <Text variant="h4" style={styles.statValue}>
          {stats.totalSpreads}
        </Text>
        <Text variant="caption" color={theme.colors.textSecondary}>
          총 스프레드
        </Text>
      </View>
      
      <View style={styles.statItem}>
        <Text variant="h4" style={styles.statValue}>
          {stats.completedSpreads}
        </Text>
        <Text variant="caption" color={theme.colors.textSecondary}>
          완료됨
        </Text>
      </View>
      
      <View style={styles.statItem}>
        <Text variant="h4" style={styles.statValue}>
          {stats.averageCardsDrawn}
        </Text>
        <Text variant="caption" color={theme.colors.textSecondary}>
          평균 카드
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  retryButton: {
    minWidth: 120,
  },
  
  // Header Section
  headerSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  headerIcon: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.premiumGold,
    textAlign: 'center',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    opacity: 0.8,
  },
  
  // Spreads List
  spreadsScrollView: {
    flex: 1,
  },
  spreadsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 24,
  },
  
  // Spread Card
  spreadCard: {
    position: 'relative',
    marginBottom: 24,
  },
  spreadCardGlow: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    backgroundColor: `${theme.colors.premiumGold}20`,
    borderRadius: 24,
    opacity: 0,
  },
  spreadCardContent: {
    backgroundColor: `${theme.colors.surface}E6`,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: `${theme.colors.border}40`,
    shadowColor: theme.colors.premiumGold,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  spreadCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  spreadCardIconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  spreadCardTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spreadCardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    flex: 1,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.premiumGold,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  premiumBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.background,
  },
  basicBadge: {
    backgroundColor: `${theme.colors.primary}40`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${theme.colors.primary}60`,
  },
  basicBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  spreadCardSubtitle: {
    color: `${theme.colors.premiumGold}CC`,
    marginBottom: 16,
    fontSize: 12,
  },
  spreadCardDescription: {
    backgroundColor: `${theme.colors.background}80`,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${theme.colors.border}20`,
    marginBottom: 20,
  },
  spreadCardDescriptionText: {
    color: `${theme.colors.text}E6`,
    fontSize: 14,
    lineHeight: 20,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.premiumGold,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    shadowColor: theme.colors.premiumGold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  startButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: '700',
  },
  
  // Statistics
  statsSection: {
    marginTop: 40,
    paddingTop: 30,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  statsTitle: {
    textAlign: 'center',
    marginBottom: 20,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    color: theme.colors.premiumGold,
    marginBottom: 4,
    fontWeight: '700',
  },

  // Reading Screen - 3-Layer Fixed Layout
  readingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // Fixed Top Header
  fixedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: `${theme.colors.background}E6`,
    borderBottomWidth: 1,
    borderBottomColor: `${theme.colors.border}20`,
    backdropFilter: 'blur(10px)',
    zIndex: 10,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    backgroundColor: `${theme.colors.surface}80`,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${theme.colors.border}40`,
  },
  headerInfo: {
    flex: 1,
    alignItems: 'center',
  },
  spreadName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 2,
  },
  spreadProgress: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  
  // Scrollable Content
  scrollableContent: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 80, // Space for fixed buttons
  },
  
  // Title Input Section
  titleInputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
  },
  titleInputContainer: {
    backgroundColor: `${theme.colors.surface}80`,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${theme.colors.border}40`,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  titleInput: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '500',
  },
  
  // Spread Board Area
  spreadBoardArea: {
    marginVertical: 24,
    minHeight: 400,
  },
  
  // Bottom Spacer
  bottomSpacer: {
    height: 20,
  },
  
  // Fixed Bottom Buttons
  fixedButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: `${theme.colors.background}F0`,
    borderTopWidth: 1,
    borderTopColor: `${theme.colors.border}20`,
    backdropFilter: 'blur(10px)',
    gap: 12,
    zIndex: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: theme.colors.premiumGold,
    shadowColor: theme.colors.premiumGold,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  primaryButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: `${theme.colors.surface}80`,
    borderWidth: 1,
    borderColor: `${theme.colors.border}60`,
  },
  secondaryButtonText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
});