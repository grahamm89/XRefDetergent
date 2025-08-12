// ---- Offline-first service worker for Detergent Tool (mobile-focused) ----
const CACHE_VERSION = 'v1.1.0'; // bump on each release
const CACHE_NAME = `detergent-tool-${CACHE_VERSION}`;

const APP_SHELL = [
  './detergent-concentration.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting(); // take control asap
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Clean old caches
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('detergent-tool-') && k !== CACHE_NAME).map(k => caches.delete(k)));
    // Navigation preload for faster TTFB
    if ('navigationPreload' in self.registration) {
      await self.registration.navigationPreload.enable();
    }
    await self.clients.claim();
    // Notify clients an update is ready
    const clients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
    clients.forEach(c => c.postMessage({ type: 'SW_READY' }));
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // HTML navigations
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const preload = await event.preloadResponse;
        if (preload) return preload;
        return await fetch(req);
      } catch (err) {
        return caches.match('./detergent-concentration.html');
      }
    })());
    return;
  }

  // Same-origin static assets: stale-while-revalidate
  if (url.origin === location.origin) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req);
      const fetchPromise = fetch(req).then(res => {
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      }).catch(() => cached);
      return cached || fetchPromise;
    })());
    return;
  }

  // Cross-origin: network-first with cache fallback
  event.respondWith((async () => {
    try {
      const res = await fetch(req);
      return res;
    } catch (e) {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req);
      if (cached) return cached;
      throw e;
    }
  })());
});
