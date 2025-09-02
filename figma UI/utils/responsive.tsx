import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * 📱 Responsive System Manager
 * 
 * Centralized responsive behavior management using design tokens.
 * Provides consistent breakpoint handling across all components.
 * 
 * Features:
 * - Design token-based breakpoints
 * - React hooks for responsive behavior
 * - Touch target optimization
 * - Safe area handling
 * - Accessibility compliance
 */

// Breakpoint definitions using design tokens
export const BREAKPOINTS = {
  small: 320,      // iPhone SE
  medium: 375,     // iPhone Standard
  large: 414,      // iPhone Plus
  xlarge: 768,     // iPad Portrait
  xxlarge: 1024,   // iPad Landscape
} as const;

export type BreakpointKey = keyof typeof BREAKPOINTS;
export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type Orientation = 'portrait' | 'landscape';

interface ResponsiveState {
  width: number;
  height: number;
  breakpoint: BreakpointKey;
  deviceType: DeviceType;
  orientation: Orientation;
  isTouch: boolean;
  safeAreaInsets: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

interface ResponsiveContextType extends ResponsiveState {
  isBreakpoint: (breakpoint: BreakpointKey) => boolean;
  isMinBreakpoint: (breakpoint: BreakpointKey) => boolean;
  isMaxBreakpoint: (breakpoint: BreakpointKey) => boolean;
  getSpacing: (size: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl') => string;
  getTouchTarget: () => string;
  getCardColumns: () => number;
  getSafeAreaPadding: () => React.CSSProperties;
}

const ResponsiveContext = createContext<ResponsiveContextType | null>(null);

/**
 * Get current breakpoint based on width
 */
function getCurrentBreakpoint(width: number): BreakpointKey {
  if (width >= BREAKPOINTS.xxlarge) return 'xxlarge';
  if (width >= BREAKPOINTS.xlarge) return 'xlarge';
  if (width >= BREAKPOINTS.large) return 'large';
  if (width >= BREAKPOINTS.medium) return 'medium';
  return 'small';
}

/**
 * Get device type based on width and touch capability
 */
function getDeviceType(width: number, isTouch: boolean): DeviceType {
  if (width >= BREAKPOINTS.xlarge) return 'tablet';
  if (width >= BREAKPOINTS.medium && !isTouch) return 'desktop';
  return 'mobile';
}

/**
 * Get safe area insets (iOS notch/home indicator)
 */
function getSafeAreaInsets() {
  // In real implementation, would check CSS env() values
  // For now, return sensible defaults
  return {
    top: 44,    // Status bar + notch
    bottom: 34, // Home indicator
    left: 0,
    right: 0,
  };
}

/**
 * Responsive Provider Component
 */
export function ResponsiveProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ResponsiveState>(() => {
    // Initial state (will be updated on client)
    const width = typeof window !== 'undefined' ? window.innerWidth : 375;
    const height = typeof window !== 'undefined' ? window.innerHeight : 667;
    const isTouch = typeof window !== 'undefined' && 'ontouchstart' in window;
    
    return {
      width,
      height,
      breakpoint: getCurrentBreakpoint(width),
      deviceType: getDeviceType(width, isTouch),
      orientation: width > height ? 'landscape' : 'portrait',
      isTouch,
      safeAreaInsets: getSafeAreaInsets(),
    };
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isTouch = 'ontouchstart' in window;

      setState({
        width,
        height,
        breakpoint: getCurrentBreakpoint(width),
        deviceType: getDeviceType(width, isTouch),
        orientation: width > height ? 'landscape' : 'portrait',
        isTouch,
        safeAreaInsets: getSafeAreaInsets(),
      });
    };

    // Update on resize
    window.addEventListener('resize', updateDimensions);
    window.addEventListener('orientationchange', updateDimensions);

    // Initial update
    updateDimensions();

    return () => {
      window.removeEventListener('resize', updateDimensions);
      window.removeEventListener('orientationchange', updateDimensions);
    };
  }, []);

  const contextValue: ResponsiveContextType = {
    ...state,
    
    isBreakpoint: (breakpoint: BreakpointKey) => state.breakpoint === breakpoint,
    
    isMinBreakpoint: (breakpoint: BreakpointKey) => 
      state.width >= BREAKPOINTS[breakpoint],
    
    isMaxBreakpoint: (breakpoint: BreakpointKey) => 
      state.width <= BREAKPOINTS[breakpoint],
    
    getSpacing: (size: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl' | 'xxxl') => 
      `var(--space-${size})`,
    
    getTouchTarget: () => state.isTouch ? '44px' : '36px',
    
    getCardColumns: () => {
      if (state.width >= BREAKPOINTS.xxlarge) return 4;
      if (state.width >= BREAKPOINTS.xlarge) return 3;
      if (state.width >= BREAKPOINTS.large) return 2;
      return 2;
    },
    
    getSafeAreaPadding: () => ({
      paddingTop: `${state.safeAreaInsets.top}px`,
      paddingBottom: `${state.safeAreaInsets.bottom}px`,
      paddingLeft: `${state.safeAreaInsets.left}px`,
      paddingRight: `${state.safeAreaInsets.right}px`,
    }),
  };

  return (
    <ResponsiveContext.Provider value={contextValue}>
      {children}
    </ResponsiveContext.Provider>
  );
}

/**
 * Hook to access responsive context
 */
export function useResponsive(): ResponsiveContextType {
  const context = useContext(ResponsiveContext);
  if (!context) {
    throw new Error('useResponsive must be used within ResponsiveProvider');
  }
  return context;
}

/**
 * Hook for responsive values
 */
export function useResponsiveValue<T>(values: Partial<Record<BreakpointKey, T>>, defaultValue: T): T {
  const { breakpoint, width } = useResponsive();
  
  // Find the largest breakpoint that matches
  const sortedBreakpoints = (Object.keys(BREAKPOINTS) as BreakpointKey[])
    .sort((a, b) => BREAKPOINTS[b] - BREAKPOINTS[a]); // Largest first
  
  for (const bp of sortedBreakpoints) {
    if (width >= BREAKPOINTS[bp] && values[bp] !== undefined) {
      return values[bp]!;
    }
  }
  
  return defaultValue;
}

/**
 * Hook for responsive spacing
 */
export function useResponsiveSpacing(
  mobile: string,
  tablet?: string,
  desktop?: string
): string {
  const { deviceType } = useResponsive();
  
  switch (deviceType) {
    case 'desktop':
      return desktop || tablet || mobile;
    case 'tablet':
      return tablet || mobile;
    default:
      return mobile;
  }
}

/**
 * Responsive utility functions
 */
export const ResponsiveUtils = {
  /**
   * Get responsive grid columns based on screen size
   */
  getGridColumns: (width: number, minColumnWidth: number = 300): number => {
    return Math.max(1, Math.floor(width / minColumnWidth));
  },

  /**
   * Get responsive font size scale
   */
  getFontScale: (breakpoint: BreakpointKey): number => {
    switch (breakpoint) {
      case 'small': return 0.9;
      case 'medium': return 1.0;
      case 'large': return 1.1;
      case 'xlarge': return 1.2;
      case 'xxlarge': return 1.3;
      default: return 1.0;
    }
  },

  /**
   * Get responsive padding based on content type
   */
  getContentPadding: (breakpoint: BreakpointKey, contentType: 'tight' | 'normal' | 'loose' = 'normal'): string => {
    const basePadding = {
      tight: { mobile: 'var(--space-s)', tablet: 'var(--space-m)', desktop: 'var(--space-l)' },
      normal: { mobile: 'var(--space-m)', tablet: 'var(--space-l)', desktop: 'var(--space-xl)' },
      loose: { mobile: 'var(--space-l)', tablet: 'var(--space-xl)', desktop: 'var(--space-xxl)' },
    };

    if (['small', 'medium'].includes(breakpoint)) return basePadding[contentType].mobile;
    if (['large', 'xlarge'].includes(breakpoint)) return basePadding[contentType].tablet;
    return basePadding[contentType].desktop;
  },

  /**
   * Get responsive animation duration
   */
  getAnimationDuration: (isTouch: boolean, type: 'fast' | 'medium' | 'slow' = 'medium'): string => {
    const durations = {
      fast: isTouch ? '150ms' : '100ms',
      medium: isTouch ? '300ms' : '200ms',
      slow: isTouch ? '500ms' : '300ms',
    };
    return durations[type];
  },
};

/**
 * Responsive CSS helper functions
 */
export const ResponsiveCSS = {
  /**
   * Generate responsive styles object
   */
  responsive: (styles: Partial<Record<BreakpointKey, React.CSSProperties>>): React.CSSProperties => {
    // This would be implemented with CSS-in-JS or CSS variables in a real app
    // For now, return the medium breakpoint styles as default
    return styles.medium || styles.small || {};
  },

  /**
   * Generate container query styles
   */
  container: (maxWidth: number, padding: string = 'var(--space-m)'): React.CSSProperties => ({
    maxWidth: `${maxWidth}px`,
    margin: '0 auto',
    padding: `0 ${padding}`,
    width: '100%',
  }),

  /**
   * Generate safe area styles
   */
  safeArea: (insets: ResponsiveState['safeAreaInsets']): React.CSSProperties => ({
    paddingTop: `max(${insets.top}px, env(safe-area-inset-top))`,
    paddingBottom: `max(${insets.bottom}px, env(safe-area-inset-bottom))`,
    paddingLeft: `max(${insets.left}px, env(safe-area-inset-left))`,
    paddingRight: `max(${insets.right}px, env(safe-area-inset-right))`,
  }),
};

/**
 * Component for responsive containers
 */
interface ResponsiveContainerProps {
  children: React.ReactNode;
  maxWidth?: number;
  padding?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ResponsiveContainer({ 
  children, 
  maxWidth = 1200, 
  padding,
  className = '',
  style = {} 
}: ResponsiveContainerProps) {
  const { getSpacing } = useResponsive();
  
  const containerStyles: React.CSSProperties = {
    ...ResponsiveCSS.container(maxWidth, padding || getSpacing('m')),
    ...style,
  };

  return (
    <div className={className} style={containerStyles}>
      {children}
    </div>
  );
}