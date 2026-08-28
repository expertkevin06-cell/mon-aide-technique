/* sw.js v8 — Nouveau cache pour forcer la purge des anciennes versions
   Tous les utilisateurs rechargeront l'app neuve au prochain accès */
const CACHE_VERSION = 'mrt-sw-v8-force-reauth';
const STATIC_CACHE = CACHE_VERSION + '-static';
const DYNAMIC_CACHE = CACHE_VERSION + '-dynamic';
const API_CACHE = CACHE_VERSION + '-api';

const CRITICAL_ASSETS = [
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

const NETWORK_FIRST_URLS = [
 'api.nhtsa.gov',
 'ec.europa.eu/safety-gate',
 'data.economie.gouv.fr',
 'rappel.conso.gouv.fr'
];

self.addEventListener('install', event => {
 console.log('[SW v8] Installation — purge forcée activée');
 event.waitUntil(
  caches.open(STATIC_CACHE)
   .then(cache => cache.addAll(CRITICAL_ASSETS))
   .then(() => self.skipWaiting())
   .catch(err => console.error('[SW] Erreur install:', err))
 );
});

self.addEventListener('activate', event => {
 console.log('[SW v8] Activation — suppression des anciens caches');
 event.waitUntil(
  caches.keys().then(cacheNames => {
   return Promise.all(
    cacheNames.map(cacheName => {
     if(cacheName !== STATIC_CACHE && 
        cacheName !== DYNAMIC_CACHE && 
        cacheName !== API_CACHE) {
      console.log('[SW] Suppression:', cacheName);
      return caches.delete(cacheName);
     }
    })
   );
  }).then(() => self.clients.claim())
 );
});

self.addEventListener('fetch', event => {
 const url = new URL(event.request.url);
 if(event.request.method !== 'GET') return;
 if(url.origin !== location.origin && !isAllowedCrossOrigin(url)) return;

 if(isNetworkFirst(url)){
  event.respondWith(networkFirstStrategy(event.request));
 } else if(isStaticAsset(url)){
  event.respondWith(cacheFirstStrategy(event.request));
 } else {
  event.respondWith(staleWhileRevalidateStrategy(event.request));
 }
});

async function networkFirstStrategy(request){
 try {
  const r = await fetch(request);
  if(r.ok){ const c = await caches.open(API_CACHE); c.put(request, r.clone()); }
  return r;
 } catch(e){
  const c = await caches.match(request);
  return c || new Response('Hors ligne', {status:503, statusText:'Service Unavailable'});
 }
}

async function cacheFirstStrategy(request){
 const c = await caches.match(request);
 if(c) return c;
 try {
  const r = await fetch(request);
  if(r.ok){ const cache = await caches.open(DYNAMIC_CACHE); cache.put(request, r.clone()); }
  return r;
 } catch(e){
  if(request.destination === 'document') return caches.match('./index.html');
  return new Response('Hors ligne', {status:503});
 }
}

async function staleWhileRevalidateStrategy(request){
 const cache = await caches.open(DYNAMIC_CACHE);
 const cached = await cache.match(request);
 const fetchPromise = fetch(request)
  .then(r => { if(r.ok) cache.put(request, r.clone()); return r; })
  .catch(() => cached);
 return cached || fetchPromise;
}

function isStaticAsset(url){
 return ['.html','.js','.css','.png','.jpg','.jpeg','.svg','.ico','.webmanifest']
  .some(ext => url.pathname.endsWith(ext));
}

function isNetworkFirst(url){
 return NETWORK_FIRST_URLS.some(d => url.hostname.includes(d));
}

function isAllowedCrossOrigin(url){
 return ['firebaseio.com','googleapis.com','gstatic.com','nhtsa.gov','ec.europa.eu','economie.gouv.fr','rappel.conso.gouv.fr']
  .some(d => url.hostname.includes(d));
}

self.addEventListener('push', event => {
 if(!event.data) return;
 const data = event.data.json();
 event.waitUntil(
  self.registration.showNotification(
   data.notification?.title || 'Mes réponses technique',
   { body: data.notification?.body || 'Notification', icon: './icon-192.png', data: data.data || {} }
  )
 );
});

self.addEventListener('notificationclick', event => {
 event.notification.close();
 event.waitUntil(
  clients.matchAll({type:'window', includeUncontrolled:true}).then(cs => {
   for(const c of cs){ if('focus' in c) return c.focus(); }
   if(clients.openWindow) return clients.openWindow('./');
  })
 );
});

self.addEventListener('message', event => {
 if(!event.data) return;
 if(event.data.type === 'SKIP_WAITING') self.skipWaiting();
 if(event.data.type === 'CLEAR_CACHE'){
  event.waitUntil(
   caches.keys().then(ns => Promise.all(ns.map(n => caches.delete(n))))
    .then(() => event.ports[0].postMessage({success:true}))
  );
 }
});

console.log('[SW v8] Service Worker forcé rechargé — purge complète');
