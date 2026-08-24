// ===== APP — version diagnostic =====
document.addEventListener('DOMContentLoaded', function () {
  var resultats = document.getElementById('resultats');

  // On charge db.js dynamiquement pour capturer l'erreur exacte
  var s = document.createElement('script');
  s.src = 'js/db.js';
  s.onload = function () {
    if (typeof DB === 'undefined' || !Array.isArray(DB) || DB.length === 0) {
      resultats.innerHTML = '<div class="fiche alerte"><h3>❌ DB vide ou invalide</h3><pre>DB = ' + typeof DB + '</pre></div>';
      return;
    }
    demarrerApp();
  };
  s.onerror = function () {
    resultats.innerHTML = '<div class="fiche alerte"><h3>❌ js/db.js impossible à charger</h3><pre>Erreur réseau ou 404</pre></div>';
  };
  document.head.appendChild(s);

  // Capture globale des erreurs JS
  window.onerror = function (msg, src, ligne) {
    var r = document.getElementById('resultats');
    if (r) r.innerHTML = '<div class="fiche alerte"><h3>🚨 Erreur JS détectée</h3><pre>' +
      msg + '\nFichier : ' + src + '\nLigne : ' + ligne + '</pre></div>';
  };

  function demarrerApp() {
    var selMarque = document.getElementById('marque');
    var selModele = document.getElementById('modele');
    var selMoteur = document.getElementById('moteur');
    var inputRech = document.getElementById('recherche');
    var btnReset  = document.getElementById('btn-reset');

    [...new Set(DB.map(f => f.marque))].sort().forEach(function (m) {
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
        DB.filter(f => f.marque === selMarque.value && f.modele === selModele.value).forEach(function (f) {
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
  }
});
