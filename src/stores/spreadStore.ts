/**
 * Spread Store - Manages spread layouts and card drawing
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { SpreadLayout, SpreadCard, SpreadData, SPREAD_SELECTION_CARDS, getSpreadById } from '@/assets/spreads';

// Basic spread state interface
interface SpreadState {
  // Loading and error states
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;

  // Current spread data
  currentLayout: SpreadLayout | null;
  currentSpreadData: SpreadData | null;
  drawnCards: SpreadCard[];
  timelineCards: SpreadCard[];

  // UI states
  isDrawingMode: boolean;
  selectedCardIndex: number | null;
  isTimelineMode: boolean;
  timelineEnabled: boolean;

  // Actions
  initializeSpreadSystem: () => Promise<void>;
  startNewSpread: (spreadId: string, options?: { timelineEnabled?: boolean }) => Promise<void>;
  drawCardAtPosition: (positionIndex: number) => Promise<void>;
  flipCard: (positionIndex: number) => void;
  selectCard: (positionIndex: number) => void;
  clearCurrentSpread: () => void;
  toggleTimelineMode: () => void;
  captureSpread: (ref: React.RefObject<any>) => Promise<string>;
  saveSpread: (imageUri: string, options?: any) => Promise<void>;
  shareSpread: (imageUri: string) => Promise<void>;
  reset: () => void;
  clearError: () => void;
  getSpreadStats: () => {
    totalSpreads: number;
    completedSpreads: number;
    averageCardsDrawn: number;
  };
}

// Mock functions for services that might not exist
const mockDrawCardForPosition = async (positionIndex: number): Promise<SpreadCard> => {
  return {
    positionIndex,
    cardKey: 'mock_card',
    cardName: 'Mock Card',
    isReversed: false,
    drawnAt: new Date().toISOString(),
    keywords: ['mock', 'test']
  };
};

const mockCaptureSpread = async (ref: React.RefObject<any>): Promise<string> => {
  return 'mock://capture/uri';
};

const mockSaveSpread = async (imageUri: string, options?: any): Promise<void> => {
  console.log('Mock save spread:', imageUri, options);
};

const mockShareSpread = async (imageUri: string): Promise<void> => {
  console.log('Mock share spread:', imageUri);
};

// Create the store
export const useSpreadStore = create<SpreadState>()(
  devtools(
    (set, get) => ({
      // Initial state
      isLoading: false,
      error: null,
      isInitialized: false,
      currentLayout: null,
      currentSpreadData: null,
      drawnCards: [],
      timelineCards: [],
      isDrawingMode: true,
      selectedCardIndex: null,
      isTimelineMode: false,
      timelineEnabled: false,

      // Initialize spread system
      initializeSpreadSystem: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // Simulate initialization
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set({ 
            isLoading: false, 
            isInitialized: true 
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to initialize spread system';
          set({ 
            error: message, 
            isLoading: false 
          });
          throw error;
        }
      },

      // Start new spread
      startNewSpread: async (spreadId: string, options = {}) => {
        try {
          set({ isLoading: true, error: null });
          
          const layout = getSpreadById(spreadId);
          if (!layout) {
            throw new Error(`Spread layout not found: ${spreadId}`);
          }

          const spreadData: SpreadData = {
            id: `spread_${Date.now()}`,
            spreadId,
            cards: [],
            timelineCards: [],
            isComplete: false,
            createdAt: new Date().toISOString(),
            completedAt: null
          };

          set({ 
            currentLayout: layout,
            currentSpreadData: spreadData,
            drawnCards: [],
            timelineCards: [],
            isDrawingMode: true,
            selectedCardIndex: null,
            isTimelineMode: false,
            timelineEnabled: options.timelineEnabled || false,
            isLoading: false
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to start spread';
          set({ 
            error: message, 
            isLoading: false 
          });
          throw error;
        }
      },

      // Draw card at position
      drawCardAtPosition: async (positionIndex: number) => {
        try {
          const state = get();
          if (!state.currentLayout) {
            throw new Error('No active spread');
          }

          // Use mock function for now
          const card = await mockDrawCardForPosition(positionIndex);
          
          set(state => ({
            drawnCards: [...state.drawnCards, card]
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to draw card';
          set({ error: message });
          throw error;
        }
      },

      // Flip card
      flipCard: (positionIndex: number) => {
        set(state => ({
          drawnCards: state.drawnCards.map(card =>
            card.positionIndex === positionIndex
              ? { ...card, isReversed: !card.isReversed }
              : card
          )
        }));
      },

      // Select card
      selectCard: (positionIndex: number) => {
        set({ selectedCardIndex: positionIndex });
      },

      // Clear current spread
      clearCurrentSpread: () => {
        set({
          currentLayout: null,
          currentSpreadData: null,
          drawnCards: [],
          timelineCards: [],
          isDrawingMode: true,
          selectedCardIndex: null,
          isTimelineMode: false,
          timelineEnabled: false
        });
      },

      // Toggle timeline mode
      toggleTimelineMode: () => {
        set(state => ({
          isTimelineMode: !state.isTimelineMode
        }));
      },

      // Capture spread
      captureSpread: async (ref: React.RefObject<any>) => {
        try {
          return await mockCaptureSpread(ref);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to capture spread';
          set({ error: message });
          throw error;
        }
      },

      // Save spread
      saveSpread: async (imageUri: string, options?: any) => {
        try {
          await mockSaveSpread(imageUri, options);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to save spread';
          set({ error: message });
          throw error;
        }
      },

      // Share spread
      shareSpread: async (imageUri: string) => {
        try {
          await mockShareSpread(imageUri);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to share spread';
          set({ error: message });
          throw error;
        }
      },

      // Get spread stats
      getSpreadStats: () => {
        // Mock stats
        return {
          totalSpreads: 0,
          completedSpreads: 0,
          averageCardsDrawn: 0
        };
      },

      // Reset store
      reset: () => {
        set({
          isLoading: false,
          error: null,
          isInitialized: false,
          currentLayout: null,
          currentSpreadData: null,
          drawnCards: [],
          timelineCards: [],
          isDrawingMode: true,
          selectedCardIndex: null,
          isTimelineMode: false,
          timelineEnabled: false
        });
      },

      // Clear error
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'spread-store',
      enabled: __DEV__
    }
  )
);

// Export actions for easier access
export const spreadActions = {
  initializeSpreadSystem: () => useSpreadStore.getState().initializeSpreadSystem(),
  startNewSpread: (spreadId: string, options?: { timelineEnabled?: boolean }) => 
    useSpreadStore.getState().startNewSpread(spreadId, options),
  drawCardAtPosition: (positionIndex: number) => 
    useSpreadStore.getState().drawCardAtPosition(positionIndex),
  flipCard: (positionIndex: number) => 
    useSpreadStore.getState().flipCard(positionIndex),
  selectCard: (positionIndex: number) => 
    useSpreadStore.getState().selectCard(positionIndex),
  clearCurrentSpread: () => 
    useSpreadStore.getState().clearCurrentSpread(),
  toggleTimelineMode: () => 
    useSpreadStore.getState().toggleTimelineMode(),
  captureSpread: (ref: React.RefObject<any>) => 
    useSpreadStore.getState().captureSpread(ref),
  saveSpread: (imageUri: string, options?: any) => 
    useSpreadStore.getState().saveSpread(imageUri, options),
  shareSpread: (imageUri: string) => 
    useSpreadStore.getState().shareSpread(imageUri),
  reset: () => useSpreadStore.getState().reset(),
  clearError: () => useSpreadStore.getState().clearError()
};

export default useSpreadStore;