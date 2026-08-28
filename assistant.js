/* assistant.js v12 — IA Gemini + P20EE garanti + détection modèle — COMPLET */
(function(){
'use strict';

/* === BASE MOTS-CLÉS === */
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
{re:/charge/i,label:'Charge HT (VE)',info:'OBC, CCS, DC-DC défaillants.',act:'Contrôle prise/câble/OBC/BMS.'},
{re:/écran|multimédia|tablette|infotainment/i,label:'Multimédia',info:'Reboots, écran noir.',act:'MAJ firmware, reset, remplacement.'},
{re:/pompe.*chaleur|heat.*pump/i,label:'Pompe à chaleur',info:'Pompe HS, perte autonomie hiver.',act:'Contrôle pompe, remplacement.'},
{re:/suspension|amortisseur|pneumatique|airmatic/i,label:'Suspension',info:'Fuite coussins, claquements.',act:'Contrôle coussins, amortisseurs, silentblocs.'},
{re:/direction|crémaillère|eps/i,label:'Direction',info:'Direction assistée défaillante.',act:'Diagnostic direction, crémaillère, capteur angle.'},
{re:/embrayage|clutch/i,label:'Embrayage',info:'Patine, à-coups.',act:'Remplacement embrayage, volant moteur.'},
{re:/injecteur|injector/i,label:'Injecteurs',info:'Ralenti irrégulier, perte puissance.',act:'Test injecteurs, nettoyage/remplacement.'},
{re:/capteur|sensor|sonde/i,label:'Capteurs',info:'Capteur défaillant.',act:'Test capteur, contrôle câblage, remplacement.'}
];

/* === CLÉ API GEMINI (gratuit : https://aistudio.google.com/apikey) === */
var GEMINI_API_KEY = '';
var GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=';

/* === CAS DÉTAILLÉS PAR MODÈLE === */
var DETAILED_ISSUES = {
 'Renault|R5 E-Tech':[
  {cat:'Transmission (ECU)',sym:'Sélection de vitesse impossible (véhicule bloqué en position N)',fix:'Fermer le véhicule, attendre l\'extinction complète des voyants (mise en veille) ou mise à jour logicielle en concession.',dtc:['P1811','P0700']},
  {cat:'Recharge (AC/DC)',sym:'Témoin de charge rouge / Message « Problème de branchement » sur borne',fix:'Mise à jour du calculateur de charge sous garantie.',dtc:['P0D16','P0D17','P1E00']},
  {cat:'Système Multimédia',sym:'Écran figé, pertes de son du GPS ou réinitialisations intempestives',fix:'Mises à jour distantes (OTA) ou reprogrammation du module en atelier.',dtc:['U1233','U0155']},
  {cat:'Batterie 12V / BMS',sym:'Message « Panne électrique danger » ou mode dégradé temporaire',fix:'Reprogrammation du BMS (Battery Management System).',dtc:['P0A80','P0A1F']}
 ],
 'Renault|R4 E-Tech':[
  {cat:'Système Multimédia',sym:'Écran tactile lent, reboots intempestifs',fix:'Mise à jour OTA ou reprogrammation en atelier.',dtc:['U1233']},
  {cat:'Recharge (AC/DC)',sym:'Limitation de puissance DC à 70 kW',fix:'MAJ BMS + contrôle thermique pack.',dtc:['P0A80','Codes HV']}
 ],
 'Renault|Mégane E-Tech':[
  {cat:'Batterie HT',sym:'Autonomie en baisse prématurée',fix:'Équilibrage modules, MAJ BMS, rapport SOH.',dtc:['P0A80']},
  {cat:'Charge DC',sym:'Puissance plafonnée à 80 kW',fix:'Préconditionnement, MAJ BMS.',dtc:['Codes HV']}
 ],
 'Renault|Zoe':[
  {cat:'Charge',sym:'Charge AC 22 kW intermittente',fix:'Contrôle OBC, câblage, MAJ calculateur charge.',dtc:['P1E00']},
  {cat:'Batterie HT',sym:'SOH < 70% (véhicules anciens)',fix:'Remplacement modules ou batterie complète.',dtc:['P0A80']}
 ],
 'Peugeot|3008':[
  {cat:'Moteur PureTech',sym:'Courroie immergée dégradée prématurément',fix:'Remplacement courroie + crépine + huile 0W20.',dtc:['P0016','P0300']},
  {cat:'Dépollution BlueHDi',sym:'AdBlue : cristallisation injecteur SCR',fix:'Remplacement injecteur AdBlue, rinçage circuit.',dtc:['P20EE','P202E']},
  {cat:'Boîte EAT8',sym:'À-coups passages de rapports',fix:'Vidange huile boîte + MAJ logiciel.',dtc:['P0700']}
 ],
 'Peugeot|e-208':[
  {cat:'Batterie HT 50 kWh',sym:'Déséquilibre cellules, autonomie réduite',fix:'Équilibrage modules, rapport SOH.',dtc:['P0A80']},
  {cat:'Charge AC 11 kW',sym:'Limitation à 7 kW',fix:'Contrôle OBC, MAJ calculateur.',dtc:['P1E00']}
 ],
 'Volkswagen|ID.4':[
  {cat:'Infotainment MEB',sym:'Reboots, écran noir, perte CarPlay',fix:'MAJ firmware 3.x+, reset usine.',dtc:['U0155','U1233']},
  {cat:'Hayon électrique',sym:'Ouverture/fermeture aléatoire',fix:'Diagnostic moteur hayon, calibration.',dtc:['B1234']},
  {cat:'Batterie HT',sym:'Limitation puissance DC',fix:'Préconditionnement, équilibrage modules.',dtc:['P0A80']}
 ],
 'Volkswagen|ID.3':[
  {cat:'Infotainment MEB',sym:'Reboots, lenteurs, écran noir',fix:'MAJ firmware, reset usine.',dtc:['U0155','U1233']},
  {cat:'Batterie 58 kWh',sym:'Déséquilibre cellules',fix:'Équilibrage modules, MAJ BMS.',dtc:['P0A80']}
 ],
 'Volkswagen|Golf':[
  {cat:'DSG7 DQ200',sym:'À-coups, patinage, passages aléatoires',fix:'MAJ logiciel + vidange mécatronique.',dtc:['P17BF','P0841']},
  {cat:'2.0 TDI',sym:'EGR encrassée, perte puissance',fix:'Nettoyage/remplacement EGR.',dtc:['P0401']}
 ],
 'Tesla|Model 3':[
  {cat:'Autopilot',sym:'Alertes fantômes, désactivations',fix:'MAJ OTA, calibration caméras.',dtc:['C-codes ADAS']},
  {cat:'Batterie LFP',sym:'Calibration SOC erratique',fix:'Charge 100% périodique, MAJ BMS.',dtc:['Codes BMS']},
  {cat:'Pompe à chaleur',sym:'Inefficacité en hiver',fix:'Remplacement pompe à chaleur.',dtc:['Codes thermique']}
 ],
 'Tesla|Model Y':[
  {cat:'Autopilot',sym:'Alertes fantômes',fix:'MAJ OTA, calibration.',dtc:['C-codes ADAS']},
  {cat:'Batterie LFP',sym:'Calibration SOC',fix:'Charge 100% périodique.',dtc:['Codes BMS']},
  {cat:'Hayon',sym:'Moteur hayon défaillant',fix:'Remplacement moteur hayon.',dtc:['B1234']}
 ],
 'BMW|Série 3':[
  {cat:'N47/B47',sym:'Chaîne distribution fragile, bruit métallique',fix:'Kit chaîne renforcé (rappel BMW).',dtc:['P0016']},
  {cat:'Boîte ZF 8HP',sym:'À-coups passages',fix:'Vidange huile ZF, MAJ logiciel.',dtc:['P0700']}
 ],
 'Mercedes-Benz|Classe C':[
  {cat:'OM651',sym:'Chaîne distribution fragile',fix:'Kit chaîne renforcé.',dtc:['P0016']},
  {cat:'9G-Tronic',sym:'À-coups passages',fix:'Vidange boîte, MAJ logiciel.',dtc:['P0700']}
 ],
 'Hyundai|Tucson':[
  {cat:'1.6 T-GDi Theta II',sym:'Coussinets bielle fragiles (KSDS)',fix:'Contrôle KSDS, campagne NHTSA, remplacement moteur.',dtc:['P1326']},
  {cat:'DCT7',sym:'À-coups passages',fix:'Vidange, MAJ logiciel, remplacement embrayages.',dtc:['P0700']}
 ],
 'Kia|EV6':[
  {cat:'Batterie 800V',sym:'Limitation thermique en charge DC',fix:'Préconditionnement, contrôle pompe HT.',dtc:['Codes HV','P0A93']},
  {cat:'Charge 800V',sym:'Puissance plafonnée',fix:'Contrôle connecteurs CCS, préconditionnement.',dtc:['Codes charge']}
 ],
 'BYD|Atto 3':[
  {cat:'Blade Battery LFP',sym:'Calibration SOC erratique',fix:'Charge 100% périodique, MAJ BMS.',dtc:['Codes BMS']},
  {cat:'Infotainment',sym:'Reboots, écran figé',fix:'MAJ firmware, reset.',dtc:['U0155']}
 ],
 'BYD|Seal':[
  {cat:'Blade Battery 82 kWh',sym:'Déséquilibre cellules',fix:'Équilibrage modules, MAJ BMS.',dtc:['P0A80']},
  {cat:'Charge DC 150 kW',sym:'Puissance plafonnée',fix:'Préconditionnement, contrôle thermique.',dtc:['Codes HV']}
 ],
 'Dacia|Duster':[
  {cat:'1.5 dCi',sym:'Chaîne distribution fragile',fix:'Remplacement kit chaîne.',dtc:['P0016']},
  {cat:'4x4',sym:'Boîte transfert bruit',fix:'Vidange boîte transfert, contrôle pignons.',dtc:['Codes 4WD']}
 ],
 'Ford|Mustang Mach-E':[
  {cat:'Batterie 88/91 kWh',sym:'Autonomie réduite, déséquilibre',fix:'Équilibrage modules, MAJ BMS.',dtc:['P0A80']},
  {cat:'SYNC 4A',sym:'Reboots, écran noir',fix:'MAJ SYNC, reset usine.',dtc:['U0155']}
 ],
 'Nissan|Leaf':[
  {cat:'Batterie 24-62 kWh',sym:'Dégradation SOH prématurée',fix:'Rapport SOH, équilibrage, remplacement modules.',dtc:['P0A80']},
  {cat:'Charge CHAdeMO',sym:'Limitation thermique',fix:'Préconditionnement, contrôle thermique.',dtc:['Codes HV']}
 ],
 'Toyota|Yaris':[
  {cat:'Hybride 1.5',sym:'Batterie HT faible, cellules déséquilibrées',fix:'Reconditionnement batterie.',dtc:['P0A80']},
  {cat:'e-CVT',sym:'Bruit moulinage',fix:'Contrôle huile, planétaires.',dtc:['P0700']}
 ],
 'Porsche|Taycan':[
  {cat:'Batterie 800V',sym:'Limitation thermique en charge DC',fix:'Préconditionnement, contrôle pompe HT.',dtc:['Codes HV','P0A93']},
  {cat:'PCM',sym:'Reboots, écran noir',fix:'MAJ PCM, reset usine.',dtc:['U0155']}
 ],
 'Volvo|XC60':[
  {cat:'D4/D5',sym:'Chaîne distribution fragile',fix:'Kit chaîne renforcé.',dtc:['P0016']},
  {cat:'T8 Recharge',sym:'Batterie HT faible',fix:'Équilibrage modules, MAJ BMS.',dtc:['P0A80']}
 ],
 'MG|MG4':[
  {cat:'Batterie 51/64/77 kWh',sym:'Déséquilibre cellules',fix:'Équilibrage modules, MAJ BMS.',dtc:['P0A80']},
  {cat:'Batterie 12V',sym:'Décharge prématurée',fix:'Contrôle 12V, MAJ veille DC-DC.',dtc:['B-codes']}
 ]
};

/* === UTILITAIRES === */
function normalize(s){
 return (s || '').toLowerCase().replace(/[.\-\s\u00a0]+/g,'').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function esc(s){
 return String(s==null?'':s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; });
}

/* === DÉTECTION VÉHICULE (insensible casse, dès 3 lettres) === */
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
 if(!GEMINI_API_KEY) return {error:'Clé API Gemini non configurée. Ajoutez votre clé dans assistant.js (gratuit : https://aistudio.google.com/apikey)'};
 try {
  var prompt = 'Tu es un expert automobile et un technicien diagnostic expérimenté. Analyse ce problème véhicule et réponds en français avec :\n' +
   '1. Diagnostic probable\n' +
   '2. Causes possibles (classées par probabilité)\n' +
   '3. Actions recommandées étape par étape\n' +
   '4. Codes défaut DTC associés (si applicable)\n' +
   '5. Niveau de gravité (faible/moyen/élevé/critique)\n' +
   '6. Estimation coût réparation (fourchette)\n\n' +
   'Problème : ' + query;
  var response = await fetch(GEMINI_URL + GEMINI_API_KEY, {
   method: 'POST',
   headers: {'Content-Type':'application/json'},
   body: JSON.stringify({contents:[{parts:[{text:prompt}]}]})
  });
  var data = await response.json();
  if(data.candidates && data.candidates[0]){
   return {text: data.candidates[0].content.parts[0].text};
  }
  return {error:'Réponse IA vide — réessayez.'};
 } catch(e){
  return {error:'Erreur IA : ' + e.message};
 }
};

/* === RÉPONSE ASSISTANT PRINCIPALE (P20EE garanti) === */
window.buildAssistant = async function(q){
 var codes = window.extractDtc ? window.extractDtc(q) : [];
 console.log('[buildAssistant] input:', q, '→ codes extraits:', codes);
 
 var veh = await detectVehicle(q);
 var html = '';
 var found = false;

 /* 1. CODES DTC — affichage détaillé */
 if(codes.length){
  codes.forEach(function(c){
   var i = window.dtcInfo ? window.dtcInfo(c) : null;
   console.log('[buildAssistant] code:', c, '→ dtcInfo:', i);
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

 /* 2. MOTS-CLÉS — aide contextuelle */
 KEYWORD_DB.forEach(function(k){
  if(k.re.test(q)){
   found = true;
   html += '<div class="detail" style="border-left:4px solid var(--acc)">';
   html += '<b>🤖 '+k.label+'</b>';
   html += '<div style="margin-top:6px"><small>Diagnostic</small><div>'+esc(k.info)+'</div></div>';
   html += '<div style="margin-top:6px"><small>Action recommandée</small><div>'+esc(k.act)+'</div></div>';
   html += '</div>';
  }
 });

 /* 3. CAS DÉTAILLÉS par modèle */
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
    html += '<small>🔍 Symptôme</small> '+esc(d.sym)+'<br>';
    html += '<small>✅ Solution</small> '+esc(d.fix)+'<br>';
    html += '<small>DTC : '+(d.dtc && d.dtc.length ? d.dtc.join(', ') : '—')+'</small>';
    html += '</div>';
   });
   html += '</div>';
  }
 }

 /* 4. PANNES CONNUES du modèle détecté */
 if(veh.b && veh.m && window.getKnownIssues){
  var issues = window.getKnownIssues(veh.b, veh.m);
  if(issues && issues.length){
   found = true;
   html += '<div class="detail" style="border-left:4px solid var(--acc)">';
   html += '<h3 style="margin:0">📋 Pannes connues '+esc(veh.b)+' '+esc(veh.m)+' ('+issues.length+')</h3>';
   issues.slice(0,8).forEach(function(iss){
    var dtcMatch = codes.length && (iss[3]||[]).some(function(d){ return codes.indexOf(d.toUpperCase()) !== -1; });
    html += '<div style="margin:6px 0;padding:8px;background:var(--card2);border-radius:8px;border-left:3px solid '+(dtcMatch ? 'var(--acc2)' : 'var(--card)')+'">';
    if(dtcMatch) html += '<span class="chip" style="background:var(--acc2);color:#fff;font-size:10px;padding:2px 6px;margin-right:6px">code trouvé</span>';
    html += '<b>'+esc(iss[0])+'</b><br>';
    html += '<small>Causes</small> '+esc(iss[1])+'<br>';
    html += '<small>Action</small> '+esc(iss[2])+'<br>';
    html += '<small>DTC : '+((iss[3]&&iss[3].length)?iss[3].join(', '):'—')+' • Source : '+esc(iss[4]||'—')+'</small>';
    html += '</div>';
   });
   html += '</div>';
  }
 }

 /* 5. VÉHICULE DÉTECTÉ */
 if(veh.b || veh.m){
  found = true;
  html += '<div class="detail" style="border-left:4px solid var(--acc2)"><b>🚗 Véhicule détecté :</b> '+esc(veh.b||'')+' '+esc(veh.m||'')+'</div>';
 }

 return {html:found ? html : '', b:veh.b, m:veh.m, codes:codes};
};

/* === SAISIE EN DIRECT (auto-complétion pendant la frappe) === */
window.onSearchInput = async function(q){
 var box = document.getElementById('dtcSuggest');
 if(!box) return;
 q = (q||'').trim();
 if(q.length < 2){ box.style.display = 'none'; return; }

 var codes = window.extractDtc ? window.extractDtc(q) : [];
 var html = '';

 /* Afficher les infos DTC immédiatement */
 codes.forEach(function(c){
  var i = window.dtcInfo ? window.dtcInfo(c) : null;
  if(i){
   html += '<div class="detail" style="border-left:4px solid var(--acc2)">';
   html += '<b>🤖 '+c+'</b> : '+esc(i[0]);
   html += '<br><small>Causes</small> '+esc(i[1]);
   html += '<br><small>Action</small> '+esc(i[2]);
   html += '</div>';
  }
 });

 /* Suggestions de codes */
 if(window.dtcSuggest){
  var sug = window.dtcSuggest(q.toUpperCase(), 10);
  if(sug.length){
   html += '<div class="muted" style="margin-top:8px">Codes correspondants :</div>';
   sug.forEach(function(s){
    html += '<div class="rowItem" onclick="pickSuggest(\''+s.code+'\')"><b>'+s.code+'</b><span>'+esc(s.label.slice(0,70))+'</span></div>';
   });
  }
 }

 /* Suggestions mots-clés */
 KEYWORD_DB.forEach(function(k){
  if(k.re.test(q.toLowerCase())){
   html += '<div class="rowItem" onclick="validateSearch()"><b>🤖 '+k.label+'</b><span>'+esc(k.info.slice(0,50))+'…</span></div>';
  }
 });

 if(html){ box.innerHTML = html; box.style.display = ''; }
 else box.style.display = 'none';
};

/* === SÉLECTION SUGGESTION === */
window.pickSuggest = function(code){
 var el = document.getElementById('globalSearch');
 if(el) el.value = code;
 var box = document.getElementById('dtcSuggest');
 if(box) box.style.display = 'none';
 if(window.renderGlobal) renderGlobal(code);
};

/* === AUTO-COMPLÉTION MODÈLES (dès 3 lettres) === */
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
  html += '<div class="rowItem" onclick="pickModel(\''+esc(m.b)+'\',\''+esc(m.m)+'\')"><b>'+esc(m.m)+'</b><span>'+esc(m.b)+(b ? ' • '+esc(b.origin) : '')+'</span></div>';
 });
 box.innerHTML = html;
 box.style.display = '';
};

/* Alias pour recherche globale */
window.suggestBrandsAndModels = window.suggestModels;

/* === SÉLECTION MODÈLE === */
window.pickModel = function(b, m){
 var el = document.getElementById('dtcModel');
 if(el){ el.value = m + ' '; el.focus(); }
 var box = document.getElementById('modelSuggest');
 if(box) box.style.display = 'none';
};

/* === LIENS EXTERNES === */
function buildExternalLinks(title, queries){
 if(!window.buildSourceLinks) return '';
 var cats = window.buildSourceLinks(queries);
 var html = '<div class="drawer" style="margin-top:10px"><h2>🔎 Recherches externes ('+esc(title)+')</h2>';
 for(var cat in cats){
  if(!cats[cat].items.length) continue;
  html += '<div style="margin:10px 0"><b>'+esc(cats[cat].label)+'</b><div class="actions" style="margin-top:6px">';
  cats[cat].items.forEach(function(it){
   html += '<a href="'+it.url+'" target="_blank" rel="noopener" class="chip">'+it.icon+' '+esc(it.name)+'</a>';
  });
  html += '</div></div>';
 }
 html += '</div>';
 return html;
}

/* === RECHERCHE 1 : DTC SEUL (P20EE garanti fonctionnel) === */
window.searchDtcOnly = async function(){
 var el = document.getElementById('dtcOnly');
 var q = el ? el.value : '';
 var box = document.getElementById('dtcResult1');
 if(!box) return;
 var codes = window.extractDtc ? window.extractDtc(q) : [];
 console.log('[searchDtcOnly] input:', q, '→ codes:', codes);
 if(!codes.length){
  box.innerHTML = '<p class="muted">Indiquez un n° DTC valide (ex : P0016, P20EE, C0035, p20ee).</p>';
  return;
 }

 var html = '';
 for(var idx=0; idx<codes.length; idx++){
  var code = codes[idx];
  var i = window.dtcInfo ? window.dtcInfo(code) : null;
  var all = await dbAll('sheets');
  var sheets = all.filter(function(s){
   return (s.dtc||[]).some(function(d){ return d.toUpperCase() === code; });
  });
  var sys = window.dtcSystem ? window.dtcSystem(code) : 'Autre';

  html += '<div class="detail" style="border-left:4px solid var(--acc2)">';
  html += '<b>'+esc(code)+'</b> <span class="chip" style="font-size:10px;padding:2px 6px;margin-left:6px">'+esc(sys)+'</span>';
  html += '<div style="margin-top:6px;font-size:15px"><b>'+(i ? esc(i[0]) : 'Code non documenté dans la base locale')+'</b></div>';
  if(i){
   html += '<div style="margin-top:8px"><small>🔧 Causes probables</small><div style="margin-top:4px">'+esc(i[1])+'</div></div>';
   html += '<div style="margin-top:8px"><small>✅ Action recommandée</small><div style="margin-top:4px">'+esc(i[2])+'</div></div>';
  }
  html += '</div>';

  /* Fiches locales contenant ce code */
  html += '<div class="muted" style="margin-top:8px">'+sheets.length+' fiche(s) locales contiennent '+esc(code)+'</div>';
  sheets.slice(0,10).forEach(function(s){
   html += '<div class="rowItem" onclick="openSheetById(\''+s.id+'\')"><b>'+esc(s.b)+' '+esc(s.m)+(s.e ? ' • '+esc(s.e) : '')+'</b><span>'+esc(s.titre.slice(0,50))+'</span></div>';
  });

  /* Codes dépollution associés */
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

 /* Liens externes */
 html += buildExternalLinks(codes.join(' + '), codes);
 box.innerHTML = html;
};

/* === RECHERCHE 2 : MODÈLE + DTC (insensible casse) === */
window.searchDtcModel = async function(){
 var el = document.getElementById('dtcModel');
 var q = el ? el.value : '';
 var box = document.getElementById('dtcResult2');
 if(!box) return;
 var codes = window.extractDtc ? window.extractDtc(q) : [];
 if(!codes.length){
  box.innerHTML = '<p class="muted">Format : « modèle suivi du dtc » (ex : 3008 P0016, ID4 P0A80, r5 électrique P1811, duster p20ee).</p>';
  return;
 }

 var models = await dbAll('models');
 var qLower = q.toLowerCase();
 var qNorm = normalize(q);
 var fm = null;

 for(var j=0; j<models.length; j++){
  var x = models[j];
  var mNorm = normalize(x.m);
  if(mNorm.length >= 2 && (qNorm.indexOf(mNorm) !== -1 || qLower.indexOf(x.m.toLowerCase()) !== -1)){
   fm = x; break;
  }
 }

 if(!fm){
  box.innerHTML = '<p class="muted">Modèle non reconnu. Exemples : « ID4 P0A80 », « 3008 P0016 », « duster p0016 », « r5 électrique P1811 ».</p>';
  return;
 }

 var code = codes[0];
 var i = window.dtcInfo ? window.dtcInfo(code) : null;
 var all = await dbAll('sheets');
 var sheets = all.filter(function(s){
  return s.m === fm.m && (s.dtc||[]).some(function(d){ return d.toUpperCase() === code; });
 });
 var issues = (window.getKnownIssues ? window.getKnownIssues(fm.b, fm.m) : null) || [];
 var sys = window.dtcSystem ? window.dtcSystem(code) : 'Autre';

 var html = '<div class="detail" style="border-left:4px solid var(--acc2)">';
 html += '<b>'+esc(fm.b)+' '+esc(fm.m)+' + '+esc(code)+'</b> <span class="chip" style="font-size:10px;padding:2px 6px;margin-left:6px">'+esc(sys)+'</span>';
 if(sheets.length) html += ' <span class="chip" style="background:var(--acc2);color:#fff;font-size:10px;padding:2px 6px">✅ DÉFAUT CONNU</span>';
 html += '<div style="margin-top:6px;font-size:15px"><b>'+(i ? esc(i[0]) : 'Code non documenté')+'</b></div>';
 if(i){
  html += '<div style="margin-top:8px"><small>🔧 Causes probables</small><div style="margin-top:4px">'+esc(i[1])+'</div></div>';
  html += '<div style="margin-top:8px"><small>✅ Action recommandée</small><div style="margin-top:4px">'+esc(i[2])+'</div></div>';
 }
 html += '</div>';

 /* Cas détaillés */
 var detailedKey = fm.b + '|' + fm.m;
 var detailed = DETAILED_ISSUES[detailedKey];
 if(detailed && detailed.length){
  html += '<div class="drawer" style="margin-top:10px"><h2>⚠️ Cas détaillés '+esc(fm.b)+' '+esc(fm.m)+'</h2>';
  detailed.forEach(function(d){
   html += '<div style="margin:8px 0;padding:8px;background:var(--card2);border-radius:8px">';
   html += '<b style="color:var(--acc)">'+esc(d.cat)+'</b><br>';
   html += '<small>🔍 Symptôme</small> '+esc(d.sym)+'<br>';
   html += '<small>✅ Solution</small> '+esc(d.fix)+'<br>';
   html += '<small>DTC : '+(d.dtc && d.dtc.length ? d.dtc.join(', ') : '—')+'</small>';
   html += '</div>';
  });
  html += '</div>';
 }

 /* Pannes connues */
 if(issues.length){
  html += '<div class="drawer" style="margin-top:10px"><h2>📋 Pannes connues ('+issues.length+')</h2>';
  issues.slice(0,6).forEach(function(iss){
   var dtcMatch = (iss[3]||[]).some(function(d){ return d.toUpperCase() === code; });
   html += '<div style="margin:6px 0;padding:8px;background:var(--card2);border-radius:8px;border-left:3px solid '+(dtcMatch ? 'var(--acc2)' : 'var(--acc)')+'">';
   if(dtcMatch) html += '<span class="chip" style="background:var(--acc2);color:#fff;font-size:10px;padding:2px 6px;margin-right:6px">code trouvé</span>';
   html += '<b>'+esc(iss[0])+'</b><br>';
   html += '<small>Causes</small> '+esc(iss[1])+'<br>';
   html += '<small>Action</small> '+esc(iss[2])+'<br>';
   html += '<small>Source : '+esc(iss[4]||'—')+'</small>';
   html += '</div>';
  });
  html += '</div>';
 }

 /* Fiches locales */
 sheets.slice(0,8).forEach(function(s){
  html += '<div class="rowItem" onclick="openSheetById(\''+s.id+'\')"><b>'+esc(s.titre.slice(0,50))+'</b><span>'+esc(s.src||'')+'</span></div>';
 });

 /* Liens externes */
 var queries = [fm.b+' '+fm.m, fm.b+' '+fm.m+' '+code, fm.m+' problèmes', code];
 html += buildExternalLinks(fm.b+' '+fm.m+' + '+code, queries);

 box.innerHTML = html;
};

/* === OUVRIR FICHE PAR ID === */
window.openSheetById = async function(id){
 var all = await dbAll('sheets');
 var s = all.find(function(x){ return x.id === id; });
 if(s && window.openSheet) openSheet(s);
};

/* === BOUTON ANALYSE IA GEMINI === */
window.askAI = async function(){
 var el = document.getElementById('globalSearch');
 var q = el ? el.value : '';
 if(!q.trim()){
  alert('Veuillez saisir une question, un code défaut ou un problème véhicule.');
  return;
 }

 var box = document.getElementById('aiResult');
 if(!box) return;
 box.style.display = '';
 box.innerHTML = '<div class="detail" style="border-left:4px solid var(--warn)">' +
  '<b>🤖 Analyse IA Gemini en cours...</b><br>' +
  '<small>Veuillez patienter quelques secondes. L\'IA analyse votre problème.</small>' +
  '</div>';

 var result = await window.askGemini(q);
 if(result.error){
  box.innerHTML = '<div class="detail" style="border-left:4px solid var(--danger)">' +
   '<b>❌ '+esc(result.error)+'</b><br>' +
   '<small>Pour activer l\'IA Gemini, ajoutez votre clé gratuite dans assistant.js (ligne GEMINI_API_KEY).<br>' +
   'Obtenez-la ici : <a href="https://aistudio.google.com/apikey" target="_blank" style="color:var(--acc)">https://aistudio.google.com/apikey</a></small>' +
   '</div>';
 } else {
  box.innerHTML = '<div class="detail" style="border-left:4px solid var(--acc2)">' +
   '<b>🤖 Analyse IA Gemini</b>' +
   '<div style="margin-top:4px;font-size:12px;color:var(--mut)">Recherche : '+esc(q)+'</div>' +
   '<div style="margin-top:8px;white-space:pre-wrap;line-height:1.6">'+esc(result.text)+'</div>' +
   '<div style="margin-top:8px;font-size:11px;color:var(--mut)">⚠️ L\'IA fournit une aide indicative — confirmez toujours avec un diagnostic professionnel.</div>' +
   '</div>';
 }
};

console.log('[assistant] v12 chargé — Gemini + P20EE garanti + '+Object.keys(DETAILED_ISSUES).length+' modèles détaillés');
})();
