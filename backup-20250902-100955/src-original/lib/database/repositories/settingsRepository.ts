import { 
  Setting, 
  CreateSetting,
  DatabaseError 
} from '../types';
import { dbConnection } from '../connection';

/**
 * Repository for managing app settings and preferences
 */
export class SettingsRepository {

  /**
   * Get setting by key
   */
  async getSetting(key: string): Promise<Setting | null> {
    return await dbConnection.queryFirst<Setting>(
      'SELECT * FROM settings WHERE key = ?',
      [key]
    );
  }

  /**
   * Get setting value by key
   */
  async getSettingValue(key: string): Promise<string | null> {
    const setting = await this.getSetting(key);
    return setting?.value || null;
  }

  /**
   * Get multiple settings by keys
   */
  async getSettings(keys: string[]): Promise<Setting[]> {
    if (keys.length === 0) {
      return [];
    }

    const placeholders = keys.map(() => '?').join(',');
    const result = await dbConnection.query<Setting>(
      `SELECT * FROM settings WHERE key IN (${placeholders})`,
      keys
    );

    return result.rows;
  }

  /**
   * Get all settings
   */
  async getAllSettings(): Promise<Setting[]> {
    const result = await dbConnection.query<Setting>(
      'SELECT * FROM settings ORDER BY key'
    );

    return result.rows;
  }

  /**
   * Set a setting value
   */
  async setSetting(key: string, value: string): Promise<Setting> {
    try {
      await dbConnection.query(
        `INSERT OR REPLACE INTO settings (key, value, updated_at) 
         VALUES (?, ?, CURRENT_TIMESTAMP)`,
        [key, value]
      );

      const setting = await this.getSetting(key);
      if (!setting) {
        throw new DatabaseError(`Failed to retrieve setting after insert: ${key}`);
      }

      return setting;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new DatabaseError(`Failed to set setting ${key}: ${message}`);
    }
  }

  /**
   * Set multiple settings in one transaction
   */
  async setSettings(settings: Record<string, string>): Promise<Setting[]> {
    const entries = Object.entries(settings);
    
    if (entries.length === 0) {
      return [];
    }

    try {
      const queries = entries.map(([key, value]) => ({
        sql: `INSERT OR REPLACE INTO settings (key, value, updated_at) 
              VALUES (?, ?, CURRENT_TIMESTAMP)`,
        params: [key, value]
      }));

      await dbConnection.transaction(queries);

      // Return updated settings
      return this.getSettings(entries.map(([key]) => key));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      throw new DatabaseError(`Failed to set multiple settings: ${message}`);
    }
  }

  /**
   * Delete setting
   */
  async deleteSetting(key: string): Promise<void> {
    const result = await dbConnection.query(
      'DELETE FROM settings WHERE key = ?',
      [key]
    );

    if (result.rowsAffected === 0) {
      throw new DatabaseError(`Setting with key '${key}' not found`);
    }
  }

  /**
   * Delete multiple settings
   */
  async deleteSettings(keys: string[]): Promise<void> {
    if (keys.length === 0) {
      return;
    }

    const placeholders = keys.map(() => '?').join(',');
    await dbConnection.query(
      `DELETE FROM settings WHERE key IN (${placeholders})`,
      keys
    );
  }

  /**
   * Check if setting exists
   */
  async hasSetting(key: string): Promise<boolean> {
    const result = await dbConnection.queryFirst<{ count: number }>(
      'SELECT COUNT(*) as count FROM settings WHERE key = ?',
      [key]
    );

    return (result?.count || 0) > 0;
  }

  // === TYPED SETTING HELPERS ===

  /**
   * Get boolean setting
   */
  async getBooleanSetting(key: string, defaultValue = false): Promise<boolean> {
    const value = await this.getSettingValue(key);
    
    if (value === null) {
      return defaultValue;
    }

    return value.toLowerCase() === 'true';
  }

  /**
   * Set boolean setting
   */
  async setBooleanSetting(key: string, value: boolean): Promise<Setting> {
    return this.setSetting(key, value.toString());
  }

  /**
   * Get number setting
   */
  async getNumberSetting(key: string, defaultValue = 0): Promise<number> {
    const value = await this.getSettingValue(key);
    
    if (value === null) {
      return defaultValue;
    }

    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }

  /**
   * Set number setting
   */
  async setNumberSetting(key: string, value: number): Promise<Setting> {
    return this.setSetting(key, value.toString());
  }

  /**
   * Get JSON setting
   */
  async getJSONSetting<T = any>(key: string, defaultValue?: T): Promise<T | null> {
    const value = await this.getSettingValue(key);
    
    if (value === null) {
      return defaultValue || null;
    }

    try {
      return JSON.parse(value);
    } catch (error) {
      console.error(`Failed to parse JSON setting ${key}:`, error);
      return defaultValue || null;
    }
  }

  /**
   * Set JSON setting
   */
  async setJSONSetting(key: string, value: any): Promise<Setting> {
    return this.setSetting(key, JSON.stringify(value));
  }

  // === COMMON APP SETTINGS ===

  /**
   * Get app version
   */
  async getAppVersion(): Promise<string> {
    return await this.getSettingValue('app_version') || '1.0.0';
  }

  /**
   * Set app version
   */
  async setAppVersion(version: string): Promise<Setting> {
    return this.setSetting('app_version', version);
  }

  /**
   * Get notifications enabled status
   */
  async getNotificationsEnabled(): Promise<boolean> {
    return this.getBooleanSetting('notifications_enabled', true);
  }

  /**
   * Set notifications enabled status
   */
  async setNotificationsEnabled(enabled: boolean): Promise<Setting> {
    return this.setBooleanSetting('notifications_enabled', enabled);
  }

  /**
   * Get hourly notifications status
   */
  async getHourlyNotifications(): Promise<boolean> {
    return this.getBooleanSetting('hourly_notifications', false);
  }

  /**
   * Set hourly notifications status
   */
  async setHourlyNotifications(enabled: boolean): Promise<Setting> {
    return this.setBooleanSetting('hourly_notifications', enabled);
  }

  /**
   * Get daily reminder status
   */
  async getDailyReminder(): Promise<boolean> {
    return this.getBooleanSetting('daily_reminder', true);
  }

  /**
   * Set daily reminder status
   */
  async setDailyReminder(enabled: boolean): Promise<Setting> {
    return this.setBooleanSetting('daily_reminder', enabled);
  }

  /**
   * Get active deck ID
   */
  async getActiveDeckId(): Promise<string> {
    return await this.getSettingValue('active_deck_id') || 'classic';
  }

  /**
   * Set active deck ID
   */
  async setActiveDeckId(deckId: string): Promise<Setting> {
    return this.setSetting('active_deck_id', deckId);
  }

  /**
   * Get auto-save readings status
   */
  async getAutoSaveReadings(): Promise<boolean> {
    return this.getBooleanSetting('auto_save_readings', true);
  }

  /**
   * Set auto-save readings status
   */
  async setAutoSaveReadings(enabled: boolean): Promise<Setting> {
    return this.setBooleanSetting('auto_save_readings', enabled);
  }

  /**
   * Get theme setting
   */
  async getTheme(): Promise<'light' | 'dark'> {
    const theme = await this.getSettingValue('theme');
    return (theme === 'dark') ? 'dark' : 'light';
  }

  /**
   * Set theme setting
   */
  async setTheme(theme: 'light' | 'dark'): Promise<Setting> {
    return this.setSetting('theme', theme);
  }

  /**
   * Get all app preferences as a typed object
   */
  async getAppPreferences(): Promise<{
    notificationsEnabled: boolean;
    hourlyNotifications: boolean;
    dailyReminder: boolean;
    activeDeckId: string;
    autoSaveReadings: boolean;
    theme: 'light' | 'dark';
    appVersion: string;
  }> {
    return {
      notificationsEnabled: await this.getNotificationsEnabled(),
      hourlyNotifications: await this.getHourlyNotifications(),
      dailyReminder: await this.getDailyReminder(),
      activeDeckId: await this.getActiveDeckId(),
      autoSaveReadings: await this.getAutoSaveReadings(),
      theme: await this.getTheme(),
      appVersion: await this.getAppVersion()
    };
  }

  /**
   * Update app preferences
   */
  async updateAppPreferences(preferences: Partial<{
    notificationsEnabled: boolean;
    hourlyNotifications: boolean;
    dailyReminder: boolean;
    activeDeckId: string;
    autoSaveReadings: boolean;
    theme: 'light' | 'dark';
  }>): Promise<void> {
    const updates: Record<string, string> = {};

    if (preferences.notificationsEnabled !== undefined) {
      updates.notifications_enabled = preferences.notificationsEnabled.toString();
    }

    if (preferences.hourlyNotifications !== undefined) {
      updates.hourly_notifications = preferences.hourlyNotifications.toString();
    }

    if (preferences.dailyReminder !== undefined) {
      updates.daily_reminder = preferences.dailyReminder.toString();
    }

    if (preferences.activeDeckId !== undefined) {
      updates.active_deck_id = preferences.activeDeckId;
    }

    if (preferences.autoSaveReadings !== undefined) {
      updates.auto_save_readings = preferences.autoSaveReadings.toString();
    }

    if (preferences.theme !== undefined) {
      updates.theme = preferences.theme;
    }

    if (Object.keys(updates).length > 0) {
      await this.setSettings(updates);
    }
  }
}