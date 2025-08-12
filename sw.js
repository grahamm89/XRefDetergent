const CACHE_NAME = 'detergent-v1';
self.addEventListener('install', e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll([
    './',
    './index.html',
    './products.json',
    './js/app.js',
    './manifest.json'
  ])));
});
self.addEventListener('fetch', e=>{
  if(e.request.url.includes('products.json')){
    e.respondWith(fetch(e.request).then(r=>{
      const copy = r.clone();
      caches.open(CACHE_NAME).then(c=>c.put(e.request, copy));
      return r;
    }).catch(()=>caches.match(e.request)));
  } else {
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
  }
});