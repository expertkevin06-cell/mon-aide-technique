/* assistant.js v7 — Pannes connues + 25+ sources externes organisées */
(function(){
'use strict';
function info(c){return (window.dtcInfo&&window.dtcInfo(c))||null;}
const KEYWORD_DB=[
{re:/courroie|belt/i,label:'Courroie',info:'Usure/dégradation (courroies immergées). Risque casse.',act:'Contrôle + remplacement préventif.'},
{re:/cha[iî]ne|chain/i,label:'Chaîne distribution',info:'Allongement/tendeurs. Bruit à froid.',act:'Contrôle + kit chaîne.'},
{re:/egr/i,label:'Vanne EGR',info:'Encrassement : perte puissance.',act:'Nettoyage/remplacement EGR.'},
{re:/fap|dpf|particule/i,label:'FAP',info:'Colmatage : mode dégradé.',act:'Régénération/remplacement.'},
{re:/adblue|scr|nox/i,label:'AdBlue/SCR',info:'Qualité AdBlue, capteur NOx, injecteur, catalyseur SCR.',act:'Contrôle AdBlue + SCR + injecteur.'},
{re:/turbo/i,label:'Turbo',info:'GV/actuateur : pression basse.',act:'Contrôle turbo/wastegate.'},
{re:/\babs\b/i,label:'ABS',info:'Capteurs roue.',act:'Remplacement capteur.'},
{re:/front ?assist|radar/i,label:'Front Assist',info:'Radar AV sali/décalé.',act:'Nettoyage + calibration radar.'},
{re:/caméra|camera/i,label:'Caméras',info:'Recul/360/ADAS.',act:'Calibration/remplacement.'},
{re:/airbag/i,label:'Airbag',info:'Clockspring, gonfleurs.',act:'Diagnostic SRS.'},
{re:/ceinture|prétension/i,label:'Ceintures',info:'Prétensionneurs.',act:'Remplacement prétensionneur.'},
{re:/frein|brake|plaquette/i,label:'Freinage',info:'Plaquettes/disques/étriers.',act:'Contrôle + remplacement.'},
{re:/bo[iî]te|dsg|edc|cvt/i,label:'Boîte',info:'Mécatronique, embrayages.',act:'Vidange + mécatronique.'},
{re:/batterie|battery/i,label:'Batterie',info:'12V ou HT.',act:'Test 12V / SOH HT.'},
{re:/charge/i,label:'Charge HT',info:'OBC, CCS, DC-DC.',act:'Contrôle prise/câble/OBC.'},
{re:/écran|multimédia|tablette|infotainment/i,label:'Multimédia',info:'Reboots.',act:'MAJ/remplacement.'},
{re:/injecteur/i,label:'Injecteurs',info:'Fuite/encrassement.',act:'Test + remplacement.'},
{re:/bobine|allumage/i,label:'Bobines',info:'Ratés.',act:'Remplacement bobines.'},
{re:/thermostat|refroidissement|pompe/i,label:'Refroidissement',info:'Thermostat, pompes.',act:'Contrôle circuit.'},
{re:/hayon/i,label:'Hayon électrique',info:'Moteur, capteurs.',act:'Diagnostic moteur hayon.'},
{re:/suspension|pneumatique/i,label:'Suspension',info:'Coussins, sphères, amortisseurs.',act:'Contrôle circuit suspension.'}];
function escRe(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
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
 const codes=(q.match(/\b[pcbu]\d{4,5}\b/gi)||[]).map(c=>c.toUpperCase());
 const veh=await detectVehicle(q);
 let html='',found=false;
 if(codes.length||KEYWORD_DB.some(k=>k.re.test(q))||veh.b||veh.m){
  html='<div class="detail" style="border-left:4px solid var(--acc2)">';
  codes.forEach(c=>{const i=info(c);if(i){found=true;html+='<b>🤖 '+c+'</b> : '+i[0]+'<br><small>Causes</small>'+i[1]+'<br><small>Action</small>'+i[2]+'<hr>';}});
  KEYWORD_DB.forEach(k=>{if(k.re.test(q)){found=true;html+='<b>🤖 '+k.label+'</b> : '+k.info+'<br><small>Action</small>'+k.act+'<hr>';}});
  /* Pannes connues pour le modèle détecté */
  if(veh.b&&veh.m&&window.getKnownIssues){
   const issues=window.getKnownIssues(veh.b,veh.m);
   if(issues.length){
    found=true;
    html+='<h3 style="margin-top:10px">⚠️ Pannes connues pour '+esc(veh.b)+' '+esc(veh.m)+' ('+issues.length+')</h3>';
    issues.slice(0,5).forEach(i=>{
     html+='<div style="margin:6px 0;padding:8px;background:var(--card2);border-radius:8px"><b>'+esc(i[0])+'</b><br><small>Causes</small>'+esc(i[1])+'<br><small>Action</small>'+esc(i[2])+'<br><small>Source : '+esc(i[4]||'')+'</small></div>';
    });
   }
  }
  if(veh.b||veh.m){found=true;html+='<b>🚗 Véhicule :</b> '+esc(veh.b||'')+' '+esc(veh.m||'')+' — fiches ciblées.';}
  html+='</div>';
 }
 return{html:found?html:'',b:veh.b,m:veh.m};
};
window.onSearchInput=async function(q){
 const box=document.getElementById('dtcSuggest');if(!box)return;
 q=(q||'').trim();
 if(q.length<2){box.style.display='none';return;}
 const ql=q.toLowerCase();let html='';
 const m=ql.match(/\b([pcbu]\d{4,5})\b/i);
 if(m){const i=info(m[1].toUpperCase());if(i){html+='<div class="detail" style="border-left:4px solid var(--acc2)"><b>🤖 '+m[1].toUpperCase()+'</b> : '+i[0]+'<br><small>Causes</small>'+i[1]+'<br><small>Action</small>'+i[2]+'</div>';}}
 if(window.dtcSuggest){const sug=window.dtcSuggest(ql,8);if(sug.length){html+='<div class="muted">Codes correspondants :</div>';sug.forEach(s=>{html+='<div class="rowItem" onclick="pickSuggest(\''+s.code+'\')"><b>'+s.code+'</b><span>'+esc(s.label)+'</span></div>';});}}
 KEYWORD_DB.forEach(k=>{if(k.re.test(ql)){html+='<div class="rowItem" onclick="validateSearch()"><b>🤖 '+k.label+'</b><span>'+esc(k.info.slice(0,50))+'…</span></div>';}});
 if(html){box.innerHTML=html;box.style.display='';}else box.style.display='none';
};
window.pickSuggest=function(code){$('#globalSearch').value=code;document.getElementById('dtcSuggest').style.display='none';renderGlobal(code);};
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
 let html='<div class="muted">Modèles correspondants (cliquez pour compléter) :</div>';
 matches.forEach(m=>{const b=brands.find(x=>x.name===m.b);html+='<div class="rowItem" onclick="pickModel(\''+esc(m.b)+'\',\''+esc(m.m)+'\')"><b>'+esc(m.m)+'</b><span>'+esc(m.b)+(b?' • '+b.origin:'')+'</span></div>';});
 box.innerHTML=html;box.style.display='';
};
window.pickModel=function(b,m){
 $('#dtcModel').value=m+' ';
 document.getElementById('modelSuggest').style.display='none';
 $('#dtcModel').focus();
};
/* Génère les liens organisés par catégorie */
function buildExternalLinks(title,queries){
 if(!window.buildSourceLinks)return'';
 const cats=window.buildSourceLinks(queries);
 let html='<div class="drawer" style="margin-top:10px"><h2>🔎 Recherches externes massives ('+(title||'')+') </h2>';
 for(const cat in cats){
  if(!cats[cat].items.length)continue;
  html+='<div style="margin:10px 0"><b>'+cats[cat].label+'</b><div class="actions" style="margin-top:6px">';
  cats[cat].items.forEach(it=>{
   html+='<a href="'+it.url+'" target="_blank" rel="noopener" class="chip">'+it.icon+' '+esc(it.name)+'</a>';
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
 const m=q.match(/\b([pcbu]\d{4,5})\b/i);
 if(!m){box.innerHTML='<p class="muted">Indiquez un n° DTC valide (ex : P0016, P20EE).</p>';return;}
 const code=m[1].toUpperCase();
 const i=info(code);
 const sheets=(await dbAll('sheets')).filter(s=>(s.dtc||[]).some(d=>d.toUpperCase()===code));
 let html='<div class="detail" style="border-left:4px solid var(--acc2)"><b>'+code+'</b> — '+(i?i[0]:'code non documenté')+'</div>';
 if(i){html+='<div class="detail"><small>Causes probables</small>'+i[1]+'<small>Action</small>'+i[2]+'</div>';}
 html+='<div class="muted">'+sheets.length+' fiche(s) dans la base contiennent ce code.</div>';
 sheets.slice(0,10).forEach(s=>{html+='<div class="rowItem" onclick="openSheetById(\''+s.id+'\')"><b>'+esc(s.b)+' '+esc(s.m)+'</b><span>'+esc(s.titre.slice(0,50))+'</span></div>';});
 html+=buildExternalLinks(code,[code]);
 box.innerHTML=html;
};
/* Recherche 2 : modèle + DTC */
window.searchDtcModel=async function(){
 const q=($('#dtcModel').value||'').trim().toLowerCase();
 const box=$('#dtcResult2');
 const m=q.match(/\b([pcbu]\d{4,5})\b/i);
 if(!m){box.innerHTML='<p class="muted">Format : « modèle suivi du dtc » (ex : 3008 P0016, ID4 P0A80).</p>';return;}
 const code=m[1].toUpperCase();
 const models=await dbAll('models');
 const qNorm=normalizeModel(q);
 let fm=null;
 for(const x of models){
  const mNorm=normalizeModel(x.m);
  if(qNorm.includes(mNorm)||q.includes(x.m.toLowerCase())){fm=x;break;}
 }
 if(!fm){box.innerHTML='<p class="muted">Modèle non reconnu. Ex : « 3008 P0016 », « ID4 P0A80 ».</p>';return;}
 const i=info(code);
 const sheets=(await dbAll('sheets')).filter(s=>s.m===fm.m&&(s.dtc||[]).some(d=>d.toUpperCase()===code));
 const issues=(window.getKnownIssues?window.getKnownIssues(fm.b,fm.m):[])||[];
 let html='<div class="detail" style="border-left:4px solid var(--acc2)"><b>'+esc(fm.b)+' '+esc(fm.m)+' + '+code+'</b></div>';
 if(sheets.length){html+='<div class="detail" style="border-left:4px solid var(--acc2)">✅ <b>DÉFAUT CONNU</b> — '+sheets.length+' fiche(s) spécifique(s).</div>';}
 else if(i){html+='<div class="detail" style="border-left:4px solid var(--acc)">📘 Code générique : '+esc(i[0])+'</div>';}
 if(i){html+='<div class="detail"><small>Causes</small>'+i[1]+'<small>Action</small>'+i[2]+'</div>';}
 /* Pannes connues */
 if(issues.length){
  html+='<h3 style="margin-top:14px">⚠️ Pannes connues '+esc(fm.b)+' '+esc(fm.m)+' ('+issues.length+')</h3>';
  issues.forEach(iss=>{
   const dtcMatch=(iss[3]||[]).some(d=>d.toUpperCase()===code);
   html+='<div style="margin:6px 0;padding:8px;background:var(--card2);border-radius:8px;border-left:3px solid '+(dtcMatch?'var(--acc2)':'var(--acc)')+'">';
   if(dtcMatch)html+='<span class="chip" style="background:var(--acc2);color:#fff;font-size:10px;padding:2px 6px;margin-right:6px">code trouvé</span>';
   html+='<b>'+esc(iss[0])+'</b><br><small>Causes</small>'+esc(iss[1])+'<br><small>Action</small>'+esc(iss[2])+'<br><small>Source : '+esc(iss[4]||'')+' • DTC : '+esc((iss[3]||[]).join(', ')||'—')+'</small></div>';
  });
 }
 sheets.slice(0,8).forEach(s=>{html+='<div class="rowItem" onclick="openSheetById(\''+s.id+'\')"><b>'+esc(s.titre.slice(0,50))+'</b><span>'+esc(s.src||'')+'</span></div>';});
 const queries=[fm.b+' '+fm.m,fm.b+' '+fm.m+' '+code,fm.m+' problèmes'];
 html+=buildExternalLinks(fm.b+' '+fm.m,queries);
 box.innerHTML=html;
};
window.openSheetById=async function(id){
 const all=await dbAll('sheets');const s=all.find(x=>x.id===id);if(s)openSheet(s);
};
})();
