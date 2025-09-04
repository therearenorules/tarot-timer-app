/**
 * Service Worker Cache Clear Utility
 * Run this in browser console to clear service worker caches and restart
 */

(async function clearServiceWorkerCache() {
  console.log('🧹 Clearing Service Worker caches...');
  
  try {
    // Clear all caches
    const cacheNames = await caches.keys();
    console.log('Found caches:', cacheNames);
    
    await Promise.all(
      cacheNames.map(async (cacheName) => {
        console.log('Deleting cache:', cacheName);
        return caches.delete(cacheName);
      })
    );
    
    // Unregister all service workers
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      await Promise.all(
        registrations.map(async (registration) => {
          console.log('Unregistering service worker:', registration);
          return registration.unregister();
        })
      );
    }
    
    console.log('✅ Service Worker caches cleared successfully!');
    console.log('🔄 Refresh the page to register the new service worker.');
    
  } catch (error) {
    console.error('❌ Error clearing service worker cache:', error);
  }
})();

// Usage instructions
console.log(`
🛠️ Service Worker Cache Clear Utility Loaded!

To clear all service worker caches and restart:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Run: clearServiceWorkerCache()
4. Refresh the page

Or just refresh this page - the function has already run automatically.
`);