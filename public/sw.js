/**
 * Tarot Timer - Service Worker v1.3.0
 * PWA functionality with secure caching strategies and advanced extension filtering
 * Fixed Response constructor issues for 204 status codes - ALL RESPONSES NOW USE 200 STATUS
 * Enhanced caching with graceful error handling for missing files
 * Updated: 2025-09-03
 */

console.log('Service Worker v1.3.0 loaded - Response constructor fix + graceful caching applied');

// Handle skipWaiting message from client
self.addEventListener('message', event => {
  if (event.data && event.data.command === 'skipWaiting') {
    self.skipWaiting();
  }
});

// Import extension filter
importScripts('./sw-extension-filter.js');

const CACHE_NAME = 'tarot-timer-v1.0.0';
const STATIC_CACHE = 'tarot-timer-static-v1.0.0';
const DYNAMIC_CACHE = 'tarot-timer-dynamic-v1.0.0';

// Assets to cache on installation
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

// Security: Define allowed origins for caching
const ALLOWED_ORIGINS = [
  self.location.origin,
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://cdn.jsdelivr.net',
  'https://unpkg.com'
];

// Initialize advanced extension filter
const extensionFilter = new ServiceWorkerExtensionFilter({
  enableLogging: true,
  enableStats: true,
  enableWhitelist: false,
  logLevel: 'warn',
  maxLogEntries: 200,
  enablePersistentStats: false // Better for service worker performance
});

// Legacy blocked origins for fallback compatibility
const LEGACY_BLOCKED_ORIGINS = [
  'chrome-extension:',
  'moz-extension:',
  'safari-extension:',
  'edge-extension:',
  'ms-browser-extension:',
];

// Cache strategies
const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

/**
 * Service Worker Installation
 */
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(async cache => {
        console.log('Service Worker: Caching static assets');
        // Cache files individually to handle missing files gracefully
        const cachePromises = STATIC_ASSETS.map(async url => {
          try {
            await cache.add(url);
            console.log(`Service Worker: Cached ${url}`);
          } catch (error) {
            console.warn(`Service Worker: Failed to cache ${url}:`, error.message);
          }
        });
        
        await Promise.allSettled(cachePromises);
        console.log('Service Worker: Static assets caching completed');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Installation failed', error);
      })
  );
});

/**
 * Service Worker Activation
 */
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            // Clean up old caches
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Removing old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activated');
        return self.clients.claim();
      })
      .catch(error => {
        console.error('Service Worker: Activation failed', error);
      })
  );
});

/**
 * Enhanced Fetch Event Handler with Advanced Extension Filtering
 */
self.addEventListener('fetch', event => {
  const { request } = event;
  const { url, method } = request;
  
  // Security: Only handle GET requests
  if (method !== 'GET') {
    return;
  }
  
  // Advanced extension filtering
  const extensionAnalysis = extensionFilter.analyzeRequest(url, {
    method,
    initiator: request.referrer,
    destination: request.destination
  });
  
  if (extensionAnalysis.shouldBlock) {
    // Block detected extension requests with detailed logging
    event.respondWith(
      new Response('', {
        status: 200,
        statusText: 'Extension Blocked',
        headers: {
          'X-Block-Reason': extensionAnalysis.reason,
          'X-Extension-Type': extensionAnalysis.extensionType || 'unknown',
          'X-Confidence': extensionAnalysis.confidence.toString()
        }
      })
    );
    return;
  }
  
  // Legacy fallback check for additional safety
  const requestUrl = new URL(url);
  const isLegacyBlocked = LEGACY_BLOCKED_ORIGINS.some(blocked => url.startsWith(blocked));
  
  if (isLegacyBlocked && !extensionAnalysis.isExtension) {
    // Caught by legacy filter but not advanced filter - log for analysis
    console.warn('Service Worker: Legacy filter caught extension missed by advanced filter', {
      url,
      analysis: extensionAnalysis
    });
    event.respondWith(
      new Response('', {
        status: 200,
        statusText: 'Legacy Block'
      })
    );
    return;
  }
  
  // Allow same origin and whitelisted origins
  const isSameOrigin = requestUrl.origin === self.location.origin;
  const isAllowedOrigin = ALLOWED_ORIGINS.includes(requestUrl.origin);
  
  if (!isSameOrigin && !isAllowedOrigin) {
    // Log non-whitelisted origin with extension analysis context
    console.warn('Service Worker: Non-whitelisted origin', {
      origin: requestUrl.origin,
      url,
      extensionAnalysis
    });
    event.respondWith(
      new Response('', {
        status: 200,
        statusText: 'Origin Not Allowed'
      })
    );
    return;
  }
  
  // Skip non-HTTP requests
  if (!url.startsWith('http')) {
    event.respondWith(
      new Response('', {
        status: 200,
        statusText: 'Non-HTTP Protocol'
      })
    );
    return;
  }
  
  // Handle legitimate requests
  event.respondWith(
    handleFetchRequest(request)
      .catch(error => {
        console.error('Service Worker: Fetch failed', {
          url,
          error: error.message,
          extensionAnalysis
        });
        return handleFallback(request);
      })
  );
});

/**
 * Handle fetch requests with appropriate caching strategy
 */
async function handleFetchRequest(request) {
  const url = new URL(request.url);
  const { pathname } = url;
  
  // Route-based caching strategies
  if (pathname.match(/\.(js|css|woff|woff2|ttf|eot)$/)) {
    // Static assets: Cache First
    return cacheFirst(request, STATIC_CACHE);
  } else if (pathname.match(/\.(png|jpg|jpeg|gif|svg|ico|webp)$/)) {
    // Images and SVG icons: Cache First with longer TTL
    return cacheFirst(request, STATIC_CACHE);
  } else if (pathname.match(/\/api\//)) {
    // API calls: Return empty JSON for non-existent API endpoints
    return new Response('{"error": "API endpoint not implemented"}', {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  } else {
    // HTML pages: Stale While Revalidate
    return staleWhileRevalidate(request, DYNAMIC_CACHE);
  }
}

/**
 * Cache First Strategy
 */
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    const response = await fetch(request);
    
    if (response.status === 200) {
      await cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    console.warn('Service Worker: Cache first strategy failed', error);
    return new Response('Network Error', { 
      status: 408, 
      statusText: 'Request Timeout' 
    });
  }
}

/**
 * Network First Strategy
 */
async function networkFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    
    try {
      const response = await fetch(request);
      
      if (response.status === 200) {
        await cache.put(request, response.clone());
      }
      
      return response;
    } catch (networkError) {
      const cached = await cache.match(request);
      
      if (cached) {
        return cached;
      }
      
      console.warn('Service Worker: Network first strategy failed', networkError);
      return new Response('Network Error', { 
        status: 408, 
        statusText: 'Request Timeout' 
      });
    }
  } catch (error) {
    console.error('Service Worker: Network first strategy critical error', error);
    return new Response('Service Error', { 
      status: 500, 
      statusText: 'Internal Server Error' 
    });
  }
}

/**
 * Stale While Revalidate Strategy
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  // Background fetch to update cache with error handling
  const fetchPromise = fetch(request)
    .then(response => {
      if (response.status === 200) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(error => {
      console.warn('Service Worker: Background fetch failed', error);
      // Return cached version if network fails
      return cached || new Response('Network Error', { 
        status: 408, 
        statusText: 'Request Timeout' 
      });
    });
  
  // Return cached version immediately, or wait for network
  if (cached) {
    // Update cache in background but return cached version
    fetchPromise.catch(() => {}); // Silently handle background errors
    return cached;
  }
  
  // No cached version, wait for network
  return fetchPromise;
}

/**
 * Fallback handler for failed requests
 */
async function handleFallback(request) {
  const { destination } = request;
  
  if (destination === 'document') {
    // Return cached index.html for navigation requests
    const cache = await caches.open(STATIC_CACHE);
    return cache.match('/index.html');
  }
  
  // Return network error for other requests
  return new Response('Network Error', { 
    status: 408, 
    statusText: 'Network Error' 
  });
}

/**
 * Background Sync for offline actions
 */
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

/**
 * Handle background sync operations
 */
async function doBackgroundSync() {
  try {
    // Sync offline data when connection is restored
    console.log('Service Worker: Performing background sync');
    
    // Add your offline sync logic here
    // For example: sync saved tarot readings, timer data, etc.
    
  } catch (error) {
    console.error('Service Worker: Background sync failed', error);
  }
}

/**
 * Push notifications (for future premium features)
 */
self.addEventListener('push', event => {
  console.log('Service Worker: Push received', event);
  
  const options = {
    body: event.data ? event.data.text() : '새로운 타로 리딩이 준비되었습니다',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '확인하기',
        icon: '/icon-192.png'
      },
      {
        action: 'close',
        title: '닫기'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('타로 타이머', options)
  );
});

/**
 * Notification click handler
 */
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked', event);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    // Open or focus the app
    event.waitUntil(
      clients.matchAll().then(clientList => {
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
        return clients.openWindow('/');
      })
    );
  }
});

/**
 * Error handling with comprehensive logging
 */
self.addEventListener('error', event => {
  console.error('Service Worker: Global error', {
    message: event.error?.message,
    stack: event.error?.stack,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

self.addEventListener('unhandledrejection', event => {
  console.error('Service Worker: Unhandled promise rejection', {
    reason: event.reason,
    promise: event.promise
  });
  
  // Prevent the default behavior (which would log to console)
  event.preventDefault();
  
  // Optionally handle specific types of rejections
  if (event.reason instanceof TypeError && event.reason.message.includes('Failed to fetch')) {
    console.warn('Service Worker: Network fetch failed - this is expected for offline scenarios');
  }
});

// Extension Filter Monitoring and Debugging
/**
 * Message handler for extension filter management
 */
self.addEventListener('message', event => {
  const { data } = event;
  
  if (data && data.type === 'EXTENSION_FILTER_COMMAND') {
    switch (data.command) {
      case 'getStats':
        const stats = extensionFilter.getSummary();
        event.ports[0]?.postMessage({
          type: 'EXTENSION_FILTER_STATS',
          data: stats
        });
        break;
        
      case 'getLogs':
        const logs = extensionFilter.getLogs(data.limit || 50);
        event.ports[0]?.postMessage({
          type: 'EXTENSION_FILTER_LOGS',
          data: logs
        });
        break;
        
      case 'resetStats':
        extensionFilter.resetStats();
        event.ports[0]?.postMessage({
          type: 'EXTENSION_FILTER_RESET',
          data: 'Statistics reset successfully'
        });
        break;
        
      case 'testUrl':
        const testResult = extensionFilter.analyzeRequest(data.url);
        event.ports[0]?.postMessage({
          type: 'EXTENSION_FILTER_TEST',
          data: testResult
        });
        break;
        
      default:
        console.warn('Unknown extension filter command:', data.command);
    }
  }
});

/**
 * Periodic stats reporting (every 5 minutes)
 */
setInterval(() => {
  const stats = extensionFilter.getStats();
  if (stats.totalRequests > 0) {
    console.log('Service Worker Extension Filter Stats:', {
      totalRequests: stats.totalRequests,
      blockedRequests: stats.blockedRequests,
      blockRate: `${((stats.blockedRequests / stats.totalRequests) * 100).toFixed(1)}%`,
      topBlockedTypes: Object.entries(stats.extensionTypes)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3),
      uptime: extensionFilter.calculateUptime ? extensionFilter.calculateUptime() : 'N/A'
    });
  }
}, 5 * 60 * 1000); // 5 minutes

console.log('Service Worker: Loaded successfully with advanced extension filtering');
console.log('Extension Filter Configuration:', {
  logging: extensionFilter.config?.enableLogging,
  stats: extensionFilter.config?.enableStats,
  logLevel: extensionFilter.config?.logLevel,
  maxEntries: extensionFilter.config?.maxLogEntries
});