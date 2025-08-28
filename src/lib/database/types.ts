/**
 * Database entity types for Tarot Timer app
 */

// Daily Sessions
export interface DailySession {
  id: number;
  date: string;           // YYYY-MM-DD format
  seed: string;           // Random seed for card generation
  deckId: string;         // ID of the deck used
  createdAt: string;      // ISO datetime string
  generatedAt?: string;   // When cards were generated
  cards?: DailyCard[];    // Associated cards
}

export interface CreateDailySession {
  date: string;
  seed: string;
  deckId?: string;
}

// Daily Cards
export interface DailyCard {
  id: number;
  sessionId: number;
  hour: number;           // 0-23
  cardKey: string;        // e.g., 'fool', 'magician'
  cardName?: string;      // Display name of the card
  keywords?: string[];    // Card keywords
  memo?: string;          // User's notes
  createdAt: string;
  updatedAt: string;
}

export interface CreateDailyCard {
  sessionId: number;
  hour: number;
  cardKey: string;
  memo?: string;
}

export interface UpdateDailyCard {
  id: number;
  memo?: string;
}

// Spreads
export interface Spread {
  id: number;
  spreadType: string;     // 'celtic_cross', '5_card', etc.
  deckId: string;
  title?: string;         // Optional user title
  imageUri?: string;      // Captured screenshot path
  createdAt: string;
}

export interface CreateSpread {
  spreadType: string;
  deckId: string;
  title?: string;
  imageUri?: string;
}

// Spread Cards
export interface SpreadCard {
  id: number;
  spreadId: number;
  positionIndex: number;  // Position in the spread layout
  cardKey: string;
  reversed: boolean;
  x: number;              // Relative X position (0-1)
  y: number;              // Relative Y position (0-1)
  width: number;          // Relative width (0-1)
  height: number;         // Relative height (0-1)
}

export interface CreateSpreadCard {
  spreadId: number;
  positionIndex: number;
  cardKey: string;
  reversed?: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
}

// Settings
export interface Setting {
  key: string;
  value: string;
  updatedAt: string;
}

export interface CreateSetting {
  key: string;
  value: string;
}

// Purchases
export interface Purchase {
  id: number;
  productId: string;
  purchaseDate: string;
  platform: 'ios' | 'android';
  isActive: boolean;
}

export interface CreatePurchase {
  productId: string;
  platform: 'ios' | 'android';
  isActive?: boolean;
}

// Migration Types
export interface Migration {
  version: number;
  description: string;
  up: (db: any) => Promise<void>;
  down: (db: any) => Promise<void>;
}

export interface MigrationStatus {
  version: number;
  appliedAt: string;
}

// Database Configuration
export interface DatabaseConfig {
  name: string;
  version: number;
  enableForeignKeys: boolean;
}

// Query Result Types
export interface QueryResult<T = any> {
  rows: T[];
  insertId?: number;
  rowsAffected: number;
}

// Deck Types
export interface Deck {
  id: string;
  name: string;
  description: string;
  version: string;
  isPremium?: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface Card {
  id: string;
  deckId: string;
  key: string;
  name: string;
  arcana: 'major' | 'minor';
  suit?: string;
  number?: number;
  imageUrl: string;
  meaning: {
    upright: string[];
    reversed: string[];
  };
  description: string;
}

// Database Error Types
export class DatabaseError extends Error {
  constructor(
    message: string, 
    public query?: string,
    public params?: any[]
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class MigrationError extends Error {
  constructor(
    message: string,
    public version?: number
  ) {
    super(message);
    this.name = 'MigrationError';
  }
}