const CACHE_VERSION = 'v1';
const CACHE_NAME = `detergent-tool-${CACHE_VERSION}`;
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(['./','./index.html','./app.js','./manifest.json','./assets/icon-192.png','./assets/icon-512.png'])));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));
});
self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
});