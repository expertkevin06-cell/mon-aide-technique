const searchInput=document.getElementById('search');
const resultsDiv=document.getElementById('results');
const emptyState=document.getElementById('empty-state');
const selMarque=document.getElementById('filter-marque');
const selModele=document.getElementById('filter-modele');
const selMoteur=document.getElementById('filter-moteur');
const btnReset=document.getElementById('btn-reset');

function getData(){
  const c=localStorage.getItem('at-custom-data');
  return c?JSON.parse(c):DB;
}
const unique=a=>[...new Set(a)].sort();

function fillModeles(){
  const m=selMarque.value;
  const list=m?getData().filter(d=>d.marque===m):getData();
  selModele.innerHTML='<option value="">Tous les modèles</option>'+unique(list.map(d=>d.modele)).map(x=>'<option>'+x+'</option>').join('');
  selModele.disabled=!m;
  fillMoteurs();
}
function fillMoteurs(){
  let list=getData();
  if(selMarque.value)list=list.filter(d=>d.marque===selMarque.value);
  if(selModele.value)list=list.filter(d=>d.modele===selModele.value);
  selMoteur.innerHTML='<option value="">Toutes les motorisations</option>'+unique(list.map(d=>d.moteur)).map(x=>'<option>'+x+'</option>').join('');
  selMoteur.disabled=!(selMarque.value||selModele.value);
}

function currentResults(){
  let list=getData();
  if(selMarque.value)list=list.filter(d=>d.marque===selMarque.value);
  if(selModele.value)list=list.filter(d=>d.modele===selModele.value);
  if(selMoteur.value)list=list.filter(d=>d.moteur===selMoteur.value);
  const q=searchInput.value.toLowerCase().trim();
  if(q)list=list.filter(d=>(d.marque+' '+d.modele+' '+d.moteur+' '+d.annee+' '+d.titre+' '+d.details).toLowerCase().includes(q));
  return list;
}
function render(list){
  resultsDiv.innerHTML='';
  emptyState.style.display=list.length?'none':'block';
  list.forEach(i=>{
    const c=document.createElement('div');c.className='card';
    c.innerHTML='<div class="meta">'+i.marque+' • '+i.modele+' • '+i.moteur+' ('+i.annee+')</div><h3>'+i.titre+'</h3><p>'+i.details+'</p>';
    resultsDiv.appendChild(c);
  });
}
function refresh(){fillModeles();render(currentResults());}

selMarque.addEventListener('change',()=>{fillModeles();render(currentResults());});
selModele.addEventListener('change',()=>{fillMoteurs();render(currentResults());});
selMoteur.addEventListener('change',()=>render(currentResults()));
btnReset.addEventListener('click',()=>{selMarque.value='';searchInput.value='';refresh();});
searchInput.addEventListener('input',()=>render(currentResults()));

// Init filtres marques
selMarque.innerHTML='<option value="">Toutes les marques</option>'+unique(getData().map(d=>d.marque)).map(m=>'<option>'+m+'</option>').join('');
fillModeles();
render(getData());

// ===== RECHERCHE PAR VIN → OVS officiel =====
const vinInput=document.getElementById('vin-input');
const btnVin=document.getElementById('btn-vin');

function checkVin(){
  const vin=vinInput.value.trim().toUpperCase();
  if(vin.length<17){
    alert('⚠️ Le VIN doit contenir 17 caractères.\nIl se trouve sur la carte grise (champ E) ou en bas du pare-brise.');
    return;
  }
  window.open('https://ovs.economie.gouv.fr/','_blank');
}
btnVin.addEventListener('click',checkVin);
vinInput.addEventListener('keydown',e=>{if(e.key==='Enter')checkVin();});
vinInput.addEventListener('input',()=>{
  vinInput.value=vinInput.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g,'');
});
