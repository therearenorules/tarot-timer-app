import React, { memo } from 'react';
import { 
  View, 
  StyleSheet, 
  Modal,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { Text, Button } from '@/components';
import { theme } from '@/constants';

const { width } = Dimensions.get('window');

interface DeckInfo {
  id: string;
  name: string;
  description: string;
  price: number;
  cardCount: number;
}

interface Props {
  deck: DeckInfo;
  onConfirm: () => void;
  onCancel: () => void;
}

export const PurchaseModal = memo<Props>(({ deck, onConfirm, onCancel }) => {
  const getDeckPreviewColor = () => {
    switch (deck.id) {
      case 'mystical':
        return '#805AD5'; // Mystical purple
      case 'cosmic':
        return '#2B6CB0'; // Cosmic blue
      default:
        return theme.colors.primary;
    }
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="formSheet"
      onRequestClose={onCancel}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
            <Text variant="body" color={theme.colors.primary}>
              Cancel
            </Text>
          </TouchableOpacity>
          <Text variant="title3">Purchase Deck</Text>
          <View style={styles.spacer} />
        </View>

        <View style={styles.content}>
          <View style={[styles.deckPreview, { backgroundColor: getDeckPreviewColor() }]}>
            <View style={styles.deckInner}>
              <Text style={styles.deckTitle}>{deck.name.charAt(0)}</Text>
              <View style={styles.patternRow}>
                <View style={styles.patternDot} />
                <View style={styles.patternDot} />
                <View style={styles.patternDot} />
              </View>
            </View>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumIcon}>👑</Text>
            </View>
          </View>

          <View style={styles.info}>
            <Text variant="title2" style={styles.deckName}>
              {deck.name}
            </Text>
            <Text variant="body" color={theme.colors.textSecondary} style={styles.deckDescription}>
              {deck.description}
            </Text>
            
            <View style={styles.features}>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>🎨</Text>
                <Text variant="body">Beautiful artwork</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>🔮</Text>
                <Text variant="body">{deck.cardCount} unique cards</Text>
              </View>
              <View style={styles.feature}>
                <Text style={styles.featureIcon}>✨</Text>
                <Text variant="body">Premium experience</Text>
              </View>
            </View>
          </View>

          <View style={styles.priceSection}>
            <View style={styles.priceContainer}>
              <Text variant="title1" color={theme.colors.primary} style={styles.price}>
                ${deck.price.toFixed(2)}
              </Text>
              <Text variant="caption" color={theme.colors.textSecondary}>
                One-time purchase
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.actions}>
          <Button
            title={`Purchase for $${deck.price.toFixed(2)}`}
            onPress={onConfirm}
            style={styles.purchaseButton}
            variant="primary"
          />
          <Button
            title="Cancel"
            onPress={onCancel}
            style={styles.cancelActionButton}
            variant="outline"
          />
        </View>

        <View style={styles.disclaimer}>
          <Text variant="caption" color={theme.colors.textSecondary} style={styles.disclaimerText}>
            This is a mock purchase. No real payment will be processed.
          </Text>
        </View>
      </View>
    </Modal>
  );
});

PurchaseModal.displayName = 'PurchaseModal';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  cancelButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  spacer: {
    width: 60, // To balance the cancel button
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  deckPreview: {
    height: 150,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    position: 'relative',
  },
  deckInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  deckTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: theme.spacing.sm,
  },
  patternRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  patternDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    opacity: 0.7,
  },
  premiumBadge: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: theme.colors.warning,
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumIcon: {
    fontSize: 16,
  },
  info: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  deckName: {
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  deckDescription: {
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 20,
  },
  features: {
    gap: theme.spacing.md,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  featureIcon: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  priceSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  priceContainer: {
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  price: {
    fontWeight: '700',
  },
  actions: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  purchaseButton: {
    width: '100%',
  },
  cancelActionButton: {
    width: '100%',
  },
  disclaimer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    alignItems: 'center',
  },
  disclaimerText: {
    textAlign: 'center',
    fontStyle: 'italic',
  },
});