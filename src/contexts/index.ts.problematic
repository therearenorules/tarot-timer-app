/**
 * contexts/index.ts - Context API 통합 익스포트
 */

// 메인 컨텍스트들
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

// 타입 익스포트
export type { AppState, AppAction } from './AppContext';
export type { TarotSessionState, TarotSessionAction, HourCard } from './TarotSessionContext';
export type { SettingsContextState, SettingsAction } from './SettingsContext';

// 통합 Provider 컴포넌트
import React from 'react';
import { AppProvider } from './AppContext';
import { TarotSessionProvider } from './TarotSessionContext';
import { SettingsProvider } from './SettingsContext';

interface ContextProvidersProps {
  children: React.ReactNode;
}

/**
 * 모든 Context Provider를 하나로 합친 통합 Provider
 * 앱의 루트에서 사용하여 모든 컨텍스트를 제공합니다.
 */
export function ContextProviders({ children }: ContextProvidersProps) {
  return (
    <AppProvider>
      <SettingsProvider>
        <TarotSessionProvider>
          {children}
        </TarotSessionProvider>
      </SettingsProvider>
    </AppProvider>
  );
}

export default ContextProviders;