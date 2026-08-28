/* assistant.js v9 — Détection modèle robuste (insensible casse) + réponses DTC massives */
(function(){
'use strict';

var KEYWORD_DB = [
{re:/courroie|belt/i,label:'Courroie',info:'Usure/dégradation (courroies immergées). Risque casse moteur.',act:'Contrôle + remplacement préventif courroie + crépine + huile 0W20.'},
{re:/cha[iî]ne|chain/i,label:'Chaîne distribution',info:'Allongement/tendeurs. Bruit métallique à froid.',act:'Contrôle + kit chaîne renforcé.'},
{re:/egr/i,label:'Vanne EGR',info:'Encrassement : perte puissance, voyant moteur, fumée.',act:'Nettoyage/remplacement EGR + refroidisseur.'},
{re:/fap|dpf|particule/i,label:'FAP / filtre à particules',info:'Colmatage : mode dégradé, régénérations incomplètes.',act:'Régénération forcée, contrôle capteurs, remplacement si céramique HS.'},
{re:/adblue|scr|nox/i,label:'AdBlue / SCR / NOx',info:'Rendement SCR insuffisant (P20EE) : qualité AdBlue, injecteur bouché/cristallisé, capteurs NOx, catalyseur SCR dégradé.',act:'1) Réfractométrie AdBlue 2) Test injecteur AdBlue 3) Capteurs NOx 4) Catalyseur SCR 5) Fuites échappement.'},
{re:/turbo/i,label:'Turbo',info:'GV/actuateur : pression basse (P0299), sifflement.',act:'Contrôle turbo/wastegate/durites.'},
{re:/\babs\b/i,label:'ABS',info:'Capteurs roue défaillants.',act:'Remplacement capteur + contrôle cible.'},
{re:/front ?assist|radar/i,label:'Front Assist / radar',info:'Radar AV sali/décalé : alertes fantômes.',act:'Nettoyage + calibration radar.'},
{re:/caméra|camera/i,label:'Caméras ADAS',info:'Recul/360/ADAS décalibrées.',act:'Calibration statique/dynamique.'},
{re:/airbag/i,label:'Airbag',info:'Clockspring, gonfleurs Takata.',act:'Diagnostic SRS, remplacement selon campagne.'},
{re:/ceinture|prétension/i,label:'Ceintures',info:'Prétensionneurs défaillants.',act:'Remplacement prétensionneur + faisceau.'},
{re:/frein|brake|plaquette/i,label:'Freinage',info:'Plaquettes/disques/étriers.',act:'Contrôle épaisseur + remplacement + purge.'},
{re:/bo[iî]te|dsg|edc|cvt/i,label:'Boîte de vitesses',info:'Mécatronique, embrayages, huile dégradée.',act:'Vidange + MAJ logiciel + mécatronique.'},
{re:/batterie|battery/i,label:'Batterie (12V ou HT)',info:'SOH faible, cellules déséquilibrées.',act:'Test 12V / rapport SOH HT / équilibrage.'},
{re:/charge/i,label:'Charge HT (VE)',info:'OBC, CCS, DC-DC défaillants.',act:'Contrôle prise/câble/OBC/BMS.'},
{re:/écran|multimédia|tablette|infotainment/i,label:'Multimédia',info:'Reboots, écran noir.',act:'MAJ firmware, reset, remplacement.'},
{re:/injecteur/i,label:'Injecteurs',info:'Fuite/encrassement, cristallisation AdBlue.',act:'Test débit + remplacement.'},
{re:/bobine|allumage/i,label:'Bobines d\'allumage',info:'Ratés d\'allumage.',act:'Remplacement bobines + bougies.'},
{re:/thermostat|refroidissement|pompe/i,label:'Refroidissement',info:'Thermostat, pompes HT.',act:'Contrôle circuit + remplacement.'},
{re:/hayon/i,label:'Hayon électrique',info:'Moteur hayon défaillant.',act:'Diagnostic moteur hayon, calibration.'},
{re:/suspension|pneumatique/i,label:'Suspension',info:'Coussins d\'air, sphères, amortisseurs.',act:'Contrôle circuit suspension + remplacement.'}
];

var escRe = function(s){ return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); };
var normalize = window.normalizeModel || function(s){ return (s||'').toLowerCase(); };

/* === DÉTECTION VÉHICULE AMÉLIORÉE (insensible casse + normalisation) === */
async function detectVehicle(q){
 if(!q) return {b:null, m:null};
 var brands = await dbAll('brands');
 var models = await dbAll('models');
 var b = null, m = null;
 var qLower = String(q).toLowerCase();
 var qNorm = normalize(q);

 /* 1. Détecter la marque */
 for(var i=0; i<brands.length; i++){
  var x = brands[i];
  if(x.name.length >= 3 && qLower.indexOf(x.name.toLowerCase()) !== -1){
   b = x.name; break;
  }
 }

 /* 2. Détecter le modèle (normalisé : ID4 = ID.4, ELROQ = Elroq) */
 for(var j=0; j<models.length; j++){
  var mm = models[j];
  if(mm.m.length < 2) continue;
  var mNorm = normalize(mm.m);
  var mLower = mm.m.toLowerCase();
  /* Match : qNorm contient mNorm OU qLower contient mLower */
  if(qNorm.indexOf(mNorm) !== -1 || qLower.indexOf(mLower) !== -1){
   if(!m || mm.b === b){ m = mm.m; if(!b) b = mm.b; }
  }
 }
 return {b:b, m:m};
}

/* === RÉPONSE ASSISTANT MASSIVE === */
window.buildAssistant = async function(q){
 var codes = window.extractDtc ? window.extractDtc(q) : [];
 var veh = await detectVehicle(q);
 var html = '', found = false;
 var esc = window.esc || function(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); };

 /* === 1. RÉPONSES CODES DTC === */
 if(codes.length){
  codes.forEach(function(c){
   var i = window.dtcInfo ? window.dtcInfo(c) : null;
   if(i){
    found = true;
    var sys = window.dtcSystem ? window.dtcSystem(c) : 'Autre';
    html += '<div class="detail" style="border-left:4px solid var(--acc2)">';
    html += '<b>🤖 Code '+esc(c)+'</b> <span class="chip" style="font-size:10px;padding:2px 6px;margin-left:6px">'+sys+'</span>';
    html += '<div style="margin-top:6px;font-size:15px"><b>'+esc(i[0])+'</b></div>';
    html += '<div style="margin-top:8px"><small>🔧 Causes probables</small><div style="margin-top:4px">'+esc(i[1])+'</div></div>';
    html += '<div style="margin-top:8px"><small>✅ Action recommandée</small><div style="margin-top:4px">'+esc(i[2])+'</div></div>';
    /* Codes dépollution associés */
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

 /* === 2. RÉPONSES MOTS-CLÉS === */
 KEYWORD_DB.forEach(function(k){
  if(k.re.test(q)){
   found = true;
   html += '<div class="detail" style="border-left:4px solid var(--acc)"><b>🤖 '+k.label+'</b><br><small>Diagnostic</small>'+k.info+'<br><small>Action</small>'+k.act+'</div>';
  }
 });

 /* === 3. PANNES CONNUES POUR LE MODÈLE === */
 if(veh.b && veh.m && window.getKnownIssues){
  var issues = window.getKnownIssues(veh.b, veh.m);
  if(issues && issues.length){
   found = true;
   html += '<div class="detail" style="border-left:4px solid var(--warn)">';
   html += '<h3 style="margin:0">⚠️ Pannes connues '+esc(veh.b)+' '+esc(veh.m)+' ('+issues.length+')</h3>';
   issues.slice(0,6).forEach(function(i){
    html += '<div style="margin:8px 0;padding:8px;background:var(--card2);border-radius:8px">';
    html += '<b>'+esc(i[0])+'</b><br>';
    html += '<small>Causes</small>'+esc(i[1])+'<br>';
    html += '<small>Action</small>'+esc(i[2])+'<br>';
    html += '<small>Source : '+esc(i[4]||'—')+' • DTC : '+(i[3]&&i[3].length ? i[3].join(', ') : '—')+'</small>';
    html += '</div>';
   });
   html += '</div>';
  }
 }

 /* === 4. VÉHICULE DÉTECTÉ === */
 if(veh.b || veh.m){
  found = true;
  html += '<div class="detail" style="border-left:4px solid var(--acc2)"><b>🚗 Véhicule détecté :</b> '+esc(veh.b||'')+' '+esc(veh.m||'')+'</div>';
 }

 return {html: found ? html : '', b: veh.b, m: veh.m, codes: codes};
};

/* === SAISIE EN DIRECT === */
window.onSearchInput = async function(q){
 var box = document.getElementById('dtcSuggest');
 if(!box) return;
 q = (q||'').trim();
 if(q.length < 2){ box.style.display = 'none'; return; }

 var esc = window.esc || function(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); };
 var codes = window.extractDtc ? window.extractDtc(q) : [];
 var html = '';

 /* Codes DTC détectés */
 codes.forEach(function(c){
  var i = window.dtcInfo ? window.dtcInfo(c) : null;
  if(i){
   html += '<div class="detail" style="border-left:4px solid var(--acc2)"><b>🤖 '+c+'</b> : '+i[0]+'<br><small>Causes</small>'+i[1]+'<br><small>Action</small>'+i[2]+'</div>';
  }
 });

 /* Suggestions */
 if(window.dtcSuggest){
  var sug = window.dtcSuggest(q.toLowerCase(), 10);
  if(sug.length){
   html += '<div class="muted" style="margin-top:8px">Codes correspondants :</div>';
   sug.forEach(function(s){
    html += '<div class="rowItem" onclick="pickSuggest(\''+s.code+'\')"><b>'+s.code+'</b><span>'+esc(s.label.slice(0,70))+'</span></div>';
   });
  }
 }

 /* Mots-clés */
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

/* === AUTO-COMPLÉTION MODÈLES (INSENSIBLE CASSE) === */
window.suggestModels = async function(q){
 q = (q||'').trim().toLowerCase();
 var box = document.getElementById('modelSuggest');
 if(!box) return;
 if(q.length < 3){ box.style.display = 'none'; return; }

 var models = await dbAll('models');
 var brands = await dbAll('brands');
 var qNorm = normalize(q);
 var esc = window.esc || function(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); };

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
 var esc = window.esc || function(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); };
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
 var esc = window.esc || function(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); };
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

  if(/^P20/.test(code) || /^P22/.test(code) || /^P24/.test(code)){
   var related = ['P2002','P202E','P20BA','P20EE','P2200','P2201','P2207','P242F','P2459','P2463'];
   html += '<div class="drawer" style="margin-top:10px"><h2>🔗 Codes dépollution associés</h2>';
   related.forEach(function(rc){
    var ri = window.dtcInfo ? window.dtcInfo(rc) : null;
    if(ri && rc !== code){
     html += '<div class="rowItem" onclick="document.getElementById(\'dtcOnly\').value=\''+rc+'\';searchDtcOnly()"><b>'+rc+'</b><span>'+esc(ri[0].slice(0,60))+'</span></div>';
    }
   });
   html += '</div>';
  }
 }
 html += buildExternalLinks(codes.join(' + '), codes);
 box.innerHTML = html;
};

/* === RECHERCHE 2 : MODÈLE + DTC (INSENSIBLE CASSE) === */
window.searchDtcModel = async function(){
 var el = document.getElementById('dtcModel');
 var q = el ? el.value : '';
 var box = document.getElementById('dtcResult2');
 if(!box) return;
 var codes = window.extractDtc ? window.extractDtc(q) : [];
 var esc = window.esc || function(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); };
 if(!codes.length){ box.innerHTML = '<p class="muted">Format : « modèle suivi du dtc » (ex : 3008 P0016, ID4 P0A80, tiguan P20EE).</p>'; return; }

 var models = await dbAll('models');
 var qLower = q.toLowerCase();
 var qNorm = normalize(q);
 var fm = null;

 /* Recherche du modèle (insensible casse) */
 for(var i=0; i<models.length; i++){
  var x = models[i];
  var mNorm = normalize(x.m);
  var mLower = x.m.toLowerCase();
  if(qNorm.indexOf(mNorm) !== -1 || qLower.indexOf(mLower) !== -1){
   fm = x; break;
  }
 }

 if(!fm){ box.innerHTML = '<p class="muted">Modèle non reconnu. Ex : « ID4 P0A80 », « 3008 P0016 », « Golf P20EE ».</p>'; return; }

 var code = codes[0];
 var i = window.dtcInfo ? window.dtcInfo(code) : null;
 var all = await dbAll('sheets');
 var sheets = all.filter(function(s){ return s.m === fm.m && (s.dtc||[]).some(function(d){ return d.toUpperCase() === code; }); });
 var issues = (window.getKnownIssues ? window.getKnownIssues(fm.b, fm.m) : null) || [];
 var sys = window.dtcSystem ? window.dtcSystem(code) : 'Autre';

 var html = '<div class="detail" style="border-left:4px solid var(--acc2)">';
 html += '<b>'+esc(fm.b)+' '+esc(fm.m)+' + '+code+'</b> <span class="chip" style="font-size:10px;padding:2px 6px;margin-left:6px">'+sys+'</span>';
 if(sheets.length){ html += ' <span class="chip" style="background:var(--acc2);color:#fff;font-size:10px;padding:2px 6px">✅ DÉFAUT CONNU</span>'; }
 html += '<div style="margin-top:6px;font-size:15px"><b>'+(i ? i[0] : 'Code non documenté')+'</b></div>';
 if(i){
  html += '<div style="margin-top:8px"><small>🔧 Causes probables</small><div style="margin-top:4px">'+i[1]+'</div></div>';
  html += '<div style="margin-top:8px"><small>✅ Action recommandée</small><div style="margin-top:4px">'+i[2]+'</div></div>';
 }
 html += '</div>';

 if(issues.length){
  html += '<div class="drawer" style="margin-top:10px"><h2>⚠️ Pannes connues '+esc(fm.b)+' '+esc(fm.m)+' ('+issues.length+')</h2>';
  issues.forEach(function(iss){
   var dtcMatch = (iss[3]||[]).some(function(d){ return d.toUpperCase() === code; });
   html += '<div style="margin:6px 0;padding:8px;background:var(--card2);border-radius:8px;border-left:3px solid '+(dtcMatch ? 'var(--acc2)' : 'var(--acc)')+'">';
   if(dtcMatch) html += '<span class="chip" style="background:var(--acc2);color:#fff;font-size:10px;padding:2px 6px;margin-right:6px">code trouvé</span>';
   html += '<b>'+esc(iss[0])+'</b><br><small>Causes</small>'+esc(iss[1])+'<br><small>Action</small>'+esc(iss[2])+'<br><small>Source : '+esc(iss[4]||'—')+' • DTC : '+(iss[3]&&iss[3].length ? iss[3].join(', ') : '—')+'</small></div>';
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
})();
