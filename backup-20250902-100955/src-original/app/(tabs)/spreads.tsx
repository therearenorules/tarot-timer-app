/**
 * Spreads Tab Screen - Phase 5: Spread Layout System
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  Dimensions, 
  Alert,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Button, FeatureErrorBoundary } from '@/components';
import { theme } from '@/constants';
import { useSpreadStore, spreadActions } from '@/stores/spreadStore';
import { SPREAD_SELECTION_CARDS } from '@/assets/spreads';
import { SpreadBoard } from '@/components/spreads/SpreadBoard';
import { SpreadLayout } from '@/assets/spreads';
import { handleError, createAppError, ErrorType, ErrorSeverity } from '@/lib/errorHandling';

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
  const [showSpreadSelection, setShowSpreadSelection] = useState(true);
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
      setShowSpreadSelection(false);
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
            setShowSpreadSelection(true);
            setSelectedSpreadId(null);
          }
        }
      ]
    );
  };

  const renderSpreadSelection = () => (
    <ScrollView style={styles.selectionContainer} showsVerticalScrollIndicator={false}>
      <Text variant="h2" style={styles.title}>
        스프레드 선택
      </Text>
      <Text variant="body" color={theme.colors.textSecondary} style={styles.subtitle}>
        타로 리딩을 시작할 스프레드 레이아웃을 선택하세요
      </Text>

      <View style={styles.spreadsGrid}>
        {SPREAD_SELECTION_CARDS.map((spread) => (
          <SpreadCard
            key={spread.id}
            spread={spread}
            onPress={() => handleStartSpread(spread.id)}
            onPressWithTimeline={() => {
              // Assume all spreads can have timeline for now
              handleStartSpread(spread.id, true);
            }}
          />
        ))}
      </View>

      {/* Statistics Section */}
      <View style={styles.statsSection}>
        <Text variant="h3" style={styles.statsTitle}>
          나의 통계
        </Text>
        <SpreadStats />
      </View>
    </ScrollView>
  );

  const renderSpreadBoard = () => {
    if (!spreadStore.currentLayout) return null;

    return (
      <View style={styles.boardContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Button
              title="← New Spread"
              onPress={handleBackToSelection}
              style={styles.backButton}
              variant="text"
            />
          </View>

          <View style={styles.headerCenter}>
            <Text variant="h3" style={styles.spreadTitle}>
              {spreadStore.currentLayout?.name || 'Spread'}
            </Text>
            <Text variant="caption" color={theme.colors.textSecondary}>
              {spreadStore.drawnCards.length} / {spreadStore.currentLayout?.cardCount || 0} cards
            </Text>
          </View>

          <View style={styles.headerRight}>
            {spreadStore.timelineEnabled && (
              <Button
                title="Timeline"
                onPress={() => {}}
                style={spreadStore.isTimelineMode ?
                  {...styles.timelineButton, ...styles.timelineButtonActive} :
                  styles.timelineButton
                }
                variant={spreadStore.isTimelineMode ? "primary" : "outline"}
              />
            )}
          </View>
        </View>

        {/* Spread Board */}
        <View style={styles.boardWrapper} ref={boardRef}>
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

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="📸 Capture & Save"
            onPress={handleCaptureAndSave}
            style={styles.actionButton}
            variant="primary"
            disabled={spreadStore.drawnCards.length === 0}
          />
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
              showSpreadSelection,
              selectedSpreadId 
            }
          );
          handleError(appError);
        }}
      >
        {showSpreadSelection ? renderSpreadSelection() : renderSpreadBoard()}
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

  return (
    <View style={styles.spreadCard}>
      <Text variant="h4" style={styles.spreadCardTitle}>
        {spread.name}
      </Text>
      <Text variant="caption" color={theme.colors.textSecondary} style={styles.spreadCardInfo}>
        {spread.cardCount} cards • {spread.description || 'Traditional spread'}
      </Text>
      
      <View style={styles.spreadCardActions}>
        <Button
          title="Start"
          onPress={onPress}
          style={styles.spreadCardButton}
          variant="primary"
        />
        {hasTimeline && onPressWithTimeline && (
          <Button
            title="+ Timeline"
            onPress={onPressWithTimeline}
            style={styles.timelineSpreadButton}
            variant="outline"
          />
        )}
      </View>
    </View>
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
  
  // Selection Screen
  selectionContainer: {
    flex: 1,
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
  },
  spreadsGrid: {
    gap: 16,
  },
  spreadCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: 20,
    borderWidth: 2,
    borderColor: theme.colors.mystical.border,
    // 신비로운 그림자 효과 적용
    shadowColor: theme.colors.mystical.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  spreadCardTitle: {
    marginBottom: 8,
  },
  spreadCardInfo: {
    marginBottom: 16,
  },
  spreadCardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  spreadCardButton: {
    flex: 1,
  },
  timelineSpreadButton: {
    flex: 1,
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

  // Board Screen
  boardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerLeft: {
    flex: 1,
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  backButton: {
    alignSelf: 'flex-start',
  },
  spreadTitle: {
    marginBottom: 2,
  },
  timelineButton: {
    paddingHorizontal: 16,
  },
  timelineButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  boardWrapper: {
    flex: 1,
  },
  actions: {
    padding: 16,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  actionButton: {
    width: '100%',
  },
});