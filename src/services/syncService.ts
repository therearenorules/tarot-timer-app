/**
 * 동기화 서비스
 * 백엔드 데이터 연동 및 오프라인 지원을 위한 동기화 레이어
 */

import type { 
  SyncOperation, 
  ConflictResolution, 
  APIResponse, 
  APIError,
  StorageAdapter 
} from '../types/state';

// ===== INTERFACES =====
export interface SyncConfig {
  apiBaseUrl: string;
  retryAttempts: number;
  retryDelay: number;
  batchSize: number;
  conflictResolution: ConflictResolution;
  storage: StorageAdapter;
}

export interface EntitySyncConfig {
  endpoint: string;
  primaryKey: string;
  conflictFields?: string[];
  transformIn?: (data: any) => any;
  transformOut?: (data: any) => any;
}

export interface SyncResult {
  success: boolean;
  synced: number;
  failed: number;
  conflicts: Array<{
    operation: SyncOperation;
    error: string;
  }>;
}

// ===== SYNC QUEUE MANAGER =====
class SyncQueue {
  private queue: SyncOperation[] = [];
  private processing = false;

  add(operation: Omit<SyncOperation, 'id' | 'timestamp' | 'retryCount' | 'status'>): void {
    const syncOperation: SyncOperation = {
      ...operation,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      retryCount: 0,
      status: 'pending',
    };

    this.queue.push(syncOperation);
  }

  getAll(): SyncOperation[] {
    return [...this.queue];
  }

  getPending(): SyncOperation[] {
    return this.queue.filter(op => op.status === 'pending');
  }

  remove(id: string): void {
    this.queue = this.queue.filter(op => op.id !== id);
  }

  updateStatus(id: string, status: SyncOperation['status']): void {
    const operation = this.queue.find(op => op.id === id);
    if (operation) {
      operation.status = status;
    }
  }

  incrementRetry(id: string): void {
    const operation = this.queue.find(op => op.id === id);
    if (operation) {
      operation.retryCount++;
    }
  }

  clear(): void {
    this.queue = [];
  }

  size(): number {
    return this.queue.length;
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }
}

// ===== SYNC SERVICE =====
export class SyncService {
  private config: SyncConfig;
  private entityConfigs: Map<string, EntitySyncConfig> = new Map();
  private syncQueue = new SyncQueue();
  private isOnline = true;
  private syncInterval?: NodeJS.Timeout;

  constructor(config: SyncConfig) {
    this.config = config;
    this.setupNetworkMonitoring();
    this.loadQueueFromStorage();
  }

  // ===== CONFIGURATION =====
  registerEntity(entity: string, config: EntitySyncConfig): void {
    this.entityConfigs.set(entity, config);
  }

  setOnlineStatus(online: boolean): void {
    const wasOnline = this.isOnline;
    this.isOnline = online;

    // 온라인 복구 시 자동 동기화
    if (!wasOnline && online) {
      this.startAutoSync();
    }
  }

  // ===== QUEUE MANAGEMENT =====
  async addToQueue(
    type: 'create' | 'update' | 'delete',
    entity: string,
    data: any
  ): Promise<void> {
    this.syncQueue.add({
      type,
      entity,
      data,
    });

    await this.saveQueueToStorage();

    // 온라인 상태면 즉시 동기화 시도
    if (this.isOnline) {
      this.processQueue();
    }
  }

  getPendingCount(): number {
    return this.syncQueue.getPending().length;
  }

  clearQueue(): void {
    this.syncQueue.clear();
    this.saveQueueToStorage();
  }

  // ===== SYNC OPERATIONS =====
  async sync(): Promise<SyncResult> {
    if (!this.isOnline) {
      throw new Error('Cannot sync while offline');
    }

    return this.processQueue();
  }

  async forceSync(entity?: string): Promise<SyncResult> {
    const operations = entity 
      ? this.syncQueue.getAll().filter(op => op.entity === entity)
      : this.syncQueue.getAll();

    return this.processOperations(operations);
  }

  // ===== PRIVATE METHODS =====
  private async processQueue(): Promise<SyncResult> {
    if (!this.isOnline) {
      return { success: false, synced: 0, failed: 0, conflicts: [] };
    }

    const pendingOperations = this.syncQueue.getPending();
    return this.processOperations(pendingOperations);
  }

  private async processOperations(operations: SyncOperation[]): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      synced: 0,
      failed: 0,
      conflicts: [],
    };

    // 배치 단위로 처리
    for (let i = 0; i < operations.length; i += this.config.batchSize) {
      const batch = operations.slice(i, i + this.config.batchSize);
      
      for (const operation of batch) {
        try {
          this.syncQueue.updateStatus(operation.id, 'syncing');
          await this.processOperation(operation);
          this.syncQueue.updateStatus(operation.id, 'success');
          this.syncQueue.remove(operation.id);
          result.synced++;
        } catch (error) {
          console.error(`Sync operation failed:`, operation, error);
          
          this.syncQueue.incrementRetry(operation.id);
          
          // 재시도 횟수 초과 시 실패 처리
          if (operation.retryCount >= this.config.retryAttempts) {
            this.syncQueue.updateStatus(operation.id, 'failed');
            result.conflicts.push({
              operation,
              error: error instanceof Error ? error.message : 'Unknown error',
            });
            result.failed++;
          } else {
            this.syncQueue.updateStatus(operation.id, 'pending');
          }
        }
      }
    }

    await this.saveQueueToStorage();
    result.success = result.failed === 0;
    return result;
  }

  private async processOperation(operation: SyncOperation): Promise<void> {
    const entityConfig = this.entityConfigs.get(operation.entity);
    if (!entityConfig) {
      throw new Error(`Entity configuration not found: ${operation.entity}`);
    }

    const url = `${this.config.apiBaseUrl}${entityConfig.endpoint}`;
    let requestUrl = url;
    let method = 'POST';
    let body = operation.data;

    // Transform 적용
    if (entityConfig.transformOut) {
      body = entityConfig.transformOut(body);
    }

    // HTTP 메서드 및 URL 결정
    switch (operation.type) {
      case 'create':
        method = 'POST';
        break;
      case 'update':
        method = 'PUT';
        requestUrl = `${url}/${body[entityConfig.primaryKey]}`;
        break;
      case 'delete':
        method = 'DELETE';
        requestUrl = `${url}/${body[entityConfig.primaryKey]}`;
        body = undefined;
        break;
    }

    // API 호출
    const response = await this.apiCall(requestUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.success) {
      throw new Error(`API call failed: ${response.message}`);
    }

    // 성공한 응답 데이터 로컬 저장소에 반영
    if (response.data && entityConfig.transformIn) {
      const transformedData = entityConfig.transformIn(response.data);
      // 로컬 데이터 업데이트 로직은 호출자에서 처리
    }
  }

  private async apiCall(url: string, options: RequestInit): Promise<APIResponse> {
    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        const error: APIError = data;
        throw new Error(error.message || 'API call failed');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network request failed');
    }
  }

  private setupNetworkMonitoring(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.setOnlineStatus(true);
      });

      window.addEventListener('offline', () => {
        this.setOnlineStatus(false);
      });

      this.isOnline = navigator.onLine;
    }
  }

  private startAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    this.syncInterval = setInterval(() => {
      if (this.isOnline && !this.syncQueue.isEmpty()) {
        this.processQueue().catch(console.error);
      }
    }, 30000); // 30초마다 자동 동기화
  }

  private async saveQueueToStorage(): Promise<void> {
    try {
      const operations = this.syncQueue.getAll();
      await this.config.storage.set('sync_queue', operations);
    } catch (error) {
      console.error('Failed to save sync queue to storage:', error);
    }
  }

  private async loadQueueFromStorage(): Promise<void> {
    try {
      const operations = await this.config.storage.get<SyncOperation[]>('sync_queue');
      if (operations && Array.isArray(operations)) {
        operations.forEach(op => {
          this.syncQueue.add({
            type: op.type,
            entity: op.entity,
            data: op.data,
          });
        });
      }
    } catch (error) {
      console.error('Failed to load sync queue from storage:', error);
    }
  }

  // ===== CLEANUP =====
  destroy(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }

    if (typeof window !== 'undefined') {
      window.removeEventListener('online', () => {});
      window.removeEventListener('offline', () => {});
    }
  }
}

// ===== FACTORY FUNCTION =====
export const createSyncService = (config: SyncConfig): SyncService => {
  return new SyncService(config);
};