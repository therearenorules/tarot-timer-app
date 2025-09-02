/**
 * Store types and interfaces for Zustand state management
 */

import { DailySession, DailyCard, Spread, SpreadCard } from '@/lib/database/types';

// Base store interface
export interface BaseStoreState {
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  reset: () => void;
}

// Daily Tarot Store Types
export interface DailyTarotState extends BaseStoreState {
  // Current session data
  currentSession: DailySession | null;
  currentCards: DailyCard[];
  currentHour: number;
  
  // Actions
  initializeToday: () => Promise<void>;
  generateDailyCards: (date?: string) => Promise<void>;
  updateCardMemo: (hour: number, memo: string) => Promise<void>;
  getCurrentCard: () => DailyCard | null;
  getCardByHour: (hour: number) => DailyCard | null;
  refreshSession: () => Promise<void>;
  updateCurrentHour: () => void;
  
  // Statistics
  getSessionStats: () => {
    totalCards: number;
    cardsWithMemos: number;
    completionPercentage: number;
  };
}

// Spread Store Types
export interface SpreadLayout {
  name: string;
  cardCount: number;
  positions: SpreadPosition[];
}

export interface SpreadPosition {
  index: number;
  x: number;       // Relative position 0-1
  y: number;       // Relative position 0-1
  width: number;   // Relative width 0-1
  height: number;  // Relative height 0-1
  rotation?: number;
  label: string;
}

export interface SpreadState extends BaseStoreState {
  // Current spread data
  currentSpread: Spread | null;
  currentSpreadCards: SpreadCard[];
  currentLayout: SpreadLayout | null;
  availableLayouts: SpreadLayout[];
  isDrawing: boolean;
  
  // Actions
  loadAvailableLayouts: () => Promise<void>;
  startNewSpread: (spreadType: string) => Promise<void>;
  drawCard: (positionIndex: number, cardKey?: string) => Promise<void>;
  toggleCardReversed: (positionIndex: number) => void;
  updateCardPosition: (positionIndex: number, x: number, y: number) => void;
  saveSpread: (title?: string) => Promise<void>;
  resetSpread: () => void;
  loadSpreadLayout: (spreadType: string) => SpreadLayout | null;
  
  // Utility
  getCardAtPosition: (positionIndex: number) => SpreadCard | null;
  canDrawCard: (positionIndex: number) => boolean;
}

// Diary Store Types
export interface DiaryState extends BaseStoreState {
  // Data
  dailySessions: DailySession[];
  savedSpreads: Spread[];
  currentFilter: 'all' | 'daily' | 'spreads';
  
  // Pagination
  currentPage: number;
  pageSize: number;
  hasMore: boolean;
  
  // Actions
  loadDiarySessions: (limit?: number, offset?: number) => Promise<void>;
  loadSavedSpreads: (limit?: number, offset?: number) => Promise<void>;
  loadMoreData: () => Promise<void>;
  deleteSpread: (spreadId: number) => Promise<void>;
  deleteSession: (sessionId: number) => Promise<void>;
  getSessionByDate: (date: string) => DailySession | null;
  setFilter: (filter: 'all' | 'daily' | 'spreads') => void;
  refreshData: () => Promise<void>;
  
  // Search and filtering
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  getFilteredData: () => (DailySession | Spread)[];
}

// Settings Store Types
export interface SettingsState extends BaseStoreState {
  // Core settings
  selectedDeckId: string;
  notificationsEnabled: boolean;
  hourlyNotifications: boolean;
  dailyReminder: boolean;
  customNotificationTimes: number[]; // Hours 0-23
  
  // App preferences
  theme: 'light' | 'dark';
  autoSaveReadings: boolean;
  
  // Premium features
  adRemovalPurchased: boolean;
  purchasedDecks: string[];
  
  // Actions
  updateSetting: <K extends keyof SettingsState>(
    key: K, 
    value: SettingsState[K]
  ) => Promise<void>;
  loadSettings: () => Promise<void>;
  resetToDefaults: () => Promise<void>;
  
  // Notification helpers
  addNotificationTime: (hour: number) => Promise<void>;
  removeNotificationTime: (hour: number) => Promise<void>;
  
  // Premium helpers
  purchaseDeck: (deckId: string) => Promise<void>;
  checkDeckPurchased: (deckId: string) => boolean;
  restorePurchases: () => Promise<void>;
}

// Deck Store Types
export interface DeckInfo {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  type: 'free' | 'premium';
  price?: number;
  version: string;
  imagePreview: string;
}

export interface DeckCard {
  key: string;
  name: string;
  upright: string[];
  reversed: string[];
  imageUri: string;
}

export interface DeckData {
  info: DeckInfo;
  cards: DeckCard[];
}

export interface DeckState extends BaseStoreState {
  // Deck data  
  availableDecks: DeckInfo[];
  selectedDeckId: string;
  selectedDeck: DeckData | null;
  cards: DeckCard[];
  
  // Additional properties to match implementation
  currentDeck: DeckData | null;
  deckAssets: Record<string, string>; // cardKey -> local image path
  
  // Loading states
  isLoadingDeck: boolean;
  preloadProgress: number;
  
  // Actions
  loadDecks: () => Promise<void>;
  selectDeck: (deckId: string) => Promise<void>;
  initializeDefaultDeck: () => Promise<void>;
  loadAvailableDecks: () => Promise<void>;
  loadDeck: (deckId: string) => Promise<void>;
  switchDeck: (deckId: string) => Promise<void>;
  preloadDeckAssets: (deckId: string) => Promise<void>;
  
  // Card helpers
  getCard: (cardKey: string) => DeckCard | null;
  getRandomCard: () => DeckCard | null;
  getAllCards: () => DeckCard[];
  getCardsByArcana: (arcana: 'major' | 'minor') => DeckCard[];
  getMajorArcana: () => DeckCard[];
  getMinorArcana: () => DeckCard[];
  getCardCount: () => number;
  
  // Deck management
  refreshDeckList: () => Promise<void>;
  checkDeckAvailability: (deckId: string) => boolean;
  getFreeDecks: () => DeckInfo[];
  getPremiumDecks: () => DeckInfo[];
}

// Store composition types
export interface RootStore extends BaseStoreState {
  // Store references
  dailyTarot: any; // Store instances
  spread: any;
  diary: any;
  settings: any;
  deck: any;
  
  // Root store state
  isInitialized: boolean;
  
  // Global actions
  initialize: () => Promise<void>;
  clearAllErrors: () => void;
  changeActiveDeck: (deckId: string) => Promise<void>;
  syncAllStores: () => Promise<void>;
  exportAllData: () => Promise<string>;
  clearAllData: () => Promise<void>;
  getHealthStatus: () => any;
  getStoreStates: () => any;
}

// Store action types for middleware
export type StoreAction = {
  type: string;
  payload?: any;
  timestamp: number;
  storeName: string;
};

// Persistence configuration
export interface PersistenceConfig {
  name: string;
  storage: any;
  partialize?: (state: any) => any;
  onRehydrateStorage?: () => void;
  skipHydration?: boolean;
}

// Database sync configuration
export interface DatabaseSyncConfig {
  enabled: boolean;
  debounceMs: number;
  syncOnlyDirty: boolean;
  conflictResolution: 'client' | 'server' | 'manual';
}

// Store middleware options
export interface StoreMiddlewareOptions {
  enableDevtools: boolean;
  enablePersistence: boolean;
  enableDatabaseSync: boolean;
  enableImmer: boolean;
  enableLogging: boolean;
}

// Error types
export class StoreError extends Error {
  constructor(
    message: string,
    public storeName: string,
    public action?: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'StoreError';
  }
}

// Utility types
export type StoreSlice<T> = (
  set: (partial: T | Partial<T> | ((state: T) => T | Partial<T>)) => void,
  get: () => T
) => T;

export type AsyncStoreSlice<T> = (
  set: (partial: T | Partial<T> | ((state: T) => T | Partial<T>)) => void,
  get: () => T
) => Promise<T> | T;