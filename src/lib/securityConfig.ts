/**
 * Security Configuration for Web Platform
 * Implements OWASP security best practices for Tarot Timer app
 */

import { Platform } from 'react-native';

export interface SecurityConfig {
  enableSecurityHeaders: boolean;
  contentSecurityPolicy: string;
  enforceHttps: boolean;
  enableHSTS: boolean;
  preventClickjacking: boolean;
  blockMixedContent: boolean;
  enableSRI: boolean; // Subresource Integrity
}

// Production security configuration
export const PRODUCTION_SECURITY: SecurityConfig = {
  enableSecurityHeaders: true,
  contentSecurityPolicy: `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'strict-dynamic' https://cdn.jsdelivr.net;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: blob: https:;
    font-src 'self' data: https://fonts.gstatic.com;
    connect-src 'self' https:;
    media-src 'self' blob: data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `.replace(/\s+/g, ' ').trim(),
  enforceHttps: true,
  enableHSTS: true,
  preventClickjacking: true,
  blockMixedContent: true,
  enableSRI: true,
};

// Development security configuration (more permissive)
export const DEVELOPMENT_SECURITY: SecurityConfig = {
  enableSecurityHeaders: true,
  contentSecurityPolicy: `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* ws://localhost:*;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' data: blob: https: http://localhost:*;
    font-src 'self' data: https://fonts.gstatic.com;
    connect-src 'self' https: http://localhost:* ws://localhost:* wss://localhost:*;
    media-src 'self' blob: data:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
  `.replace(/\s+/g, ' ').trim(),
  enforceHttps: false,
  enableHSTS: false,
  preventClickjacking: true,
  blockMixedContent: false,
  enableSRI: false,
};

// Get current security configuration based on environment
export function getSecurityConfig(): SecurityConfig {
  const isProduction = process.env.NODE_ENV === 'production';
  return isProduction ? PRODUCTION_SECURITY : DEVELOPMENT_SECURITY;
}

// Security utilities for web platform
export const SecurityUtils = {
  /**
   * Apply security headers to document meta tags
   */
  applySecurityHeaders(): void {
    if (Platform.OS !== 'web') return;

    const config = getSecurityConfig();
    
    // Content Security Policy
    if (config.enableSecurityHeaders && config.contentSecurityPolicy) {
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = config.contentSecurityPolicy;
      document.head.appendChild(cspMeta);
    }

    // X-Content-Type-Options
    const nosniffMeta = document.createElement('meta');
    nosniffMeta.httpEquiv = 'X-Content-Type-Options';
    nosniffMeta.content = 'nosniff';
    document.head.appendChild(nosniffMeta);

    // Referrer Policy
    const referrerMeta = document.createElement('meta');
    referrerMeta.name = 'referrer';
    referrerMeta.content = 'strict-origin-when-cross-origin';
    document.head.appendChild(referrerMeta);
  },

  /**
   * Validate external resources before loading
   */
  validateExternalResource(url: string): boolean {
    if (Platform.OS !== 'web') return true;

    try {
      const urlObj = new URL(url);
      const config = getSecurityConfig();

      // In production, only allow HTTPS
      if (config.enforceHttps && urlObj.protocol !== 'https:') {
        console.warn(`Security: Blocked insecure resource: ${url}`);
        return false;
      }

      // Allow local resources in development
      if (process.env.NODE_ENV !== 'production' && urlObj.hostname === 'localhost') {
        return true;
      }

      // Whitelist of allowed domains for tarot app
      const allowedDomains = [
        'fonts.googleapis.com',
        'fonts.gstatic.com',
        'cdn.jsdelivr.net',
        'unpkg.com',
        'images.unsplash.com',
        'api.tarot-timer.com',
        'ws.tarot-timer.com',
      ];

      return allowedDomains.some(domain => urlObj.hostname.includes(domain));
    } catch (error) {
      console.warn(`Security: Invalid URL: ${url}`);
      return false;
    }
  },

  /**
   * Sanitize user input to prevent XSS
   */
  sanitizeInput(input: string): string {
    if (Platform.OS !== 'web') return input;

    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  },

  /**
   * Generate nonce for inline scripts (CSP)
   */
  generateNonce(): string {
    if (Platform.OS !== 'web') return '';

    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  },

  /**
   * Check if running in secure context
   */
  isSecureContext(): boolean {
    if (Platform.OS !== 'web') return true;

    return (
      window.isSecureContext ||
      location.protocol === 'https:' ||
      location.hostname === 'localhost' ||
      location.hostname === '127.0.0.1'
    );
  },

  /**
   * Initialize security measures
   */
  initialize(): void {
    if (Platform.OS !== 'web') return;

    this.applySecurityHeaders();

    // Warn if not in secure context in production
    if (process.env.NODE_ENV === 'production' && !this.isSecureContext()) {
      console.warn('Security: App is not running in a secure context (HTTPS)');
    }

    // Add integrity checks for critical scripts
    this.addIntegrityChecks();

    // Set up CSP violation reporting
    this.setupCSPReporting();
  },

  /**
   * Add integrity checks for external scripts
   */
  addIntegrityChecks(): void {
    if (Platform.OS !== 'web' || !getSecurityConfig().enableSRI) return;

    const scripts = document.querySelectorAll('script[src]');
    scripts.forEach((script) => {
      const src = script.getAttribute('src');
      if (src && src.includes('cdn.')) {
        // In a real implementation, you would have pre-computed SRI hashes
        // For now, we'll just add the crossorigin attribute
        script.setAttribute('crossorigin', 'anonymous');
      }
    });
  },

  /**
   * Set up CSP violation reporting
   */
  setupCSPReporting(): void {
    if (Platform.OS !== 'web') return;

    document.addEventListener('securitypolicyviolation', (event) => {
      console.warn('CSP Violation:', {
        blockedURI: event.blockedURI,
        violatedDirective: event.violatedDirective,
        originalPolicy: event.originalPolicy,
        documentURI: event.documentURI,
        referrer: event.referrer,
        lineNumber: event.lineNumber,
        columnNumber: event.columnNumber,
        sourceFile: event.sourceFile,
      });

      // In production, you might want to send this to an error reporting service
      if (process.env.NODE_ENV === 'production') {
        // Example: Send to error reporting service
        // errorReporting.captureException(new Error('CSP Violation'), { extra: event });
      }
    });
  },
};

// Hook for React components to use security utilities
export function useSecurityConfig() {
  const config = getSecurityConfig();

  return {
    config,
    isSecureContext: SecurityUtils.isSecureContext(),
    sanitizeInput: SecurityUtils.sanitizeInput,
    validateResource: SecurityUtils.validateExternalResource,
    generateNonce: SecurityUtils.generateNonce,
  };
}

// Initialize security when module is loaded (web only)
if (Platform.OS === 'web' && typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      SecurityUtils.initialize();
    });
  } else {
    SecurityUtils.initialize();
  }
}

export default SecurityUtils;