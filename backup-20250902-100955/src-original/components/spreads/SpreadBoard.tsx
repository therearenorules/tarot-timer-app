/**
 * SpreadBoard Component - Simple spread layout display
 */

import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from '@/components';
import { theme } from '@/constants';
import { SpreadLayout, SpreadCard } from '@/assets/spreads';

interface SpreadBoardProps {
  layout: SpreadLayout;
  drawnCards: SpreadCard[];
  timelineCards?: SpreadCard[];
  onCardDraw?: (positionIndex: number) => void;
  onCardFlip?: (positionIndex: number) => void;
  onCardPress?: (positionIndex: number) => void;
  isDrawingMode?: boolean;
  showTimeline?: boolean;
  isZoomEnabled?: boolean;
  showLabels?: boolean;
  highlightNextPosition?: boolean;
}

export function SpreadBoard({
  layout,
  drawnCards = [],
  timelineCards = [],
  onCardDraw,
  onCardFlip,
  onCardPress,
  isDrawingMode = false,
  showTimeline = false,
  isZoomEnabled = false,
  showLabels = true,
  highlightNextPosition = true,
}: SpreadBoardProps) {

  if (!layout) {
    return (
      <View style={styles.errorContainer}>
        <Text variant="body" color={theme.colors.error}>
          No spread layout available
        </Text>
      </View>
    );
  }

  const renderCard = (positionIndex: number) => {
    const card = drawnCards.find(c => c.positionIndex === positionIndex);
    const isNextPosition = !card && drawnCards.length === positionIndex && highlightNextPosition;
    
    return (
      <TouchableOpacity
        key={positionIndex}
        style={[
          styles.cardSlot,
          isNextPosition && styles.nextPosition,
        ]}
        onPress={() => {
          if (!card && onCardDraw) {
            onCardDraw(positionIndex);
          } else if (card && onCardPress) {
            onCardPress(positionIndex);
          }
        }}
        activeOpacity={0.7}
      >
        {card ? (
          <View style={styles.cardContent}>
            <Text variant="caption" style={styles.cardName} numberOfLines={2}>
              {card.cardName}
            </Text>
            {card.isReversed && (
              <Text variant="tiny" style={styles.reversedText}>
                Reversed
              </Text>
            )}
          </View>
        ) : (
          <View style={styles.emptySlot}>
            <Text variant="tiny" style={styles.emptyText}>
              Tap to Draw
            </Text>
          </View>
        )}
        
        {showLabels && layout.positions?.[positionIndex]?.label && (
          <Text variant="tiny" style={styles.positionLabel}>
            {layout.positions[positionIndex].label}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const content = (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="h3" style={styles.spreadTitle}>
          {layout.name}
        </Text>
        <Text variant="caption" color={theme.colors.textSecondary}>
          {drawnCards.length} / {layout.cardCount} cards drawn
        </Text>
      </View>

      <View style={styles.cardGrid}>
        {Array.from({ length: layout.cardCount }, (_, index) => renderCard(index))}
      </View>

      {showTimeline && timelineCards.length > 0 && (
        <View style={styles.timelineSection}>
          <Text variant="caption" style={styles.timelineTitle}>
            Timeline Cards
          </Text>
          <View style={styles.timelineGrid}>
            {timelineCards.map((card, index) => (
              <View key={`timeline-${index}`} style={styles.timelineCard}>
                <Text variant="tiny" numberOfLines={1}>
                  {card.cardName}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  if (isZoomEnabled) {
    return (
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        minimumZoomScale={0.8}
        maximumZoomScale={2}
      >
        {content}
      </ScrollView>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: theme.spacing.md,
  },
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  spreadTitle: {
    marginBottom: theme.spacing.xs,
  },
  cardGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignContent: 'flex-start',
    gap: theme.spacing.md,
  },
  cardSlot: {
    width: 80,
    height: 120,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  nextPosition: {
    borderColor: theme.colors.primary,
    borderStyle: 'dashed',
    backgroundColor: theme.colors.primary + '10',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardName: {
    textAlign: 'center',
    fontWeight: '600',
    color: theme.colors.text,
  },
  reversedText: {
    textAlign: 'center',
    color: theme.colors.accent,
    marginTop: theme.spacing.xs,
  },
  emptySlot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.6,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },
  positionLabel: {
    position: 'absolute',
    bottom: -theme.spacing.md,
    textAlign: 'center',
    color: theme.colors.textSecondary,
  },
  timelineSection: {
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  timelineTitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    color: theme.colors.secondary,
    fontWeight: '600',
  },
  timelineGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: theme.spacing.sm,
  },
  timelineCard: {
    width: 60,
    height: 80,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xs,
  },
});