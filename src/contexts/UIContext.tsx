/**
 * UI Context - UI 상태 및 사용자 인터페이스 관리
 * 테마, 언어, 모달, 알림, 로딩 상태 등 UI 관련 전역 상태
 */

import React, { 
  createContext, 
  useContext, 
  useReducer, 
  useCallback, 
  useEffect,
  useRef,
} from 'react';
import type { 
  UIContextState, 
  BaseProviderProps, 
  BaseAction,
  NotificationState,
  StateReducer
} from '../types/state';

// ===== ACTION TYPES =====
interface UIAction extends BaseAction {
  type: 
    | 'SET_THEME'
    | 'SET_LANGUAGE'
    | 'SET_ACTIVE_TAB'
    | 'PUSH_MODAL'
    | 'POP_MODAL'
    | 'CLEAR_MODALS'
    | 'ADD_NOTIFICATION'
    | 'REMOVE_NOTIFICATION'
    | 'CLEAR_NOTIFICATIONS'
    | 'SET_LOADING'
    | 'CLEAR_LOADING'
    | 'CLEAR_ALL_LOADING'
    | 'RESET';
}

// ===== INITIAL STATE =====
const initialState: UIContextState = {
  theme: 'light',
  language: 'ko',
  activeTab: 'timer',
  modalStack: [],
  notifications: [],
  loading: {},
};

// ===== REDUCER =====
const uiReducer: StateReducer<UIContextState, UIAction> = (state, action) => {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };

    case 'SET_LANGUAGE':
      return {
        ...state,
        language: action.payload,
      };

    case 'SET_ACTIVE_TAB':
      return {
        ...state,
        activeTab: action.payload,
      };

    case 'PUSH_MODAL':
      return {
        ...state,
        modalStack: [...state.modalStack, action.payload],
      };

    case 'POP_MODAL':
      return {
        ...state,
        modalStack: state.modalStack.slice(0, -1),
      };

    case 'CLEAR_MODALS':
      return {
        ...state,
        modalStack: [],
      };

    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };

    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        ),
      };

    case 'CLEAR_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };

    case 'SET_LOADING':
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value,
        },
      };

    case 'CLEAR_LOADING':
      const { [action.payload]: removed, ...restLoading } = state.loading;
      return {
        ...state,
        loading: restLoading,
      };

    case 'CLEAR_ALL_LOADING':
      return {
        ...state,
        loading: {},
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
};

// ===== CONTEXT =====
interface UIContextValue {
  state: UIContextState;
  dispatch: React.Dispatch<UIAction>;
  
  // Theme Actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
  
  // Language Actions
  setLanguage: (language: string) => void;
  
  // Tab Actions
  setActiveTab: (tab: string) => void;
  
  // Modal Actions
  showModal: (modalId: string) => void;
  hideModal: () => void;
  hideAllModals: () => void;
  isModalOpen: (modalId?: string) => boolean;
  
  // Notification Actions
  showNotification: (notification: Omit<NotificationState, 'id' | 'timestamp'>) => void;
  hideNotification: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Loading Actions
  setLoading: (key: string, loading: boolean) => void;
  isLoading: (key?: string) => boolean;
  clearAllLoading: () => void;
  
  // Utility Actions
  reset: () => void;
}

const UIContext = createContext<UIContextValue | null>(null);

// ===== PROVIDER =====
export const UIProvider: React.FC<BaseProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, initialState);
  const notificationTimeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Theme Actions
  const setTheme = useCallback((theme: 'light' | 'dark' | 'system') => {
    dispatch({
      type: 'SET_THEME',
      payload: theme,
      meta: {
        timestamp: new Date(),
        source: 'user',
      },
    });
    
    // 시스템 설정에 저장 (localStorage 등)
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const currentTheme = state.theme;
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [state.theme, setTheme]);

  // Language Actions
  const setLanguage = useCallback((language: string) => {
    dispatch({
      type: 'SET_LANGUAGE',
      payload: language,
      meta: {
        timestamp: new Date(),
        source: 'user',
      },
    });
    
    // 시스템 설정에 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
    }
  }, []);

  // Tab Actions
  const setActiveTab = useCallback((tab: string) => {
    dispatch({
      type: 'SET_ACTIVE_TAB',
      payload: tab,
      meta: {
        timestamp: new Date(),
        source: 'user',
      },
    });
  }, []);

  // Modal Actions
  const showModal = useCallback((modalId: string) => {
    dispatch({
      type: 'PUSH_MODAL',
      payload: modalId,
      meta: {
        timestamp: new Date(),
        source: 'user',
      },
    });
  }, []);

  const hideModal = useCallback(() => {
    dispatch({
      type: 'POP_MODAL',
      meta: {
        timestamp: new Date(),
        source: 'user',
      },
    });
  }, []);

  const hideAllModals = useCallback(() => {
    dispatch({
      type: 'CLEAR_MODALS',
      meta: {
        timestamp: new Date(),
        source: 'user',
      },
    });
  }, []);

  const isModalOpen = useCallback((modalId?: string) => {
    if (!modalId) {
      return state.modalStack.length > 0;
    }
    return state.modalStack.includes(modalId);
  }, [state.modalStack]);

  // Notification Actions
  const showNotification = useCallback((
    notification: Omit<NotificationState, 'id' | 'timestamp'>
  ) => {
    const id = `notification-${Date.now()}-${Math.random()}`;
    const fullNotification: NotificationState = {
      ...notification,
      id,
      timestamp: new Date(),
    };

    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: fullNotification,
      meta: {
        timestamp: new Date(),
        source: 'system',
      },
    });

    // 자동 제거 타이머 설정
    if (notification.duration !== undefined && notification.duration > 0) {
      const timeoutId = setTimeout(() => {
        hideNotification(id);
      }, notification.duration);
      
      notificationTimeoutsRef.current.set(id, timeoutId);
    }
  }, []);

  const hideNotification = useCallback((id: string) => {
    // 타이머 정리
    const timeoutId = notificationTimeoutsRef.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      notificationTimeoutsRef.current.delete(id);
    }

    dispatch({
      type: 'REMOVE_NOTIFICATION',
      payload: id,
      meta: {
        timestamp: new Date(),
        source: 'user',
      },
    });
  }, []);

  const clearAllNotifications = useCallback(() => {
    // 모든 타이머 정리
    notificationTimeoutsRef.current.forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
    notificationTimeoutsRef.current.clear();

    dispatch({
      type: 'CLEAR_NOTIFICATIONS',
      meta: {
        timestamp: new Date(),
        source: 'user',
      },
    });
  }, []);

  // Loading Actions
  const setLoading = useCallback((key: string, loading: boolean) => {
    if (loading) {
      dispatch({
        type: 'SET_LOADING',
        payload: { key, value: loading },
        meta: {
          timestamp: new Date(),
          source: 'system',
        },
      });
    } else {
      dispatch({
        type: 'CLEAR_LOADING',
        payload: key,
        meta: {
          timestamp: new Date(),
          source: 'system',
        },
      });
    }
  }, []);

  const isLoading = useCallback((key?: string) => {
    if (!key) {
      return Object.keys(state.loading).length > 0;
    }
    return Boolean(state.loading[key]);
  }, [state.loading]);

  const clearAllLoading = useCallback(() => {
    dispatch({
      type: 'CLEAR_ALL_LOADING',
      meta: {
        timestamp: new Date(),
        source: 'system',
      },
    });
  }, []);

  // Utility Actions
  const reset = useCallback(() => {
    // 모든 타이머 정리
    notificationTimeoutsRef.current.forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
    notificationTimeoutsRef.current.clear();

    dispatch({
      type: 'RESET',
      meta: {
        timestamp: new Date(),
        source: 'user',
      },
    });
  }, []);

  // 시스템 설정에서 초기 테마/언어 로드
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system';
      const savedLanguage = localStorage.getItem('language');
      
      if (savedTheme) {
        setTheme(savedTheme);
      }
      
      if (savedLanguage) {
        setLanguage(savedLanguage);
      }
    }
  }, [setTheme, setLanguage]);

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      notificationTimeoutsRef.current.forEach(timeoutId => {
        clearTimeout(timeoutId);
      });
    };
  }, []);

  const value: UIContextValue = {
    state,
    dispatch,
    setTheme,
    toggleTheme,
    setLanguage,
    setActiveTab,
    showModal,
    hideModal,
    hideAllModals,
    isModalOpen,
    showNotification,
    hideNotification,
    clearAllNotifications,
    setLoading,
    isLoading,
    clearAllLoading,
    reset,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};

// ===== HOOKS =====
export const useUI = (): UIContextValue => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within UIProvider');
  }
  return context;
};

// ===== CONVENIENCE HOOKS =====
export const useUIState = () => {
  const { state } = useUI();
  return state;
};

export const useTheme = () => {
  const { state, setTheme, toggleTheme } = useUI();
  return { 
    theme: state.theme, 
    setTheme, 
    toggleTheme 
  };
};

export const useLanguage = () => {
  const { state, setLanguage } = useUI();
  return { 
    language: state.language, 
    setLanguage 
  };
};

export const useActiveTab = () => {
  const { state, setActiveTab } = useUI();
  return { 
    activeTab: state.activeTab, 
    setActiveTab 
  };
};

export const useModal = () => {
  const { state, showModal, hideModal, hideAllModals, isModalOpen } = useUI();
  return { 
    modalStack: state.modalStack,
    showModal, 
    hideModal, 
    hideAllModals, 
    isModalOpen 
  };
};

export const useNotifications = () => {
  const { 
    state, 
    showNotification, 
    hideNotification, 
    clearAllNotifications 
  } = useUI();
  return { 
    notifications: state.notifications,
    showNotification, 
    hideNotification, 
    clearAllNotifications 
  };
};

export const useLoading = () => {
  const { state, setLoading, isLoading, clearAllLoading } = useUI();
  return { 
    loading: state.loading,
    setLoading, 
    isLoading, 
    clearAllLoading 
  };
};