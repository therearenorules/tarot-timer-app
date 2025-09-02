/**
 * Tarot Timer - Service Worker
 * PWA functionality with secure caching strategies
 */

const CACHE_NAME = 'tarot-timer-v1.0.0';
const STATIC_CACHE = 'tarot-timer-static-v1.0.0';
const DYNAMIC_CACHE = 'tarot-timer-dynamic-v1.0.0';

// Assets to cache on installation
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
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
  'https://fonts.gstatic.com'
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
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached');
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
 * Fetch Event Handler with Security Validation
 */
self.addEventListener('fetch', event => {
  const { request } = event;
  const { url, method } = request;
  
  // Security: Only handle GET requests
  if (method !== 'GET') {
    return;
  }
  
  // Security: Validate origin
  const requestUrl = new URL(url);
  if (!ALLOWED_ORIGINS.includes(requestUrl.origin)) {
    console.warn('Service Worker: Blocked request to unauthorized origin', requestUrl.origin);
    return;
  }
  
  // Skip non-HTTP requests
  if (!url.startsWith('http')) {
    return;
  }
  
  event.respondWith(
    handleFetchRequest(request)
      .catch(error => {
        console.error('Service Worker: Fetch failed', error);
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
  } else if (pathname.match(/\.(png|jpg|jpeg|gif|svg|ico)$/)) {
    // Images: Cache First with longer TTL
    return cacheFirst(request, STATIC_CACHE);
  } else if (pathname.match(/\/api\//)) {
    // API calls: Network First
    return networkFirst(request, DYNAMIC_CACHE);
  } else {
    // HTML pages: Stale While Revalidate
    return staleWhileRevalidate(request, DYNAMIC_CACHE);
  }
}

/**
 * Cache First Strategy
 */
async function cacheFirst(request, cacheName) {
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
}

/**
 * Network First Strategy
 */
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const response = await fetch(request);
    
    if (response.status === 200) {
      await cache.put(request, response.clone());
    }
    
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    throw error;
  }
}

/**
 * Stale While Revalidate Strategy
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  // Background fetch to update cache
  const fetchPromise = fetch(request).then(response => {
    if (response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  });
  
  // Return cached version immediately, or wait for network
  return cached || fetchPromise;
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
 * Error handling
 */
self.addEventListener('error', event => {
  console.error('Service Worker: Error', event.error);
});

self.addEventListener('unhandledrejection', event => {
  console.error('Service Worker: Unhandled rejection', event.reason);
  event.preventDefault();
});

console.log('Service Worker: Loaded successfully');