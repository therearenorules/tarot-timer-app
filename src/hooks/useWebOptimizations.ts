/**
 * Web-specific optimizations hook
 * Provides platform-specific features and performance enhancements for web
 */

import { useEffect, useState, useCallback } from 'react';
import { Platform } from 'react-native';

interface WebOptimizations {
  isOnline: boolean;
  isVisible: boolean;
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  prefersDarkMode: boolean;
  installPrompt: any;
  isInstallable: boolean;
  connectionType: string;
  requestInstall: () => Promise<void>;
  prefetch: (url: string) => void;
}

export const useWebOptimizations = (): WebOptimizations => {
  const [isOnline, setIsOnline] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);
  const [prefersDarkMode, setPrefersDarkMode] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [connectionType, setConnectionType] = useState('unknown');

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    // Network status monitoring
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    // Page visibility monitoring
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    setIsVisible(!document.hidden);

    // Media queries for user preferences
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    
    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setPrefersHighContrast(e.matches);
    };
    
    const handleDarkModeChange = (e: MediaQueryListEvent) => {
      setPrefersDarkMode(e.matches);
    };
    
    reducedMotionQuery.addListener(handleReducedMotionChange);
    highContrastQuery.addListener(handleHighContrastChange);
    darkModeQuery.addListener(handleDarkModeChange);
    
    setPrefersReducedMotion(reducedMotionQuery.matches);
    setPrefersHighContrast(highContrastQuery.matches);
    setPrefersDarkMode(darkModeQuery.matches);

    // Connection type detection
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setConnectionType(connection.effectiveType || 'unknown');
      
      const handleConnectionChange = () => {
        setConnectionType(connection.effectiveType || 'unknown');
      };
      
      connection.addEventListener('change', handleConnectionChange);
    }

    // PWA install prompt handling
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
    };
    
    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setIsInstallable(false);
      console.log('Tarot Timer PWA was installed');
    };
    
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      reducedMotionQuery.removeListener(handleReducedMotionChange);
      highContrastQuery.removeListener(handleHighContrastChange);
      darkModeQuery.removeListener(handleDarkModeChange);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        connection.removeEventListener('change', () => {});
      }
    };
  }, []);

  // PWA installation handler
  const requestInstall = useCallback(async () => {
    if (!installPrompt) return;
    
    try {
      const result = await installPrompt.prompt();
      console.log('Install prompt result:', result);
      
      if (result.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      setInstallPrompt(null);
      setIsInstallable(false);
    } catch (error) {
      console.error('Error during PWA installation:', error);
    }
  }, [installPrompt]);

  // Resource prefetching
  const prefetch = useCallback((url: string) => {
    if (Platform.OS !== 'web') return;
    
    try {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
      
      // Clean up after some time
      setTimeout(() => {
        if (link.parentNode) {
          link.parentNode.removeChild(link);
        }
      }, 60000);
    } catch (error) {
      console.warn('Failed to prefetch resource:', url, error);
    }
  }, []);

  return {
    isOnline,
    isVisible,
    prefersReducedMotion,
    prefersHighContrast,
    prefersDarkMode,
    installPrompt,
    isInstallable,
    connectionType,
    requestInstall,
    prefetch,
  };
};

// Utility functions for web optimizations
export const webOptimizationUtils = {
  // Lazy load images
  setupLazyLoading: () => {
    if (Platform.OS !== 'web' || !('IntersectionObserver' in window)) return;
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
          }
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
    
    return imageObserver;
  },
  
  // Optimize for Core Web Vitals
  measureCLS: () => {
    if (Platform.OS !== 'web' || !('PerformanceObserver' in window)) return;
    
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      
      console.log('Current CLS value:', clsValue);
    });
    
    clsObserver.observe({ type: 'layout-shift', buffered: true });
    
    return clsObserver;
  },
  
  // Critical resource hints
  addResourceHints: () => {
    if (Platform.OS !== 'web') return;
    
    const hints = [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
    ];
    
    hints.forEach(hint => {
      const link = document.createElement('link');
      link.rel = hint.rel;
      link.href = hint.href;
      if (hint.rel === 'preconnect') {
        link.crossOrigin = 'anonymous';
      }
      document.head.appendChild(link);
    });
  },
  
  // Service Worker registration with error handling
  registerServiceWorker: async () => {
    if (Platform.OS !== 'web' || !('serviceWorker' in navigator)) {
      console.log('Service Workers not supported');
      return;
    }
    
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      registration.addEventListener('updatefound', () => {
        console.log('New service worker is installing...');
        
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('New content is available; please refresh.');
              // You could show a notification to the user here
            }
          });
        }
      });
      
      console.log('Service Worker registered successfully');
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      throw error;
    }
  }
};

export default useWebOptimizations;