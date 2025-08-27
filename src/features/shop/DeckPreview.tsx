import React, { memo } from 'react';
import { TouchableOpacity, View, StyleSheet, ViewStyle } from 'react-native';
import { Text } from '@/components';
import { theme } from '@/constants';

interface DeckInfo {
  id: string;
  name: string;
  description: string;
  price: number;
  isPremium: boolean;
  thumbnailUrl: string | null;
  cardCount: number;
}

interface Props {
  deck: DeckInfo;
  isPurchased: boolean;
  isSelected: boolean;
  onPress: () => void;
  style?: ViewStyle;
}

export const DeckPreview = memo<Props>(({ 
  deck, 
  isPurchased, 
  isSelected, 
  onPress, 
  style 
}) => {
  const getCardBackgroundColor = () => {
    switch (deck.id) {
      case 'classic':
        return '#4A5568'; // Classic blue-gray
      case 'mystical':
        return '#805AD5'; // Mystical purple
      case 'cosmic':
        return '#2B6CB0'; // Cosmic blue
      default:
        return theme.colors.surface;
    }
  };

  const getStatusText = () => {
    if (isSelected) return 'Active';
    if (!deck.isPremium) return 'Free';
    if (isPurchased) return 'Owned';
    return `$${deck.price.toFixed(2)}`;
  };

  const getStatusColor = () => {
    if (isSelected) return theme.colors.success;
    if (!deck.isPremium || isPurchased) return theme.colors.textSecondary;
    return theme.colors.primary;
  };

  return (
    <TouchableOpacity 
      style={[styles.container, style, isSelected && styles.selected]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.cardPreview, { backgroundColor: getCardBackgroundColor() }]}>
        <View style={styles.cardInner}>
          <Text style={styles.cardTitle}>{deck.name.charAt(0)}</Text>
          <View style={styles.cardPattern}>
            <View style={styles.patternDot} />
            <View style={styles.patternDot} />
            <View style={styles.patternDot} />
          </View>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text variant="body" numberOfLines={2} style={styles.title}>
          {deck.name}
        </Text>
        <Text variant="caption" color={theme.colors.textSecondary} numberOfLines={2} style={styles.description}>
          {deck.description}
        </Text>
        
        <View style={styles.footer}>
          <Text variant="caption" color={theme.colors.textSecondary}>
            {deck.cardCount} cards
          </Text>
          <View style={[styles.statusBadge, isSelected && styles.selectedBadge]}>
            <Text 
              variant="caption" 
              color={getStatusColor()}
              style={styles.statusText}
            >
              {getStatusText()}
            </Text>
          </View>
        </View>
      </View>
      
      {deck.isPremium && !isPurchased && (
        <View style={styles.premiumOverlay}>
          <Text style={styles.premiumIcon}>👑</Text>
        </View>
      )}
    </TouchableOpacity>
  );
});

DeckPreview.displayName = 'DeckPreview';

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
    position: 'relative',
  },
  selected: {
    borderColor: theme.colors.success,
    borderWidth: 2,
  },
  cardPreview: {
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cardInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.xs,
  },
  cardPattern: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  patternDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    opacity: 0.7,
  },
  content: {
    padding: theme.spacing.md,
  },
  title: {
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },
  description: {
    marginBottom: theme.spacing.md,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  selectedBadge: {
    backgroundColor: theme.colors.success + '20',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  premiumOverlay: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.warning,
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumIcon: {
    fontSize: 12,
  },
});