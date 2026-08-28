/* access.js v4 — Fermeture FORCÉE de tous les accès tiers pré-Firebase
   Seul Firebase Firestore autorise désormais. L'appareil admin est préservé. */
(function(){
'use strict';

/* === VERSION D'ACCÈS : tout changement invalide les anciens accès === */
const ACCESS_VERSION = 'v2_force_reauth_2026';

/* === Nettoyage agressif de TOUS les anciens systèmes d'accès === */
(function purgeLegacyAccess(){
 const legacyKeys = [
  'mrt_access_legacy','mrt_user_authorized','mrt_access_token',
  'mrt_legacy_session','mrt_shared_key','mrt_old_access',
  'mrt_access_granted_legacy','mrt_pre_firebase_access',
  'mrt_device_allowed','mrt_unlocked'
 ];
 legacyKeys.forEach(k => { try { localStorage.removeItem(k); } catch(e){} });
 try { sessionStorage.removeItem('mrt_legacy_session'); } catch(e){}
})();

/* === Si la version d'accès a changé → tout effacer sauf admin === */
(function checkAccessVersion(){
 try {
  const stored = localStorage.getItem('mrt_access_version');
  if (stored !== ACCESS_VERSION) {
   /* C'est une nouvelle version : on bloque TOUS les anciens accès */
   const isAdminDeviceNow = localStorage.getItem('mrt_is_admin_device') === '1';
   localStorage.removeItem('mrt_access');
   localStorage.removeItem('mrt_access_granted');
   /* L'appareil admin est préservé */
   if (isAdminDeviceNow) {
    localStorage.setItem('mrt_is_admin_device', '1');
   }
   localStorage.setItem('mrt_access_version', ACCESS_VERSION);
   console.log('[ACCESS] Anciens accès invalidés — Firebase requis');
  }
 } catch(e){}
})();

const FIREBASE_CONFIG = {
 apiKey:"AIzaSyCt40beykvP6N_rSY20EjNbo-2Q7jPzMSk",
 authDomain:"mondiagauto-a4d7a.firebaseapp.com",
 projectId:"mondiagauto-a4d7a",
 storageBucket:"mondiagauto-a4d7a.firebasestorage.app",
 messagingSenderId:"79906378742",
 appId:"1:79906378742:web:dac91c4a647d52a56e6dd7",
 vapidKey:"",
 serverKey:""
};

const ENABLED = !!(FIREBASE_CONFIG && FIREBASE_CONFIG.projectId);
window.ACCESS_ENABLED = ENABLED;
window.ACCESS_VERSION = ACCESS_VERSION;

let fb=null, fdb=null;

function did(){
 let id = localStorage.getItem('mrt_device_id');
 if(!id){
  id = 'dev-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  localStorage.setItem('mrt_device_id', id);
 }
 return id;
}

/* === ADMIN : reconnu par marque locale OU session admin === */
function isAdminDevice(){
 return localStorage.getItem('mrt_is_admin_device') === '1' 
     || sessionStorage.getItem('mrt_admin') === '1';
}

function loadScript(s){
 return new Promise((res,rej) => {
  const e = document.createElement('script');
  e.src = s; e.onload = res; e.onerror = rej;
  document.head.appendChild(e);
 });
}

async function loadFB(){
 if(fb) return fdb;
 await loadScript('https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js');
 await loadScript('https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore-compat.js');
 try { await loadScript('https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js'); } catch(e){}
 fb = window.firebase;
 fb.initializeApp(FIREBASE_CONFIG);
 fdb = fb.firestore();
 return fdb;
}

function screen(html){
 let el = document.getElementById('accessScreen');
 if(!el){
  el = document.createElement('div');
  el.id = 'accessScreen';
  el.className = 'modal show';
  el.style.zIndex = 40;
  el.innerHTML = '<div class="sheetModal"></div>';
  document.body.appendChild(el);
 }
 el.querySelector('.sheetModal').innerHTML = html;
 el.classList.add('show');
}

function hideScreen(){
 const el = document.getElementById('accessScreen');
 if(el) el.remove();
}

const clean = s => String(s||'').replace(/['"<>]/g,'');

function requestHTML(err){
 return '<div style="display:flex;justify-content:flex-end"><button class="ghost" onclick="__adminFromAccess()">🔐 Admin</button></div>' +
  '<h3>🔐 Accès contrôlé</h3>' +
  '<p class="muted">Cette application est protégée par l\u2019administrateur. <b>Tous les anciens accès ont été révoqués</b> — envoyez une nouvelle demande d\u2019accès via Firebase.</p>' +
  (err||'') +
  '<input id="arName" placeholder="Votre nom / garage">' +
  '<div class="actions"><button class="primary" onclick="__sendRequest()">📨 Demander l\u2019accès</button></div>';
}

function pendingHTML(d){
 return '<div style="display:flex;justify-content:flex-end"><button class="ghost" onclick="__adminFromAccess()">🔐 Admin</button></div>' +
  '<h3>⏳ Demande en attente</h3>' +
  '<p class="muted">Bonjour '+(clean(d&&d.name)||'')+', votre demande a été envoyée à l\u2019administrateur. L\u2019app se déverrouillera automatiquement dès autorisation.</p>' +
  '<div class="actions"><button onclick="__recheck()">🔄 Vérifier maintenant</button></div>';
}

function deniedHTML(){
 return '<div style="display:flex;justify-content:flex-end"><button class="ghost" onclick="__adminFromAccess()">🔐 Admin</button></div>' +
  '<h3>🚫 Accès refusé ou révoqué</h3>' +
  '<p class="muted">L\u2019administrateur a coupé ou refusé votre accès. Vous devez refaire une demande.</p>' +
  '<div class="actions"><button onclick="__reask()">📨 Redemander</button></div>';
}

window.__adminFromAccess = function(){ openModal('adminModal'); };

let polling = null;
function poll(){
 if(polling) return;
 polling = setInterval(async () => {
  const ok = await window.checkAccess(true);
  if(ok && !isAdminDevice()) location.reload();
 }, 15000);
}

window.__recheck = async () => {
 const ok = await window.checkAccess(true);
 if(ok) location.reload();
 else toast('Toujours en attente…');
};

window.__reask = async () => {
 localStorage.removeItem('mrt_access');
 screen(requestHTML());
};

window.__sendRequest = async function(){
 const name = clean((document.getElementById('arName')||{}).value) || ('Utilisateur ' + did().slice(-4));
 try {
  const db = await loadFB();
  const id = did();
  await db.collection('accessRequests').doc(id).set({
   name: name, deviceId: id, ts: Date.now(), status: 'pending'
  });
  await notifyAdmin(name);
  screen(pendingHTML({name: name}));
  poll();
 } catch(e){
  screen(requestHTML('<p style="color:var(--danger)">Erreur réseau — réessayez.</p>'));
 }
};

async function notifyAdmin(name){
 try {
  const db = await loadFB();
  const meta = await db.collection('meta').doc('adminFcm').get();
  const token = meta.exists && meta.data().token;
  if(token && FIREBASE_CONFIG.serverKey){
   await fetch('https://fcm.googleapis.com/fcm/send',{
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':'key='+FIREBASE_CONFIG.serverKey},
    body: JSON.stringify({
     to: token,
     notification: {
      title:'Mes réponses technique — demande d\u2019accès',
      body: name + ' demande l\u2019accès à l\u2019application'
     }
    })
   });
  }
 } catch(e){}
}

/* === VÉRIFICATION FORCÉE : Firestore est la SEULE source de vérité === */
window.checkAccess = async function(silent){
 /* Si Firebase non configuré → ouvert à tous (développement) */
 if(!ENABLED) return true;

 /* === APPAREIL ADMIN : accès toujours accordé === */
 if(isAdminDevice()){
  hideScreen();
  return true;
 }

 const id = did();

 /* === HORS LIGNE : refuse tout accès tiers (sécurité maximale) === */
 if(!navigator.onLine){
  /* Aucun accès hors-ligne pour les tiers — doit se reconnecter pour être validé */
  screen(requestHTML('<p style="color:var(--warn)">⚠️ Connexion requise pour valider l\u2019accès.</p>'));
  return false;
 }

 try {
  const db = await loadFB();

  /* 1. L'utilisateur est-il autorisé dans Firestore ? */
  const doc = await db.collection('authorizedUsers').doc(id).get();
  if(doc.exists){
   const d = doc.data();
   if(d.active !== false){
    localStorage.setItem('mrt_access', 'granted');
    hideScreen();
    return true;
   }
   localStorage.removeItem('mrt_access');
   screen(deniedHTML());
   return false;
  }

  /* 2. A-t-il une demande en attente ? */
  localStorage.removeItem('mrt_access');
  const req = await db.collection('accessRequests').doc(id).get();
  if(req.exists){
   screen(pendingHTML(req.data()));
   poll();
   return false;
  }

  /* 3. Sinon → demande requise */
  screen(requestHTML());
  return false;
 } catch(e){
  /* En cas d'erreur réseau : on bloque (sécurité) */
  console.error('[ACCESS] Erreur vérification:', e);
  screen(requestHTML('<p style="color:var(--danger)">Erreur de vérification — réessayez.</p>'));
  return false;
 }
};

/* === GARDE : re-vérifie toutes les 30s === */
window.startAccessGuard = function(){
 if(!ENABLED || window.__guard) return;
 window.__guard = 1;
 window.ACCESS_GUARD = 1;
 setInterval(async () => {
  if(document.hidden || isAdminDevice()) return;
  await window.checkAccess(true);
 }, 30000);
};

/* ===== CÔTÉ ADMIN ===== */
let knownReq = {};

window.onAdminUnlocked = async function(){
 hideScreen();
 /* MARQUE L'APPAREIL COMME ADMIN (persistant) */
 localStorage.setItem('mrt_is_admin_device', '1');
 if(!ENABLED) return;
 try {
  const db = await loadFB();
  if(fb.messaging && FIREBASE_CONFIG.vapidKey && ('Notification' in window)){
   const perm = await Notification.requestPermission();
   if(perm === 'granted'){
    const msg = fb.messaging();
    const token = await msg.getToken({vapidKey: FIREBASE_CONFIG.vapidKey});
    if(token) await db.collection('meta').doc('adminFcm').set({token: token, ts: Date.now()});
    msg.onMessage(p => {
     try { new Notification((p.notification && p.notification.title) || 'Notification', {body: p.notification && p.notification.body}); } catch(e){}
    });
   }
  }
  listenRequests();
  renderAccessAdmin();
 } catch(e){}
};

function listenRequests(){
 if(listenRequests.on) return;
 listenRequests.on = 1;
 fdb.collection('accessRequests').onSnapshot(snap => {
  snap.forEach(ch => {
   const d = ch.data();
   if(!knownReq[ch.id] && d && d.status === 'pending'){
    knownReq[ch.id] = 1;
    toast('🔔 Demande d\u2019accès : ' + d.name);
    try { if(Notification.permission === 'granted') new Notification('Demande d\u2019accès', {body: d.name}); } catch(e){}
   }
  });
  renderAccessAdmin();
 });
}

window.renderAccessAdmin = async function(){
 const box = document.getElementById('accessAdminBox');
 if(!box) return;
 if(!ENABLED){
  box.innerHTML = '<p class="muted"><b>Contrôle d\u2019accès tiers désactivé</b> (Firebase non configuré).</p>';
  return;
 }
 try {
  const db = await loadFB();
  const reqs = await db.collection('accessRequests').where('status','==','pending').get();
  const users = await db.collection('authorizedUsers').get();
  let html = '<h3>👥 Demandes d\u2019accès en attente</h3>';
  if(reqs.empty) html += '<p class="muted">Aucune demande en attente.</p>';
  reqs.forEach(r => {
   const d = r.data();
   const n = clean(d.name);
   html += '<div class="rowItem"><b>'+esc(n)+'</b><span>'+(d.ts?new Date(d.ts).toLocaleDateString('fr-FR'):'')+'</span><span><button class="primary" onclick="accessApprove(\''+r.id+'\',\''+n+'\')">✅ Autoriser</button> <button onclick="accessDeny(\''+r.id+'\',\''+n+'\')">❌ Refuser</button></span></div>';
  });
  html += '<h3>👥 Tableau des tiers — révocation forcée active</h3>';
  if(users.empty) html += '<p class="muted">Aucun tiers enregistré.</p>';
  users.forEach(u => {
   const d = u.data();
   const n = clean(d.name || u.id);
   const on = d.active !== false;
   html += '<div class="rowItem"><b>'+esc(n)+'</b><span>'+(on?'✅ autorisé':'🚫 révoqué')+(d.since?' • depuis '+new Date(d.since).toLocaleDateString('fr-FR'):'')+'</span><span>'+(on?'<button onclick="accessRevoke(\''+u.id+'\')">🔒 Couper l\u2019accès</button>':'<button onclick="accessRestore(\''+u.id+'\')">♻️ Réautoriser</button>')+' <button onclick="accessDelete(\''+u.id+'\')">🗑</button></span></div>';
  });
  html += '<hr><div class="muted">Version d\u2019accès : '+ACCESS_VERSION+' — tous les accès antérieurs ont été révoqués.</div>';
  box.innerHTML = html;
 } catch(e){
  box.innerHTML = '<p class="muted">Erreur Firebase : '+esc(e.message)+'</p>';
 }
};

window.accessApprove = async (id,name) => {
 const db = await loadFB();
 await db.collection('authorizedUsers').doc(id).set({name:name, active:true, since:Date.now()});
 await db.collection('accessRequests').doc(id).delete();
 toast('✅ Accès autorisé : '+name);
 renderAccessAdmin();
};

window.accessDeny = async (id,name) => {
 const db = await loadFB();
 await db.collection('authorizedUsers').doc(id).set({name:name, active:false, since:Date.now()});
 await db.collection('accessRequests').doc(id).delete();
 toast('❌ Accès refusé : '+name);
 renderAccessAdmin();
};

window.accessRevoke = async (id) => {
 const db = await loadFB();
 await db.collection('authorizedUsers').doc(id).update({active:false});
 toast('🔒 Accès coupé (révocation forcée)');
 renderAccessAdmin();
};

window.accessRestore = async (id) => {
 const db = await loadFB();
 await db.collection('authorizedUsers').doc(id).update({active:true});
 toast('♻️ Accès rétabli');
 renderAccessAdmin();
};

window.accessDelete = async (id) => {
 const db = await loadFB();
 await db.collection('authorizedUsers').doc(id).delete();
 toast('🗑 Tiers supprimé');
 renderAccessAdmin();
};

})();
