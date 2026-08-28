/* app.js — Logique complète (lit data.js, dtc-db.js, assistant.js, access.js) */
'use strict';
const ADMIN_PASS=atob('S2V2aW44MzYwMA==');
const APP_VERSION='v27_pwabuilder';
const DB_NAME='mrt_db', DB_VER=1, SEED_FLAG='mrt_seeded_v12';
const WEEK_MS=7*24*3600*1000, WATCH_MAX=20, AUTO_BATCH=8;
const ORIGINS={FR:'🇫🇷 Françaises',EU:'🇪🇺 Européennes',AS:'🌏 Asiatiques',US:'🇺🇸 Américaines'};
const CATS=['Tous','Moteur','Transmission','Électronique','Électrique','Airbag','Ceinture','ABS','ADAS','Caméra','Freinage'];
const FUELS=['Tous','essence','diesel','flexfuel','hybride','hybride rechargeable','électrique','GPL','hydrogène'];

/* 30 systèmes génériques → génération 21 000+ fiches */
var SYSTEMS=[
['Capteur vitesse roue ABS/ESP','Voyant ABS/ESP, régulateur indisponible.',['C0035','C0040'],'Contrôle capteur + câblage, remplacement.','Panne ABS','ABS'],
['ADAS : calibration caméra/radar','Alertes ADAS après pare-brise ou choc.',['U-codes ADAS'],'Calibration statique/dynamique caméra & radar.','Préconisation ADAS','ADAS'],
['Contacteur tournant airbag','Voyant airbag, klaxon/commandes HS.',['B1000'],'Remplacement contacteur tournant.','Panne airbag','Airbag'],
['Calculateur airbag verrouillé','Voyant airbag permanent après choc.',['B-codes'],'Relecture/remplacement calculateur airbag.','Sécurité','Airbag'],
['Prétensionneur ceinture','Voyant ceinture, prétensionneur inactif.',['B-codes SRS'],'Contrôle faisceau, remplacement prétensionneur.','Sécurité','Ceinture'],
['Étrier de frein grippé','Frein tire d\u2019un côté, odeur chaud.',['Codes ABS/ESP'],'Contrôle piston/étrier, purge.','Panne freinage','Freinage'],
['Plaquettes/disques usés','Voyant usure, vibrations au freinage.',['Codes ABS/ESP'],'Contrôle épaisseur, remplacement.','Panne freinage','Freinage'],
['Multimédia : reboots','Écran figé/noir, perte GPS.',['U0155','U1233'],'MAJ firmware, reset, remplacement.','Panne électronique','Électronique'],
['Boîtier servitude BSI/BCM','Feux/centralisation aléatoires.',['U-codes'],'Contrôle connectiques, MAJ, remplacement.','Panne électronique','Électronique'],
['Direction assistée électrique','Assistance variable ou absente.',['C0500','C0545'],'Contrôle capteur couple, MAJ colonne.','Panne direction','Électronique'],
['Capteurs TPMS','Voyant pression pneus, capteurs muets.',['C0750','C0754'],'Réapprentissage, remplacement capteur.','Panne TPMS','Électronique'],
['Pulseur/résistance clim','Perte ventilation, vitesse 4 seule.',['B1421'],'Remplacement résistance/pulseur.','Panne clim','Électronique'],
['Lève-vitre avant','Vitre descend seul, blocage.',['B-codes'],'Contrôle moteur/câbles, réinitialisation.','Panne électronique','Électronique'],
['Centralisation/télécommande','Portes non verrouillées.',['B3028'],'Contrôle piles/récepteur, réapprentissage.','Panne électronique','Électronique'],
['Circuit charge 12V','Voyant batterie, démarrage faible.',['P0562','P0563'],'Test batterie + alternateur, masses.','Panne électrique','Électrique'],
['Capteurs stationnement','Bips continus/inopérants.',['Codes park'],'Contrôle/nettoyage capteurs.','Panne caméra/park','Caméra'],
['Caméra recul/360°','Image figée/absente.',['Codes caméra'],'Contrôle faisceau, calibration.','Panne caméra','Caméra'],
['Réseau CAN perte communication','Multiples défauts U simultanés.',['U0100','U0121'],'Contrôle connectiques CAN, résistance 60Ω.','Panne électronique','Électronique'],
['Main-libre/démarrage sans clé','Non-détection clé.',['B-codes immo'],'Contrôle pile clé/antennes, réapprentissage.','Panne électronique','Électronique'],
['Contacteur pédale frein','Feux stop intermittents.',['P0504'],'Remplacement contacteur pédale.','Panne freinage','Freinage'],
['Compresseur clim','Clim inopérante, bruit.',['P0532','P0533'],'Contrôle charge/pression, embrayage.','Panne clim','Électronique'],
['Module éclairage LED','Feux diurnes défaillants.',['B1310'],'Contrôle modules LED, remplacement.','Panne éclairage','Électronique'],
['Sonde température liquide','Surchauffe, voyant température.',['P0117','P0118'],'Contrôle sonde, pompe, radiateur.','Panne refroidissement','Moteur'],
['Thermostat','Moteur long à chauffer, surchauffe.',['P0128'],'Remplacement thermostat.','Panne refroidissement','Moteur'],
['Débitmètre MAF','Perte puissance, fumée.',['P0100','P0101'],'Nettoyage/remplacement MAF.','Panne essence','Moteur'],
['Bobines allumage','Ratés, voyant clignotant.',['P0300','P0301'],'Remplacement bobines/bougies.','Panne essence','Moteur'],
['Injecteurs','Ralenti irrégulier, perte puissance.',['P0201','P0202'],'Test injecteurs, nettoyage/remplacement.','Panne injection','Moteur'],
['Vanne EGR','Perte puissance, voyant moteur.',['P0401','P0402'],'Nettoyage/remplacement EGR.','Panne dépollution','Moteur'],
['FAP','Voyant FAP, mode dégradé.',['P2002','P242F'],'Régénération forcée, contrôle capteurs.','Panne dépollution','Moteur'],
['AdBlue/SCR','Rendement SCR insuffisant, voyant AdBlue.',['P20EE','P202E'],'Qualité AdBlue, injecteur, capteurs NOx, SCR.','Panne dépollution','Moteur']
];

/* === INDEXEDDB === */
function idb(){return new Promise((res,rej)=>{const r=indexedDB.open(DB_NAME,DB_VER);r.onupgradeneeded=e=>{const db=e.target.result;['brands','models','engines','sheets'].forEach(s=>{if(!db.objectStoreNames.contains(s))db.createObjectStore(s,{keyPath:'id'});});};r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});}
async function dbAll(store){const db=await idb();return new Promise((res,rej)=>{const q=db.transaction(store).objectStore(store).getAll();q.onsuccess=()=>res(q.result||[]);q.onerror=()=>rej(q.error);});}
async function dbPut(store,val){const db=await idb();return new Promise((res,rej)=>{const tx=db.transaction(store,'readwrite');tx.objectStore(store).put(val);tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error);});}
async function dbBulk(store,vals){const db=await idb();for(let i=0;i<vals.length;i+=2000){await new Promise((res,rej)=>{const tx=db.transaction(store,'readwrite');vals.slice(i,i+2000).forEach(v=>tx.objectStore(store).put(v));tx.oncomplete=()=>res();tx.onerror=()=>rej(tx.error);});}}
async function dbDel(store,id){const db=await idb();return new Promise(res=>{const tx=db.transaction(store,'readwrite');tx.objectStore(store).delete(id);tx.oncomplete=()=>res();});}
async function dbClear(store){const db=await idb();return new Promise(res=>{const tx=db.transaction(store,'readwrite');tx.objectStore(store).clear();tx.oncomplete=()=>res();});}

const h=s=>{let x=7;for(let i=0;i<s.length;i++)x=(x*31+s.charCodeAt(i))>>>0;return x.toString(36);};

/* === GÉNÉRATION 21 000+ === */
function buildAllSheets(models,engines){
 var out=[],seen=new Set();
 function push(b,m,e,cat,titre,sym,dtc,fix,src,off){
  var id='g'+h([b,m,e||'',titre].join('|'));
  if(seen.has(id))return; seen.add(id);
  out.push({id:id,b:b,m:m,e:e||'',cat:cat,titre:titre,sym:sym,dtc:dtc,fix:fix,src:src,off:off?1:0});
 }
 (window.SEED_SHEETS||[]).forEach(function(s){push(s.b,s.m,s.e||'',s.cat,s.titre,s.sym,s.dtc,s.fix,s.src,s.off);});
 /* Familles (FAM) par motorisation */
 engines.forEach(function(x){
  (window.FAM||[]).forEach(function(r){
   if((!r.brands.length||r.brands.indexOf(x.b)!==-1)&&(r.re.test(x.e)||r.re.test(x.m)))
    push(x.b,x.m,x.e,r.cat,r.t,r.s,r.d,r.f,r.src);
  });
 });
 /* Pannes par type de carburant */
 engines.forEach(function(x){
  var T = x.fuel==='diesel'?(window.T_D||[]) : x.fuel==='essence'?(window.T_E||[]) : (x.fuel==='électrique')?(window.T_EV||[]) : (x.fuel==='hybride'||x.fuel==='hybride rechargeable')?(window.T_HY||[]) : (window.T_E||[]);
  T.forEach(function(a){push(x.b,x.m,x.e,a[5],a[0],a[1],a[2],a[3],a[4]);});
 });
 /* 30 systèmes × chaque modèle → gros volume */
 models.forEach(function(x){
  SYSTEMS.forEach(function(a){push(x.b,x.m,'',a[5],x.m+' : '+a[0],a[1],a[2],a[3],a[4]);});
 });
 /* Pannes connues (known-issues) par modèle + par motorisation */
 if(window.getKnownIssues){
  models.forEach(function(m){
   var iss=window.getKnownIssues(m.b,m.m);
   if(iss&&iss.length) iss.forEach(function(i){push(m.b,m.m,'',classifyOfficial(i[0]+' '+i[1]),m.m+' : '+i[0],i[0],i[3]||[],i[2],i[4]||'Panne connue');});
  });
  engines.forEach(function(eng){
   var iss=window.getKnownIssues(eng.b,eng.m);
   if(iss&&iss.length) iss.forEach(function(i){push(eng.b,eng.m,eng.e,classifyOfficial(i[0]+' '+i[1]),eng.m+' '+eng.e+' : '+i[0],i[0]+' ('+eng.e+')',i[3]||[],i[2]+' (spécifique '+eng.e+')',i[4]||'Panne connue');});
  });
 }
 console.log('[buildAllSheets] total fiches:',out.length);
 return out;
}
async function seedIfEmpty(){
 if(localStorage.getItem(SEED_FLAG))return;
 var brands=(window.SEED_BRANDS||[]).map(function(x){return {id:x[0],name:x[0],origin:x[1]};});
 var models=[];Object.keys(window.SEED_MODELS||{}).forEach(function(b){window.SEED_MODELS[b].forEach(function(m){models.push({id:b+'|'+m,b:b,m:m});});});
 var engines=[];Object.keys(window.SEED_ENGINES||{}).forEach(function(k){var p=k.split('|');window.SEED_ENGINES[k].forEach(function(e){engines.push({id:k+'|'+e[0],b:p[0],m:p[1],e:e[0],fuel:e[1]});});});
 var sheets=buildAllSheets(models,engines);
 await dbBulk('brands',brands);await dbBulk('models',models);await dbBulk('engines',engines);await dbBulk('sheets',sheets);
 localStorage.setItem(SEED_FLAG,'1');
 setTimeout(function(){toast('✅ Base initialisée : '+sheets.length.toLocaleString('fr-FR')+' fiches');},800);
}

/* === UTILITAIRES UI === */
function getWatchlist(){try{return JSON.parse(localStorage.getItem('mrt_watchlist')||'[]');}catch(e){return[];}}
function addWatch(b,m){var l=getWatchlist().filter(function(x){return !(x.b===b&&x.m===m);});l.unshift({b:b,m:m});localStorage.setItem('mrt_watchlist',JSON.stringify(l.slice(0,WATCH_MAX)));}
function clearWatchlist(){localStorage.setItem('mrt_watchlist','[]');toast('Liste de suivi vidée');refreshAdmin();}

var $=function(s){return document.querySelector(s);};
var state={group:'ALL',brand:null,model:null,engine:null,fuel:'Tous',cat:'Tous',q:''};
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function toast(msg){var t=$('#toast');t.textContent=msg;t.style.display='block';clearTimeout(t._x);t._x=setTimeout(function(){t.style.display='none';},3500);}
function closeDrawer(id){$('#'+id).style.display='none';}
function closeModal(id){$('#'+id).classList.remove('show');}
function openModal(id){$('#'+id).classList.add('show');}
function hideSuggest(){['dtcSuggest','modelSuggest','brandSuggest','aiResult'].forEach(function(id){var el=document.getElementById(id);if(el)el.style.display='none';});}
window.hideSuggest=hideSuggest;
window.validateSearch=function(){hideSuggest();renderGlobal($('#globalSearch').value);};
window.clearSearchBox=function(){$('#globalSearch').value='';hideSuggest();$('#globalDrawer').style.display='none';};

function classifyOfficial(text){
 var c=(text||'').toLowerCase();
 if(/airbag|srs|pretension|prétension|inflator|takata/i.test(c))return'Airbag';
 if(/belt|seatbelt|ceinture|retractor|harness|enrouleur/i.test(c))return'Ceinture';
 if(/adas|adaptive cruise|lane keep|park assist|blind spot|collision|aeb|autopilot|radar|front ?assist/i.test(c))return'ADAS';
 if(/camera|caméra|rear view|backup cam|360|parking cam/i.test(c))return'Caméra';
 if(/\babs\b|anti[- ]?lock|antiblocage|ebd|bas/i.test(c))return'ABS';
 if(/brak|frein|caliper|étrier|pédale|pedal|rotor|disque|plaquette|pad/i.test(c))return'Freinage';
 if(/battery|batter[iy]e|cell|module|hv |high[- ]?voltage|traction|li[- ]?ion|lithium|bms|lfp|nmc/i.test(c))return'Électrique';
 if(/inverter|convertisseur|dc[\s/-]?dc|dc[\s/-]?ac|onduleur|charger|chargeur|obc/i.test(c))return'Électrique';
 if(/transmission|gear|gearbox|boîte|boite|clutch|embrayage|driveshaft|axle|dsg|cvt|edc|dct/i.test(c))return'Transmission';
 if(/egr|fap|dpf|adblue|scr|nox|cataly|échap|exhaust|reductant/i.test(c))return'Dépollution';
 if(/engine|moteur|turbo|injector|injecteur|valve|soupape|camshaft|piston|cylinder|fuel|carburant|throttle|papillon/i.test(c))return'Moteur';
 return'Électronique';
}
function stripAcc(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'');}

/* === SYNCHRONISATIONS OFFICIELLES === */
async function syncNHTSA(silent){
 if(!navigator.onLine){if(!silent)toast('Hors ligne');return 0;}
 if(!state.brand||!state.model){if(!silent)toast('Sélectionnez marque et modèle');return 0;}
 var make=stripAcc(state.brand).toUpperCase(),n=0;
 if(!silent)toast('Interrogation NHTSA…');
 try{
  var r=await fetch('https://api.nhtsa.gov/recalls/recallsByVehicle?make='+encodeURIComponent(make)+'&model='+encodeURIComponent(state.model));
  var j=await r.json();
  (j.results||[]).forEach(function(rec){
   var id='nhtsa-'+rec.NHTSACampaignNumber;
   var comp=(rec.Component||'')+' '+(rec.Summary||'');
   dbPut('sheets',{id:id,b:state.brand,m:state.model,e:'',cat:classifyOfficial(comp),titre:'Rappel NHTSA : '+rec.Component,sym:rec.Summary||'—',dtc:['Voir rapport NHTSA '+rec.NHTSACampaignNumber],fix:(rec.Remedy?'Action : '+rec.Remedy:'Contacter le réseau '+state.brand),src:'NHTSA '+rec.NHTSACampaignNumber,off:1});n++;
  });
 }catch(e){}
 if(!silent)toast('NHTSA : '+n+' rappel(s) ✓');renderSheets();return n;
}
async function syncTSB(silent){
 if(!navigator.onLine){if(!silent)toast('Hors ligne');return 0;}
 if(!state.brand||!state.model){if(!silent)toast('Sélectionnez marque et modèle');return 0;}
 var make=stripAcc(state.brand).toUpperCase(),n=0;
 if(!silent)toast('Interrogation TSB…');
 try{
  var r=await fetch('https://api.nhtsa.gov/tsb/tsbsByVehicle?make='+encodeURIComponent(make)+'&model='+encodeURIComponent(state.model));
  var j=await r.json();
  (j.results||[]).forEach(function(rec){
   var num=rec.tsbNumber||rec.bulletinNumber||rec.id||h(JSON.stringify(rec));
   var title=rec.title||rec.component||'Fiche technique constructeur';
   var id='tsb-'+String(num).replace(/[^a-zA-Z0-9-]/g,'-');
   var comp=(rec.component||'')+' '+(rec.summary||'');
   dbPut('sheets',{id:id,b:state.brand,m:state.model,e:'',cat:classifyOfficial(comp),titre:'TSB constructeur : '+String(title).slice(0,120),sym:rec.summary||'—',dtc:['Réf. TSB '+num],fix:rec.remedy||'Appliquer la procédure constructeur.',src:'NHTSA TSB '+num,off:1});n++;
  });
 }catch(e){}
 if(!silent)toast('TSB : '+n+' fiche(s) ✓');renderSheets();return n;
}
async function syncRappelConso(silent){
 if(!navigator.onLine){if(!silent)toast('Hors ligne');return 0;}
 if(!state.brand||!state.model){if(!silent)toast('Sélectionnez marque et modèle');return 0;}
 if(!silent)toast('Interrogation Rappel Conso…');var n=0;
 try{
  var q=encodeURIComponent('search(produit,"'+state.brand+' '+state.model+'") OR search(marque,"'+state.brand+'")');
  var r=await fetch('https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/rappels-produits/records?limit=100&where='+q);
  var j=await r.json();
  (j.results||[]).forEach(function(rec){
   var hay=(rec.motif||'')+' '+(rec.produit||'')+' '+(rec.risques||'')+' '+(rec.conduites_a_suivre||'');
   var id='rc-'+h(JSON.stringify(rec));
   dbPut('sheets',{id:id,b:state.brand,m:state.model,e:'',cat:classifyOfficial(hay),titre:'Rappel Conso : '+String(rec.motif||rec.produit||'Produit rappelé').slice(0,120),sym:(rec.produit||'')+(rec.risques?' — Risques : '+rec.risques:''),dtc:['Voir fiche Rappel Conso'],fix:rec.conduites_a_suivre||rec.url||'Voir fiche officielle',src:'Rappel Conso',off:1});n++;
  });
 }catch(e){}
 if(!silent)toast('Rappel Conso : '+n+' fiche(s) ✓');renderSheets();return n;
}
async function syncSafetyGate(silent){
 if(!navigator.onLine){if(!silent)toast('Hors ligne');return 0;}
 if(!state.brand||!state.model){if(!silent)toast('Sélectionnez marque et modèle');return 0;}
 if(!silent)toast('Interrogation Safety Gate…');var n=0;
 var eps=[
  'https://ec.europa.eu/safety-gate/api/search?query='+encodeURIComponent(state.brand+' '+state.model)+'&size=200&type=product&category=motor_vehicles',
  'https://ec.europa.eu/safety-gate/api/search?query='+encodeURIComponent(state.brand)+'&size=200&type=product&category=motor_vehicles'
 ];
 for(var i=0;i<eps.length;i++){
  if(n>=80)break;
  try{
   var r=await fetch(eps[i],{headers:{'Accept':'application/json'}});
   if(!r.ok)continue;
   var j=await r.json();
   var list=Array.isArray(j)?j:(j.hits||j.results||j.data||j.records||j.alerts||[]);
   list.forEach(function(rec){
    if(!rec)return;
    var titre=rec.title||rec.subject||rec.name||rec.alert_title||'Alerte Safety Gate';
    var desc=rec.description||rec.alert_description||rec.summary||rec.text||rec.details||'';
    var risk=rec.risk_type||rec.risk||rec.category||'';
    var brand=rec.brand||rec.brand_name||rec.make||'';
    var ref=rec.alert_reference||rec.reference||rec.number||rec.id||rec.ref||h(JSON.stringify(rec));
    var hay=(titre+' '+desc+' '+risk+' '+brand).toLowerCase();
    if(!(hay.indexOf(state.brand.toLowerCase())!==-1||hay.indexOf(stripAcc(state.brand).toLowerCase())!==-1))return;
    var id='sg-'+String(ref).replace(/[^a-zA-Z0-9-]/g,'-')+'-'+h(titre+desc);
    dbPut('sheets',{id:id,b:state.brand,m:state.model,e:'',cat:classifyOfficial(desc+' '+risk+' '+titre),titre:'Safety Gate UE : '+String(titre).slice(0,120),sym:(desc||'—')+(risk?' — Risque : '+risk:''),dtc:['Réf. Safety Gate '+ref],fix:'Contacter le réseau '+state.brand+'. Confirmer avec le VIN.',src:'EU Safety Gate '+ref,off:1});n++;
   });
  }catch(e){}
 }
 if(!silent)toast('Safety Gate : '+n+' alerte(s) ✓');renderSheets();return n;
}
async function syncAll(){
 if(!navigator.onLine)return toast('Hors ligne');
 if(!state.brand||!state.model)return toast('Sélectionnez marque et modèle');
 toast('Synchronisation complète…');
 var a=await syncNHTSA(true),t=await syncTSB(true),b=await syncRappelConso(true),c=await syncSafetyGate(true);
 toast('✅ Total importé : '+(a+t+b+c)+' fiches');
}

async function autoUpdate(force){
 if(!navigator.onLine){if(force)toast('Hors ligne');return 0;}
 var last=parseInt(localStorage.getItem('mrt_last_auto_update')||'0'),now=Date.now();
 if(!force&&(now-last)<WEEK_MS)return 0;
 var list=getWatchlist();
 if(!list.length){if(force)toast('Aucun véhicule suivi');return 0;}
 localStorage.setItem('mrt_last_auto_update',String(now));
 var pb=state.brand,pm=state.model,pe=state.engine,batch=list.slice(0,AUTO_BATCH),total=0;
 toast('🔄 MàJ auto : '+batch.length+' véhicule(s)…');
 for(var i=0;i<batch.length;i++){
  state.brand=batch[i].b;state.model=batch[i].m;
  total+=(await syncNHTSA(true))+(await syncTSB(true))+(await syncRappelConso(true))+(await syncSafetyGate(true));
 }
 state.brand=pb;state.model=pm;state.engine=pe;
 toast('✅ MàJ auto terminée : +'+total+' fiches');refreshAdmin();return total;
}

/* === AUTO-VÉRIFICATION === */
async function weeklyVerification(){
 var last=parseInt(localStorage.getItem('mrt_last_verification')||'0'),now=Date.now();
 if(now-last<WEEK_MS){toast('Dernière vérification il y a '+Math.round((now-last)/86400000)+' jours');return;}
 toast('🔍 Vérification hebdomadaire…');
 var r=await Promise.all(['brands','models','engines','sheets'].map(dbAll));
 var b=r[0],m=r[1],e=r[2],s=r[3],errors=[];
 if(b.length<200)errors.push('Marques insuffisantes');
 if(m.length<800)errors.push('Modèles insuffisants');
 if(s.length<5000)errors.push('Fiches insuffisantes');
 ['P0016','P0087','P0299','P0401','P2002','P20EE','P0700','C0035','B0001','P0A80'].forEach(function(code){
  if(!window.dtcInfo||!window.dtcInfo(code))errors.push('Code DTC manquant : '+code);
 });
 localStorage.setItem('mrt_last_verification',String(now));
 if(errors.length)toast('⚠️ '+errors.length+' erreur(s)');
 else toast('✅ Vérification réussie : '+b.length+' marques, '+m.length+' modèles, '+s.length+' fiches');
}
function selfTest(){
 var bgOp=parseFloat(getComputedStyle($('#bg')).opacity);
 return[
  ['Bouton 🔐 admin',!!$('#btnAdmin')],
  ['Mdp masqué',$('#adminPass').type==='password'],
  ['Accès tiers Firebase',window.ACCESS_ENABLED?'actif':'désactivé'],
  ['Révocation forcée',!!window.ACCESS_GUARD],
  ['Base DTC ('+(window.DTC_COUNT||0)+' codes)',(window.DTC_COUNT||0)>=100],
  ['extractDtc P20EE',!!(window.extractDtc&&window.extractDtc('P20EE').length)],
  ['IA Gemini',!!window.askGemini],
  ['Fond 80%',bgOp>=0.75]
 ];
}
async function refreshAdmin(){
 var r=await Promise.all(['brands','models','engines','sheets'].map(dbAll));
 var b=r[0],m=r[1],e=r[2],s=r[3];
 var official=s.filter(function(x){return x.off;}).length;
 var wl=getWatchlist();
 var last=parseInt(localStorage.getItem('mrt_last_auto_update')||'0');
 var next=last?new Date(last+WEEK_MS).toLocaleDateString('fr-FR'):'—';
 var html='<span class="stat"><b>'+b.length+'</b>marques</span><span class="stat"><b>'+m.length+'</b>modèles</span><span class="stat"><b>'+e.length+'</b>motorisations</span><span class="stat"><b>'+s.length.toLocaleString('fr-FR')+'</b>fiches</span><span class="stat"><b>'+official.toLocaleString('fr-FR')+'</b>officielles</span><span class="stat"><b>'+wl.length+'</b>suivis</span><span class="stat"><b>'+(last?new Date(last).toLocaleDateString('fr-FR'):'jamais')+'</b>dernière MàJ</span><span class="stat"><b>'+next+'</b>prochaine MàJ</span>';
 html+='<div style="margin-top:8px"><b class="muted">AUTO-TESTS :</b><br>'+selfTest().map(function(i){return '<span class="stat"><b>'+(i[1]===true?'✅':(i[1]===false?'⚠️':''))+'</b>'+i[0]+'</span>';}).join('')+'</div>';
 $('#statsBox').innerHTML=html;
 fillBrandSelects(b);
}
function fillBrandSelects(brands){
 ['nmBrand','neBrand','nfBrand'].forEach(function(id){
  var sel=$('#'+id);sel.innerHTML='';
  brands.slice().sort(function(a,b){return a.name.localeCompare(b.name,'fr');}).forEach(function(x){var o=document.createElement('option');o.value=x.name;o.textContent=x.name;sel.appendChild(o);});
 });
}
async function fillModelSelect(bSel,mSel){
 var models=(await dbAll('models')).filter(function(x){return x.b===$('#'+bSel).value;});
 var sel=$('#'+mSel);sel.innerHTML='';
 models.forEach(function(x){var o=document.createElement('option');o.value=x.m;o.textContent=x.m;sel.appendChild(o);});
 if(mSel==='nfModel')fillEngineSelect();
}
async function fillEngineSelect(){
 var eng=(await dbAll('engines')).filter(function(x){return x.b===$('#nfBrand').value&&x.m===$('#nfModel').value;});
 var sel=$('#nfEngine');sel.innerHTML='<option value="">(toutes)</option>';
 eng.forEach(function(x){var o=document.createElement('option');o.value=x.e;o.textContent=x.e;sel.appendChild(o);});
}
function adminTab(btn,id){
 document.querySelectorAll('.adminTabs .chip').forEach(function(c){c.classList.remove('active');});
 btn.classList.add('active');
 document.querySelectorAll('.adminSec').forEach(function(s){s.classList.remove('show');});
 $('#'+id).classList.add('show');
 if(id==='tabAccess'&&window.renderAccessAdmin)window.renderAccessAdmin();
 if(id==='tabStats')refreshAdmin();
}
async function addBrand(){var n=$('#nbName').value.trim();if(!n)return toast('Nom requis');await dbPut('brands',{id:n,name:n,origin:$('#nbOrigin').value});toast('Marque ajoutée ✓');refreshAdmin();renderBrands();}
async function addModel(){var b=$('#nmBrand').value,n=$('#nmName').value.trim();if(!n)return toast('Nom requis');await dbPut('models',{id:b+'|'+n,b:b,m:n});toast('Modèle ajouté ✓');refreshAdmin();if(state.brand===b)renderModels();}
async function addEngine(){var b=$('#neBrand').value,m=$('#neModel').value,e=$('#neLabel').value.trim(),f=$('#neFuel').value;if(!e)return toast('Libellé requis');await dbPut('engines',{id:b+'|'+m+'|'+e,b:b,m:m,e:e,fuel:f});toast('Motorisation ajoutée ✓');refreshAdmin();if(state.brand===b&&state.model===m)renderEngines();}
async function addSheet(){
 var b=$('#nfBrand').value,m=$('#nfModel').value,e=$('#nfEngine').value,titre=$('#nfTitle').value.trim();
 if(!titre)return toast('Titre requis');
 await dbPut('sheets',{id:'u'+h(b+m+e+titre+Date.now()),b:b,m:m,e:e,cat:$('#nfCat').value,titre:titre,sym:$('#nfSym').value,dtc:$('#nfDtc').value.split(',').map(function(s){return s.trim();}).filter(Boolean),fix:$('#nfFix').value,src:$('#nfSrc').value||'Ajout admin'});
 toast('Fiche enregistrée ✓');
 $('#nfTitle').value=$('#nfSym').value=$('#nfDtc').value=$('#nfFix').value=$('#nfSrc').value='';
}
async function doImport(){
 var f=$('#importFile').files[0];if(!f)return toast('Choisissez un fichier JSON');
 try{
  var data=JSON.parse(await f.text()),n=0;
  async function putAll(store,arr){if(!Array.isArray(arr))return;arr.forEach(function(x){if(!x.id)x.id='i'+h(JSON.stringify(x));});await dbBulk(store,arr);n+=arr.length;}
  await putAll('brands',data.brands);await putAll('models',data.models);await putAll('engines',data.engines);
  await putAll('sheets',Array.isArray(data)?data:data.sheets);
  toast(n+' entrée(s) importée(s) ✓');refreshAdmin();renderBrands();
 }catch(e){toast('Fichier invalide : '+e.message);}
}
async function exportAll(){
 var r=await Promise.all(['brands','models','engines','sheets'].map(dbAll));
 var blob=new Blob([JSON.stringify({brands:r[0],models:r[1],engines:r[2],sheets:r[3]},null,1)],{type:'application/json'});
 var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='mon-aide-technique-export.json';a.click();
}
async function resetBase(){if(!confirm('Régénérer toute la base ?'))return;for(var i=0;i<4;i++)await dbClear(['brands','models','engines','sheets'][i]);localStorage.removeItem(SEED_FLAG);await seedIfEmpty();refreshAdmin();renderBrands();toast('Base régénérée ✓');}
async function clearOfficial(){
 if(!confirm('Effacer UNIQUEMENT les fiches officielles ?'))return;
 var s=await dbAll('sheets'),keep=s.filter(function(x){return !x.off;});
 await dbClear('sheets');await dbBulk('sheets',keep);
 refreshAdmin();toast('Fiches officielles effacées ('+keep.length+' conservées) ✓');
}

/* === RENDU UI === */
function renderGroupChips(){
 var c=$('#groupChips');c.innerHTML='';
 [['ALL','🌍 Toutes'],['FR',ORIGINS.FR],['EU',ORIGINS.EU],['AS',ORIGINS.AS],['US',ORIGINS.US]].forEach(function(k){
  var d=document.createElement('div');d.className='chip'+(state.group===k[0]?' active':'');d.textContent=k[1];
  d.onclick=function(){state.group=k[0];renderGroupChips();renderBrands();};c.appendChild(d);
 });
}
async function renderBrands(){
 var brands=await dbAll('brands');
 if(state.group!=='ALL')brands=brands.filter(function(b){return b.origin===state.group;});
 if(state.q)brands=brands.filter(function(b){return b.name.toLowerCase().indexOf(state.q)!==-1;});
 brands.sort(function(a,b){return a.name.localeCompare(b.name,'fr');});
 var g=$('#brandGrid');g.innerHTML='';
 brands.forEach(function(b){
  var d=document.createElement('div');d.className='brandBtn';
  d.innerHTML='<b>'+esc(b.name)+'</b><span>'+ORIGINS[b.origin]+'</span>';
  d.onclick=function(){selectBrand(b.name);};g.appendChild(d);
 });
}
async function selectBrand(name){
 state.brand=name;state.model=null;state.engine=null;
 $('#modelsDrawer').style.display='';$('#modelsTitle').textContent='🚗 Modèles — '+name;
 closeDrawer('enginesDrawer');closeDrawer('sheetsDrawer');
 await renderModels();$('#modelsDrawer').scrollIntoView({behavior:'smooth'});
}
async function renderModels(){
 var models=(await dbAll('models')).filter(function(x){return x.b===state.brand;});
 var q=($('#modelSearch').value||'').toLowerCase();
 var list=$('#modelList');list.innerHTML='';
 if(!models.length)list.innerHTML='<p class="muted">Aucun modèle.</p>';
 models.filter(function(x){return !q||x.m.toLowerCase().indexOf(q)!==-1;}).sort(function(a,b){return a.m.localeCompare(b.m,'fr');}).forEach(function(x){
  var d=document.createElement('div');d.className='rowItem';d.innerHTML='<b>'+esc(x.m)+'</b><span>modèles ▸</span>';
  d.onclick=function(){selectModel(x.m);};list.appendChild(d);
 });
}
async function selectModel(m){
 state.model=m;state.engine=null;addWatch(state.brand,m);
 $('#enginesDrawer').style.display='';$('#enginesTitle').textContent='⚙️ Motorisations — '+state.brand+' '+m;
 closeDrawer('sheetsDrawer');renderFuelChips();await renderEngines();$('#enginesDrawer').scrollIntoView({behavior:'smooth'});
}
function renderFuelChips(){
 var c=$('#fuelChips');c.innerHTML='';
 FUELS.forEach(function(f){
  var d=document.createElement('div');d.className='chip'+(state.fuel===f?' active':'');d.textContent=f;
  d.onclick=function(){state.fuel=f;renderFuelChips();renderEngines();};c.appendChild(d);
 });
}
async function renderEngines(){
 var eng=(await dbAll('engines')).filter(function(x){return x.b===state.brand&&x.m===state.model;});
 var all=eng;
 if(state.fuel!=='Tous')eng=eng.filter(function(x){return x.fuel===state.fuel;});
 var list=$('#engineList');list.innerHTML='';
 var every=document.createElement('div');every.className='rowItem';
 every.innerHTML='<b>📂 Toutes les fiches du modèle</b><span>'+all.length+' motorisations</span>';
 every.onclick=function(){selectEngine(null);};list.appendChild(every);
 if(!eng.length)list.insertAdjacentHTML('beforeend','<p class="muted">Aucune motorisation.</p>');
 eng.sort(function(a,b){return a.e.localeCompare(b.e);}).forEach(function(x){
  var d=document.createElement('div');d.className='rowItem';d.innerHTML='<b>'+esc(x.e)+'</b><span>'+esc(x.fuel)+'</span>';
  d.onclick=function(){selectEngine(x.e);};list.appendChild(d);
 });
}
async function selectEngine(e){
 state.engine=e;
 $('#sheetsDrawer').style.display='';
 $('#sheetsTitle').textContent='📋 Fiches — '+state.brand+' '+state.model+(e?' • '+e:'');
 renderCatChips();await renderSheets();$('#sheetsDrawer').scrollIntoView({behavior:'smooth'});
}
function renderCatChips(){
 var c=$('#catChips');c.innerHTML='';
 CATS.forEach(function(k){
  var d=document.createElement('div');d.className='chip'+(state.cat===k?' active':'');d.textContent=k;
  d.onclick=function(){state.cat=k;renderCatChips();renderSheets();};c.appendChild(d);
 });
}
function sheetCard(s){
 var d=document.createElement('div');d.className='sheet';
 d.innerHTML='<div class="l1"><span class="cat c-'+esc(s.cat)+'">'+esc(s.cat)+'</span><b>'+esc(s.titre)+'</b><span class="src '+(s.off?'off':'')+'">'+esc(s.src||'')+'</span></div>'+
 '<div class="l2">📋 '+esc(s.sym||'')+'</div>'+
 '<div class="l3">🔧 DTC : '+(s.dtc&&s.dtc.length?s.dtc.map(esc).join(' • '):'—')+'</div>'+
 '<div class="l4">✅ '+esc(s.fix||'')+'</div>';
 d.onclick=function(){openSheet(s);};return d;
}
async function renderSheets(){
 var sheets=(await dbAll('sheets')).filter(function(s){return s.b===state.brand&&s.m===state.model;});
 if(state.engine)sheets=sheets.filter(function(s){return !s.e||s.e===state.engine;});
 if(state.cat!=='Tous')sheets=sheets.filter(function(s){return s.cat===state.cat;});
 sheets.sort(function(a,b){return (b.off||0)-(a.off||0);});
 var list=$('#sheetList');list.innerHTML='';
 if(!sheets.length)list.innerHTML='<p class="muted">Aucune fiche. Utilisez 🛰 pour importer.</p>';
 sheets.slice(0,300).forEach(function(s){list.appendChild(sheetCard(s));});
 $('#sheetsTitle').textContent='📋 Fiches ('+sheets.length+') — '+state.brand+' '+state.model+(state.engine?' • '+state.engine:'');
}
async function renderGlobal(q){
 var drawer=$('#globalDrawer');if(!drawer)return;
 q=(q||'').trim();
 if(q.length<2){drawer.style.display='none';return;}
 var ql=q.toLowerCase(),panel='',A=null;
 if(window.buildAssistant){try{A=await window.buildAssistant(ql);panel=A.html;}catch(e){}}
 A=A||{};
 var codes=window.extractDtc?window.extractDtc(q):[];
 var all=await dbAll('sheets');
 var words=ql.split(/\s+/).filter(function(w){return w.length>=2&&!/^[pcbu][0-9a-f]{4,5}$/i.test(w);});
 var res=all.filter(function(s){
  var vehOk=(!A.b||s.b===A.b)&&(!A.m||s.m===A.m);
  if(!vehOk)return false;
  if(codes.length){var hc=(s.dtc||[]).some(function(d){return codes.indexOf(d.toUpperCase())!==-1;});if(hc)return true;}
  if(words.length){var hay=(s.titre+' '+s.sym+' '+s.b+' '+s.m+' '+s.e+' '+s.src+' '+(s.dtc||[]).join(' ')).toLowerCase();return words.some(function(w){return hay.indexOf(w)!==-1;});}
  return !!codes.length;
 });
 drawer.style.display='';
 $('#globalCount').textContent='('+res.length+' résultat'+(res.length>1?'s':'')+')';
 var list=$('#globalList');list.innerHTML=panel||'';
 if(!res.length&&!panel)list.innerHTML='<p class="muted">Aucun résultat local.</p>';
 res.slice(0,100).forEach(function(s){list.appendChild(sheetCard(s));});
}
var CURRENT=null;
function openSheet(s){
 CURRENT=s;$('#smCat').textContent=s.cat;$('#smCat').className='cat c-'+s.cat;
 $('#smVeh').textContent=s.b+' '+s.m+(s.e?' — '+s.e:'');
 $('#smTitle').textContent=s.titre;$('#smSym').textContent=s.sym||'—';
 $('#smDtc').textContent=s.dtc&&s.dtc.length?s.dtc.join(' • '):'—';
 $('#smFix').textContent=s.fix||'—';$('#smSrc').textContent=s.src||'—';
 $('#smDel').style.display=sessionStorage.getItem('mrt_admin')==='1'?'':'none';
 openModal('sheetModal');
}
function printSheet(){
 var s=CURRENT;if(!s)return;
 $('#printSheet').innerHTML='<h1>Mon Aide Technique by Kevin</h1><p><b>'+esc(s.b)+' '+esc(s.m)+(s.e?' — '+esc(s.e):'')+'</b> • Catégorie : '+esc(s.cat)+' • '+new Date().toLocaleDateString('fr-FR')+'</p>'+
 '<div class="box"><b>'+esc(s.titre)+'</b><br>Symptômes : '+esc(s.sym||'—')+'<br>DTC : '+(s.dtc&&s.dtc.length?esc(s.dtc.join(', ')):'—')+'<br>Préconisation : '+esc(s.fix||'—')+'<br>Source : '+esc(s.src||'—')+'</div>'+
 '<p style="font-size:11px">
