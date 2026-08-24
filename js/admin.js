const ADMIN_PASSWORD='Kevin83600@';
const modal=document.getElementById('admin-modal');
const btnAdmin=document.getElementById('btn-admin');
document.getElementById('admin-close').addEventListener('click',()=>modal.classList.remove('open'));
btnAdmin.addEventListener('click',()=>modal.classList.add('open'));
modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open');});

function showTools(){
  document.getElementById('admin-login-view').style.display='none';
  document.getElementById('admin-tools').style.display='block';
}
function tryLogin(){
  const pass=document.getElementById('admin-pass');
  if(pass.value===ADMIN_PASSWORD){sessionStorage.setItem('at-admin','1');showTools();}
  else{alert('❌ Mot de passe incorrect');pass.value='';}
}
document.getElementById('admin-login').addEventListener('click',tryLogin);
document.getElementById('admin-pass').addEventListener('keydown',e=>{if(e.key==='Enter')tryLogin();});
if(sessionStorage.getItem('at-admin')==='1')showTools();

document.getElementById('btn-share').addEventListener('click',()=>{
  const url=window.location.origin;
  if(navigator.share)navigator.share({title:'Analyse Technique Kevin',url}).catch(()=>{});
  else navigator.clipboard.writeText(url).then(()=>alert('✅ Lien copié !'));
});
document.getElementById('btn-pdf').addEventListener('click',()=>window.print());
document.getElementById('btn-export').addEventListener('click',()=>{
  const blob=new Blob([JSON.stringify(getData(),null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='donnees-at-kevin.json';a.click();
});
document.getElementById('import-json').addEventListener('change',e=>{
  const f=e.target.files[0];if(!f)return;
  const r=new FileReader();
  r.onload=ev=>{
    try{
      JSON.parse(ev.target.result);
      localStorage.setItem('at-custom-data',ev.target.result);
      alert('✅ Données importées !');location.reload();
    }catch(err){alert('❌ Fichier JSON invalide');}
  };
  r.readAsText(f);
});
