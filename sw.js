// ============================================================
// ===== SERVICE WORKER — Analyse Technique Kevin =====
// ⚠️ Incrémentez CACHE_VERSION à chaque mise à jour de l'app
//    (v2 → v3 → v4...) pour forcer les téléphones à recharger
// ============================================================

const CACHE_VERSION = 'v2';
const CACHE_NAME = 'at-kevin-cache-' + CACHE_VERSION;

const FICHIERS_A_CACHER = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './js/db.js',
  './js/app.js',
  './js/admin.js'
];

// ===== INSTALLATION : mise en cache des fichiers de base =====
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FICHIERS_A_CACHER))
      .then(() => self.skipWaiting())   // active immédiatement la nouvelle version
  );
});

// ===== ACTIVATION : suppression des ANCIENS caches =====
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(k => k !== CACHE_NAME)   // garde uniquement le cache actuel
            .map(k => caches.delete(k))      // supprime v1, v0...
        )
      )
      .then(() => self.clients.claim())
  );
});

// ===== INTERCEPTION DES REQUÊTES =====
// Stratégie :
//  - Navigation / fichiers locaux → Network First (le frais d'abord, cache en secours)
//  - Hors ligne → sert depuis le cache
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request)
      .then(reponseReseau => {
        // On met à jour le cache avec la réponse fraîche
        if (reponseReseau && reponseReseau.ok) {
          const copie = reponseReseau.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, copie));
        }
        return reponseReseau;
      })
      .catch(() =>
        caches.match(e.request).then(repCache => repCache || caches.match('./'))
      )
  );
});
