/**
 * Widget System Test Utilities
 * Simple validation functions for widget functionality
 */

import { widgetService } from '@/services/widgetService';
import { widgetDataManager } from '@/lib/widgetData';

export interface WidgetTestResults {
  widgetSupported: boolean;
  dataWriteSuccess: boolean;
  dataReadSuccess: boolean;
  serviceInitSuccess: boolean;
  currentCardData: any;
  errors: string[];
}

/**
 * Run basic widget system tests
 */
export async function runWidgetTests(): Promise<WidgetTestResults> {
  const results: WidgetTestResults = {
    widgetSupported: false,
    dataWriteSuccess: false,
    dataReadSuccess: false,
    serviceInitSuccess: false,
    currentCardData: null,
    errors: []
  };

  try {
    console.log('🧪 Running widget system tests...');

    // Test 1: Check widget support
    results.widgetSupported = widgetService.isWidgetSupported();
    console.log(`📱 Widget support: ${results.widgetSupported ? 'YES' : 'NO'}`);

    // Test 2: Test data operations
    if (results.widgetSupported) {
      try {
        // Test data write
        const testData = {
          cardName: 'Test Card',
          cardImage: 'test.jpg',
          cardDescription: 'Test description',
          hour: 12,
          time: '12:00 PM',
          date: 'Test Date',
          deckName: 'Test Deck',
          isUpright: true,
          meanings: ['Test meaning']
        };

        await widgetDataManager.writeWidgetData(testData);
        results.dataWriteSuccess = true;
        console.log('✅ Widget data write: SUCCESS');

        // Test data read
        const readData = await widgetDataManager.readWidgetData();
        if (readData && readData.cardName === testData.cardName) {
          results.dataReadSuccess = true;
          console.log('✅ Widget data read: SUCCESS');
        } else {
          results.errors.push('Data read returned incorrect data');
          console.log('❌ Widget data read: FAILED');
        }
      } catch (error) {
        results.errors.push(`Data operations failed: ${error}`);
        console.log('❌ Widget data operations: FAILED');
      }

      // Test 3: Service initialization
      try {
        await widgetService.initialize();
        results.serviceInitSuccess = true;
        console.log('✅ Widget service init: SUCCESS');
      } catch (error) {
        results.errors.push(`Service init failed: ${error}`);
        console.log('❌ Widget service init: FAILED');
      }

      // Test 4: Get current card data
      try {
        results.currentCardData = widgetService.getCurrentCardData();
        console.log(`📊 Current card data: ${results.currentCardData ? 'AVAILABLE' : 'NULL'}`);
      } catch (error) {
        results.errors.push(`Get current card failed: ${error}`);
        console.log('❌ Get current card: FAILED');
      }
    }

    // Summary
    const passedTests = [
      results.widgetSupported,
      results.dataWriteSuccess,
      results.dataReadSuccess,
      results.serviceInitSuccess
    ].filter(Boolean).length;

    console.log(`🏆 Widget tests completed: ${passedTests}/4 passed`);
    
    if (results.errors.length > 0) {
      console.log('⚠️ Test errors:', results.errors);
    }

    return results;
  } catch (error) {
    results.errors.push(`Test runner failed: ${error}`);
    console.error('❌ Widget test runner failed:', error);
    return results;
  }
}

/**
 * Test widget data flow end-to-end
 */
export async function testWidgetDataFlow(): Promise<boolean> {
  try {
    console.log('🔄 Testing widget data flow...');

    // Step 1: Clear existing data
    await widgetDataManager.clearWidgetData();

    // Step 2: Update widget data via service
    await widgetService.updateWidgetData();

    // Step 3: Verify data was written
    const data = await widgetDataManager.readWidgetData();
    
    if (data) {
      console.log('✅ Widget data flow test: SUCCESS');
      console.log(`📄 Widget data: ${data.cardName} at ${data.time}`);
      return true;
    } else {
      console.log('❌ Widget data flow test: NO DATA');
      return false;
    }
  } catch (error) {
    console.error('❌ Widget data flow test: FAILED', error);
    return false;
  }
}

/**
 * Log widget system status for debugging
 */
export function logWidgetStatus(): void {
  console.log('\n📋 Widget System Status:');
  console.log(`  📱 Platform Supported: ${widgetService.isWidgetSupported()}`);
  console.log(`  🔧 Service Available: ${typeof widgetService.initialize === 'function'}`);
  console.log(`  💾 Data Manager Available: ${typeof widgetDataManager.writeWidgetData === 'function'}`);
  
  // Test current card availability
  try {
    const currentCard = widgetService.getCurrentCardData();
    console.log(`  🃏 Current Card Available: ${currentCard ? 'YES' : 'NO'}`);
    if (currentCard) {
      console.log(`  📜 Card: ${currentCard.cardName} (Hour ${currentCard.hour})`);
    }
  } catch (error) {
    console.log(`  🃏 Current Card Available: ERROR (${error})`);
  }
  console.log('');
}

export default {
  runWidgetTests,
  testWidgetDataFlow,
  logWidgetStatus
};