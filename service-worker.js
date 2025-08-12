const CACHE_VERSION = 'detergent-tool-v1.0.1';
const CACHE_NAME = 'app-cache-' + CACHE_VERSION;
const CORE_ASSETS = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  './assets/icon-192.png',
  './assets/icon-512.png'
];
self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE_ASSETS);
    self.skipWaiting();
  })());
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k !== CACHE_NAME) ? caches.delete(k) : null));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isHTML = req.mode === 'navigate' || url.pathname.endsWith('/index.html');
  if (isHTML) {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req, { cache: 'no-store' });
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, fresh.clone());
        return fresh;
      } catch (err) {
        const cache = await caches.open(CACHE_NAME);
        return (await cache.match(req)) || (await cache.match('./index.html'));
      }
    })());
    return;
  }
  e.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req);
    if (cached) return cached;
    try {
      const fresh = await fetch(req);
      cache.put(req, fresh.clone());
      return fresh;
    } catch (err) {
      return cached || Response.error();
    }
  })());
});