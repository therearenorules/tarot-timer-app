/**
 * 상태 관리 타입 정의
 * Context API와 Zustand 통합을 위한 타입 시스템
 */

import type { ReactNode } from 'react';

// ===== BASE STATE TYPES =====

export interface LoadingState {
  isLoading: boolean;
  loadingMessage?: string;
}

export interface ErrorState {
  error: Error | null;
  errorMessage?: string;
}

export interface AsyncState<T = any> extends LoadingState, ErrorState {
  data?: T;
  lastUpdated?: Date;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

// ===== SYNC STATES =====

export interface SyncState {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime?: Date;
  pendingChanges: number;
  syncError?: Error;
}

export interface CacheState<T = any> {
  data: T;
  timestamp: Date;
  expiry?: Date;
  isStale: boolean;
}

// ===== CONTEXT PROVIDER TYPES =====

export interface BaseProviderProps {
  children: ReactNode;
}

export interface AppContextState {
  isInitialized: boolean;
  version: string;
  environment: 'development' | 'production' | 'test';
}

export interface DataContextState {
  tarot: AsyncState<any>;
  journal: AsyncState<any>;
  user: AsyncState<any>;
  sync: SyncState;
}

export interface UIContextState {
  theme: 'light' | 'dark' | 'system';
  language: string;
  activeTab: string;
  modalStack: string[];
  notifications: NotificationState[];
  loading: Record<string, boolean>;
}

export interface NotificationState {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  timestamp: Date;
}

// ===== ACTION TYPES =====

export interface BaseAction<T = any> {
  type: string;
  payload?: T;
  meta?: {
    timestamp: Date;
    source: 'user' | 'system' | 'sync';
  };
}

export interface AsyncAction<T = any> extends BaseAction<T> {
  error?: Error;
  pending?: boolean;
}

// ===== REDUCER TYPES =====

export type StateReducer<S, A extends BaseAction = BaseAction> = (
  state: S,
  action: A
) => S;

export type AsyncReducer<S, A extends AsyncAction = AsyncAction> = (
  state: S,
  action: A
) => S;

// ===== HOOK TYPES =====

export interface UseAsyncReturn<T = any> {
  data?: T;
  isLoading: boolean;
  error?: Error;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

export interface UseSyncReturn {
  isOnline: boolean;
  isSyncing: boolean;
  syncNow: () => Promise<void>;
  clearPending: () => void;
  pendingCount: number;
}

export interface UseOptimisticReturn<T = any> {
  data: T;
  optimisticUpdate: (update: Partial<T>) => void;
  rollback: () => void;
  commit: () => Promise<void>;
}

// ===== BACKEND INTEGRATION TYPES =====

export interface APIResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}

export interface APIError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

export interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: string;
  data: any;
  timestamp: Date;
  retryCount: number;
  status: 'pending' | 'syncing' | 'success' | 'failed';
}

export interface ConflictResolution {
  strategy: 'client' | 'server' | 'merge' | 'manual';
  resolver?: (client: any, server: any) => any;
}

// ===== STORAGE TYPES =====

export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
  keys(): Promise<string[]>;
}

export interface PersistConfig {
  key: string;
  storage: StorageAdapter;
  whitelist?: string[];
  blacklist?: string[];
  transforms?: Array<{
    in: (state: any) => any;
    out: (state: any) => any;
  }>;
}

// ===== CONTEXT FACTORY TYPES =====

export interface ContextConfig<S = any> {
  name: string;
  initialState: S;
  reducer?: StateReducer<S>;
  persist?: PersistConfig;
  devtools?: boolean;
}

export interface ProviderConfig extends ContextConfig {
  children?: ReactNode;
}

// ===== MIGRATION TYPES =====

export interface MigrationConfig {
  version: number;
  migrate: (state: any) => any;
  validate?: (state: any) => boolean;
}

export interface VersionedState {
  version: number;
  data: any;
  timestamp: Date;
}

// ===== DEVELOPMENT TYPES =====

export interface DevtoolsConfig {
  enabled: boolean;
  name?: string;
  maxAge?: number;
  trace?: boolean;
  traceLimit?: number;
}

export interface StateSnapshot<S = any> {
  state: S;
  action?: BaseAction;
  timestamp: Date;
  diff?: Partial<S>;
}

// ===== UTILITY TYPES =====

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export type StateSelector<S, R> = (state: S) => R;

export type StateListener<S> = (
  state: S,
  prevState: S,
  action?: BaseAction
) => void;

export type UnsubscribeFn = () => void;

// ===== CONTEXT TYPES =====

export interface ContextValue<S, A = BaseAction> {
  state: S;
  dispatch: (action: A) => void;
  subscribe: (listener: StateListener<S>) => UnsubscribeFn;
  getSnapshot: () => S;
}

export type ContextHook<S, A = BaseAction> = () => ContextValue<S, A>;

// ===== RE-EXPORT COMMON TYPES =====
export type { ReactNode } from 'react';