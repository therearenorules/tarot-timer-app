/**
 * Widget Service
 * Bridges app data to widgets for iOS and Android
 */

import { useDailyTarotStore } from '../stores/dailyTarotStore';
import { useDeckStore } from '../stores/deckStore';
import { widgetDataManager, WidgetCardData } from '../lib/widgetData';
import { Platform } from 'react-native';

export interface WidgetService {
  updateWidgetData: () => Promise<void>;
  getCurrentCardData: () => WidgetCardData | null;
  scheduleHourlyUpdates: () => Promise<void>;
  clearWidgetData: () => Promise<void>;
  isWidgetSupported: () => boolean;
  initialize: () => Promise<void>;
}

class WidgetServiceImpl implements WidgetService {
  private updateInterval: NodeJS.Timeout | null = null;

  /**
   * Update widget data with current hour's card
   */
  async updateWidgetData(): Promise<void> {
    try {
      console.log('🔄 Updating widget data...');
      
      const cardData = this.getCurrentCardData();
      if (!cardData) {
        console.warn('⚠️ No current card data available for widget');
        return;
      }

      await widgetDataManager.writeWidgetData(cardData);
      
      // Trigger native widget refresh
      await this.refreshNativeWidgets();
      
      console.log('✅ Widget data updated successfully');
    } catch (error) {
      console.error('❌ Failed to update widget data:', error);
      throw error;
    }
  }

  /**
   * Get current hour's card data for widget display
   */
  getCurrentCardData(): WidgetCardData | null {
    try {
      const dailyCardState = useDailyTarotStore.getState();
      const deckState = useDeckStore.getState();
      
      const currentHour = new Date().getHours();
      const currentCard = dailyCardState.currentCards.find((card: any) => card.hour === currentHour);
      
      if (!currentCard) {
        console.warn('⚠️ No card found for current hour:', currentHour);
        return null;
      }

      const now = new Date();
      const cardData: WidgetCardData = {
        cardName: currentCard.card.name,
        cardImage: currentCard.card.image || 'placeholder.jpg',
        cardDescription: currentCard.card.description || '',
        hour: currentHour,
        time: now.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: true 
        }),
        date: now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short', 
          day: 'numeric'
        }),
        deckName: deckState.selectedDeck?.info?.name || 'Classic Tarot',
        isUpright: currentCard.isUpright,
        meanings: currentCard.isUpright ? currentCard.card.upright : currentCard.card.reversed
      };

      return cardData;
    } catch (error) {
      console.error('❌ Failed to get current card data:', error);
      return null;
    }
  }

  /**
   * Schedule hourly widget updates
   */
  async scheduleHourlyUpdates(): Promise<void> {
    try {
      console.log('📅 Scheduling hourly widget updates...');
      
      // Clear any existing interval
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
      }

      // Update immediately
      await this.updateWidgetData();

      // Schedule updates at the start of each hour
      const now = new Date();
      const nextHour = new Date();
      nextHour.setHours(now.getHours() + 1, 0, 0, 0);
      
      const msUntilNextHour = nextHour.getTime() - now.getTime();
      
      // Schedule first update at next hour
      setTimeout(async () => {
        await this.updateWidgetData();
        
        // Then update every hour
        this.updateInterval = setInterval(async () => {
          await this.updateWidgetData();
        }, 60 * 60 * 1000); // 1 hour
        
      }, msUntilNextHour);

      console.log(`✅ Widget updates scheduled (next update in ${Math.round(msUntilNextHour / 1000 / 60)} minutes)`);
    } catch (error) {
      console.error('❌ Failed to schedule widget updates:', error);
      throw error;
    }
  }

  /**
   * Clear widget data and stop updates
   */
  async clearWidgetData(): Promise<void> {
    try {
      // Stop scheduled updates
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
        this.updateInterval = null;
      }

      // Clear widget data
      await widgetDataManager.clearWidgetData();
      
      // Refresh widgets to show empty state
      await this.refreshNativeWidgets();
      
      console.log('✅ Widget data cleared');
    } catch (error) {
      console.error('❌ Failed to clear widget data:', error);
      throw error;
    }
  }

  /**
   * Check if widgets are supported on current platform
   */
  isWidgetSupported(): boolean {
    // Widgets are supported on iOS 14+ and Android 8+
    return Platform.OS === 'ios' || Platform.OS === 'android';
  }

  /**
   * Refresh native widgets after data update
   */
  private async refreshNativeWidgets(): Promise<void> {
    try {
      if (Platform.OS === 'ios') {
        await this.refreshiOSWidgets();
      } else if (Platform.OS === 'android') {
        await this.refreshAndroidWidgets();
      }
    } catch (error) {
      console.warn('⚠️ Failed to refresh native widgets:', error);
    }
  }

  /**
   * Refresh iOS widgets using WidgetKit
   */
  private async refreshiOSWidgets(): Promise<void> {
    try {
      console.log('📱 [iOS] Refreshing widgets...');
      
      // TODO: Implement native iOS widget refresh
      // In production, this would use a native module:
      // await NativeModules.WidgetKit.reloadAllTimelines();
      
    } catch (error) {
      console.warn('⚠️ iOS widget refresh failed:', error);
    }
  }

  /**
   * Refresh Android widgets using AppWidgetManager
   */
  private async refreshAndroidWidgets(): Promise<void> {
    try {
      console.log('🤖 [Android] Refreshing widgets...');
      
      // TODO: Implement native Android widget refresh  
      // In production, this would use a native module:
      // await NativeModules.AndroidWidgets.updateAllWidgets();
      
    } catch (error) {
      console.warn('⚠️ Android widget refresh failed:', error);
    }
  }

  /**
   * Initialize widget service
   */
  async initialize(): Promise<void> {
    try {
      console.log('🔧 Initializing Widget Service...');
      
      if (!this.isWidgetSupported()) {
        console.warn('⚠️ Widgets not supported on this platform');
        return;
      }

      // Update widget data on initialization
      await this.updateWidgetData();
      
      console.log('✅ Widget Service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Widget Service:', error);
      throw error;
    }
  }

  /**
   * Handle app state changes for widget updates
   */
  async onAppStateChange(nextAppState: string): Promise<void> {
    if (nextAppState === 'active') {
      // App became active, update widget data
      await this.updateWidgetData();
    }
  }
}

// Export singleton instance
export const widgetService: WidgetService = new WidgetServiceImpl();

// Export class for testing
export { WidgetServiceImpl };

export default widgetService;