import React, { createContext, useContext, useEffect, useState } from 'react';
import { databaseService } from './index';
import { LoadingScreen } from '@/components';
import { handleError, createDatabaseError, ErrorType, ErrorSeverity } from '@/lib/errorHandling';

/**
 * Database Provider Context
 */
interface DatabaseContextType {
  isReady: boolean;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

/**
 * Database Provider Component
 * Handles database initialization and provides status to the app
 */
interface DatabaseProviderProps {
  children: React.ReactNode;
  enableSampleData?: boolean; // For development
}

export function DatabaseProvider({ children, enableSampleData = false }: DatabaseProviderProps) {
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const initializeDatabase = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔄 Starting database initialization...');
      
      // Initialize database service
      await databaseService.initialize();
      
      // Add sample data in development mode if enabled
      if (__DEV__ && enableSampleData) {
        console.log('🔄 Adding sample data for development...');
        const { dbTestUtils } = await import('./testUtils');
        await dbTestUtils.populateSampleData();
      }

      setIsReady(true);
      setIsLoading(false);
      
      console.log('✅ Database initialization completed successfully');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown database error';
      console.error('❌ Database initialization failed:', errorMessage);

      const dbInitError = createDatabaseError(
        '데이터베이스 초기화 중 오류가 발생했습니다.',
        err as Error,
        { action: 'initializeDatabase', enableSampleData }
      );
      handleError(dbInitError);

      setError(errorMessage);
      setIsReady(false);
      setIsLoading(false);
    }
  };

  const retry = () => {
    console.log('🔄 Retrying database initialization...');
    initializeDatabase();
  };

  useEffect(() => {
    initializeDatabase();
  }, []);

  // Show loading screen while initializing
  if (isLoading || error) {
    return (
      <LoadingScreen
        message={isLoading ? 'Initializing database...' : undefined}
        error={error || undefined}
        onRetry={error ? retry : undefined}
      />
    );
  }

  // Database is ready, render the app
  const contextValue: DatabaseContextType = {
    isReady,
    isLoading,
    error,
    retry
  };

  return (
    <DatabaseContext.Provider value={contextValue}>
      {children}
    </DatabaseContext.Provider>
  );
}

/**
 * Hook to access database context
 */
export function useDatabase(): DatabaseContextType {
  const context = useContext(DatabaseContext);
  
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  
  return context;
}

/**
 * Hook to check if database is ready
 */
export function useDatabaseReady(): boolean {
  const { isReady } = useDatabase();
  return isReady;
}

export default DatabaseProvider;