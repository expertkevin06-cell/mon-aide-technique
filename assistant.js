/* assistant.js v8 — Utilise extractDtc() pour détecter P20EE et codes hexadécimaux */
(function(){
'use strict';

const KEYWORD_DB=[
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
{re:/suspension|pneumatique/i,label:'Suspension',info:'Coussins d\'air, sphères, amortisseurs.',act:'Contrôle circuit suspension + remplacement.'}];

function normalizeModel(s){return(s||'').toLowerCase().replace(/[.\-\s]/g,'');}

async function detectVehicle(q){
 const brands=await dbAll('brands');const models=await dbAll('models');
 let b=null,m=null;
 const qNorm=normalizeModel(q);
 for(const x of brands){if(x.name.length>=3&&q.toLowerCase().includes(x.name.toLowerCase())){b=x.name;break;}}
 for(const x of models){
  const mNorm=normalizeModel(x.m);
  if(qNorm.includes(mNorm)||q.toLowerCase().includes(x.m.toLowerCase())){
   if(!m||x.b===b){m=x.m;if(!b)b=x.b;}
  }
 }
 return{b,m};
}

window.buildAssistant=async function(q){
 /* === EXTRACTION DTC CORRIGÉE (P20EE, P202E, etc.) === */
 const codes = (window.extractDtc ? window.extractDtc(q) : []) ;
 const veh=await detectVehicle(q);
 let html='',found=false;

 /* === RÉPONSES CODES DTC (massives) === */
 if(codes.length){
  codes.forEach(c=>{
   const i = (window.dtcInfo && window.dtcInfo(c)) || null;
   if(i){
    found=true;
    const sys = window.dtcSystem ? window.dtcSystem(c) : 'Autre';
    html+='<div class="detail" style="border-left:4px solid var(--acc2)">';
    html+='<b>🤖 Code '+c+'</b> <span class="chip" style="font-size:10px;padding:2px 6px;margin-left:6px">'+sys+'</span>';
    html+='<div style="margin-top:6px;font-size:15px"><b>'+i[0]+'</b></div>';
    html+='<div style="margin-top:8px"><small>🔧 Causes probables</small><div style="margin-top:4px">'+i[1]+'</div></div>';
    html+='<div style="margin-top:8px"><small>✅ Action recommandée</small><div style="margin-top:4px">'+i[2]+'</div></div>';
    /* Codes associés (si AdBlue/SCR : afficher les codes voisins) */
    if(/^P20/.test(c)||/^P22/.test(c)||/^P24/.test(c)){
     html+='<div style="margin-top:8px"><small>🔗 Codes dépollution associés</small>';
     const related=['P2002','P202E','P20BA','P20EE','P2200','P2201','P2207','P242F','P2459','P2463'];
     related.forEach(rc=>{
      const ri=window.dtcInfo(rc);
      if(ri&&rc!==c){html+='<div class="rowItem" onclick="pickSuggest(\''+rc+'\')" style="margin:3px 0;padding:6px"><b>'+rc+'</b><span>'+ri[0].slice(0,60)+'</span></div>';}
     });
     html+='</div>';
    }
    html+='</div>';
   }
  });
 }

 /* === RÉPONSES MOTS-CLÉS === */
 KEYWORD_DB.forEach(k=>{
  if(k.re.test(q)){
   found=true;
   html+='<div class="detail" style="border-left:4px solid var(--acc)"><b>🤖 '+k.label+'</b><br><small>Diagnostic</small>'+k.info+'<br><small>Action</small>'+k.act+'</div>';
  }
 });

 /* === PANNES CONNUES POUR LE MODÈLE DÉTECTÉ === */
 if(veh.b&&veh.m&&window.getKnownIssues){
  const issues=window.getKnownIssues(veh.b,veh.m);
  if(issues.length){
   found=true;
   html+='<div class="detail" style="border-left:4px solid var(--warn)">';
   html+='<h3 style="margin:0">⚠️ Pannes connues '+veh.b+' '+veh.m+' ('+issues.length+')</h3>';
   issues.slice(0,6).forEach(i=>{
    html+='<div style="margin:8px 0;padding:8px;background:var(--card2);border-radius:8px">';
    html+='<b>'+i[0]+'</b><br>';
    html+='<small>Causes</small>'+i[1]+'<br>';
    html+='<small>Action</small>'+i[2]+'<br>';
    html+='<small>Source : '+(i[4]||'—')+' • DTC : '+(i[3]&&i[3].length?i[3].join(', '):'—')+'</small>';
    html+='</div>';
   });
   html+='</div>';
  }
 }

 if(veh.b||veh.m){
  found=true;
  html+='<div class="detail" style="border-left:4px solid var(--acc2)"><b>🚗 Véhicule détecté :</b> '+(veh.b||'')+' '+(veh.m||'')+'</div>';
 }

 return{html:found?html:'',b:veh.b,m:veh.m,codes:codes};
};

/* Saisie en direct dans la case principale */
window.onSearchInput=async function(q){
 const box=document.getElementById('dtcSuggest');if(!box)return;
 q=(q||'').trim();
 if(q.length<2){box.style.display='none';return;}
 const ql=q.toLowerCase();
 let html='';

 /* === EXTRACTION DTC CORRIGÉE === */
 const codes = (window.extractDtc ? window.extractDtc(q) : []);
 codes.forEach(c=>{
  const i = window.dtcInfo && window.dtcInfo(c);
  if(i){
   html+='<div class="detail" style="border-left:4px solid var(--acc2)"><b>🤖 '+c+'</b> : '+i[0]+'<br><small>Causes</small>'+i[1]+'<br><small>Action</small>'+i[2]+'</div>';
  }
 });

 /* Suggestions DTC */
 if(window.dtcSuggest){
  const sug=window.dtcSuggest(ql,10);
  if(sug.length){
   html+='<div class="muted" style="margin-top:8px">Codes correspondants :</div>';
   sug.forEach(s=>{
    html+='<div class="rowItem" onclick="pickSuggest(\''+s.code+'\')"><b>'+s.code+'</b><span>'+s.label.slice(0,70)+'</span></div>';
   });
  }
 }

 /* Suggestions mots-clés */
 KEYWORD_DB.forEach(k=>{
  if(k.re.test(ql)){
   html+='<div class="rowItem" onclick="validateSearch()"><b>🤖 '+k.label+'</b><span>'+k.info.slice(0,50)+'…</span></div>';
  }
 });

 if(html){box.innerHTML=html;box.style.display='';}else box.style.display='none';
};

window.pickSuggest=function(code){
 $('#globalSearch').value=code;
 document.getElementById('dtcSuggest').style.display='none';
 renderGlobal(code);
};

/* Auto-complétion modèles */
window.suggestModels=async function(q){
 q=(q||'').trim().toLowerCase();
 const box=document.getElementById('modelSuggest');
 if(!box)return;
 if(q.length<3){box.style.display='none';return;}
 const models=await dbAll('models');
 const brands=await dbAll('brands');
 const qNorm=normalizeModel(q);
 const matches=models.filter(x=>normalizeModel(x.m).includes(qNorm)||x.m.toLowerCase().includes(q)).slice(0,15);
 if(!matches.length){box.style.display='none';return;}
 let html='<div class="muted">Modèles correspondants :</div>';
 matches.forEach(m=>{
  const b=brands.find(x=>x.name===m.b);
  html+='<div class="rowItem" onclick="pickModel(\''+m.b+'\',\''+m.m+'\')"><b>'+m.m+'</b><span>'+m.b+(b?' • '+b.origin:'')+'</span></div>';
 });
 box.innerHTML=html;box.style.display='';
};

window.pickModel=function(b,m){
 $('#dtcModel').value=m+' ';
 document.getElementById('modelSuggest').style.display='none';
 $('#dtcModel').focus();
};

/* Liens externes organisés */
function buildExternalLinks(title,queries){
 if(!window.buildSourceLinks)return'';
 const cats=window.buildSourceLinks(queries);
 let html='<div class="drawer" style="margin-top:10px"><h2>🔎 Recherches externes massives ('+title+')</h2>';
 for(const cat in cats){
  if(!cats[cat].items.length)continue;
  html+='<div style="margin:10px 0"><b>'+cats[cat].label+'</b><div class="actions" style="margin-top:6px">';
  cats[cat].items.forEach(it=>{
   html+='<a href="'+it.url+'" target="_blank" rel="noopener" class="chip">'+it.icon+' '+it.name+'</a>';
  });
  html+='</div></div>';
 }
 html+='</div>';
 return html;
}

/* Recherche 1 : DTC seul */
window.searchDtcOnly=async function(){
 const q=($('#dtcOnly').value||'').trim();
 const box=$('#dtcResult1');
 /* === EXTRACTION DTC CORRIGÉE === */
 const codes=(window.extractDtc?window.extractDtc(q):[]);
 if(!codes.length){box.innerHTML='<p class="muted">Indiquez un n° DTC valide (ex : P0016, P20EE, P202E, C0035).</p>';return;}

 let html='';
 for(const code of codes){
  const i=window.dtcInfo(code);
  const sheets=(await dbAll('sheets')).filter(s=>(s.dtc||[]).some(d=>d.toUpperCase()===code));
  const sys = window.dtcSystem ? window.dtcSystem(code) : 'Autre';

  html+='<div class="detail" style="border-left:4px solid var(--acc2)">';
  html+='<b>'+code+'</b> <span class="chip" style="font-size:10px;padding:2px 6px;margin-left:6px">'+sys+'</span>';
  html+='<div style="margin-top:6px;font-size:15px"><b>'+(i?i[0]:'Code non documenté')+'</b></div>';
  if(i){
   html+='<div style="margin-top:8px"><small>🔧 Causes probables</small><div style="margin-top:4px">'+i[1]+'</div></div>';
   html+='<div style="margin-top:8px"><small>✅ Action recommandée</small><div style="margin-top:4px">'+i[2]+'</div></div>';
  }
  html+='</div>';

  html+='<div class="muted" style="margin-top:8px">'+sheets.length+' fiche(s) dans la base locale contiennent '+code+'</div>';
  sheets.slice(0,10).forEach(s=>{
   html+='<div class="rowItem" onclick="openSheetById(\''+s.id+'\')"><b>'+s.b+' '+s.m+(s.e?' • '+s.e:'')+'</b><span>'+s.titre.slice(0,50)+'</span></div>';
  });

  /* Codes associés (dépollution) */
  if(/^P20/.test(code)||/^P22/.test(code)||/^P24/.test(code)){
   const related=['P2002','P202E','P20BA','P20EE','P2200','P2201','P2207','P242F','P2459','P2463'];
   html+='<div class="drawer" style="margin-top:10px"><h2>🔗 Codes dépollution associés</h2>';
   related.forEach(rc=>{
    const ri=window.dtcInfo(rc);
    if(ri&&rc!==code){
     html+='<div class="rowItem" onclick="$(\'#dtcOnly\').value=\''+rc+'\';searchDtcOnly()"><b>'+rc+'</b><span>'+ri[0].slice(0,60)+'</span></div>';
    }
   });
   html+='</div>';
  }
 }

 html+=buildExternalLinks(codes.join(' + '),codes);
 box.innerHTML=html;
};

/* Recherche 2 : modèle + DTC */
window.searchDtcModel=async function(){
 const q=($('#dtcModel').value||'').trim().toLowerCase();
 const box=$('#dtcResult2');
 /* === EXTRACTION DTC CORRIGÉE === */
 const codes=(window.extractDtc?window.extractDtc(q):[]);
 if(!codes.length){box.innerHTML='<p class="muted">Format : « modèle suivi du dtc » (ex : 3008 P0016, ID4 P0A80, Tiguan P20EE).</p>';return;}

 const models=await dbAll('models');
 const qNorm=normalizeModel(q);
 let fm=null;
 for(const x of models){
  const mNorm=normalizeModel(x.m);
  if(qNorm.includes(mNorm)||q.includes(x.m.toLowerCase())){fm=x;break;}
 }
 if(!fm){box.innerHTML='<p class="muted">Modèle non reconnu. Ex : « ID4 P0A80 », « 3008 P0016 », « Golf P20EE ».</p>';return;}

 const code = codes[0];
 const i=window.dtcInfo(code);
 const sheets=(await dbAll('sheets')).filter(s=>s.m===fm.m&&(s.dtc||[]).some(d=>d.toUpperCase()===code));
 const issues=(window.getKnownIssues?window.getKnownIssues(fm.b,fm.m):[])||[];
 const sys = window.dtcSystem ? window.dtcSystem(code) : 'Autre';

 let html='<div class="detail" style="border-left:4px solid var(--acc2)">';
 html+='<b>'+fm.b+' '+fm.m+' + '+code+'</b> <span class="chip" style="font-size:10px;padding:2px 6px;margin-left:6px">'+sys+'</span>';
 if(sheets.length){html+=' <span class="chip" style="background:var(--acc2);color:#fff;font-size:10px;padding:2px 6px">✅ DÉFAUT CONNU</span>';}
 html+='<div style="margin-top:6px;font-size:15px"><b>'+(i?i[0]:'Code non documenté')+'</b></div>';
 if(i){
  html+='<div style="margin-top:8px"><small>🔧 Causes probables</small><div style="margin-top:4px">'+i[1]+'</div></div>';
  html+='<div style="margin-top:8px"><small>✅ Action recommandée</small><div style="margin-top:4px">'+i[2]+'</div></div>';
 }
 html+='</div>';

 /* Pannes connues */
 if(issues.length){
  html+='<div class="drawer" style="margin-top:10px"><h2>⚠️ Pannes connues '+fm.b+' '+fm.m+' ('+issues.length+')</h2>';
  issues.forEach(iss=>{
   const dtcMatch=(iss[3]||[]).some(d=>d.toUpperCase()===code);
   html+='<div style="margin:6px 0;padding:8px;background:var(--card2);border-radius:8px;border-left:3px solid '+(dtcMatch?'var(--acc2)':'var(--acc)')+'">';
   if(dtcMatch)html+='<span class="chip" style="background:var(--acc2);color:#fff;font-size:10px;padding:2px 6px;margin-right:6px">code trouvé</span>';
   html+='<b>'+iss[0]+'</b><br><small>Causes</small>'+iss[1]+'<br><small>Action</small>'+iss[2]+'<br><small>Source : '+(iss[4]||'—')+' • DTC : '+(iss[3]&&iss[3].length?iss[3].join(', '):'—')+'</small></div>';
  });
  html+='</div>';
 }

 sheets.slice(0,8).forEach(s=>{
  html+='<div class="rowItem" onclick="openSheetById(\''+s.id+'\')"><b>'+s.titre.slice(0,50)+'</b><span>'+(s.src||'')+'</span></div>';
 });

 const queries=[fm.b+' '+fm.m,fm.b+' '+fm.m+' '+code,fm.m+' problèmes',code];
 html+=buildExternalLinks(fm.b+' '+fm.m+' + '+code,queries);
 box.innerHTML=html;
};

window.openSheetById=async function(id){
 const all=await dbAll('sheets');const s=all.find(x=>x.id===id);if(s)openSheet(s);
};
})();
