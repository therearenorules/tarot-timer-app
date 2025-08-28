/**
 * Daily Tarot Store - Phase 4: 24-Hour Tarot System
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { persist } from './middleware/persistence';
import { databaseService } from '../lib/database';
import { DailySession, DailyCard } from '../lib/database/types';
import DailyCardService from '../services/dailyCardService';
import { 
  getCurrentHour, 
  getCurrentDate, 
  isNewDay,
  getTimeUntilNextHour
} from '@/lib/timeManager';

// Enhanced state interface for Phase 4
interface DailyTarotState {
  // Core session data
  currentSession: DailySession | null;
  sessionCards: DailyCard[];
  selectedHour: number;
  selectedCard: DailyCard | null;
  
  // Time tracking
  currentHour: number;
  timeUntilNextHour: number;
  lastGeneratedDate: string;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  isNewSession: boolean;
  
  // Actions
  initializeToday: () => Promise<void>;
  selectHour: (hour: number) => void;
  updateCurrentTime: () => void;
  refreshIfNewDay: () => Promise<void>;
  reset: () => Promise<void>;
  
  // Memo actions
  saveMemo: (hour: number, memo: string) => Promise<void>;
  getMemoForHour: (hour: number) => string;
  clearMemo: (hour: number) => Promise<void>;
  
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
        sessionCards: [],
        selectedHour: getCurrentHour(),
        selectedCard: null,
        currentHour: getCurrentHour(),
        timeUntilNextHour: getTimeUntilNextHour(),
        lastGeneratedDate: '',
        isLoading: false,
        error: null,
        isNewSession: false,

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
              console.log('📅 Getting daily session for:', today);
              
              // Get or create today's session
              const session = await databaseService.dailyTarot.getTodaySession('classic');
              
              // Get all cards for the session
              let sessionCards = await databaseService.dailyTarot.getCardsBySession(session.id);
              
              // If no cards exist, generate them using DailyCardService
              if (sessionCards.length === 0) {
                const dailyCardService = DailyCardService.getInstance();
                await dailyCardService.getTodayCard(); // This will generate cards
                sessionCards = await databaseService.dailyTarot.getCardsBySession(session.id);
              }
              
              set((state) => {
                state.currentSession = session;
                state.sessionCards = sessionCards;
                state.lastGeneratedDate = today;
                state.isNewSession = true;
                state.currentHour = getCurrentHour();
                state.selectedHour = getCurrentHour();
                state.timeUntilNextHour = getTimeUntilNextHour();
                // Set selected card for current hour
                state.selectedCard = sessionCards.find(card => card.hour === getCurrentHour()) || null;
              });

              console.log('✅ Daily session loaded successfully');
            } else {
              console.log('📋 Using existing daily session');
              
              // Update time-based properties
              set((state) => {
                state.currentHour = getCurrentHour();
                state.timeUntilNextHour = getTimeUntilNextHour();
                state.isNewSession = false;
                // Update selected card for current hour
                state.selectedCard = state.sessionCards.find(card => card.hour === getCurrentHour()) || null;
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
            // Find the selected card for this hour
            state.selectedCard = state.sessionCards.find(card => card.hour === hour) || null;
          });
        },

        // Update current time
        updateCurrentTime: () => {
          set((state) => {
            const newHour = getCurrentHour();
            state.currentHour = newHour;
            state.timeUntilNextHour = getTimeUntilNextHour();
            // Auto-select current hour if no specific hour is selected
            if (state.selectedHour === state.currentHour - 1 || state.selectedHour === newHour) {
              state.selectedHour = newHour;
              state.selectedCard = state.sessionCards.find(card => card.hour === newHour) || null;
            }
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
            state.sessionCards = [];
            state.selectedHour = getCurrentHour();
            state.selectedCard = null;
            state.currentHour = getCurrentHour();
            state.timeUntilNextHour = getTimeUntilNextHour();
            state.lastGeneratedDate = '';
            state.isLoading = false;
            state.error = null;
            state.isNewSession = false;
          });

          // Re-initialize
          await get().initializeToday();
        },

        // Save memo for specific hour
        saveMemo: async (hour: number, memo: string) => {
          try {
            const session = get().currentSession;
            if (!session) return;

            // Update database
            await databaseService.dailyTarot.upsertCardMemo(session.id, hour, memo);
            
            // Update local state
            set((state) => {
              const cardIndex = state.sessionCards.findIndex(card => card.hour === hour);
              if (cardIndex !== -1) {
                state.sessionCards[cardIndex] = {
                  ...state.sessionCards[cardIndex],
                  memo: memo,
                  updatedAt: new Date().toISOString()
                };
              }
              
              // Update selected card if it's the same hour
              if (state.selectedCard && state.selectedCard.hour === hour) {
                state.selectedCard = {
                  ...state.selectedCard,
                  memo: memo,
                  updatedAt: new Date().toISOString()
                };
              }
            });
          } catch (error) {
            console.error('Error saving memo:', error);
            set((state) => {
              state.error = 'Failed to save memo';
            });
          }
        },

        // Get memo for specific hour
        getMemoForHour: (hour: number): string => {
          const card = get().sessionCards.find(card => card.hour === hour);
          return card?.memo || '';
        },

        // Clear memo for specific hour
        clearMemo: async (hour: number) => {
          await get().saveMemo(hour, '');
        },

        // Get session statistics
        getSessionStats: () => {
          const sessionCards = get().sessionCards;
          if (sessionCards.length === 0) {
            return {
              totalCards: 0,
              cardsWithMemos: 0,
              completionPercentage: 0
            };
          }

          const cardsWithMemos = sessionCards.filter(card => card.memo && card.memo.trim().length > 0).length;

          return {
            totalCards: sessionCards.length,
            cardsWithMemos,
            completionPercentage: Math.round((cardsWithMemos / sessionCards.length) * 100)
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
          sessionCards: state.sessionCards,
          lastGeneratedDate: state.lastGeneratedDate
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
  clearMemo: (hour: number) => useDailyTarotStore.getState().clearMemo(hour),
  clearError: () => useDailyTarotStore.getState().clearError(),
};

export default useDailyTarotStore;