// ===== APP — Analyse Technique Kevin =====
const selMarque = document.getElementById('marque');
const selModele = document.getElementById('modele');
const selMoteur = document.getElementById('moteur');
const inputRecherche = document.getElementById('recherche');
const btnReset = document.getElementById('btn-reset');
const divResultats = document.getElementById('resultats');

function initMarques() {
  const marques = [...new Set(DB.map(f => f.marque))].sort();
  marques.forEach(m => {
    const o = document.createElement('option');
    o.value = m; o.textContent = m;
    selMarque.appendChild(o);
  });
}

function majModeles() {
  selModele.innerHTML = '<option value="">Tous les modèles</option>';
  selMoteur.innerHTML = '<option value="">Toutes motorisations</option>';
  const m = selMarque.value;
  if (!m) { afficher(); return; }
  [...new Set(DB.filter(f => f.marque === m).map(f => f.modele))].sort().forEach(mod => {
    const o = document.createElement('option');
    o.value = mod; o.textContent = mod;
    selModele.appendChild(o);
  });
  afficher();
}

function majMoteurs() {
  selMoteur.innerHTML = '<option value="">Toutes motorisations</option>';
  const m = selMarque.value, mod = selModele.value;
  if (!mod) { afficher(); return; }
  [...new Set(DB.filter(f => f.marque === m && f.modele === mod).map(f => f.moteur))].forEach(mo => {
    const o = document.createElement('option');
    o.value = mo; o.textContent = mo;
    selMoteur.appendChild(o);
  });
  afficher();
}

function afficher() {
  const m = selMarque.value, mod = selModele.value, mo = selMoteur.value;
  const q = inputRecherche.value.toLowerCase();
  const resultats = DB.filter(f =>
    (!m || f.marque === m) &&
    (!mod || f.modele === mod) &&
    (!mo || f.moteur === mo) &&
    (!q || JSON.stringify(f).toLowerCase().includes(q))
  );
  if (!resultats.length) {
    divResultats.innerHTML = '<div class="fiche"><h3>Aucune fiche trouvée</h3><p>Affinez votre recherche.</p></div>';
    return;
  }
  divResultats.innerHTML = resultats.map(f => `
    <div class="fiche ${/🚨|INCENDIE|PRIORITÉ/i.test(f.titre) ? 'alerte' : ''}">
      <h3>f.marque—{f.marque} —f.marque—{f.modele}</h3>
      <div class="meta">⚙️ f.moteur∣📅{f.moteur} | 📅f.moteur∣📅{f.annee} | DTC: f.dtc∣📌{f.dtc} | 📌f.dtc∣📌{f.source}</div>
      <pre><strong>f.titre</strong>\n\n{f.titre}</strong>\n\nf.titre</strong>\n\n{f.details}</pre>
    </div>`).join('');
}

selMarque.addEventListener('change', majModeles);
selModele.addEventListener('change', majMoteurs);
selMoteur.addEventListener('change', afficher);
inputRecherche.addEventListener('input', afficher);
btnReset.addEventListener('click', () => {
  selMarque.value = ''; selModele.innerHTML = '<option value="">Tous les modèles</option>';
  selMoteur.innerHTML = '<option value="">Toutes motorisations</option>';
  inputRecherche.value = ''; afficher();
});

initMarques();
afficher();
