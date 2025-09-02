/**
 * AppContext.tsx - 글로벌 애플리케이션 상태 관리 컨텍스트
 * 기존 Zustand 스토어들을 Context API로 래핑하여 점진적 마이그레이션 지원
 */

import React, { 
  createContext, 
  useContext, 
  useReducer, 
  useEffect, 
  ReactNode 
} from 'react';
import { useRootStore } from '@/stores';

// 글로벌 앱 상태 타입 정의
export interface AppState {
  // 앱 전체 상태
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  
  // 현재 활성 탭
  activeTab: string;
  
  // 사용자 설정
  theme: 'light' | 'dark';
  language: 'ko' | 'en';
  
  // 네트워크 상태
  isOnline: boolean;
}

// 액션 타입 정의
export type AppAction =
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'SET_LANGUAGE'; payload: 'ko' | 'en' }
  | { type: 'SET_ONLINE'; payload: boolean }
  | { type: 'RESET_STATE' };

// 초기 상태
const initialState: AppState = {
  isInitialized: false,
  isLoading: false,
  error: null,
  activeTab: 'timer',
  theme: 'light',
  language: 'ko',
  isOnline: true,
};

// 리듀서 함수
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_INITIALIZED':
      return { ...state, isInitialized: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_ONLINE':
      return { ...state, isOnline: action.payload };
    case 'RESET_STATE':
      return { ...initialState };
    default:
      return state;
  }
}

// 컨텍스트 타입 정의
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  
  // 편의 액션들
  setInitialized: (initialized: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setActiveTab: (tab: string) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (language: 'ko' | 'en') => void;
  setOnline: (online: boolean) => void;
  resetState: () => void;
  
  // Zustand 스토어 접근 (하이브리드 지원)
  rootStore: ReturnType<typeof useRootStore>;
}

// 컨텍스트 생성
const AppContext = createContext<AppContextType | null>(null);

// Provider 컴포넌트
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const rootStore = useRootStore();

  // 편의 액션 함수들
  const setInitialized = (initialized: boolean) => 
    dispatch({ type: 'SET_INITIALIZED', payload: initialized });
    
  const setLoading = (loading: boolean) => 
    dispatch({ type: 'SET_LOADING', payload: loading });
    
  const setError = (error: string | null) => 
    dispatch({ type: 'SET_ERROR', payload: error });
    
  const setActiveTab = (tab: string) => 
    dispatch({ type: 'SET_ACTIVE_TAB', payload: tab });
    
  const setTheme = (theme: 'light' | 'dark') => 
    dispatch({ type: 'SET_THEME', payload: theme });
    
  const setLanguage = (language: 'ko' | 'en') => 
    dispatch({ type: 'SET_LANGUAGE', payload: language });
    
  const setOnline = (online: boolean) => 
    dispatch({ type: 'SET_ONLINE', payload: online });
    
  const resetState = () => dispatch({ type: 'RESET_STATE' });

  // Zustand 스토어와 동기화
  useEffect(() => {
    // 루트 스토어 초기화 상태 동기화
    setInitialized(rootStore.isInitialized);
    setLoading(rootStore.isLoading);
    setError(rootStore.error);
  }, [rootStore.isInitialized, rootStore.isLoading, rootStore.error]);

  // 네트워크 상태 모니터링
  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const contextValue: AppContextType = {
    state,
    dispatch,
    setInitialized,
    setLoading,
    setError,
    setActiveTab,
    setTheme,
    setLanguage,
    setOnline,
    resetState,
    rootStore,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

// 커스텀 훅
export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}

// 개별 상태 접근 훅들 (성능 최적화)
export function useAppState() {
  const { state } = useAppContext();
  return state;
}

export function useAppActions() {
  const { 
    setInitialized, 
    setLoading, 
    setError, 
    setActiveTab, 
    setTheme, 
    setLanguage, 
    setOnline, 
    resetState 
  } = useAppContext();
  
  return {
    setInitialized,
    setLoading,
    setError,
    setActiveTab,
    setTheme,
    setLanguage,
    setOnline,
    resetState,
  };
}

// 하이브리드 모드: Zustand 스토어 접근
export function useZustandStore() {
  const { rootStore } = useAppContext();
  return rootStore;
}

export default AppContext;