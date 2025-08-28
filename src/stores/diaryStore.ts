/**
 * Diary Store - Manages reading history and journal entries
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { persist } from './middleware/persistence';
import { databaseSync, DatabaseSyncStrategies } from './middleware/database';
import { DiaryState, StoreError } from './types';
import { databaseService } from '@/lib/database';
import { Spread, DailySession } from '@/lib/database/types';

/**
 * Diary Store Implementation
 */
const createDiaryStore = () => create<DiaryState>()(
  devtools(
    persist(
      databaseSync(
        immer((set, get) => ({
          // Initial state - matching DiaryState interface
          dailySessions: [],
          savedSpreads: [],
          currentFilter: 'all' as const,
          currentPage: 1,
          pageSize: 20,
          hasMore: false,
          searchQuery: '',
          isLoading: false,
          error: null,

          // Base store actions
          clearError: () => set((state) => {
            state.error = null;
          }),

          reset: () => set((state) => {
            state.dailySessions = [];
            state.savedSpreads = [];
            state.currentFilter = 'all';
            state.currentPage = 1;
            state.pageSize = 20;
            state.hasMore = false;
            state.searchQuery = '';
            state.isLoading = false;
            state.error = null;
          }),

          // Diary actions - implementing DiaryState interface
          loadDiarySessions: async (limit?: number, offset?: number) => {
            try {
              set((state) => {
                state.isLoading = true;
                state.error = null;
              });

              if (!databaseService.isReady()) {
                throw new StoreError('Database not ready', 'diary', 'loadDiarySessions');
              }

              // Load actual daily sessions from database
              const recentSessions = await databaseService.dailyTarot.getRecentSessions(limit || 10);
              const dailySessions: DailySession[] = recentSessions;
              
              set((state) => {
                state.dailySessions = dailySessions;
                state.hasMore = false;
                state.isLoading = false;
              });
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Failed to load diary sessions';
              console.error('Failed to load diary sessions:', message);
              set((state) => {
                state.error = message;
                state.isLoading = false;
              });
            }
          },

          loadSavedSpreads: async (limit?: number, offset?: number) => {
            try {
              set((state) => {
                state.isLoading = true;
                state.error = null;
              });

              if (!databaseService.isReady()) {
                throw new StoreError('Database not ready', 'diary', 'loadSavedSpreads');
              }

              // Load actual spreads from database
              const spreads = await databaseService.spreads.getRecentSpreads(limit || 10);
              const savedSpreads: Spread[] = spreads;
              
              set((state) => {
                state.savedSpreads = savedSpreads;
                state.hasMore = false;
                state.isLoading = false;
              });
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Failed to load saved spreads';
              console.error('Failed to load saved spreads:', message);
              set((state) => {
                state.error = message;
                state.isLoading = false;
              });
            }
          },

          loadMoreData: async () => {
            const currentState = get();
            if (!currentState.hasMore || currentState.isLoading) return;

            const offset = currentState.currentPage * currentState.pageSize;
            
            if (currentState.currentFilter === 'daily') {
              await get().loadDiarySessions(currentState.pageSize, offset);
            } else if (currentState.currentFilter === 'spreads') {
              await get().loadSavedSpreads(currentState.pageSize, offset);
            }
            
            set((state) => {
              state.currentPage += 1;
            });
          },

          deleteSpread: async (spreadId: number) => {
            try {
              if (!databaseService.isReady()) {
                throw new StoreError('Database not ready', 'diary', 'deleteSpread');
              }

              await databaseService.spreads.deleteSpread(spreadId);
              
              set((state) => {
                state.savedSpreads = state.savedSpreads.filter(spread => spread.id !== spreadId);
              });
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Failed to delete spread';
              console.error('Failed to delete spread:', message);
              set((state) => {
                state.error = message;
              });
            }
          },

          deleteSession: async (sessionId: number) => {
            try {
              if (!databaseService.isReady()) {
                throw new StoreError('Database not ready', 'diary', 'deleteSession');
              }

              // Delete session from database
              await databaseService.dailyTarot.deleteSession(sessionId);
              
              // Update local state
              set((state) => {
                state.dailySessions = state.dailySessions.filter(session => session.id !== sessionId);
              });
            } catch (error) {
              const message = error instanceof Error ? error.message : 'Failed to delete session';
              console.error('Failed to delete session:', message);
              set((state) => {
                state.error = message;
              });
            }
          },

          getSessionByDate: (date: string) => {
            const state = get();
            return state.dailySessions.find(session => session.date === date) || null;
          },

          setFilter: (filter: 'all' | 'daily' | 'spreads') => {
            set((state) => {
              state.currentFilter = filter;
              state.currentPage = 1;
            });
          },

          refreshData: async () => {
            const state = get();
            await Promise.all([
              get().loadDiarySessions(),
              get().loadSavedSpreads()
            ]);
          },

          setSearchQuery: (query: string) => {
            set((state) => {
              state.searchQuery = query;
              state.currentPage = 1;
            });
          },

          getFilteredData: () => {
            const state = get();
            let data: (DailySession | Spread)[] = [];

            if (state.currentFilter === 'all') {
              data = [...state.dailySessions, ...state.savedSpreads];
            } else if (state.currentFilter === 'daily') {
              data = state.dailySessions;
            } else if (state.currentFilter === 'spreads') {
              data = state.savedSpreads;
            }

            if (state.searchQuery) {
              data = data.filter(item => 
                'title' in item && item.title?.toLowerCase().includes(state.searchQuery.toLowerCase())
              );
            }

            return data;
          },
        })),
        {
          strategy: DatabaseSyncStrategies.PERIODIC,
          onError: (error) => console.error('Diary store sync error:', error)
        }
      ),
      {
        name: 'diary-storage',
        partialize: (state) => ({
          currentFilter: state.currentFilter,
          searchQuery: state.searchQuery,
          pageSize: state.pageSize
        }),
        onRehydrateStorage: () => (state) => {
          console.log('Diary store rehydrated');
          if (state?.loadDiarySessions && state?.loadSavedSpreads) {
            Promise.all([
              state.loadDiarySessions(),
              state.loadSavedSpreads()
            ]).catch(error => {
              console.error('Failed to load data after rehydration:', error);
            });
          }
        }
      }
    ),
    {
      name: 'diary-store',
      enabled: __DEV__
    }
  )
);

// Export store instance
export const useDiaryStore = createDiaryStore();

// Export convenience methods for external use
export const diaryStoreActions = {
  loadDiarySessions: (limit?: number, offset?: number) => useDiaryStore.getState().loadDiarySessions(limit, offset),
  loadSavedSpreads: (limit?: number, offset?: number) => useDiaryStore.getState().loadSavedSpreads(limit, offset),
  deleteSpread: (spreadId: number) => useDiaryStore.getState().deleteSpread(spreadId),
  setFilter: (filter: 'all' | 'daily' | 'spreads') => useDiaryStore.getState().setFilter(filter),
  setSearchQuery: (query: string) => useDiaryStore.getState().setSearchQuery(query),
  clearError: () => useDiaryStore.getState().clearError(),
  reset: () => useDiaryStore.getState().reset()
};