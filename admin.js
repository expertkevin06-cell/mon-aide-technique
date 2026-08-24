// ===== ADMIN — Analyse Technique Kevin =====
const ADMIN_PASSWORD = 'kevin2024'; // ⚠️ changez ce mot de passe !

const modal = document.getElementById('admin-modal');
const btnAdmin = document.getElementById('btn-admin');
const btnLogin = document.getElementById('admin-login');
const btnClose = document.getElementById('admin-close');
const passInput = document.getElementById('admin-pass');
const tools = document.getElementById('admin-tools');

// Ouvrir / fermer
if (btnAdmin) {
  btnAdmin.addEventListener('click', () => modal.classList.add('open'));
}
if (btnClose) {
  btnClose.addEventListener('click', () => modal.classList.remove('open'));
}

// Valider le mot de passe
function tryLogin() {
  if (passInput.value === ADMIN_PASSWORD) {
    tools.style.display = 'block';
    passInput.style.display = 'none';
    btnLogin.style.display = 'none';
    sessionStorage.setItem('at-admin', '1');
  } else {
    alert('❌ Mot de passe incorrect');
    passInput.value = '';
  }
}
if (btnLogin) {
  btnLogin.addEventListener('click', tryLogin);
}
passInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') tryLogin();
});

// Déjà connecté dans cette session ?
if (sessionStorage.getItem('at-admin') === '1' && tools) {
  tools.style.display = 'block';
  passInput.style.display = 'none';
  if (btnLogin) btnLogin.style.display = 'none';
}

// 📤 Partager
document.getElementById('btn-share').addEventListener('click', () => {
  const url = window.location.origin;
  const data = {
    title: 'Analyse Technique Kevin',
    text: 'Base des rappels constructeurs',
    url: url
  };
  if (navigator.share) {
    navigator.share(data).catch(() => {});
  } else {
    navigator.clipboard.writeText(url);
    alert('✅ Lien copié : ' + url);
  }
});

// 🖨️ Imprimer / PDF
document.getElementById('btn-pdf').addEventListener('click', () => {
  window.print();
});

// 🖼️ Générer les icônes
document.getElementById('btn-icons').addEventListener('click', () => {
  window.open('/generate-icons.html', '_blank');
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
