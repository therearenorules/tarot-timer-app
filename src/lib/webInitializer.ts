/**
 * Web Platform Initializer
 * Handles web-specific initialization and configuration
 */

import { Platform } from 'react-native';
import monitoringService from '../utils/monitoring';
import SecurityUtils from './securityConfig';

interface WebInitializationConfig {
  enableMonitoring: boolean;
  enableSecurity: boolean;
  enableServiceWorker: boolean;
  enableWebVitals: boolean;
  apiEndpoint?: string;
  projectId?: string;
}

class WebInitializer {
  private initialized = false;
  private config: WebInitializationConfig = {
    enableMonitoring: true,
    enableSecurity: true,
    enableServiceWorker: true,
    enableWebVitals: true,
  };

  /**
   * Initialize web platform features
   */
  async initialize(userConfig: Partial<WebInitializationConfig> = {}): Promise<void> {
    if (Platform.OS !== 'web' || this.initialized) return;

    this.config = { ...this.config, ...userConfig };

    try {
      console.log('🚀 Initializing Tarot Timer Web Platform...');

      // Initialize security
      if (this.config.enableSecurity) {
        await this.initializeSecurity();
      }

      // Initialize monitoring
      if (this.config.enableMonitoring) {
        await this.initializeMonitoring();
      }

      // Initialize service worker
      if (this.config.enableServiceWorker) {
        await this.initializeServiceWorker();
      }

      // Initialize performance monitoring
      if (this.config.enableWebVitals) {
        await this.initializeWebVitals();
      }

      // Setup global error handlers
      this.setupGlobalErrorHandlers();

      // Setup page lifecycle handlers
      this.setupPageLifecycle();

      this.initialized = true;
      console.log('✅ Web platform initialization complete');

    } catch (error) {
      console.error('❌ Web platform initialization failed:', error);
      // Continue execution even if initialization fails
    }
  }

  /**
   * Initialize security features
   */
  private async initializeSecurity(): Promise<void> {
    try {
      SecurityUtils.initialize();
      console.log('✅ Security initialized');
    } catch (error) {
      console.error('❌ Security initialization failed:', error);
    }
  }

  /**
   * Initialize monitoring service
   */
  private async initializeMonitoring(): Promise<void> {
    try {
      monitoringService.init({
        enableErrorTracking: true,
        enablePerformanceMonitoring: true,
        enableUserTracking: false, // Privacy-first
        enableConsoleCapture: process.env.NODE_ENV !== 'production',
        sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
        apiEndpoint: this.config.apiEndpoint,
        projectId: this.config.projectId,
        environment: (process.env.NODE_ENV as any) || 'development',
      });
      console.log('✅ Monitoring initialized');
    } catch (error) {
      console.error('❌ Monitoring initialization failed:', error);
    }
  }

  /**
   * Initialize service worker
   */
  private async initializeServiceWorker(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      console.warn('⚠️ Service Worker not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });

      console.log('✅ Service Worker registered:', registration.scope);

      // Handle service worker updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🔄 New service worker available');
              // Optionally show update notification to user
              this.showUpdateAvailable();
            }
          });
        }
      });

      // Handle service worker messages
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('📨 Service Worker message:', event.data);
      });

    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
    }
  }

  /**
   * Initialize Web Vitals monitoring
   */
  private async initializeWebVitals(): Promise<void> {
    try {
      // Import web-vitals dynamically to avoid bundle size impact
      const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');

      // Core Web Vitals
      getCLS((metric) => {
        monitoringService.captureError(new Error('Core Web Vital: CLS'), {
          context: { metric: metric.value, rating: metric.rating },
          severity: 'low',
        });
      });

      getFID((metric) => {
        monitoringService.captureError(new Error('Core Web Vital: FID'), {
          context: { metric: metric.value, rating: metric.rating },
          severity: 'low',
        });
      });

      getLCP((metric) => {
        monitoringService.captureError(new Error('Core Web Vital: LCP'), {
          context: { metric: metric.value, rating: metric.rating },
          severity: 'low',
        });
      });

      // Additional metrics
      getFCP((metric) => {
        console.log('🎨 First Contentful Paint:', metric.value);
      });

      getTTFB((metric) => {
        console.log('⚡ Time to First Byte:', metric.value);
      });

      console.log('✅ Web Vitals monitoring initialized');
    } catch (error) {
      console.warn('⚠️ Web Vitals not available:', error);
    }
  }

  /**
   * Setup global error handlers
   */
  private setupGlobalErrorHandlers(): void {
    // React error boundary integration
    (window as any).__TAROT_ERROR_HANDLER__ = (error: Error, errorInfo: any) => {
      monitoringService.captureError(error, {
        errorInfo,
        severity: 'critical',
      });
    };

    // Network error detection
    window.addEventListener('online', () => {
      monitoringService.addBreadcrumb('Network connection restored', 'info');
    });

    window.addEventListener('offline', () => {
      monitoringService.addBreadcrumb('Network connection lost', 'warning');
    });
  }

  /**
   * Setup page lifecycle handlers
   */
  private setupPageLifecycle(): void {
    // Page load complete
    if (document.readyState === 'complete') {
      this.onPageLoadComplete();
    } else {
      window.addEventListener('load', () => {
        this.onPageLoadComplete();
      });
    }

    // Page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        monitoringService.addBreadcrumb('Page hidden', 'info');
      } else {
        monitoringService.addBreadcrumb('Page visible', 'info');
      }
    });

    // Page unload
    window.addEventListener('beforeunload', () => {
      monitoringService.addBreadcrumb('Page unloading', 'info');
    });

    // History changes (for SPA navigation)
    window.addEventListener('popstate', () => {
      monitoringService.addBreadcrumb(`Navigation: ${window.location.pathname}`, 'info');
    });
  }

  /**
   * Handle page load completion
   */
  private onPageLoadComplete(): void {
    // Measure and report initial load time
    const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationTiming) {
      const loadTime = navigationTiming.loadEventEnd - navigationTiming.fetchStart;
      console.log('⏱️ Page load time:', loadTime + 'ms');
      
      monitoringService.addBreadcrumb(`Page loaded in ${Math.round(loadTime)}ms`, 'info');
    }

    // Report initial bundle size (approximate)
    const scripts = document.querySelectorAll('script[src]');
    let totalScriptSize = 0;
    scripts.forEach((script) => {
      const src = script.getAttribute('src');
      if (src && !src.includes('http')) {
        // Estimate local script size (this is very approximate)
        totalScriptSize += 50000; // Rough estimate
      }
    });

    if (totalScriptSize > 0) {
      console.log('📦 Estimated bundle size:', (totalScriptSize / 1024).toFixed(1) + 'KB');
    }
  }

  /**
   * Show update available notification
   */
  private showUpdateAvailable(): void {
    // This could be a toast notification or modal
    console.log('🔄 App update available - reload to get the latest version');
    
    // You could implement a user-friendly update mechanism here
    // For now, just log it
  }

  /**
   * Get initialization status
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Get current config
   */
  getConfig(): WebInitializationConfig {
    return { ...this.config };
  }
}

// Create singleton instance
const webInitializer = new WebInitializer();

// Auto-initialize with default config when module is loaded
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      webInitializer.initialize();
    });
  } else {
    // DOM is already ready
    webInitializer.initialize();
  }
}

export default webInitializer;