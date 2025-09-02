/**
 * Store Provider - Enhanced with Phase 4 App Lifecycle Management
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { theme } from '@/constants';
import { useAppLifecycle } from '@/services/appLifecycleService';
import { useDailyTarotStore } from '@/stores/dailyTarotStore';
import { useSettingsStore } from '@/stores/settingsStore';
import * as notificationService from '@/services/notificationService';

interface StoreContextValue {
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

interface StoreProviderProps {
  children: React.ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  const dailyTarotStore = useDailyTarotStore();
  const settingsStore = useSettingsStore();
  const [initializationAttempted, setInitializationAttempted] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Initialize app lifecycle management
  useAppLifecycle();

  // Initialize stores when provider mounts
  useEffect(() => {
    let isMounted = true;

    const initializeStores = async () => {
      if (initializationAttempted) {
        return;
      }

      setInitializationAttempted(true);

      try {
        console.log('🏪 StoreProvider: Initializing app systems...');

        // Initialize notification system first
        await notificationService.initializeNotifications();
        console.log('✅ StoreProvider: Notification system initialized');

        // Load settings (this will also schedule notifications based on settings)
        await settingsStore.loadSettings();
        console.log('✅ StoreProvider: Settings loaded');

        // Initialize the daily tarot system
        await dailyTarotStore.initializeToday();
        console.log('✅ StoreProvider: Daily tarot system initialized');

        if (isMounted) {
          console.log('✅ StoreProvider: All systems initialized successfully');
        }
      } catch (error) {
        if (isMounted) {
          console.error('❌ StoreProvider: Initialization failed:', error);
        }
      }
    };

    initializeStores();

    return () => {
      isMounted = false;
    };
  }, [initializationAttempted]);

  const retry = async () => {
    console.log(`🔄 StoreProvider: Retry attempt ${retryCount + 1}`);
    setRetryCount(prev => prev + 1);
    setInitializationAttempted(false);
    
    try {
      await dailyTarotStore.reset();
      // Initialization will happen in useEffect
    } catch (error) {
      console.error('❌ StoreProvider: Retry failed:', error);
    }
  };

  const contextValue: StoreContextValue = {
    isInitialized: !!dailyTarotStore.currentSession,
    isLoading: dailyTarotStore.isLoading,
    error: dailyTarotStore.error,
    retry
  };

  // Show loading screen while initializing
  if (dailyTarotStore.isLoading && !dailyTarotStore.currentSession) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24
      }}>
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          color: theme.colors.text,
          marginBottom: 12,
          textAlign: 'center'
        }}>
          Preparing Your Daily Cards...
        </Text>
        <Text style={{
          fontSize: 14,
          color: theme.colors.textSecondary,
          textAlign: 'center',
          lineHeight: 20
        }}>
          Shuffling the cosmic deck for today's 24-hour journey
        </Text>
      </View>
    );
  }

  // Show error screen if initialization failed
  if (dailyTarotStore.error && !dailyTarotStore.currentSession) {
    return (
      <View style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24
      }}>
        <Text style={{
          fontSize: 18,
          fontWeight: '600',
          color: theme.colors.accent,
          marginBottom: 12,
          textAlign: 'center'
        }}>
          Unable to Initialize Tarot Timer
        </Text>
        <Text style={{
          fontSize: 14,
          color: theme.colors.textSecondary,
          textAlign: 'center',
          marginBottom: 24,
          lineHeight: 20
        }}>
          {dailyTarotStore.error}
        </Text>
        <View style={{
          backgroundColor: theme.colors.primary,
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 8
        }}>
          <Text 
            style={{
              color: 'white',
              fontSize: 16,
              fontWeight: '600'
            }}
            onPress={retry}
          >
            Try Again
          </Text>
        </View>
        {__DEV__ && (
          <Text style={{
            fontSize: 12,
            color: theme.colors.textSecondary,
            marginTop: 16,
            textAlign: 'center'
          }}>
            Retry Count: {retryCount}
          </Text>
        )}
      </View>
    );
  }

  // Render app when everything is ready
  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
}

/**
 * Hook to use store context
 */
export function useStoreContext(): StoreContextValue {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStoreContext must be used within a StoreProvider');
  }
  return context;
}

export default StoreProvider;