const DB_NAME = 'atkevin', STORE = 'recalls';
let db;

function openDB() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB_NAME, 1);
    r.onupgradeneeded = () => {
      const d = r.result;
      if (!d.objectStoreNames.contains(STORE))
        d.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
      if (!d.objectStoreNames.contains('requests'))
        d.createObjectStore('requests', { keyPath: 'id', autoIncrement: true });
    };
    r.onsuccess = () => { db = r.result; res(db); };
    r.onerror = rej;
  });
}

async function addRecalls(list) {
  return new Promise(res => {
    const tx = db.transaction(STORE, 'readwrite');
    list.forEach(r => tx.objectStore(STORE).put(r));
    tx.oncomplete = res;
  });
}

function countRecalls() {
  return new Promise(res =>
    db.transaction(STORE).objectStore(STORE).count().onsuccess = e => res(e.target.result));
}

async function searchRecalls({ q = '', energy = '', system = '' }) {
  return new Promise(res => {
    const out = [];
    db.transaction(STORE).objectStore(STORE).openCursor().onsuccess = e => {
      const cur = e.target.result;
      if (!cur) return res(out);
      const r = cur.value;
      const ql = q.toLowerCase();
      const matchQ = !q || [r.brand, r.model, r.system, r.campaignNumber,
        r.description, r.dtcCode].join(' ').toLowerCase().includes(ql);
      if (matchQ && (!energy || r.energy === energy) && (!system || r.system === system))
        out.push(r);
      cur.continue();
    };
  });
}
