/**
 * MMKV-based persistence middleware for Zustand stores
 */

import { MMKV } from 'react-native-mmkv';
import { StateCreator, StoreMutatorIdentifier } from 'zustand';
import { PersistenceConfig, StoreError } from '../types';

// Initialize MMKV storage
const storage = new MMKV({
  id: 'tarot-timer-stores',
  encryptionKey: __DEV__ ? undefined : 'tarot-timer-encryption-key'
});

/**
 * Create MMKV storage adapter for Zustand persist middleware
 */
export function createMMKVStorage() {
  return {
    getItem: (name: string): string | null => {
      try {
        const value = storage.getString(name);
        return value ?? null;
      } catch (error) {
        console.error(`MMKV getItem error for key "${name}":`, error);
        return null;
      }
    },
    
    setItem: (name: string, value: string): void => {
      try {
        storage.set(name, value);
      } catch (error) {
        console.error(`MMKV setItem error for key "${name}":`, error);
        throw new StoreError(
          `Failed to persist data for key "${name}"`,
          'persistence',
          'setItem',
          error as Error
        );
      }
    },
    
    removeItem: (name: string): void => {
      try {
        storage.delete(name);
      } catch (error) {
        console.error(`MMKV removeItem error for key "${name}":`, error);
      }
    },
  };
}

/**
 * Enhanced persist middleware with better error handling and performance
 */
export type PersistOptions<T> = {
  name: string;
  partialize?: (state: T) => Partial<T>;
  onRehydrateStorage?: (state?: T) => void | Promise<void>;
  skipHydration?: boolean;
  version?: number;
  migrate?: (persistedState: any, version: number) => T;
  merge?: (persistedState: any, currentState: T) => T;
};

export type Persist = <
  T,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = []
>(
  config: StateCreator<T, Mps, Mcs>,
  options: PersistOptions<T>
) => StateCreator<T, Mps, Mcs>;

/**
 * Custom persist middleware implementation
 */
export const persist: Persist = (config, options) => (set, get, store) => {
  const {
    name,
    partialize = (state) => state,
    onRehydrateStorage,
    skipHydration = false,
    version = 0,
    migrate,
    merge = (persistedState, currentState) => ({ ...currentState, ...persistedState })
  } = options;

  const storageAdapter = createMMKVStorage();

  // Initialize state
  const initialState = config(
    (partial: any) => {
      const nextState = typeof partial === 'function' 
        ? (partial as (state: any) => any)(get()) 
        : partial;
      
      set(nextState);
      
      // Persist the state after each update
      try {
        const stateToPersist = partialize(get());
        storageAdapter.setItem(name, JSON.stringify({
          state: stateToPersist,
          version
        }));
      } catch (error) {
        console.error(`Failed to persist state for store "${name}":`, error);
      }
    },
    get,
    store as any
  );

  // Rehydrate state from storage
  if (!skipHydration) {
    try {
      const persistedData = storageAdapter.getItem(name);
      
      if (persistedData) {
        const parsed = JSON.parse(persistedData);
        let persistedState = parsed.state || parsed; // Handle legacy format
        const persistedVersion = parsed.version || 0;
        
        // Run migration if needed
        if (migrate && persistedVersion < version) {
          persistedState = migrate(persistedState, persistedVersion);
        }
        
        // Merge with current state
        const rehydratedState = merge(persistedState, get());
        
        // Set the rehydrated state
        set(rehydratedState);
        
        // Call rehydration callback
        if (onRehydrateStorage) {
          Promise.resolve(onRehydrateStorage(rehydratedState)).catch((error) => {
            console.error(`Rehydration callback failed for store "${name}":`, error);
          });
        }
      }
    } catch (error) {
      console.error(`Failed to rehydrate state for store "${name}":`, error);
    }
  }

  return initialState;
};

/**
 * Store persistence utilities
 */
export class StorePersistence {
  private static storageAdapter = createMMKVStorage();

  /**
   * Clear all persisted store data
   */
  static clearAll(): void {
    try {
      // Get all MMKV keys that belong to stores
      const allKeys = storage.getAllKeys();
      const storeKeys = allKeys.filter(key => 
        key.includes('-store') || 
        key.includes('tarot-timer-')
      );

      storeKeys.forEach(key => {
        storage.delete(key);
      });

      console.log(`Cleared ${storeKeys.length} persisted store keys`);
    } catch (error) {
      console.error('Failed to clear all persisted data:', error);
    }
  }

  /**
   * Clear specific store data
   */
  static clearStore(storeName: string): void {
    try {
      this.storageAdapter.removeItem(storeName);
      console.log(`Cleared persisted data for store: ${storeName}`);
    } catch (error) {
      console.error(`Failed to clear data for store "${storeName}":`, error);
    }
  }

  /**
   * Get storage statistics
   */
  static getStorageStats(): {
    totalKeys: number;
    storeKeys: string[];
    storageSize: number;
  } {
    try {
      const allKeys = storage.getAllKeys();
      const storeKeys = allKeys.filter(key => 
        key.includes('-store') || 
        key.includes('tarot-timer-')
      );

      // Calculate approximate storage size
      let storageSize = 0;
      storeKeys.forEach(key => {
        const value = storage.getString(key);
        if (value) {
          storageSize += value.length * 2; // Approximate bytes (UTF-16)
        }
      });

      return {
        totalKeys: allKeys.length,
        storeKeys,
        storageSize
      };
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return {
        totalKeys: 0,
        storeKeys: [],
        storageSize: 0
      };
    }
  }

  /**
   * Backup store data
   */
  static backupStoreData(): Record<string, any> {
    try {
      const allKeys = storage.getAllKeys();
      const storeKeys = allKeys.filter(key => 
        key.includes('-store') || 
        key.includes('tarot-timer-')
      );

      const backup: Record<string, any> = {};
      
      storeKeys.forEach(key => {
        const value = storage.getString(key);
        if (value) {
          try {
            backup[key] = JSON.parse(value);
          } catch (parseError) {
            backup[key] = value; // Store as string if not JSON
          }
        }
      });

      console.log(`Backed up ${Object.keys(backup).length} store entries`);
      return backup;
    } catch (error) {
      console.error('Failed to backup store data:', error);
      return {};
    }
  }

  /**
   * Restore store data from backup
   */
  static restoreStoreData(backup: Record<string, any>): void {
    try {
      Object.entries(backup).forEach(([key, value]) => {
        const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
        this.storageAdapter.setItem(key, stringValue);
      });

      console.log(`Restored ${Object.keys(backup).length} store entries`);
    } catch (error) {
      console.error('Failed to restore store data:', error);
      throw new StoreError(
        'Failed to restore store data from backup',
        'persistence',
        'restore',
        error as Error
      );
    }
  }
}

export default createMMKVStorage;