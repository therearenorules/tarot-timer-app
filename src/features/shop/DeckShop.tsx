import React, { useState, useEffect, memo } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions
} from 'react-native';
import { Text, Button } from '@/components';
import { theme } from '@/constants';
import { useDeckStore } from '@/stores/deckStore';
import { DeckPreview } from './DeckPreview';
import { PurchaseModal } from './PurchaseModal';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

// Mock premium decks data
const AVAILABLE_DECKS = [
  {
    id: 'classic',
    name: 'Classic Rider-Waite',
    description: 'Traditional 78-card tarot deck',
    price: 0,
    isPremium: false,
    isPurchased: true,
    thumbnailUrl: null,
    cardCount: 78,
  },
  {
    id: 'mystical',
    name: 'Mystical Dreams',
    description: 'Ethereal artwork with cosmic themes',
    price: 4.99,
    isPremium: true,
    isPurchased: false,
    thumbnailUrl: null,
    cardCount: 78,
  },
  {
    id: 'cosmic',
    name: 'Cosmic Visions',
    description: 'Space-inspired modern tarot deck',
    price: 6.99,
    isPremium: true,
    isPurchased: false,
    thumbnailUrl: null,
    cardCount: 78,
  }
];

interface Props {
  onClose: () => void;
}

export const DeckShop = memo<Props>(({ onClose }) => {
  const [selectedDeck, setSelectedDeck] = useState<any>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [purchasedDecks, setPurchasedDecks] = useState<Set<string>>(new Set(['classic']));
  
  const deckStore = useDeckStore();

  const handleDeckPress = (deck: any) => {
    if (deck.isPremium && !purchasedDecks.has(deck.id)) {
      // Show purchase modal for unpurchased premium decks
      setSelectedDeck(deck);
      setShowPurchaseModal(true);
    } else {
      // Switch to this deck if it's free or already purchased
      handleSelectDeck(deck);
    }
  };

  const handleSelectDeck = async (deck: any) => {
    try {
      await deckStore.selectDeck(deck.id);
      Alert.alert(
        'Deck Selected',
        `You are now using the ${deck.name} deck`,
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to switch deck');
    }
  };

  const handlePurchase = async (deck: any) => {
    try {
      // Mock purchase process
      console.log(`Purchasing deck: ${deck.id} for $${deck.price}`);
      
      // Simulate purchase success
      const newPurchasedDecks = new Set(purchasedDecks);
      newPurchasedDecks.add(deck.id);
      setPurchasedDecks(newPurchasedDecks);
      
      setShowPurchaseModal(false);
      
      Alert.alert(
        'Purchase Successful!',
        `You now own the ${deck.name} deck. Would you like to use it now?`,
        [
          { text: 'Later', style: 'cancel' },
          { text: 'Use Now', onPress: () => handleSelectDeck(deck) }
        ]
      );
    } catch (error) {
      Alert.alert('Purchase Failed', 'Please try again later');
    }
  };

  const handleRestorePurchases = () => {
    Alert.alert(
      'Restore Purchases',
      'This would restore any previous deck purchases.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Restore', onPress: () => console.log('Restore purchases') }
      ]
    );
  };

  const renderDeck = ({ item: deck }: { item: any }) => (
    <DeckPreview
      deck={deck}
      isPurchased={purchasedDecks.has(deck.id)}
      isSelected={deck.id === deckStore.selectedDeckId}
      onPress={() => handleDeckPress(deck)}
      style={{ width: CARD_WIDTH }}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text variant="body" color={theme.colors.primary} style={styles.closeButtonText}>
            ← Done
          </Text>
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text variant="title3">Deck Shop</Text>
          <Text variant="caption" color={theme.colors.textSecondary}>
            Choose your tarot deck
          </Text>
        </View>
        
        <TouchableOpacity onPress={handleRestorePurchases} style={styles.restoreButton}>
          <Text variant="caption" color={theme.colors.primary}>
            Restore
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={AVAILABLE_DECKS}
        renderItem={renderDeck}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.deckList}
        showsVerticalScrollIndicator={false}
      />

      {/* Purchase Modal */}
      {showPurchaseModal && selectedDeck && (
        <PurchaseModal
          deck={selectedDeck}
          onConfirm={() => handlePurchase(selectedDeck)}
          onCancel={() => {
            setShowPurchaseModal(false);
            setSelectedDeck(null);
          }}
        />
      )}
    </SafeAreaView>
  );
});

DeckShop.displayName = 'DeckShop';

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
  closeButton: {
    alignSelf: 'flex-start',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  restoreButton: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  deckList: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
});