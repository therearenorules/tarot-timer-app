/**
 * Data Context - 데이터 관리 및 백엔드 연동
 * 타로, 저널, 사용자 데이터와 동기화 상태 관리
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
  DataContextState, 
  BaseProviderProps, 
  AsyncAction,
  AsyncState,
  SyncState,
  SyncOperation,
  StateReducer
} from '../types/state';

// ===== ACTION TYPES =====
interface DataAction extends AsyncAction {
  type: 
    | 'FETCH_START'
    | 'FETCH_SUCCESS'
    | 'FETCH_ERROR'
    | 'UPDATE_START'
    | 'UPDATE_SUCCESS' 
    | 'UPDATE_ERROR'
    | 'SYNC_START'
    | 'SYNC_SUCCESS'
    | 'SYNC_ERROR'
    | 'SET_ONLINE'
    | 'ADD_PENDING_CHANGE'
    | 'REMOVE_PENDING_CHANGE'
    | 'CLEAR_PENDING'
    | 'RESET_ENTITY'
    | 'RESET_ALL';
  entity?: 'tarot' | 'journal' | 'user';
}

// ===== INITIAL STATE =====
const createAsyncState = <T = any>(): AsyncState<T> => ({
  data: undefined,
  isLoading: false,
  error: null,
  lastUpdated: undefined,
});

const initialSyncState: SyncState = {
  isOnline: true,
  isSyncing: false,
  lastSyncTime: undefined,
  pendingChanges: 0,
  syncError: undefined,
};

const initialState: DataContextState = {
  tarot: createAsyncState(),
  journal: createAsyncState(),
  user: createAsyncState(),
  sync: initialSyncState,
};

// ===== REDUCER =====
const dataReducer: StateReducer<DataContextState, DataAction> = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
    case 'UPDATE_START':
      return {
        ...state,
        [action.entity!]: {
          ...state[action.entity!],
          isLoading: true,
          error: null,
        },
      };

    case 'FETCH_SUCCESS':
    case 'UPDATE_SUCCESS':
      return {
        ...state,
        [action.entity!]: {
          ...state[action.entity!],
          data: action.payload,
          isLoading: false,
          error: null,
          lastUpdated: new Date(),
        },
      };

    case 'FETCH_ERROR':
    case 'UPDATE_ERROR':
      return {
        ...state,
        [action.entity!]: {
          ...state[action.entity!],
          isLoading: false,
          error: action.error || null,
        },
      };

    case 'SYNC_START':
      return {
        ...state,
        sync: {
          ...state.sync,
          isSyncing: true,
          syncError: undefined,
        },
      };

    case 'SYNC_SUCCESS':
      return {
        ...state,
        sync: {
          ...state.sync,
          isSyncing: false,
          lastSyncTime: new Date(),
          pendingChanges: 0,
        },
      };

    case 'SYNC_ERROR':
      return {
        ...state,
        sync: {
          ...state.sync,
          isSyncing: false,
          syncError: action.error,
        },
      };

    case 'SET_ONLINE':
      return {
        ...state,
        sync: {
          ...state.sync,
          isOnline: action.payload,
        },
      };

    case 'ADD_PENDING_CHANGE':
      return {
        ...state,
        sync: {
          ...state.sync,
          pendingChanges: state.sync.pendingChanges + 1,
        },
      };

    case 'REMOVE_PENDING_CHANGE':
      return {
        ...state,
        sync: {
          ...state.sync,
          pendingChanges: Math.max(0, state.sync.pendingChanges - 1),
        },
      };

    case 'CLEAR_PENDING':
      return {
        ...state,
        sync: {
          ...state.sync,
          pendingChanges: 0,
        },
      };

    case 'RESET_ENTITY':
      return {
        ...state,
        [action.entity!]: createAsyncState(),
      };

    case 'RESET_ALL':
      return initialState;

    default:
      return state;
  }
};

// ===== CONTEXT =====
interface DataContextValue {
  state: DataContextState;
  dispatch: React.Dispatch<DataAction>;
  
  // Data Actions
  fetchData: (entity: 'tarot' | 'journal' | 'user') => Promise<void>;
  updateData: (entity: 'tarot' | 'journal' | 'user', data: any) => Promise<void>;
  
  // Sync Actions
  syncData: () => Promise<void>;
  addPendingChange: () => void;
  clearPending: () => void;
  
  // Utility Actions
  resetEntity: (entity: 'tarot' | 'journal' | 'user') => void;
  resetAll: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

// ===== PROVIDER =====
export const DataProvider: React.FC<BaseProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);
  const syncQueueRef = useRef<SyncOperation[]>([]);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mock API functions (실제 구현에서는 실제 API 호출로 교체)
  const mockFetch = async (entity: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // 지연 시뮬레이션
    return { [entity]: `mock ${entity} data`, timestamp: new Date().toISOString() };
  };

  const mockUpdate = async (entity: string, data: any) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return { ...data, updated: new Date().toISOString() };
  };

  const mockSync = async (operations: SyncOperation[]) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { synced: operations.length, timestamp: new Date().toISOString() };
  };

  // Data Actions
  const fetchData = useCallback(async (entity: 'tarot' | 'journal' | 'user') => {
    dispatch({
      type: 'FETCH_START',
      entity,
      meta: {
        timestamp: new Date(),
        source: 'user',
      },
    });

    try {
      const data = await mockFetch(entity);
      dispatch({
        type: 'FETCH_SUCCESS',
        entity,
        payload: data,
        meta: {
          timestamp: new Date(),
          source: 'user',
        },
      });
    } catch (error) {
      dispatch({
        type: 'FETCH_ERROR',
        entity,
        error: error as Error,
        meta: {
          timestamp: new Date(),
          source: 'system',
        },
      });
    }
  }, []);

  const updateData = useCallback(async (
    entity: 'tarot' | 'journal' | 'user', 
    data: any
  ) => {
    dispatch({
      type: 'UPDATE_START',
      entity,
      meta: {
        timestamp: new Date(),
        source: 'user',
      },
    });

    try {
      const updatedData = await mockUpdate(entity, data);
      
      dispatch({
        type: 'UPDATE_SUCCESS',
        entity,
        payload: updatedData,
        meta: {
          timestamp: new Date(),
          source: 'user',
        },
      });

      // 백엔드 연동을 위한 pending change 추가
      if (state.sync.isOnline) {
        addPendingChange();
      }
    } catch (error) {
      dispatch({
        type: 'UPDATE_ERROR',
        entity,
        error: error as Error,
        meta: {
          timestamp: new Date(),
          source: 'system',
        },
      });
    }
  }, [state.sync.isOnline]);

  // Sync Actions
  const syncData = useCallback(async () => {
    if (state.sync.isSyncing || !state.sync.isOnline) {
      return;
    }

    dispatch({
      type: 'SYNC_START',
      meta: {
        timestamp: new Date(),
        source: 'system',
      },
    });

    try {
      await mockSync(syncQueueRef.current);
      syncQueueRef.current = [];
      
      dispatch({
        type: 'SYNC_SUCCESS',
        meta: {
          timestamp: new Date(),
          source: 'system',
        },
      });
    } catch (error) {
      dispatch({
        type: 'SYNC_ERROR',
        error: error as Error,
        meta: {
          timestamp: new Date(),
          source: 'system',
        },
      });
    }
  }, [state.sync.isSyncing, state.sync.isOnline]);

  const addPendingChange = useCallback(() => {
    dispatch({
      type: 'ADD_PENDING_CHANGE',
      meta: {
        timestamp: new Date(),
        source: 'system',
      },
    });
  }, []);

  const clearPending = useCallback(() => {
    syncQueueRef.current = [];
    dispatch({
      type: 'CLEAR_PENDING',
      meta: {
        timestamp: new Date(),
        source: 'user',
      },
    });
  }, []);

  // Utility Actions
  const resetEntity = useCallback((entity: 'tarot' | 'journal' | 'user') => {
    dispatch({
      type: 'RESET_ENTITY',
      entity,
      meta: {
        timestamp: new Date(),
        source: 'user',
      },
    });
  }, []);

  const resetAll = useCallback(() => {
    syncQueueRef.current = [];
    if (syncIntervalRef.current) {
      clearInterval(syncIntervalRef.current);
    }
    dispatch({
      type: 'RESET_ALL',
      meta: {
        timestamp: new Date(),
        source: 'user',
      },
    });
  }, []);

  // 네트워크 상태 모니터링
  useEffect(() => {
    const handleOnline = () => {
      dispatch({
        type: 'SET_ONLINE',
        payload: true,
        meta: {
          timestamp: new Date(),
          source: 'system',
        },
      });
    };

    const handleOffline = () => {
      dispatch({
        type: 'SET_ONLINE',
        payload: false,
        meta: {
          timestamp: new Date(),
          source: 'system',
        },
      });
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  // 자동 동기화 설정
  useEffect(() => {
    if (state.sync.isOnline && state.sync.pendingChanges > 0) {
      syncIntervalRef.current = setTimeout(() => {
        syncData();
      }, 30000); // 30초마다 동기화
    }

    return () => {
      if (syncIntervalRef.current) {
        clearTimeout(syncIntervalRef.current);
      }
    };
  }, [state.sync.isOnline, state.sync.pendingChanges, syncData]);

  const value: DataContextValue = {
    state,
    dispatch,
    fetchData,
    updateData,
    syncData,
    addPendingChange,
    clearPending,
    resetEntity,
    resetAll,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// ===== HOOKS =====
export const useData = (): DataContextValue => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

// ===== CONVENIENCE HOOKS =====
export const useDataState = () => {
  const { state } = useData();
  return state;
};

export const useDataActions = () => {
  const { 
    fetchData, 
    updateData, 
    syncData, 
    addPendingChange, 
    clearPending,
    resetEntity,
    resetAll 
  } = useData();
  return { 
    fetchData, 
    updateData, 
    syncData, 
    addPendingChange, 
    clearPending,
    resetEntity,
    resetAll 
  };
};

export const useTarotData = () => {
  const { state } = useData();
  return state.tarot;
};

export const useJournalData = () => {
  const { state } = useData();
  return state.journal;
};

export const useUserData = () => {
  const { state } = useData();
  return state.user;
};

export const useSyncState = () => {
  const { state } = useData();
  return state.sync;
};