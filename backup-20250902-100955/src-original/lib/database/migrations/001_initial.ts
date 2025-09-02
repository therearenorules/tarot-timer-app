import { Migration } from '../types';
import { createMigration } from './migration.types';

/**
 * Initial migration: Create all core tables
 */
export const migration001: Migration = createMigration(
  1,
  'Create initial database schema',
  
  // UP: Create tables
  async (db) => {
    console.log('Running migration 001: Creating initial schema...');

    // Create migration tracking table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version INTEGER PRIMARY KEY,
        description TEXT NOT NULL,
        applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        success BOOLEAN DEFAULT TRUE
      )
    `);

    // Create daily_sessions table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS daily_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT UNIQUE NOT NULL,
        seed TEXT NOT NULL,
        deck_id TEXT NOT NULL DEFAULT 'classic',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create daily_cards table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS daily_cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        session_id INTEGER NOT NULL,
        hour INTEGER NOT NULL CHECK(hour >= 0 AND hour <= 23),
        card_key TEXT NOT NULL,
        memo TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (session_id) REFERENCES daily_sessions(id) ON DELETE CASCADE,
        UNIQUE(session_id, hour)
      )
    `);

    // Create spreads table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS spreads (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        spread_type TEXT NOT NULL,
        deck_id TEXT NOT NULL DEFAULT 'classic',
        title TEXT,
        image_uri TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create spread_cards table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS spread_cards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        spread_id INTEGER NOT NULL,
        position_index INTEGER NOT NULL,
        card_key TEXT NOT NULL,
        reversed BOOLEAN DEFAULT FALSE,
        x REAL NOT NULL,
        y REAL NOT NULL,
        width REAL NOT NULL,
        height REAL NOT NULL,
        FOREIGN KEY (spread_id) REFERENCES spreads(id) ON DELETE CASCADE,
        UNIQUE(spread_id, position_index)
      )
    `);

    // Create settings table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create purchases table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS purchases (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id TEXT NOT NULL,
        purchase_date DATETIME DEFAULT CURRENT_TIMESTAMP,
        platform TEXT NOT NULL CHECK(platform IN ('ios', 'android')),
        is_active BOOLEAN DEFAULT TRUE
      )
    `);

    // Create indexes for better performance
    await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_daily_sessions_date 
      ON daily_sessions(date)
    `);

    await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_daily_cards_session_hour 
      ON daily_cards(session_id, hour)
    `);

    await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_daily_cards_updated 
      ON daily_cards(updated_at DESC)
    `);

    await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_spreads_created 
      ON spreads(created_at DESC)
    `);

    await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_spread_cards_spread 
      ON spread_cards(spread_id, position_index)
    `);

    await db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_purchases_product 
      ON purchases(product_id, is_active)
    `);

    // Insert default settings
    await db.execAsync(`
      INSERT OR IGNORE INTO settings (key, value) VALUES
      ('app_version', '1.0.0'),
      ('notifications_enabled', 'true'),
      ('hourly_notifications', 'false'),
      ('daily_reminder', 'true'),
      ('active_deck_id', 'classic'),
      ('auto_save_readings', 'true'),
      ('theme', 'light')
    `);

    console.log('Migration 001 completed successfully');
  },

  // DOWN: Drop tables
  async (db) => {
    console.log('Rolling back migration 001: Dropping initial schema...');

    const tables = [
      'purchases',
      'settings', 
      'spread_cards',
      'spreads',
      'daily_cards',
      'daily_sessions',
      'schema_migrations'
    ];

    for (const table of tables) {
      await db.execAsync(`DROP TABLE IF EXISTS ${table}`);
    }

    console.log('Migration 001 rollback completed');
  }
);