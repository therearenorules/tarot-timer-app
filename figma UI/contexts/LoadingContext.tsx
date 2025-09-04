/**
 * Loading Context - 전역 로딩 상태 및 진행률 관리
 * 다중 로딩 상태, 진행률 추적, 우선순위 기반 로딩 표시
 */

import React, { 
  createContext, 
  useContext, 
  useReducer, 
  useCallback,
  useEffect,
  useRef,
  ReactNode
} from 'react';

// ===== LOADING TYPES =====
export interface LoadingItem {
  id: string;
  key: string;
  title: string;
  description?: string;
  progress?: number; // 0-100
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  timeout?: number; // ms
  cancellable?: boolean;
  onCancel?: () => void;
}

export interface LoadingContextState {
  items: Record<string, LoadingItem>;
  activeCount: number;
  highestPriority?: LoadingItem['priority'];
  globalProgress?: number;
  isBlocking: boolean; // critical priority items
}

// ===== ACTION TYPES =====
interface LoadingAction {
  type: 
    | 'START_LOADING'
    | 'UPDATE_PROGRESS'
    | 'FINISH_LOADING'
    | 'CANCEL_LOADING'
    | 'TIMEOUT_LOADING'
    | 'CLEAR_ALL';
  payload?: any;
}

// ===== INITIAL STATE =====
const initialState: LoadingContextState = {
  items: {},
  activeCount: 0,
  isBlocking: false,
};

// ===== REDUCER =====
const loadingReducer = (state: LoadingContextState, action: LoadingAction): LoadingContextState => {
  switch (action.type) {
    case 'START_LOADING': {
      const item = action.payload as LoadingItem;
      const newItems = {
        ...state.items,
        [item.id]: item,
      };

      const priorities = Object.values(newItems).map(item => item.priority);
      const highestPriority = getHighestPriority(priorities);
      const isBlocking = priorities.includes('critical');

      return {
        ...state,
        items: newItems,
        activeCount: Object.keys(newItems).length,
        highestPriority,
        isBlocking,
        globalProgress: calculateGlobalProgress(newItems),
      };
    }

    case 'UPDATE_PROGRESS': {
      const { id, progress } = action.payload;
      const item = state.items[id];
      
      if (!item) return state;

      const newItems = {
        ...state.items,
        [id]: { ...item, progress },
      };

      return {
        ...state,
        items: newItems,
        globalProgress: calculateGlobalProgress(newItems),
      };
    }

    case 'FINISH_LOADING':
    case 'CANCEL_LOADING':
    case 'TIMEOUT_LOADING': {
      const { id } = action.payload;
      const { [id]: removed, ...remainingItems } = state.items;

      if (!removed) return state;

      const priorities = Object.values(remainingItems).map(item => item.priority);
      const highestPriority = getHighestPriority(priorities);
      const isBlocking = priorities.includes('critical');

      return {
        ...state,
        items: remainingItems,
        activeCount: Object.keys(remainingItems).length,
        highestPriority,
        isBlocking,
        globalProgress: calculateGlobalProgress(remainingItems),
      };
    }

    case 'CLEAR_ALL':
      return initialState;

    default:
      return state;
  }
};

// ===== UTILITY FUNCTIONS =====
const getHighestPriority = (priorities: LoadingItem['priority'][]): LoadingItem['priority'] | undefined => {
  if (priorities.includes('critical')) return 'critical';
  if (priorities.includes('high')) return 'high';
  if (priorities.includes('medium')) return 'medium';
  if (priorities.includes('low')) return 'low';
  return undefined;
};

const calculateGlobalProgress = (items: Record<string, LoadingItem>): number => {
  const itemsArray = Object.values(items);
  if (itemsArray.length === 0) return 100;

  const totalProgress = itemsArray.reduce((sum, item) => {
    return sum + (item.progress || 0);
  }, 0);

  return Math.round(totalProgress / itemsArray.length);
};

// ===== CONTEXT =====
interface LoadingContextValue {
  state: LoadingContextState;
  
  // Actions
  startLoading: (
    key: string, 
    options?: Partial<Omit<LoadingItem, 'id' | 'key' | 'timestamp'>>
  ) => string;
  updateProgress: (id: string, progress: number) => void;
  finishLoading: (id: string) => void;
  cancelLoading: (id: string) => void;
  clearAll: () => void;
  
  // Queries
  isLoading: (key?: string) => boolean;
  getProgress: (key?: string) => number;
  getLoadingItem: (key: string) => LoadingItem | undefined;
}

const LoadingContext = createContext<LoadingContextValue | null>(null);

// ===== PROVIDER =====
export const LoadingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(loadingReducer, initialState);
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map());

  // Start loading
  const startLoading = useCallback((
    key: string,
    options: Partial<Omit<LoadingItem, 'id' | 'key' | 'timestamp'>> = {}
  ): string => {
    const id = `${key}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const item: LoadingItem = {
      id,
      key,
      title: options.title || '로딩 중...',
      description: options.description,
      progress: options.progress || 0,
      priority: options.priority || 'medium',
      timestamp: new Date(),
      timeout: options.timeout,
      cancellable: options.cancellable,
      onCancel: options.onCancel,
    };

    dispatch({
      type: 'START_LOADING',
      payload: item,
    });

    // Set timeout if specified
    if (item.timeout) {
      const timeoutId = setTimeout(() => {
        dispatch({
          type: 'TIMEOUT_LOADING',
          payload: { id },
        });
        timeoutsRef.current.delete(id);
      }, item.timeout);
      
      timeoutsRef.current.set(id, timeoutId);
    }

    return id;
  }, []);

  // Update progress
  const updateProgress = useCallback((id: string, progress: number) => {
    dispatch({
      type: 'UPDATE_PROGRESS',
      payload: { id, progress: Math.max(0, Math.min(100, progress)) },
    });
  }, []);

  // Finish loading
  const finishLoading = useCallback((id: string) => {
    // Clear timeout
    const timeoutId = timeoutsRef.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutsRef.current.delete(id);
    }

    dispatch({
      type: 'FINISH_LOADING',
      payload: { id },
    });
  }, []);

  // Cancel loading
  const cancelLoading = useCallback((id: string) => {
    const item = Object.values(state.items).find(item => item.id === id);
    
    if (item?.onCancel) {
      item.onCancel();
    }

    // Clear timeout
    const timeoutId = timeoutsRef.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutsRef.current.delete(id);
    }

    dispatch({
      type: 'CANCEL_LOADING',
      payload: { id },
    });
  }, [state.items]);

  // Clear all
  const clearAll = useCallback(() => {
    // Clear all timeouts
    timeoutsRef.current.forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
    timeoutsRef.current.clear();

    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  // Queries
  const isLoading = useCallback((key?: string) => {
    if (!key) {
      return state.activeCount > 0;
    }
    return Object.values(state.items).some(item => item.key === key);
  }, [state.items, state.activeCount]);

  const getProgress = useCallback((key?: string) => {
    if (!key) {
      return state.globalProgress || 0;
    }
    
    const item = Object.values(state.items).find(item => item.key === key);
    return item?.progress || 0;
  }, [state.items, state.globalProgress]);

  const getLoadingItem = useCallback((key: string) => {
    return Object.values(state.items).find(item => item.key === key);
  }, [state.items]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(timeoutId => {
        clearTimeout(timeoutId);
      });
    };
  }, []);

  const value: LoadingContextValue = {
    state,
    startLoading,
    updateProgress,
    finishLoading,
    cancelLoading,
    clearAll,
    isLoading,
    getProgress,
    getLoadingItem,
  };

  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
};

// ===== LOADING UI COMPONENT =====
export const LoadingOverlay: React.FC = () => {
  const { state } = useLoading();
  
  if (state.activeCount === 0) {
    return null;
  }

  const primaryItem = Object.values(state.items)
    .sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    })[0];

  if (!primaryItem) {
    return null;
  }

  const showBlocking = state.isBlocking;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: showBlocking 
          ? 'rgba(0, 0, 0, 0.8)' 
          : 'rgba(255, 255, 255, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '90%',
        }}
      >
        {/* Loading Spinner */}
        <div
          style={{
            width: '48px',
            height: '48px',
            margin: '0 auto 1.5rem',
            borderRadius: '50%',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #3182ce',
            animation: 'spin 1s linear infinite',
          }}
        />

        {/* Title */}
        <h3
          style={{
            margin: '0 0 0.5rem',
            fontSize: '1.25rem',
            fontWeight: '600',
            color: '#2d3748',
          }}
        >
          {primaryItem.title}
        </h3>

        {/* Description */}
        {primaryItem.description && (
          <p
            style={{
              margin: '0 0 1.5rem',
              color: '#718096',
              fontSize: '0.9rem',
            }}
          >
            {primaryItem.description}
          </p>
        )}

        {/* Progress Bar */}
        {typeof primaryItem.progress === 'number' && (
          <div
            style={{
              marginBottom: '1rem',
            }}
          >
            <div
              style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#e2e8f0',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '0.5rem',
              }}
            >
              <div
                style={{
                  width: `${primaryItem.progress}%`,
                  height: '100%',
                  backgroundColor: '#3182ce',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
            <div
              style={{
                fontSize: '0.8rem',
                color: '#718096',
              }}
            >
              {primaryItem.progress}%
            </div>
          </div>
        )}

        {/* Multiple items indicator */}
        {state.activeCount > 1 && (
          <div
            style={{
              fontSize: '0.8rem',
              color: '#718096',
              marginTop: '1rem',
            }}
          >
            {state.activeCount}개 작업 진행 중
          </div>
        )}

        {/* Cancel button */}
        {primaryItem.cancellable && primaryItem.onCancel && (
          <button
            onClick={() => cancelLoading(primaryItem.id)}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              backgroundColor: 'transparent',
              color: '#e53e3e',
              border: '1px solid #e53e3e',
              borderRadius: '6px',
              fontSize: '0.9rem',
              cursor: 'pointer',
            }}
          >
            취소
          </button>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

// ===== HOOKS =====
export const useLoading = (): LoadingContextValue => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
};

// ===== CONVENIENCE HOOKS =====
export const useLoadingState = () => {
  const { state } = useLoading();
  return state;
};

export const useLoadingActions = () => {
  const { 
    startLoading, 
    updateProgress, 
    finishLoading, 
    cancelLoading, 
    clearAll 
  } = useLoading();
  return { 
    startLoading, 
    updateProgress, 
    finishLoading, 
    cancelLoading, 
    clearAll 
  };
};

// ===== ASYNC LOADING HOOK =====
export const useAsyncLoading = () => {
  const { startLoading, finishLoading, updateProgress } = useLoading();

  const executeWithLoading = useCallback(async <T>(
    key: string,
    asyncFn: (updateProgress?: (progress: number) => void) => Promise<T>,
    options?: Partial<Omit<LoadingItem, 'id' | 'key' | 'timestamp'>>
  ): Promise<T> => {
    const loadingId = startLoading(key, options);

    try {
      const progressUpdater = (progress: number) => updateProgress(loadingId, progress);
      const result = await asyncFn(progressUpdater);
      return result;
    } finally {
      finishLoading(loadingId);
    }
  }, [startLoading, finishLoading, updateProgress]);

  return { executeWithLoading };
};