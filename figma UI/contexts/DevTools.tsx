/**
 * Development Tools - 디버깅 및 개발 지원 도구
 * Context API 상태 관리 디버깅, 성능 모니터링, 개발 편의 기능
 */

import React, { 
  createContext, 
  useContext, 
  useState, 
  useCallback, 
  useEffect,
  useRef,
  ReactNode
} from 'react';
import { useError, useLoading } from './';

// ===== DEV TOOLS TYPES =====
interface LogEntry {
  id: string;
  timestamp: Date;
  level: 'debug' | 'info' | 'warn' | 'error';
  category: 'state' | 'action' | 'effect' | 'render' | 'network' | 'user';
  message: string;
  data?: any;
  stack?: string;
}

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  data?: any;
}

interface DevToolsState {
  isEnabled: boolean;
  isVisible: boolean;
  logs: LogEntry[];
  performance: PerformanceMetric[];
  stateSnapshots: Array<{
    timestamp: Date;
    state: any;
    action?: string;
  }>;
  settings: {
    maxLogs: number;
    logLevel: LogEntry['level'];
    enableStateTracking: boolean;
    enablePerformanceTracking: boolean;
    enableNetworkTracking: boolean;
  };
}

// ===== CONTEXT =====
interface DevToolsContextValue {
  state: DevToolsState;
  
  // Logging
  log: (level: LogEntry['level'], category: LogEntry['category'], message: string, data?: any) => void;
  clearLogs: () => void;
  
  // Performance
  startPerformance: (name: string, data?: any) => string;
  endPerformance: (id: string) => void;
  clearPerformance: () => void;
  
  // State tracking
  trackState: (state: any, action?: string) => void;
  clearStateSnapshots: () => void;
  
  // Visibility
  toggle: () => void;
  show: () => void;
  hide: () => void;
  
  // Settings
  updateSettings: (settings: Partial<DevToolsState['settings']>) => void;
}

const DevToolsContext = createContext<DevToolsContextValue | null>(null);

// ===== INITIAL STATE =====
const initialState: DevToolsState = {
  isEnabled: process.env.NODE_ENV === 'development',
  isVisible: false,
  logs: [],
  performance: [],
  stateSnapshots: [],
  settings: {
    maxLogs: 1000,
    logLevel: 'debug',
    enableStateTracking: true,
    enablePerformanceTracking: true,
    enableNetworkTracking: true,
  },
};

// ===== PROVIDER =====
export const DevToolsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DevToolsState>(initialState);
  const performanceRef = useRef<Map<string, PerformanceMetric>>(new Map());

  // Logging
  const log = useCallback((
    level: LogEntry['level'],
    category: LogEntry['category'],
    message: string,
    data?: any
  ) => {
    if (!state.isEnabled) return;

    const levelPriority = { debug: 0, info: 1, warn: 2, error: 3 };
    const settingsPriority = levelPriority[state.settings.logLevel];
    const logPriority = levelPriority[level];

    if (logPriority < settingsPriority) return;

    const entry: LogEntry = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      level,
      category,
      message,
      data,
      stack: level === 'error' ? new Error().stack : undefined,
    };

    setState(prev => ({
      ...prev,
      logs: [
        ...prev.logs.slice(-(prev.settings.maxLogs - 1)),
        entry
      ],
    }));

    // Console output
    const consoleFn = console[level] || console.log;
    const prefix = `[DevTools:${category}]`;
    if (data) {
      consoleFn(prefix, message, data);
    } else {
      consoleFn(prefix, message);
    }
  }, [state.isEnabled, state.settings.logLevel, state.settings.maxLogs]);

  const clearLogs = useCallback(() => {
    setState(prev => ({
      ...prev,
      logs: [],
    }));
  }, []);

  // Performance tracking
  const startPerformance = useCallback((name: string, data?: any): string => {
    if (!state.isEnabled || !state.settings.enablePerformanceTracking) return '';

    const id = `perf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const metric: PerformanceMetric = {
      name,
      startTime: performance.now(),
      data,
    };

    performanceRef.current.set(id, metric);
    
    log('debug', 'render', `Performance tracking started: ${name}`, { id, data });
    
    return id;
  }, [state.isEnabled, state.settings.enablePerformanceTracking, log]);

  const endPerformance = useCallback((id: string) => {
    if (!state.isEnabled || !id) return;

    const metric = performanceRef.current.get(id);
    if (!metric) return;

    const endTime = performance.now();
    const duration = endTime - metric.startTime;

    const completedMetric: PerformanceMetric = {
      ...metric,
      endTime,
      duration,
    };

    performanceRef.current.delete(id);

    setState(prev => ({
      ...prev,
      performance: [
        ...prev.performance.slice(-99), // Keep last 100 metrics
        completedMetric
      ],
    }));

    log('debug', 'render', `Performance tracking ended: ${metric.name} (${duration.toFixed(2)}ms)`, {
      duration,
      data: metric.data,
    });
  }, [state.isEnabled, log]);

  const clearPerformance = useCallback(() => {
    performanceRef.current.clear();
    setState(prev => ({
      ...prev,
      performance: [],
    }));
  }, []);

  // State tracking
  const trackState = useCallback((stateData: any, action?: string) => {
    if (!state.isEnabled || !state.settings.enableStateTracking) return;

    const snapshot = {
      timestamp: new Date(),
      state: JSON.parse(JSON.stringify(stateData)), // Deep clone
      action,
    };

    setState(prev => ({
      ...prev,
      stateSnapshots: [
        ...prev.stateSnapshots.slice(-49), // Keep last 50 snapshots
        snapshot
      ],
    }));

    if (action) {
      log('debug', 'state', `State updated: ${action}`, stateData);
    }
  }, [state.isEnabled, state.settings.enableStateTracking, log]);

  const clearStateSnapshots = useCallback(() => {
    setState(prev => ({
      ...prev,
      stateSnapshots: [],
    }));
  }, []);

  // Visibility
  const toggle = useCallback(() => {
    setState(prev => ({
      ...prev,
      isVisible: !prev.isVisible,
    }));
  }, []);

  const show = useCallback(() => {
    setState(prev => ({
      ...prev,
      isVisible: true,
    }));
  }, []);

  const hide = useCallback(() => {
    setState(prev => ({
      ...prev,
      isVisible: false,
    }));
  }, []);

  // Settings
  const updateSettings = useCallback((newSettings: Partial<DevToolsState['settings']>) => {
    setState(prev => ({
      ...prev,
      settings: {
        ...prev.settings,
        ...newSettings,
      },
    }));
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl+Shift+D to toggle dev tools
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        toggle();
      }
    };

    if (state.isEnabled) {
      window.addEventListener('keydown', handleKeyPress);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [state.isEnabled, toggle]);

  const value: DevToolsContextValue = {
    state,
    log,
    clearLogs,
    startPerformance,
    endPerformance,
    clearPerformance,
    trackState,
    clearStateSnapshots,
    toggle,
    show,
    hide,
    updateSettings,
  };

  return (
    <DevToolsContext.Provider value={value}>
      {children}
      {state.isEnabled && state.isVisible && <DevToolsPanel />}
    </DevToolsContext.Provider>
  );
};

// ===== DEV TOOLS PANEL UI =====
const DevToolsPanel: React.FC = () => {
  const devTools = useDevTools();
  const errorState = useError();
  const loadingState = useLoading();
  const [activeTab, setActiveTab] = useState<'logs' | 'state' | 'performance' | 'errors' | 'loading'>('logs');

  if (!devTools.state.isVisible) return null;

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ko-KR', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 3
    });
  };

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'error': return '#ef4444';
      case 'warn': return '#f59e0b';
      case 'info': return '#3b82f6';
      case 'debug': return '#6b7280';
      default: return '#6b7280';
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50vh',
        backgroundColor: '#1f2937',
        color: '#f3f4f6',
        borderTop: '1px solid #374151',
        zIndex: 10000,
        fontFamily: 'Monaco, Consolas, "Courier New", monospace',
        fontSize: '12px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 12px',
          backgroundColor: '#111827',
          borderBottom: '1px solid #374151',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontWeight: 'bold', color: '#fbbf24' }}>🛠️ DevTools</span>
          
          <div style={{ display: 'flex', gap: '4px' }}>
            {['logs', 'state', 'performance', 'errors', 'loading'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                style={{
                  padding: '4px 8px',
                  backgroundColor: activeTab === tab ? '#374151' : 'transparent',
                  color: activeTab === tab ? '#fbbf24' : '#9ca3af',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '10px', color: '#6b7280' }}>
            Ctrl+Shift+D
          </span>
          <button
            onClick={devTools.hide}
            style={{
              backgroundColor: '#374151',
              color: '#f3f4f6',
              border: 'none',
              padding: '4px 8px',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'logs' && (
          <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#9ca3af' }}>
                {devTools.state.logs.length} logs
              </span>
              <button
                onClick={devTools.clearLogs}
                style={{
                  backgroundColor: '#374151',
                  color: '#f3f4f6',
                  border: 'none',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '10px',
                }}
              >
                Clear
              </button>
            </div>
            {devTools.state.logs.map(log => (
              <div
                key={log.id}
                style={{
                  padding: '4px 0',
                  borderBottom: '1px solid #374151',
                  fontSize: '11px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <span style={{ color: '#6b7280' }}>
                    {formatTime(log.timestamp)}
                  </span>
                  <span
                    style={{
                      color: getLevelColor(log.level),
                      fontWeight: 'bold',
                      textTransform: 'uppercase',
                    }}
                  >
                    {log.level}
                  </span>
                  <span
                    style={{
                      backgroundColor: '#374151',
                      color: '#9ca3af',
                      padding: '1px 4px',
                      borderRadius: '2px',
                      fontSize: '9px',
                    }}
                  >
                    {log.category}
                  </span>
                </div>
                <div style={{ color: '#f3f4f6' }}>
                  {log.message}
                </div>
                {log.data && (
                  <details style={{ marginTop: '4px', color: '#9ca3af' }}>
                    <summary style={{ cursor: 'pointer', fontSize: '10px' }}>
                      Data
                    </summary>
                    <pre style={{ margin: '4px 0 0 16px', fontSize: '10px', overflow: 'auto' }}>
                      {JSON.stringify(log.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'state' && (
          <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#9ca3af' }}>
                {devTools.state.stateSnapshots.length} snapshots
              </span>
              <button
                onClick={devTools.clearStateSnapshots}
                style={{
                  backgroundColor: '#374151',
                  color: '#f3f4f6',
                  border: 'none',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '10px',
                }}
              >
                Clear
              </button>
            </div>
            {devTools.state.stateSnapshots.slice().reverse().map((snapshot, index) => (
              <details
                key={index}
                style={{
                  marginBottom: '8px',
                  padding: '4px',
                  backgroundColor: '#374151',
                  borderRadius: '4px',
                }}
              >
                <summary style={{ cursor: 'pointer', color: '#fbbf24' }}>
                  {formatTime(snapshot.timestamp)}
                  {snapshot.action && (
                    <span style={{ color: '#9ca3af', marginLeft: '8px' }}>
                      - {snapshot.action}
                    </span>
                  )}
                </summary>
                <pre style={{ marginTop: '8px', fontSize: '10px', overflow: 'auto', color: '#f3f4f6' }}>
                  {JSON.stringify(snapshot.state, null, 2)}
                </pre>
              </details>
            ))}
          </div>
        )}

        {activeTab === 'performance' && (
          <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#9ca3af' }}>
                {devTools.state.performance.length} metrics
              </span>
              <button
                onClick={devTools.clearPerformance}
                style={{
                  backgroundColor: '#374151',
                  color: '#f3f4f6',
                  border: 'none',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '10px',
                }}
              >
                Clear
              </button>
            </div>
            {devTools.state.performance.slice().reverse().map((metric, index) => (
              <div
                key={index}
                style={{
                  padding: '4px 0',
                  borderBottom: '1px solid #374151',
                  fontSize: '11px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#f3f4f6' }}>
                    {metric.name}
                  </span>
                  <span
                    style={{
                      color: metric.duration! < 100 ? '#10b981' : metric.duration! < 500 ? '#f59e0b' : '#ef4444',
                      fontWeight: 'bold',
                    }}
                  >
                    {metric.duration?.toFixed(2)}ms
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'errors' && (
          <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
            <div style={{ marginBottom: '8px', color: '#9ca3af' }}>
              {errorState.state.errors.length} errors
            </div>
            {errorState.state.errors.map(error => (
              <div
                key={error.id}
                style={{
                  padding: '8px',
                  marginBottom: '8px',
                  backgroundColor: '#374151',
                  borderRadius: '4px',
                  borderLeft: `4px solid ${error.severity === 'critical' ? '#ef4444' : error.severity === 'high' ? '#f59e0b' : '#6b7280'}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>
                    {error.type}
                  </span>
                  <span style={{ color: '#6b7280', fontSize: '10px' }}>
                    {formatTime(error.timestamp)}
                  </span>
                </div>
                <div style={{ color: '#f3f4f6', marginBottom: '4px' }}>
                  {error.message}
                </div>
                {error.metadata && (
                  <pre style={{ fontSize: '10px', color: '#9ca3af', overflow: 'auto' }}>
                    {JSON.stringify(error.metadata, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'loading' && (
          <div style={{ flex: 1, overflow: 'auto', padding: '8px' }}>
            <div style={{ marginBottom: '8px', color: '#9ca3af' }}>
              {loadingState.state.activeCount} active operations
            </div>
            {Object.values(loadingState.state.items).map(item => (
              <div
                key={item.id}
                style={{
                  padding: '8px',
                  marginBottom: '8px',
                  backgroundColor: '#374151',
                  borderRadius: '4px',
                  borderLeft: `4px solid ${
                    item.priority === 'critical' ? '#ef4444' : 
                    item.priority === 'high' ? '#f59e0b' : 
                    item.priority === 'medium' ? '#3b82f6' : '#6b7280'
                  }`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>
                    {item.title}
                  </span>
                  <span style={{ color: '#6b7280', fontSize: '10px' }}>
                    {item.priority}
                  </span>
                </div>
                {item.description && (
                  <div style={{ color: '#9ca3af', marginBottom: '4px', fontSize: '10px' }}>
                    {item.description}
                  </div>
                )}
                {typeof item.progress === 'number' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        flex: 1,
                        height: '4px',
                        backgroundColor: '#4b5563',
                        borderRadius: '2px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${item.progress}%`,
                          height: '100%',
                          backgroundColor: '#3b82f6',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                    <span style={{ color: '#9ca3af', fontSize: '10px' }}>
                      {item.progress}%
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ===== HOOKS =====
export const useDevTools = (): DevToolsContextValue => {
  const context = useContext(DevToolsContext);
  if (!context) {
    throw new Error('useDevTools must be used within DevToolsProvider');
  }
  return context;
};

// ===== PERFORMANCE HOOKS =====
export const usePerformanceTracking = (name: string, dependencies: any[] = []) => {
  const { startPerformance, endPerformance } = useDevTools();
  const performanceIdRef = useRef<string>();

  useEffect(() => {
    performanceIdRef.current = startPerformance(name);
    
    return () => {
      if (performanceIdRef.current) {
        endPerformance(performanceIdRef.current);
      }
    };
  }, dependencies);
};

// ===== STATE TRACKING HOOK =====
export const useStateTracking = (state: any, actionName?: string) => {
  const { trackState } = useDevTools();
  
  useEffect(() => {
    trackState(state, actionName);
  }, [state, actionName, trackState]);
};