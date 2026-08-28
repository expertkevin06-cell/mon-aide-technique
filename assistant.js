/* assistant.js v11 — Utilise extractDtc garanti fonctionnel */
(function(){
'use strict';

var KEYWORD_DB = [
{re:/courroie|belt/i,label:'Courroie',info:'Usure/dégradation (courroies immergées). Risque casse moteur.',act:'Contrôle + remplacement préventif courroie + crépine + huile 0W20.'},
{re:/cha[iî]ne|chain/i,label:'Chaîne distribution',info:'Allongement/tendeurs. Bruit métallique à froid.',act:'Contrôle + kit chaîne renforcé.'},
{re:/egr/i,label:'Vanne EGR',info:'Encrassement : perte puissance, voyant moteur, fumée.',act:'Nettoyage/remplacement EGR + refroidisseur.'},
{re:/fap|dpf|particule/i,label:'FAP',info:'Colmatage : mode dégradé, régénérations incomplètes.',act:'Régénération forcée, contrôle capteurs, remplacement si céramique HS.'},
{re:/adblue|scr|nox/i,label:'AdBlue / SCR / NOx',info:'Rendement SCR insuffisant (P20EE) : qualité AdBlue, injecteur, capteurs NOx, catalyseur SCR.',act:'1) Réfractométrie AdBlue 2) Test injecteur 3) Capteurs NOx 4) Catalyseur SCR 5) Fuites.'},
{re:/turbo/i,label:'Turbo',info:'GV/actuateur : pression basse (P0299).',act:'Contrôle turbo/wastegate/durites.'},
{re:/\babs\b/i,label:'ABS',info:'Capteurs roue défaillants.',act:'Remplacement capteur + contrôle cible.'},
{re:/front ?assist|radar/i,label:'Front Assist',info:'Radar AV sali/décalé : alertes fantômes.',act:'Nettoyage + calibration radar.'},
{re:/airbag/i,label:'Airbag',info:'Clockspring, gonfleurs Takata.',act:'Diagnostic SRS.'},
{re:/bo[iî]te|dsg|edc|cvt/i,label:'Boîte de vitesses',info:'Mécatronique, embrayages, huile dégradée.',act:'Vidange + MAJ logiciel + mécatronique.'},
{re:/batterie|battery/i,label:'Batterie (12V ou HT)',info:'SOH faible, cellules déséquilibrées.',act:'Test 12V / rapport SOH HT / équilibrage.'},
{re:/charge/i,label:'Charge HT (VE)',info:'OBC, CCS, DC-DC défaillants.',act:'Contrôle prise/câble/OBC/BMS.'}
];

var GEMINI_API_KEY = ''; // Ajoutez votre clé si souhaité
var GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash-latest:generateContent?key=';

var DETAILED_ISSUES = {
 'Renault|R5 E-Tech':[
  {cat:'Transmission (ECU)',sym:'Sélection de vitesse impossible (véhicule bloqué en position N)',fix:'Fermer le véhicule, attendre l\'extinction complète des voyants (mise en veille) ou mise à jour logicielle en concession.',dtc:['P1811','P0700']},
  {cat:'Recharge (AC/DC)',sym:'Témoin de charge rouge / Message « Problème de branchement » sur borne',fix:'Mise à jour du calculateur de charge sous garantie.',dtc:['P0D16','P0D17','P1E00']},
  {cat:'Système Multimédia',sym:'Écran figé, pertes de son du GPS ou réinitialisations intempestives',fix:'Mises à jour distantes (OTA) ou reprogrammation du module en atelier.',dtc:['U1233','U0155']},
  {cat:'Batterie 12V / BMS',sym:'Message « Panne électrique danger » ou mode dégradé temporaire',fix:'Reprogrammation du BMS (Battery Management System).',dtc:['P0A80','P0A1F']}
 ],
 'Volkswagen|ID.4':[
  {cat:'Infotainment MEB',sym:'Reboots, écran noir, perte CarPlay',fix:'MAJ firmware 3.x+, reset usine.',dtc:['U0155','U1233']},
  {cat:'Hayon électrique',sym:'Ouverture/fermeture aléatoire',fix:'Diagnostic moteur hayon, calibration.',dtc:['B1234']},
  {cat:'Batterie HT',sym:'Limitation puissance DC',fix:'Préconditionnement, équilibrage modules.',dtc:['P0A80']}
 ],
 'Tesla|Model 3':[
  {cat:'Autopilot',sym:'Alertes fantômes, désactivations',fix:'MAJ OTA, calibration caméras.',dtc:['C-codes ADAS']},
  {cat:'Batterie LFP',sym:'Calibration SOC erratique',fix:'Charge 100% périodique, MAJ BMS.',dtc:['Codes BMS']}
 ]
};

function normalize(s){
 return (s || '').toLowerCase().replace(/[.\-\s\u00a0]+/g,'').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function esc(s){
 return String(s==null?'':s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; });
}

/* === DÉTECTION VÉHICULE (insensible casse) === */
async function detectVehicle(q){
 if(!q) return {b:null, m:null};
 var brands = await dbAll('brands');
 var models = await dbAll('models');
 var b = null, m = null;
 var qLower = String(q).toLowerCase();
 var qNorm = normalize(q);

 for(var i=0; i<brands.length; i++){
  var x = brands[i];
  if(x.name.length >= 3){
   var nNorm = normalize(x.name);
   if(qNorm.indexOf(nNorm) !== -1 || qLower.indexOf(x.name.toLowerCase()) !== -1){
    b = x.name; break;
   }
  }
 }

 for(var j=0; j<models.length; j++){
  var mm = models[j];
  if(mm.m.length < 2) continue;
  var mNorm = normalize(mm.m);
  if(mNorm.length >= 2 && (qNorm.indexOf(mNorm) !== -1 || qLower.indexOf(mm.m.toLowerCase()) !== -1)){
   if(!m || mm.b === b){ m = mm.m; if(!b) b = mm.b; }
  }
 }
 return {b:b, m:m};
}

/* === RECHERCHE IA GEMINI === */
window.askGemini = async function(query){
 if(!GEMINI_API_KEY) return {error:'Clé API Gemini non configurée'};
 try {
  var prompt = 'Tu es un expert automobile. Analyse ce problème véhicule et réponds en français avec :\n' +
   '1. Diagnostic probable\n2. Causes possibles\n3. Actions recommandées\n4. Codes défaut associés\n\nProblème : ' + query;
  var response = await fetch(GEMINI_URL + GEMINI_API_KEY, {
   method: 'POST',
   headers: {'Content-Type':'application/json'},
   body: JSON.stringify({contents:[{parts:[{text:prompt}]}]})
  });
  var data = await response.json();
  if(data.candidates && data.candidates[0]) return {text: data.candidates[0].content.parts[0].text};
  return {error:'Réponse IA vide'};
 } catch(e){ return {error:'Erreur IA : ' + e.message}; }
};

/* === RÉPONSE ASSISTANT (avec extractDtc garanti) === */
window.buildAssistant = async function(q){
 var codes = window.extractDtc ? window.extractDtc(q) : [];
 console.log('[buildAssistant] codes extraits:', codes);
 
 var veh = await detectVehicle(q);
 var html = '', found = false;

 /* 1. CODES DTC */
 if(codes.length){
  codes.forEach(function(c){
   var i = window.dtcInfo ? window.dtcInfo(c) : null;
   console.log('[buildAssistant] code', c, '→ info:', i);
   if(i){
    found = true;
    var sys = window.dtcSystem ? window.dtcSystem(c) : 'Autre';
    html += '<div class="detail" style="border-left:4px solid var(--acc2)">';
    html += '<b>🤖 Code '+esc(c)+'</b> <span class="chip" style="font-size:10px;padding:2px 6px;margin-left:6px">'+sys+'</span>';
    html += '<div style="margin-top:6px;font-size:15px"><b>'+esc(i[0])+'</b></div>';
    html += '<div style="margin-top:8px"><small>🔧 Causes probables</small><div style="margin-top:4px">'+esc(i[1])+'</div></div>';
    html += '<div style="margin-top:8px"><small>✅ Action recommandée</small><div style="margin-top:4px">'+esc(i[2])+'</div></div>';
    if(/^P20/.test(c) || /^P22/.test(c) || /^P24/.test(c)){
     html += '<div style="margin-top:8px"><small>🔗 Codes dépollution associés</small>';
     var related = ['P2002','P202E','P20BA','P20EE','P2200','P2201','P2207','P242F','P2459','P2463'];
     related.forEach(function(rc){
      var ri = window.dtcInfo ? window.dtcInfo(rc) : null;
      if(ri && rc !== c){
       html += '<div class="rowItem" onclick="pickSuggest(\''+rc+'\')" style="margin:3px 0;padding:6px"><b>'+rc+'</b><span>'+esc(ri[0].slice(0,60))+'</span></div>';
      }
     });
     html += '</div>';
    }
    html += '</div>';
   }
  });
 }

 /* 2. MOTS-CLÉS */
 KEYWORD_DB.forEach(function(k){
  if(k.re.test(q)){
   found = true;
   html += '<div class="detail" style="border-left:4px solid var(--acc)"><b>🤖 '+k.label+'</b><br><small>Diagnostic</small>'+k.info+'<br><small>Action</small>'+k.act+'</div>';
  }
 });

 /* 3. CAS DÉTAILLÉS */
 if(veh.b && veh.m){
  var key = veh.b + '|' + veh.m;
  var detailed = DETAILED_ISSUES[key];
  if(detailed && detailed.length){
   found = true;
   html += '<div class="detail" style="border-left:4px solid var(--warn)">';
   html += '<h3 style="margin:0">⚠️ Cas détaillés '+esc(veh.b)+' '+esc(veh.m)+'</h3>';
   detailed.forEach(function(d){
    html += '<div style="margin:8px 0;padding:8px;background:var(--card2);border-radius:8px">';
    html += '<b style="color:var(--acc)">'+esc(d.cat)+'</b><br>';
    html += '<small>🔍 Symptôme</small>'+esc(d.sym)+'<br>';
    html += '<small>✅ Solution</small>'+esc(d.fix)+'<br>';
    html += '<small>DTC : '+(d.dtc && d.dtc.length ? d.dtc.join(', ') : '—')+'</small>';
    html += '</div>';
   });
   html += '</div>';
  }
 }

 /* 4. VÉHICULE DÉTECTÉ */
 if(veh.b || veh.m){
  found = true;
  html += '<div class="detail" style="border-left:4px solid var(--acc2)"><b>🚗 Véhicule détecté :</b> '+esc(veh.b||'')+' '+esc(veh.m||'')+'</div>';
 }

 return {html:found ? html : '', b:veh.b, m:veh.m, codes:codes};
};

/* === SAISIE EN DIRECT === */
window.onSearchInput = async function(q){
 var box = document.getElementById('dtcSuggest');
 if(!box) return;
 q = (q||'').trim();
 if(q.length < 2){ box.style.display = 'none'; return; }

 var codes = window.extractDtc ? window.extractDtc(q) : [];
 var html = '';

 codes.forEach(function(c){
  var i = window.dtcInfo ? window.dtcInfo(c) : null;
  if(i){
   html += '<div class="detail" style="border-left:4px solid var(--acc2)"><b>🤖 '+c+'</b> : '+i[0]+'<br><small>Causes</small>'+i[1]+'<br><small>Action</small>'+i[2]+'</div>';
  }
 });

 if(window.dtcSuggest){
  var sug = window.dtcSuggest(q.toLowerCase(), 10);
  if(sug.length){
   html += '<div class="muted" style="margin-top:8px">Codes correspondants :</div>';
   sug.forEach(function(s){
    html += '<div class="rowItem" onclick="pickSuggest(\''+s.code+'\')"><b>'+s.code+'</b><span>'+esc(s.label.slice(0,70))+'</span></div>';
   });
  }
 }

 KEYWORD_DB.forEach(function(k){
  if(k.re.test(q.toLowerCase())){
   html += '<div class="rowItem" onclick="validateSearch()"><b>🤖 '+k.label+'</b><span>'+esc(k.info.slice(0,50))+'…</span></div>';
  }
 });

 if(html){ box.innerHTML = html; box.style.display = ''; }
 else box.style.display = 'none';
};

window.pickSuggest = function(code){
 var el = document.getElementById('globalSearch');
 if(el) el.value = code;
 var box = document.getElementById('dtcSuggest');
 if(box) box.style.display = 'none';
 if(window.renderGlobal) renderGlobal(code);
};

/* === AUTO-COMPLÉTION MODÈLES === */
window.suggestModels = async function(q){
 q = (q||'').trim().toLowerCase();
 var box = document.getElementById('modelSuggest');
 if(!box) return;
 if(q.length < 3){ box.style.display = 'none'; return; }

 var models = await dbAll('models');
 var brands = await dbAll('brands');
 var qNorm = normalize(q);

 var matches = models.filter(function(x){
  var mNorm = normalize(x.m);
  return mNorm.indexOf(qNorm) !== -1 || x.m.toLowerCase().indexOf(q) !== -1;
 }).slice(0, 15);

 if(!matches.length){ box.style.display = 'none'; return; }
 var html = '<div class="muted">Modèles correspondants :</div>';
 matches.forEach(function(m){
  var b = brands.find(function(x){ return x.name === m.b; });
  html += '<div class="rowItem" onclick="pickModel(\''+esc(m.b)+'\',\''+esc(m.m)+'\')"><b>'+esc(m.m)+'</b><span>'+esc(m.b)+(b ? ' • '+b.origin : '')+'</span></div>';
 });
 box.innerHTML = html;
 box.style.display = '';
};

window.pickModel = function(b, m){
 var el = document.getElementById('dtcModel');
 if(el) el.value = m + ' ';
 var box = document.getElementById('modelSuggest');
 if(box) box.style.display = 'none';
 if(el) el.focus();
};

/* === LIENS EXTERNES === */
function buildExternalLinks(title, queries){
 if(!window.buildSourceLinks) return '';
 var cats = window.buildSourceLinks(queries);
 var html = '<div class="drawer" style="margin-top:10px"><h2>🔎 Recherches externes massives ('+esc(title)+')</h2>';
 for(var cat in cats){
  if(!cats[cat].items.length) continue;
  html += '<div style="margin:10px 0"><b>'+cats[cat].label+'</b><div class="actions" style="margin-top:6px">';
  cats[cat].items.forEach(function(it){
   html += '<a href="'+it.url+'" target="_blank" rel="noopener" class="chip">'+it.icon+' '+esc(it.name)+'</a>';
  });
  html += '</div></div>';
 }
 html += '</div>';
 return html;
}

/* === RECHERCHE 1 : DTC SEUL === */
window.searchDtcOnly = async function(){
 var el = document.getElementById('dtcOnly');
 var q = el ? el.value : '';
 var box = document.getElementById('dtcResult1');
 if(!box) return;
 var codes = window.extractDtc ? window.extractDtc(q) : [];
 if(!codes.length){ box.innerHTML = '<p class="muted">Indiquez un n° DTC valide (ex : P0016, P20EE, C0035).</p>'; return; }

 var html = '';
 for(var idx=0; idx<codes.length; idx++){
  var code = codes[idx];
  var i = window.dtcInfo ? window.dtcInfo(code) : null;
  var all = await dbAll('sheets');
  var sheets = all.filter(function(s){ return (s.dtc||[]).some(function(d){ return d.toUpperCase() === code; }); });
  var sys = window.dtcSystem ? window.dtcSystem(code) : 'Autre';

  html += '<div class="detail" style="border-left:4px solid var(--acc2)">';
  html += '<b>'+code+'</b> <span class="chip" style="font-size:10px;padding:2px 6px;margin-left:6px">'+sys+'</span>';
  html += '<div style="margin-top:6px;font-size:15px"><b>'+(i ? i[0] : 'Code non documenté')+'</b></div>';
  if(i){
   html += '<div style="margin-top:8px"><small>🔧 Causes probables</small><div style="margin-top:4px">'+i[1]+'</div></div>';
   html += '<div style="margin-top:8px"><small>✅ Action recommandée</small><div style="margin-top:4px">'+i[2]+'</div></div>';
  }
  html += '</div>';
  html += '<div class="muted" style="margin-top:8px">'+sheets.length+' fiche(s) locales contiennent '+code+'</div>';
  sheets.slice(0,10).forEach(function(s){
   html += '<div class="rowItem" onclick="openSheetById(\''+s.id+'\')"><b>'+esc(s.b)+' '+esc(s.m)+(s.e ? ' • '+s.e : '')+'</b><span>'+esc(s.titre.slice(0,50))+'</span></div>';
  });
 }
 html += buildExternalLinks(codes.join(' + '), codes);
 box.innerHTML = html;
};

/* === RECHERCHE 2 : MODÈLE + DTC === */
window.searchDtcModel = async function(){
 var el = document.getElementById('dtcModel');
 var q = el ? el.value : '';
 var box = document.getElementById('dtcResult2');
 if(!box) return;
 var codes = window.extractDtc ? window.extractDtc(q) : [];
 if(!codes.length){ box.innerHTML = '<p class="muted">Format : « modèle suivi du dtc » (ex : 3008 P0016, ID4 P0A80).</p>'; return; }

 var models = await dbAll('models');
 var qLower = q.toLowerCase();
 var qNorm = normalize(q);
 var fm = null;

 for(var i=0; i<models.length; i++){
  var x = models[i];
  var mNorm = normalize(x.m);
  if(mNorm.length >= 2 && (qNorm.indexOf(mNorm) !== -1 || qLower.indexOf(x.m.toLowerCase()) !== -1)){
   fm = x; break;
  }
 }

 if(!fm){ box.innerHTML = '<p class="muted">Modèle non reconnu.</p>'; return; }

 var code = codes[0];
 var i = window.dtcInfo ? window.dtcInfo(code) : null;
 var all = await dbAll('sheets');
 var sheets = all.filter(function(s){ return s.m === fm.m && (s.dtc||[]).some(function(d){ return d.toUpperCase() === code; }); });
 var issues = (window.getKnownIssues ? window.getKnownIssues(fm.b, fm.m) : null) || [];
 var sys = window.dtcSystem ? window.dtcSystem(code) : 'Autre';

 var html = '<div class="detail" style="border-left:4px solid var(--acc2)">';
 html += '<b>'+esc(fm.b)+' '+esc(fm.m)+' + '+code+'</b> <span class="chip" style="font-size:10px;padding:2px 6px;margin-left:6px">'+sys+'</span>';
 if(sheets.length) html += ' <span class="chip" style="background:var(--acc2);color:#fff;font-size:10px;padding:2px 6px">✅ DÉFAUT CONNU</span>';
 html += '<div style="margin-top:6px;font-size:15px"><b>'+(i ? i[0] : 'Code non documenté')+'</b></div>';
 if(i){
  html += '<div style="margin-top:8px"><small>🔧 Causes probables</small><div style="margin-top:4px">'+i[1]+'</div></div>';
  html += '<div style="margin-top:8px"><small>✅ Action recommandée</small><div style="margin-top:4px">'+i[2]+'</div></div>';
 }
 html += '</div>';

 var detailedKey = fm.b + '|' + fm.m;
 var detailed = DETAILED_ISSUES[detailedKey];
 if(detailed && detailed.length){
  html += '<div class="drawer" style="margin-top:10px"><h2>⚠️ Cas détaillés '+esc(fm.b)+' '+esc(fm.m)+'</h2>';
  detailed.forEach(function(d){
   html += '<div style="margin:8px 0;padding:8px;background:var(--card2);border-radius:8px">';
   html += '<b style="color:var(--acc)">'+esc(d.cat)+'</b><br>';
   html += '<small>🔍 Symptôme</small>'+esc(d.sym)+'<br>';
   html += '<small>✅ Solution</small>'+esc(d.fix)+'<br>';
   html += '<small>DTC : '+(d.dtc && d.dtc.length ? d.dtc.join(', ') : '—')+'</small>';
   html += '</div>';
  });
  html += '</div>';
 }

 if(issues.length){
  html += '<div class="drawer" style="margin-top:10px"><h2>📋 Pannes connues ('+issues.length+')</h2>';
  issues.slice(0,6).forEach(function(iss){
   html += '<div style="margin:6px 0;padding:8px;background:var(--card2);border-radius:8px">';
   html += '<b>'+esc(iss[0])+'</b><br><small>Causes</small>'+esc(iss[1])+'<br><small>Action</small>'+esc(iss[2])+'</div>';
  });
  html += '</div>';
 }

 sheets.slice(0,8).forEach(function(s){
  html += '<div class="rowItem" onclick="openSheetById(\''+s.id+'\')"><b>'+esc(s.titre.slice(0,50))+'</b><span>'+esc(s.src||'')+'</span></div>';
 });

 var queries = [fm.b+' '+fm.m, fm.b+' '+fm.m+' '+code, fm.m+' problèmes', code];
 html += buildExternalLinks(fm.b+' '+fm.m+' + '+code, queries);
 box.innerHTML = html;
};

window.openSheetById = async function(id){
 var all = await dbAll('sheets');
 var s = all.find(function(x){ return x.id === id; });
 if(s && window.openSheet) openSheet(s);
};

/* === RECHERCHE IA === */
window.askAI = async function(){
 var el = document.getElementById('globalSearch');
 var q = el ? el.value : '';
 if(!q.trim()){ alert('Veuillez saisir une question.'); return; }

 var box = document.getElementById('aiResult');
 if(!box) return;
 box.style.display = '';
 box.innerHTML = '<div class="detail" style="border-left:4px solid var(--warn)"><b>🤖 Analyse IA en cours...</b></div>';

 var result = await window.askGemini(q);
 if(result.error){
  box.innerHTML = '<div class="detail" style="border-left:4px solid var(--danger)"><b>❌ '+esc(result.error)+'</b></div>';
 } else {
  box.innerHTML = '<div class="detail" style="border-left:4px solid var(--acc2)"><b>🤖 Analyse IA</b><div style="margin-top:8px;white-space:pre-wrap">'+esc(result.text)+'</div></div>';
 }
};
})();
