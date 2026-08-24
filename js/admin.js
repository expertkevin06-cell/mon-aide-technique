// ===== ADMIN — Analyse Technique Kevin =====
const ADMIN_PASSWORD = 'Kevin83600@';

const modal = document.getElementById('admin-modal');
const btnAdmin = document.getElementById('btn-admin');
const btnClose = document.getElementById('admin-close');
const btnLogin = document.getElementById('admin-login');
const passInput = document.getElementById('admin-pass');
const loginView = document.getElementById('admin-login-view');
const tools = document.getElementById('admin-tools');

function openModal() { modal.classList.add('open'); }
function closeModal() { modal.classList.remove('open'); }

btnAdmin.addEventListener('click', openModal);
btnClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

function tryLogin() {
  if (passInput.value === ADMIN_PASSWORD) {
    sessionStorage.setItem('at-admin', '1');
    showTools();
  } else {
    alert('❌ Mot de passe incorrect');
    passInput.value = '';
  }
}

function showTools() {
  loginView.style.display = 'none';
  tools.style.display = 'block';
}

btnLogin.addEventListener('click', tryLogin);
passInput.addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); });

// Session déjà ouverte ?
if (sessionStorage.getItem('at-admin') === '1') showTools();

// 📤 Partager
document.getElementById('btn-share').addEventListener('click', () => {
  const url = window.location.origin;
  if (navigator.share) {
    navigator.share({ title: 'Analyse Technique Kevin', url }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url).then(() => alert('✅ Lien copié !'));
  }
});

// 🖨️ PDF
document.getElementById('btn-pdf').addEventListener('click', () => window.print());

// 📤 Export JSON
document.getElementById('btn-export').addEventListener('click', () => {
  const data = getData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'donnees-at-kevin.json';
  a.click();
});

// 📥 Import JSON
document.getElementById('import-json').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      localStorage.setItem('at-custom-data', JSON.stringify(data));
      alert('✅ Données importées ! Rechargez la page.');
      location.reload();
    } catch (err) {
      alert('❌ Fichier JSON invalide');
    }
  };
  reader.readAsText(file);
});
