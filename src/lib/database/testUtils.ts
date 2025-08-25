/**
 * Database testing utilities and sample data
 * For development and testing purposes only
 */

import { databaseService } from './index';
import { 
  CreateDailySession, 
  CreateDailyCard, 
  CreateSpread, 
  CreateSpreadCard,
  DatabaseError 
} from './types';

/**
 * Sample data for testing database operations
 */
export class DatabaseTestUtils {

  /**
   * Check if we're in development mode
   */
  private ensureDevMode(): void {
    if (!__DEV__) {
      throw new DatabaseError('Test utilities are only available in development mode');
    }
  }

  /**
   * Sample tarot cards for testing
   */
  private readonly sampleCards = [
    'fool', 'magician', 'high_priestess', 'empress', 'emperor', 'hierophant',
    'lovers', 'chariot', 'strength', 'hermit', 'wheel_fortune', 'justice',
    'hanged_man', 'death', 'temperance', 'devil', 'tower', 'star',
    'moon', 'sun', 'judgement', 'world', 'ace_wands', 'two_wands'
  ];

  /**
   * Generate a random card key
   */
  private getRandomCard(): string {
    const index = Math.floor(Math.random() * this.sampleCards.length);
    return this.sampleCards[index];
  }

  /**
   * Generate a random seed
   */
  private generateSeed(): string {
    return Math.random().toString(36).substring(2, 15);
  }

  /**
   * Create sample daily session
   */
  async createSampleDailySession(date?: string): Promise<void> {
    this.ensureDevMode();

    const sessionDate = date || new Date().toISOString().split('T')[0];
    
    try {
      // Create session
      const session = await databaseService.dailyTarot.createSession({
        date: sessionDate,
        seed: this.generateSeed(),
        deckId: 'classic'
      });

      console.log(`✅ Created sample daily session for ${sessionDate}`);

      // Generate 24 cards
      const cards = Array.from({ length: 24 }, () => this.getRandomCard());
      await databaseService.dailyTarot.generateSessionCards(session.id, cards);

      // Add some sample memos to random cards
      const cardsWithMemos = await databaseService.dailyTarot.getCardsBySession(session.id);
      const sampleMemos = [
        'Feeling optimistic about new opportunities',
        'Need to trust my intuition more',
        'Time for important decision making',
        'Focus on personal growth today',
        'Unexpected news coming my way'
      ];

      for (let i = 0; i < 5; i++) {
        const randomCard = cardsWithMemos[Math.floor(Math.random() * cardsWithMemos.length)];
        const randomMemo = sampleMemos[Math.floor(Math.random() * sampleMemos.length)];
        
        await databaseService.dailyTarot.updateCard({
          id: randomCard.id,
          memo: randomMemo
        });
      }

      console.log(`✅ Added sample cards and memos for session ${session.id}`);
    } catch (error) {
      console.error('❌ Failed to create sample daily session:', error);
      throw error;
    }
  }

  /**
   * Create sample spread
   */
  async createSampleSpread(spreadType = 'celtic_cross'): Promise<void> {
    this.ensureDevMode();

    try {
      // Create spread
      const spread = await databaseService.spreads.createSpread({
        spreadType,
        deckId: 'classic',
        title: `Sample ${spreadType.replace('_', ' ')} Reading`
      });

      console.log(`✅ Created sample spread: ${spread.title}`);

      // Add sample cards based on spread type
      const cardCount = this.getSpreadCardCount(spreadType);
      const spreadCards: CreateSpreadCard[] = [];

      for (let i = 0; i < cardCount; i++) {
        const position = this.getCardPosition(i, cardCount);
        spreadCards.push({
          spreadId: spread.id,
          positionIndex: i,
          cardKey: this.getRandomCard(),
          reversed: Math.random() < 0.3, // 30% chance of reversed
          ...position
        });
      }

      // Add cards to spread
      for (const cardData of spreadCards) {
        await databaseService.spreads.addCardToSpread(cardData);
      }

      console.log(`✅ Added ${cardCount} cards to spread ${spread.id}`);
    } catch (error) {
      console.error('❌ Failed to create sample spread:', error);
      throw error;
    }
  }

  /**
   * Get card count for spread type
   */
  private getSpreadCardCount(spreadType: string): number {
    const counts: Record<string, number> = {
      'celtic_cross': 10,
      'relationship': 7,
      'five_card': 5,
      'timeline': 4,
      'three_card': 3,
      'one_card': 1
    };

    return counts[spreadType] || 3;
  }

  /**
   * Get sample card position for layout
   */
  private getCardPosition(index: number, total: number): {
    x: number;
    y: number;
    width: number;
    height: number;
  } {
    // Simple grid layout for testing
    const cols = Math.ceil(Math.sqrt(total));
    const rows = Math.ceil(total / cols);
    
    const col = index % cols;
    const row = Math.floor(index / cols);

    return {
      x: (col / cols) + 0.1,
      y: (row / rows) + 0.1,
      width: 0.15,
      height: 0.25
    };
  }

  /**
   * Create sample settings
   */
  async createSampleSettings(): Promise<void> {
    this.ensureDevMode();

    try {
      const sampleSettings = {
        'user_name': 'Test User',
        'favorite_spread': 'celtic_cross',
        'notifications_sound': 'chime',
        'last_backup': new Date().toISOString(),
        'tutorial_completed': 'true',
        'total_readings': '42'
      };

      await databaseService.settings.setSettings(sampleSettings);
      console.log('✅ Created sample settings');
    } catch (error) {
      console.error('❌ Failed to create sample settings:', error);
      throw error;
    }
  }

  /**
   * Create sample purchases
   */
  async createSamplePurchases(): Promise<void> {
    this.ensureDevMode();

    try {
      const samplePurchases = [
        {
          productId: 'premium_deck_1',
          platform: 'ios' as const,
          isActive: true
        },
        {
          productId: 'remove_ads',
          platform: 'ios' as const,
          isActive: true
        },
        {
          productId: 'premium_deck_2',
          platform: 'android' as const,
          isActive: false
        }
      ];

      for (const purchase of samplePurchases) {
        await databaseService.purchases.createPurchase(purchase);
      }

      console.log('✅ Created sample purchases');
    } catch (error) {
      console.error('❌ Failed to create sample purchases:', error);
      throw error;
    }
  }

  /**
   * Populate database with comprehensive sample data
   */
  async populateSampleData(): Promise<void> {
    this.ensureDevMode();
    
    console.log('🔄 Populating database with sample data...');

    try {
      // Create sample settings first
      await this.createSampleSettings();

      // Create sample daily sessions for the last 5 days
      const today = new Date();
      for (let i = 0; i < 5; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        await this.createSampleDailySession(date.toISOString().split('T')[0]);
      }

      // Create sample spreads
      const spreadTypes = ['celtic_cross', 'three_card', 'five_card', 'relationship'];
      for (const spreadType of spreadTypes) {
        await this.createSampleSpread(spreadType);
      }

      // Create sample purchases
      await this.createSamplePurchases();

      console.log('✅ Sample data population completed successfully');
    } catch (error) {
      console.error('❌ Sample data population failed:', error);
      throw error;
    }
  }

  /**
   * Clear all sample data
   */
  async clearSampleData(): Promise<void> {
    this.ensureDevMode();

    console.log('🔄 Clearing sample data...');

    try {
      // Clear tables in dependency order
      await databaseService.getConnection().query('DELETE FROM spread_cards');
      await databaseService.getConnection().query('DELETE FROM spreads');
      await databaseService.getConnection().query('DELETE FROM daily_cards');
      await databaseService.getConnection().query('DELETE FROM daily_sessions');
      await databaseService.getConnection().query('DELETE FROM purchases');
      
      // Keep essential settings, remove sample ones
      const sampleKeys = ['user_name', 'favorite_spread', 'notifications_sound', 'last_backup', 'tutorial_completed', 'total_readings'];
      await databaseService.settings.deleteSettings(sampleKeys);

      console.log('✅ Sample data cleared successfully');
    } catch (error) {
      console.error('❌ Failed to clear sample data:', error);
      throw error;
    }
  }

  /**
   * Run database tests
   */
  async runTests(): Promise<boolean> {
    this.ensureDevMode();

    console.log('🧪 Running database tests...');
    let passed = 0;
    let failed = 0;

    // Test 1: Database connection
    try {
      const health = await databaseService.getHealthStatus();
      if (health.isInitialized && health.connectionReady) {
        console.log('✅ Test 1: Database connection - PASSED');
        passed++;
      } else {
        console.log('❌ Test 1: Database connection - FAILED');
        failed++;
      }
    } catch (error) {
      console.log('❌ Test 1: Database connection - FAILED:', error);
      failed++;
    }

    // Test 2: Daily tarot operations
    try {
      const session = await databaseService.dailyTarot.createSession({
        date: '2024-01-01',
        seed: 'test-seed',
        deckId: 'test-deck'
      });
      
      await databaseService.dailyTarot.createCard({
        sessionId: session.id,
        hour: 0,
        cardKey: 'test-card'
      });

      await databaseService.dailyTarot.deleteSession(session.id);
      console.log('✅ Test 2: Daily tarot operations - PASSED');
      passed++;
    } catch (error) {
      console.log('❌ Test 2: Daily tarot operations - FAILED:', error);
      failed++;
    }

    // Test 3: Settings operations
    try {
      await databaseService.settings.setSetting('test_key', 'test_value');
      const value = await databaseService.settings.getSettingValue('test_key');
      
      if (value === 'test_value') {
        await databaseService.settings.deleteSetting('test_key');
        console.log('✅ Test 3: Settings operations - PASSED');
        passed++;
      } else {
        console.log('❌ Test 3: Settings operations - FAILED (value mismatch)');
        failed++;
      }
    } catch (error) {
      console.log('❌ Test 3: Settings operations - FAILED:', error);
      failed++;
    }

    const total = passed + failed;
    console.log(`🧪 Tests completed: ${passed}/${total} passed, ${failed}/${total} failed`);
    
    return failed === 0;
  }
}

// Export singleton instance
export const dbTestUtils = new DatabaseTestUtils();
export default dbTestUtils;