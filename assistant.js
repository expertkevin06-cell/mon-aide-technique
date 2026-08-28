/* assistant.js v6 — Recherche améliorée (ID4, P20EE, normalisation) */
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
{re:/écran|multimédia|tablette/i,label:'Multimédia',info:'Reboots.',act:'MAJ/remplacement.'},
{re:/injecteur/i,label:'Injecteurs',info:'Fuite/encrassement.',act:'Test + remplacement.'},
{re:/bobine|allumage/i,label:'Bobines',info:'Ratés.',act:'Remplacement bobines.'},
{re:/thermostat|refroidissement/i,label:'Refroidissement',info:'Thermostat, pompes.',act:'Contrôle circuit.'}];
function escRe(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}
/* Normalisation modèle : enlève points, espaces, tirets pour comparaison */
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
/* Auto-complétion modèles avec normalisation */
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
 html+='<hr><div class="muted">🔎 Recherches externes :</div><div class="actions"><a href="https://rappel.conso.gouv.fr/recherche?query='+encodeURIComponent(code)+'" target="_blank" class="chip">Rappel Conso</a><a href="https://ec.europa.eu/safety-gate-alerts/screen/search?query='+encodeURIComponent(code)+'" target="_blank" class="chip">Safety Gate</a><a href="https://www.largus.fr/recherche?q='+encodeURIComponent(code)+'" target="_blank" class="chip">L\'Argus</a></div>';
 box.innerHTML=html;
};
/* Recherche 2 : modèle + DTC avec normalisation */
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
 const engines=(await dbAll('engines')).filter(x=>x.b===fm.b&&x.m===fm.m);
 const sys=window.dtcSystem?window.dtcSystem(code):'Autre';
 let famHit=null;
 outer:for(const e of engines){for(const r of FAM){if((!r.brands.length||r.brands.includes(e.b))&&(r.re.test(e.e)||r.re.test(e.m))){if((r.d||[]).includes(code)||r.cat===sys||(r.t&&r.t.toLowerCase().includes(sys.toLowerCase()))){famHit=r;break outer;}}}}
 let verdict;
 if(sheets.length){verdict='<div class="detail" style="border-left:4px solid var(--acc2)">✅ <b>DÉFAUT CONNU</b> pour '+esc(fm.b)+' '+esc(fm.m)+' ('+code+') — '+sheets.length+' fiche(s) spécifique(s).</div>';}
 else if(famHit){verdict='<div class="detail" style="border-left:4px solid var(--warn)">⚠️ <b>Défaut connu sur cette famille/motorisation</b> : '+esc(famHit.t)+'.</div>';}
 else if(i){verdict='<div class="detail" style="border-left:4px solid var(--acc)">📘 Code documenté (générique) : '+esc(i[0])+' — pas de campagne spécifique trouvée pour ce modèle.</div>';}
 else{verdict='<div class="detail" style="border-left:4px solid var(--danger)">❓ Code non trouvé dans la base.</div>';}
 let html=verdict;
 if(i){html+='<div class="detail"><small>Causes</small>'+i[1]+'<small>Action</small>'+i[2]+'</div>';}
 sheets.slice(0,8).forEach(s=>{html+='<div class="rowItem" onclick="openSheetById(\''+s.id+'\')"><b>'+esc(s.titre.slice(0,50))+'</b><span>'+esc(s.src||'')+'</span></div>';});
 html+='<hr><div class="muted">🔎 Recherches externes sur '+esc(fm.b)+' '+esc(fm.m)+' + '+code+' :</div>';
 html+='<div class="actions">';
 html+='<a href="https://rappel.conso.gouv.fr/recherche?query='+encodeURIComponent(fm.b+' '+fm.m)+'" target="_blank" class="chip">Rappel Conso</a>';
 html+='<a href="https://ec.europa.eu/safety-gate-alerts/screen/search?query='+encodeURIComponent(fm.b+' '+fm.m)+'" target="_blank" class="chip">Safety Gate</a>';
 html+='<a href="https://www.largus.fr/recherche?q='+encodeURIComponent(fm.b+' '+fm.m+' '+code)+'" target="_blank" class="chip">L\'Argus</a>';
 html+='<a href="https://baike.baidu.com/item/'+encodeURIComponent(fm.b+' '+fm.m)+'" target="_blank" class="chip">Baidu (Chine)</a>';
 html+='</div>';
 box.innerHTML=html;
};
window.openSheetById=async function(id){
 const all=await dbAll('sheets');const s=all.find(x=>x.id===id);if(s)openSheet(s);
};
})();
