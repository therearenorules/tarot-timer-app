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
 * Diary filters and sort options
 */
export const DIARY_FILTERS = {
  ALL: 'all',
  RECENT: 'recent',
  FAVORITES: 'favorites',
  DAILY_SESSIONS: 'daily_sessions',
  SPREADS: 'spreads',
  BY_DECK: 'by_deck'
} as const;

export const DIARY_SORT_OPTIONS = {
  DATE_DESC: 'date_desc',
  DATE_ASC: 'date_asc',
  TITLE_ASC: 'title_asc',
  TITLE_DESC: 'title_desc'
} as const;

/**
 * Diary Store Implementation
 */
const createDiaryStore = () => create<DiaryState>()( 
  devtools(
    persist(
      databaseSync(
        immer((set, get) => ({
          // Initial state
          readings: [],
          currentFilter: DIARY_FILTERS.ALL,
          currentSort: DIARY_SORT_OPTIONS.DATE_DESC,
          searchQuery: '',
          selectedReading: null,
          pagination: {
            page: 1,
            limit: 20,
            total: 0,
            hasMore: false
          },
          isLoading: false,
          error: null,

          // Base store actions
          clearError: () => set((state) => {
            state.error = null;
          }),

          reset: () => set((state) => {
            state.readings = [];
            state.currentFilter = DIARY_FILTERS.ALL;
            state.currentSort = DIARY_SORT_OPTIONS.DATE_DESC;
            state.searchQuery = '';
            state.selectedReading = null;
            state.pagination = {
              page: 1,
              limit: 20,
              total: 0,
              hasMore: false
            };
            state.isLoading = false;
            state.error = null;
          }),

          // Diary actions
          loadReadings: async (forceRefresh = false) => {
            try {
              const state = get();
              
              if (!forceRefresh && state.readings.length > 0 && state.pagination.page === 1) {
                return; // Use cached data
              }

              set((state) => {
                state.isLoading = true;
                state.error = null;
              });

              if (!databaseService.isReady()) {
                throw new StoreError('Database not ready', 'diary', 'loadReadings');
              }

              // Build query based on current filter and search
              const offset = (state.pagination.page - 1) * state.pagination.limit;
              
              let readings: any[] = [];
              let total = 0;

              // Load based on current filter
              switch (state.currentFilter) {
                case DIARY_FILTERS.DAILY_SESSIONS:
                  const sessions = await databaseService.dailyTarot.getAllSessions({
                    limit: state.pagination.limit,
                    offset,
                    search: state.searchQuery
                  });
                  readings = sessions.map(session => ({
                    ...session,
                    type: 'daily_session' as const
                  }));
                  total = await databaseService.dailyTarot.getSessionCount(state.searchQuery);
                  break;

                case DIARY_FILTERS.SPREADS:
                  const spreads = await databaseService.spreads.getAllSpreads({
                    limit: state.pagination.limit,
                    offset,
                    search: state.searchQuery
                  });
                  readings = spreads.map(spread => ({
                    ...spread,
                    type: 'spread' as const
                  }));
                  total = await databaseService.spreads.getSpreadCount(state.searchQuery);
                  break;

                case DIARY_FILTERS.RECENT:
                  // Get recent items from both daily sessions and spreads
                  const recentSessions = await databaseService.dailyTarot.getAllSessions({
                    limit: Math.ceil(state.pagination.limit / 2),
                    offset: 0,
                    search: state.searchQuery
                  });
                  const recentSpreads = await databaseService.spreads.getAllSpreads({
                    limit: Math.ceil(state.pagination.limit / 2),
                    offset: 0,
                    search: state.searchQuery
                  });
                  
                  readings = [
                    ...recentSessions.map(s => ({ ...s, type: 'daily_session' as const })),
                    ...recentSpreads.map(s => ({ ...s, type: 'spread' as const }))
                  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                   .slice(offset, offset + state.pagination.limit);
                  
                  total = recentSessions.length + recentSpreads.length;
                  break;

                default: // ALL
                  const allSessions = await databaseService.dailyTarot.getAllSessions({
                    limit: state.pagination.limit,
                    offset,
                    search: state.searchQuery
                  });
                  const allSpreads = await databaseService.spreads.getAllSpreads({
                    limit: state.pagination.limit,
                    offset,
                    search: state.searchQuery
                  });
                  
                  readings = [
                    ...allSessions.map(s => ({ ...s, type: 'daily_session' as const })),
                    ...allSpreads.map(s => ({ ...s, type: 'spread' as const }))
                  ];
                  
                  total = await databaseService.dailyTarot.getSessionCount(state.searchQuery) +
                         await databaseService.spreads.getSpreadCount(state.searchQuery);
                  break;
              }

              // Apply sorting
              readings = applySorting(readings, state.currentSort);

              set((state) => {
                if (state.pagination.page === 1) {
                  state.readings = readings;
                } else {
                  state.readings = [...state.readings, ...readings];
                }
                
                state.pagination = {
                  ...state.pagination,
                  total,
                  hasMore: offset + readings.length < total
                };
                state.isLoading = false;
              });

            } catch (error) {
              const message = error instanceof Error ? error.message : 'Failed to load readings';
              console.error('Failed to load readings:', message);
              
              set((state) => {
                state.error = message;
                state.isLoading = false;
              });
              
              throw error;
            }
          },

          loadMore: async () => {
            const state = get();
            
            if (!state.pagination.hasMore || state.isLoading) {
              return;
            }

            set((state) => {
              state.pagination.page += 1;
            });

            await get().loadReadings(false);
          },

          setFilter: async (filter: string) => {
            set((state) => {
              state.currentFilter = filter;
              state.pagination.page = 1;
              state.readings = [];
            });

            await get().loadReadings(true);
          },

          setSort: async (sort: string) => {
            set((state) => {
              state.currentSort = sort;
              state.pagination.page = 1;
            });

            // Re-sort existing data
            const state = get();
            const sortedReadings = applySorting([...state.readings], sort);
            
            set((state) => {
              state.readings = sortedReadings;
            });
          },

          setSearchQuery: async (query: string) => {
            set((state) => {
              state.searchQuery = query;
              state.pagination.page = 1;
              state.readings = [];
            });

            // Debounce search
            await new Promise(resolve => setTimeout(resolve, 300));
            await get().loadReadings(true);
          },

          selectReading: (reading: any) => {
            set((state) => {
              state.selectedReading = reading;
            });
          },

          clearSelection: () => {
            set((state) => {
              state.selectedReading = null;
            });
          },

          deleteReading: async (id: string, type: 'daily_session' | 'spread') => {
            try {
              set((state) => {
                state.isLoading = true;
                state.error = null;
              });

              if (!databaseService.isReady()) {
                throw new StoreError('Database not ready', 'diary', 'deleteReading');
              }

              // Delete from database
              if (type === 'daily_session') {
                await databaseService.dailyTarot.deleteSession(id);
              } else {
                await databaseService.spreads.deleteSpread(id);
              }

              // Remove from local state
              set((state) => {
                state.readings = state.readings.filter(reading => reading.id !== id);
                if (state.selectedReading?.id === id) {
                  state.selectedReading = null;
                }
                state.isLoading = false;
              });

            } catch (error) {
              const message = error instanceof Error ? error.message : 'Failed to delete reading';
              console.error('Failed to delete reading:', message);
              
              set((state) => {
                state.error = message;
                state.isLoading = false;
              });
              
              throw error;
            }
          },

          exportReadings: async (format: 'json' | 'csv' = 'json') => {
            try {
              if (!databaseService.isReady()) {
                throw new StoreError('Database not ready', 'diary', 'exportReadings');
              }

              // Get all readings for export
              const allSessions = await databaseService.dailyTarot.getAllSessions({ limit: 1000 });
              const allSpreads = await databaseService.spreads.getAllSpreads({ limit: 1000 });

              const exportData = {
                dailySessions: allSessions,
                spreads: allSpreads,
                exportedAt: new Date().toISOString(),
                version: '1.0'
              };

              if (format === 'json') {
                return JSON.stringify(exportData, null, 2);
              } else {
                // Simple CSV export
                const csvRows = [];
                csvRows.push('Type,Title,Date,Deck,Notes');
                
                allSessions.forEach(session => {
                  csvRows.push(`Daily Session,"Daily Reading ${session.date}",${session.date},${session.deckId},""`);
                });
                
                allSpreads.forEach(spread => {
                  csvRows.push(`Spread,"${spread.title}",${spread.createdAt},${spread.deckId},""`);
                });
                
                return csvRows.join('\n');
              }

            } catch (error) {
              const message = error instanceof Error ? error.message : 'Failed to export readings';
              console.error('Failed to export readings:', message);
              
              set((state) => {
                state.error = message;
              });
              
              throw error;
            }
          },

          getReadingStats: () => {
            const state = get();
            const dailySessions = state.readings.filter(r => r.type === 'daily_session');
            const spreads = state.readings.filter(r => r.type === 'spread');
            
            return {
              totalReadings: state.readings.length,
              dailySessions: dailySessions.length,
              spreads: spreads.length,
              thisWeek: state.readings.filter(r => {
                const readingDate = new Date(r.createdAt || r.date);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return readingDate >= weekAgo;
              }).length,
              thisMonth: state.readings.filter(r => {
                const readingDate = new Date(r.createdAt || r.date);
                const monthAgo = new Date();
                monthAgo.setMonth(monthAgo.getMonth() - 1);
                return readingDate >= monthAgo;
              }).length
            };
          }
        })),
        {
          enabled: true,
          syncStrategies: DatabaseSyncStrategies.diarySync
        }
      ),
      {
        name: 'diary-store',
        partialize: (state) => ({
          currentFilter: state.currentFilter,
          currentSort: state.currentSort,
          searchQuery: state.searchQuery
        })
      }
    ),
    {
      name: 'diary-store',
      enabled: __DEV__
    }
  )
);

/**
 * Apply sorting to readings array
 */
function applySorting(readings: any[], sort: string): any[] {
  switch (sort) {
    case DIARY_SORT_OPTIONS.DATE_ASC:
      return readings.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date);
        const dateB = new Date(b.createdAt || b.date);
        return dateA.getTime() - dateB.getTime();
      });
    
    case DIARY_SORT_OPTIONS.DATE_DESC:
      return readings.sort((a, b) => {
        const dateA = new Date(a.createdAt || a.date);
        const dateB = new Date(b.createdAt || b.date);
        return dateB.getTime() - dateA.getTime();
      });
    
    case DIARY_SORT_OPTIONS.TITLE_ASC:
      return readings.sort((a, b) => {
        const titleA = a.title || `Daily Reading ${a.date}` || '';
        const titleB = b.title || `Daily Reading ${b.date}` || '';
        return titleA.localeCompare(titleB);
      });
    
    case DIARY_SORT_OPTIONS.TITLE_DESC:
      return readings.sort((a, b) => {
        const titleA = a.title || `Daily Reading ${a.date}` || '';
        const titleB = b.title || `Daily Reading ${b.date}` || '';
        return titleB.localeCompare(titleA);
      });
    
    default:
      return readings;
  }
}

// Export store
export const useDiaryStore = createDiaryStore();

// Export store actions for external use
export const diaryActions = {
  loadReadings: (forceRefresh?: boolean) => useDiaryStore.getState().loadReadings(forceRefresh),
  loadMore: () => useDiaryStore.getState().loadMore(),
  setFilter: (filter: string) => useDiaryStore.getState().setFilter(filter),
  setSort: (sort: string) => useDiaryStore.getState().setSort(sort),
  setSearchQuery: (query: string) => useDiaryStore.getState().setSearchQuery(query),
  selectReading: (reading: any) => useDiaryStore.getState().selectReading(reading),
  deleteReading: (id: string, type: 'daily_session' | 'spread') => useDiaryStore.getState().deleteReading(id, type),
  exportReadings: (format?: 'json' | 'csv') => useDiaryStore.getState().exportReadings(format),
  clearError: () => useDiaryStore.getState().clearError(),
  reset: () => useDiaryStore.getState().reset()
};

export default useDiaryStore;