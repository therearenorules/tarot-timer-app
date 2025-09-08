import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * ♿ Accessibility System Manager
 * 
 * Comprehensive accessibility support for the tarot timer app.
 * Ensures WCAG 2.1 AA compliance across all components.
 * 
 * Features:
 * - Screen reader support
 * - Keyboard navigation
 * - High contrast mode
 * - Reduced motion preferences
 * - Focus management
 * - Color contrast validation
 */

interface AccessibilitySettings {
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  prefersDarkMode: boolean;
  screenReaderEnabled: boolean;
  keyboardNavigation: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  announcements: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  setFocusTrap: (element: HTMLElement | null) => void;
  isHighContrast: () => boolean;
  getAnimationDuration: () => string;
  getFocusStyles: () => React.CSSProperties;
  getHighContrastStyles: () => React.CSSProperties;
  validateColorContrast: (foreground: string, background: string) => boolean;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

/**
 * Screen Reader Announcer Component
 */
function ScreenReaderAnnouncer() {
  const [announcements, setAnnouncements] = useState<Array<{ id: string; message: string; priority: 'polite' | 'assertive' }>>([]);

  useEffect(() => {
    // Auto-clear announcements after they've been read
    if (announcements.length > 0) {
      const timer = setTimeout(() => {
        setAnnouncements(prev => prev.slice(1));
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [announcements]);

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const id = Math.random().toString(36).substr(2, 9);
    setAnnouncements(prev => [...prev, { id, message, priority }]);
  };

  return (
    <>
      {/* Polite announcements */}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        {announcements
          .filter(a => a.priority === 'polite')
          .map(announcement => (
            <div key={announcement.id}>{announcement.message}</div>
          ))
        }
      </div>

      {/* Assertive announcements */}
      <div
        aria-live="assertive"
        aria-atomic="true"
        style={{
          position: 'absolute',
          left: '-10000px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        {announcements
          .filter(a => a.priority === 'assertive')
          .map(announcement => (
            <div key={announcement.id}>{announcement.message}</div>
          ))
        }
      </div>
    </>
  );
}

/**
 * Focus Trap Manager
 */
class FocusTrapManager {
  private trapElement: HTMLElement | null = null;
  private previousActiveElement: Element | null = null;
  private focusableElements: HTMLElement[] = [];

  setTrap(element: HTMLElement | null) {
    if (this.trapElement) {
      this.clearTrap();
    }

    if (element) {
      this.trapElement = element;
      this.previousActiveElement = document.activeElement;
      this.updateFocusableElements();
      this.addEventListeners();
      this.focusFirstElement();
    }
  }

  clearTrap() {
    if (this.trapElement) {
      this.removeEventListeners();
      this.trapElement = null;
      
      if (this.previousActiveElement && this.previousActiveElement instanceof HTMLElement) {
        this.previousActiveElement.focus();
      }
      
      this.previousActiveElement = null;
      this.focusableElements = [];
    }
  }

  private updateFocusableElements() {
    if (!this.trapElement) return;

    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[role="button"]:not([disabled])',
    ].join(', ');

    this.focusableElements = Array.from(
      this.trapElement.querySelectorAll(focusableSelectors)
    ) as HTMLElement[];
  }

  private addEventListeners() {
    document.addEventListener('keydown', this.handleKeyDown);
  }

  private removeEventListeners() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  private handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab' || !this.trapElement) return;

    if (this.focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = this.focusableElements[0];
    const lastElement = this.focusableElements[this.focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  };

  private focusFirstElement() {
    if (this.focusableElements.length > 0) {
      this.focusableElements[0].focus();
    }
  }
}

/**
 * Color Contrast Validator
 */
class ColorContrastValidator {
  /**
   * Calculate relative luminance of a color
   */
  private getRelativeLuminance(color: string): number {
    const rgb = this.hexToRgb(color);
    if (!rgb) return 0;

    const [r, g, b] = rgb.map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * Convert hex color to RGB values
   */
  private hexToRgb(hex: string): [number, number, number] | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null;
  }

  /**
   * Calculate contrast ratio between two colors
   */
  getContrastRatio(color1: string, color2: string): number {
    const lum1 = this.getRelativeLuminance(color1);
    const lum2 = this.getRelativeLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  /**
   * Check if contrast ratio meets WCAG AA standards
   */
  meetsWCAGAA(foreground: string, background: string, isLargeText: boolean = false): boolean {
    const ratio = this.getContrastRatio(foreground, background);
    return isLargeText ? ratio >= 3.0 : ratio >= 4.5;
  }

  /**
   * Check if contrast ratio meets WCAG AAA standards
   */
  meetsWCAGAAA(foreground: string, background: string, isLargeText: boolean = false): boolean {
    const ratio = this.getContrastRatio(foreground, background);
    return isLargeText ? ratio >= 4.5 : ratio >= 7.0;
  }
}

/**
 * Accessibility Provider Component
 */
export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => ({
    prefersReducedMotion: false,
    prefersHighContrast: false,
    prefersDarkMode: false,
    screenReaderEnabled: false,
    keyboardNavigation: false,
    fontSize: 'medium',
    announcements: true,
  }));

  const [announcer, setAnnouncer] = useState<((message: string, priority?: 'polite' | 'assertive') => void) | null>(null);
  const [focusTrapManager] = useState(() => new FocusTrapManager());
  const [contrastValidator] = useState(() => new ColorContrastValidator());

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect user preferences
    const updateSettings = () => {
      setSettings(prev => ({
        ...prev,
        prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
        prefersDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
        screenReaderEnabled: window.navigator.userAgent.includes('NVDA') || 
                            window.navigator.userAgent.includes('JAWS') || 
                            window.navigator.userAgent.includes('VoiceOver'),
      }));
    };

    // Listen for preference changes
    const mediaQueries = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(prefers-contrast: high)'),
      window.matchMedia('(prefers-color-scheme: dark)'),
    ];

    mediaQueries.forEach(mq => mq.addEventListener('change', updateSettings));
    updateSettings();

    // Detect keyboard navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab') {
        setSettings(prev => ({ ...prev, keyboardNavigation: true }));
      }
    };

    const handleMouseDown = () => {
      setSettings(prev => ({ ...prev, keyboardNavigation: false }));
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      mediaQueries.forEach(mq => mq.removeEventListener('change', updateSettings));
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const contextValue: AccessibilityContextType = {
    settings,

    announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      if (announcer && settings.announcements) {
        announcer(message, priority);
      }
    },

    setFocusTrap: (element: HTMLElement | null) => {
      focusTrapManager.setTrap(element);
    },

    isHighContrast: () => settings.prefersHighContrast,

    getAnimationDuration: () => {
      return settings.prefersReducedMotion ? '0ms' : 'var(--animation-duration-medium, 300ms)';
    },

    getFocusStyles: (): React.CSSProperties => ({
      outline: settings.keyboardNavigation ? '2px solid var(--brand-accent)' : 'none',
      outlineOffset: '2px',
      boxShadow: settings.keyboardNavigation ? '0 0 0 2px rgba(212, 175, 55, 0.3)' : 'none',
    }),

    getHighContrastStyles: (): React.CSSProperties => {
      if (!settings.prefersHighContrast) return {};
      
      return {
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: 'var(--color-text-primary)',
        backgroundColor: 'var(--color-surface-base)',
        color: 'var(--color-text-primary)',
      };
    },

    validateColorContrast: (foreground: string, background: string): boolean => {
      return contrastValidator.meetsWCAGAA(foreground, background);
    },
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      <ScreenReaderAnnouncer />
      {children}
    </AccessibilityContext.Provider>
  );
}

/**
 * Hook to access accessibility context
 */
export function useAccessibility(): AccessibilityContextType {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
}

/**
 * Accessibility utility functions
 */
export const A11yUtils = {
  /**
   * Generate accessible label for screen readers
   */
  getAriaLabel: (context: string, value?: string, description?: string): string => {
    const parts = [context];
    if (value) parts.push(value);
    if (description) parts.push(description);
    return parts.join(', ');
  },

  /**
   * Get ARIA attributes for interactive elements
   */
  getAriaProps: (role: string, options: {
    label?: string;
    describedBy?: string;
    expanded?: boolean;
    selected?: boolean;
    disabled?: boolean;
    current?: boolean;
  } = {}) => ({
    role,
    'aria-label': options.label,
    'aria-describedby': options.describedBy,
    'aria-expanded': options.expanded,
    'aria-selected': options.selected,
    'aria-disabled': options.disabled,
    'aria-current': options.current ? 'page' : undefined,
    tabIndex: options.disabled ? -1 : 0,
  }),

  /**
   * Generate accessible card attributes
   */
  getCardAriaProps: (cardName: string, position?: string, isRevealed: boolean = true) => ({
    role: 'button',
    'aria-label': A11yUtils.getAriaLabel(
      '타로 카드',
      isRevealed ? cardName : '뒤집힌 카드',
      position ? `위치: ${position}` : undefined
    ),
    'aria-describedby': isRevealed ? undefined : 'card-help-text',
    tabIndex: 0,
  }),

  /**
   * Generate accessible navigation attributes
   */
  getNavAriaProps: (label: string, isActive: boolean, index: number, total: number) => ({
    role: 'tab',
    'aria-label': label,
    'aria-selected': isActive,
    'aria-setsize': total,
    'aria-posinset': index + 1,
    tabIndex: isActive ? 0 : -1,
  }),

  /**
   * Generate accessible form attributes
   */
  getFormAriaProps: (label: string, error?: string, required: boolean = false) => ({
    'aria-label': label,
    'aria-invalid': !!error,
    'aria-describedby': error ? `${label}-error` : undefined,
    'aria-required': required,
  }),
};

/**
 * Accessibility HOC for components
 */
export function withAccessibility<T extends object>(
  Component: React.ComponentType<T>
): React.ComponentType<T> {
  return function AccessibleComponent(props: T) {
    const { getFocusStyles, getHighContrastStyles } = useAccessibility();
    
    const accessibleProps = {
      ...props,
      style: {
        ...(props as any).style,
        ...getFocusStyles(),
        ...getHighContrastStyles(),
      },
    };

    return <Component {...accessibleProps} />;
  };
}

/**
 * Accessible Skip Link Component
 */
interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

export function SkipLink({ href, children }: SkipLinkProps) {
  const { getFocusStyles } = useAccessibility();

  const skipLinkStyles: React.CSSProperties = {
    position: 'absolute',
    top: '-40px',
    left: '16px',
    backgroundColor: 'var(--brand-primary)',
    color: 'var(--brand-white)',
    padding: 'var(--space-s) var(--space-m)',
    borderRadius: 'var(--radius-medium)',
    textDecoration: 'none',
    fontSize: 'var(--text-body-medium)',
    fontWeight: 'var(--font-weight-medium)',
    zIndex: 1000,
    transition: 'top 0.3s ease',
    ...getFocusStyles(),
  };

  const visibleStyles: React.CSSProperties = {
    top: '16px',
  };

  return (
    <a
      href={href}
      style={skipLinkStyles}
      onFocus={(e) => {
        e.currentTarget.style.top = '16px';
      }}
      onBlur={(e) => {
        e.currentTarget.style.top = '-40px';
      }}
    >
      {children}
    </a>
  );
}