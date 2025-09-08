import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

/**
 * ⚡ Performance System Manager
 * 
 * Comprehensive performance optimization for the tarot timer app.
 * Monitors and optimizes rendering, animations, and memory usage.
 * 
 * Features:
 * - React performance optimization
 * - Animation performance monitoring
 * - Memory leak detection
 * - Lazy loading management
 * - Image optimization
 * - Bundle size optimization
 */

interface PerformanceMetrics {
  renderTime: number;
  componentMounts: number;
  reRenders: number;
  memoryUsage: number;
  animationFrameRate: number;
  imageLoadTime: number;
  bundleSize: number;
}

interface PerformanceSettings {
  enableAnimations: boolean;
  imageQuality: 'low' | 'medium' | 'high';
  lazyLoadImages: boolean;
  preloadCriticalAssets: boolean;
  enableVirtualization: boolean;
  maxConcurrentAnimations: number;
}

interface PerformanceContextType {
  metrics: PerformanceMetrics;
  settings: PerformanceSettings;
  optimizeForDevice: () => void;
  measureRenderTime: (componentName: string) => void;
  preloadImage: (src: string) => Promise<void>;
  createOptimizedImageUrl: (src: string, width?: number, quality?: number) => string;
  scheduleWork: (callback: () => void, priority?: 'immediate' | 'normal' | 'low') => void;
  cancelScheduledWork: (id: string) => void;
}

const PerformanceContext = createContext<PerformanceContextType | null>(null);

/**
 * Performance Monitor Class
 */
class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    renderTime: 0,
    componentMounts: 0,
    reRenders: 0,
    memoryUsage: 0,
    animationFrameRate: 60,
    imageLoadTime: 0,
    bundleSize: 0,
  };

  private renderStartTimes = new Map<string, number>();
  private scheduledWork = new Map<string, number>();
  private memoryWatcher: number | null = null;

  constructor() {
    this.startMemoryWatcher();
    this.measureBundleSize();
  }

  /**
   * Start measuring render time for a component
   */
  startRenderMeasurement(componentName: string): void {
    this.renderStartTimes.set(componentName, performance.now());
  }

  /**
   * End measuring render time for a component
   */
  endRenderMeasurement(componentName: string): void {
    const startTime = this.renderStartTimes.get(componentName);
    if (startTime) {
      const renderTime = performance.now() - startTime;
      this.metrics.renderTime = Math.max(this.metrics.renderTime, renderTime);
      this.renderStartTimes.delete(componentName);
      
      // Log slow renders in development
      if (process.env.NODE_ENV === 'development' && renderTime > 16) {
        console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
    }
  }

  /**
   * Record component mount
   */
  recordComponentMount(): void {
    this.metrics.componentMounts++;
  }

  /**
   * Record component re-render
   */
  recordReRender(): void {
    this.metrics.reRenders++;
  }

  /**
   * Start monitoring memory usage
   */
  private startMemoryWatcher(): void {
    if (typeof window !== 'undefined' && 'performance' in window && 'memory' in (window.performance as any)) {
      this.memoryWatcher = window.setInterval(() => {
        const memory = (window.performance as any).memory;
        this.metrics.memoryUsage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        
        // Warn about memory leaks
        if (this.metrics.memoryUsage > 0.8) {
          console.warn('High memory usage detected:', this.metrics.memoryUsage);
        }
      }, 5000);
    }
  }

  /**
   * Measure bundle size
   */
  private measureBundleSize(): void {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const jsResources = resources.filter(resource => resource.name.endsWith('.js'));
      this.metrics.bundleSize = jsResources.reduce((total, resource) => {
        return total + (resource.transferSize || 0);
      }, 0);
    }
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset metrics
   */
  resetMetrics(): void {
    this.metrics = {
      renderTime: 0,
      componentMounts: 0,
      reRenders: 0,
      memoryUsage: 0,
      animationFrameRate: 60,
      imageLoadTime: 0,
      bundleSize: this.metrics.bundleSize, // Keep bundle size
    };
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.memoryWatcher) {
      clearInterval(this.memoryWatcher);
    }
  }
}

/**
 * Work Scheduler Class for prioritized task execution
 */
class WorkScheduler {
  private queues = {
    immediate: [] as Array<{ id: string; callback: () => void }>,
    normal: [] as Array<{ id: string; callback: () => void }>,
    low: [] as Array<{ id: string; callback: () => void }>,
  };

  private isProcessing = false;
  private nextId = 0;

  /**
   * Schedule work with priority
   */
  schedule(callback: () => void, priority: 'immediate' | 'normal' | 'low' = 'normal'): string {
    const id = `work-${this.nextId++}`;
    this.queues[priority].push({ id, callback });
    
    if (!this.isProcessing) {
      this.processWork();
    }
    
    return id;
  }

  /**
   * Cancel scheduled work
   */
  cancel(id: string): void {
    Object.values(this.queues).forEach(queue => {
      const index = queue.findIndex(work => work.id === id);
      if (index !== -1) {
        queue.splice(index, 1);
      }
    });
  }

  /**
   * Process work queues with priority
   */
  private processWork(): void {
    this.isProcessing = true;
    
    const processQueue = (queueName: keyof typeof this.queues) => {
      const queue = this.queues[queueName];
      if (queue.length > 0) {
        const work = queue.shift()!;
        try {
          work.callback();
        } catch (error) {
          console.error('Error processing scheduled work:', error);
        }
        return true;
      }
      return false;
    };

    const processFrame = () => {
      const frameStart = performance.now();
      const timeSlice = 5; // 5ms time slice
      
      // Process immediate work first
      while (this.queues.immediate.length > 0 && (performance.now() - frameStart) < timeSlice) {
        processQueue('immediate');
      }
      
      // Then normal priority
      while (this.queues.normal.length > 0 && (performance.now() - frameStart) < timeSlice) {
        processQueue('normal');
      }
      
      // Finally low priority
      while (this.queues.low.length > 0 && (performance.now() - frameStart) < timeSlice) {
        processQueue('low');
      }
      
      // Continue processing if there's more work
      if (this.hasWork()) {
        requestAnimationFrame(processFrame);
      } else {
        this.isProcessing = false;
      }
    };

    requestAnimationFrame(processFrame);
  }

  /**
   * Check if there's work in any queue
   */
  private hasWork(): boolean {
    return Object.values(this.queues).some(queue => queue.length > 0);
  }
}

/**
 * Image Optimization Manager
 */
class ImageOptimizer {
  private preloadCache = new Set<string>();
  private loadingPromises = new Map<string, Promise<void>>();

  /**
   * Preload image with caching
   */
  preloadImage(src: string): Promise<void> {
    if (this.preloadCache.has(src)) {
      return Promise.resolve();
    }

    if (this.loadingPromises.has(src)) {
      return this.loadingPromises.get(src)!;
    }

    const promise = new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.preloadCache.add(src);
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });

    this.loadingPromises.set(src, promise);
    return promise;
  }

  /**
   * Create optimized image URL with quality and size parameters
   */
  createOptimizedUrl(src: string, width?: number, quality?: number): string {
    // In a real app, this would integrate with image optimization services
    // For now, return the original URL with query parameters
    const url = new URL(src, window.location.origin);
    
    if (width) {
      url.searchParams.set('w', width.toString());
    }
    
    if (quality) {
      url.searchParams.set('q', quality.toString());
    }

    // Add format optimization
    url.searchParams.set('auto', 'format');
    
    return url.toString();
  }

  /**
   * Get appropriate image quality based on device capabilities
   */
  getOptimalQuality(settings: PerformanceSettings): number {
    switch (settings.imageQuality) {
      case 'low': return 60;
      case 'medium': return 80;
      case 'high': return 95;
      default: return 80;
    }
  }
}

/**
 * Performance Provider Component
 */
export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  const [monitor] = useState(() => new PerformanceMonitor());
  const [scheduler] = useState(() => new WorkScheduler());
  const [imageOptimizer] = useState(() => new ImageOptimizer());
  
  const [metrics, setMetrics] = useState<PerformanceMetrics>(() => monitor.getMetrics());
  const [settings, setSettings] = useState<PerformanceSettings>(() => ({
    enableAnimations: true,
    imageQuality: 'medium',
    lazyLoadImages: true,
    preloadCriticalAssets: true,
    enableVirtualization: false,
    maxConcurrentAnimations: 3,
  }));

  // Update metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(monitor.getMetrics());
    }, 1000);

    return () => {
      clearInterval(interval);
      monitor.destroy();
    };
  }, [monitor]);

  // Optimize for device capabilities
  const optimizeForDevice = useCallback(() => {
    if (typeof window === 'undefined') return;

    const isLowEndDevice = () => {
      // Detect low-end devices based on various factors
      const memory = (navigator as any).deviceMemory;
      const cores = navigator.hardwareConcurrency;
      const connection = (navigator as any).connection;
      
      return (
        (memory && memory < 4) ||
        (cores && cores < 4) ||
        (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g'))
      );
    };

    if (isLowEndDevice()) {
      setSettings(prev => ({
        ...prev,
        enableAnimations: false,
        imageQuality: 'low',
        lazyLoadImages: true,
        enableVirtualization: true,
        maxConcurrentAnimations: 1,
      }));
    }
  }, []);

  // Auto-optimize on mount
  useEffect(() => {
    optimizeForDevice();
  }, [optimizeForDevice]);

  const contextValue: PerformanceContextType = {
    metrics,
    settings,
    optimizeForDevice,

    measureRenderTime: useCallback((componentName: string) => {
      monitor.startRenderMeasurement(componentName);
      // Return end function for component to call
      return () => monitor.endRenderMeasurement(componentName);
    }, [monitor]),

    preloadImage: useCallback((src: string) => {
      return imageOptimizer.preloadImage(src);
    }, [imageOptimizer]),

    createOptimizedImageUrl: useCallback((src: string, width?: number, quality?: number) => {
      const optimalQuality = quality || imageOptimizer.getOptimalQuality(settings);
      return imageOptimizer.createOptimizedUrl(src, width, optimalQuality);
    }, [imageOptimizer, settings]),

    scheduleWork: useCallback((callback: () => void, priority: 'immediate' | 'normal' | 'low' = 'normal') => {
      return scheduler.schedule(callback, priority);
    }, [scheduler]),

    cancelScheduledWork: useCallback((id: string) => {
      scheduler.cancel(id);
    }, [scheduler]),
  };

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  );
}

/**
 * Hook to access performance context
 */
export function usePerformance(): PerformanceContextType {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within PerformanceProvider');
  }
  return context;
}

/**
 * Hook for performance measurement
 */
export function usePerformanceMeasurement(componentName: string) {
  const { measureRenderTime } = usePerformance();
  
  useEffect(() => {
    const endMeasurement = measureRenderTime(componentName);
    return endMeasurement;
  });
}

/**
 * Hook for optimized images
 */
export function useOptimizedImage(src: string, width?: number) {
  const { createOptimizedImageUrl, preloadImage } = usePerformance();
  
  const optimizedSrc = useMemo(() => 
    createOptimizedImageUrl(src, width), 
    [createOptimizedImageUrl, src, width]
  );

  useEffect(() => {
    preloadImage(optimizedSrc);
  }, [preloadImage, optimizedSrc]);

  return optimizedSrc;
}

/**
 * Hook for scheduled work
 */
export function useScheduledWork() {
  const { scheduleWork, cancelScheduledWork } = usePerformance();
  const workIds = useMemo(() => new Set<string>(), []);

  const schedule = useCallback((callback: () => void, priority?: 'immediate' | 'normal' | 'low') => {
    const id = scheduleWork(callback, priority);
    workIds.add(id);
    return id;
  }, [scheduleWork, workIds]);

  const cancel = useCallback((id: string) => {
    cancelScheduledWork(id);
    workIds.delete(id);
  }, [cancelScheduledWork, workIds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      workIds.forEach(id => cancelScheduledWork(id));
    };
  }, [workIds, cancelScheduledWork]);

  return { schedule, cancel };
}

/**
 * Performance optimization utilities
 */
export const PerformanceUtils = {
  /**
   * Debounce function for performance optimization
   */
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  },

  /**
   * Throttle function for performance optimization
   */
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  },

  /**
   * Memoize function for expensive calculations
   */
  memoize: <T extends (...args: any[]) => any>(
    func: T,
    keyGenerator?: (...args: Parameters<T>) => string
  ): T => {
    const cache = new Map();
    return ((...args: Parameters<T>) => {
      const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
      if (cache.has(key)) {
        return cache.get(key);
      }
      const result = func(...args);
      cache.set(key, result);
      return result;
    }) as T;
  },

  /**
   * Check if device is low-end
   */
  isLowEndDevice: (): boolean => {
    if (typeof navigator === 'undefined') return false;
    
    const memory = (navigator as any).deviceMemory;
    const cores = navigator.hardwareConcurrency;
    
    return (memory && memory < 4) || (cores && cores < 4);
  },

  /**
   * Get optimal animation duration based on device performance
   */
  getOptimalAnimationDuration: (baseMs: number): number => {
    return PerformanceUtils.isLowEndDevice() ? Math.min(baseMs / 2, 150) : baseMs;
  },
};

/**
 * HOC for performance monitoring
 */
export function withPerformanceMonitoring<T extends object>(
  Component: React.ComponentType<T>,
  componentName: string
): React.ComponentType<T> {
  return function PerformanceMonitoredComponent(props: T) {
    usePerformanceMeasurement(componentName);
    return <Component {...props} />;
  };
}