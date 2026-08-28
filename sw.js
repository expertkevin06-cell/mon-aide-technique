/* sw.js v7 — Service Worker optimisé pour APK hors-ligne + mises à jour intelligentes */
const CACHE_VERSION='mrt-sw-v7-r1';
const STATIC_CACHE=CACHE_VERSION+'-static';
const DYNAMIC_CACHE=CACHE_VERSION+'-dynamic';
const API_CACHE=CACHE_VERSION+'-api';

/* Fichiers critiques à mettre en cache immédiatement */
const CRITICAL_ASSETS=[
'./',
'./index.html',
'./manifest.webmanifest',
'./icon.svg',
'./icon-192.png',
'./icon-512.png',
'./dtc-db.js',
'./search-sources.js',
'./known-issues.js',
'./assistant.js',
'./access.js',
'./firebase-messaging-sw.js'
];

/* URLs à ne jamais mettre en cache */
const NO_CACHE_URLS=[
'/api/',
'google-analytics.com',
'googletagmanager.com',
'facebook.net',
'twitter.com'
];

/* URLs à toujours récupérer depuis le réseau (API officielles) */
const NETWORK_FIRST_URLS=[
'api.nhtsa.gov',
'ec.europa.eu/safety-gate',
'data.economie.gouv.fr',
'rappel.conso.gouv.fr'
];

/* ============================================
   INSTALLATION — Mise en cache des fichiers critiques
   ============================================ */
self.addEventListener('install', event => {
 console.log('[SW] Installation en cours...');
 event.waitUntil(
  caches.open(STATIC_CACHE)
   .then(cache => {
    console.log('[SW] Mise en cache des fichiers critiques');
    return cache.addAll(CRITICAL_ASSETS);
   })
   .then(() => {
    console.log('[SW] Installation terminée');
    return self.skipWaiting(); // Active immédiatement le nouveau SW
   })
   .catch(err => {
    console.error('[SW] Erreur installation:', err);
   })
 );
});

/* ============================================
   ACTIVATION — Nettoyage des anciens caches
   ============================================ */
self.addEventListener('activate', event => {
 console.log('[SW] Activation en cours...');
 event.waitUntil(
  caches.keys()
   .then(cacheNames => {
    return Promise.all(
     cacheNames.map(cacheName => {
      /* Supprimer tous les caches qui ne correspondent pas à la version actuelle */
      if(cacheName !== STATIC_CACHE && 
         cacheName !== DYNAMIC_CACHE && 
         cacheName !== API_CACHE) {
       console.log('[SW] Suppression ancien cache:', cacheName);
       return caches.delete(cacheName);
      }
     })
    );
   })
   .then(() => {
    console.log('[SW] Activation terminée');
    return self.clients.claim(); // Prend contrôle immédiatement
   })
 );
});

/* ============================================
   FETCH — Stratégies de cache intelligentes
   ============================================ */
self.addEventListener('fetch', event => {
 const url = new URL(event.request.url);
 
 /* Ignorer les requêtes non-GET */
 if(event.request.method !== 'GET') return;
 
 /* Ignorer les requêtes cross-origin (sauf APIs connues) */
 if(url.origin !== location.origin && !isAllowedCrossOrigin(url)) {
  return;
 }

 /* Stratégie selon le type de ressource */
 if(isNetworkFirst(url)) {
  /* API officielles : Network First (réseau prioritaire, cache en fallback) */
  event.respondWith(networkFirstStrategy(event.request));
 } else if(isStaticAsset(url)) {
  /* Fichiers statiques : Cache First (cache prioritaire, réseau en fallback) */
  event.respondWith(cacheFirstStrategy(event.request));
 } else if(isNoCache(url)) {
  /* URLs à ne jamais cacher : Network Only */
  event.respondWith(fetch(event.request));
 } else {
  /* Autres ressources : Stale While Revalidate (cache immédiat + mise à jour en arrière-plan) */
  event.respondWith(staleWhileRevalidateStrategy(event.request));
 }
});

/* ============================================
   STRATÉGIES DE CACHE
   ============================================ */

/**
 * Network First : essaie le réseau, fallback sur le cache
 * Idéal pour les APIs qui doivent être à jour
 */
async function networkFirstStrategy(request) {
 try {
  const networkResponse = await fetch(request);
  
  /* Si réponse valide, mettre à jour le cache */
  if(networkResponse.ok) {
   const cache = await caches.open(API_CACHE);
   cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
 } catch (error) {
  console.log('[SW] Réseau indisponible, fallback cache pour:', request.url);
  const cachedResponse = await caches.match(request);
  
  if(cachedResponse) {
   return cachedResponse;
  }
  
  /* Si pas de cache, retourner une réponse d'erreur */
  return new Response('Hors ligne', {
   status: 503,
   statusText: 'Service Unavailable',
   headers: {'Content-Type': 'text/plain'}
  });
 }
}

/**
 * Cache First : essaie le cache, fallback sur le réseau
 * Idéal pour les fichiers statiques qui changent rarement
 */
async function cacheFirstStrategy(request) {
 const cachedResponse = await caches.match(request);
 
 if(cachedResponse) {
  return cachedResponse;
 }
 
 try {
  const networkResponse = await fetch(request);
  
  /* Mettre en cache si réponse valide */
  if(networkResponse.ok) {
   const cache = await caches.open(DYNAMIC_CACHE);
   cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
 } catch (error) {
  console.error('[SW] Erreur fetch:', request.url, error);
  
  /* Page offline fallback */
  if(request.destination === 'document') {
   return caches.match('./index.html');
  }
  
  return new Response('Ressource non disponible hors ligne', {
   status: 503,
   statusText: 'Service Unavailable'
  });
 }
}

/**
 * Stale While Revalidate : retourne le cache immédiatement, met à jour en arrière-plan
 * Idéal pour les ressources qui peuvent être légèrement obsolètes
 */
async function staleWhileRevalidateStrategy(request) {
 const cache = await caches.open(DYNAMIC_CACHE);
 const cachedResponse = await cache.match(request);
 
 /* Retourner le cache immédiatement si disponible */
 const fetchPromise = fetch(request)
  .then(networkResponse => {
   /* Mettre à jour le cache en arrière-plan */
   if(networkResponse.ok) {
    cache.put(request, networkResponse.clone());
   }
   return networkResponse;
  })
  .catch(() => cachedResponse); // Fallback sur le cache si réseau échoue
 
 return cachedResponse || fetchPromise;
}

/* ============================================
   HELPERS — Détection du type de ressource
   ============================================ */

function isStaticAsset(url) {
 const staticExtensions = ['.html', '.js', '.css', '.png', '.jpg', '.jpeg', '.svg', '.ico', '.webmanifest'];
 return staticExtensions.some(ext => url.pathname.endsWith(ext));
}

function isNetworkFirst(url) {
 return NETWORK_FIRST_URLS.some(domain => url.hostname.includes(domain));
}

function isNoCache(url) {
 return NO_CACHE_URLS.some(domain => url.hostname.includes(domain));
}

function isAllowedCrossOrigin(url) {
 const allowedDomains = [
  'firebaseio.com',
  'googleapis.com',
  'gstatic.com',
  'nhtsa.gov',
  'ec.europa.eu',
  'economie.gouv.fr',
  'rappel.conso.gouv.fr'
 ];
 return allowedDomains.some(domain => url.hostname.includes(domain));
}

/* ============================================
   PUSH NOTIFICATIONS — Firebase Cloud Messaging
   ============================================ */
self.addEventListener('push', event => {
 console.log('[SW] Notification push reçue');
 
 if(!event.data) return;
 
 const data = event.data.json();
 const title = data.notification?.title || 'Mes réponses technique';
 const options = {
  body: data.notification?.body || 'Nouvelle notification',
  icon: './icon-192.png',
  badge: './icon-192.png',
  vibrate: [200, 100, 200],
  data: data.data || {},
  actions: data.actions || [],
  requireInteraction: false,
  tag: data.tag || 'default'
 };
 
 event.waitUntil(
  self.registration.showNotification(title, options)
 );
});

/* ============================================
   NOTIFICATION CLICK — Ouvrir l'app au clic
   ============================================ */
self.addEventListener('notificationclick', event => {
 console.log('[SW] Notification cliquée');
 
 event.notification.close();
 
 const urlToOpen = event.notification.data?.url || './';
 
 event.waitUntil(
  clients.matchAll({type: 'window', includeUncontrolled: true})
   .then(windowClients => {
    /* Si une fenêtre est déjà ouverte, la focus */
    for(const client of windowClients) {
     if(client.url.includes(urlToOpen) && 'focus' in client) {
      return client.focus();
     }
    }
    
    /* Sinon, ouvrir une nouvelle fenêtre */
    if(clients.openWindow) {
     return clients.openWindow(urlToOpen);
    }
   })
 );
});

/* ============================================
   MESSAGE HANDLER — Communication avec l'app
   ============================================ */
self.addEventListener('message', event => {
 if(!event.data) return;
 
 console.log('[SW] Message reçu:', event.data.type);
 
 switch(event.data.type) {
  case 'SKIP_WAITING':
   /* Force l'activation immédiate du nouveau SW */
   self.skipWaiting();
   break;
   
  case 'CLEAR_CACHE':
   /* Vide tous les caches */
   event.waitUntil(
    caches.keys().then(cacheNames => {
     return Promise.all(cacheNames.map(name => caches.delete(name)));
    }).then(() => {
     event.ports[0].postMessage({success: true});
    })
   );
   break;
   
  case 'CACHE_URLS':
   /* Met en cache des URLs spécifiques */
   if(Array.isArray(event.data.urls)) {
    event.waitUntil(
     caches.open(DYNAMIC_CACHE).then(cache => {
      return Promise.all(
       event.data.urls.map(url => 
        cache.add(url).catch(err => console.warn('[SW] Impossible de cacher:', url))
       )
      );
     }).then(() => {
      if(event.ports && event.ports[0]) {
       event.ports[0].postMessage({success: true});
      }
     })
    );
   }
   break;
   
  case 'GET_CACHE_STATUS':
   /* Retourne l'état des caches */
   event.waitUntil(
    caches.keys().then(cacheNames => {
     return Promise.all(
      cacheNames.map(name => 
       caches.open(name).then(cache => 
        cache.keys().then(requests => ({
         name: name,
         count: requests.length
        }))
       )
      )
     );
    }).then(status => {
     if(event.ports && event.ports[0]) {
      event.ports[0].postMessage({caches: status});
     }
    })
   );
   break;
 }
});

/* ============================================
   BACKGROUND SYNC — Synchronisation en arrière-plan
   ============================================ */
self.addEventListener('sync', event => {
 console.log('[SW] Sync event:', event.tag);
 
 if(event.tag === 'sync-access-requests') {
  event.waitUntil(syncAccessRequests());
 }
});

async function syncAccessRequests() {
 /* Synchronise les demandes d'accès en attente quand le réseau revient */
 try {
  const requests = await getStoredAccessRequests();
  for(const req of requests) {
   await sendAccessRequest(req);
  }
  await clearStoredAccessRequests();
 } catch (error) {
  console.error('[SW] Erreur sync access:', error);
 }
}

/* Stockage local pour les requêtes en attente */
async function getStoredAccessRequests() {
 /* Implémentation simplifiée — à adapter selon votre besoin */
 return [];
}

async function sendAccessRequest(req) {
 /* Envoie la requête au serveur */
 return fetch(req.url, req.options);
}

async function clearStoredAccessRequests() {
 /* Efface les requêtes synchronisées */
}

/* ============================================
   PERIODIC BACKGROUND SYNC (si supporté)
   ============================================ */
self.addEventListener('periodicsync', event => {
 if(event.tag === 'weekly-update') {
  event.waitUntil(performWeeklyUpdate());
 }
});

async function performWeeklyUpdate() {
 console.log('[SW] Mise à jour hebdomadaire en arrière-plan');
 /* Logique de mise à jour automatique des données */
}

/* ============================================
   GESTION DES ERREURS GLOBALES
   ============================================ */
self.addEventListener('error', event => {
 console.error('[SW] Erreur globale:', event.message, event.filename, event.lineno);
});

self.addEventListener('unhandledrejection', event => {
 console.error('[SW] Promise rejetée:', event.reason);
});

console.log('[SW] Service Worker v7 chargé avec succès');
