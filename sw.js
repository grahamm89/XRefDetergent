const CACHE_VERSION = 'xrefdet-v1.0.0';
const CACHE_NAME = 'app-cache-' + CACHE_VERSION;

const CORE = [
  './',
  './index.html',
  './manifest.json',
  './products.json',
  './style.css',
  './js/app.js',
  './js/admin.js',
  './assets/logo.svg',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/apple-touch-icon.png',
  './assets/favicon.png'
];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE_NAME);
    await c.addAll(CORE);
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => k === CACHE_NAME ? null : caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const isHTML = req.mode === 'navigate' || url.pathname.endsWith('/index.html');
  const isProducts = url.pathname.endsWith('/products.json') || url.pathname.endsWith('products.json');

  if (isHTML || isProducts) {
    e.respondWith((async () => {
      try {
        const fresh = await fetch(req, { cache: 'no-store' });
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, fresh.clone());
        return fresh;
      } catch (err) {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(req);
        if (cached) return cached;
        if (isHTML) return await cache.match('./index.html');
        throw err;
      }
    })());
    return;
  }

  e.respondWith((async ()=>{
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