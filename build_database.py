import json, urllib.request

# Récupère les rappels automobile depuis RappelConso
url = "https://signal.conso.gouv.fr/api/v1/rappels - catégorie véhicules"
# ⚠️ À adapter selon le vrai format de l'API/fichier data.gouv.fr

fiches = []
try:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        data = json.loads(r.read().decode())
    # ... conversion au format {marque, modele, moteur, ...}
except Exception as e:
    print("Source indisponible:", e)

with open("data/recalls.json", "w", encoding="utf-8") as f:
    json.dump(fiches, f, ensure_ascii=False, indent=2)
print(f"✅ {len(fiches)} rappels écrits")
