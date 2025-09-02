/**
 * Notification Service for Tarot Timer App
 * Handles hourly reminders and daily notifications
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { handleError, createUserActionError, ErrorType, ErrorSeverity } from '@/lib/errorHandling';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Notification content templates
 */
const NOTIFICATION_CONTENT = {
  hourly: {
    title: '🃏 Your Tarot Card Awaits',
    body: 'Discover your card for this hour and embrace the guidance it offers.',
  },
  daily: {
    title: '🔮 Daily Tarot Reminder',
    body: 'Start your day with tarot wisdom. Your 24-hour journey begins now!',
  },
};

/**
 * Request notification permissions
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      const permissionError = createUserActionError(
        '알림 권한이 거부되었습니다. 설정에서 알림 권한을 허용해 주세요.',
        undefined,
        { permissionStatus: finalStatus }
      );
      handleError(permissionError);
      return false;
    }

    // Configure notification channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('hourly-reminders', {
        name: 'Hourly Tarot Reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });

      await Notifications.setNotificationChannelAsync('daily-reminders', {
        name: 'Daily Tarot Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    console.log('Notification permissions granted');
    return true;
  } catch (error) {
    const permissionError = createUserActionError(
      '알림 권한 요청 중 오류가 발생했습니다.',
      error as Error,
      { action: 'requestNotificationPermissions' }
    );
    handleError(permissionError);
    return false;
  }
};

/**
 * Schedule hourly notifications for all 24 hours
 */
export const scheduleHourlyNotifications = async (): Promise<void> => {
  try {
    // Cancel existing notifications first
    await cancelAllNotifications();

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      throw new Error('Notification permissions not granted');
    }

    // Schedule notification for each hour
    for (let hour = 0; hour < 24; hour++) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: NOTIFICATION_CONTENT.hourly.title,
          body: NOTIFICATION_CONTENT.hourly.body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.DEFAULT,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
          hour,
          minute: 0,
          repeats: true,
        },
      });
    }

    console.log('Hourly notifications scheduled successfully');
  } catch (error) {
    const schedulingError = createUserActionError(
      '시간별 알림 스케줄링 중 오류가 발생했습니다.',
      error as Error,
      { action: 'scheduleHourlyNotifications' }
    );
    handleError(schedulingError);
    throw error;
  }
};

/**
 * Schedule daily reminder notification
 */
export const scheduleDailyNotification = async (hour: number = 9): Promise<void> => {
  try {
    // Cancel existing daily notifications
    await cancelDailyNotifications();

    const hasPermission = await requestNotificationPermissions();
    if (!hasPermission) {
      throw new Error('알림 권한이 필요합니다. 설정에서 알림 권한을 허용해 주세요.');
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: NOTIFICATION_CONTENT.daily.title,
        body: NOTIFICATION_CONTENT.daily.body,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.CALENDAR,
        hour,
        minute: 0,
        repeats: true,
      },
    });

    console.log(`Daily notification scheduled for ${hour}:00`);
  } catch (error) {
    console.error('Error scheduling daily notification:', error);
    throw error;
  }
};

/**
 * Cancel all scheduled notifications
 */
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications cancelled');
  } catch (error) {
    console.error('Error cancelling notifications:', error);
    throw error;
  }
};

/**
 * Cancel only daily notifications
 */
export const cancelDailyNotifications = async (): Promise<void> => {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();

    for (const notification of scheduledNotifications) {
      if (notification.content.title === NOTIFICATION_CONTENT.daily.title) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }

    console.log('Daily notifications cancelled');
  } catch (error) {
    console.error('Error cancelling daily notifications:', error);
    throw error;
  }
};

/**
 * Cancel only hourly notifications
 */
export const cancelHourlyNotifications = async (): Promise<void> => {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();

    for (const notification of scheduledNotifications) {
      if (notification.content.title === NOTIFICATION_CONTENT.hourly.title) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }

    console.log('Hourly notifications cancelled');
  } catch (error) {
    console.error('Error cancelling hourly notifications:', error);
    throw error;
  }
};

/**
 * Get current notification permissions status
 */
export const getNotificationPermissionsStatus = async (): Promise<string> => {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
  } catch (error) {
    console.error('Error getting notification permissions:', error);
    return 'undetermined';
  }
};

/**
 * Check if notifications are enabled
 */
export const areNotificationsEnabled = async (): Promise<boolean> => {
  try {
    const status = await getNotificationPermissionsStatus();
    return status === 'granted';
  } catch (error) {
    console.error('Error checking notification status:', error);
    return false;
  }
};

/**
 * Get all scheduled notifications
 */
export const getAllScheduledNotifications = async () => {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('Error getting scheduled notifications:', error);
    return [];
  }
};

/**
 * Register background task (placeholder for React Native background tasks)
 */
export const registerBackgroundTask = async (): Promise<void> => {
  console.log('Background task registration - placeholder implementation');
};

/**
 * Schedule midnight reset task
 */
export const scheduleMidnightReset = async (): Promise<void> => {
  console.log('Midnight reset scheduling - placeholder implementation');
};

/**
 * Handle notification received
 */
export const handleNotificationReceived = (notification: any): void => {
  console.log('Notification received:', notification);
};

/**
 * Handle notification response
 */
export const handleNotificationResponse = (response: any): void => {
  console.log('Notification response:', response);
};

/**
 * Request permissions (alias for compatibility)
 */
export const requestPermissions = requestNotificationPermissions;

/**
 * Initialize notification system
 */
export const initializeNotifications = async (): Promise<void> => {
  try {
    // Set up notification categories if needed
    if (Platform.OS === 'ios') {
      await Notifications.setNotificationCategoryAsync('tarot-reminder', [
        {
          identifier: 'view-card',
          buttonTitle: 'View Card',
          options: {
            opensAppToForeground: true,
          },
        },
        {
          identifier: 'dismiss',
          buttonTitle: 'Dismiss',
          options: {
            isDestructive: true,
          },
        },
      ]);
    }

    console.log('Notification system initialized');
  } catch (error) {
    console.error('Error initializing notification system:', error);
    throw error;
  }
};

export const notificationService = {
  requestNotificationPermissions,
  scheduleHourlyNotifications,
  scheduleDailyNotification,
  cancelAllNotifications,
  cancelDailyNotifications,
  cancelHourlyNotifications,
  getNotificationPermissionsStatus,
  areNotificationsEnabled,
  getAllScheduledNotifications,
  initializeNotifications,
  registerBackgroundTask,
  scheduleMidnightReset,
  handleNotificationReceived,
  handleNotificationResponse,
  requestPermissions,
};

export default notificationService;