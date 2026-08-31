"use strict";
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const isAdmin = () => Session.role() === "admin";

const App = {
  state: { view: "search", page: 0, list: null, filterLetter: "", filterBrand: "", vehBrand: "" },

  async start(){
    await Auth.init();
    window.addEventListener("hashchange", () => App.route());
    App.route();
  },

  route(){
    if (!Session.get()) return App.renderLogin();
    const h = location.hash.replace(/^#\//,"") || "search";
    const [view, arg] = h.split("/");
    if (view === "admin" && !isAdmin()){ location.hash = "#/search"; return; }
    App.state.view = view;
    if (view === "fiche" && arg) return App.renderShell(App.renderFiche(decodeURIComponent(arg)));
    const V = {
      search: App.renderSearch, codes: App.renderCodes, veh: App.renderVeh, admin: App.renderAdmin
    };
    App.renderShell((V[view] || App.renderSearch)());
  },

  /* ---------- structure ---------- */
  renderShell(body){
    const role = Session.role();
    $("#app").innerHTML = `
    <div class="topbar">
      <div class="logo">⚙️ DTC<span>Diag</span> Pro</div>
      <span class="badge ${role==='admin'?'b-admin':'b-tier'}">${role==='admin'?'ADMIN':'ACCÈS TIERS'}</span>
      <span class="muted">${esc(Session.user())}</span>
      <div class="spacer"></div>
      <nav class="tabs">
        <button data-nav="search" class="${App.state.view==='search'?'active':''}">🔍 Recherche</button>
        <button data-nav="codes" class="${App.state.view==='codes'?'active':''}">📟 Codes DTC</button>
        <button data-nav="veh" class="${App.state.view==='veh'?'active':''}">🚗 Véhicules</button>
        ${isAdmin()?'<button data-nav="admin" class="'+(App.state.view==='admin'?'active':'')+'">🛠️ Administration</button>':''}
      </nav>
      <button class="btn sec small" id="logout">Déconnexion</button>
    </div>
    ${role==='tier'?'<div style="background:#102a3a;color:#5ec1ff;text-align:center;padding:.35rem;font-size:.8rem">Mode accès tiers — consultation seule, sans export ni modification</div>':''}
    <main>${body}</main>
    <div class="footer">DTC Diag Pro v${CONFIG.VERSION} — 21 000 fiches DTC — toutes marques, tous modèles, toutes motorisations 2017 → 2026</div>`;
    $$("[data-nav]").forEach(b => b.onclick = () => { location.hash = "#/" + b.dataset.nav; });
    $("#logout").onclick = () => { Auth.logout(); location.hash = ""; App.renderLogin(); };
    App.bindView();
  },
  $$: null,

  /* ---------- login ---------- */
  renderLogin(){
    $("#app").innerHTML = `
    <div class="login-wrap"><div class="card login-box">
      <div class="logo" style="font-size:1.4rem;margin-bottom:.3rem">⚙️ DTC<span>Diag</span> Pro</div>
      <p class="muted" style="margin-bottom:1rem">21 000 fiches diagnostic OBD • 2017-2026</p>
      <label>Identifiant (administrateur)</label>
      <input id="l-user" autocomplete="username" value="">
      <label>Mot de passe</label>
      <input id="l-pass" type="password" autocomplete="current-password">
      <div style="margin-top:.8rem"><button class="btn" id="l-admin" style="width:100%">Connexion administrateur</button></div>
      <div class="err-msg" id="l-err"></div>
      <hr style="border-color:var(--bd);margin:1rem 0">
      <label>Code d'accès tiers (lecture seule)</label>
      <input id="l-code" placeholder="TIER-XXXXXX" style="text-transform:uppercase">
      <div style="margin-top:.8rem"><button class="btn sec" id="l-tier" style="width:100%">Accéder en mode tiers</button></div>
      <div class="err-msg" id="l-err2"></div>
    </div></div>`;
    $("#l-admin").onclick = async () => {
      if (await Auth.loginAdmin($("#l-user").value, $("#l-pass").value)) App.route();
      else $("#l-err").textContent = "Identifiants administrateur incorrects.";
    };
    $("#l-tier").onclick = () => {
      if (Auth.loginTier($("#l-code").value)) App.route();
      else $("#l-err2").textContent = "Code tiers invalide, inactif ou expiré.";
    };
  },

  /* ---------- recherche ---------- */
  renderSearch(){
    return `
    <div class="card"><h1>Recherche dans 21 000 fiches</h1>
      <p class="muted">Code DTC exact (ex : P0300, U0121, B1001…) ou texte libre (ex : injecteur, catalyseur, Renault).</p>
      <div class="row" style="margin-top:.7rem">
        <input id="q" placeholder="P0420, vanne EGR, Tesla Model 3…" style="flex:1;min-width:200px">
        <button class="btn" id="go">Rechercher</button>
      </div>
    </div>
    <div class="grid g4">
      <div class="card stat"><b>21 000</b>fiches DTC</div>
      <div class="card stat"><b>${BRANDS.length}</b>marques couvertes</div>
      <div class="card stat"><b>${BRANDS.reduce((a,b)=>a+b[1].length,0)}</b>modèles</div>
      <div class="card stat"><b>2017-2026</b>millésimes</div>
    </div>
    <div id="results"></div>`;
  },

  bindSearch(){
    const go = () => {
      const q = $("#q").value;
      let items;
      if (/^[pbcu][0-3]/i.test(q.trim())) items = DT.findByCode(q).map(e => e.i);
      else {
        items = [];
        const needle = q.trim().toLowerCase();
        if (needle){
          // marques/modèles/motorisations
          const vehHits = [];
          BRANDS.forEach((b, bi) => {
            const hitB = b[0].toLowerCase().includes(needle) ||
              b[1].some(m => m.toLowerCase().includes(needle)) ||
              b[2].some(e => e.toLowerCase().includes(needle));
            if (hitB) vehHits.push(bi);
          });
          for (let i = 0; i < CONFIG.TOTAL_FICHES && items.length < 300; i++){
            const f = DT.ficheAt(i);
            const brandIdx = i >= 16000 ? (i-16000) % BRANDS.length : -1;
            if (f.title.toLowerCase().includes(needle) ||
                (brandIdx >= 0 && vehHits.includes(brandIdx)) ||
                (f.brands.join(" ").toLowerCase().includes(needle) && vehHits.length === 0))
              items.push(i);
          }
        }
      }
      App.state.list = items; App.state.page = 0;
      $("#results").innerHTML = App.listHTML(items.slice(0, 500), "résultat(s) — affichage des 500 premiers");
      App.bindRows($("#results"));
    };
    $("#go").onclick = go;
    $("#q").onkeydown = e => { if (e.key === "Enter") go(); };
  },

  /* ---------- navigateur de codes ---------- */
  renderCodes(){
    const letters = ["P","B","C","U"];
    return `
    <div class="card"><h1>Tous les codes DTC</h1>
      <div class="row" style="margin-top:.5rem">
        <select id="f-letter" style="max-width:160px"><option value="">Tous systèmes</option>
          ${letters.map(l=>`<option ${App.state.filterLetter===l?'selected':''}>${l}</option>`).join("")}</select>
        <select id="f-brand" style="max-width:200px"><option value="">Toutes marques (générique)</option>
          ${BRANDS.map(b=>`<option ${App.state.filterBrand===b[0]?'selected':''}>${b[0]}</option>`).join("")}</select>
        <button class="btn" id="f-go">Filtrer</button>
        <span class="muted">Pagination de ${CONFIG.PAGE_SIZE} fiches</span>
      </div>
    </div>
    <div id="results"></div><div id="pager" class="pager"></div>`;
  },

  bindCodes(){
    const show = () => {
      const L = $("#f-letter").value, B = $("#f-brand").value;
      App.state.filterLetter = L; App.state.filterBrand = B;
      const items = [];
      if (B){ // fiches constructeur de cette marque
        for (let j = 0; j < 5000; j++) if (BRANDS[j % BRANDS.length][0] === B) items.push(16000 + j);
      } else {
        const li = L ? ["P","B","C","U"].indexOf(L) : -1;
        const start = li >= 0 ? li*4000 : 0;
        const end = li >= 0 ? start + 4000 : 16000;
        for (let i = start; i < end; i++) items.push(i);
      }
      App.state.list = items; App.state.page = 0;
      App.renderPage();
    };
    $("#f-go").onclick = show;
    show();
  },

  renderPage(){
    const items = App.state.list || [];
    const n = items.length, ps = CONFIG.PAGE_SIZE;
    const pages = Math.max(1, Math.ceil(n/ps));
    App.state.page = Math.min(Math.max(0, App.state.page), pages-1);
    const slice = items.slice(App.state.page*ps, App.state.page*ps + ps);
    $("#results").innerHTML = App.listHTML(slice, n + " fiche(s)");
    $("#pager").innerHTML = pages > 1 ? `
      <button class="btn sec small" id="p-prev" ${App.state.page===0?'disabled':''}>◀ Préc.</button>
      <span class="muted">Page ${App.state.page+1} / ${pages}</span>
      <button class="btn sec small" id="p-next" ${App.state.page>=pages-1?'disabled':''}>Suiv. ▶</button>` : "";
    const pv = $("#p-prev"), nx = $("#p-next");
    if (pv) pv.onclick = () => { App.state.page--; App.renderPage(); };
    if (nx) nx.onclick = () => { App.state.page++; App.renderPage(); };
    App.bindRows($("#results"));
  },

  listHTML(idxs, label){
    if (!idxs.length) return `<div class="card muted">Aucun résultat.</div>`;
    return `<div class="card"><div class="muted" style="margin-bottom:.5rem">${esc(label)}</div>
    <table><thead><tr><th>Code</th><th>Description</th><th>Sév.</th><th>Marques</th></tr></thead><tbody>
    ${idxs.map(i => {
      const f = DT.ficheAt(i);
      if (Store.isDeleted(f.key)) return "";
      return `<tr class="frow" data-key="${esc(f.key)}" style="cursor:pointer">
        <td class="code">${esc(f.code)}</td>
        <td>${esc(f.title.slice(0,90))}${f.title.length>90?'…':''}</td>
        <td><span class="sev s${f.sev}"></span>${f.sevLabel}</td>
        <td class="muted">${esc(f.brands.slice(0,2).join(", "))}${f.brands.length>2?'…':''}</td></tr>`;
    }).join("")}
    </tbody></table></div>`;
  },

  bindRows(container){
    container.querySelectorAll(".frow").forEach(tr =>
      tr.onclick = () => { location.hash = "#/fiche/" + encodeURIComponent(tr.dataset.key); });
  },

  /* ---------- fiche détail ---------- */
  renderFiche(key){
    let f = resolveFiche(key);
    if (!f) return `<div class="card">Fiche supprimée ou introuvable. <a href="#/codes">Retour</a></div>`;
    const ov = Store.getOverride(key), custom = Store.customs().findIndex(c => c.key === key);
    return `
    <div class="card">
      <div class="row"><span class="code" style="font-size:1.3rem">${esc(f.code)}</span>
        ${f.brand?`<span class="tag b">${esc(f.brand)}</span>`:`<span class="tag">${f.generic?'Générique OBD-II':'Spécifique constructeur'}</span>`}
        <span class="tag"><span class="sev s${f.sev}"></span>${esc(f.sevLabel)}</span>
        <span class="tag">Millésimes ${esc(f.years)}</span>
        <div class="spacer"></div>
        ${isAdmin()?`<button class="btn small" id="edit">✏️ Modifier</button><button class="btn danger small" id="del">🗑️ Supprimer</button>`:''}
      </div>
      <h2 style="margin-top:.6rem">${esc(f.title)}</h2>
      <p style="margin-top:.4rem">${esc(f.desc)}</p>
      ${ov||custom>=0?'<div class="ok-msg">✓ Fiche modifiée/personnalisée par l\'administrateur</div>':''}
    </div>
    <div class="grid g2">
      <div class="card"><h3>🩺 Symptômes</h3><ul style="padding-left:1.2rem;margin-top:.4rem">${f.symptoms.map(s=>`<li>${esc(s)}</li>`).join("")}</ul></div>
      <div class="card"><h3>🔧 Causes probables</h3><ul style="padding-left:1.2rem;margin-top:.4rem">${f.causes.map(s=>`<li>${esc(s)}</li>`).join("")}</ul></div>
    </div>
    <div class="card"><h3>✅ Solutions / contrôles</h3><ol style="padding-left:1.4rem;margin-top:.4rem">${f.solutions.map(s=>`<li>${esc(s)}</li>`).join("")}</ol></div>
    <div class="card"><h3>🚗 Véhicules concernés (2017-2026)</h3>
      <div style="margin-top:.4rem">${f.brands.map(b=>`<span class="tag b">${esc(b)}</span>`).join("")}</div>
      <div style="margin-top:.4rem">${f.motors.map(m=>`<span class="tag">⚡ ${esc(m)}</span>`).join("")}</div>
    </div>`;
  },

  bindFiche(key){
    if (!isAdmin()) return;
    const del = $("#del"), ed = $("#edit");
    if (del) del.onclick = () => {
      if (confirm("Supprimer cette fiche ?")){
        Store.setDeleted(key, true);
        const ci = Store.customs().findIndex(c => c.key === key);
        if (ci >= 0) Store.removeCustom(ci);
        location.hash = "#/codes";
      }
    };
    if (ed) ed.onclick = () => App.openEditor(resolveFiche(key));
  },

  openEditor(f){
    const isNew = !f;
    if (isNew) f = { key:"", code:"", brand:"", title:"", desc:"", sev:2, sevLabel:"Modérée", symptoms:[], causes:[], solutions:[], brands:["Toutes marques"], motors:["Essence"], years:"2017-2026" };
    const bg = document.createElement("div");
    bg.className = "modal-bg";
    bg.innerHTML = `<div class="modal"><h2>${isNew?"➕ Nouvelle fiche":"✏️ Modifier la fiche "+esc(f.code)}</h2>
      <div class="grid g2">
        <div><label>Code DTC</label><input id="e-code" value="${esc(f.code)}" ${isNew?"":"disabled"} placeholder="P0300"></div>
        <div><label>Marque (optionnel)</label><input id="e-brand" value="${esc(f.brand||"")}" ${isNew?"":"disabled"} placeholder="laisser vide = générique"></div>
      </div>
      <label>Titre</label><input id="e-title" value="${esc(f.title)}">
      <label>Description</label><textarea id="e-desc" rows="3">${esc(f.desc)}</textarea>
      <label>Sévérité</label><select id="e-sev"><option value="1" ${f.sev==1?"selected":""}>1 — Mineure</option><option value="2" ${f.sev==2?"selected":""}>2 — Modérée</option><option value="3" ${f.sev==3?"selected":""}>3 — Sérieuse</option><option value="4" ${f.sev==4?"selected":""}>4 — Critique</option></select>
      <label>Symptômes (un par ligne)</label><textarea id="e-sym" rows="3">${esc(f.symptoms.join("\n"))}</textarea>
      <label>Causes (une par ligne)</label><textarea id="e-cause" rows="3">${esc(f.causes.join("\n"))}</textarea>
      <label>Solutions (une par ligne)</label><textarea id="e-sol" rows="3">${esc(f.solutions.join("\n"))}</textarea>
      <div class="row" style="margin-top:1rem;justify-content:flex-end">
        <button class="btn sec" id="e-cancel">Annuler</button>
        <button class="btn" id="e-save">Enregistrer</button>
      </div><div class="err-msg" id="e-err"></div></div>`;
    document.body.appendChild(bg);
    bg.querySelector("#e-cancel").onclick = () => bg.remove();
    bg.querySelector("#e-save").onclick = () => {
      const lines = t => t.split("\n").map(x=>x.trim()).filter(Boolean);
      const nf = {
        code: bg.querySelector("#e-code").value.trim().toUpperCase(),
        brand: bg.querySelector("#e-brand").value.trim(),
        title: bg.querySelector("#e-title").value.trim(),
        desc: bg.querySelector("#e-desc").value.trim(),
        sev: +bg.querySelector("#e-sev").value,
        symptoms: lines(bg.querySelector("#e-sym").value),
        causes: lines(bg.querySelector("#e-cause").value),
        solutions: lines(bg.querySelector("#e-sol").value)
      };
      if (!nf.code || !nf.title) return bg.querySelector("#e-err").textContent = "Code et titre obligatoires.";
      nf.sevLabel = ["Mineure","Modérée","Sérieuse","Critique"][nf.sev-1];
      nf.key = nf.brand ? nf.code + "@" + nf.brand : nf.code;
      nf.brands = nf.brand ? [nf.brand] : ["Toutes marques"];
      nf.motors = f.motors || ["Essence"];
      nf.years = "2017-2026";
      if (isNew){
        if (!/^[PBCU][0-3][0-9A-F]{2}[0-9A-F]$/.test(nf.code)) return bg.querySelector("#e-err").textContent = "Format de code invalide (ex : P0300, P1A2B).";
        Store.addCustom(nf);
      } else {
        const ci = Store.customs().findIndex(c => c.key === f.key);
        if (ci >= 0) Store.updateCustom(ci, nf); else Store.setOverride(nf.key, nf);
      }
      bg.remove(); App.route();
    };
  },

  /* ---------- véhicules ---------- */
  renderVeh(){
    if (App.state.vehBrand){
      const b = BRANDS.find(x => x[0] === App.state.vehBrand);
      return `<div class="card"><div class="row"><h1>🚗 ${esc(b[0])}</h1><div class="spacer"></div>
        <button class="btn sec small" id="v-back">← Toutes les marques</button></div>
        <p class="muted">${b[1].length} modèles • ${b[2].length} motorisations • millésimes 2017-2026</p></div>
      <div class="grid g2">
        <div class="card"><h3>Modèles (année de lancement)</h3>
          ${b[1].map(m=>{ const [n,y]=m.split("|"); return `<div class="row" style="justify-content:space-between;padding:.3rem 0;border-bottom:1px solid var(--bd)"><span>${esc(n)}</span><span class="muted">${y||2017} → 2026</span></div>`; }).join("")}
        </div>
        <div class="card"><h3>Motorisations</h3>
          ${b[2].map(e=>`<span class="tag" style="margin:.15rem">${esc(e)}</span>`).join("")}
          <h3 style="margin-top:1rem">Fiches constructeur ${esc(b[0])}</h3>
          <button class="btn small" id="v-codes">Voir les codes spécifiques (${Math.ceil(5000/BRANDS.length)})</button>
        </div>
      </div>`;
    }
    return `<div class="card"><h1>Toutes les marques 2017-2026</h1>
      <p class="muted">${BRANDS.length} marques, ${BRANDS.reduce((a,b)=>a+b[1].length,0)} modèles, toutes motorisations (essence, diesel, hybride, électrique, GPL).</p></div>
      <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(210px,1fr))">
      ${BRANDS.map(b=>`<div class="card" style="cursor:pointer;margin:0" data-brand="${esc(b[0])}">
        <h3>${esc(b[0])}</h3><div class="muted">${b[1].length} modèles • ${b[2].length} motorisations</div></div>`).join("")}
      </div>`;
  },

  bindVeh(){
    $$("[data-brand]").forEach(c => c.onclick = () => { App.state.vehBrand = c.dataset.brand; App.route(); });
    const back = $("#v-back"); if (back) back.onclick = () => { App.state.vehBrand = ""; App.route(); };
    const vc = $("#v-codes"); if (vc) vc.onclick = () => {
      location.hash = "#/codes";
      setTimeout(() => { const s = $("#f-brand"); if (s){ s.value = App.state.vehBrand; $("#f-go").click(); } }, 60);
    };
  },

  /* ---------- administration ---------- */
  renderAdmin(){
    return `
    <div class="row" style="margin-bottom:1rem">
      <button class="btn small" id="a-new">➕ Nouvelle fiche</button>
      <button class="btn sec small" id="a-export">⬇️ Export JSON</button>
      <label class="btn sec small" style="cursor:pointer">⬆️ Import<input type="file" id="a-import" accept=".json" hidden></label>
      <div class="spacer"></div>
      <select id="a-tab" style="max-width:220px">
        <option value="customs">Fiches personnalisées</option>
        <option value="tiers">Accès tiers</option>
        <option value="audit">Journal d'audit</option>
        <option value="secu">Sécurité</option>
      </select>
    </div><div id="a-body"></div>`;
  },

  adminTab(t){
    const B = $("#a-body");
    if (t === "customs"){
      const customs = Store.customs();
      const ovs = Object.keys(JSON.parse(localStorage.getItem(CONFIG.K.overrides) || "{}"));
      B.innerHTML = `<div class="card"><h3>Fiches personnalisées (${customs.length})</h3>
        ${customs.length?`<table><thead><tr><th>Code</th><th>Titre</th><th></th></tr></thead><tbody>
        ${customs.map((c,i)=>`<tr><td class="code">${esc(c.code)}${c.brand?"@"+esc(c.brand):""}</td><td>${esc(c.title.slice(0,60))}</td>
          <td><button class="btn small sec" data-ce="${i}">✏️</button> <button class="btn small danger" data-cd="${i}">🗑️</button></td></tr>`).join("")}
        </tbody></table>`:'<p class="muted">Aucune fiche personnalisée.</p>'}</div>
      <div class="card"><h3>Fiches standard modifiées (${ovs.length})</h3>
        ${ovs.length?ovs.map(k=>`<span class="tag b">${esc(k)}</span>`).join(""):'<p class="muted">Aucune surcharge.</p>'}</div>`;
      B.querySelectorAll("[data-ce]").forEach(b => b.onclick = () => App.openEditor(Store.customs()[+b.dataset.ce]));
      B.querySelectorAll("[data-cd]").forEach(b => b.onclick = () => { if (confirm("Supprimer ?")){ Store.removeCustom(+b.dataset.cd); App.adminTab("customs"); }});
    }
    if (t === "tiers"){
      const tiers = Auth.tiers();
      B.innerHTML = `<div class="card"><h3>Créer un accès tiers</h3>
        <div class="grid g2"><div><label>Nom / bénéficiaire</label><input id="t-name"></div>
        <div><label>Expiration (optionnel)</label><input id="t-exp" type="date"></div></div>
        <button class="btn" id="t-add" style="margin-top:.6rem">Générer le code</button>
        <div id="t-new"></div></div>
      <div class="card"><h3>Codes actifs (${tiers.length})</h3>
        <table><thead><tr><th>Code</th><th>Nom</th><th>Expire</th><th>Statut</th><th></th></tr></thead><tbody>
        ${tiers.map(x=>`<tr><td class="code">${esc(x.code)}</td><td>${esc(x.name)}</td>
          <td>${x.expires?esc(x.expires):"∞"}</td>
          <td>${x.active?'<span style="color:var(--ok)">actif</span>':'<span style="color:var(--err)">inactif</span>'}</td>
          <td><button class="btn small sec" data-tt="${esc(x.code)}">${x.active?"Désactiver":"Activer"}</button>
              <button class="btn small danger" data-td="${esc(x.code)}">🗑️</button></td></tr>`).join("")}
        </tbody></table></div>`;
      $("#t-add").onclick = () => {
        const code = Auth.addTier($("#t-name").value || "Accès tiers", $("#t-exp").value || null);
        $("#t-new").innerHTML = `<div class="ok-msg">Code créé : <b class="code">${code}</b> (transmettez-le au tiers)</div>`;
        setTimeout(() => App.adminTab("tiers"), 1500);
      };
      B.querySelectorAll("[data-tt]").forEach(b => b.onclick = () => { Auth.toggleTier(b.dataset.tt); App.adminTab("tiers"); });
      B.querySelectorAll("[data-td]").forEach(b => b.onclick = () => { if (confirm("Supprimer ce code ?")){ Auth.removeTier(b.dataset.td); App.adminTab("tiers"); }});
    }
    if (t === "audit"){
      const log = Store.read(CONFIG.K.audit, []);
      B.innerHTML = `<div class="card"><h3>Journal d'audit (${log.length})</h3>
        <table><thead><tr><th>Date</th><th>Utilisateur</th><th>Action</th><th>Détail</th></tr></thead><tbody>
        ${log.slice(0,200).map(l=>`<tr><td class="muted">${esc(l.d.replace("T"," ").slice(0,16))}</td><td>${esc(l.u)}</td><td>${esc(l.action)}</td><td class="muted">${esc(l.detail)}</td></tr>`).join("")}
        </tbody></table></div>`;
    }
    if (t === "secu"){
      B.innerHTML = `<div class="card" style="max-width:440px"><h3>Changer le mot de passe administrateur</h3>
        <label>Mot de passe actuel</label><input type="password" id="s-cur">
        <label>Nouveau mot de passe</label><input type="password" id="s-new">
        <label>Confirmation</label><input type="password" id="s-conf">
        <button class="btn" id="s-go" style="margin-top:.7rem">Changer</button>
        <div id="s-msg"></div></div>`;
      $("#s-go").onclick = async () => {
        if ($("#s-new").value !== $("#s-conf").value) return $("#s-msg").innerHTML = '<div class="err-msg">Confirmation différente.</div>';
        if ($("#s-new").value.length < 6) return $("#s-msg").innerHTML = '<div class="err-msg">6 caractères minimum.</div>';
        const ok = await Auth.changePassword($("#s-cur").value, $("#s-new").value);
        $("#s-msg").innerHTML = ok ? '<div class="ok-msg">Mot de passe modifié.</div>' : '<div class="err-msg">Mot de passe actuel incorrect.</div>';
      };
    }
  },

  bindAdmin(){
    $("#a-tab").onchange = e => App.adminTab(e.target.value);
    $("#a-new").onclick = () => App.openEditor(null);
    $("#a-export").onclick = () => {
      const data = {
        version: CONFIG.VERSION, exported: new Date().toISOString(),
        overrides: JSON.parse(localStorage.getItem(CONFIG.K.overrides) || "{}"),
        customs: Store.customs(), deleted: Store.read(CONFIG.K.deleted, []),
        tiers: Auth.tiers()
      };
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }));
      a.download = "dtcdiag-export-" + Date.now() + ".json";
      a.click();
      Store.audit("EXPORT", "export JSON");
    };
    $("#a-import").onchange = e => {
      const fr = new FileReader();
      fr.onload = () => {
        try{
          const d = JSON.parse(fr.result);
          if (d.overrides) localStorage.setItem(CONFIG.K.overrides, JSON.stringify(d.overrides));
          if (d.customs) localStorage.setItem(CONFIG.K.customs, JSON.stringify(d.customs));
          if (d.deleted) localStorage.setItem(CONFIG.K.deleted, JSON.stringify(d.deleted));
          if (d.tiers) localStorage.setItem(CONFIG.K.tiers, JSON.stringify(d.tiers));
          Store.audit("IMPORT", "import JSON");
          alert("Import réussi."); App.route();
        }catch(err){ alert("Fichier JSON invalide."); }
      };
      fr.readAsText(e.target.files[0]);
    };
    App.adminTab("customs");
  },

  bindView(){
    const v = App.state.view;
    if (v === "search") App.bindSearch();
    if (v === "codes") App.bindCodes();
    if (v === "veh") App.bindVeh();
    if (v === "admin") App.bindAdmin();
    if (v === "fiche") App.bindFiche(decodeURIComponent(location.hash.split("/")[2] || ""));
  }
};
const $$ = s => Array.from(document.querySelectorAll(s));
App.start();
