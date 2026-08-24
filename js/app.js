const searchInput = document.getElementById('search');
const resultsDiv = document.getElementById('results');
const emptyState = document.getElementById('empty-state');
const selMarque = document.getElementById('filter-marque');
const selModele = document.getElementById('filter-modele');
const selMoteur = document.getElementById('filter-moteur');
const btnReset = document.getElementById('btn-reset');

function getData() {
  const custom = localStorage.getItem('at-custom-data');
  return custom ? JSON.parse(custom) : DB;
}

function unique(arr) { return [...new Set(arr)].sort(); }

// Remplir les filtres
function initFilters() {
  const data = getData();
  selMarque.innerHTML = '<option value="">Toutes les marques</option>' +
    unique(data.map(d => d.marque)).map(m => '<option>' + m + '</option>').join('');
  fillModeles();
  fillMoteurs();
}

function fillModeles() {
  const data = getData();
  const marque = selMarque.value;
  const list = marque ? data.filter(d => d.marque === marque) : data;
  selModele.innerHTML = '<option value="">Tous les modèles</option>' +
    unique(list.map(d => d.modele)).map(m => '<option>' + m + '</option>').join('');
  selModele.disabled = !marque;
  fillMoteurs();
}

function fillMoteurs() {
  const data = getData();
  const marque = selMarque.value;
  const modele = selModele.value;
  let list = data;
  if (marque) list = list.filter(d => d.marque === marque);
  if (modele) list = list.filter(d => d.modele === modele);
  selMoteur.innerHTML = '<option value="">Toutes les motorisations</option>' +
    unique(list.map(d => d.moteur)).map(m => '<option>' + m + '</option>').join('');
  selMoteur.disabled = !(marque || modele);
}

function currentResults() {
  let list = getData();
  if (selMarque.value) list = list.filter(d => d.marque === selMarque.value);
  if (selModele.value) list = list.filter(d => d.modele === selModele.value);
  if (selMoteur.value) list = list.filter(d => d.moteur === selMoteur.value);
  const q = searchInput.value.toLowerCase().trim();
  if (q) {
    list = list.filter(d =>
      (d.marque + ' ' + d.modele + ' ' + d.moteur + ' ' + d.annee + ' ' + d.titre + ' ' + d.details)
      .toLowerCase().includes(q));
  }
  return list;
}

function render(list) {
  resultsDiv.innerHTML = '';
  emptyState.style.display = list.length ? 'none' : 'block';
  list.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML =
      '<div class="meta">' + item.marque + ' • ' + item.modele + ' • ' + item.moteur + ' (' + item.annee + ')</div>' +
      '<h3>' + item.titre + '</h3>' +
      '<p>' + item.details + '</p>';
    resultsDiv.appendChild(card);
  });
}

function refresh() {
  fillModeles();
  render(currentResults());
}

selMarque.addEventListener('change', () => { fillModeles(); render(currentResults()); });
selModele.addEventListener('change', () => { fillMoteurs(); render(currentResults()); });
selMoteur.addEventListener('change', () => render(currentResults()));
btnReset.addEventListener('click', () => {
  selMarque.value = ''; selModele.value = ''; selMoteur.value = '';
  searchInput.value = '';
  refresh();
});
searchInput.addEventListener('input', () => render(currentResults()));

initFilters();
render(getData());
