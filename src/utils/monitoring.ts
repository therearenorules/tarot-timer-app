/**
 * Production Monitoring and Error Tracking Setup
 * Comprehensive monitoring solution for Tarot Timer web app
 */

import { Platform } from 'react-native';

export interface ErrorReport {
  error: Error;
  errorInfo?: {
    componentStack?: string;
    errorBoundary?: boolean;
    errorBoundaryFound?: boolean;
  };
  context?: Record<string, any>;
  timestamp: Date;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId: string;
  buildVersion: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface PerformanceMetrics {
  timestamp: Date;
  type: 'navigation' | 'resource' | 'paint' | 'measure';
  name: string;
  duration?: number;
  startTime?: number;
  value?: number;
  url?: string;
  entryType: string;
}

export interface UserInteraction {
  timestamp: Date;
  action: string;
  element?: string;
  page: string;
  userId?: string;
  sessionId: string;
  metadata?: Record<string, any>;
}

// Configuration for monitoring
export interface MonitoringConfig {
  enableErrorTracking: boolean;
  enablePerformanceMonitoring: boolean;
  enableUserTracking: boolean;
  enableConsoleCapture: boolean;
  sampleRate: number; // 0-1, percentage of events to track
  apiEndpoint?: string;
  projectId?: string;
  environment: 'development' | 'staging' | 'production';
  maxBreadcrumbs: number;
  beforeSend?: (event: ErrorReport) => ErrorReport | null;
}

// Default configuration
const DEFAULT_CONFIG: MonitoringConfig = {
  enableErrorTracking: true,
  enablePerformanceMonitoring: true,
  enableUserTracking: false, // Privacy-first approach
  enableConsoleCapture: false,
  sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  environment: (process.env.NODE_ENV as any) || 'development',
  maxBreadcrumbs: 50,
};

class MonitoringService {
  private config: MonitoringConfig = DEFAULT_CONFIG;
  private sessionId: string = '';
  private breadcrumbs: Array<{ timestamp: Date; message: string; level: string }> = [];
  private initialized = false;
  private performanceObserver?: PerformanceObserver;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  /**
   * Initialize monitoring service
   */
  init(config: Partial<MonitoringConfig> = {}): void {
    if (Platform.OS !== 'web' || this.initialized) return;

    this.config = { ...DEFAULT_CONFIG, ...config };
    this.initialized = true;

    if (this.config.enableErrorTracking) {
      this.setupErrorTracking();
    }

    if (this.config.enablePerformanceMonitoring) {
      this.setupPerformanceMonitoring();
    }

    if (this.config.enableConsoleCapture) {
      this.setupConsoleCapture();
    }

    this.addBreadcrumb('Monitoring initialized', 'info');

    // Track page visibility changes
    document.addEventListener('visibilitychange', () => {
      this.addBreadcrumb(
        `Page ${document.hidden ? 'hidden' : 'visible'}`,
        'info'
      );
    });
  }

  /**
   * Setup error tracking
   */
  private setupErrorTracking(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.captureError(event.error || new Error(event.message), {
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack,
        },
        severity: 'high',
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(
        new Error(`Unhandled Promise Rejection: ${event.reason}`),
        {
          context: { reason: event.reason },
          severity: 'high',
        }
      );
    });

    // React error boundary integration
    this.setupReactErrorBoundary();
  }

  /**
   * Setup performance monitoring
   */
  private setupPerformanceMonitoring(): void {
    if (!('PerformanceObserver' in window)) {
      console.warn('PerformanceObserver not supported');
      return;
    }

    // Observe navigation timing
    this.performanceObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.capturePerformanceMetric({
          timestamp: new Date(),
          type: entry.entryType as any,
          name: entry.name,
          duration: entry.duration,
          startTime: entry.startTime,
          entryType: entry.entryType,
          url: entry.name.includes('http') ? entry.name : undefined,
        });
      });
    });

    // Observe different performance metrics
    const observeTypes = ['navigation', 'paint', 'resource', 'measure'];
    observeTypes.forEach((type) => {
      try {
        this.performanceObserver?.observe({ type, buffered: true });
      } catch (error) {
        console.warn(`Could not observe ${type} performance entries`);
      }
    });

    // Web Vitals monitoring
    this.setupWebVitals();
  }

  /**
   * Setup Web Vitals monitoring
   */
  private setupWebVitals(): void {
    // First Input Delay (FID)
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.processingStart && entry.startTime) {
          const fid = entry.processingStart - entry.startTime;
          this.capturePerformanceMetric({
            timestamp: new Date(),
            type: 'measure',
            name: 'FID',
            value: fid,
            entryType: 'first-input',
          });
        }
      });
    }).observe({ type: 'first-input', buffered: true });

    // Largest Contentful Paint (LCP)
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.capturePerformanceMetric({
        timestamp: new Date(),
        type: 'paint',
        name: 'LCP',
        value: lastEntry.startTime,
        entryType: 'largest-contentful-paint',
      });
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
    }).observe({ type: 'layout-shift', buffered: true });

    // Report CLS on page unload
    window.addEventListener('beforeunload', () => {
      this.capturePerformanceMetric({
        timestamp: new Date(),
        type: 'measure',
        name: 'CLS',
        value: clsValue,
        entryType: 'layout-shift',
      });
    });
  }

  /**
   * Setup console capture
   */
  private setupConsoleCapture(): void {
    const originalConsole = { ...console };

    ['error', 'warn', 'info', 'log'].forEach((level) => {
      (console as any)[level] = (...args: any[]) => {
        this.addBreadcrumb(`Console ${level}: ${args.join(' ')}`, level);
        (originalConsole as any)[level](...args);
      };
    });
  }

  /**
   * Setup React Error Boundary integration
   */
  private setupReactErrorBoundary(): void {
    // This will be used by React Error Boundary components
    (window as any).__TAROT_ERROR_HANDLER__ = (error: Error, errorInfo: any) => {
      this.captureError(error, {
        errorInfo,
        severity: 'critical',
        context: { componentStack: errorInfo.componentStack },
      });
    };
  }

  /**
   * Capture error
   */
  captureError(
    error: Error,
    options: {
      context?: Record<string, any>;
      severity?: 'low' | 'medium' | 'high' | 'critical';
      errorInfo?: any;
    } = {}
  ): void {
    if (Math.random() > this.config.sampleRate) return;

    const errorReport: ErrorReport = {
      error,
      errorInfo: options.errorInfo,
      context: options.context,
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      sessionId: this.sessionId,
      buildVersion: process.env.EXPO_PUBLIC_VERSION || '1.0.0',
      severity: options.severity || 'medium',
    };

    // Apply beforeSend filter
    const filteredReport = this.config.beforeSend
      ? this.config.beforeSend(errorReport)
      : errorReport;

    if (!filteredReport) return;

    this.sendToEndpoint('errors', {
      ...filteredReport,
      breadcrumbs: this.breadcrumbs.slice(-10), // Last 10 breadcrumbs
    });

    // Log to console in development
    if (this.config.environment !== 'production') {
      console.error('Captured error:', errorReport);
    }
  }

  /**
   * Capture performance metric
   */
  private capturePerformanceMetric(metric: PerformanceMetrics): void {
    if (Math.random() > this.config.sampleRate) return;

    this.sendToEndpoint('performance', metric);

    // Log important metrics in development
    if (this.config.environment !== 'production' && 
        ['FID', 'LCP', 'CLS'].includes(metric.name)) {
      console.log('Performance metric:', metric);
    }
  }

  /**
   * Track user interaction
   */
  trackUserInteraction(action: string, element?: string, metadata?: Record<string, any>): void {
    if (!this.config.enableUserTracking) return;
    if (Math.random() > this.config.sampleRate) return;

    const interaction: UserInteraction = {
      timestamp: new Date(),
      action,
      element,
      page: window.location.pathname,
      sessionId: this.sessionId,
      metadata,
    };

    this.sendToEndpoint('interactions', interaction);
    this.addBreadcrumb(`User ${action} ${element || ''}`, 'info');
  }

  /**
   * Add breadcrumb
   */
  addBreadcrumb(message: string, level: string = 'info'): void {
    this.breadcrumbs.push({
      timestamp: new Date(),
      message,
      level,
    });

    // Keep only the last N breadcrumbs
    if (this.breadcrumbs.length > this.config.maxBreadcrumbs) {
      this.breadcrumbs.shift();
    }
  }

  /**
   * Send data to monitoring endpoint
   */
  private async sendToEndpoint(endpoint: string, data: any): Promise<void> {
    if (!this.config.apiEndpoint) {
      // If no endpoint configured, store locally for development
      if (this.config.environment !== 'production') {
        const key = `tarot_monitoring_${endpoint}`;
        const existing = JSON.parse(localStorage.getItem(key) || '[]');
        existing.push(data);
        // Keep only last 100 entries
        localStorage.setItem(key, JSON.stringify(existing.slice(-100)));
      }
      return;
    }

    try {
      await fetch(`${this.config.apiEndpoint}/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.config.projectId && { 'X-Project-ID': this.config.projectId }),
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      // Fail silently to avoid infinite error loops
      if (this.config.environment !== 'production') {
        console.warn('Failed to send monitoring data:', error);
      }
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2)}`;
  }

  /**
   * Get current session data
   */
  getSessionData(): { sessionId: string; breadcrumbs: typeof this.breadcrumbs } {
    return {
      sessionId: this.sessionId,
      breadcrumbs: this.breadcrumbs,
    };
  }

  /**
   * Set user context
   */
  setUserContext(userId: string, metadata?: Record<string, any>): void {
    this.addBreadcrumb(`User identified: ${userId}`, 'info');
    (window as any).__TAROT_USER_CONTEXT__ = { userId, ...metadata };
  }

  /**
   * Clean up monitoring
   */
  cleanup(): void {
    this.performanceObserver?.disconnect();
    this.breadcrumbs = [];
    this.initialized = false;
  }
}

// Singleton instance
const monitoringService = new MonitoringService();

// React Error Boundary component
export class ErrorBoundary extends Error {
  constructor(
    message: string,
    public componentStack: string,
    public errorBoundary: boolean = true
  ) {
    super(message);
    this.name = 'ErrorBoundary';
  }
}

// Hook for React components
export function useMonitoring() {
  const trackEvent = (action: string, element?: string, metadata?: Record<string, any>) => {
    monitoringService.trackUserInteraction(action, element, metadata);
  };

  const addBreadcrumb = (message: string, level: string = 'info') => {
    monitoringService.addBreadcrumb(message, level);
  };

  const captureError = (error: Error, context?: Record<string, any>) => {
    monitoringService.captureError(error, { context });
  };

  return {
    trackEvent,
    addBreadcrumb,
    captureError,
    sessionData: monitoringService.getSessionData(),
  };
}

// Export the singleton
export default monitoringService;