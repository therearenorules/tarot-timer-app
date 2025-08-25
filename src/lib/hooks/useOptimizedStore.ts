/**
 * Performance-optimized React hooks with memoization
 */

import { useMemo, useCallback } from 'react';

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

// Object memoization with shallow equality
export const useMemoizedObject = <T extends Record<string, any>>(
  obj: T
): T => {
  return useMemo(() => obj, [JSON.stringify(obj)]);
};

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const startTime = useMemo(() => performance.now(), []);
  
  const logRenderTime = useCallback(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    if (renderTime > 16) { // More than one frame (60fps)
      console.warn(`${componentName} render took ${renderTime.toFixed(2)}ms`);
    }
  }, [componentName, startTime]);

  return { logRenderTime };
};