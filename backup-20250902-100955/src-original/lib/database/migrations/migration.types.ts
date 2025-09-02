import { Migration } from '../types';

/**
 * Migration utility types and helpers
 */

export interface MigrationRunner {
  getCurrentVersion(): Promise<number>;
  migrate(targetVersion?: number): Promise<void>;
  rollback(targetVersion: number): Promise<void>;
  getMigrationHistory(): Promise<MigrationStatus[]>;
  reset(): Promise<void>;
}

export interface MigrationStatus {
  version: number;
  description: string;
  appliedAt: string;
  success: boolean;
}

export interface MigrationContext {
  db: any;
  version: number;
  direction: 'up' | 'down';
}

// Migration registry type
export interface MigrationRegistry {
  [version: number]: Migration;
}

// Helper for creating migration objects
export function createMigration(
  version: number,
  description: string,
  up: (db: any) => Promise<void>,
  down: (db: any) => Promise<void>
): Migration {
  return {
    version,
    description,
    up,
    down
  };
}