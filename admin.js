const ADMIN_PASS = 'Kevin.83600';

function adminLogin() {
  if (document.getElementById('admin-pass').value === ADMIN_PASS) {
    document.getElementById('admin-tools').classList.remove('hidden');
    loadRequests();
  } else alert('Mot de passe incorrect');
}

function shareApp() {
  const url = location.href;
  if (navigator.share) navigator.share({ title: 'Analyse technique by Kevin', url });
  else { navigator.clipboard.writeText(url); alert('Lien copié !'); }
}

function importData() {
  const input = document.getElementById('file-import');
  input.classList.remove('hidden');
  input.onchange = e => {
    const reader = new FileReader();
    reader.onload = ev => addRecalls(JSON.parse(ev.target.result)).then(() => alert('Import terminé !'));
    reader.readAsText(e.target.files[0]);
  };
}

function loadRequests() {
  const ul = document.getElementById('access-requests');
  ul.innerHTML = '';
  db.transaction('requests').objectStore('requests').openCursor().onsuccess = e => {
    const cur = e.target.result;
    if (!cur) return;
    const req = cur.value;
    const li = document.createElement('li');
    li.innerHTML = `req.name—<b>{req.name} — <b>req.name—<b>{req.status}</b>
      <button onclick="decide(${req.id},'accepted')">✅</button>
      <button onclick="decide(${req.id},'refused')">❌</button>`;
    ul.appendChild(li);
    cur.continue();
  };
}

function decide(id, status) {
  const store = db.transaction('requests', 'readwrite').objectStore('requests');
  store.get(id).onsuccess = e => {
    const r = e.target.result; r.status = status; store.put(r); loadRequests();
  };
}
