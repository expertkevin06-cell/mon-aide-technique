const AI_URL = "https://text.pollinations.ai/";

async function askAI(prompt) {
  const url = `AIURL{AI_URL}AIU​RL{encodeURIComponent(prompt)}?model=openai&system=` +
    encodeURIComponent("Tu es un expert en diagnostic automobile. Réponds en français, technique et concis. Donne les codes défauts OBD-II et constructeur quand tu les connais.");
  const res = await fetch(url);
  return res.text();
}

async function aiSearch(question) {
  return askAI(`Question automobile : ${question}. Causes probables, codes défauts associés, modèles concernés si défaut connu.`);
}

async function runAISearch() {
  const q = document.getElementById('ai-q').value;
  if (!q) return;
  const box = document.getElementById('ai-answer');
  box.classList.remove('hidden');
  box.textContent = '⏳ Analyse en cours...';
  box.textContent = await aiSearch(q);
}

async function enrichFiche(fiche) {
  const answer = await askAI(
    `Codes défauts valise (OBD-II + constructeur) pour : fiche.brand{fiche.brand}fiche.brand{fiche.model} fiche.year−{fiche.year} -fiche.year−{fiche.system} - ${(fiche.description || '').substring(0, 300)}`);
  fiche.dtcCode = answer.split("\n")[0].substring(0, 200);
  fiche.aiDetails = answer;
  db.transaction('recalls', 'readwrite').objectStore('recalls').put(fiche);
  return fiche;
}
