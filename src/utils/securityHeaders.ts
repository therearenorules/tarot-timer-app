/**
 * Security Headers Configuration for Web Deployment
 * OWASP-compliant security headers with Tarot Timer specific policies
 */

export interface SecurityPolicy {
  'default-src': string[];
  'script-src': string[];
  'style-src': string[];
  'img-src': string[];
  'font-src': string[];
  'connect-src': string[];
  'media-src': string[];
  'object-src': string[];
  'base-uri': string[];
  'form-action': string[];
  'frame-ancestors': string[];
  'block-all-mixed-content': boolean;
  'upgrade-insecure-requests': boolean;
}

// Content Security Policy for Tarot Timer App
export const contentSecurityPolicy: SecurityPolicy = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for Expo/React Native Web
    "'unsafe-eval'", // Required for development and some Metro features
    'https://cdn.jsdelivr.net',
    'https://unpkg.com',
    // Analytics and monitoring (if used)
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com',
    // PWA and service worker
    "'strict-dynamic'",
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for styled-components and inline styles
    'https://fonts.googleapis.com',
    'https://cdn.jsdelivr.net',
  ],
  'img-src': [
    "'self'",
    'data:', // For base64 encoded images and tarot card assets
    'blob:', // For generated images and canvas
    'https:', // External tarot card images if any
    // Tarot-specific image sources
    'https://images.unsplash.com', // If using Unsplash for mystical images
    'https://pixabay.com', // If using Pixabay for tarot imagery
  ],
  'font-src': [
    "'self'",
    'data:', // For embedded fonts
    'https://fonts.gstatic.com',
    'https://cdn.jsdelivr.net',
  ],
  'connect-src': [
    "'self'",
    // API endpoints for tarot data
    process.env.EXPO_PUBLIC_API_URL || 'https://api.tarot-timer.com',
    // WebSocket connections for real-time features
    process.env.EXPO_PUBLIC_WS_URL || 'wss://ws.tarot-timer.com',
    // Analytics
    'https://www.google-analytics.com',
    // Error reporting
    'https://*.sentry.io',
    // Development
    ...(process.env.NODE_ENV !== 'production' ? ['ws://localhost:*', 'http://localhost:*'] : []),
  ],
  'media-src': [
    "'self'",
    'blob:', // For audio/video content
    'data:', // For embedded media
  ],
  'object-src': ["'none'"], // Prevent object/embed/applet
  'base-uri': ["'self'"], // Prevent base tag injection
  'form-action': ["'self'"], // Restrict form submissions
  'frame-ancestors': ["'none'"], // Prevent clickjacking
  'block-all-mixed-content': true, // Force HTTPS
  'upgrade-insecure-requests': true, // Upgrade HTTP to HTTPS
};

// Generate CSP header string
export function generateCSP(policy: SecurityPolicy): string {
  const directives = Object.entries(policy).map(([key, value]) => {
    if (typeof value === 'boolean') {
      return value ? key : '';
    }
    return `${key} ${value.join(' ')}`;
  }).filter(Boolean);

  return directives.join('; ');
}

// Security Headers for production deployment
export const securityHeaders = {
  // Content Security Policy
  'Content-Security-Policy': generateCSP(contentSecurityPolicy),
  
  // Strict Transport Security (HSTS)
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  
  // X-Frame-Options (backup for older browsers)
  'X-Frame-Options': 'DENY',
  
  // X-Content-Type-Options
  'X-Content-Type-Options': 'nosniff',
  
  // Referrer Policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // X-XSS-Protection (legacy browsers)
  'X-XSS-Protection': '1; mode=block',
  
  // Permissions Policy (Feature Policy replacement)
  'Permissions-Policy': [
    'camera=(), microphone=(), geolocation=(self)',
    'payment=(), usb=(), magnetometer=()',
    'accelerometer=(self), gyroscope=(self)',
    'notifications=(self), push=(self)',
    'vibrate=(self)', // For tarot reading vibration feedback
  ].join(', '),
  
  // Cross-Origin Policies
  'Cross-Origin-Embedder-Policy': 'credentialless',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  
  // Cache Control for static assets
  'Cache-Control': 'public, max-age=31536000, immutable',
  
  // Additional security headers
  'X-Permitted-Cross-Domain-Policies': 'none',
  'X-Robots-Tag': 'index, follow', // Allow search engines
  
  // Server identification (optional)
  'Server': 'Tarot-Timer-Web/1.0',
} as const;

// Development CSP (more permissive)
export const developmentCSP: SecurityPolicy = {
  ...contentSecurityPolicy,
  'script-src': [
    ...contentSecurityPolicy['script-src'],
    'http://localhost:*',
    "'unsafe-eval'", // Required for hot reloading
    'ws://localhost:*',
  ],
  'connect-src': [
    ...contentSecurityPolicy['connect-src'],
    'http://localhost:*',
    'ws://localhost:*',
    'wss://localhost:*',
  ],
  'img-src': [
    ...contentSecurityPolicy['img-src'],
    'http://localhost:*',
  ],
};

// Get appropriate headers based on environment
export function getSecurityHeaders(isDevelopment = false) {
  const csp = isDevelopment ? developmentCSP : contentSecurityPolicy;
  
  return {
    ...securityHeaders,
    'Content-Security-Policy': generateCSP(csp),
    ...(isDevelopment && {
      // More permissive cache control in development
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    }),
  };
}

// Helmet.js compatible configuration
export const helmetConfig = {
  contentSecurityPolicy: {
    directives: contentSecurityPolicy,
  },
  hsts: {
    maxAge: 63072000,
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  permissionsPolicy: {
    features: {
      camera: ["'none'"],
      microphone: ["'none'"],
      geolocation: ["'self'"],
      payment: ["'none'"],
      usb: ["'none'"],
      magnetometer: ["'none'"],
      accelerometer: ["'self'"],
      gyroscope: ["'self'"],
      notifications: ["'self'"],
      push: ["'self'"],
      vibrate: ["'self'"],
    },
  },
};

// Cloudflare Workers compatible headers
export const cloudflareHeaders = new Headers(getSecurityHeaders());

// Express.js middleware
export function securityHeadersMiddleware(req: any, res: any, next: any) {
  const isDev = process.env.NODE_ENV !== 'production';
  const headers = getSecurityHeaders(isDev);
  
  Object.entries(headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  
  next();
}

// Validate CSP configuration
export function validateCSP(policy: SecurityPolicy): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check for unsafe directives in production
  if (process.env.NODE_ENV === 'production') {
    if (policy['script-src'].includes("'unsafe-eval'")) {
      errors.push("'unsafe-eval' should be avoided in production");
    }
    
    if (policy['script-src'].includes('http://')) {
      errors.push('HTTP sources in script-src are insecure in production');
    }
  }
  
  // Check for required directives
  if (!policy['default-src'] || policy['default-src'].length === 0) {
    errors.push('default-src directive is required');
  }
  
  if (!policy['object-src'] || !policy['object-src'].includes("'none'")) {
    errors.push('object-src should be set to none for security');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

export default {
  contentSecurityPolicy,
  securityHeaders,
  getSecurityHeaders,
  helmetConfig,
  validateCSP,
  generateCSP,
};