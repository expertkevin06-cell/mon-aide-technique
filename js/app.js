// ===== Recherche et affichage =====
const searchInput = document.getElementById('search');
const resultsDiv = document.getElementById('results');
const emptyState = document.getElementById('empty-state');

function getData() {
  const custom = localStorage.getItem('at-custom-data');
  return custom ? JSON.parse(custom) : DB;
}

function render(list) {
  resultsDiv.innerHTML = '';
  emptyState.style.display = list.length ? 'none' : 'block';
  list.forEach(item => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML =
      '<div class="meta">' + item.marque + ' • ' + item.modele + ' (' + item.annee + ')</div>' +
      '<h3>' + item.titre + '</h3>' +
      '<p>' + item.details + '</p>';
    resultsDiv.appendChild(card);
  });
}

searchInput.addEventListener('input', () => {
  const q = searchInput.value.toLowerCase().trim();
  if (!q) { render([]); return; }
  const data = getData();
  const found = data.filter(item =>
    (item.marque + ' ' + item.modele + ' ' + item.annee + ' ' + item.titre + ' ' + item.details)
    .toLowerCase().includes(q)
  );
  render(found);
});

render([]);
