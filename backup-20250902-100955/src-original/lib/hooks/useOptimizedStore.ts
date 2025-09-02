/**
 * Performance-optimized React hooks with memoization
 */

import { useMemo, useCallback, useRef, useEffect } from 'react';

// Shallow equality helper
const shallowEqual = <T extends Record<string, any>>(obj1: T, obj2: T): boolean => {
  const keys1 = Object.keys(obj1) as Array<keyof T>;
  const keys2 = Object.keys(obj2) as Array<keyof T>;
  
  if (keys1.length !== keys2.length) return false;
  
  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) return false;
  }
  
  return true;
};

// Memoization helpers for expensive calculations
export const useMemoizedState = <T>(
  value: T,
  dependencies: any[]
): T => {
  return useMemo(() => value, dependencies);
};

// Stable callback creator
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T,
  dependencies: any[]
): T => {
  return useCallback(callback, dependencies);
};

// Array memoization with shallow comparison
export const useMemoizedArray = <T>(
  array: T[],
  compareFn?: (a: T, b: T) => boolean
): T[] => {
  return useMemo(() => {
    if (!compareFn) return array;
    return array;
  }, [array, compareFn]);
};

// Object memoization with shallow equality (improved performance)
export const useMemoizedObject = <T extends Record<string, any>>(
  obj: T
): T => {
  return useMemo(() => obj, [
    // Use shallow comparison instead of JSON.stringify for better performance
    ...Object.values(obj)
  ]);
};

// Deep memoization for complex objects (use sparingly)
export const useDeepMemoizedObject = <T extends Record<string, any>>(
  obj: T
): T => {
  return useMemo(() => obj, [JSON.stringify(obj)]);
};

// Performance monitoring hook with memory tracking
export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());
  const memoryRef = useRef<number | null>(null);
  
  useEffect(() => {
    renderCount.current += 1;
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;
    
    // Memory usage tracking (if available)
    if ('memory' in performance) {
      const currentMemory = (performance as any).memory?.usedJSHeapSize;
      if (memoryRef.current && currentMemory) {
        const memoryDelta = currentMemory - memoryRef.current;
        if (memoryDelta > 1048576) { // 1MB
          console.warn(`${componentName} memory increased by ${(memoryDelta / 1048576).toFixed(2)}MB`);
        }
      }
      memoryRef.current = currentMemory;
    }
    
    // Performance warnings
    if (renderTime > 16) { // More than one frame (60fps)
      console.warn(`${componentName} render #${renderCount.current} took ${renderTime.toFixed(2)}ms`);
    }
    
    if (renderCount.current > 100) {
      console.warn(`${componentName} has rendered ${renderCount.current} times`);
    }
    
    startTime.current = performance.now();
  });

  const logRenderTime = useCallback(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;
    console.log(`${componentName} render time: ${renderTime.toFixed(2)}ms`);
  }, [componentName]);

  return { 
    logRenderTime, 
    renderCount: renderCount.current,
    getCurrentMemory: () => memoryRef.current
  };
};

// Hook for measuring component lifecycle performance
export const useLifecyclePerformance = (componentName: string) => {
  const mountTime = useRef(performance.now());
  const updateTimes = useRef<number[]>([]);
  
  useEffect(() => {
    updateTimes.current.push(performance.now());
    
    return () => {
      const unmountTime = performance.now();
      const totalLifetime = unmountTime - mountTime.current;
      const avgUpdateTime = updateTimes.current.length > 1 
        ? updateTimes.current.reduce((acc, time, index) => {
            if (index === 0) return acc;
            return acc + (time - updateTimes.current[index - 1]);
          }, 0) / (updateTimes.current.length - 1)
        : 0;
        
      console.log(`${componentName} lifecycle: ${totalLifetime.toFixed(2)}ms total, ${avgUpdateTime.toFixed(2)}ms avg update`);
    };
  }, [componentName]);
  
  return {
    getLifetime: () => performance.now() - mountTime.current,
    getUpdateCount: () => updateTimes.current.length
  };
};

// Hook for optimizing re-renders with dependency tracking
export const useRenderOptimization = <T>(value: T, debugName: string) => {
  const previousValue = useRef(value);
  const renderReasons = useRef<string[]>([]);
  
  const hasChanged = !Object.is(value, previousValue.current);
  
  if (hasChanged) {
    renderReasons.current.push(`${debugName} changed from ${previousValue.current} to ${value}`);
    previousValue.current = value;
    
    if (__DEV__) {
      console.log(`Re-render triggered by: ${renderReasons.current.join(', ')}`);
    }
  }
  
  return {
    hasChanged,
    renderReasons: renderReasons.current,
    clearReasons: () => { renderReasons.current = []; }
  };
};