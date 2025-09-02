/**
 * Widget Data Management
 * Handles data sharing between main app and widgets using platform-specific storage
 */

import { MMKV } from 'react-native-mmkv';
import { Platform } from 'react-native';

export interface WidgetCardData {
  cardName: string;
  cardImage: string;
  cardDescription: string;
  hour: number;
  time: string;
  date: string;
  deckName: string;
  isUpright: boolean;
  meanings: string[];
}

export interface WidgetDataManager {
  writeWidgetData: (data: WidgetCardData) => Promise<void>;
  readWidgetData: () => Promise<WidgetCardData | null>;
  clearWidgetData: () => Promise<void>;
  getAppGroupPath?: () => string; // iOS only
}

class WidgetDataManagerImpl implements WidgetDataManager {
  private readonly WIDGET_DATA_KEY = '@tarot_timer_widget_data';
  private readonly APP_GROUP_ID = 'group.com.therearenorules.tarottimer';

  /**
   * Write widget data to shared storage
   */
  async writeWidgetData(data: WidgetCardData): Promise<void> {
    try {
      const jsonData = JSON.stringify({
        ...data,
        timestamp: Date.now(),
        version: '1.0.0'
      });

      if (Platform.OS === 'ios') {
        // iOS: Use App Groups for shared container
        await this.writeToAppGroup(jsonData);
      } else if (Platform.OS === 'android') {
        // Android: Use shared preferences via AsyncStorage bridge
        await this.writeToSharedPreferences(jsonData);
      }

      // Always store in MMKV as backup
      const storage = new MMKV();
      storage.set(this.WIDGET_DATA_KEY, jsonData);
      
      console.log('✅ Widget data written successfully');
    } catch (error) {
      console.error('❌ Failed to write widget data:', error);
      throw error;
    }
  }

  /**
   * Read widget data from shared storage
   */
  async readWidgetData(): Promise<WidgetCardData | null> {
    try {
      let jsonData: string | null = null;

      if (Platform.OS === 'ios') {
        jsonData = await this.readFromAppGroup();
      } else if (Platform.OS === 'android') {
        jsonData = await this.readFromSharedPreferences();
      }

      // Fallback to MMKV
      if (!jsonData) {
        const storage = new MMKV();
        jsonData = storage.getString(this.WIDGET_DATA_KEY) || null;
      }

      if (!jsonData) {
        return null;
      }

      const parsed = JSON.parse(jsonData);
      return {
        cardName: parsed.cardName,
        cardImage: parsed.cardImage,
        cardDescription: parsed.cardDescription,
        hour: parsed.hour,
        time: parsed.time,
        date: parsed.date,
        deckName: parsed.deckName,
        isUpright: parsed.isUpright,
        meanings: parsed.meanings || []
      };
    } catch (error) {
      console.error('❌ Failed to read widget data:', error);
      return null;
    }
  }

  /**
   * Clear widget data from all storage locations
   */
  async clearWidgetData(): Promise<void> {
    try {
      if (Platform.OS === 'ios') {
        await this.clearAppGroup();
      } else if (Platform.OS === 'android') {
        await this.clearSharedPreferences();
      }

      const storage = new MMKV();
      storage.delete(this.WIDGET_DATA_KEY);
      console.log('✅ Widget data cleared');
    } catch (error) {
      console.error('❌ Failed to clear widget data:', error);
      throw error;
    }
  }

  /**
   * Get App Group container path (iOS)
   */
  getAppGroupPath(): string {
    if (Platform.OS !== 'ios') {
      throw new Error('App Groups are iOS only');
    }
    // This would typically use native modules to get the actual path
    return `/private/var/mobile/Containers/Shared/AppGroup/${this.APP_GROUP_ID}`;
  }

  // Private iOS methods
  private async writeToAppGroup(data: string): Promise<void> {
    try {
      // In production, this would use a native module to write to App Group container
      // For now, we'll use a mock implementation
      console.log('📱 [iOS] Writing to App Group:', this.APP_GROUP_ID);
      
      // TODO: Implement native iOS App Group writing
      // Example: await NativeModules.WidgetData.writeToAppGroup(this.APP_GROUP_ID, data);
      
    } catch (error) {
      console.warn('⚠️ App Group write failed, using AsyncStorage fallback');
    }
  }

  private async readFromAppGroup(): Promise<string | null> {
    try {
      // In production, this would use a native module to read from App Group container
      console.log('📱 [iOS] Reading from App Group:', this.APP_GROUP_ID);
      
      // TODO: Implement native iOS App Group reading
      // Example: return await NativeModules.WidgetData.readFromAppGroup(this.APP_GROUP_ID);
      
      return null;
    } catch (error) {
      console.warn('⚠️ App Group read failed, using AsyncStorage fallback');
      return null;
    }
  }

  private async clearAppGroup(): Promise<void> {
    try {
      console.log('📱 [iOS] Clearing App Group data');
      
      // TODO: Implement native iOS App Group clearing
      // Example: await NativeModules.WidgetData.clearAppGroup(this.APP_GROUP_ID);
      
    } catch (error) {
      console.warn('⚠️ App Group clear failed');
    }
  }

  // Private Android methods
  private async writeToSharedPreferences(data: string): Promise<void> {
    try {
      // In production, this would use a native module to write to SharedPreferences
      console.log('🤖 [Android] Writing to SharedPreferences');
      
      // TODO: Implement native Android SharedPreferences writing
      // Example: await NativeModules.WidgetData.writeToSharedPrefs('tarot_widget_data', data);
      
    } catch (error) {
      console.warn('⚠️ SharedPreferences write failed, using AsyncStorage fallback');
    }
  }

  private async readFromSharedPreferences(): Promise<string | null> {
    try {
      console.log('🤖 [Android] Reading from SharedPreferences');
      
      // TODO: Implement native Android SharedPreferences reading
      // Example: return await NativeModules.WidgetData.readFromSharedPrefs('tarot_widget_data');
      
      return null;
    } catch (error) {
      console.warn('⚠️ SharedPreferences read failed, using AsyncStorage fallback');
      return null;
    }
  }

  private async clearSharedPreferences(): Promise<void> {
    try {
      console.log('🤖 [Android] Clearing SharedPreferences data');
      
      // TODO: Implement native Android SharedPreferences clearing
      // Example: await NativeModules.WidgetData.clearSharedPrefs('tarot_widget_data');
      
    } catch (error) {
      console.warn('⚠️ SharedPreferences clear failed');
    }
  }
}

// Export singleton instance
export const widgetDataManager: WidgetDataManager = new WidgetDataManagerImpl();

export default widgetDataManager;