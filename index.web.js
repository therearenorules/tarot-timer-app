/**
 * Web-specific entry point for Tarot Timer App
 * Enhanced with security, performance, and accessibility features
 */

import React from 'react';
import { AppRegistry, Platform } from 'react-native';
import App from './src/app/_layout';

// Web-specific polyfills and optimizations
if (Platform.OS === 'web') {
  // Polyfill for older browsers
  if (!window.requestIdleCallback) {
    window.requestIdleCallback = function(cb) {
      return setTimeout(cb, 1);
    };
  }
  
  // Enhanced error boundary for web
  window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
    // You could send this to an error reporting service
  });
  
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // Prevent the default behavior to avoid console errors
    event.preventDefault();
  });
  
  // Performance monitoring
  if ('performance' in window) {
    window.addEventListener('load', () => {
      requestIdleCallback(() => {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
          console.log('Page load performance:', {
            domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
            loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
            totalTime: perfData.loadEventEnd - perfData.fetchStart
          });
        }
      });
    });
  }
  
  // Accessibility enhancements
  document.addEventListener('DOMContentLoaded', () => {
    // Set language attribute
    document.documentElement.lang = 'ko';
    
    // Add reduced motion preference handling
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('reduced-motion');
    }
    
    // Add high contrast preference handling
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      document.documentElement.classList.add('high-contrast');
    }
    
    // Add dark mode preference handling
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark-mode');
    }
  });
}

// Enhanced App component with error boundary
class AppWithErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('App error boundary caught:', error, errorInfo);
    // You could send this to an error reporting service
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#1a1f3a',
          color: '#ffffff',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔮</div>
          <h1 style={{ marginBottom: '16px' }}>앱에 문제가 발생했습니다</h1>
          <p style={{ marginBottom: '20px', opacity: 0.8 }}>
            페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6366f1',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            페이지 새로고침
          </button>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '20px', textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', marginBottom: '10px' }}>
                개발자 정보 (Development Only)
              </summary>
              <pre style={{ 
                backgroundColor: 'rgba(0,0,0,0.3)', 
                padding: '10px', 
                borderRadius: '4px',
                fontSize: '12px',
                overflow: 'auto',
                maxWidth: '80vw'
              }}>
                {this.state.error?.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }
    
    return <App {...this.props} />;
  }
}

// Register the app with error boundary
AppRegistry.registerComponent('main', () => AppWithErrorBoundary);

// Web-specific initialization with enhanced error handling
if (typeof document !== 'undefined') {
  const initializeApp = () => {
    try {
      const rootTag = document.getElementById('root') || document.getElementById('main');
      
      if (!rootTag) {
        throw new Error('Root element not found. Make sure there is an element with id="root" in your HTML.');
      }
      
      // Security: Validate root element
      if (rootTag.tagName !== 'DIV') {
        console.warn('Root element should be a div for optimal React Native Web compatibility');
      }
      
      // Initialize the React Native app
      AppRegistry.runApplication('main', { 
        rootTag,
        initialProps: {
          // Pass any initial props here
          platform: 'web',
          timestamp: Date.now()
        }
      });
      
      // Mark body as loaded (used by loading spinner)
      setTimeout(() => {
        document.body.classList.add('loaded');
      }, 100);
      
      console.log('Tarot Timer App initialized successfully on web platform');
      
    } catch (error) {
      console.error('Failed to initialize Tarot Timer App:', error);
      
      // Fallback error display
      const rootTag = document.getElementById('root');
      if (rootTag) {
        rootTag.innerHTML = `
          <div style="display: flex; align-items: center; justify-content: center; height: 100vh; text-align: center; padding: 20px; background: #1a1f3a; color: #ffffff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
            <div>
              <div style="font-size: 4rem; margin-bottom: 20px;">🔮</div>
              <h1>앱 로딩 중 오류가 발생했습니다</h1>
              <p style="opacity: 0.8; margin-bottom: 20px;">페이지를 새로고침해주세요.</p>
              <button onclick="window.location.reload()" style="padding: 12px 24px; background: #6366f1; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 16px;">
                새로고침
              </button>
            </div>
          </div>
        `;
      }
    }
  };
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
  } else {
    // DOM is already loaded
    initializeApp();
  }
}

// Export for potential use in testing or other environments
export default AppWithErrorBoundary;