const CACHE = "dtcdiag-v5";
const ASSETS = [
  "./", "./index.html", "./offline.html", "./manifest.json",
  "css/style.css", "js/config.js", "js/store.js", "js/auth.js", "js/data.js", "js/app.js",
  "assets/icons/icon-192.png", "assets/icons/icon-512.png", "assets/icons/icon-maskable-512.png"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
/* réseau d'abord, cache en secours : les mises à jour arrivent toutes seules, et le hors-ligne marche */
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(res => {
      const copy = res.clone();
      if (res.ok && new URL(e.request.url).origin === location.origin)
        caches.open(CACHE).then(c => c.put(e.request, copy));
      return res;
    }).catch(() =>
      caches.match(e.request, { ignoreSearch: true })
        .then(hit => hit || caches.match("./offline.html"))
    )
  );
});
