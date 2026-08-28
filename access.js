/* access.js v6 — Verrouillage strict : tiers = demande obligatoire, admin = mot de passe */
(function(){
'use strict';

var ACCESS_VERSION = 'v6_strict_lock';
var EXPIRATION_MS = 30 * 24 * 3600 * 1000; // 30 jours

/* Nettoyage anciens accès */
(function purgeLegacy(){
 var keys = ['mrt_access_legacy','mrt_user_authorized','mrt_access_token','mrt_legacy_session','mrt_open_access'];
 keys.forEach(function(k){ try { localStorage.removeItem(k); } catch(e){} });
})();

/* Vérification version */
(function checkVersion(){
 try {
  var stored = localStorage.getItem('mrt_access_version');
  if(stored !== ACCESS_VERSION){
   var isAdmin = localStorage.getItem('mrt_is_admin_device') === '1';
   localStorage.removeItem('mrt_access');
   localStorage.removeItem('mrt_access_granted_at');
   if(isAdmin) localStorage.setItem('mrt_is_admin_device', '1');
   localStorage.setItem('mrt_access_version', ACCESS_VERSION);
  }
 } catch(e){}
})();

var FIREBASE_CONFIG = {
 apiKey:"AIzaSyCt40beykvP6N_rSY20EjNbo-2Q7jPzMSk",
 authDomain:"mondiagauto-a4d7a.firebaseapp.com",
 projectId:"mondiagauto-a4d7a",
 storageBucket:"mondiagauto-a4d7a.firebasestorage.app",
 messagingSenderId:"79906378742",
 appId:"1:79906378742:web:dac91c4a647d52a56e6dd7",
 vapidKey:"",
 serverKey:""
};

var ENABLED = !!(FIREBASE_CONFIG && FIREBASE_CONFIG.projectId);
window.ACCESS_ENABLED = ENABLED;
window.ACCESS_VERSION = ACCESS_VERSION;

var fb=null, fdb=null;

function did(){
 var id = localStorage.getItem('mrt_device_id');
 if(!id){
  id = 'dev-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  localStorage.setItem('mrt_device_id', id);
 }
 return id;
}

function isAdminDevice(){
 return localStorage.getItem('mrt_is_admin_device') === '1' 
     || sessionStorage.getItem('mrt_admin') === '1';
}

function isAccessExpired(){
 var grantedAt = parseInt(localStorage.getItem('mrt_access_granted_at') || '0');
 if(!grantedAt) return true;
 return (Date.now() - grantedAt) > EXPIRATION_MS;
}

function refreshAccessTimestamp(){
 localStorage.setItem('mrt_access_granted_at', String(Date.now()));
 localStorage.setItem('mrt_access', 'granted');
}

function loadScript(s){
 return new Promise(function(res, rej){
  var e = document.createElement('script');
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
 var el = document.getElementById('accessScreen');
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
 var el = document.getElementById('accessScreen');
 if(el) el.remove();
}

var clean = function(s){ return String(s||'').replace(/['"<>]/g,''); };

/* Écran de verrouillage : demande d'accès OU admin */
function requestHTML(err){
 return '<div style="display:flex;justify-content:flex-end"><button class="ghost" onclick="__adminFromAccess()">🔐 Admin</button></div>' +
  '<h3>🔐 Accès requis</h3>' +
  '<p class="muted"><b>L\u2019application est verrouillée.</b><br>• <b>Tiers</b> : envoyez une demande d\u2019accès (valable 1 mois après autorisation).<br>• <b>Admin</b> : cliquez sur 🔐 et entrez votre mot de passe.</p>' +
  (err||'') +
  '<input id="arName" placeholder="Votre nom / garage (tiers)">' +
  '<div class="actions"><button class="primary" onclick="__sendRequest()">📨 Demander l\u2019accès (tiers)</button></div>';
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
  '<p class="muted">L\u2019administrateur a refusé ou révoqué votre accès.</p>' +
  '<div class="actions"><button onclick="__reask()">📨 Redemander</button></div>';
}

function expiredHTML(){
 var days = Math.floor((Date.now() - parseInt(localStorage.getItem('mrt_access_granted_at') || '0')) / 86400000);
 return '<div style="display:flex;justify-content:flex-end"><button class="ghost" onclick="__adminFromAccess()">🔐 Admin</button></div>' +
  '<h3>⏰ Accès expiré ('+days+' jours)</h3>' +
  '<p class="muted">Votre accès a expiré (valable 1 mois). Vous devez refaire une demande.</p>' +
  '<div class="actions"><button onclick="__reask()">📨 Renouveler l\u2019accès</button></div>';
}

window.__adminFromAccess = function(){ openModal('adminModal'); };

var polling = null;
function poll(){
 if(polling) return;
 polling = setInterval(async function(){
  var ok = await window.checkAccess(true);
  if(ok && !isAdminDevice()) location.reload();
 }, 15000);
}

window.__recheck = async function(){
 var ok = await window.checkAccess(true);
 if(ok) location.reload();
 else toast('Toujours en attente…');
};

window.__reask = async function(){
 localStorage.removeItem('mrt_access');
 localStorage.removeItem('mrt_access_granted_at');
 screen(requestHTML());
};

window.__sendRequest = async function(){
 var name = clean((document.getElementById('arName')||{}).value) || ('Utilisateur ' + did().slice(-4));
 try {
  var db = await loadFB();
  var id = did();
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
  var db = await loadFB();
  var meta = await db.collection('meta').doc('adminFcm').get();
  var token = meta.exists && meta.data().token;
  if(token && FIREBASE_CONFIG.serverKey){
   await fetch('https://fcm.googleapis.com/fcm/send',{
    method:'POST',
    headers:{'Content-Type':'application/json','Authorization':'key='+FIREBASE_CONFIG.serverKey},
    body: JSON.stringify({to: token, notification: {title:'Demande d\u2019accès', body: name + ' demande l\u2019accès'}})
   });
  }
 } catch(e){}
}

/* === VÉRIFICATION FORCÉE (verrouillage strict) === */
window.checkAccess = async function(silent){
 if(!ENABLED){
  /* Firebase non configuré : verrouiller quand même (admin uniquement) */
  if(isAdminDevice()){ hideScreen(); return true; }
  screen(requestHTML('<p style="color:var(--warn)">⚠️ Firebase non configuré — seul l\u2019admin peut accéder.</p>'));
  return false;
 }

 /* Admin : accès permanent */
 if(isAdminDevice()){
  hideScreen();
  return true;
 }

 var id = did();

 /* Hors ligne : bloque (Firebase requis) */
 if(!navigator.onLine){
  screen(requestHTML('<p style="color:var(--warn)">⚠️ Connexion requise pour valider l\u2019accès.</p>'));
  return false;
 }

 try {
  var db = await loadFB();

  /* Vérifier Firestore */
  var doc = await db.collection('authorizedUsers').doc(id).get();
  if(doc.exists){
   var d = doc.data();
   if(d.active !== false){
    refreshAccessTimestamp();
    hideScreen();
    return true;
   }
   localStorage.removeItem('mrt_access');
   localStorage.removeItem('mrt_access_granted_at');
   screen(deniedHTML());
   return false;
  }

  /* Pas dans authorizedUsers : vérifier si expiré */
  if(isAccessExpired()){
   localStorage.removeItem('mrt_access');
   localStorage.removeItem('mrt_access_granted_at');
   screen(expiredHTML());
   return false;
  }

  /* Demande en attente ? */
  var req = await db.collection('accessRequests').doc(id).get();
  if(req.exists){
   screen(pendingHTML(req.data()));
   poll();
   return false;
  }

  /* Sinon : demande requise */
  screen(requestHTML());
  return false;
 } catch(e){
  console.error('[ACCESS] Erreur:', e);
  screen(requestHTML('<p style="color:var(--danger)">Erreur de vérification.</p>'));
  return false;
 }
};

/* === GARDE : vérification toutes les 30s === */
window.startAccessGuard = function(){
 if(window.__guard) return;
 window.__guard = 1;
 window.ACCESS_GUARD = 1;
 
 setInterval(async function(){
  if(document.hidden || isAdminDevice()) return;
  if(isAccessExpired()){
   localStorage.removeItem('mrt_access');
   localStorage.removeItem('mrt_access_granted_at');
   screen(expiredHTML());
   return;
  }
  await window.checkAccess(true);
 }, 30000);
};

/* === CÔTÉ ADMIN === */
var knownReq = {};

window.onAdminUnlocked = async function(){
 hideScreen();
 localStorage.setItem('mrt_is_admin_device', '1');
 if(!ENABLED) return;
 try {
  var db = await loadFB();
  if(fb.messaging && FIREBASE_CONFIG.vapidKey && ('Notification' in window)){
   var perm = await Notification.requestPermission();
   if(perm === 'granted'){
    var msg = fb.messaging();
    var token = await msg.getToken({vapidKey: FIREBASE_CONFIG.vapidKey});
    if(token) await db.collection('meta').doc('adminFcm').set({token: token, ts: Date.now()});
    msg.onMessage(function(p){
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
 fdb.collection('accessRequests').onSnapshot(function(snap){
  snap.forEach(function(ch){
   var d = ch.data();
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
 var box = document.getElementById('accessAdminBox');
 if(!box) return;
 if(!ENABLED){
  box.innerHTML = '<p class="muted"><b>Firebase non configuré</b> — seul l\u2019admin peut accéder. Ajoutez votre clé pour activer les demandes tiers.</p>';
  return;
 }
 try {
  var db = await loadFB();
  var reqs = await db.collection('accessRequests').where('status','==','pending').get();
  var users = await db.collection('authorizedUsers').get();
  var html = '<h3>👥 Demandes en attente</h3>';
  if(reqs.empty) html += '<p class="muted">Aucune demande.</p>';
  reqs.forEach(function(r){
   var d = r.data();
   var n = clean(d.name);
   html += '<div class="rowItem"><b>'+esc(n)+'</b><span>'+(d.ts?new Date(d.ts).toLocaleDateString('fr-FR'):'')+'</span><span><button class="primary" onclick="accessApprove(\''+r.id+'\',\''+n+'\')">✅ Autoriser</button> <button onclick="accessDeny(\''+r.id+'\',\''+n+'\')">❌ Refuser</button></span></div>';
  });
  html += '<h3>👥 Tiers autorisés (expiration 1 mois)</h3>';
  if(users.empty) html += '<p class="muted">Aucun tiers.</p>';
  users.forEach(function(u){
   var d = u.data();
   var n = clean(d.name || u.id);
   var on = d.active !== false;
   html += '<div class="rowItem"><b>'+esc(n)+'</b><span>'+(on?'✅ autorisé':'🚫 révoqué')+(d.since?' • depuis '+new Date(d.since).toLocaleDateString('fr-FR'):'')+'</span><span>'+(on?'<button onclick="accessRevoke(\''+u.id+'\')">🔒 Révoquer</button>':'<button onclick="accessRestore(\''+u.id+'\')">♻️ Réautoriser</button>')+' <button onclick="accessDelete(\''+u.id+'\')">🗑</button></span></div>';
  });
  html += '<hr><div class="muted">Version : '+ACCESS_VERSION+' • Expiration : 30 jours</div>';
  box.innerHTML = html;
 } catch(e){
  box.innerHTML = '<p class="muted">Erreur Firebase : '+esc(e.message)+'</p>';
 }
};

window.accessApprove = async function(id, name){
 var db = await loadFB();
 await db.collection('authorizedUsers').doc(id).set({name:name, active:true, since:Date.now()});
 await db.collection('accessRequests').doc(id).delete();
 toast('✅ Accès autorisé : '+name);
 renderAccessAdmin();
};

window.accessDeny = async function(id, name){
 var db = await loadFB();
 await db.collection('authorizedUsers').doc(id).set({name:name, active:false, since:Date.now()});
 await db.collection('accessRequests').doc(id).delete();
 toast('❌ Accès refusé : '+name);
 renderAccessAdmin();
};

window.accessRevoke = async function(id){
 var db = await loadFB();
 await db.collection('authorizedUsers').doc(id).update({active:false});
 toast('🔒 Accès révoqué');
 renderAccessAdmin();
};

window.accessRestore = async function(id){
 var db = await loadFB();
 await db.collection('authorizedUsers').doc(id).update({active:true});
 toast('♻️ Accès rétabli');
 renderAccessAdmin();
};

window.accessDelete = async function(id){
 var db = await loadFB();
 await db.collection('authorizedUsers').doc(id).delete();
 toast('🗑 Tiers supprimé');
 renderAccessAdmin();
};

})();
