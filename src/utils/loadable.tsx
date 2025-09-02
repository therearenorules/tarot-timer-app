/**
 * Advanced Code Splitting Utility
 * Provides loadable components with error boundaries and loading states
 */

import React, { Suspense, ComponentType, LazyExoticComponent, ReactNode } from 'react';
import { Platform } from 'react-native';

interface LoadableOptions {
  fallback?: ReactNode;
  errorFallback?: ComponentType<{ error: Error; retry: () => void }>;
  delay?: number;
  timeout?: number;
  ssr?: boolean;
  webpackChunkName?: string;
}

interface LoadableComponent<T = {}> extends LazyExoticComponent<ComponentType<T>> {
  preload: () => Promise<{ default: ComponentType<T> }>;
}

// Default loading component
const DefaultLoadingComponent: React.FC = () => (
  <div 
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      color: '#6366f1'
    }}
  >
    <div style={{ 
      animation: 'spin 1s linear infinite',
      width: '32px', 
      height: '32px',
      border: '3px solid #e5e7eb',
      borderTop: '3px solid #6366f1',
      borderRadius: '50%'
    }} />
  </div>
);

// Default error boundary component
const DefaultErrorComponent: React.FC<{ error: Error; retry: () => void }> = ({ error, retry }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    padding: '20px',
    textAlign: 'center',
    color: '#ef4444'
  }}>
    <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
    <h3 style={{ marginBottom: '8px', color: '#1f2937' }}>Failed to load component</h3>
    <p style={{ marginBottom: '16px', color: '#6b7280', fontSize: '14px' }}>
      {error.message || 'Something went wrong while loading this component.'}
    </p>
    <button
      onClick={retry}
      style={{
        padding: '8px 16px',
        backgroundColor: '#6366f1',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px'
      }}
    >
      Retry
    </button>
  </div>
);

// Error boundary for lazy components
class LazyErrorBoundary extends React.Component<
  { 
    fallback: ComponentType<{ error: Error; retry: () => void }>;
    children: ReactNode;
    onRetry: () => void;
  },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy component error:', error, errorInfo);
    
    // Report to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: Sentry.captureException(error, { extra: errorInfo });
    }
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
    this.props.onRetry();
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const ErrorComponent = this.props.fallback;
      return <ErrorComponent error={this.state.error} retry={this.retry} />;
    }

    return this.props.children;
  }
}

/**
 * Creates a loadable component with advanced features
 */
export function loadable<T = {}>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  options: LoadableOptions = {}
): LoadableComponent<T> {
  const {
    fallback = <DefaultLoadingComponent />,
    errorFallback = DefaultErrorComponent,
    delay = 200,
    timeout = 10000,
    ssr = false,
    webpackChunkName
  } = options;

  // For non-web platforms, return the component directly
  if (Platform.OS !== 'web') {
    const DirectComponent = React.lazy(importFunc);
    (DirectComponent as any).preload = importFunc;
    return DirectComponent as LoadableComponent<T>;
  }

  // Add webpack magic comment for chunk naming
  const enhancedImportFunc = webpackChunkName
    ? () => import(/* webpackChunkName: "[webpackChunkName]" */ importFunc() as any)
    : importFunc;

  const LazyComponent = React.lazy(() => {
    let importPromise = enhancedImportFunc();

    // Add timeout
    if (timeout > 0) {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`Component load timeout after ${timeout}ms`));
        }, timeout);
      });

      importPromise = Promise.race([importPromise, timeoutPromise]);
    }

    return importPromise;
  });

  const LoadableWrapper: ComponentType<T> = (props) => {
    const [retryCount, setRetryCount] = React.useState(0);

    const handleRetry = React.useCallback(() => {
      setRetryCount(prev => prev + 1);
    }, []);

    return (
      <LazyErrorBoundary 
        fallback={errorFallback} 
        onRetry={handleRetry}
        key={retryCount} // Force re-mount on retry
      >
        <Suspense fallback={fallback}>
          <LazyComponent {...props} />
        </Suspense>
      </LazyErrorBoundary>
    );
  };

  // Add preload method
  const LoadableComponent = LoadableWrapper as LoadableComponent<T>;
  LoadableComponent.preload = enhancedImportFunc;

  return LoadableComponent;
}

/**
 * HOC for creating route-based code splits
 */
export function createRouteComponent<T = {}>(
  importFunc: () => Promise<{ default: ComponentType<T> }>,
  routeName: string
): LoadableComponent<T> {
  return loadable(importFunc, {
    webpackChunkName: `route-${routeName}`,
    fallback: (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#1a1f3a',
        color: '#ffffff'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            animation: 'spin 1s linear infinite',
            width: '48px', 
            height: '48px',
            border: '4px solid rgba(255,255,255,0.1)',
            borderTop: '4px solid #6366f1',
            borderRadius: '50%',
            margin: '0 auto 16px'
          }} />
          <div style={{ fontSize: '18px', fontWeight: 500 }}>
            Loading {routeName}...
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', marginTop: '8px' }}>
            🔮 Preparing your mystical experience
          </div>
        </div>
      </div>
    ),
    timeout: 15000 // Longer timeout for routes
  });
}

/**
 * Preloader utility for critical components
 */
export class ComponentPreloader {
  private static preloadedComponents = new Set<string>();
  private static preloadPromises = new Map<string, Promise<any>>();

  static async preload(
    componentName: string,
    loadableComponent: LoadableComponent<any>
  ): Promise<void> {
    if (this.preloadedComponents.has(componentName)) {
      return;
    }

    if (this.preloadPromises.has(componentName)) {
      return this.preloadPromises.get(componentName);
    }

    const preloadPromise = loadableComponent
      .preload()
      .then(() => {
        this.preloadedComponents.add(componentName);
        this.preloadPromises.delete(componentName);
      })
      .catch(error => {
        console.error(`Failed to preload ${componentName}:`, error);
        this.preloadPromises.delete(componentName);
        throw error;
      });

    this.preloadPromises.set(componentName, preloadPromise);
    return preloadPromise;
  }

  static async preloadCriticalComponents(components: Array<{
    name: string;
    component: LoadableComponent<any>;
  }>): Promise<void> {
    await Promise.allSettled(
      components.map(({ name, component }) => this.preload(name, component))
    );
  }

  static isPreloaded(componentName: string): boolean {
    return this.preloadedComponents.has(componentName);
  }

  static clear(): void {
    this.preloadedComponents.clear();
    this.preloadPromises.clear();
  }
}

/**
 * Hook for preloading components on interaction
 */
export function useComponentPreloader() {
  const preloadOnInteraction = React.useCallback(
    (componentName: string, loadableComponent: LoadableComponent<any>) => {
      return {
        onMouseEnter: () => ComponentPreloader.preload(componentName, loadableComponent),
        onTouchStart: () => ComponentPreloader.preload(componentName, loadableComponent),
        onFocus: () => ComponentPreloader.preload(componentName, loadableComponent),
      };
    },
    []
  );

  return { preloadOnInteraction };
}

// CSS injection for animations
if (Platform.OS === 'web') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `;
  document.head.appendChild(style);
}

export default loadable;