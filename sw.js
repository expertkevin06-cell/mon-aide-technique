const CACHE_NAME='at-kevin-v1';
const FILES=['/','/index.html','/style.css','/manifest.json','/js/db.js','/js/app.js','/js/admin.js','/icon-192.png','/icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE_NAME).map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{if(e.request.method==='GET'&&n.ok){const cl=n.clone();caches.open(CACHE_NAME).then(c=>c.put(e.request,cl));}return n;}).catch(()=>e.request.mode==='navigate'?caches.match('/index.html'):undefined)));});
