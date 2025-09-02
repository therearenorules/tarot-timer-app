import { dbConnection } from './connection';
import { migrationRunner } from './migrations';
import { DailyTarotRepository } from './repositories/dailyTarotRepository';
import { SpreadRepository } from './repositories/spreadRepository';
import { SettingsRepository } from './repositories/settingsRepository';
import { PurchaseRepository } from './repositories/purchaseRepository';
import { DatabaseError } from './types';

/**
 * Main Database Service
 * Provides centralized access to all database operations
 */
class DatabaseService {
  // Repository instances
  private _dailyTarot?: DailyTarotRepository;
  private _spreads?: SpreadRepository;
  private _settings?: SettingsRepository;
  private _purchases?: PurchaseRepository;

  private _isInitialized = false;
  private _initializationPromise?: Promise<void>;

  /**
   * Initialize the database service
   * This should be called once at app startup
   */
  async initialize(): Promise<void> {
    // Return existing initialization promise if already in progress
    if (this._initializationPromise) {
      return this._initializationPromise;
    }

    if (this._isInitialized) {
      return;
    }

    this._initializationPromise = this._performInitialization();
    return this._initializationPromise;
  }

  /**
   * Perform the actual initialization
   */
  private async _performInitialization(): Promise<void> {
    try {
      console.log('🔄 Initializing database service...');

      // Initialize database connection
      await dbConnection.initialize();
      console.log('✅ Database connection established');

      // Run migrations
      await migrationRunner.initialize();
      console.log('✅ Database migrations completed');

      // Initialize repositories
      this._dailyTarot = new DailyTarotRepository();
      this._spreads = new SpreadRepository();
      this._settings = new SettingsRepository();
      this._purchases = new PurchaseRepository();

      this._isInitialized = true;
      console.log('✅ Database service initialized successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Database initialization failed:', message);
      throw new DatabaseError(`Database initialization failed: ${message}`);
    }
  }

  /**
   * Check if database is ready
   */
  isReady(): boolean {
    return this._isInitialized && dbConnection.isReady();
  }

  /**
   * Get daily tarot repository
   */
  get dailyTarot(): DailyTarotRepository {
    if (!this._dailyTarot || !this._isInitialized) {
      throw new DatabaseError('Database not initialized. Call initialize() first.');
    }
    return this._dailyTarot;
  }

  /**
   * Get spreads repository
   */
  get spreads(): SpreadRepository {
    if (!this._spreads || !this._isInitialized) {
      throw new DatabaseError('Database not initialized. Call initialize() first.');
    }
    return this._spreads;
  }

  /**
   * Get settings repository
   */
  get settings(): SettingsRepository {
    if (!this._settings || !this._isInitialized) {
      throw new DatabaseError('Database not initialized. Call initialize() first.');
    }
    return this._settings;
  }

  /**
   * Get purchases repository
   */
  get purchases(): PurchaseRepository {
    if (!this._purchases || !this._isInitialized) {
      throw new DatabaseError('Database not initialized. Call initialize() first.');
    }
    return this._purchases;
  }

  /**
   * Get database connection (for advanced operations)
   */
  getConnection() {
    return dbConnection;
  }

  /**
   * Get migration runner (for development/maintenance)
   */
  getMigrations() {
    return migrationRunner;
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    await dbConnection.close();
    this._isInitialized = false;
    this._initializationPromise = undefined;
  }

  /**
   * Reset database (development only)
   */
  async reset(): Promise<void> {
    if (!__DEV__) {
      throw new DatabaseError('Database reset is only allowed in development mode');
    }

    console.log('🔄 Resetting database...');
    
    await migrationRunner.reset();
    await this.initialize();
    
    console.log('✅ Database reset completed');
  }

  /**
   * Get database health status
   */
  async getHealthStatus(): Promise<{
    isInitialized: boolean;
    connectionReady: boolean;
    currentMigrationVersion: number;
    latestMigrationVersion: number;
    tablesExist: boolean;
  }> {
    try {
      const currentVersion = await migrationRunner.getCurrentVersion();
      const latestVersion = migrationRunner.getLatestVersion();
      
      // Check if core tables exist
      const result = await dbConnection.query<{ name: string }>(
        "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('daily_sessions', 'spreads', 'settings')"
      );

      return {
        isInitialized: this._isInitialized,
        connectionReady: dbConnection.isReady(),
        currentMigrationVersion: currentVersion,
        latestMigrationVersion: latestVersion,
        tablesExist: result.rows.length >= 3
      };
    } catch (error) {
      return {
        isInitialized: false,
        connectionReady: false,
        currentMigrationVersion: 0,
        latestMigrationVersion: 0,
        tablesExist: false
      };
    }
  }

  /**
   * Run database maintenance tasks
   */
  async performMaintenance(): Promise<void> {
    console.log('🔄 Running database maintenance...');

    try {
      // Clean up old purchases (older than 1 year)
      const cleanedPurchases = await this.purchases.cleanupOldPurchases(365);
      
      // Analyze database for optimization
      await dbConnection.query('ANALYZE');
      
      // Run vacuum to reclaim space (use sparingly)
      if (__DEV__) {
        await dbConnection.query('VACUUM');
      }

      console.log(`✅ Database maintenance completed. Cleaned ${cleanedPurchases} old records.`);
    } catch (error) {
      console.error('❌ Database maintenance failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();

// Export repositories and types for direct import
export { DailyTarotRepository } from './repositories/dailyTarotRepository';
export { SpreadRepository } from './repositories/spreadRepository';
export { SettingsRepository } from './repositories/settingsRepository';
export { PurchaseRepository } from './repositories/purchaseRepository';

export type { 
  DailySession, 
  DailyCard, 
  Spread, 
  SpreadCard, 
  Setting, 
  Purchase,
  Deck,
  Card,
  DatabaseError
} from './types';

// Export connection and migration utilities
export { dbConnection } from './connection';
export { migrationRunner } from './migrations';

export default databaseService;