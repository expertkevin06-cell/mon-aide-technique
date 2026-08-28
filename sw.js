/* sw.js v9 — Service Worker PWABuilder (fetch + offline) */
const CACHE = 'mrt-v9';
const CORE = ['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png',
 './data.js','./dtc-db.js','./search-sources.js','./known-issues.js','./assistant.js','./access.js'];

self.addEventListener('install', e => {
 e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', e => {
 e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', e => {
 const url = new URL(e.request.url);
 if(e.request.mode === 'navigate'){
  e.respondWith(fetch(e.request).then(res => {
   const copy = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); return res;
  }).catch(() => caches.match('./index.html')));
  return;
 }
 if(url.origin === location.origin){
  e.respondWith(caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
   const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res;
  })));
  return;
 }
 e.respondWith(fetch(e.request).then(res => {
  const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return res;
 }).catch(() => caches.match(e.request)));
});
