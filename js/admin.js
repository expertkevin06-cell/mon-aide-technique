// ===== ADMIN — Mot de passe + gestion des fiches personnalisées =====
const ADMIN_PASS = 'Kevin83600@';
const LS_CUSTOM = 'at-custom-fiches';   // fiches ajoutées par l'admin
const LS_SESSION = 'at-admin-session';

const adminModal = document.getElementById('admin-modal');
const btnAdmin = document.getElementById('btn-admin');

// --- Ouverture / fermeture ---
btnAdmin.addEventListener('click', () => {
  adminModal.classList.add('open');
  if (sessionStorage.getItem(LS_SESSION) === 'ok') showTools();
});
document.getElementById('admin-close').addEventListener('click', () => adminModal.classList.remove('open'));

// --- Connexion ---
document.getElementById('admin-login').addEventListener('click', tryLogin);
document.getElementById('admin-pass').addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); });
function tryLogin() {
  const p = document.getElementById('admin-pass').value;
  if (p === ADMIN_PASS) {
    sessionStorage.setItem(LS_SESSION, 'ok');
    showTools();
  } else {
    alert('❌ Mot de passe incorrect.');
    document.getElementById('admin-pass').value = '';
  }
}
function showTools() {
  document.getElementById('admin-login-view').style.display = 'none';
  document.getElementById('admin-tools').style.display = 'block';
  fillDatalists();
}

// --- Déconnexion ---
document.getElementById('btn-logout').addEventListener('click', () => {
  sessionStorage.removeItem(LS_SESSION);
  document.getElementById('admin-tools').style.display = 'none';
  document.getElementById('admin-login-view').style.display = 'block';
});

// ===== Gestion des fiches personnalisées =====
function getCustom() { return JSON.parse(localStorage.getItem(LS_CUSTOM) || '[]'); }
function saveCustom(list) { localStorage.setItem(LS_CUSTOM, JSON.stringify(list)); }

// --- Autocomplétion depuis la base existante ---
function allData() { return DB.concat(getCustom()); }
function fillDatalists() {
  const uniq = a => [...new Set(a)].sort();
  const d = allData();
  document.getElementById('liste-marques').innerHTML = uniq(d.map(f => f.marque)).map(m => '<option>' + m + '</option>').join('');
  updateModelesDatalist();
}
function updateModelesDatalist() {
  const m = document.getElementById('f-marque').value.trim().toUpperCase();
  const list = allData().filter(f => f.marque === m);
  const uniq = a => [...new Set(a)].sort();
  document.getElementById('listes-modeles').innerHTML = uniq(list.map(f => f.modele)).map(x => '<option>' + x + '</option>').join('');
  document.getElementById('f-modele').disabled = false;
  updateMoteursDatalist();
}
function updateMoteursDatalist() {
  const m = document.getElementById('f-marque').value.trim().toUpperCase();
  const mo = document.getElementById('f-modele').value.trim();
  let list = allData().filter(f => f.marque === m);
  if (mo) list = list.filter(f => f.modele === mo);
  const uniq = a => [...new Set(a)].sort();
  document.getElementById('liste-moteurs').innerHTML = uniq(list.map(f => f.moteur)).map(x => '<option>' + x + '</option>').join('');
  document.getElementById('f-moteur').disabled = false;
}
document.getElementById('f-marque').addEventListener('input', updateModelesDatalist);
document.getElementById('f-modele').addEventListener('input', updateMoteursDatalist);

// --- PDF en base64 ---
let pdfData = null, pdfName = '';
document.getElementById('f-pdf').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) {
    alert("⚠️ PDF trop volumineux (max 2 Mo). Compressez-le d'abord.");
    e.target.value = '';
    return;
  }
  pdfName = file.name;
  const reader = new FileReader();
  reader.onload = ev => { pdfData = ev.target.result; document.getElementById('pdf-name').textContent = '📎 ' + pdfName + ' chargé'; };
  reader.readAsDataURL(file);
});

// --- Enregistrement de la fiche ---
document.getElementById('btn-add-fiche').addEventListener('click', () => {
  const g = id => document.getElementById(id).value.trim();
  const marque = g('f-marque').toUpperCase(), modele = g('f-modele'), moteur = g('f-moteur'),
        titre = g('f-titre'), details = g('f-details');
  if (!marque || !modele || !titre) {
    alert('⚠️ Marque, modèle et titre sont obligatoires.'); return;
  }
  const themes = [];
  const te = g('f-theme-elec'), tq = g('f-theme-electrique'), tc = g('f-theme-carrosserie');
  if (te) themes.push('⚙️ ' + te);
  if (tq) themes.push('⚡ ' + tq);
  if (tc) themes.push('🔩 ' + tc);

  const liste = getCustom();
  liste.push({
    marque, modele,
    moteur: moteur || 'Toutes',
    annee: g('f-annee') || '—',
    dtc: g('f-dtc') || '',
    source: 'Fiche atelier K.',
    titre,
    details: details + (themes.length ? '\n\n🏷️ Thèmes : ' + themes.join(' | ') : ''),
    themes,
    custom: true,
    pdf: pdfData, pdfName
  });
  saveCustom(liste);
  alert('✅ Fiche enregistrée (' + liste.length + ' fiche(s) perso au total)');
  ['f-marque','f-modele','f-moteur','f-annee','f-dtc','f-titre','f-details'].forEach(id => document.getElementById(id).value = '');
  ['f-theme-elec','f-theme-electrique','f-theme-carrosserie'].forEach(id => document.getElementById(id).selectedIndex = 0);
  pdfData = null; pdfName = '';
  document.getElementById('pdf-name').textContent = '';
  if (typeof refreshApp === 'function') refreshApp();
});

// --- Suppression d'une fiche perso (appelée depuis app.js) ---
window.deleteCustomFiche = function(idx) {
  if (!confirm('Supprimer cette fiche ?')) return;
  const liste = getCustom();
  liste.splice(idx, 1);
  saveCustom(liste);
  if (typeof refreshApp === 'function') refreshApp();
};

// ===== Export / Import JSON =====
document.getElementById('btn-export').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify(getCustom(), null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'analyse-kevin-fiches.json';
  a.click();
});
document.getElementById('import-json').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      if (!Array.isArray(data)) throw 0;
      saveCustom(getCustom().concat(data.map(f => ({ ...f, custom: true }))));
      alert('✅ ' + data.length + ' fiche(s) importée(s)');
      if (typeof refreshApp === 'function') refreshApp();
    } catch { alert('❌ Fichier JSON invalide'); }
  };
  reader.readAsText(file);
});

// ===== Partage SMS / Mail =====
document.getElementById('btn-share-contact').addEventListener('click', () => {
  const url = location.href;
  const msg = encodeURIComponent('🔧 Voici mon appli Analyse Technique Kevin : ' + url);
  const choice = prompt('Comment partager ?\n\n1 = SMS 📱\n2 = Mail ✉️\n3 = Copier le lien 🔗', '1');
  if (choice === '1') location.href = 'sms:?&body=' + msg;
  else if (choice === '2') location.href = 'mailto:?subject=' + encodeURIComponent('Analyse Technique Kevin') + '&body=' + msg;
  else if (choice === '3') navigator.clipboard.writeText(url).then(() => alert('✅ Lien copié !'));
});

// ===== Impression PDF =====
document.getElementById('btn-pdf').addEventListener('click', () => window.print());
