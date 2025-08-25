import * as SQLite from 'expo-sqlite';
import { DatabaseConfig, DatabaseError } from './types';

/**
 * SQLite Database Connection Manager
 */
class DatabaseConnection {
  private db: SQLite.SQLiteDatabase | null = null;
  private isInitialized = false;
  private readonly config: DatabaseConfig = {
    name: 'tarot_timer.db',
    version: 1,
    enableForeignKeys: true
  };

  /**
   * Initialize database connection
   */
  async initialize(): Promise<SQLite.SQLiteDatabase> {
    if (this.isInitialized && this.db) {
      return this.db;
    }

    try {
      console.log('Initializing database connection...');
      
      // Create/open database
      this.db = await SQLite.openDatabaseAsync(this.config.name);
      
      // Enable foreign key constraints
      if (this.config.enableForeignKeys) {
        await this.db.execAsync('PRAGMA foreign_keys = ON;');
      }

      // Enable Write-Ahead Logging for better concurrency
      await this.db.execAsync('PRAGMA journal_mode = WAL;');

      this.isInitialized = true;
      console.log('Database connection initialized successfully');
      
      return this.db;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Failed to initialize database:', message);
      throw new DatabaseError(`Database initialization failed: ${message}`);
    }
  }

  /**
   * Get the database instance
   */
  getDatabase(): SQLite.SQLiteDatabase {
    if (!this.db || !this.isInitialized) {
      throw new DatabaseError('Database not initialized. Call initialize() first.');
    }
    return this.db;
  }

  /**
   * Execute a SQL query with parameters
   */
  async query<T = any>(
    sql: string, 
    params: any[] = []
  ): Promise<{ rows: T[]; insertId?: number; rowsAffected: number }> {
    const db = this.getDatabase();
    
    try {
      console.log('Executing query:', sql, params);
      
      // Determine query type
      const isSelect = sql.trim().toLowerCase().startsWith('select');
      const isInsert = sql.trim().toLowerCase().startsWith('insert');
      
      if (isSelect) {
        const result = await db.getAllAsync(sql, ...params);
        return {
          rows: result as T[],
          rowsAffected: result.length
        };
      } else {
        const result = await db.runAsync(sql, ...params);
        return {
          rows: [],
          insertId: isInsert ? result.lastInsertRowId : undefined,
          rowsAffected: result.changes
        };
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Query failed:', sql, params, message);
      throw new DatabaseError(`Query failed: ${message}`, sql, params);
    }
  }

  /**
   * Execute multiple SQL statements in a transaction
   */
  async transaction(queries: Array<{ sql: string; params?: any[] }>): Promise<void> {
    const db = this.getDatabase();
    
    try {
      console.log('Starting transaction with', queries.length, 'queries');
      
      await db.withTransactionAsync(async () => {
        for (const query of queries) {
          await db.runAsync(query.sql, ...(query.params || []));
        }
      });
      
      console.log('Transaction completed successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Transaction failed:', message);
      throw new DatabaseError(`Transaction failed: ${message}`);
    }
  }

  /**
   * Get the first row from a query result
   */
  async queryFirst<T = any>(sql: string, params: any[] = []): Promise<T | null> {
    const result = await this.query<T>(sql, params);
    return result.rows[0] || null;
  }

  /**
   * Check if database is initialized
   */
  isReady(): boolean {
    return this.isInitialized && this.db !== null;
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    if (this.db) {
      try {
        await this.db.closeAsync();
        console.log('Database connection closed');
      } catch (error) {
        console.error('Error closing database:', error);
      }
      
      this.db = null;
      this.isInitialized = false;
    }
  }

  /**
   * Reset database (for testing/development)
   */
  async reset(): Promise<void> {
    if (!__DEV__) {
      throw new DatabaseError('Database reset is only allowed in development mode');
    }

    try {
      const db = this.getDatabase();
      
      // Drop all tables
      const tables = await this.query<{ name: string }>(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
      );

      for (const table of tables.rows) {
        await db.runAsync(`DROP TABLE IF EXISTS ${table.name}`);
      }

      console.log('Database reset completed');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('Database reset failed:', message);
      throw new DatabaseError(`Database reset failed: ${message}`);
    }
  }
}

// Export singleton instance
export const dbConnection = new DatabaseConnection();
export default dbConnection;