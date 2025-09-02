/**
 * SettingsContext.tsx - 설정 상태 관리 컨텍스트
 * 앱 설정 및 사용자 환경 설정 관리
 */

import React, { 
  createContext, 
  useContext, 
  useReducer, 
  useCallback, 
  ReactNode,
  useEffect 
} from 'react';
import { useSettingsStore, settingsActions } from '@/stores';

// 설정 상태 타입
export interface SettingsContextState {
  // 알림 설정
  notificationsEnabled: boolean;
  hourlyNotifications: boolean;
  dailyReminder: boolean;
  customNotificationTimes: number[];
  
  // 리딩 설정
  selectedDeckId: string;
  autoSaveReadings: boolean;
  
  // 앱 설정
  theme: 'light' | 'dark';
  language: 'ko' | 'en';
  
  // 프리미엄 설정
  adRemovalPurchased: boolean;
  purchasedDecks: string[];
  
  // UI 상태
  isLoading: boolean;
  error: string | null;
}

// 액션 타입
export type SettingsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_NOTIFICATION_SETTING'; payload: { key: keyof SettingsContextState; value: any } }
  | { type: 'SET_SELECTED_DECK'; payload: string }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_LANGUAGE'; payload: 'ko' | 'en' }
  | { type: 'ADD_NOTIFICATION_TIME'; payload: number }
  | { type: 'REMOVE_NOTIFICATION_TIME'; payload: number }
  | { type: 'SET_PURCHASED_DECKS'; payload: string[] }
  | { type: 'RESET_SETTINGS' };

// 초기 상태
const initialState: SettingsContextState = {
  notificationsEnabled: true,
  hourlyNotifications: false,
  dailyReminder: true,
  customNotificationTimes: [9, 12, 18],
  selectedDeckId: 'classic',
  autoSaveReadings: true,
  theme: 'light',
  language: 'ko',
  adRemovalPurchased: false,
  purchasedDecks: [],
  isLoading: false,
  error: null,
};

// 리듀서
function settingsReducer(state: SettingsContextState, action: SettingsAction): SettingsContextState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
      
    case 'SET_ERROR':
      return { ...state, error: action.payload };
      
    case 'UPDATE_NOTIFICATION_SETTING':
      return { ...state, [action.payload.key]: action.payload.value };
      
    case 'SET_SELECTED_DECK':
      return { ...state, selectedDeckId: action.payload };
      
    case 'SET_THEME':
      return { ...state, theme: action.payload };
      
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
      
    case 'ADD_NOTIFICATION_TIME':
      if (!state.customNotificationTimes.includes(action.payload)) {
        return { 
          ...state, 
          customNotificationTimes: [...state.customNotificationTimes, action.payload].sort((a, b) => a - b) 
        };
      }
      return state;
      
    case 'REMOVE_NOTIFICATION_TIME':
      return { 
        ...state, 
        customNotificationTimes: state.customNotificationTimes.filter(time => time !== action.payload) 
      };
      
    case 'SET_PURCHASED_DECKS':
      return { ...state, purchasedDecks: action.payload };
      
    case 'RESET_SETTINGS':
      return { ...initialState };
      
    default:
      return state;
  }
}

// 컨텍스트 타입
interface SettingsContextType {
  state: SettingsContextState;
  dispatch: React.Dispatch<SettingsAction>;
  
  // 액션 함수들
  loadSettings: () => Promise<void>;
  updateSetting: <K extends keyof SettingsContextState>(key: K, value: SettingsContextState[K]) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  
  // 알림 관련
  toggleNotifications: (enabled: boolean) => Promise<void>;
  toggleHourlyNotifications: (enabled: boolean) => Promise<void>;
  toggleDailyReminder: (enabled: boolean) => Promise<void>;
  addNotificationTime: (hour: number) => Promise<void>;
  removeNotificationTime: (hour: number) => Promise<void>;
  
  // 테마 및 언어
  setTheme: (theme: 'light' | 'dark') => Promise<void>;
  setLanguage: (language: 'ko' | 'en') => Promise<void>;
  
  // 덱 관리
  setSelectedDeck: (deckId: string) => Promise<void>;
  
  // 프리미엄 기능
  purchaseDeck: (deckId: string) => Promise<void>;
  restorePurchases: () => Promise<void>;
  
  // 유틸리티
  isDeckPurchased: (deckId: string) => boolean;
  getNotificationTimes: () => number[];
}

// 컨텍스트 생성
const SettingsContext = createContext<SettingsContextType | null>(null);

// Provider
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(settingsReducer, initialState);
  const zustandStore = useSettingsStore();

  // Zustand 스토어와 동기화
  useEffect(() => {
    const syncFromZustand = () => {
      const zustandState = zustandStore.getState();
      dispatch({ type: 'UPDATE_NOTIFICATION_SETTING', payload: { key: 'notificationsEnabled', value: zustandState.notificationsEnabled } });
      dispatch({ type: 'UPDATE_NOTIFICATION_SETTING', payload: { key: 'hourlyNotifications', value: zustandState.hourlyNotifications } });
      dispatch({ type: 'UPDATE_NOTIFICATION_SETTING', payload: { key: 'dailyReminder', value: zustandState.dailyReminder } });
      dispatch({ type: 'UPDATE_NOTIFICATION_SETTING', payload: { key: 'customNotificationTimes', value: zustandState.customNotificationTimes } });
      dispatch({ type: 'SET_SELECTED_DECK', payload: zustandState.selectedDeckId });
      dispatch({ type: 'UPDATE_NOTIFICATION_SETTING', payload: { key: 'autoSaveReadings', value: zustandState.autoSaveReadings } });
      dispatch({ type: 'SET_THEME', payload: zustandState.theme });
      dispatch({ type: 'UPDATE_NOTIFICATION_SETTING', payload: { key: 'adRemovalPurchased', value: zustandState.adRemovalPurchased } });
      dispatch({ type: 'SET_PURCHASED_DECKS', payload: zustandState.purchasedDecks });
    };

    // 초기 동기화
    syncFromZustand();

    // Zustand 상태 변경 구독
    const unsubscribe = zustandStore.subscribe(syncFromZustand);
    return unsubscribe;
  }, [zustandStore]);

  // 설정 로드
  const loadSettings = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      await settingsActions.loadSettings();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '설정을 불러올 수 없습니다.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // 설정 업데이트 (일반)
  const updateSetting = useCallback(async <K extends keyof SettingsContextState>(
    key: K, 
    value: SettingsContextState[K]
  ) => {
    try {
      await settingsActions.updateSetting(key as any, value);
      dispatch({ type: 'UPDATE_NOTIFICATION_SETTING', payload: { key, value } });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '설정을 저장할 수 없습니다.' });
    }
  }, []);

  // 기본값으로 재설정
  const resetToDefaults = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await settingsActions.resetToDefaults();
      dispatch({ type: 'RESET_SETTINGS' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '기본값 복원에 실패했습니다.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // 알림 토글
  const toggleNotifications = useCallback(async (enabled: boolean) => {
    await updateSetting('notificationsEnabled', enabled);
  }, [updateSetting]);

  const toggleHourlyNotifications = useCallback(async (enabled: boolean) => {
    await updateSetting('hourlyNotifications', enabled);
  }, [updateSetting]);

  const toggleDailyReminder = useCallback(async (enabled: boolean) => {
    await updateSetting('dailyReminder', enabled);
  }, [updateSetting]);

  // 알림 시간 관리
  const addNotificationTime = useCallback(async (hour: number) => {
    try {
      await settingsActions.addNotificationTime(hour);
      dispatch({ type: 'ADD_NOTIFICATION_TIME', payload: hour });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '알림 시간을 추가할 수 없습니다.' });
    }
  }, []);

  const removeNotificationTime = useCallback(async (hour: number) => {
    try {
      await settingsActions.removeNotificationTime(hour);
      dispatch({ type: 'REMOVE_NOTIFICATION_TIME', payload: hour });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '알림 시간을 제거할 수 없습니다.' });
    }
  }, []);

  // 테마 및 언어
  const setTheme = useCallback(async (theme: 'light' | 'dark') => {
    await updateSetting('theme', theme);
  }, [updateSetting]);

  const setLanguage = useCallback(async (language: 'ko' | 'en') => {
    await updateSetting('language', language);
  }, [updateSetting]);

  // 덱 설정
  const setSelectedDeck = useCallback(async (deckId: string) => {
    await updateSetting('selectedDeckId', deckId);
  }, [updateSetting]);

  // 프리미엄 기능
  const purchaseDeck = useCallback(async (deckId: string) => {
    try {
      await settingsActions.purchaseDeck(deckId);
      dispatch({ 
        type: 'SET_PURCHASED_DECKS', 
        payload: [...state.purchasedDecks, deckId] 
      });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '덱 구매에 실패했습니다.' });
    }
  }, [state.purchasedDecks]);

  const restorePurchases = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      await settingsActions.restorePurchases();
      // Zustand 상태가 업데이트되면 자동으로 동기화됨
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: '구매 복원에 실패했습니다.' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // 유틸리티 함수들
  const isDeckPurchased = useCallback((deckId: string) => 
    state.purchasedDecks.includes(deckId), [state.purchasedDecks]);

  const getNotificationTimes = useCallback(() => 
    [...state.customNotificationTimes].sort((a, b) => a - b), [state.customNotificationTimes]);

  const contextValue: SettingsContextType = {
    state,
    dispatch,
    loadSettings,
    updateSetting,
    resetToDefaults,
    toggleNotifications,
    toggleHourlyNotifications,
    toggleDailyReminder,
    addNotificationTime,
    removeNotificationTime,
    setTheme,
    setLanguage,
    setSelectedDeck,
    purchaseDeck,
    restorePurchases,
    isDeckPurchased,
    getNotificationTimes,
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
}

// 커스텀 훅
export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

// 개별 상태 접근 훅들
export function useSettingsState() {
  const { state } = useSettings();
  return state;
}

export function useSettingsActions() {
  const { 
    loadSettings,
    updateSetting,
    resetToDefaults,
    toggleNotifications,
    toggleHourlyNotifications,
    toggleDailyReminder,
    addNotificationTime,
    removeNotificationTime,
    setTheme,
    setLanguage,
    setSelectedDeck,
    purchaseDeck,
    restorePurchases
  } = useSettings();
  
  return {
    loadSettings,
    updateSetting,
    resetToDefaults,
    toggleNotifications,
    toggleHourlyNotifications,
    toggleDailyReminder,
    addNotificationTime,
    removeNotificationTime,
    setTheme,
    setLanguage,
    setSelectedDeck,
    purchaseDeck,
    restorePurchases,
  };
}

export function useNotificationSettings() {
  const { state, isDeckPurchased, getNotificationTimes } = useSettings();
  return {
    notificationsEnabled: state.notificationsEnabled,
    hourlyNotifications: state.hourlyNotifications,
    dailyReminder: state.dailyReminder,
    customNotificationTimes: getNotificationTimes(),
    isDeckPurchased,
  };
}

export default SettingsContext;