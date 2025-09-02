// contexts/index.ts - Context API exports
import React from 'react';

export { 
  AppProvider, 
  useAppContext, 
  useAppState, 
  useAppActions, 
  useZustandStore 
} from './AppContext';

export { 
  TarotSessionProvider, 
  useTarotSession, 
  useTarotSessionState, 
  useTarotSessionActions, 
  useCurrentCard 
} from './TarotSessionContext';

export {
  SettingsProvider,
  useSettings,
  useSettingsState,
  useSettingsActions,
  useNotificationSettings
} from './SettingsContext';

export type { AppState, AppAction } from './AppContext';
export type { TarotSessionState, TarotSessionAction, HourCard } from './TarotSessionContext';
export type { SettingsContextState, SettingsAction } from './SettingsContext';

// Import providers for ContextProviders component
import { AppProvider } from './AppContext';
import { TarotSessionProvider } from './TarotSessionContext';
import { SettingsProvider } from './SettingsContext';

interface ContextProvidersProps {
  children: React.ReactNode;
}

export function ContextProviders({ children }: ContextProvidersProps) {
  return React.createElement(AppProvider, null,
    React.createElement(SettingsProvider, null,
      React.createElement(TarotSessionProvider, null, children)
    )
  );
}