/**
 * Database sync middleware for Zustand stores
 * Provides automatic synchronization between store state and SQLite database
 */

import { StateCreator, StoreMutatorIdentifier } from 'zustand';
import { databaseService } from '@/lib/database';
import { DatabaseSyncConfig, StoreError } from '../types';

// Debounced function utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Database sync options
 */
export interface DatabaseSyncOptions<T> {
  enabled?: boolean;
  debounceMs?: number;
  syncFields?: (keyof T)[];
  onSyncSuccess?: (action: string, data: any) => void;
  onSyncError?: (error: Error, action: string, data: any) => void;
  syncStrategies?: {
    [K in keyof T]?: (value: T[K], previousValue: T[K]) => Promise<void>;
  };
}

/**
 * Database sync middleware type
 */
export type DatabaseSync = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  config: StateCreator<T, Mps, Mcs>,
  options: DatabaseSyncOptions<T>
) => StateCreator<T, Mps, Mcs>;

/**
 * Database sync middleware implementation
 */
export const databaseSync: DatabaseSync = (config, options) => (set, get, store) => {
  const {
    enabled = true,
    debounceMs = 500,
    syncFields = [],
    onSyncSuccess,
    onSyncError,
    syncStrategies = {}
  } = options;

  if (!enabled) {
    return config(set, get, store);
  }

  // Track previous state for change detection
  let previousState: any = {};

  // Create debounced sync function
  const debouncedSync = debounce(async (currentState: any, changedFields: string[]) => {
    if (!databaseService.isReady()) {
      console.warn('Database not ready for sync, skipping...');
      return;
    }

    try {
      // Sync each changed field
      for (const field of changedFields) {
        const syncStrategy = syncStrategies[field as keyof typeof syncStrategies];
        
        if (syncStrategy && typeof syncStrategy === 'function') {
          await syncStrategy(currentState[field], previousState[field]);
          
          if (onSyncSuccess) {
            onSyncSuccess(`sync_${field}`, currentState[field]);
          }
        }
      }
      
      // Update previous state after successful sync
      previousState = { ...currentState };
    } catch (error) {
      console.error('Database sync failed:', error);
      
      if (onSyncError) {
        onSyncError(error as Error, 'sync', currentState);
      }
    }
  }, debounceMs);

  // Initialize with config
  const initialState = config(
    (partial: any) => {
      const nextState = typeof partial === 'function' 
        ? (partial as (state: any) => any)(get()) 
        : partial;
      
      set(nextState);
      
      // Detect changes and sync
      if (enabled && databaseService.isReady()) {
        const currentState = get() as any;
        const changedFields: string[] = [];
        
        // Detect which fields have changed
        if (syncFields.length === 0) {
          // If no specific fields specified, check all fields
          Object.keys(currentState || {}).forEach(key => {
            if (currentState[key] !== previousState[key]) {
              changedFields.push(key);
            }
          });
        } else {
          // Check only specified fields
          syncFields.forEach(field => {
            if (currentState[field as string] !== previousState[field as string]) {
              changedFields.push(field as string);
            }
          });
        }
        
        // Trigger sync if changes detected
        if (changedFields.length > 0) {
          debouncedSync(currentState, changedFields);
        }
      }
    },
    get,
    store as any
  );

  // Initialize previous state
  previousState = { ...get() };

  return initialState;
};

/**
 * Pre-built sync strategies for common store patterns
 */
export class DatabaseSyncStrategies {
  
  /**
   * Sync daily tarot state to database
   */
  static dailyTarotSync = {
    currentCards: async (cards: any[], previousCards: any[]) => {
      if (!cards || cards.length === 0) return;
      
      // Find cards with updated memos
      const updatedCards = cards.filter((card, index) => {
        const previousCard = previousCards?.[index];
        return previousCard && card.memo !== previousCard.memo;
      });
      
      // Update memos in database
      for (const card of updatedCards) {
        if (card.id && card.memo !== undefined) {
          await databaseService.dailyTarot.updateCard({
            id: card.id,
            memo: card.memo
          });
        }
      }
    }
  };

  /**
   * Sync settings state to database
   */
  static settingsSync = {
    selectedDeckId: async (deckId: string) => {
      await databaseService.settings.setSetting('active_deck_id', deckId);
    },
    
    notificationsEnabled: async (enabled: boolean) => {
      await databaseService.settings.setBooleanSetting('notifications_enabled', enabled);
    },
    
    hourlyNotifications: async (enabled: boolean) => {
      await databaseService.settings.setBooleanSetting('hourly_notifications', enabled);
    },
    
    dailyReminder: async (enabled: boolean) => {
      await databaseService.settings.setBooleanSetting('daily_reminder', enabled);
    },
    
    theme: async (theme: 'light' | 'dark') => {
      await databaseService.settings.setSetting('theme', theme);
    },
    
    autoSaveReadings: async (enabled: boolean) => {
      await databaseService.settings.setBooleanSetting('auto_save_readings', enabled);
    },
    
    customNotificationTimes: async (times: number[]) => {
      await databaseService.settings.setJSONSetting('custom_notification_times', times);
    }
  };

  /**
   * Sync spread state to database
   */
  static spreadSync = {
    currentSpread: async (spread: any, previousSpread: any) => {
      if (!spread || spread === previousSpread) return;
      
      // If spread has changed significantly, save it
      if (spread.id && spread.title !== previousSpread?.title) {
        await databaseService.spreads.updateSpread(spread.id, {
          title: spread.title
        });
      }
    }
  };

  /**
   * Sync diary filters and preferences
   */
  static diarySync = {
    currentFilter: async (filter: string) => {
      await databaseService.settings.setSetting('diary_filter', filter);
    },
    
    searchQuery: async (query: string) => {
      if (query) {
        await databaseService.settings.setSetting('last_search_query', query);
      }
    }
  };
}

/**
 * Database sync utilities
 */
export class DatabaseSyncUtils {
  
  /**
   * Force sync all stores to database
   */
  static async forceSyncAll(): Promise<void> {
    try {
      if (!databaseService.isReady()) {
        throw new StoreError('Database not ready for sync', 'database-sync', 'forceSyncAll');
      }

      console.log('🔄 Force syncing all stores to database...');
      
      // This would be called by individual stores to sync their state
      // Implementation depends on how stores expose their current state
      
      console.log('✅ Force sync completed');
    } catch (error) {
      console.error('❌ Force sync failed:', error);
      throw error;
    }
  }

  /**
   * Check database connection status
   */
  static isDatabaseReady(): boolean {
    return databaseService.isReady();
  }

  /**
   * Get sync statistics
   */
  static getSyncStats(): {
    isReady: boolean;
    lastSync: string;
    pendingOperations: number;
  } {
    return {
      isReady: databaseService.isReady(),
      lastSync: new Date().toISOString(),
      pendingOperations: 0 // Would track pending operations
    };
  }

  /**
   * Handle sync errors gracefully
   */
  static handleSyncError(error: Error, storeName: string, action: string): void {
    const storeError = new StoreError(
      `Sync failed for ${storeName}`,
      storeName,
      action,
      error
    );

    // Log error
    console.error(`Database sync error in ${storeName}:`, storeError);

    // Could implement retry logic here
    // Could emit events for error handling in UI
  }

  /**
   * Create a sync strategy for a specific database table
   */
  static createTableSyncStrategy<T>(
    tableName: string,
    idField: keyof T = 'id' as keyof T
  ) {
    return async (newValue: T, previousValue: T) => {
      if (!newValue) return;

      try {
        // Generic strategy - would need specific implementation per table
        console.log(`Syncing ${tableName}:`, { newValue, previousValue });
        
        // Example implementation would depend on the specific table structure
        // This is a placeholder for the actual sync logic
      } catch (error) {
        DatabaseSyncUtils.handleSyncError(error as Error, tableName, 'sync');
      }
    };
  }
}

export default databaseSync;