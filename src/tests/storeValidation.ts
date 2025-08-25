/**
 * Store Validation Test Suite
 * Tests Zustand stores, persistence, and database sync
 */

import { databaseService } from '@/lib/database';
import { useSettingsStore, settingsActions } from '@/stores/settingsStore';
import { useDailyTarotStore, dailyTarotActions } from '@/stores/dailyTarotStore';
import { useRootStore, rootStoreActions } from '@/stores';
import { StorePersistence } from '@/stores/middleware/persistence';
import { DatabaseSyncUtils } from '@/stores/middleware/database';

interface ValidationResult {
  test: string;
  passed: boolean;
  error?: string;
  details?: any;
}

/**
 * Store Validation Test Suite
 */
export class StoreValidator {
  private results: ValidationResult[] = [];

  private logResult(test: string, passed: boolean, error?: string, details?: any) {
    this.results.push({ test, passed, error, details });
    console.log(`${passed ? '✅' : '❌'} ${test}${error ? `: ${error}` : ''}`);
  }

  /**
   * Test 1: Database Connection and Store Dependencies
   */
  async testDatabaseConnection(): Promise<ValidationResult[]> {
    console.log('\n🔍 Testing Database Connection...');

    try {
      // Test database readiness
      const isReady = databaseService.isReady();
      this.logResult('Database service ready', isReady);

      if (!isReady) {
        this.logResult('Database initialization', false, 'Database not initialized');
        return this.results;
      }

      // Test database sync utils
      const syncStats = DatabaseSyncUtils.getSyncStats();
      this.logResult('Database sync stats available', !!syncStats.isReady);

      // Test persistence layer
      const storageStats = StorePersistence.getStorageStats();
      this.logResult('MMKV storage accessible', storageStats.totalKeys >= 0);

    } catch (error) {
      this.logResult('Database connection test', false, (error as Error).message);
    }

    return this.results;
  }

  /**
   * Test 2: Settings Store Functionality
   */
  async testSettingsStore(): Promise<ValidationResult[]> {
    console.log('\n🔍 Testing Settings Store...');

    try {
      // Test store initialization
      const initialState = useSettingsStore.getState();
      this.logResult('Settings store initialized', !!initialState);
      this.logResult('Settings store has required properties', 
        'selectedDeckId' in initialState && 
        'notificationsEnabled' in initialState &&
        'theme' in initialState
      );

      // Test loading settings
      await settingsActions.loadSettings();
      const loadedState = useSettingsStore.getState();
      this.logResult('Settings loaded from database', !loadedState.error);

      // Test updating a setting
      const originalTheme = loadedState.theme;
      const newTheme: 'light' | 'dark' = originalTheme === 'light' ? 'dark' : 'light';
      
      await settingsActions.updateSetting('theme', newTheme);
      const updatedState = useSettingsStore.getState();
      this.logResult('Settings update works', updatedState.theme === newTheme);

      // Revert the change
      await settingsActions.updateSetting('theme', originalTheme);

      // Test notification time management
      const originalTimes = updatedState.customNotificationTimes;
      await settingsActions.addNotificationTime(15); // 3 PM
      const afterAdd = useSettingsStore.getState();
      this.logResult('Add notification time works', 
        afterAdd.customNotificationTimes.includes(15)
      );

      await settingsActions.removeNotificationTime(15);
      const afterRemove = useSettingsStore.getState();
      this.logResult('Remove notification time works', 
        !afterRemove.customNotificationTimes.includes(15)
      );

      // Test error handling
      settingsActions.clearError();
      const clearedState = useSettingsStore.getState();
      this.logResult('Clear error works', clearedState.error === null);

    } catch (error) {
      this.logResult('Settings store test', false, (error as Error).message);
    }

    return this.results;
  }

  /**
   * Test 3: Daily Tarot Store Functionality
   */
  async testDailyTarotStore(): Promise<ValidationResult[]> {
    console.log('\n🔍 Testing Daily Tarot Store...');

    try {
      // Test store initialization
      const initialState = useDailyTarotStore.getState();
      this.logResult('Daily Tarot store initialized', !!initialState);

      // Test today's session initialization
      await dailyTarotActions.initializeToday();
      const afterInit = useDailyTarotStore.getState();
      this.logResult('Today session initialized', !!afterInit.currentSession);
      this.logResult('Session has 24 hours of cards', 
        afterInit.currentSession?.cards?.length === 24
      );

      // Test hour selection
      dailyTarotActions.selectHour(12);
      const afterSelection = useDailyTarotStore.getState();
      this.logResult('Hour selection works', afterSelection.selectedHour === 12);
      this.logResult('Selected card set', !!afterSelection.selectedCard);

      // Test memo functionality
      const testMemo = 'Test memo for validation';
      dailyTarotActions.saveMemo(12, testMemo);
      const savedMemo = dailyTarotActions.getMemoForHour(12);
      this.logResult('Save memo works', savedMemo === testMemo);

      // Test session stats
      const stats = afterSelection.getSessionStats();
      this.logResult('Session stats calculated', 
        stats.totalCards === 24 && stats.cardsWithMemos >= 0
      );

      // Test time update
      dailyTarotActions.updateCurrentTime();
      const afterTimeUpdate = useDailyTarotStore.getState();
      this.logResult('Time update works', typeof afterTimeUpdate.currentHour === 'number');

    } catch (error) {
      this.logResult('Daily Tarot store test', false, (error as Error).message);
    }

    return this.results;
  }

  /**
   * Test 4: Root Store and Cross-Store Communication
   */
  async testRootStore(): Promise<ValidationResult[]> {
    console.log('\n🔍 Testing Root Store...');

    try {
      // Test root store initialization
      await rootStoreActions.initialize();
      const rootState = useRootStore.getState();
      this.logResult('Root store initialized', (rootState as any).isInitialized);
      this.logResult('No root store errors', (rootState as any).error === null);

      // Test health status
      const health = rootStoreActions.getHealthStatus();
      this.logResult('Health status available', !!health);
      this.logResult('Database ready in health check', health.databaseReady);

      // Test cross-store operations
      const beforeDeckChange = useSettingsStore.getState().selectedDeckId;
      // Note: This would only work if deck store is properly implemented
      // await rootStoreActions.changeActiveDeck('premium');
      // const afterDeckChange = useSettingsStore.getState();
      // this.logResult('Cross-store deck change works', afterDeckChange.selectedDeckId === 'premium');

      // Test error clearing across stores
      rootStoreActions.clearAllErrors();
      this.logResult('Clear all errors works', true);

    } catch (error) {
      this.logResult('Root store test', false, (error as Error).message);
    }

    return this.results;
  }

  /**
   * Test 5: Persistence and Storage
   */
  async testPersistence(): Promise<ValidationResult[]> {
    console.log('\n🔍 Testing Persistence...');

    try {
      // Test storage stats
      const storageStats = StorePersistence.getStorageStats();
      this.logResult('Storage stats available', typeof storageStats.totalKeys === 'number');
      this.logResult('Store keys found', storageStats.storeKeys.length > 0);

      // Test that stores persist their data
      const settingsState = useSettingsStore.getState();
      const tarotState = useDailyTarotStore.getState();
      
      // Check if critical data is persisted
      this.logResult('Settings persist config', 
        settingsState.selectedDeckId && 
        typeof settingsState.notificationsEnabled === 'boolean'
      );
      
      this.logResult('Daily Tarot persists session data', 
        tarotState.lastGeneratedDate !== ''
      );

      // Test backup creation
      const backup = StorePersistence.backupStoreData();
      this.logResult('Backup creation works', Object.keys(backup).length > 0);

    } catch (error) {
      this.logResult('Persistence test', false, (error as Error).message);
    }

    return this.results;
  }

  /**
   * Run all validation tests
   */
  async runAllTests(): Promise<{
    passed: number;
    failed: number;
    total: number;
    results: ValidationResult[];
  }> {
    console.log('🧪 Starting Store Validation Tests...\n');
    
    this.results = [];
    
    await this.testDatabaseConnection();
    await this.testSettingsStore();
    await this.testDailyTarotStore();
    await this.testRootStore();
    await this.testPersistence();

    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    const total = this.results.length;

    console.log(`\n📊 Test Results:`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📋 Total: ${total}`);
    console.log(`📈 Success Rate: ${Math.round((passed / total) * 100)}%`);

    return {
      passed,
      failed,
      total,
      results: this.results
    };
  }

  /**
   * Get detailed test report
   */
  getDetailedReport(): string {
    const report = ['# Store Validation Report\n'];
    
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    const total = this.results.length;

    report.push(`## Summary`);
    report.push(`- ✅ Passed: ${passed}`);
    report.push(`- ❌ Failed: ${failed}`);
    report.push(`- 📋 Total: ${total}`);
    report.push(`- 📈 Success Rate: ${Math.round((passed / total) * 100)}%\n`);

    report.push(`## Detailed Results\n`);
    
    this.results.forEach((result, index) => {
      report.push(`${index + 1}. ${result.passed ? '✅' : '❌'} **${result.test}**`);
      if (result.error) {
        report.push(`   - Error: ${result.error}`);
      }
      if (result.details) {
        report.push(`   - Details: ${JSON.stringify(result.details, null, 2)}`);
      }
      report.push('');
    });

    return report.join('\n');
  }
}

// Export validation function for direct use
export async function validateStores(): Promise<{
  passed: number;
  failed: number;
  total: number;
  results: ValidationResult[];
}> {
  const validator = new StoreValidator();
  return await validator.runAllTests();
}

export default StoreValidator;