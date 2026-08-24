// ===== APP — chirurgien d'erreur =====
document.addEventListener('DOMContentLoaded', function () {
  var resultats = document.getElementById('resultats');

  function erreur(titre, detail) {
    resultats.innerHTML = '<div class="fiche alerte"><h3>🚨 ' + titre + '</h3><pre style="white-space:pre-wrap">' + detail + '</pre></div>';
  }

  // Capture TOUTE erreur, même avant le chargement
  window.onerror = function (msg, src, ligne) {
    erreur('Erreur JS', msg + '\nLigne : ' + ligne);
  };

  fetch('js/db.js')
    .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
    .then(function (code) {
      try {
        eval(code); // exécution surveillée
      } catch (e) {
        // On cherche la ligne fautive
        var lignes = code.split('\n');
        var num = (e.stack || '').match(/<anonymous>:(\d+)/);
        var n = num ? parseInt(num[1]) - 1 : -1;
        var contexte = n >= 0 ? '\n\n--- Ligne ' + (n) + ' ---\n' + lignes.slice(Math.max(0,n-2), n+2).join('\n') : '';
        erreur('❌ Erreur de syntaxe dans db.js', e.message + contexte);
        return;
      }
      if (typeof DB === 'undefined' || !Array.isArray(DB)) { erreur('DB invalide', 'typeof DB = ' + typeof DB); return; }
      demarrerApp();
    })
    .catch(function (e) { erreur('❌ Chargement impossible', e.message); });

  function demarrerApp() {
    var selMarque = document.getElementById('marque');
    var selModele = document.getElementById('modele');
    var selMoteur = document.getElementById('moteur');
    var inputRech = document.getElementById('recherche');
    var btnReset  = document.getElementById('btn-reset');

    [...new Set(DB.map(f => f.marque))].sort().forEach(function (m) {
      var o = document.createElement('option'); o.value = m; o.textContent = m; selMarque.appendChild(o);
    });

    function majModeles() {
      selModele.innerHTML = '<option value="">Tous les modèles</option>';
      selMoteur.innerHTML = '<option value="">Toutes motorisations</option>';
      if (selMarque.value) [...new Set(DB.filter(f => f.marque === selMarque.value).map(f => f.modele))].sort().forEach(function (mod) {
        var o = document.createElement('option'); o.value = mod; o.textContent = mod; selModele.appendChild(o);
      });
      afficher();
    }
    function majMoteurs() {
      selMoteur.innerHTML = '<option value="">Toutes motorisations</option>';
      if (selModele.value) DB.filter(f => f.marque === selMarque.value && f.modele === selModele.value).forEach(function (f) {
        if (![...selMoteur.options].some(o => o.value === f.moteur)) {
          var o = document.createElement('option'); o.value = f.moteur; o.textContent = f.moteur; selMoteur.appendChild(o);
        }
      });
      afficher();
    }
    function afficher() {
      var q = (inputRech.value || '').toLowerCase();
      var liste = DB.filter(f =>
        (!selMarque.value || f.marque === selMarque.value) &&
        (!selModele.value || f.modele === selModele.value) &&
        (!selMoteur.value || f.moteur === selMoteur.value) &&
        (!q || JSON.stringify(f).toLowerCase().includes(q)));
      resultats.innerHTML = liste.length ? liste.map(f =>
        '<div class="fiche' + (/🚨|INCENDIE|PRIORITÉ/i.test(f.titre) ? ' alerte' : '') + '">' +
        '<h3>' + f.marque + ' — ' + f.modele + '</h3>' +
        '<div class="meta">⚙️ ' + f.moteur + ' | 📅 ' + f.annee + ' | DTC: ' + f.dtc + '</div>' +
        '<pre><strong>' + f.titre + '</strong>\n\n' + f.details + '</pre></div>').join('')
        : '<div class="fiche"><h3>Aucune fiche trouvée</h3></div>';
    }

    selMarque.addEventListener('change', majModeles);
    selModele.addEventListener('change', majMoteurs);
    selMoteur.addEventListener('change', afficher);
    inputRech.addEventListener('input', afficher);
    btnReset.addEventListener('click', function () {
      selMarque.value = '';
      selModele.innerHTML = '<option value="">Tous les modèles</option>';
      selMoteur.innerHTML = '<option value="">Toutes motorisations</option>';
      inputRech.value = ''; afficher();
    });
    afficher();
  }
});
