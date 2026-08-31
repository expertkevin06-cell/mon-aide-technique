const CACHE = 'autodiag-v1';
const CORE = [
  './', './index.html', './admin.html', './admin-gemini.html', './styles.css',
  './db.js', './vehicles-db.js', './dtc-db.js', './recalls-db.js', './ai-search.js',
  './app.js', './admin.js', './manifest.json',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon.svg'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      Promise.allSettled(CORE.map((u) => c.add(u)))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // Navigation : réseau d'abord, sinon cache (offline)
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then((r) => {
        const clone = r.clone();
        caches.open(CACHE).then((c) => c.put('./index.html', clone));
        return r;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Autres : stale-while-revalidate
  e.respondWith(
    caches.match(req).then((cached) => {
      const fetched = fetch(req).then((r) => {
        if (r && r.status === 200 && r.type === 'basic') {
          const clone = r.clone();
          caches.open(CACHE).then((c) => c.put(req, clone));
        }
        return r;
      }).catch(() => cached);
      return cached || fetched;
    })
  );
});

self.addEventListener('message', (e) => {
  if (e.data && e.data.action === 'CHECK_DB_UPDATE') {
    self.clients.matchAll().then((cs) => cs.forEach((c) => c.postMessage({ action: 'DB_UPDATE_REQUIRED' })));
  }
});
