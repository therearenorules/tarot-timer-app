/**
 * Settings Store - Manages app preferences and configuration
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { persist } from './middleware/persistence';
import { databaseSync, DatabaseSyncStrategies } from './middleware/database';
import { SettingsState, StoreError } from './types';
import { databaseService } from '@/lib/database';

/**
 * Default settings values
 */
const DEFAULT_SETTINGS: Omit<SettingsState, 'isLoading' | 'error' | 'clearError' | 'reset' | 'updateSetting' | 'loadSettings' | 'resetToDefaults' | 'addNotificationTime' | 'removeNotificationTime' | 'purchaseDeck' | 'checkDeckPurchased' | 'restorePurchases'> = {
  selectedDeckId: 'classic',
  notificationsEnabled: true,
  hourlyNotifications: false,
  dailyReminder: true,
  customNotificationTimes: [9, 12, 18], // 9 AM, 12 PM, 6 PM
  theme: 'light',
  autoSaveReadings: true,
  adRemovalPurchased: false,
  purchasedDecks: []
};

/**
 * Settings Store Implementation
 */
const createSettingsStore = () => create<SettingsState>()(
  devtools(
    persist(
      databaseSync(
        immer((set, get) => ({
          // Initial state
          ...DEFAULT_SETTINGS,
          isLoading: false,
          error: null,

          // Base store actions
          clearError: () => set((state) => {
            state.error = null;
          }),

          reset: () => set((state) => {
            Object.assign(state, {
              ...DEFAULT_SETTINGS,
              isLoading: false,
              error: null
            });
          }),

          // Settings actions
          updateSetting: async (key, value) => {
            try {
              set((state) => {
                state.isLoading = true;
                state.error = null;
              });

              // Update local state immediately (optimistic update)
              set((state) => {
                (state as any)[key] = value;
              });

              // Sync to database
              if (databaseService.isReady()) {
                await syncSettingToDatabase(key as string, value);
              }

              set((state) => {
                state.isLoading = false;
              });

            } catch (error) {
              const message = error instanceof Error ? error.message : `Failed to update ${String(key)}`;
              console.error(`Failed to update setting ${String(key)}:`, message);
              
              set((state) => {
                state.error = message;
                state.isLoading = false;
              });
              
              throw error;
            }
          },

          loadSettings: async () => {
            try {
              set((state) => {
                state.isLoading = true;
                state.error = null;
              });

              if (!databaseService.isReady()) {
                throw new StoreError('Database not ready', 'settings', 'loadSettings');
              }

              // Load settings from database
              const preferences = await databaseService.settings.getAppPreferences();
              
              // Load custom notification times
              const customTimes = await databaseService.settings.getJSONSetting<number[]>(
                'custom_notification_times',
                DEFAULT_SETTINGS.customNotificationTimes
              );

              // Load purchased decks
              const purchasedDecks = await databaseService.settings.getJSONSetting<string[]>(
                'purchased_decks',
                []
              );

              // Check ad removal purchase
              const adRemovalPurchased = await databaseService.purchases.isPurchaseActive('remove_ads');

              set((state) => {
                state.selectedDeckId = preferences.activeDeckId;
                state.notificationsEnabled = preferences.notificationsEnabled;
                state.hourlyNotifications = preferences.hourlyNotifications;
                state.dailyReminder = preferences.dailyReminder;
                state.theme = preferences.theme;
                state.autoSaveReadings = preferences.autoSaveReadings;
                state.customNotificationTimes = customTimes || DEFAULT_SETTINGS.customNotificationTimes;
                state.purchasedDecks = purchasedDecks || [];
                state.adRemovalPurchased = adRemovalPurchased;
                state.isLoading = false;
              });

            } catch (error) {
              const message = error instanceof Error ? error.message : 'Failed to load settings';
              console.error('Failed to load settings:', message);
              
              set((state) => {
                state.error = message;
                state.isLoading = false;
              });
            }
          },

          resetToDefaults: async () => {
            try {
              set((state) => {
                state.isLoading = true;
                state.error = null;
              });

              // Reset to defaults
              set((state) => {
                Object.assign(state, DEFAULT_SETTINGS);
              });

              // Sync all default settings to database
              if (databaseService.isReady()) {
                await databaseService.settings.updateAppPreferences({
                  notificationsEnabled: DEFAULT_SETTINGS.notificationsEnabled,
                  hourlyNotifications: DEFAULT_SETTINGS.hourlyNotifications,
                  dailyReminder: DEFAULT_SETTINGS.dailyReminder,
                  activeDeckId: DEFAULT_SETTINGS.selectedDeckId,
                  autoSaveReadings: DEFAULT_SETTINGS.autoSaveReadings,
                  theme: DEFAULT_SETTINGS.theme
                });

                await databaseService.settings.setJSONSetting('custom_notification_times', DEFAULT_SETTINGS.customNotificationTimes);
                await databaseService.settings.setJSONSetting('purchased_decks', []);
              }

              set((state) => {
                state.isLoading = false;
              });

            } catch (error) {
              const message = error instanceof Error ? error.message : 'Failed to reset settings';
              console.error('Failed to reset settings:', message);
              
              set((state) => {
                state.error = message;
                state.isLoading = false;
              });
              
              throw error;
            }
          },

          // Notification helpers
          addNotificationTime: async (hour: number) => {
            const state = get();
            
            if (hour < 0 || hour > 23) {
              throw new StoreError('Invalid hour', 'settings', 'addNotificationTime');
            }

            if (state.customNotificationTimes.includes(hour)) {
              return; // Already exists
            }

            const newTimes = [...state.customNotificationTimes, hour].sort((a, b) => a - b);
            await get().updateSetting('customNotificationTimes', newTimes);
          },

          removeNotificationTime: async (hour: number) => {
            const state = get();
            const newTimes = state.customNotificationTimes.filter(t => t !== hour);
            await get().updateSetting('customNotificationTimes', newTimes);
          },

          // Premium helpers
          purchaseDeck: async (deckId: string) => {
            try {
              if (!databaseService.isReady()) {
                throw new StoreError('Database not ready', 'settings', 'purchaseDeck');
              }

              // Record purchase in database
              await databaseService.purchases.createPurchase({
                productId: `deck_${deckId}`,
                platform: 'ios', // TODO: Detect platform
                isActive: true
              });

              // Update local state
              const state = get();
              if (!state.purchasedDecks.includes(deckId)) {
                const newPurchasedDecks = [...state.purchasedDecks, deckId];
                await get().updateSetting('purchasedDecks', newPurchasedDecks);
              }

            } catch (error) {
              const message = error instanceof Error ? error.message : 'Failed to purchase deck';
              console.error('Failed to purchase deck:', message);
              throw error;
            }
          },

          checkDeckPurchased: (deckId: string) => {
            const state = get();
            return state.purchasedDecks.includes(deckId);
          },

          restorePurchases: async () => {
            try {
              set((state) => {
                state.isLoading = true;
                state.error = null;
              });

              if (!databaseService.isReady()) {
                throw new StoreError('Database not ready', 'settings', 'restorePurchases');
              }

              // Get all active purchases from database
              const activePurchases = await databaseService.purchases.getActivePurchases();
              
              // Extract deck purchases
              const deckPurchases = activePurchases
                .filter(p => p.productId.startsWith('deck_'))
                .map(p => p.productId.replace('deck_', ''));

              // Check ad removal
              const adRemovalPurchased = activePurchases.some(p => p.productId === 'remove_ads');

              set((state) => {
                state.purchasedDecks = deckPurchases;
                state.adRemovalPurchased = adRemovalPurchased;
                state.isLoading = false;
              });

              // Sync to settings storage
              await databaseService.settings.setJSONSetting('purchased_decks', deckPurchases);

            } catch (error) {
              const message = error instanceof Error ? error.message : 'Failed to restore purchases';
              console.error('Failed to restore purchases:', message);
              
              set((state) => {
                state.error = message;
                state.isLoading = false;
              });
              
              throw error;
            }
          }
        })),
        {
          enabled: true,
          syncStrategies: DatabaseSyncStrategies.settingsSync
        }
      ),
      {
        name: 'settings-store',
        partialize: (state) => ({
          selectedDeckId: state.selectedDeckId,
          notificationsEnabled: state.notificationsEnabled,
          hourlyNotifications: state.hourlyNotifications,
          dailyReminder: state.dailyReminder,
          customNotificationTimes: state.customNotificationTimes,
          theme: state.theme,
          autoSaveReadings: state.autoSaveReadings,
          adRemovalPurchased: state.adRemovalPurchased,
          purchasedDecks: state.purchasedDecks
        }),
        onRehydrateStorage: async (state) => {
          // Load fresh settings from database after rehydration
          if (state && databaseService.isReady()) {
            try {
              await state.loadSettings();
            } catch (error) {
              console.error('Failed to load settings after rehydration:', error);
            }
          }
        }
      }
    ),
    {
      name: 'settings-store',
      enabled: __DEV__
    }
  )
);

/**
 * Sync individual setting to database
 */
async function syncSettingToDatabase(key: string, value: any): Promise<void> {
  if (!databaseService.isReady()) {
    return;
  }

  try {
    switch (key) {
      case 'selectedDeckId':
        await databaseService.settings.setActiveDeckId(value);
        break;
      case 'notificationsEnabled':
        await databaseService.settings.setNotificationsEnabled(value);
        break;
      case 'hourlyNotifications':
        await databaseService.settings.setHourlyNotifications(value);
        break;
      case 'dailyReminder':
        await databaseService.settings.setDailyReminder(value);
        break;
      case 'theme':
        await databaseService.settings.setTheme(value);
        break;
      case 'autoSaveReadings':
        await databaseService.settings.setAutoSaveReadings(value);
        break;
      case 'customNotificationTimes':
        await databaseService.settings.setJSONSetting('custom_notification_times', value);
        break;
      case 'purchasedDecks':
        await databaseService.settings.setJSONSetting('purchased_decks', value);
        break;
      default:
        // Generic setting
        await databaseService.settings.setSetting(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error(`Failed to sync setting ${key} to database:`, error);
    throw error;
  }
}

// Export store
export const useSettingsStore = createSettingsStore();

// Export store actions for external use
export const settingsActions = {
  updateSetting: <K extends keyof SettingsState>(key: K, value: SettingsState[K]) => 
    useSettingsStore.getState().updateSetting(key, value),
  loadSettings: () => useSettingsStore.getState().loadSettings(),
  resetToDefaults: () => useSettingsStore.getState().resetToDefaults(),
  addNotificationTime: (hour: number) => useSettingsStore.getState().addNotificationTime(hour),
  removeNotificationTime: (hour: number) => useSettingsStore.getState().removeNotificationTime(hour),
  purchaseDeck: (deckId: string) => useSettingsStore.getState().purchaseDeck(deckId),
  restorePurchases: () => useSettingsStore.getState().restorePurchases(),
  clearError: () => useSettingsStore.getState().clearError(),
  reset: () => useSettingsStore.getState().reset()
};

export default useSettingsStore;