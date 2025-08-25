/**
 * Notification Service - Manages hourly notifications and daily resets
 */

import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { Platform } from 'react-native';
import { addHours, startOfDay } from 'date-fns';
import { getMidnightDate, formatTimeDisplay } from '@/lib/timeManager';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Task for background notifications
const BACKGROUND_NOTIFICATION_TASK = 'background-notification';

export interface NotificationContent {
  title: string;
  body: string;
  data?: any;
}

export interface NotificationService {
  requestPermissions: () => Promise<boolean>;
  scheduleHourlyNotifications: () => Promise<void>;
  scheduleMidnightReset: () => Promise<void>;
  cancelAllNotifications: () => Promise<void>;
  getHourlyNotificationContent: (hour: number) => NotificationContent;
  getMidnightResetContent: () => NotificationContent;
  registerBackgroundTask: () => Promise<void>;
  handleNotificationReceived?: (notification: Notifications.Notification) => void;
  handleNotificationResponse?: (response: Notifications.NotificationResponse) => void;
}

/**
 * Request notification permissions
 */
export const requestPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Notification permissions not granted');
      return false;
    }

    // Configure notification channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('hourly-tarot', {
        name: 'Hourly Tarot Cards',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'default',
        enableVibrate: true,
      });

      await Notifications.setNotificationChannelAsync('daily-reset', {
        name: 'Daily Reset',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'default',
        enableVibrate: true,
      });
    }

    return true;
  } catch (error) {
    console.error('Failed to request notification permissions:', error);
    return false;
  }
};

/**
 * Schedule hourly notifications for next 24 hours
 */
export const scheduleHourlyNotifications = async (): Promise<void> => {
  try {
    // Cancel existing hourly notifications
    await cancelHourlyNotifications();

    const hasPermissions = await requestPermissions();
    if (!hasPermissions) {
      console.warn('Cannot schedule notifications without permissions');
      return;
    }

    const now = new Date();
    const notifications: Notifications.NotificationRequestInput[] = [];

    // Schedule next 24 hourly notifications
    for (let i = 1; i <= 24; i++) {
      const notificationTime = addHours(startOfDay(now), (now.getHours() + i) % 24);
      
      // If it's for tomorrow, add a day
      if ((now.getHours() + i) >= 24) {
        notificationTime.setDate(notificationTime.getDate() + 1);
      }

      const hour = notificationTime.getHours();
      const content = getHourlyNotificationContent(hour);

      notifications.push({
        identifier: `hourly-${hour}`,
        content: {
          title: content.title,
          body: content.body,
          data: content.data,
          sound: 'default',
        },
        trigger: {
          date: notificationTime,
        },
      });
    }

    // Schedule all notifications
    for (const notification of notifications) {
      await Notifications.scheduleNotificationAsync(notification);
    }

    console.log(`Scheduled ${notifications.length} hourly notifications`);
  } catch (error) {
    console.error('Failed to schedule hourly notifications:', error);
  }
};

/**
 * Schedule midnight reset notification
 */
export const scheduleMidnightReset = async (): Promise<void> => {
  try {
    // Cancel existing midnight notification
    await Notifications.cancelScheduledNotificationAsync('midnight-reset');

    const hasPermissions = await requestPermissions();
    if (!hasPermissions) {
      return;
    }

    const midnightDate = getMidnightDate();
    const content = getMidnightResetContent();

    await Notifications.scheduleNotificationAsync({
      identifier: 'midnight-reset',
      content: {
        title: content.title,
        body: content.body,
        data: content.data,
        sound: 'default',
      },
      trigger: {
        date: midnightDate,
      },
    });

    console.log('Scheduled midnight reset notification for:', midnightDate);
  } catch (error) {
    console.error('Failed to schedule midnight reset:', error);
  }
};

/**
 * Cancel all notifications
 */
export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications cancelled');
  } catch (error) {
    console.error('Failed to cancel notifications:', error);
  }
};

/**
 * Cancel only hourly notifications
 */
const cancelHourlyNotifications = async (): Promise<void> => {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    
    for (const notification of scheduledNotifications) {
      if (notification.identifier.startsWith('hourly-')) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }
    
    console.log('Hourly notifications cancelled');
  } catch (error) {
    console.error('Failed to cancel hourly notifications:', error);
  }
};

/**
 * Get notification content for specific hour
 */
export const getHourlyNotificationContent = (hour: number): NotificationContent => {
  const timeDisplay = formatTimeDisplay(hour);
  
  const messages = [
    "Your tarot card awaits",
    "Time for mystical guidance",
    "The cards have a message for you",
    "Discover your hourly wisdom",
    "Your cosmic guidance is ready",
    "The universe has spoken",
    "New insights await you",
    "Time to reflect and discover"
  ];
  
  const randomMessage = messages[hour % messages.length];
  
  return {
    title: `${timeDisplay} Tarot Card`,
    body: `${randomMessage} • Hour ${hour}`,
    data: {
      type: 'hourly-card',
      hour,
      timestamp: new Date().toISOString()
    }
  };
};

/**
 * Get midnight reset notification content
 */
export const getMidnightResetContent = (): NotificationContent => {
  return {
    title: "🌙 New Day, New Cards",
    body: "Your fresh 24-hour tarot journey begins now. Welcome the new day's wisdom!",
    data: {
      type: 'daily-reset',
      timestamp: new Date().toISOString()
    }
  };
};

/**
 * Register background task for notifications
 */
export const registerBackgroundTask = async (): Promise<void> => {
  try {
    if (TaskManager.isTaskDefined(BACKGROUND_NOTIFICATION_TASK)) {
      return;
    }

    TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error }) => {
      if (error) {
        console.error('Background task error:', error);
        return;
      }

      console.log('Background notification task executed', data);
      
      // Re-schedule notifications if needed
      scheduleHourlyNotifications().catch(console.error);
    });

    console.log('Background notification task registered');
  } catch (error) {
    console.error('Failed to register background task:', error);
  }
};

/**
 * Handle notification received while app is open
 */
export const handleNotificationReceived = (notification: Notifications.Notification) => {
  const { type, hour } = notification.request.content.data || {};
  
  if (type === 'hourly-card') {
    console.log(`Received hourly notification for hour ${hour}`);
    // Could trigger store actions here
  } else if (type === 'daily-reset') {
    console.log('Received daily reset notification');
    // Could trigger daily reset here
  }
};

/**
 * Handle notification tapped by user
 */
export const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
  const { type, hour } = response.notification.request.content.data || {};
  
  if (type === 'hourly-card') {
    console.log(`User tapped hourly notification for hour ${hour}`);
    // Could navigate to specific hour
  } else if (type === 'daily-reset') {
    console.log('User tapped daily reset notification');
    // Could navigate to home and trigger reset
  }
};

/**
 * Create notification service instance
 */
export const notificationService: NotificationService = {
  requestPermissions,
  scheduleHourlyNotifications,
  scheduleMidnightReset,
  cancelAllNotifications,
  getHourlyNotificationContent,
  getMidnightResetContent,
  registerBackgroundTask,
  handleNotificationReceived,
  handleNotificationResponse
};

export default notificationService;