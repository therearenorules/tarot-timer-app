/**
 * Daily Reset Service - Handles midnight resets and background tasks
 */

import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import { AppState, AppStateStatus } from 'react-native';
import { isNewDay, getCurrentDate } from '@/lib/timeManager';
import { notificationService } from './notificationService';
import { useDailyTarotStore, dailyTarotActions } from '@/stores';

// Background task identifier
const DAILY_RESET_TASK = 'daily-reset-task';

export interface DailyResetService {
  checkForNewDay: () => Promise<boolean>;
  performDailyReset: () => Promise<void>;
  scheduleNextReset: () => Promise<void>;
  registerBackgroundTask: () => Promise<void>;
  handleAppForeground: () => Promise<void>;
  handleAppBackground: () => Promise<void>;
}

/**
 * Check if it's a new day since last check
 */
export const checkForNewDay = async (): Promise<boolean> => {
  try {
    const store = useDailyTarotStore.getState();
    const lastDate = store.lastGeneratedDate;
    const currentDate = getCurrentDate();
    
    if (!lastDate) return true;
    
    return isNewDay(lastDate);
  } catch (error) {
    console.error('Failed to check for new day:', error);
    return false;
  }
};

/**
 * Perform complete daily reset
 */
export const performDailyReset = async (): Promise<void> => {
  try {
    console.log('🌅 Performing daily reset...');
    
    // Reset daily tarot store to generate new cards
    await dailyTarotActions.initializeToday();
    
    // Schedule new notifications
    await notificationService.scheduleHourlyNotifications();
    await notificationService.scheduleMidnightReset();
    
    console.log('✅ Daily reset completed successfully');
    
    // Could add more reset logic here:
    // - Clear temporary data
    // - Backup previous day's data
    // - Update analytics
    // - Send daily summary notification
    
  } catch (error) {
    console.error('❌ Failed to perform daily reset:', error);
    throw error;
  }
};

/**
 * Schedule next midnight reset
 */
export const scheduleNextReset = async (): Promise<void> => {
  try {
    await notificationService.scheduleMidnightReset();
  } catch (error) {
    console.error('Failed to schedule next reset:', error);
  }
};

/**
 * Register background task for daily reset
 */
export const registerBackgroundTask = async (): Promise<void> => {
  try {
    // Define the background task
    if (!TaskManager.isTaskDefined(DAILY_RESET_TASK)) {
      TaskManager.defineTask(DAILY_RESET_TASK, async ({ data, error }) => {
        if (error) {
          console.error('Background reset task error:', error);
          return BackgroundFetch.BackgroundFetchResult.Failed;
        }

        try {
          console.log('🔄 Background reset task executed');
          
          const needsReset = await checkForNewDay();
          
          if (needsReset) {
            await performDailyReset();
            return BackgroundFetch.BackgroundFetchResult.NewData;
          }
          
          return BackgroundFetch.BackgroundFetchResult.NoData;
        } catch (error) {
          console.error('Background reset task failed:', error);
          return BackgroundFetch.BackgroundFetchResult.Failed;
        }
      });
    }

    // Register the task
    await BackgroundFetch.registerTaskAsync(DAILY_RESET_TASK, {
      minimumInterval: 60 * 60 * 1000, // Check every hour
      stopOnTerminate: false,
      startOnBoot: true,
    });

    console.log('✅ Background reset task registered');
  } catch (error) {
    console.error('❌ Failed to register background task:', error);
  }
};

/**
 * Handle app coming to foreground
 */
export const handleAppForeground = async (): Promise<void> => {
  try {
    console.log('📱 App came to foreground, checking for new day...');
    
    const needsReset = await checkForNewDay();
    
    if (needsReset) {
      console.log('🌅 New day detected, performing reset...');
      await performDailyReset();
    } else {
      console.log('📅 Same day, refreshing current session...');
      await dailyTarotActions.refreshSession();
    }
    
    // Update current time
    dailyTarotActions.updateCurrentTime();
    
  } catch (error) {
    console.error('Failed to handle app foreground:', error);
  }
};

/**
 * Handle app going to background
 */
export const handleAppBackground = async (): Promise<void> => {
  try {
    console.log('📱 App going to background...');
    
    // Ensure notifications are scheduled
    await notificationService.scheduleHourlyNotifications();
    await notificationService.scheduleMidnightReset();
    
  } catch (error) {
    console.error('Failed to handle app background:', error);
  }
};

/**
 * Initialize daily reset system
 */
export const initializeDailyResetSystem = async (): Promise<() => void> => {
  try {
    console.log('🚀 Initializing daily reset system...');
    
    // Register background task
    await registerBackgroundTask();
    
    // Set up app state change listeners
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        handleAppForeground().catch(console.error);
      } else if (nextAppState === 'background') {
        handleAppBackground().catch(console.error);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    console.log('✅ Daily reset system initialized');

    // Return cleanup function
    return () => {
      subscription.remove();
    };
    
  } catch (error) {
    console.error('❌ Failed to initialize daily reset system:', error);
    throw error;
  }
};

/**
 * Manual reset trigger (for testing or user action)
 */
export const triggerManualReset = async (): Promise<void> => {
  try {
    console.log('🔄 Manual reset triggered...');
    
    await performDailyReset();
    
    console.log('✅ Manual reset completed');
  } catch (error) {
    console.error('❌ Manual reset failed:', error);
    throw error;
  }
};

/**
 * Get reset system status
 */
export const getResetSystemStatus = async (): Promise<{
  backgroundTaskRegistered: boolean;
  lastResetDate: string;
  nextMidnight: Date;
  needsReset: boolean;
}> => {
  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(DAILY_RESET_TASK);
    const needsReset = await checkForNewDay();
    const store = useDailyTarotStore.getState();
    
    return {
      backgroundTaskRegistered: isRegistered,
      lastResetDate: store.lastGeneratedDate || 'Never',
      nextMidnight: new Date(), // Would calculate next midnight
      needsReset
    };
  } catch (error) {
    console.error('Failed to get reset system status:', error);
    return {
      backgroundTaskRegistered: false,
      lastResetDate: 'Error',
      nextMidnight: new Date(),
      needsReset: false
    };
  }
};

/**
 * Create daily reset service instance
 */
export const dailyResetService: DailyResetService = {
  checkForNewDay,
  performDailyReset,
  scheduleNextReset,
  registerBackgroundTask,
  handleAppForeground,
  handleAppBackground
};

export default dailyResetService;