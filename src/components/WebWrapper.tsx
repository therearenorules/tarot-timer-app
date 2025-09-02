/**
 * Web-specific wrapper component
 * Provides platform-specific optimizations, accessibility, and PWA features
 */

import React, { useEffect, ReactNode } from 'react';
import { Platform } from 'react-native';
import useWebOptimizations, { webOptimizationUtils } from '../hooks/useWebOptimizations';

interface WebWrapperProps {
  children: ReactNode;
  className?: string;
}

export const WebWrapper: React.FC<WebWrapperProps> = ({ 
  children, 
  className = '' 
}) => {
  const {
    isOnline,
    isVisible,
    prefersReducedMotion,
    prefersHighContrast,
    prefersDarkMode,
    isInstallable,
    connectionType,
    requestInstall
  } = useWebOptimizations();

  useEffect(() => {
    if (Platform.OS !== 'web') return;

    // Initialize web optimizations
    const initWebOptimizations = async () => {
      try {
        // Register service worker
        await webOptimizationUtils.registerServiceWorker();
        
        // Setup resource hints
        webOptimizationUtils.addResourceHints();
        
        // Setup lazy loading for images
        webOptimizationUtils.setupLazyLoading();
        
        // Measure Core Web Vitals
        webOptimizationUtils.measureCLS();
        
        console.log('Web optimizations initialized successfully');
      } catch (error) {
        console.warn('Some web optimizations failed to initialize:', error);
      }
    };

    initWebOptimizations();

    // Apply CSS classes based on user preferences
    const documentElement = document.documentElement;
    
    // Remove existing preference classes
    documentElement.classList.remove(
      'reduced-motion', 
      'high-contrast', 
      'dark-mode', 
      'offline'
    );
    
    // Apply current preferences
    if (prefersReducedMotion) {
      documentElement.classList.add('reduced-motion');
    }
    
    if (prefersHighContrast) {
      documentElement.classList.add('high-contrast');
    }
    
    if (prefersDarkMode) {
      documentElement.classList.add('dark-mode');
    }
    
    if (!isOnline) {
      documentElement.classList.add('offline');
    }
    
    // Update connection type data attribute for CSS targeting
    documentElement.setAttribute('data-connection', connectionType);
    
  }, [isOnline, prefersReducedMotion, prefersHighContrast, prefersDarkMode, connectionType]);

  // Web-specific effects
  useEffect(() => {
    if (Platform.OS !== 'web') return;

    // Page visibility API integration
    if (!isVisible) {
      // Pause expensive operations when page is not visible
      console.log('Page hidden, pausing expensive operations');
    } else {
      console.log('Page visible, resuming operations');
    }
  }, [isVisible]);

  // Don't render wrapper on non-web platforms
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  return (
    <div 
      className={`web-wrapper ${className}`.trim()}
      data-online={isOnline}
      data-connection={connectionType}
      data-reduced-motion={prefersReducedMotion}
      data-high-contrast={prefersHighContrast}
      data-dark-mode={prefersDarkMode}
      role="application"
      aria-label="타로 타이머 애플리케이션"
    >
      {/* Offline notification */}
      {!isOnline && (
        <div 
          className="offline-banner"
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            background: '#f59e0b',
            color: '#000',
            padding: '8px 16px',
            textAlign: 'center',
            zIndex: 10000,
            fontSize: '14px',
            fontWeight: 500
          }}
        >
          🌐 오프라인 모드 - 일부 기능이 제한될 수 있습니다
        </div>
      )}

      {/* PWA install prompt */}
      {isInstallable && (
        <div
          className="install-prompt"
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: 'var(--color-primary)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: 'var(--shadow-lg)',
            zIndex: 9999,
            maxWidth: '300px'
          }}
        >
          <div style={{ marginBottom: '8px', fontSize: '14px' }}>
            홈 화면에 타로 타이머를 추가하세요!
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={requestInstall}
              style={{
                background: 'white',
                color: 'var(--color-primary)',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              설치
            </button>
            <button
              onClick={() => {
                // Hide install prompt (you could store this in localStorage)
                document.querySelector('.install-prompt')?.remove();
              }}
              style={{
                background: 'transparent',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.3)',
                padding: '6px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              나중에
            </button>
          </div>
        </div>
      )}

      {/* Slow connection warning */}
      {connectionType === 'slow-2g' && (
        <div
          className="slow-connection-warning"
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            top: isOnline ? '0' : '40px',
            left: 0,
            right: 0,
            background: '#ef4444',
            color: 'white',
            padding: '8px 16px',
            textAlign: 'center',
            zIndex: 9999,
            fontSize: '14px'
          }}
        >
          📶 느린 연결이 감지되었습니다. 일부 기능이 느려질 수 있습니다.
        </div>
      )}

      {/* Main application content */}
      {children}

      {/* Web-specific styles injection */}
      <style jsx>{`
        .web-wrapper {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        /* Connection-specific optimizations */
        .web-wrapper[data-connection="slow-2g"] img,
        .web-wrapper[data-connection="2g"] img {
          /* Reduce image quality for slow connections */
          image-rendering: optimizeSpeed;
        }
        
        .web-wrapper[data-connection="4g"] img {
          /* High quality for fast connections */
          image-rendering: optimizeQuality;
        }
        
        /* Reduced motion optimizations */
        .web-wrapper[data-reduced-motion="true"] * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
        
        /* High contrast optimizations */
        .web-wrapper[data-high-contrast="true"] {
          --color-primary: #ffffff;
          --color-background: #000000;
          --shadow-md: 0 0 0 2px #ffffff;
        }
        
        /* Dark mode optimizations */
        .web-wrapper[data-dark-mode="true"] {
          --color-background: #0d1117;
          --color-background-light: #161b22;
        }
        
        /* Offline mode styling */
        .web-wrapper[data-online="false"] {
          filter: grayscale(0.3);
        }
        
        /* Focus management for keyboard navigation */
        .web-wrapper:focus-within {
          outline: none;
        }
        
        /* Loading states for web */
        .web-wrapper.loading {
          cursor: wait;
        }
        
        .web-wrapper.loading * {
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default WebWrapper;