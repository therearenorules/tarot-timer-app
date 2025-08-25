/**
 * Store Composition and Root Store - Central state management
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { RootStore } from './types';

// Import all individual stores
import { useDailyTarotStore, dailyTarotActions } from './dailyTarotStore';
import { useSpreadStore, spreadActions } from './spreadStore';
import { useDiaryStore, diaryActions } from './diaryStore';
import { useSettingsStore, settingsActions } from './settingsStore';
import { useDeckStore, deckActions } from './deckStore';

// Import utilities
import { StorePersistence } from './middleware/persistence';
import { DatabaseSyncUtils } from './middleware/database';
import { databaseService } from '@/lib/database';

/**
 * Root Store Implementation
 * Provides centralized access to all stores and cross-store operations
 */
const createRootStore = () => create<RootStore>()(
  devtools(
    (set, get) => ({
      // Store references
      dailyTarot: useDailyTarotStore,
      spread: useSpreadStore,
      diary: useDiaryStore,
      settings: useSettingsStore,
      deck: useDeckStore,

      // Global state
      isInitialized: false,
      isLoading: false,
      error: null,

      // Root store actions
      initialize: async () => {
        try {
          set({ isLoading: true, error: null });

          console.log('🚀 Initializing Tarot Timer stores...');

          // Wait for database to be ready
          if (!databaseService.isReady()) {
            console.log('⏳ Waiting for database to be ready...');
            // Wait for database initialization
            await new Promise((resolve) => {
              const checkDb = () => {
                if (databaseService.isReady()) {
                  resolve(void 0);
                } else {
                  setTimeout(checkDb, 100);
                }
              };
              checkDb();
            });
          }

          console.log('✅ Database is ready, initializing stores...');

          // Initialize stores in dependency order
          await Promise.all([
            // 1. Initialize deck store first (needed by other stores)
            deckActions.loadDecks(),
            
            // 2. Initialize settings store
            settingsActions.loadSettings(),
          ]);

          // 3. Initialize stores that depend on deck/settings
          await Promise.all([
            dailyTarotActions.initializeToday(),
            spreadActions.loadAvailableLayouts(),
            diaryActions.loadReadings(),
          ]);

          console.log('✅ All stores initialized successfully');

          set({ isInitialized: true, isLoading: false });

        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to initialize stores';
          console.error('❌ Store initialization failed:', error);
          
          set({ 
            error: message,
            isLoading: false,
            isInitialized: false 
          });
          
          throw error;
        }
      },

      reset: async () => {
        try {
          console.log('🔄 Resetting all stores...');

          // Reset all individual stores
          dailyTarotActions.reset();
          spreadActions.reset();
          diaryActions.reset();
          settingsActions.reset();
          deckActions.reset();

          set({ 
            isInitialized: false,
            isLoading: false,
            error: null 
          });

          console.log('✅ All stores reset');

        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to reset stores';
          console.error('❌ Store reset failed:', error);
          
          set({ error: message });
          throw error;
        }
      },

      clearAllErrors: () => {
        dailyTarotActions.clearError();
        spreadActions.clearError();
        diaryActions.clearError();
        settingsActions.clearError();
        deckActions.clearError();
        
        set({ error: null });
      },

      // Cross-store operations
      changeActiveDeck: async (deckId: string) => {
        try {
          // Update settings
          await settingsActions.updateSetting('selectedDeckId', deckId);
          
          // Switch deck
          await deckActions.selectDeck(deckId);
          
          // Refresh daily tarot session with new deck
          await dailyTarotActions.refreshSession();
          
          console.log(`✅ Changed active deck to: ${deckId}`);
          
        } catch (error) {
          console.error('Failed to change active deck:', error);
          throw error;
        }
      },

      syncAllStores: async () => {
        try {
          console.log('🔄 Syncing all stores with database...');
          
          // Force sync all stores
          await DatabaseSyncUtils.forceSyncAll();
          
          console.log('✅ All stores synced');
          
        } catch (error) {
          console.error('❌ Store sync failed:', error);
          throw error;
        }
      },

      // Data management utilities
      exportAllData: async () => {
        try {
          console.log('📦 Exporting all app data...');

          const [
            diaryData,
            storageStats,
            syncStats
          ] = await Promise.all([
            diaryActions.exportReadings('json'),
            StorePersistence.getStorageStats(),
            DatabaseSyncUtils.getSyncStats()
          ]);

          const exportData = {
            version: '1.0',
            exportedAt: new Date().toISOString(),
            data: {
              diary: JSON.parse(diaryData),
              storageStats,
              syncStats
            },
            stores: {
              dailyTarot: useDailyTarotStore.getState(),
              spread: useSpreadStore.getState(),
              diary: useDiaryStore.getState(),
              settings: useSettingsStore.getState(),
              deck: useDeckStore.getState()
            }
          };

          console.log('✅ Data export completed');
          return JSON.stringify(exportData, null, 2);

        } catch (error) {
          console.error('❌ Data export failed:', error);
          throw error;
        }
      },

      clearAllData: async () => {
        try {
          console.log('🗑️ Clearing all app data...');

          // Clear all persisted data
          StorePersistence.clearAll();
          
          // Reset all stores
          await get().reset();
          
          console.log('✅ All app data cleared');

        } catch (error) {
          console.error('❌ Failed to clear all data:', error);
          throw error;
        }
      },

      // Health check utilities
      getHealthStatus: () => {
        const stores = {
          dailyTarot: useDailyTarotStore.getState(),
          spread: useSpreadStore.getState(),
          diary: useDiaryStore.getState(),
          settings: useSettingsStore.getState(),
          deck: useDeckStore.getState()
        };

        const errors = Object.entries(stores)
          .filter(([, store]) => store.error)
          .map(([name, store]) => ({ store: name, error: store.error }));

        const loading = Object.entries(stores)
          .filter(([, store]) => store.isLoading)
          .map(([name]) => name);

        return {
          isHealthy: errors.length === 0,
          isInitialized: get().isInitialized,
          databaseReady: DatabaseSyncUtils.isDatabaseReady(),
          errors,
          loading,
          storageStats: StorePersistence.getStorageStats(),
          syncStats: DatabaseSyncUtils.getSyncStats()
        };
      },

      // Development utilities
      getStoreStates: () => ({
        dailyTarot: useDailyTarotStore.getState(),
        spread: useSpreadStore.getState(), 
        diary: useDiaryStore.getState(),
        settings: useSettingsStore.getState(),
        deck: useDeckStore.getState(),
        root: get()
      }),

      // Error handling
      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'root-store',
      enabled: __DEV__
    }
  )
);

// Create and export the root store
export const useRootStore = createRootStore();

// Export individual store hooks for convenience
export {
  useDailyTarotStore,
  useSpreadStore,
  useDiaryStore,
  useSettingsStore,
  useDeckStore
};

// Export individual store actions for convenience
export {
  dailyTarotActions,
  spreadActions,
  diaryActions,
  settingsActions,
  deckActions
};

// Export store utilities
export {
  StorePersistence,
  DatabaseSyncUtils
};

// Export root store actions for external use
export const rootStoreActions = {
  initialize: () => useRootStore.getState().initialize(),
  reset: () => useRootStore.getState().reset(),
  clearAllErrors: () => useRootStore.getState().clearAllErrors(),
  changeActiveDeck: (deckId: string) => useRootStore.getState().changeActiveDeck(deckId),
  syncAllStores: () => useRootStore.getState().syncAllStores(),
  exportAllData: () => useRootStore.getState().exportAllData(),
  clearAllData: () => useRootStore.getState().clearAllData(),
  getHealthStatus: () => useRootStore.getState().getHealthStatus(),
  getStoreStates: () => useRootStore.getState().getStoreStates()
};

// Default export
export default useRootStore;