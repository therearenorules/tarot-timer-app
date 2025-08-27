/**
 * Main App Entry Point for Expo Router
 * Supports both native and web platforms
 */

import { StatusBar } from 'expo-status-bar';
import { registerRootComponent } from 'expo';
import React from 'react';

// Import providers and navigation
import { StoreProvider } from './src/components/providers/StoreProvider';
import { DatabaseProvider } from './src/lib/database/DatabaseProvider';
import { AdvancedErrorBoundary } from './src/components/AdvancedErrorBoundary';

// Expo Router
import { Slot } from 'expo-router';

function App() {
  return (
    <AdvancedErrorBoundary>
      <DatabaseProvider>
        <StoreProvider>
          <StatusBar style="dark" />
          <Slot />
        </StoreProvider>
      </DatabaseProvider>
    </AdvancedErrorBoundary>
  );
}

export default registerRootComponent(App);