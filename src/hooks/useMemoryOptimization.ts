/**
 * 메모리 최적화 React Hook
 * 컴포넌트에서 메모리 사용량을 자동으로 관리하고 최적화합니다.
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import MemoryOptimizer from '@/lib/performance/MemoryOptimizer';

interface UseMemoryOptimizationOptions {
  componentName?: string;
  enableTracking?: boolean;
  autoCleanup?: boolean;
  cleanupOnUnmount?: boolean;
}

interface MemoryOptimizationResult {
  forceCleanup: () => void;
  getMemoryReport: () => ReturnType<MemoryOptimizer['generateMemoryReport']>;
  optimizeImages: () => void;
  checkForLeaks: () => ReturnType<MemoryOptimizer['detectMemoryLeaks']>;
}

export function useMemoryOptimization(
  options: UseMemoryOptimizationOptions = {}
): MemoryOptimizationResult {
  const {
    componentName = 'UnknownComponent',
    enableTracking = true,
    autoCleanup = true,
    cleanupOnUnmount = true,
  } = options;

  const memoryOptimizerRef = useRef<MemoryOptimizer>(MemoryOptimizer.getInstance());
  const componentNameRef = useRef(componentName);

  // 컴포넌트 마운트 시 추적 시작
  useEffect(() => {
    if (enableTracking) {
      memoryOptimizerRef.current.trackComponent(componentNameRef.current);
    }

    return () => {
      // 컴포넌트 언마운트 시 추적 종료
      if (enableTracking) {
        memoryOptimizerRef.current.untrackComponent(componentNameRef.current);
      }

      // 언마운트 시 정리
      if (cleanupOnUnmount) {
        // 약간의 지연 후 정리 (다른 컴포넌트들이 마운트될 시간을 줌)
        setTimeout(() => {
          const report = memoryOptimizerRef.current.generateMemoryReport();
          if (report.current && report.current.usage > 70) {
            memoryOptimizerRef.current.optimizeImageCache();
          }
        }, 1000);
      }
    };
  }, [enableTracking, cleanupOnUnmount]);

  // 강제 메모리 정리
  const forceCleanup = useCallback(() => {
    memoryOptimizerRef.current.optimizeImageCache();
    
    // 가비지 컬렉션 제안
    if (global.gc) {
      global.gc();
    }
  }, []);

  // 메모리 보고서 조회
  const getMemoryReport = useCallback(() => {
    return memoryOptimizerRef.current.generateMemoryReport();
  }, []);

  // 이미지 최적화
  const optimizeImages = useCallback(() => {
    memoryOptimizerRef.current.optimizeImageCache();
  }, []);

  // 메모리 리크 체크
  const checkForLeaks = useCallback(() => {
    return memoryOptimizerRef.current.detectMemoryLeaks();
  }, []);

  return {
    forceCleanup,
    getMemoryReport,
    optimizeImages,
    checkForLeaks,
  };
}

/**
 * 큰 데이터 처리를 위한 청킹 유틸리티 Hook
 */
export function useDataChunking<T>(
  data: T[],
  chunkSize: number = 50
): {
  chunks: T[][];
  processedCount: number;
  totalCount: number;
  isComplete: boolean;
} {
  const chunks: T[][] = [];
  let currentIndex = 0;

  // 데이터를 청크로 분할
  while (currentIndex < data.length) {
    chunks.push(data.slice(currentIndex, currentIndex + chunkSize));
    currentIndex += chunkSize;
  }

  return {
    chunks,
    processedCount: 0, // 실제 처리 진행률은 각 컴포넌트에서 관리
    totalCount: data.length,
    isComplete: false,
  };
}

/**
 * 무거운 연산을 위한 배치 처리 Hook
 */

export function useBatchProcessing<T, R>(
  items: T[],
  processor: (item: T) => R,
  batchSize: number = 10,
  delayMs: number = 10
): {
  results: R[];
  isProcessing: boolean;
  progress: number;
  startProcessing: () => void;
  pauseProcessing: () => void;
  resetProcessing: () => void;
} {
  const [results, setResults] = useState<R[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const progress = items.length > 0 ? (currentIndex / items.length) * 100 : 0;

  const startProcessing = useCallback(async () => {
    if (isProcessing || currentIndex >= items.length) return;

    setIsProcessing(true);
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
      while (currentIndex < items.length && !signal.aborted) {
        const batch = items.slice(currentIndex, currentIndex + batchSize);
        const batchResults = batch.map(processor);
        
        setResults(prev => [...prev, ...batchResults]);
        setCurrentIndex(prev => prev + batch.length);

        // 배치 간 지연으로 UI 블로킹 방지
        if (currentIndex + batchSize < items.length && delayMs > 0) {
          await new Promise(resolve => setTimeout(resolve, delayMs));
        }
      }
    } catch (error) {
      console.error('배치 처리 중 오류:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [items, processor, batchSize, delayMs, currentIndex, isProcessing]);

  const pauseProcessing = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsProcessing(false);
  }, []);

  const resetProcessing = useCallback(() => {
    pauseProcessing();
    setResults([]);
    setCurrentIndex(0);
  }, [pauseProcessing]);

  return {
    results,
    isProcessing,
    progress,
    startProcessing,
    pauseProcessing,
    resetProcessing,
  };
}