// ===== SERVICE WORKER — Analyse Technique Kevin =====
// ⚠️ Incrémentez CACHE_VERSION à chaque mise à jour (v3 → v4...)
const CACHE_VERSION = 'v3';
const CACHE_NAME = 'at-kevin-cache-' + CACHE_VERSION;

const FICHIERS_A_CACHER = [
  './', './index.html', './style.css', './manifest.json',
  './icon-192.png', './icon-512.png',
  './js/db.js', './js/app.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(FICHIERS_A_CACHER))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(rep => {
        if (rep && rep.ok) {
          const copie = rep.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, copie));
        }
        return rep;
      })
      .catch(() => caches.match(e.request).then(r => r || caches.match('./')))
  );
});
