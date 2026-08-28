/* access.js v3 — Sécurité renforcée + nettoyage anciens accès */
(function(){
'use strict';
/* Nettoyage des anciens systèmes d'accès (pré-Firebase) */
try{
 localStorage.removeItem('mrt_access_legacy');
 localStorage.removeItem('mrt_user_authorized');
 localStorage.removeItem('mrt_access_token');
 sessionStorage.removeItem('mrt_legacy_session');
}catch(e){}

const FIREBASE_CONFIG={apiKey:"AIzaSyCt40beykvP6N_rSY20EjNbo-2Q7jPzMSk",authDomain:"mondiagauto-a4d7a.firebaseapp.com",projectId:"mondiagauto-a4d7a",storageBucket:"mondiagauto-a4d7a.firebasestorage.app",messagingSenderId:"79906378742",appId:"1:79906378742:web:dac91c4a647d52a56e6dd7",vapidKey:"",serverKey:""};
const ENABLED=!!(FIREBASE_CONFIG&&FIREBASE_CONFIG.projectId);
window.ACCESS_ENABLED=ENABLED;
let fb=null,fdb=null;

function did(){let id=localStorage.getItem('mrt_device_id');if(!id){id='dev-'+Math.random().toString(36).slice(2)+Date.now().toString(36);localStorage.setItem('mrt_device_id',id);}return id;}
function isAdminDevice(){return localStorage.getItem('mrt_is_admin_device')==='1'||sessionStorage.getItem('mrt_admin')==='1';}
function loadScript(s){return new Promise((res,rej)=>{const e=document.createElement('script');e.src=s;e.onload=res;e.onerror=rej;document.head.appendChild(e);});}
async function loadFB(){
 if(fb)return fdb;
 await loadScript('https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js');
 await loadScript('https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore-compat.js');
 try{await loadScript('https://www.gstatic.com/firebasejs/10.12.5/firebase-messaging-compat.js');}catch(e){}
 fb=window.firebase;fb.initializeApp(FIREBASE_CONFIG);fdb=fb.firestore();return fdb;
}
function screen(html){
 let el=document.getElementById('accessScreen');
 if(!el){el=document.createElement('div');el.id='accessScreen';el.className='modal show';el.style.zIndex=40;el.innerHTML='<div class="sheetModal"></div>';document.body.appendChild(el);}
 el.querySelector('.sheetModal').innerHTML=html;el.classList.add('show');
}
function hideScreen(){const el=document.getElementById('accessScreen');if(el)el.remove();}
const clean=s=>String(s||'').replace(/['"<>]/g,'');
function requestHTML(err){return '<div style="display:flex;justify-content:flex-end"><button class="ghost" onclick="__adminFromAccess()">🔐 Admin</button></div><h3>🔐 Accès contrôlé</h3><p class="muted">Cette application est protégée par l'administrateur. Envoyez une demande d'accès : l'admin recevra une notification et pourra autoriser ou refuser.</p>'+(err||'')+'<input id="arName" placeholder="Votre nom / garage"><div class="actions"><button class="primary" onclick="__sendRequest()">📨 Demander l'accès</button></div>';}
function pendingHTML(d){return '<div style="display:flex;justify-content:flex-end"><button class="ghost" onclick="__adminFromAccess()">🔐 Admin</button></div><h3>⏳ Demande en attente</h3><p class="muted">Bonjour '+(clean(d&&d.name)||'')+', votre demande a été envoyée. L'app se déverrouillera automatiquement dès autorisation.</p><div class="actions"><button onclick="__recheck()">🔄 Vérifier maintenant</button></div>';}
function deniedHTML(){return '<div style="display:flex;justify-content:flex-end"><button class="ghost" onclick="__adminFromAccess()">🔐 Admin</button></div><h3>🚫 Accès refusé ou révoqué</h3><p class="muted">L'administrateur a coupé ou refusé votre accès.</p><div class="actions"><button onclick="__reask()">📨 Redemander</button></div>';}
window.__adminFromAccess=function(){openModal('adminModal');};
let polling=null;
function poll(){if(polling)return;polling=setInterval(async()=>{const ok=await window.checkAccess(true);if(ok&&!isAdminDevice())location.reload();},15000);}
window.__recheck=async()=>{const ok=await window.checkAccess(true);if(ok)location.reload();else toast('Toujours en attente…');};
window.__reask=async()=>{localStorage.removeItem('mrt_access');screen(requestHTML());};
window.__sendRequest=async function(){
 const name=clean((document.getElementById('arName')||{}).value)||('Utilisateur '+did().slice(-4));
 try{
  const db=await loadFB();const id=did();
  await db.collection('accessRequests').doc(id).set({name:name,deviceId:id,ts:Date.now(),status:'pending'});
  await notifyAdmin(name);
  screen(pendingHTML({name:name}));poll();
 }catch(e){screen(requestHTML('<p style="color:var(--danger)">Erreur réseau — réessayez.</p>'));}
};
async function notifyAdmin(name){
 try{
  const db=await loadFB();
  const meta=await db.collection('meta').doc('adminFcm').get();
  const token=meta.exists&&meta.data().token;
  if(token&&FIREBASE_CONFIG.serverKey){
   await fetch('https://fcm.googleapis.com/fcm/send',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'key='+FIREBASE_CONFIG.serverKey},body:JSON.stringify({to:token,notification:{title:'Mes réponses technique — demande d'accès',body:name+' demande l'accès à l'application'}})});
  }
 }catch(e){}
}
/* VÉRIFICATION ROBUSTE : consulte TOUJOURS Firestore si en ligne (révocation forcée immédiate) */
window.checkAccess=async function(silent){
 if(!ENABLED)return true;
 if(isAdminDevice()){hideScreen();return true;}
 const id=did();
 if(!navigator.onLine)return localStorage.getItem('mrt_access')==='granted';
 try{
  const db=await loadFB();
  const doc=await db.collection('authorizedUsers').doc(id).get();
  if(doc.exists){const d=doc.data();
   if(d.active!==false){localStorage.setItem('mrt_access','granted');hideScreen();return true;}
   localStorage.removeItem('mrt_access');screen(deniedHTML());return false;}
  localStorage.removeItem('mrt_access');
  const req=await db.collection('accessRequests').doc(id).get();
  if(req.exists){screen(pendingHTML(req.data()));poll();return false;}
  screen(requestHTML());return false;
 }catch(e){return localStorage.getItem('mrt_access')==='granted';}
};
/* GARDE : re-vérifie toutes les 30s même app ouverte → révocation forcée appliquée en direct */
window.startAccessGuard=function(){
 if(!ENABLED||window.__guard)return;window.__guard=1;window.ACCESS_GUARD=1;
 setInterval(async()=>{
  if(document.hidden||isAdminDevice())return;
  await window.checkAccess(true);
 },30000);
};
/* ===== Côté ADMIN ===== */
let knownReq={};
window.onAdminUnlocked=async function(){
 hideScreen();
 localStorage.setItem('mrt_is_admin_device','1');
 if(!ENABLED)return;
 try{
  const db=await loadFB();
  if(fb.messaging&&FIREBASE_CONFIG.vapidKey&&('Notification'in window)){
   const perm=await Notification.requestPermission();
   if(perm==='granted'){
    const msg=fb.messaging();
    const token=await msg.getToken({vapidKey:FIREBASE_CONFIG.vapidKey});
    if(token)await db.collection('meta').doc('adminFcm').set({token:token,ts:Date.now()});
    msg.onMessage(p=>{try{new Notification((p.notification&&p.notification.title)||'Notification',{body:p.notification&&p.notification.body});}catch(e){}});
   }
  }
  listenRequests();
  renderAccessAdmin();
 }catch(e){}
};
function listenRequests(){
 if(listenRequests.on)return;listenRequests.on=1;
 fdb.collection('accessRequests').onSnapshot(snap=>{
  snap.forEach(ch=>{
   const d=ch.data();
   if(!knownReq[ch.id]&&d&&d.status==='pending'){knownReq[ch.id]=1;toast('🔔 Demande d'accès : '+d.name);try{if(Notification.permission==='granted')new Notification('Demande d'accès',{body:d.name});}catch(e){}}
  });
  renderAccessAdmin();
 });
}
window.renderAccessAdmin=async function(){
 const box=document.getElementById('accessAdminBox');if(!box)return;
 if(!ENABLED){box.innerHTML='<p class="muted"><b>Contrôle d'accès tiers désactivé</b> (Firebase non configuré) : l'app reste ouverte à tous.</p>';return;}
 try{
  const db=await loadFB();
  const reqs=await db.collection('accessRequests').where('status','==','pending').get();
  const users=await db.collection('authorizedUsers').get();
  let html='<h3>👥 Demandes d'accès en attente</h3>';
  if(reqs.empty)html+='<p class="muted">Aucune demande en attente.</p>';
  reqs.forEach(r=>{const d=r.data();const n=clean(d.name);html+='<div class="rowItem"><b>'+esc(n)+'</b><span>'+(d.ts?new Date(d.ts).toLocaleDateString('fr-FR'):'')+'</span><span><button class="primary" onclick="accessApprove(\''+r.id+'\',\''+n+'\')">✅ Autoriser</button> <button onclick="accessDeny(\''+r.id+'\',\''+n+'\')">❌ Refuser</button></span></div>';});
  html+='<h3>👥 Tableau des tiers — couper l'accès à tout moment (révocation forcée)</h3>';
  if(users.empty)html+='<p class="muted">Aucun tiers enregistré.</p>';
  users.forEach(u=>{const d=u.data();const n=clean(d.name||u.id);const on=d.active!==false;html+='<div class="rowItem"><b>'+esc(n)+'</b><span>'+(on?'✅ autorisé':'🚫 révoqué')+(d.since?' • depuis '+new Date(d.since).toLocaleDateString('fr-FR'):'')+'</span><span>'+(on?'<button onclick="accessRevoke(\''+u.id+'\')">🔒 Couper l'accès</button>':'<button onclick="accessRestore(\''+u.id+'\')">♻️ Réautoriser</button>')+' <button onclick="accessDelete(\''+u.id+'\')">🗑</button></span></div>';});
  box.innerHTML=html;
 }catch(e){box.innerHTML='<p class="muted">Erreur Firebase : '+esc(e.message)+'</p>';}
};
window.accessApprove=async(id,name)=>{const db=await loadFB();await db.collection('authorizedUsers').doc(id).set({name:name,active:true,since:Date.now()});await db.collection('accessRequests').doc(id).delete();toast('✅ Accès autorisé : '+name);renderAccessAdmin();};
window.accessDeny=async(id,name)=>{const db=await loadFB();await db.collection('authorizedUsers').doc(id).set({name:name,active:false,since:Date.now()});await db.collection('accessRequests').doc(id).delete();toast('❌ Accès refusé : '+name);renderAccessAdmin();};
window.accessRevoke=async(id)=>{const db=await loadFB();await db.collection('authorizedUsers').doc(id).update({active:false});toast('🔒 Accès coupé (révocation forcée)');renderAccessAdmin();};
window.accessRestore=async(id)=>{const db=await loadFB();await db.collection('authorizedUsers').doc(id).update({active:true});toast('♻️ Accès rétabli');renderAccessAdmin();};
window.accessDelete=async(id)=>{const db=await loadFB();await db.collection('authorizedUsers').doc(id).delete();toast('🗑 Tiers supprimé');renderAccessAdmin();};
})();
