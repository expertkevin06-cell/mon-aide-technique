let currentFiche = null;

document.addEventListener('DOMContentLoaded', async () => {
  await openDB();
  navigator.serviceWorker.register('sw.js');
  await loadBaseData();

  document.getElementById('q').addEventListener('input', runSearch);
  document.getElementById('filter-energy').addEventListener('change', runSearch);
  document.getElementById('filter-system').addEventListener('change', runSearch);
  runSearch();
});

async function loadBaseData() {
  if (await countRecalls() > 0) return;
  try {
    const resp = await fetch('data/recalls.json');
    const list = await resp.json();
    await addRecalls(list);
    console.log(`${list.length} fiches chargées`);
  } catch (e) { console.log('Base pas encore générée'); }
}

async function runSearch() {
  const results = await searchRecalls({
    q: document.getElementById('q').value,
    energy: document.getElementById('filter-energy').value,
    system: document.getElementById('filter-system').value
  });
  render(results.slice(0, 50));
}

function render(list) {
  document.getElementById('results').innerHTML =
    `<p style="padding:8px 16px">${list.length} fiche(s)</p>` + list.map(r => `
    <article class="fiche" data-id="${r.id}">
      <h3>r.brand{r.brand}r.brand{r.model || ''} (${r.year || ''})</h3>
      <p><b>Système :</b> r.system∣<b>Motorisation:</b>{r.system} | <b>Motorisation :</b>r.system∣<b>Motorisation:</b>{r.energy}</p>
      <p><b>Campagne :</b> ${r.campaignNumber}</p>
      <p>${(r.description || '').substring(0, 150)}...</p>
      {r.dtcCode ? `<p class="dtc">Code valise :{r.dtcCode}</p>` : ''}
      <button onclick='showFiche(${JSON.stringify(JSON.stringify(r))})'>Voir / 🤖 Enrichir</button>
    </article>`).join('');
}

async function showFiche(json) {
  currentFiche = JSON.parse(json);
  if (!currentFiche.aiDetails) currentFiche = await enrichFiche(currentFiche);
  window.print(); // impression PDF de la fiche enrichie
}

navigator.serviceWorker.addEventListener('controllerchange', () => {
  alert('🔄 Nouvelle base disponible — redémarrez l\'app');
});
