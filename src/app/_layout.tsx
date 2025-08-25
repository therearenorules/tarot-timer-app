import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { theme } from '@/constants';
import { DatabaseProvider } from '@/lib/database/DatabaseProvider';
import { StoreProvider } from '@/components/providers/StoreProvider';
import { ErrorBoundary } from '@/components';
import { handleError, ErrorType, ErrorSeverity, createAppError } from '@/lib/errorHandling';

export default function RootLayout() {
  const handleGlobalError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Create and handle the global error
    const appError = createAppError(
      ErrorType.SYSTEM,
      ErrorSeverity.CRITICAL,
      'Global application error occurred',
      error,
      {
        componentStack: errorInfo.componentStack,
        location: 'RootLayout',
      }
    );
    
    handleError(appError);
  };

  return (
    <ErrorBoundary onError={handleGlobalError}>
      <DatabaseProvider enableSampleData={__DEV__}>
        <StoreProvider>
          <StatusBar style="dark" backgroundColor={theme.colors.background} />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
          </Stack>
        </StoreProvider>
      </DatabaseProvider>
    </ErrorBoundary>
  );
}