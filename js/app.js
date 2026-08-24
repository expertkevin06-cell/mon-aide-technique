// ===== APP — Analyse Technique Kevin (version robuste) =====
document.addEventListener('DOMContentLoaded', function () {

  // Vérification de la base
  if (typeof DB === 'undefined' || !Array.isArray(DB) || DB.length === 0) {
    document.getElementById('resultats').innerHTML =
      '<div class="fiche alerte"><h3>❌ Base de données non chargée</h3><p>Vérifiez js/db.js et l\'ordre des scripts.</p></div>';
    return;
  }

  var selMarque  = document.getElementById('marque');
  var selModele  = document.getElementById('modele');
  var selMoteur  = document.getElementById('moteur');
  var inputRech  = document.getElementById('recherche');
  var btnReset   = document.getElementById('btn-reset');
  var resultats  = document.getElementById('resultats');

  // Remplir les marques
  var marques = [...new Set(DB.map(f => f.marque))].sort();
  marques.forEach(function (m) {
    var o = document.createElement('option');
    o.value = m; o.textContent = m;
    selMarque.appendChild(o);
  });

  function majModeles() {
    selModele.innerHTML = '<option value="">Tous les modèles</option>';
    selMoteur.innerHTML = '<option value="">Toutes motorisations</option>';
    if (selMarque.value) {
      [...new Set(DB.filter(f => f.marque === selMarque.value).map(f => f.modele))].sort().forEach(function (mod) {
        var o = document.createElement('option');
        o.value = mod; o.textContent = mod;
        selModele.appendChild(o);
      });
    }
    afficher();
  }

  function majMoteurs() {
    selMoteur.innerHTML = '<option value="">Toutes motorisations</option>';
    if (selModele.value) {
      DB.filter(f => f.marque === selMarque.value && f.modele === selModele.value)
       .forEach(function (f) {
          if (![...selMoteur.options].some(o => o.value === f.moteur)) {
            var o = document.createElement('option');
            o.value = f.moteur; o.textContent = f.moteur;
            selMoteur.appendChild(o);
          }
        });
    }
    afficher();
  }

  function afficher() {
    var q = (inputRech.value || '').toLowerCase();
    var liste = DB.filter(f =>
      (!selMarque.value || f.marque === selMarque.value) &&
      (!selModele.value || f.modele === selModele.value) &&
      (!selMoteur.value || f.moteur === selMoteur.value) &&
      (!q || JSON.stringify(f).toLowerCase().includes(q))
    );
    if (!liste.length) {
      resultats.innerHTML = '<div class="fiche"><h3>Aucune fiche trouvée</h3></div>';
      return;
    }
    resultats.innerHTML = liste.map(f =>
      '<div class="fiche' + (/🚨|INCENDIE|PRIORITÉ/i.test(f.titre) ? ' alerte' : '') + '">' +
        '<h3>' + f.marque + ' — ' + f.modele + '</h3>' +
        '<div class="meta">⚙️ ' + f.moteur + ' | 📅 ' + f.annee + ' | DTC: ' + f.dtc + ' | 📌 ' + f.source + '</div>' +
        '<pre><strong>' + f.titre + '</strong>\n\n' + f.details + '</pre>' +
      '</div>').join('');
  }

  selMarque.addEventListener('change', majModeles);
  selModele.addEventListener('change', majMoteurs);
  selMoteur.addEventListener('change', afficher);
  inputRech.addEventListener('input', afficher);
  btnReset.addEventListener('click', function () {
    selMarque.value = '';
    selModele.innerHTML = '<option value="">Tous les modèles</option>';
    selMoteur.innerHTML = '<option value="">Toutes motorisations</option>';
    inputRech.value = '';
    afficher();
  });

  afficher();
});
