/**
 * App Lifecycle Service - Manages app state transitions and background behavior
 */

import { useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import * as Notifications from 'expo-notifications';
import { dailyResetService } from './dailyResetService';
import { notificationService } from './notificationService';
import { useDailyTarotStore } from '@/stores';

export interface AppLifecycleService {
  initialize: () => () => void; // Returns cleanup function
  handleAppStateChange: (nextAppState: AppStateStatus) => void;
  setupNotificationListeners: () => () => void;
  getCurrentAppState: () => AppStateStatus;
}

/**
 * Hook for managing app lifecycle in React components
 */
export const useAppLifecycle = () => {
  const appState = useRef(AppState.currentState);
  const isInitializedRef = useRef(false);
  const dailyTarotStore = useDailyTarotStore();

  const initializeServices = useCallback(async () => {
    if (isInitializedRef.current) return;
    
    try {
      // Initialize notification service
      await notificationService.registerBackgroundTask();
      
      // Initialize daily reset service
      await dailyResetService.registerBackgroundTask();
      
      // Schedule notifications
      await notificationService.scheduleHourlyNotifications();
      await notificationService.scheduleMidnightReset();
      
      isInitializedRef.current = true;
      console.log('✅ App lifecycle services initialized');
    } catch (error) {
      console.error('❌ Failed to initialize app lifecycle services:', error);
    }
  }, []);

  const handleAppStateChange = useCallback(async (nextAppState: AppStateStatus) => {
    console.log('🔄 App state changing:', appState.current, '→', nextAppState);
    
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      // App came to foreground
      console.log('📱 App activated');
      
      if (isInitializedRef.current) {
        await dailyResetService.handleAppForeground();
      }
    } else if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
      // App went to background
      console.log('📱 App backgrounded');
      
      if (isInitializedRef.current) {
        await dailyResetService.handleAppBackground();
      }
    }

    appState.current = nextAppState;
  }, []);

  const setupNotificationListeners = useCallback(() => {
    // Listen for notifications received while app is open
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('📬 Notification received:', notification);
      notificationService.handleNotificationReceived?.(notification);
    });

    // Listen for user tapping notifications
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Notification tapped:', response);
      notificationService.handleNotificationResponse?.(response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

  useEffect(() => {
    // Initialize services
    initializeServices();

    // Set up app state listener
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    // Set up notification listeners
    const cleanupNotifications = setupNotificationListeners();

    // Cleanup function
    return () => {
      appStateSubscription?.remove();
      cleanupNotifications();
      isInitializedRef.current = false;
    };
  }, [initializeServices, handleAppStateChange, setupNotificationListeners]);

  return {
    currentState: appState.current,
    triggerManualReset: dailyResetService.performDailyReset,
    scheduleNotifications: notificationService.scheduleHourlyNotifications,
  };
};

/**
 * Initialize app lifecycle management
 */
export const initialize = (): (() => void) => {
  const appState = { current: AppState.currentState };
  let isInitialized = false;

  const initializeServices = async () => {
    try {
      console.log('🚀 Initializing app lifecycle services...');
      
      // Initialize notification system
      const hasPermissions = await notificationService.requestPermissions();
      
      if (hasPermissions) {
        await notificationService.registerBackgroundTask();
        await notificationService.scheduleHourlyNotifications();
        await notificationService.scheduleMidnightReset();
      }
      
      // Initialize daily reset system
      await dailyResetService.registerBackgroundTask();
      
      isInitialized = true;
      console.log('✅ App lifecycle services initialized');
    } catch (error) {
      console.error('❌ Failed to initialize app lifecycle services:', error);
    }
  };

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (!isInitialized) return;

    console.log('🔄 App state changing:', appState.current, '→', nextAppState);
    
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      // App came to foreground
      await dailyResetService.handleAppForeground();
    } else if (appState.current === 'active' && nextAppState.match(/inactive|background/)) {
      // App went to background
      await dailyResetService.handleAppBackground();
    }

    appState.current = nextAppState;
  };

  const setupNotificationListeners = () => {
    // Listen for notifications received while app is open
    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      notificationService.handleNotificationReceived?.(notification);
    });

    // Listen for user tapping notifications
    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      notificationService.handleNotificationResponse?.(response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  };

  // Initialize immediately
  initializeServices();

  // Set up listeners
  const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
  const cleanupNotifications = setupNotificationListeners();

  // Return cleanup function
  return () => {
    appStateSubscription?.remove();
    cleanupNotifications();
  };
};

/**
 * Handle app state change manually
 */
export const handleAppStateChange = async (nextAppState: AppStateStatus): Promise<void> => {
  const currentState = AppState.currentState;
  
  if (currentState.match(/inactive|background/) && nextAppState === 'active') {
    await dailyResetService.handleAppForeground();
  } else if (currentState === 'active' && nextAppState.match(/inactive|background/)) {
    await dailyResetService.handleAppBackground();
  }
};

/**
 * Setup notification listeners
 */
export const setupNotificationListeners = (): (() => void) => {
  const notificationListener = Notifications.addNotificationReceivedListener(notification => {
    console.log('📬 Notification received:', notification);
  });

  const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
    console.log('👆 Notification response:', response);
  });

  return () => {
    notificationListener.remove();
    responseListener.remove();
  };
};

/**
 * Get current app state
 */
export const getCurrentAppState = (): AppStateStatus => {
  return AppState.currentState;
};

/**
 * Create app lifecycle service instance
 */
export const appLifecycleService: AppLifecycleService = {
  initialize,
  handleAppStateChange,
  setupNotificationListeners,
  getCurrentAppState
};

export default appLifecycleService;