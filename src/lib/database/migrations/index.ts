import { DatabaseError, MigrationError } from '../types';
import { MigrationRunner, MigrationStatus, MigrationRegistry } from './migration.types';
import { dbConnection } from '../connection';
import { migration001 } from './001_initial';

/**
 * Database Migration Runner
 * Handles schema versioning and migration execution
 */
class DatabaseMigrationRunner implements MigrationRunner {
  private migrations: MigrationRegistry = {
    1: migration001,
    // Add new migrations here as they're created
  };

  /**
   * Get the current database schema version
   */
  async getCurrentVersion(): Promise<number> {
    try {
      const result = await dbConnection.queryFirst<{ version: number }>(
        'SELECT MAX(version) as version FROM schema_migrations WHERE success = TRUE'
      );
      return result?.version || 0;
    } catch (error) {
      // Table might not exist yet, return 0
      return 0;
    }
  }

  /**
   * Get the latest available migration version
   */
  getLatestVersion(): number {
    const versions = Object.keys(this.migrations).map(Number);
    return Math.max(...versions, 0);
  }

  /**
   * Run migrations to bring database to target version
   */
  async migrate(targetVersion?: number): Promise<void> {
    const currentVersion = await this.getCurrentVersion();
    const latestVersion = this.getLatestVersion();
    const target = targetVersion || latestVersion;

    console.log(`Starting migration: current=${currentVersion}, target=${target}, latest=${latestVersion}`);

    if (target < currentVersion) {
      throw new MigrationError('Cannot migrate to a lower version. Use rollback instead.');
    }

    if (currentVersion === target) {
      console.log('Database is already at target version');
      return;
    }

    // Run migrations from current+1 to target
    for (let version = currentVersion + 1; version <= target; version++) {
      await this.runMigration(version, 'up');
    }

    console.log(`Migration completed: ${currentVersion} → ${target}`);
  }

  /**
   * Rollback to a specific version
   */
  async rollback(targetVersion: number): Promise<void> {
    if (!__DEV__) {
      throw new MigrationError('Rollback is only allowed in development mode');
    }

    const currentVersion = await this.getCurrentVersion();
    
    if (targetVersion >= currentVersion) {
      throw new MigrationError('Target version must be lower than current version');
    }

    console.log(`Starting rollback: ${currentVersion} → ${targetVersion}`);

    // Run rollbacks from current down to target+1
    for (let version = currentVersion; version > targetVersion; version--) {
      await this.runMigration(version, 'down');
    }

    console.log(`Rollback completed: ${currentVersion} → ${targetVersion}`);
  }

  /**
   * Execute a single migration
   */
  private async runMigration(version: number, direction: 'up' | 'down'): Promise<void> {
    const migration = this.migrations[version];
    
    if (!migration) {
      throw new MigrationError(`Migration ${version} not found`);
    }

    const db = dbConnection.getDatabase();
    
    try {
      console.log(`Running migration ${version} (${direction}): ${migration.description}`);

      await dbConnection.transaction([
        {
          sql: direction === 'up' 
            ? 'INSERT INTO schema_migrations (version, description, success) VALUES (?, ?, TRUE)'
            : 'DELETE FROM schema_migrations WHERE version = ?',
          params: direction === 'up' 
            ? [version, migration.description]
            : [version]
        }
      ]);

      // Run the migration
      if (direction === 'up') {
        await migration.up(db);
      } else {
        await migration.down(db);
      }

      console.log(`Migration ${version} (${direction}) completed successfully`);
    } catch (error) {
      // Mark migration as failed if going up
      if (direction === 'up') {
        try {
          await dbConnection.query(
            'UPDATE schema_migrations SET success = FALSE WHERE version = ?',
            [version]
          );
        } catch (updateError) {
          console.error('Failed to mark migration as failed:', updateError);
        }
      }

      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error(`Migration ${version} (${direction}) failed:`, message);
      throw new MigrationError(`Migration ${version} failed: ${message}`, version);
    }
  }

  /**
   * Get migration history
   */
  async getMigrationHistory(): Promise<MigrationStatus[]> {
    try {
      const result = await dbConnection.query<{
        version: number;
        description: string;
        applied_at: string;
        success: boolean;
      }>(
        'SELECT version, description, applied_at, success FROM schema_migrations ORDER BY version'
      );

      return result.rows.map(row => ({
        version: row.version,
        description: row.description,
        appliedAt: row.applied_at,
        success: Boolean(row.success)
      }));
    } catch (error) {
      console.error('Failed to get migration history:', error);
      return [];
    }
  }

  /**
   * Check if database needs migration
   */
  async needsMigration(): Promise<boolean> {
    const currentVersion = await this.getCurrentVersion();
    const latestVersion = this.getLatestVersion();
    return currentVersion < latestVersion;
  }

  /**
   * Reset all migrations (development only)
   */
  async reset(): Promise<void> {
    if (!__DEV__) {
      throw new MigrationError('Migration reset is only allowed in development mode');
    }

    console.log('Resetting all migrations...');
    
    try {
      await dbConnection.reset();
      console.log('Migration reset completed');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new MigrationError(`Migration reset failed: ${message}`);
    }
  }

  /**
   * Initialize migration system
   */
  async initialize(): Promise<void> {
    console.log('Initializing migration system...');
    
    // Ensure database connection is ready
    await dbConnection.initialize();
    
    // Run any pending migrations
    if (await this.needsMigration()) {
      await this.migrate();
    } else {
      console.log('Database is up to date');
    }
    
    console.log('Migration system initialized');
  }
}

// Export singleton instance
export const migrationRunner = new DatabaseMigrationRunner();
export default migrationRunner;