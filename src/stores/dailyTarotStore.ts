/**
 * Daily Tarot Store - Phase 4: 24-Hour Tarot System
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { persist } from './middleware/persistence';
import { TarotCard } from '@/assets/decks';
import { 
  generateDailyCards, 
  getCurrentHourCard, 
  type DailyCard, 
  type DailyCardSet 
} from '@/lib/cardGeneration';
import { 
  getCurrentHour, 
  getCurrentDate, 
  isNewDay,
  getTimeUntilNextHour,
  getTimeBasedGreeting 
} from '@/lib/timeManager';

// Enhanced state interface for Phase 4
interface DailyTarotState {
  // Core session data
  currentSession: DailyCardSet | null;
  selectedHour: number;
  selectedCard: TarotCard | null;
  
  // Time tracking
  currentHour: number;
  timeUntilNextHour: number;
  lastGeneratedDate: string;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  isNewSession: boolean;
  
  // Memos system
  memos: Record<string, Record<number, string>>; // date -> hour -> memo
  
  // Actions
  initializeToday: () => Promise<void>;
  selectHour: (hour: number) => void;
  updateCurrentTime: () => void;
  refreshIfNewDay: () => Promise<void>;
  reset: () => Promise<void>;
  
  // Memo actions
  saveMemo: (hour: number, memo: string) => void;
  getMemoForHour: (hour: number) => string;
  clearMemo: (hour: number) => void;
  
  // Utility actions
  getSessionStats: () => {
    totalCards: number;
    cardsWithMemos: number;
    completionPercentage: number;
  };
  refreshSession: () => Promise<void>;
  clearError: () => void;
}

/**
 * Daily Tarot Store Implementation
 */
export const useDailyTarotStore = create<DailyTarotState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial state
        currentSession: null,
        selectedHour: getCurrentHour(),
        selectedCard: null,
        currentHour: getCurrentHour(),
        timeUntilNextHour: getTimeUntilNextHour(),
        lastGeneratedDate: '',
        isLoading: false,
        error: null,
        isNewSession: false,
        memos: {},

        // Initialize today's tarot session
        initializeToday: async () => {
          try {
            set((state) => {
              state.isLoading = true;
              state.error = null;
            });

            console.log('🌅 Initializing daily tarot session...');

            const today = getCurrentDate();
            const needsNewSession = isNewDay(get().lastGeneratedDate);

            if (needsNewSession || !get().currentSession) {
              console.log('📅 Generating new daily cards for:', today);
              
              // Generate new cards for today
              const dailyCardSet = generateDailyCards(today, 'classic');
              
              set((state) => {
                state.currentSession = dailyCardSet;
                state.lastGeneratedDate = today;
                state.isNewSession = true;
                state.currentHour = getCurrentHour();
                state.selectedHour = getCurrentHour();
                state.timeUntilNextHour = getTimeUntilNextHour();
              });

              console.log('✅ Daily cards generated successfully');
            } else {
              console.log('📋 Using existing daily cards');
              
              // Update time-based properties
              set((state) => {
                state.currentHour = getCurrentHour();
                state.timeUntilNextHour = getTimeUntilNextHour();
                state.isNewSession = false;
              });
            }

            set((state) => {
              state.isLoading = false;
            });

          } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to initialize daily tarot';
            console.error('❌ Failed to initialize daily tarot:', error);

            set((state) => {
              state.error = message;
              state.isLoading = false;
            });

            throw error;
          }
        },

        // Select specific hour
        selectHour: (hour: number) => {
          if (hour < 0 || hour > 23) return;

          set((state) => {
            state.selectedHour = hour;
            
            // Find the selected card
            const session = state.currentSession;
            if (session) {
              const dailyCard = session.cards.find(card => card.hour === hour);
              if (dailyCard) {
                // Convert DailyCard to TarotCard format (simplified)
                state.selectedCard = {
                  key: dailyCard.cardKey,
                  name: dailyCard.cardName,
                  number: '',
                  suit: 'major',
                  upright: dailyCard.keywords,
                  reversed: dailyCard.keywords,
                  image: `${dailyCard.cardKey}.jpg`,
                  description: ''
                } as TarotCard;
              }
            }
          });
        },

        // Update current time
        updateCurrentTime: () => {
          set((state) => {
            state.currentHour = getCurrentHour();
            state.timeUntilNextHour = getTimeUntilNextHour();
          });
        },

        // Check and refresh if new day
        refreshIfNewDay: async () => {
          const currentDate = getCurrentDate();
          const needsRefresh = isNewDay(get().lastGeneratedDate);

          if (needsRefresh) {
            console.log('🌅 New day detected, refreshing cards...');
            await get().initializeToday();
          } else {
            get().updateCurrentTime();
          }
        },

        // Reset store
        reset: async () => {
          set((state) => {
            state.currentSession = null;
            state.selectedHour = getCurrentHour();
            state.selectedCard = null;
            state.currentHour = getCurrentHour();
            state.timeUntilNextHour = getTimeUntilNextHour();
            state.lastGeneratedDate = '';
            state.isLoading = false;
            state.error = null;
            state.isNewSession = false;
            state.memos = {};
          });

          // Re-initialize
          await get().initializeToday();
        },

        // Save memo for specific hour
        saveMemo: (hour: number, memo: string) => {
          const date = get().currentSession?.date || getCurrentDate();
          
          set((state) => {
            if (!state.memos[date]) {
              state.memos[date] = {};
            }
            state.memos[date][hour] = memo;
          });
        },

        // Get memo for specific hour
        getMemoForHour: (hour: number): string => {
          const date = get().currentSession?.date || getCurrentDate();
          return get().memos[date]?.[hour] || '';
        },

        // Clear memo for specific hour
        clearMemo: (hour: number) => {
          const date = get().currentSession?.date || getCurrentDate();
          
          set((state) => {
            if (state.memos[date]) {
              delete state.memos[date][hour];
            }
          });
        },

        // Get session statistics
        getSessionStats: () => {
          const session = get().currentSession;
          if (!session) {
            return {
              totalCards: 0,
              cardsWithMemos: 0,
              completionPercentage: 0
            };
          }

          const date = session.date;
          const memos = get().memos[date] || {};
          const cardsWithMemos = Object.keys(memos).length;

          return {
            totalCards: 24,
            cardsWithMemos,
            completionPercentage: Math.round((cardsWithMemos / 24) * 100)
          };
        },

        // Refresh current session
        refreshSession: async () => {
          get().updateCurrentTime();
          
          // If we have a session, ensure selected hour is current
          if (get().currentSession) {
            get().selectHour(getCurrentHour());
          }
        },

        // Clear error
        clearError: () => {
          set((state) => {
            state.error = null;
          });
        }
      })),
      {
        name: 'daily-tarot-store',
        partialize: (state) => ({
          currentSession: state.currentSession,
          lastGeneratedDate: state.lastGeneratedDate,
          memos: state.memos
        })
      }
    ),
    {
      name: 'daily-tarot-store'
    }
  )
);

// Action creators for external use
export const dailyTarotActions = {
  initializeToday: () => useDailyTarotStore.getState().initializeToday(),
  selectHour: (hour: number) => useDailyTarotStore.getState().selectHour(hour),
  updateCurrentTime: () => useDailyTarotStore.getState().updateCurrentTime(),
  refreshSession: () => useDailyTarotStore.getState().refreshSession(),
  reset: () => useDailyTarotStore.getState().reset(),
  saveMemo: (hour: number, memo: string) => useDailyTarotStore.getState().saveMemo(hour, memo),
  getMemoForHour: (hour: number) => useDailyTarotStore.getState().getMemoForHour(hour),
  clearError: () => useDailyTarotStore.getState().clearError(),
};

export default useDailyTarotStore;