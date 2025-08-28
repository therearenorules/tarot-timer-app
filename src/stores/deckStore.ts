/**
 * Deck Store - Manages tarot deck data and selection
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { persist } from './middleware/persistence';
import { databaseSync, DatabaseSyncStrategies } from './middleware/database';
import { DeckState, DeckInfo, DeckData, DeckCard, StoreError } from './types';
import { databaseService } from '@/lib/database';
import { Deck, Card } from '@/lib/database/types';

/**
 * Default deck configuration for classic Rider-Waite deck
 */
const CLASSIC_DECK_CARDS = [
  // Major Arcana
  { key: 'fool', name: 'The Fool', suit: 'major', number: 0, arcana: 'major' },
  { key: 'magician', name: 'The Magician', suit: 'major', number: 1, arcana: 'major' },
  { key: 'high_priestess', name: 'The High Priestess', suit: 'major', number: 2, arcana: 'major' },
  { key: 'empress', name: 'The Empress', suit: 'major', number: 3, arcana: 'major' },
  { key: 'emperor', name: 'The Emperor', suit: 'major', number: 4, arcana: 'major' },
  { key: 'hierophant', name: 'The Hierophant', suit: 'major', number: 5, arcana: 'major' },
  { key: 'lovers', name: 'The Lovers', suit: 'major', number: 6, arcana: 'major' },
  { key: 'chariot', name: 'The Chariot', suit: 'major', number: 7, arcana: 'major' },
  { key: 'strength', name: 'Strength', suit: 'major', number: 8, arcana: 'major' },
  { key: 'hermit', name: 'The Hermit', suit: 'major', number: 9, arcana: 'major' },
  { key: 'wheel_fortune', name: 'Wheel of Fortune', suit: 'major', number: 10, arcana: 'major' },
  { key: 'justice', name: 'Justice', suit: 'major', number: 11, arcana: 'major' },
  { key: 'hanged_man', name: 'The Hanged Man', suit: 'major', number: 12, arcana: 'major' },
  { key: 'death', name: 'Death', suit: 'major', number: 13, arcana: 'major' },
  { key: 'temperance', name: 'Temperance', suit: 'major', number: 14, arcana: 'major' },
  { key: 'devil', name: 'The Devil', suit: 'major', number: 15, arcana: 'major' },
  { key: 'tower', name: 'The Tower', suit: 'major', number: 16, arcana: 'major' },
  { key: 'star', name: 'The Star', suit: 'major', number: 17, arcana: 'major' },
  { key: 'moon', name: 'The Moon', suit: 'major', number: 18, arcana: 'major' },
  { key: 'sun', name: 'The Sun', suit: 'major', number: 19, arcana: 'major' },
  { key: 'judgement', name: 'Judgement', suit: 'major', number: 20, arcana: 'major' },
  { key: 'world', name: 'The World', suit: 'major', number: 21, arcana: 'major' },

  // Minor Arcana - Wands
  ...generateMinorArcana('wands', 'Wands'),
  
  // Minor Arcana - Cups
  ...generateMinorArcana('cups', 'Cups'),
  
  // Minor Arcana - Swords
  ...generateMinorArcana('swords', 'Swords'),
  
  // Minor Arcana - Pentacles
  ...generateMinorArcana('pentacles', 'Pentacles')
];

/**
 * Generate minor arcana cards for a suit
 */
function generateMinorArcana(suitKey: string, suitName: string) {
  const cards = [];
  
  // Number cards (Ace through 10)
  for (let i = 1; i <= 10; i++) {
    const cardName = i === 1 ? 'Ace' : i.toString();
    cards.push({
      key: `${cardName.toLowerCase()}_${suitKey}`,
      name: `${cardName} of ${suitName}`,
      suit: suitKey,
      number: i,
      arcana: 'minor' as const
    });
  }
  
  // Court cards
  const courtCards = ['page', 'knight', 'queen', 'king'];
  courtCards.forEach((court, index) => {
    cards.push({
      key: `${court}_${suitKey}`,
      name: `${court.charAt(0).toUpperCase() + court.slice(1)} of ${suitName}`,
      suit: suitKey,
      number: 11 + index,
      arcana: 'minor' as const
    });
  });
  
  return cards;
}

/**
 * Deck Store Implementation
 */
const createDeckStore = () => create<DeckState>()(
  devtools(
    persist(
      databaseSync(
        immer((set, get) => ({
          // Initial state - matching DeckState interface
          availableDecks: [],
          selectedDeckId: 'classic',
          selectedDeck: null,
          cards: [],
          currentDeck: null,
          deckAssets: {},
          isLoading: false,
          isLoadingDeck: false,
          preloadProgress: 0,
          error: null,

          // Base store actions
          clearError: () => set((state) => {
            state.error = null;
          }),

          reset: () => set((state) => {
            state.availableDecks = [];
            state.selectedDeckId = 'classic';
            state.selectedDeck = null;
            state.cards = [];
            state.currentDeck = null;
            state.deckAssets = {};
            state.isLoading = false;
            state.isLoadingDeck = false;
            state.preloadProgress = 0;
            state.error = null;
          }),

          // Deck actions
          loadDecks: async () => {
            try {
              set((state) => {
                state.isLoading = true;
                state.error = null;
              });

              if (!databaseService.isReady()) {
                throw new StoreError('Database not ready', 'deck', 'loadDecks');
              }

              // Load available decks from assets
              const decks: DeckInfo[] = [
                {
                  id: 'classic',
                  name: 'Classic Tarot',
                  description: 'Traditional Rider-Waite Tarot deck',
                  cardCount: 78,
                  type: 'free',
                  version: '1.0',
                  imagePreview: 'classic-preview.jpg',
                }
              ];

              set((state) => {
                state.availableDecks = decks;
                state.isLoading = false;
              });

              // Load selected deck if not already loaded
              const state = get();
              if (!state.selectedDeck || state.selectedDeck.id !== state.selectedDeckId) {
                await get().selectDeck(state.selectedDeckId);
              }

            } catch (error) {
              const message = error instanceof Error ? error.message : 'Failed to load decks';
              console.error('Failed to load decks:', message);
              
              set((state) => {
                state.error = message;
                state.isLoading = false;
              });
              
              throw error;
            }
          },

          selectDeck: async (deckId: string) => {
            try {
              set((state) => {
                state.isLoading = true;
                state.error = null;
              });

              if (!databaseService.isReady()) {
                throw new StoreError('Database not ready', 'deck', 'selectDeck');
              }

              // Mock implementation - Load deck details
              const deck: DeckData | null = deckId === 'classic' ? {
                info: {
                  id: 'classic',
                  name: 'Classic Tarot',
                  description: 'Traditional Rider-Waite Tarot deck',
                  cardCount: 78,
                  type: 'free',
                  version: '1.0',
                  imagePreview: 'classic-preview.jpg',
                },
                cards: []
              } : null;

              if (!deck) {
                throw new StoreError(`Deck not found: ${deckId}`, 'deck', 'selectDeck');
              }

              // Mock implementation - Load all cards for this deck
              const cards: DeckCard[] = [];

              set((state) => {
                state.selectedDeckId = deckId;
                state.selectedDeck = deck;
                state.currentDeck = deck;
                state.cards = cards;
                state.isLoading = false;
              });

              // Update settings with new selected deck
              // Note: This would typically be handled by the settings store
              
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Failed to select deck';
              console.error('Failed to select deck:', message);
              
              set((state) => {
                state.error = message;
                state.isLoading = false;
              });
              
              throw error;
            }
          },

          initializeDefaultDeck: async () => {
            try {
              console.log('Initializing default deck (mock implementation)');
              
              // Mock implementation - default deck already handled in loadDecks
              console.log('✅ Default deck initialization completed (mock)');
              
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Failed to initialize default deck';
              console.error('Failed to initialize default deck:', message);
              throw error;
            }
          },

          getCard: (cardKey: string) => {
            const state = get();
            return state.cards.find(card => card.key === cardKey) || null;
          },

          getCardByKey: (cardKey: string) => {
            const state = get();
            return state.cards.find(card => card.key === cardKey) || null;
          },

          getCardsBySuit: (suit: string) => {
            const state = get();
            return state.cards.filter((card: any) => card.suit === suit);
          },

          getCardsByArcana: (arcana: 'major' | 'minor') => {
            const state = get();
            return state.cards.filter(card => card.arcana === arcana);
          },

          getMajorArcana: () => {
            return get().getCardsByArcana('major');
          },

          getMinorArcana: () => {
            return get().getCardsByArcana('minor');
          },

          searchCards: (query: string) => {
            const state = get();
            if (!query.trim()) return state.cards;

            const searchLower = query.toLowerCase();
            return state.cards.filter((card: any) => 
              card.name.toLowerCase().includes(searchLower) ||
              card.key.toLowerCase().includes(searchLower) ||
              (card.suit && card.suit.toLowerCase().includes(searchLower)) ||
              (card.keywords && card.keywords.some((keyword: any) => keyword.toLowerCase().includes(searchLower)))
            );
          },

          refreshDeck: async () => {
            const state = get();
            if (state.selectedDeckId) {
              await get().selectDeck(state.selectedDeckId);
            } else {
              await get().loadDecks();
            }
          },

          getDeckInfo: () => {
            const state = get();
            if (!state.selectedDeck) return null;

            const majorArcana = state.cards.filter((c: any) => c.arcana === 'major');
            const minorArcana = state.cards.filter((c: any) => c.arcana === 'minor');
            
            const suitCounts = state.cards.reduce((acc: any, card: any) => {
              if (card.arcana === 'minor' && card.suit) {
                acc[card.suit] = (acc[card.suit] || 0) + 1;
              }
              return acc;
            }, {} as Record<string, number>);

            return {
              deck: state.selectedDeck,
              totalCards: state.cards.length,
              majorArcana: majorArcana.length,
              minorArcana: minorArcana.length,
              suitCounts,
              suits: Object.keys(suitCounts)
            };
          },

          // Additional DeckState interface methods
          loadAvailableDecks: async () => {
            await get().loadDecks();
          },

          loadDeck: async (deckId: string) => {
            await get().selectDeck(deckId);
          },

          switchDeck: async (deckId: string) => {
            await get().selectDeck(deckId);
          },

          preloadDeckAssets: async (deckId: string) => {
            console.log(`Preloading assets for deck: ${deckId} (mock implementation)`);
            set((state) => {
              state.preloadProgress = 100;
            });
          },

          // Card helper methods required by DeckState
          getRandomCard: () => {
            const state = get();
            const cards = state.cards;
            return cards.length > 0 ? cards[Math.floor(Math.random() * cards.length)] : null;
          },

          getAllCards: () => {
            return get().cards;
          },

          getCardsByArcana: (arcana: 'major' | 'minor') => {
            const state = get();
            return state.cards.filter((card: any) => card.arcana === arcana);
          },

          getMajorArcana: () => {
            return get().getCardsByArcana('major');
          },

          getMinorArcana: () => {
            return get().getCardsByArcana('minor');
          },

          getCardCount: () => {
            return get().cards.length;
          },

          refreshDeckList: async () => {
            await get().loadDecks();
          },

          checkDeckAvailability: (deckId: string) => {
            const state = get();
            return state.availableDecks.some(deck => deck.id === deckId);
          },

          // Premium deck management (for future implementation)
          getPremiumDecks: () => {
            const state = get();
            return state.availableDecks.filter((deck: any) => deck.type === 'premium');
          },

          getFreeDecks: () => {
            const state = get();
            return state.availableDecks.filter((deck: any) => deck.type === 'free');
          }
        })),
        {
          enabled: true,
          syncStrategies: {
            selectedDeckId: async (deckId: string) => {
              await databaseService.settings.setSetting('active_deck_id', deckId);
            }
          }
        }
      ),
      {
        name: 'deck-store',
        partialize: (state) => ({
          selectedDeckId: state.selectedDeckId,
          availableDecks: state.availableDecks
        }),
        onRehydrateStorage: async (state) => {
          // Load deck data after rehydration
          if (state && databaseService.isReady()) {
            try {
              await state.loadDecks();
            } catch (error) {
              console.error('Failed to load decks after rehydration:', error);
            }
          }
        }
      }
    ),
    {
      name: 'deck-store',
      enabled: __DEV__
    }
  )
);

// Export store
export const useDeckStore = createDeckStore();

// Export store actions for external use
export const deckActions = {
  loadDecks: () => useDeckStore.getState().loadDecks(),
  selectDeck: (deckId: string) => useDeckStore.getState().selectDeck(deckId),
  getCardByKey: (cardKey: string) => useDeckStore.getState().getCardByKey(cardKey),
  clearError: () => useDeckStore.getState().clearError(),
  reset: () => useDeckStore.getState().reset()
};

export default useDeckStore;